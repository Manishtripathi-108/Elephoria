// Extract MAL ID from link
export const extractMalId = (link, mediaType) => {
    const regex = mediaType === 'ANIME' ? /anime\/(\d+)/ : /manga\/(\d+)/
    const match = link.match(regex)
    return match ? match[1] : null
}

// Split an array into chunks
export const chunkArray = (array, chunkSize) => {
    return array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
}

export const isValidFormat = (json) => {
    const validateEntry = (entry) => {
        // Check that entry is an object with exactly 'name' and 'link' keys
        if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) return false

        const keys = Object.keys(entry)
        return keys.length === 2 && keys.includes('name') && keys.includes('link') && typeof entry.name === 'string' && typeof entry.link === 'string'
    }

    const validateCategory = (category) => {
        // Ensure category is an array of valid entries
        return Array.isArray(category) && category.every(validateEntry)
    }

    try {
        // Ensure the parsed json is a non-null object
        if (typeof json !== 'object' || json === null || Array.isArray(json)) return false

        const keys = Object.keys(json)

        // Check if the number of top-level categories exceeds 6
        if (keys.length > 6) {
            window.addToast('Too many categories. Please limit to 6 categories.', 'error')
            return false
        }

        // Validate each category's content
        return keys.every((key) => validateCategory(json[key]))
    } catch (e) {
        // Log or handle the error if needed
        console.error('Invalid JSON format:', e)
        return false
    }
}

// Process media list and extract MAL IDs
export const validateAndMapMedia = (mediaList, mediaType, failedList, correctedStatus, validStatusOptions) => {
    const malIdMap = {}
    const mediaStatus = Object.keys(mediaList)

    // Step 1: Identify invalid statuses
    const invalidStatus = [...new Set(mediaStatus.filter((status) => !validStatusOptions.includes(status.toUpperCase())))]

    // Step 2: If there are invalid statuses, ensure corrections are made
    if (invalidStatus.length > 0) {
        // Add any new invalid statuses to the correctedStatus array if not already present
        invalidStatus.forEach((status) => {
            if (!correctedStatus.some((item) => item.status === status)) {
                correctedStatus.push({ status, corrected: '' })
            }
        })

        // Check if all invalid statuses have been corrected
        const uncorrectedStatus = correctedStatus.filter((item) => invalidStatus.includes(item.status) && item.corrected === '')

        if (uncorrectedStatus.length > 0) {
            return { error: true, uncorrectedStatus: correctedStatus } // Return all uncorrected statuses even if there are corrected ones
        }
    }

    // Step 3: Map media entries to AniList format if all statuses are valid or corrected
    Object.entries(mediaList).forEach(([status, mediaArray]) => {
        let correctStatus = status.toUpperCase()

        // Use corrected status if the original one is invalid
        if (!validStatusOptions.includes(correctStatus)) {
            correctStatus = correctedStatus.find((item) => item.status === status)?.corrected?.toUpperCase()
        }

        // If corrected status is still invalid, skip the mapping
        if (!correctStatus || !validStatusOptions.includes(correctStatus)) return

        // Map each media item to MAL ID
        mediaArray.forEach((media) => {
            const malId = extractMalId(media.link, mediaType)
            if (malId) {
                malIdMap[malId] = {
                    name: media.name,
                    status: correctStatus,
                }
            } else {
                failedList.push({
                    name: media.name,
                    statusText: 'Invalid MAL ID',
                })
            }
        })
    })

    return { error: false, malIdMap, failedList }
}

// Filter existing entries from the user media list
export const filterExistingMalIds = (malIdMap, userMediaList) => {
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
                (malData.status.toUpperCase() === 'CURRENT'
                    ? 'WATCHING' === userMal.status || 'READING' === userMal.status // as AniList doesn't have 'CURRENT' status so watching is for anime and reading is for manga
                    : malData.status.toUpperCase() === userMal.status)
        )
    })
}

export const handleError = (error) => {
    if (error.retryAfterSeconds > 0) {
        window.addToast(`Rate limit exceeded. Try again after ${error.retryAfterSeconds} seconds.`, 'error')
    } else {
        window.addToast(error.message || 'An error occurred while importing. Please try again.', 'error')
    }
}

export const handleRateLimits = async (remainingRateLimit, retryAfterSeconds) => {
    if (remainingRateLimit <= 60 || retryAfterSeconds > 0) {
        await new Promise((resolve) => setTimeout(resolve, (retryAfterSeconds || 60) * 1000))
    }
}
