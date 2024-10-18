import React, { useEffect, useState } from 'react'

import axios from 'axios'

import UploadInput from '../../components/common/form/upload-input'
import { validStatus } from './components/constants'

// Helper function to correct statuses
const correctStatus = (status) => {
    const cleanStatus = status.trim().toUpperCase()
    const bestMatch = validStatus.find((valid) => valid.includes(cleanStatus) || cleanStatus.includes(valid))
    return bestMatch || null // Return a valid match or null if none found
}

function ImportAnime() {
    const [file, setFile] = useState(null)
    const [jsonData, setJsonData] = useState(null)
    const [mediaType, setMediaType] = useState('ANIME')
    const [importProgress, setImportProgress] = useState([])
    const [error, setError] = useState(null)

    // Function to extract MyAnimeList (MAL) ID from a link
    const extractMalId = (link) => {
        const regex = mediaType === 'ANIME' ? /anime\/(\d+)/ : /manga\/(\d+)/
        const match = link.match(regex)
        return match ? match[1] : null
    }

    // Function to get AniList ID from MAL ID (bulk processing)
    const getAniListIds = async (malIds) => {
        console.log('step 2: Fetch AniList IDs in bulk')
        try {
            const response = await axios.post('/api/anime/anilist-ids', {
                malIds,
                mediaType: mediaType.toUpperCase(),
            })
            return response.data.aniListIds // Assume the response returns a map of MAL ID -> AniList ID
        } catch (error) {
            console.error('Error fetching AniList IDs:', error)
            return null
        }
    }

    // Function to add media to AniList
    const addToAniList = async (accessToken, aniListId, status) => {
        console.log('step 3: Add media to AniList')

        try {
            const response = await axios.post('/api/anime/add-to-anilist', {
                accessToken,
                mediaId: aniListId,
                status,
            })
            return response.data.status === status
        } catch (error) {
            console.error('Error adding to AniList:', error)
            return false
        }
    }

    // Handle JSON file parsing
    useEffect(() => {
        setError(null)
        setJsonData(null)
        setImportProgress([])

        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result)
                    setJsonData(data)
                } catch (error) {
                    setError('Error parsing JSON file.')
                }
            }
            reader.readAsText(file)
        }
    }, [file])

    // Process all media data
    const processMediaList = async () => {
        setImportProgress([])
        setError(null)

        if (!jsonData) {
            setError('No JSON file uploaded.')
            return
        }

        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            setError('Access token not found. Please log in.')
            return
        }

        // Step 1: Collect all MAL IDs
        const malIdMap = {}
        const progress = []
        for (const [status, mediaArray] of Object.entries(jsonData)) {
            const correctedStatus = correctStatus(status)
            if (!correctedStatus) {
                setError(`Invalid status found: ${status} in JSON file.
                    Valid statuses are: ${validStatus.join(', ')}`)
                continue
            }

            mediaArray.forEach((media) => {
                const malId = extractMalId(media.link)
                if (malId) {
                    malIdMap[malId] = { name: media.name, status: correctedStatus } // Store media details with MAL ID
                } else {
                    progress.push({ name: media.name, status: 'Invalid MAL ID' })
                }
            })
        }

        // Step 2: Fetch AniList IDs in bulk
        const malIds = Object.keys(malIdMap)
        if (malIds.length === 0) {
            setError('No valid MAL IDs found.')
            return
        }

        if (error) return

        const aniListIdMap = await getAniListIds(malIds)
        if (!aniListIdMap) {
            setError('Error fetching AniList IDs.')
            return
        }

        if (error) return

        // Step 3: Add media to AniList
        for (const malId of malIds) {
            const mediaData = malIdMap[malId]
            const aniListId = aniListIdMap[malId]

            if (aniListId) {
                const result = await addToAniList(accessToken, aniListId, mediaData.status)
                progress.push({ name: mediaData.name, status: result ? 'Success' : 'Failed' })
            } else {
                progress.push({ name: mediaData.name, status: 'AniList ID not found' })
            }
        }

        setImportProgress(progress)
    }

    return (
        <div className="bg-primary container mx-auto grid place-items-center rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            <h2 className="text-primary text-center font-aladin text-2xl font-semibold tracking-widest">Import Media</h2>
            <p className="text-secondary text-center font-indie-flower tracking-wide">Import your anime or manga list from a JSON file to AniList</p>

            <div className="m-5 grid w-fit flex-col place-items-center gap-5 md:grid-cols-2">
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
                <button onClick={processMediaList} className="neu-btn w-full md:col-span-2">
                    Import {mediaType}
                </button>
            </div>

            {/* Display Progress */}
            {importProgress.length > 0 && (
                <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* <!-- Success Imports Table --> */}
                    <div className="bg-primary w-full max-w-2xl rounded-2xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
                        {/* <!-- Table heading --> */}
                        <header className="border-b border-light-secondary px-4 py-3 dark:border-dark-secondary">
                            <h2 className="text-primary font-aladin text-xl font-semibold tracking-widest">Successful Imports</h2>
                        </header>

                        {/* <!-- Table structure --> */}
                        <div className="p-3">
                            <div className="scrollbar-thin">
                                <table className="w-full table-auto">
                                    {/* <!-- Table header --> */}
                                    <thead className="text-secondary text-left font-indie-flower tracking-wide">
                                        <tr>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Item</th>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>

                                    {/* <!-- Table body --> */}
                                    <tbody className="text-primary font-indie-flower text-sm tracking-wide">
                                        {importProgress
                                            .filter((item) => item.status === 'Success')
                                            .map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-light-secondary transition-all duration-300 ease-in-out first:rounded-t-lg last:rounded-b-lg hover:border-transparent hover:shadow-neu-light-md dark:border-dark-secondary dark:hover:border-transparent dark:hover:shadow-neu-dark-sm">
                                                    <td className="px-5 py-3">{item.name}</td>
                                                    <td className="px-5 py-3 text-green-500">{item.status}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Failure Imports Table --> */}
                    <div className="bg-primary w-full max-w-2xl rounded-2xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
                        {/* <!-- Table heading --> */}
                        <header className="border-b border-light-secondary px-4 py-3 dark:border-dark-secondary">
                            <h2 className="text-primary font-aladin text-xl font-semibold tracking-widest">Failed Imports</h2>
                        </header>

                        {/* <!-- Table structure --> */}
                        <div className="p-3">
                            <div className="scrollbar-thin">
                                <table className="w-full table-auto">
                                    {/* <!-- Table header --> */}
                                    <thead className="text-secondary text-left font-indie-flower tracking-wide">
                                        <tr>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Item</th>
                                            <th className="bg-secondary px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>

                                    {/* <!-- Table body --> */}
                                    <tbody className="text-primary font-indie-flower text-sm tracking-wide">
                                        {importProgress
                                            .filter((item) => item.status !== 'Success')
                                            .map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-light-secondary transition-all duration-300 ease-in-out first:rounded-t-lg last:rounded-b-lg hover:border-transparent hover:shadow-neu-light-md dark:border-dark-secondary dark:hover:border-transparent dark:hover:shadow-neu-dark-sm">
                                                    <td className="px-5 py-3">{item.name}</td>
                                                    <td className="px-5 py-3 text-red-500">{item.status}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Display Error */}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    )
}

export default ImportAnime
