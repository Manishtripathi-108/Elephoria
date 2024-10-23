import React, { useCallback, useEffect, useRef, useState } from 'react'

import { addToAniList, getAniListIds } from '../../api/animeApi'
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
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
}

const ImportAnime = () => {
    const [file, setFile] = useState(null)
    const [jsonData, setJsonData] = useState(null)
    const [mediaType, setMediaType] = useState('ANIME')
    const [importProgress, setImportProgress] = useState([])

    const [failedImports, setFailedImports] = useState([])
    const [invalidStatus, setInvalidStatus] = useState(null) // Invalid status encountered
    const [correctingStatus, setCorrectingStatus] = useState('') // User-provided corrected status
    const correctedStatus = useRef([])
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
        correctedStatus.current = []
    }

    // Handle cancellation of import process
    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        resetState()
    }

    // Parse JSON file when uploaded
    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result)
                    setJsonData(data)
                } catch (error) {
                    window.addToast('Error parsing JSON file.', 'error', 3000)
                }
            }
            reader.readAsText(file)
        } else {
            resetState()
        }
    }, [file])

    // Helper function to correct media statuses based on user input or valid status list
    const correctStatus = (status) => {
        const userCorrectedStatus = correctedStatus.current.find((entry) => entry.invalid === status)
        const cleanStatus = status.trim().toUpperCase()

        // Check if the user has provided a correction for this status
        if (userCorrectedStatus) return userCorrectedStatus.correct

        // Fallback to the validStatus list
        const bestMatch = validStatus.find((valid) => valid.includes(cleanStatus) || cleanStatus.includes(valid))
        return bestMatch || null
    }

    // Handle invalid status encountered during processing
    const handleInvalidStatus = (status, mediaName) => {
        setInvalidStatus({ status, mediaName })
        setProgressData({ currentMedia: '', inProgress: false, totalToProcess: 0, currentProcessed: 0 })
        setCorrectingStatus('')
    }

    // Handle user-confirmed status correction
    const handleStatusCorrection = () => {
        if (invalidStatus && correctingStatus) {
            const newCorrection = { correct: correctingStatus, invalid: invalidStatus.status }
            correctedStatus.current = [...correctedStatus.current, newCorrection]
            setCorrectingStatus('')
            setInvalidStatus(null) // Clear the invalid status
            processMediaList() // Resume processing
        }
    }

    // Function to process the media list (Main Import Logic)
    const processMediaList = useCallback(
        async (listToProcess = null) => {
            const list = listToProcess || jsonData
            const failedList = []
            const importList = []

            if (!list) {
                window.addToast('No JSON file uploaded.', 'error', 3000)
                return
            }

            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                window.addToast('Access token not found. Please log in.', 'error', 3000)
                return
            }

            abortControllerRef.current = new AbortController()

            setProgressData({ currentMedia: '', inProgress: true, totalToProcess: 0, currentProcessed: 0 })

            // Step 1: Collect MAL IDs
            const malIdMap = {}
            for (const [status, mediaArray] of Object.entries(list)) {
                console.log('status', status)

                const resolvedStatus = correctStatus(status)
                if (!resolvedStatus) {
                    handleInvalidStatus(status, mediaArray[0]?.name) // Ask user to correct invalid status
                    return // Pause the process for correction
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

            // Step 2: Fetch AniList IDs in bulk
            const malIds = Object.keys(malIdMap)
            if (malIds.length === 0) {
                window.addToast('No valid MAL IDs found.', 'error', 3000)
                return
            }

            const malIdBatches = chunkArray(malIds, 50)
            let aniListIdMap = []

            try {
                for (const batch of malIdBatches) {
                    const result = await getAniListIds(batch, mediaType, abortControllerRef.current.signal)

                    if (abortControllerRef.current.signal.aborted) {
                        window.addToast('Import process was cancelled.', 'error')
                        return
                    }

                    if (result.aniListIds) {
                        aniListIdMap.push(result.aniListIds)
                    } else if (result.retryAfter) {
                        window.addToast(`Rate limit exceeded. Try again after ${result.retryAfter} seconds.`, 'error')
                        return
                    }
                }
            } catch (err) {
                if (abortControllerRef.current.signal.aborted) {
                    window.addToast('Import process was cancelled.', 'error', 3000)
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
                        window.addToast('Import process was cancelled.', 'error', 3000)
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

                            console.log(`rateRemaining: ${result.rateRemaining}, retryAfter: ${result.retryAfter}`)

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
        [jsonData, mediaType]
    )

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            handleCancel()
        }
    }, [])

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
                            <div className="scrollbar-thin">
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
                                <button className="neu-btn mt-2 w-full" onClick={exportFailedImports}>
                                    Export Failed Imports
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImportAnime
