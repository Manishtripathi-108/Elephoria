import { useState } from 'react'

/**
 * useUploadProgress
 *
 * A custom React hook to track file upload progress.
 *
 * @returns {Object} An object containing:
 * @property {Object} uploadState - Raw upload data.
 * @property {Object} formattedUpload - Formatted state for UI (`progress`, `rate`, `estimated`).
 * @property {Function} onUploadProgress - Function to update state from Axios event.
 */
function useUploadProgress() {
    const [uploadState, setUploadState] = useState({
        loaded: 0,
        total: 0,
        progress: 0,
        formattedProgress: '0.00%',
        bytes: 0,
        rate: 0,
        formattedRate: 'Calculating...',
        estimated: 0,
        formattedEstimated: 'Calculating...',
        upload: null,
        lengthComputable: null,
        event: {
            isTrusted: null,
        },
    })

    const onUploadProgress = (event) => {
        if (!event.lengthComputable) return
        setUploadState((prev) => ({
            ...prev,
            ...event,
            progress: (event.progress || 0) * 100,
            formattedProgress: `${((event.progress || 0) * 100).toFixed(2)}%`,
            formattedRate: event.rate > 0 ? `${formatFileSize(event.rate)}/s` : '0 B/s',
            formattedEstimated: event.estimated > 0 ? formatDuration(event.estimated) : '0s',
        }))
    }

    return { uploadState, onUploadProgress }
}

/**
 * Convert bytes to human-readable format
 */
const formatFileSize = (bytes, decimals = 2) => {
    if (bytes <= 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`
}

/**
 * Convert seconds to a human-readable time format
 */
const formatDuration = (seconds) => {
    if (seconds < 1) return 'Less than 1s'

    const days = Math.floor(seconds / 86400)
    seconds -= days * 86400
    const hours = Math.floor(seconds / 3600)
    seconds -= hours * 3600
    const minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60

    const parts = []
    if (days) parts.push(`${days}d`)
    if (hours) parts.push(`${hours}h`)
    if (minutes) parts.push(`${minutes}min`)
    if (seconds) parts.push(`${Math.floor(seconds)}s`)

    return parts.join(' ') || '0s'
}

export default useUploadProgress
