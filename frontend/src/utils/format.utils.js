/**
 * Converts a byte count to a human-readable file size.
 *
 * @param {number} bytes The bytes to convert.
 * @param {number} [decimals=2] Decimal places in the result.
 * @returns {string} A formatted file size, e.g., "2.00 MB".
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes <= 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`
}

/**
 * Converts seconds into a human-readable duration.
 *
 * @param {number} seconds The number of seconds.
 * @returns {string} A formatted duration, e.g., "1d 2h 30min 5s".
 */
export const formatDuration = (seconds) => {
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
