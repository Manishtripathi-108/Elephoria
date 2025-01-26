import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios'

import { fetchAniListIds, fetchUserMediaListIDs, saveMediaEntry } from '../../api/anilistApi'
import ProgressBar from '../../components/common/ProgressBar'
import UploadInput from '../../components/common/form/UploadInput'
import CorrectInvalidStatuses from './components/CorrectInvalidStatuses'
import StatusTable from './components/StatusTable'
import { validStatusOptions } from './utils/constants'
import { chunkArray, filterExistingMalIds, handleError, handleRateLimits, isValidFormat, validateAndMapMedia } from './utils/importAnimeUtils'

const ImportMedia = () => {
    const [file, setFile] = useState(null)
    const [mediaType, setMediaType] = useState('ANIME')
    const [jsonContent, setJsonContent] = useState(null)
    const [correctedStatus, setCorrectedStatus] = useState([])
    const [importResults, setImportResults] = useState({
        success: [],
        failed: [],
    })
    const [importState, setImportState] = useState({
        importStatus: 'IDLE',
        totalItems: 0,
        itemsProcessed: 0,
        currentItem: '',
    })

    // Create a cancel token source reference
    const cancelTokenSourceRef = useRef()

    // Initialize or reset the cancel token
    const initializeCancelToken = () => {
        cancelTokenSourceRef.current = axios.CancelToken.source()
    }

    // Reset the import process
    const resetImport = (keepResults = false) => {
        setFile(null)
        setMediaType('ANIME')
        setJsonContent(null)
        setCorrectedStatus([])
        setImportState({
            importStatus: 'IDLE',
            totalItems: 0,
            itemsProcessed: 0,
            currentItem: '',
        })
        if (!keepResults) {
            setImportResults({
                success: [],
                failed: [],
            })
        }
    }

    // Initialize the cancel token on component mount
    useEffect(() => {
        initializeCancelToken()
        return () => {
            cancelImport()
        }
    }, [])

    // Cancel the import process
    const cancelImport = () => {
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel('Import process canceled by user.')
            resetImport(true)
            window.addToast('Import canceled.', 'info')
        }
    }

    // Start importing the file
    const startImport = () => {
        if (file) {
            resetImport()
            initializeCancelToken()

            const reader = new FileReader()
            reader.onload = async (e) => {
                const content = e.target.result
                try {
                    const jsonData = JSON.parse(content)
                    if (isValidFormat(jsonData)) {
                        setJsonContent(jsonData)
                        await importMediaList(jsonData)
                    } else {
                        window.addToast('Invalid JSON file uploaded.', 'error')
                    }
                } catch (error) {
                    window.addToast('Failed to parse JSON file.', 'error')
                }
            }
            reader.readAsText(file)
        } else {
            window.addToast('Please select a file to import', 'error')
        }
    }

    // Fetch AniList IDs for a batch of MAL IDs
    const fetchAniListIdsInBatches = async (malIds, mediaType) => {
        const malIdBatches = chunkArray(malIds, 50)
        let aniListIdMap = []

        for (const batch of malIdBatches) {
            const result = await fetchAniListIds(batch, mediaType, cancelTokenSourceRef.current.signal)

            if (result.success) {
                aniListIdMap.push(result.aniListIds)
            } else {
                handleError(result)
                return null
            }
        }

        return aniListIdMap.reduce((acc, val) => ({ ...acc, ...val }), {})
    }

    // Save media entries to AniList in batches
    const saveToAnilist = async (malIds, malIdMap, aniListIdMap) => {
        let { success, failed } = importResults
        const mediaBatches = chunkArray(malIds, 25)
        let remainingRateLimit = 100
        let retryAfterSeconds = 0

        setImportState((prev) => ({
            ...prev,
            importStatus: 'IN_PROGRESS',
            totalItems: malIds.length,
            itemsProcessed: 0,
        }))

        for (const batch of mediaBatches) {
            for (const malId of batch) {
                const mediaData = malIdMap[malId]
                const aniListId = aniListIdMap[malId]

                await handleRateLimits(remainingRateLimit, retryAfterSeconds)

                if (aniListId) {
                    setImportState((prev) => ({
                        ...prev,
                        currentItem: mediaData.name,
                    }))

                    const result = await saveMediaEntry(aniListId, mediaData.status, 0, cancelTokenSourceRef.current.token)

                    // Use default values if remainingRateLimit or retryAfterSeconds is not provided
                    ;({ remainingRateLimit = remainingRateLimit, retryAfterSeconds = retryAfterSeconds } = result)

                    if (result.success) {
                        success.push({
                            name: mediaData.name,
                            statusText: 'Success',
                        })
                    } else {
                        failed.push({
                            ...mediaData,
                            malId,
                            aniListId,
                            statusText: 'Failed',
                        })
                    }
                } else {
                    failed.push({
                        ...mediaData,
                        malId,
                        statusText: 'AniList ID not found',
                    })
                }

                setImportState((prev) => ({
                    ...prev,
                    itemsProcessed: prev.itemsProcessed + 1,
                }))
            }
            setImportResults({ success, failed })
        }
    }

    // Import media list
    const importMediaList = async (mediaList, retryFailed = false) => {
        setImportState({
            importStatus: 'IN_PROGRESS',
            totalItems: mediaList.length,
            itemsProcessed: 0,
            currentItem: 'Starting...',
        })

        // Step 1: Process media list and extract MAL IDs
        const result = retryFailed
            ? Object.fromEntries(mediaList.map((media) => [media.malId, { name: media.name, status: media.status }]))
            : validateAndMapMedia(mediaList, mediaType, importResults.failed, correctedStatus, validStatusOptions)

        if (result.error) {
            window.addToast('Please correct the invalid statuses before importing.', 'error')
            setCorrectedStatus(result.uncorrectedStatus)
            setImportState((prev) => ({ ...prev, importStatus: 'CORRECT_STATUS' }))
            return
        }

        const malIdMap = result.malIdMap
        setImportResults((prev) => ({ ...prev, failed: result.failed }))

        // if MAL IDs are not found, cancel the import
        if (Object.keys(malIdMap).length === 0) {
            window.addToast('MAL IDs not found from the list.', 'error')
            cancelImport()
            return
        }

        // Step 2: Fetch user's media list and filter out existing entries
        setImportState((prev) => ({ ...prev, currentItem: `Fetching AniList IDs for ${Object.keys(malIdMap).length} media...` }))
        let malIds = Object.keys(malIdMap)
        const response = await fetchUserMediaListIDs(mediaType, cancelTokenSourceRef.current.token)

        if (response.success) {
            setImportState((prev) => ({ ...prev, currentItem: 'Filtering existing media entries...' }))
            malIds = filterExistingMalIds(malIdMap, response.mediaListIDs)
        } else {
            handleError(response)
            resetImport(true)
            return
        }

        if (malIds.length === 0) {
            window.addToast('No media to import. All media is already in your list.', 'info')
            cancelImport()
            return
        }

        // Step 3: Fetch AniList IDs for MAL IDs
        setImportState((prev) => ({ ...prev, currentItem: `Fetching AniList IDs for ${malIds.length} media...` }))

        const aniListIdMap = await fetchAniListIdsInBatches(malIds, mediaType)

        if (Object.keys(aniListIdMap).length === 0) {
            window.addToast('Failed to fetch AniList IDs.', 'error')
            const failedList = importResults.failed || []
            malIds.forEach((malId) => {
                failedList.push({
                    ...malIdMap[malId],
                    malId,
                    statusText: 'AniList ID not found',
                })
            })
            setImportResults((prev) => ({ ...prev, failed: failedList }))

            cancelImport()
            return
        }

        // Step 4: Import media in batches with rate limit handling
        await saveToAnilist(malIds, malIdMap, aniListIdMap)

        setFile(null)
        setJsonContent(null)
        setCorrectedStatus([])
        setImportState({
            importStatus: 'IDLE',
            totalItems: 0,
            itemsProcessed: 0,
            currentItem: '',
        })
        window.addToast('Import process completed.', 'success')
    }

    return (
        <div className="bg-primary shadow-neumorphic-inset-sm container mx-auto grid place-items-center rounded-lg border p-3 md:p-5">
            {importState.importStatus === 'IDLE' && (
                <div className="mt-10 grid w-fit place-items-center gap-5 md:grid-cols-2">
                    {/* Upload Input */}
                    <UploadInput id="Upload_input" file={file} setFile={setFile} />

                    {/* Radio Buttons for Media Type */}
                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                className="radio-input"
                                type="radio"
                                name="mediaType"
                                value="ANIME"
                                checked={mediaType === 'ANIME'}
                                onChange={(e) => setMediaType(e.target.value)}
                            />
                            <div className="radio-indicator"></div>
                            <span className="radio-text">Anime</span>
                        </label>
                        <label className="radio-label">
                            <input
                                className="radio-input"
                                type="radio"
                                name="mediaType"
                                value="MANGA"
                                checked={mediaType === 'MANGA'}
                                onChange={(e) => setMediaType(e.target.value)}
                            />
                            <div className="radio-indicator"></div>
                            <span className="radio-text">Manga</span>
                        </label>
                    </div>

                    {/* Import Button */}
                    <button onClick={startImport} className="button w-full md:col-span-2">
                        Import {mediaType}
                    </button>
                </div>
            )}

            {importState.importStatus === 'IN_PROGRESS' && (
                <>
                    <h2 className="text-text-primary font-aladin text-center text-2xl font-semibold tracking-widest">Import Media</h2>
                    <p className="text-text-secondary text-center tracking-wide">Import your anime or manga list from a JSON file to AniList</p>
                    <div className="mt-5 grid w-full place-items-center gap-5">
                        <ProgressBar total={importState.totalItems} current={importState.itemsProcessed} name={importState.currentItem} />
                        <button
                            className="button inline-flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-700"
                            onClick={cancelImport}>
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {/* Correct Invalid Statuses */}
            {importState.importStatus === 'CORRECT_STATUS' && (
                <CorrectInvalidStatuses
                    correctedStatusList={correctedStatus}
                    setCorrectedStatusList={setCorrectedStatus}
                    validStatusOptions={validStatusOptions}
                    handleContinue={() => importMediaList(jsonContent)}
                    handleCancel={cancelImport}
                />
            )}

            {/* Progress Tables */}
            <div className="mt-5 flex w-full flex-col items-start justify-center gap-6 sm:flex-row">
                {importResults?.success?.length > 0 && <StatusTable data={importResults.success} title="Successful Imports" />}

                {importResults?.failed?.length > 0 && (
                    <div className="w-full max-w-2xl">
                        <StatusTable data={importResults.failed} title="Failed Imports" failed />
                        <button className="button mt-5 w-full" onClick={() => importMediaList(importResults.failed, true)}>
                            Retry Failed Imports
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImportMedia
