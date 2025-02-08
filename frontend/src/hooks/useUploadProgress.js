import { useState } from 'react'

import { formatDuration, formatFileSize } from '../utils/format.utils'

const UPLOAD_PROGRESS = {
    loaded: 0,
    total: 0,
    formattedLoaded: '0 B',
    formattedTotal: '0 B',
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
}

/**
 * Provides a convenient way to track and manage file upload progress.
 *
 * @returns {Object} An object containing:
 *   {Object} uploadState - Details of the current upload, including:
 *       - loaded {number} Bytes uploaded so far.
 *       - total {number} Total bytes to be uploaded.
 *       - progress {number} The percentage of the upload that is complete.
 *       - formattedLoaded {string} A human-readable string of bytes uploaded.
 *       - formattedTotal {string} A human-readable string of the total bytes.
 *       - formattedProgress {string} A human-readable upload percentage.
 *       - bytes {number} Additional uploaded bytes info.
 *       - rate {number} The current upload rate in bytes per second.
 *       - formattedRate {string} A human-readable upload rate, e.g., "150 KB/s".
 *       - estimated {number} Estimated time remaining in seconds.
 *       - formattedEstimated {string} A human-readable estimated time remaining.
 *
 *   {Function} resetUploadProgress - Resets all upload progress data.
 *
 *   {Function} onUploadProgress - Updates the upload state when progress events occur.
 */
function useUploadProgress() {
    const [uploadState, setUploadState] = useState(UPLOAD_PROGRESS)

    const onUploadProgress = (event) => {
        if (!event.lengthComputable) return
        setUploadState((prev) => ({
            ...prev,
            ...event,
            progress: (event?.progress || 0) * 100,
            formattedLoaded: formatFileSize(event?.loaded),
            formattedTotal: formatFileSize(event?.total),
            formattedProgress: `${((event?.progress || 0) * 100).toFixed(2)}%`,
            formattedRate: event?.rate > 0 ? `${formatFileSize(event?.rate)}/s` : '0 B/s',
            formattedEstimated: event?.estimated > 0 ? formatDuration(event?.estimated) : '0s',
        }))
    }

    const resetUploadProgress = () => setUploadState(UPLOAD_PROGRESS)

    return { uploadState, resetUploadProgress, onUploadProgress }
}

export default useUploadProgress
