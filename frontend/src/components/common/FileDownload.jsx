import React from 'react'

import iconMap from '../../constants/iconMap'
import JelloButton from './buttons/JelloButton'

/**
 * FileDownload Component
 *
 * Renders a download section with a title, description, and a button to download a file.
 * The component attempts to fetch and download a file from the provided `fileUrl` when the button is clicked.
 * Displays error messages if the download fails or if the file is not ready.
 *
 * @param {string} [title='Download Your File'] - The title to display above the download button.
 * @param {string} [description='Click the button below to download your file.'] - A brief description to display below the title.
 * @param {string} [buttonText='Download'] - The text to display on the download button.
 * @param {string} [fileName='edited_file'] - The name to use when saving the downloaded
 * @param {string} fileUrl - The URL from which to download the file.
 *
 * @returns {JSX.Element} The rendered component with the download functionality.
 */
const FileDownload = ({
    title = 'Download Your File',
    description = 'Click the button below to download your file.',
    buttonText = 'Download',
    fileName = 'file',
    fileUrl,
}) => {
    const handleDownload = async () => {
        if (fileUrl) {
            try {
                const response = await fetch(fileUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(url)
            } catch (error) {
                window.addToast('Failed to download the file. Please try again.', 'error')
            }
        } else {
            window.addToast('File not ready for download. Please try again.', 'error')
        }
    }

    return (
        <div className="text-primary flex h-screen items-center justify-center p-2 sm:p-6">
            <div className="shadow-neumorphic-xs sm:shadow-neumorphic-lg max-w-(--breakpoint-lg) rounded-3xl border p-2 sm:p-6">
                <div className="rounded-2xl border p-6 text-center sm:rounded-xl">
                    <h1 className="mb-6 text-2xl font-bold drop-shadow-lg">{title}</h1>
                    <p className="text-secondary mb-8">{description}</p>
                    <JelloButton title={buttonText} icon={iconMap.download} className="mt-6" onClick={handleDownload}>
                        {buttonText}
                    </JelloButton>
                </div>
            </div>
        </div>
    )
}

export default FileDownload
