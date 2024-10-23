import React, { useCallback, useEffect, useRef, useState } from 'react'

import { addToAniList, getAniListIds, getUserMediaListIDs } from '../../api/animeApi'
import ProgressBar from '../../components/common/ProgressBar'
import UploadInput from '../../components/common/form/upload-input'
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
    const [invalidStatus, setInvalidStatus] = useState(null)
    const [correctingStatus, setCorrectingStatus] = useState('')
    const correctedStatusRef = useRef([])
    const abortControllerRef = useRef(null)

    const [progressData, setProgressData] = useState({
        currentMedia: '',
        inProgress: false,
        totalToProcess: 0,
        currentProcessed: 0,
    })

    // Reset all state
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
        setInvalidStatus(null)
        setCorrectingStatus('')
        correctedStatusRef.current = []
    }

    // Cancel ongoing import and reset
    const handleCancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        resetState()
    }, [])

    // Parse the uploaded file
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

    // Correct invalid status using user input or fallback
    const correctStatus = (status) => {
        const userCorrection = correctedStatusRef.current.find((entry) => entry.invalid === status)
        const cleanedStatus = status.trim().toUpperCase()

        if (userCorrection) return userCorrection.correct

        const bestMatch = validStatus.find((valid) => valid.includes(cleanedStatus) || cleanedStatus.includes(valid))
        return bestMatch || null
    }

    // Handle invalid status case
    const handleInvalidStatus = useCallback((status, mediaName) => {
        setInvalidStatus({ status, mediaName })
        setProgressData((prev) => ({ ...prev, inProgress: false }))
        setCorrectingStatus('')
    }, [])

    // Handle user correcting invalid status
    const handleStatusCorrection = () => {
        if (invalidStatus && correctingStatus) {
            const newCorrection = { correct: correctingStatus, invalid: invalidStatus.status }
            correctedStatusRef.current = [...correctedStatusRef.current, newCorrection]
            setCorrectingStatus('')
            setInvalidStatus(null)
            processMediaList() // Resume processing
        }
    }

    // Main logic to process the media list
    const processMediaList = useCallback(
        async (listToProcess = null) => {
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

            // Step 1: Collect MAL IDs
            const malIdMap = {}
            for (const [status, mediaArray] of Object.entries(mediaList)) {
                const resolvedStatus = correctStatus(status)
                if (!resolvedStatus) {
                    handleInvalidStatus(status, mediaArray[0]?.name)
                    return
                }

                mediaArray.forEach((media) => {
                    const malId = extractMalId(media.link, mediaType)
                    if (malId) {
                        malIdMap[malId] = { name: media.name, status: resolvedStatus }
                    } else {
                        failedList.push({ name: media.name, status: 'Invalid MAL ID' })
                    }
                })
            }

            let malIds = Object.keys(malIdMap)

            // Step 2: Fetch user's media list and filter out existing entries
            try {
                const result = await getUserMediaListIDs(accessToken, mediaType)

                if (result.success) {
                    const userMediaList = result.mediaListIDs
                    const userMalIds = []

                    userMediaList.lists.forEach((list) => {
                        list.entries.forEach((entry) => {
                            userMalIds.push({ idMal: entry.media.idMal, status: list.name })
                        })
                    })

                    malIds = malIds.filter((malId) => {
                        return !userMalIds.some((userMalId) =>
                            parseInt(malId) === parseInt(userMalId.idMal) && malIdMap[malId].status.toUpperCase() === 'CURRENT'
                                ? 'WATCHING' === userMalId.status.toUpperCase()
                                : malIdMap[malId].status.toUpperCase() === userMalId.status.toUpperCase()
                        )
                    })
                } else if (result.retryAfter > 0) {
                    window.addToast(`Rate limit exceeded. Try again after ${result.retryAfter} seconds.`, 'error')
                    handleCancel()
                    return
                } else {
                    window.addToast(result.message, 'error')
                    return
                }
            } catch (error) {
                window.addToast('Error fetching media list.', 'error')
                return
            }

            if (malIds.length === 0) {
                window.addToast('No new entries to import.', 'error')

                handleCancel()

                if (failedList.length > 0) {
                    setFailedImports(failedList)
                }
            }

            const malIdBatches = chunkArray(malIds, 50)
            let aniListIdMap = []

            try {
                for (const batch of malIdBatches) {
                    setProgressData((prev) => ({ ...prev, currentMedia: 'Fetching AniList IDs' }))

                    const result = await getAniListIds(batch, mediaType, abortControllerRef.current.signal)

                    if (result.success) {
                        aniListIdMap.push(result.aniListIds)
                    } else if (result.retryAfter > 0) {
                        window.addToast(`Rate limit exceeded. Try again after ${result.retryAfter} seconds.`, 'error')
                        handleCancel()
                        return
                    } else {
                        window.addToast('Error fetching AniList IDs.', 'error')
                        return
                    }
                }
            } catch (error) {
                if (abortControllerRef.current.signal.aborted) {
                    window.addToast('Import process was cancelled.', 'error')
                    return
                }
            }

            aniListIdMap = aniListIdMap.reduce((acc, val) => ({ ...acc, ...val }), {})
            const totalToProcess = Object.keys(aniListIdMap).length
            setProgressData((prev) => ({ ...prev, totalToProcess }))

            // Step 3: Process each media entry and handle rate limits
            let remainingRateLimit = 100
            let retryAfterSeconds = 0
            const mediaBatches = chunkArray(malIds, 25)

            for (const batch of mediaBatches) {
                for (const malId of batch) {
                    if (abortControllerRef.current.signal.aborted) {
                        window.addToast('Import process was cancelled.', 'error')
                        return
                    }

                    const mediaData = malIdMap[malId]
                    const aniListId = aniListIdMap[malId]

                    // Handle rate limits
                    if (remainingRateLimit <= 60 || retryAfterSeconds > 0) {
                        await new Promise((resolve) => setTimeout(resolve, (retryAfterSeconds || 60) * 1000))
                    }

                    if (aniListId) {
                        try {
                            setProgressData((prev) => ({
                                ...prev,
                                currentMedia: mediaData.name,
                            }))

                            const result = await addToAniList(accessToken, aniListId, mediaData.status, abortControllerRef.current.signal)

                            // console.log(`rateRemaining: ${result.rateRemaining}, retryAfter: ${result.retryAfter}`)

                            // Update rate limit and retryAfter values
                            if (result.rateRemaining !== undefined && result.retryAfter !== undefined) {
                                remainingRateLimit = result.rateRemaining
                                retryAfterSeconds = result.retryAfter
                            }

                            if (result.success) {
                                importList.push({ name: mediaData.name, statusText: 'Success' })
                            } else {
                                failedList.push({
                                    name: mediaData.name,
                                    status: mediaData.status,
                                    statusText: 'Failed',
                                    malId,
                                    aniListId,
                                })
                            }
                        } catch (error) {
                            failedList.push({
                                name: mediaData.name,
                                status: mediaData.status,
                                statusText: 'Error while importing',
                                malId,
                                aniListId,
                            })
                        }
                    } else {
                        failedList.push({
                            name: mediaData.name,
                            statusText: 'AniList ID not found',
                            malId,
                        })
                    }

                    // Update progress after processing each media item
                    setProgressData((prev) => ({
                        ...prev,
                        currentProcessed: prev.currentProcessed + 1,
                    }))
                }

                // Update progress after processing each batch
                setImportProgress(importList)
            }

            setImportProgress(importList)
            setFailedImports(failedList)
            setProgressData((prev) => ({ ...prev, inProgress: false }))
        },
        [jsonData, mediaType, handleInvalidStatus]
    )

    // Retry logic for failed imports
    const retryFailedImports = () => {
        const failedList = failedImports.map((item) => {
            return item.aniListId ? { ...item, statusText: 'Retrying...' } : item
        })
        setFailedImports(failedList)
        processMediaList(failedList)
    }

    return (
        <div className="bg-primary container mx-auto grid place-items-center rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            <h2 className="text-primary text-center font-aladin text-2xl font-semibold tracking-widest">Import Media</h2>
            <p className="text-secondary text-center font-indie-flower tracking-wide">Import your anime or manga list from a JSON file to AniList</p>

            {progressData.inProgress ? (
                <div className="mt-5 grid w-full place-items-center gap-5">
                    <ProgressBar total={progressData.totalToProcess} current={progressData.currentProcessed} name={progressData.currentMedia} />
                    <button
                        className="neu-btn neu-icon-btn text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-700"
                        onClick={handleCancel}>
                        Cancel
                    </button>
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

            {/* Invalid Status Correction */}
            {invalidStatus && (
                <div className="mt-5">
                    <p className="text-red-500">
                        Invalid Status Found: {invalidStatus.status} for {invalidStatus.mediaName}
                    </p>
                    <div className="mt-3 flex gap-2">
                        <select className="neu-form-select" value={correctingStatus} onChange={(e) => setCorrectingStatus(e.target.value)}>
                            <option value="">Select a valid status</option>
                            {validStatus.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <button className="neu-btn" onClick={handleStatusCorrection}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* Progress Tables */}
            <div className="flex-center mt-5 flex-col gap-6 sm:flex-row">
                {/* Successful Imports */}
                {importProgress.length > 0 && (
                    <div className="bg-primary w-full max-w-2xl rounded-2xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
                        <header className="border-b border-light-secondary px-4 py-3 dark:border-dark-secondary">
                            <h2 className="text-primary font-aladin text-xl font-semibold tracking-widest">Successful Imports</h2>
                        </header>
                        <div className="p-3">
                            <div className="scrollbar-thin h-80 overflow-y-scroll">
                                <table className="w-full table-auto">
                                    <thead className="text-secondary text-left font-indie-flower tracking-wide">
                                        <tr>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Item</th>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-primary font-indie-flower text-sm tracking-wide">
                                        {importProgress.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-light-secondary transition-all duration-300 ease-in-out first:rounded-t-lg last:rounded-b-lg hover:border-transparent hover:shadow-neu-light-md dark:border-dark-secondary dark:hover:border-transparent dark:hover:shadow-neu-dark-sm">
                                                <td className="px-5 py-3">{item.name}</td>
                                                <td className="px-5 py-3 text-green-500">{item.statusText}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Failed Imports */}
                {failedImports.length > 0 && (
                    <div className="bg-primary w-full max-w-2xl rounded-2xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
                        <header className="border-b border-light-secondary px-4 py-3 dark:border-dark-secondary">
                            <h2 className="text-primary font-aladin text-xl font-semibold tracking-widest">Failed Imports</h2>
                        </header>
                        <div className="p-3">
                            <div className="scrollbar-thin h-80 overflow-y-scroll">
                                <table className="w-full table-auto">
                                    <thead className="text-secondary text-left font-indie-flower tracking-wide">
                                        <tr>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Item</th>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-primary font-indie-flower text-sm tracking-wide">
                                        {failedImports.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-light-secondary transition-all duration-300 ease-in-out first:rounded-t-lg last:rounded-b-lg hover:border-transparent hover:shadow-neu-light-md dark:border-dark-secondary dark:hover:border-transparent dark:hover:shadow-neu-dark-sm">
                                                <td className="px-5 py-3">{item.name}</td>
                                                <td className="px-5 py-3 text-red-500">{item.statusText}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button className="neu-btn mt-2 w-full" onClick={retryFailedImports}>
                                    Retry Failed Imports
                                </button>
                                {/* <button className="neu-btn mt-2 w-full" onClick={exportFailedImports}>
                                    Export Failed Imports
                                </button> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImportAnime
