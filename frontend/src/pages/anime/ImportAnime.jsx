import React, { useCallback, useEffect, useRef, useState } from 'react'

import { addToAniList, getAniListIds, getUserMediaListIDs } from '../../api/animeApi'
import ProgressBar from '../../components/common/ProgressBar'
import UploadInput from '../../components/common/form/upload-input'
import StatusTable from './components/statusTable'
import { validStatus } from './constants'

// Extract MAL ID from link
const extractMalId = (link, mediaType) => {
    const regex = mediaType === 'ANIME' ? /anime\/(\d+)/ : /manga\/(\d+)/
    const match = link.match(regex)
    return match ? match[1] : null
}

// Split an array into chunks
const chunkArray = (array, chunkSize) => {
    return array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
}

const ImportAnime = () => {
    const [file, setFile] = useState(null)
    const [jsonData, setJsonData] = useState(null)
    const [mediaType, setMediaType] = useState('ANIME')
    const [importProgress, setImportProgress] = useState([])
    const [failedImports, setFailedImports] = useState([])
    const [correctingStatus, setCorrectingStatus] = useState(false)
    const correctedStatusRef = useRef([])
    const abortControllerRef = useRef(null)
    const [render, setRender] = useState(false)

    const [progressData, setProgressData] = useState({
        currentMedia: '',
        inProgress: false,
        totalToProcess: 0,
        currentProcessed: 0,
    })

    // Reset all states
    const resetState = () => {
        setProgressData({
            currentMedia: '',
            inProgress: false,
            totalToProcess: 0,
            currentProcessed: 0,
        })
        setImportProgress([])
        setJsonData(null)
        setFailedImports([])
        setFile(null)
        setCorrectingStatus(false)
        correctedStatusRef.current = []
    }

    // Cancel ongoing import and reset
    const handleCancel = useCallback(() => {
        if (abortControllerRef.current) abortControllerRef.current.abort()
        resetState()
    }, [])

    // Parse uploaded file and update state
    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                try {
                    const parsedData = JSON.parse(reader.result)
                    setJsonData(parsedData)
                } catch (error) {
                    window.addToast('Error parsing JSON file.', 'error')
                }
            }
            reader.readAsText(file)
        } else {
            resetState()
        }
    }, [file])

    // Handle component unmount (cleanup)
    // useEffect(() => {
    //     return () => {
    //         if (abortControllerRef.current) abortControllerRef.current.abort()
    //     }
    // }, [])

    const handleStatusCorrection = (index, correctedStatus) => {
        correctedStatusRef.current[index] = { ...correctedStatusRef.current[index], corrected: correctedStatus }
        setRender((prev) => !prev) // Trigger re-render

        // Auto-process if all statuses are corrected
        if (correctedStatusRef.current.every((item) => item.corrected !== '')) {
            setCorrectingStatus(false)
            processMediaList()
        }
    }

    const processMediaArray = (mediaList, mediaType, failedList) => {
        const malIdMap = {}
        const mediaStatus = Object.keys(mediaList)
        const invalidStatus = [...new Set(mediaStatus.filter((status) => !validStatus.includes(status.toUpperCase())))]

        if (invalidStatus.length > 0) {
            if (correctedStatusRef.current.length === 0) {
                invalidStatus.forEach((status) => {
                    correctedStatusRef.current.push({ status, corrected: '' })
                })
                setCorrectingStatus(true)
                return -1
            }

            correctedStatusRef.current.forEach((item) => {
                if (item.corrected === '') {
                    setCorrectingStatus(true)
                    return -1
                }
            })
        }

        Object.entries(mediaList).forEach(([status, mediaArray]) => {
            let correctStatus = status.toUpperCase()
            if (!validStatus.includes(correctStatus)) {
                correctStatus = correctedStatusRef.current.find((item) => item.status === status)?.corrected
            }
            if (!correctStatus) return

            mediaArray.forEach((media) => {
                const malId = extractMalId(media.link, mediaType)
                if (malId) {
                    malIdMap[malId] = { name: media.name, status: correctStatus }
                } else {
                    failedList.push({ name: media.name, status: 'Invalid MAL ID' })
                }
            })
        })

        return malIdMap
    }

    const filterExistingMalIds = (malIdMap, userMediaList) => {
        const userMalIds = userMediaList.lists.flatMap((list) =>
            list.entries.map((entry) => ({
                idMal: entry.media.idMal,
                status: list.name.toUpperCase(),
            }))
        )

        return Object.keys(malIdMap).filter((malId) => {
            const malData = malIdMap[malId]
            return !userMalIds.some(
                (userMal) =>
                    parseInt(malId) === parseInt(userMal.idMal) &&
                    (malData.status.toUpperCase() === 'CURRENT' ? 'WATCHING' === userMal.status : malData.status.toUpperCase() === userMal.status)
            )
        })
    }

    const fetchAniListIdsInBatches = async (malIds, mediaType) => {
        const malIdBatches = chunkArray(malIds, 50)
        let aniListIdMap = []

        try {
            for (const batch of malIdBatches) {
                setProgressData((prev) => ({ ...prev, currentMedia: 'Fetching AniList IDs' }))
                const result = await getAniListIds(batch, mediaType, abortControllerRef.current.signal)

                if (result.success) {
                    aniListIdMap.push(result.aniListIds)
                } else {
                    handleError(result)
                    return null
                }
            }
        } catch (error) {
            if (abortControllerRef.current.signal.aborted) {
                window.addToast('Import process was cancelled.', 'error')
            }
            return null
        }

        return aniListIdMap.reduce((acc, val) => ({ ...acc, ...val }), {})
    }

    const processMediaInBatches = async (malIds, malIdMap, aniListIdMap, accessToken, importList, failedList) => {
        const mediaBatches = chunkArray(malIds, 25)
        let remainingRateLimit = 100
        let retryAfterSeconds = 0

        for (const batch of mediaBatches) {
            for (const malId of batch) {
                if (abortControllerRef.current.signal.aborted) {
                    window.addToast('Import process was cancelled.', 'error')
                    return
                }

                const mediaData = malIdMap[malId]
                const aniListId = aniListIdMap[malId]

                await handleRateLimits(remainingRateLimit, retryAfterSeconds)

                if (aniListId) {
                    try {
                        setProgressData((prev) => ({ ...prev, currentMedia: mediaData.name }))

                        const result = await addToAniList(accessToken, aniListId, mediaData.status, abortControllerRef.current.signal)

                        // Use default values if remainingRateLimit or retryAfterSeconds is not provided
                        ;({ remainingRateLimit = remainingRateLimit, retryAfterSeconds = retryAfterSeconds } = result)

                        if (result.success) {
                            importList.push({ name: mediaData.name, statusText: 'Success' })
                        } else {
                            failedList.push({ ...mediaData, malId, aniListId, statusText: 'Failed' })
                        }
                    } catch (error) {
                        failedList.push({ ...mediaData, malId, aniListId, statusText: 'Error while importing' })
                    }
                } else {
                    failedList.push({ ...mediaData, malId, statusText: 'AniList ID not found' })
                }

                setProgressData((prev) => ({ ...prev, currentProcessed: prev.currentProcessed + 1 }))
            }
        }
    }

    const handleError = (result) => {
        if (result.retryAfterSeconds > 0) {
            window.addToast(`Rate limit exceeded. Try again after ${result.retryAfterSeconds} seconds.`, 'error')
            handleCancel()
        } else {
            window.addToast(result.message, 'error')
        }
    }

    const handleCompletion = (failedList, importList = []) => {
        if (abortControllerRef.current) abortControllerRef.current.abort()
        setImportProgress(importList)
        setFailedImports(failedList)
        setProgressData((prev) => ({ ...prev, inProgress: false }))
    }

    const handleRateLimits = async (remainingRateLimit, retryAfterSeconds) => {
        if (remainingRateLimit <= 60 || retryAfterSeconds > 0) {
            await new Promise((resolve) => setTimeout(resolve, (retryAfterSeconds || 60) * 1000))
        }
    }

    // Main logic to process the media list
    const processMediaList = useCallback(
        async (listToProcess = null, retryFailed = false) => {
            const mediaList = listToProcess || jsonData
            const failedList = []
            const importList = []

            if (!mediaList) {
                window.addToast('No JSON file uploaded.', 'error')
                return
            }

            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                window.addToast('Access token not found. Please log in.', 'error')
                return
            }

            abortControllerRef.current = new AbortController()
            setProgressData({ currentMedia: '', inProgress: true, totalToProcess: 0, currentProcessed: 0 })

            // Step 1: Process media list and extract MAL IDs
            const malIdMap = retryFailed
                ? Object.fromEntries(mediaList.map((media) => [media.malId, { name: media.name, status: media.status }]))
                : processMediaArray(mediaList, mediaType, failedList)

            if (malIdMap === -1) {
                window.addToast('Invalid statuses found in the list.', 'error')
                handleCompletion(failedList)
                return
            }

            if (Object.keys(malIdMap).length === 0) {
                window.addToast('MAL IDs not found from the list.', 'error')
                handleCompletion(failedList)
                return
            }

            // Step 2: Fetch user's media list and filter out existing entries
            let malIds = Object.keys(malIdMap)
            try {
                const result = await getUserMediaListIDs(accessToken, mediaType)

                if (result.success) {
                    malIds = filterExistingMalIds(malIdMap, result.mediaListIDs)
                } else {
                    handleError(result)
                    return
                }
            } catch (error) {
                handleError({ message: 'Error fetching media list.' })
                return
            }

            if (malIds.length === 0) {
                window.addToast('No media to import. All media is already in your list.', 'info')
                handleCompletion(failedList)
                return
            }

            // Step 3: Fetch AniList IDs
            setProgressData((prev) => ({ ...prev, totalToProcess: malIds.length }))

            const aniListIdMap = await fetchAniListIdsInBatches(malIds, mediaType)

            if (!aniListIdMap) {
                handleCompletion(failedList)
                return
            }

            // Step 4: Import media in batches with rate limit handling
            await processMediaInBatches(malIds, malIdMap, aniListIdMap, accessToken, importList, failedList)
            handleCompletion(failedList, importList)
            window.addToast('Import process completed.', 'success')
        },
        [jsonData, mediaType, correctingStatus]
    )

    return (
        <div className="bg-primary container mx-auto grid place-items-center rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            {progressData.inProgress ? (
                <>
                    <h2 className="text-primary text-center font-aladin text-2xl font-semibold tracking-widest">Import Media</h2>
                    <p className="text-secondary text-center font-indie-flower tracking-wide">
                        Import your anime or manga list from a JSON file to AniList
                    </p>
                    <div className="mt-5 grid w-full place-items-center gap-5">
                        <ProgressBar total={progressData.totalToProcess} current={progressData.currentProcessed} name={progressData.currentMedia} />
                        <button
                            className="neu-btn neu-icon-btn text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-700"
                            onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </>
            ) : correctingStatus ? (
                <div className="bg-primary my-3 w-full max-w-lg rounded-lg border border-light-secondary p-6 shadow-neu-light-lg dark:border-dark-secondary dark:shadow-neu-dark-lg">
                    <h2 className="text-primary mb-6 font-aladin text-2xl font-semibold tracking-widest">Correct Invalid Statuses</h2>

                    <div className="space-y-4">
                        {correctedStatusRef.current.map((item, index) => (
                            <div
                                key={index}
                                className="bg-primary neu-form-group rounded-md border border-light-secondary p-4 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
                                <label className="neu-form-label">
                                    Invalid Status: <span className="error font-bold">{item.status}</span>
                                </label>
                                <select
                                    className="neu-form-select"
                                    value={item.corrected}
                                    onChange={(e) => handleStatusCorrection(index, e.target.value)}>
                                    <option value="">Select valid status</option>
                                    {validStatus.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-10 grid w-fit place-items-center gap-5 md:grid-cols-2">
                    {/* Upload Input */}
                    <UploadInput id="Upload_input" file={file} setFile={setFile} />

                    {/* Radio Buttons for Media Type */}
                    <div className="neu-form-group-radio">
                        <label className="neu-form-radio-label">
                            <input
                                className="neu-form-radio"
                                type="radio"
                                name="mediaType"
                                value="ANIME"
                                checked={mediaType === 'ANIME'}
                                onChange={(e) => setMediaType(e.target.value)}
                            />
                            <div className="neu-form-radio-indicator"></div>
                            <span className="neu-form-radio-text">Anime</span>
                        </label>
                        <label className="neu-form-radio-label">
                            <input
                                className="neu-form-radio"
                                type="radio"
                                name="mediaType"
                                value="MANGA"
                                checked={mediaType === 'MANGA'}
                                onChange={(e) => setMediaType(e.target.value)}
                            />
                            <div className="neu-form-radio-indicator"></div>
                            <span className="neu-form-radio-text">Manga</span>
                        </label>
                    </div>

                    {/* Import Button */}
                    <button onClick={() => processMediaList(jsonData)} className="neu-btn w-full md:col-span-2">
                        Import {mediaType}
                    </button>
                </div>
            )}

            {/* Progress Tables */}
            <div className="mt-5 flex w-full flex-col items-start justify-center gap-6 sm:flex-row">
                {/* Successful Imports */}
                {importProgress.length > 0 && <StatusTable data={importProgress} title="Successful Imports" />}

                {/* Failed Imports */}
                {failedImports.length > 0 && (
                    <div className="w-full max-w-2xl">
                        <StatusTable data={failedImports} title="Failed Imports" failed />
                        <button className="neu-btn mt-5 w-full" onClick={() => processMediaList(failedImports, true)}>
                            Retry Failed Imports
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImportAnime
