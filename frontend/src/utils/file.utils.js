/**
 * Extracts the file extension from a given filename.
 *
 * @param {string} filename The name of the file from which to extract the extension.
 * @returns {string} The file extension of the provided filename.
 */
export const getFileExtension = (filename) => {
    if (!filename || typeof filename !== 'string') {
        return ''
    }

    const lastDotIndex = filename.lastIndexOf('.')
    if (lastDotIndex === -1) {
        return ''
    }

    const extension = filename.substring(lastDotIndex + 1)
    return extension
}
