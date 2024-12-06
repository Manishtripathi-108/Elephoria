import React from 'react'

import JelloButton from './buttons/JelloButton'

/**
 * UploadProgressBar
 *
 * Displays the progress of a file upload.
 *
 * @param {number} bytesUploaded - Number of bytes uploaded so far.
 * @param {string} fileName - Name of the file being uploaded.
 * @param {number} totalBytes - Total number of bytes to be uploaded.
 * @param {Function} onRetry - Callback function for retrying the upload.
 * @param {Function} onCancel - Callback function for canceling the upload.
 * @param {boolean} [hasError=false] - Flag indicating if there was an error during upload.
 */
const UploadProgressBar = ({ bytesUploaded, fileName, totalBytes, onRetry, onCancel, hasError = false }) => {
    const formatFileSize = (uploaded, total) => {
        if (total < 1024) return `${uploaded}/${total} B`
        if (total < 1024 * 1024) return `${(uploaded / 1024).toFixed(2)}/${(total / 1024).toFixed(2)} KB`
        return `${(uploaded / (1024 * 1024)).toFixed(2)}/${(total / (1024 * 1024)).toFixed(2)} MB`
    }

    const uploadPercentage = ((bytesUploaded / totalBytes) * 100).toFixed()

    return (
        <div className="bg-primary mx-auto w-full max-w-md rounded-xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
            <h2 className="text-primary mb-4 font-aladin text-xl font-bold tracking-widest">Uploading File</h2>

            {/* File Info */}
            <div className="bg-secondary my-4 rounded-lg p-3">
                <p className="text-primary line-clamp-1 font-medium" title={fileName}>
                    {fileName}
                </p>
                <p className="text-secondary text-xs">{formatFileSize(bytesUploaded, totalBytes)}</p>
            </div>

            {/* Progress Bar */}
            <div className="flex-center relative gap-x-2">
                {/* Percentage Indicator */}
                <div className="flex-center rounded-full border border-light-secondary p-1 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                    <span className="text-accent bg-primary size-7 rounded-full border border-inherit p-1 text-center text-sm font-bold shadow-neumorphic-xs transition-all duration-300 ease-in-out">
                        {Math.min(uploadPercentage, 100)}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-primary relative block w-full rounded-full border border-light-secondary p-1 text-base leading-4 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                    <span
                        style={{
                            width: `${Math.min(uploadPercentage, 100)}%`,
                            transition: 'width 0.3s ease-in-out',
                        }}
                        className="relative inline-block h-5 overflow-hidden rounded-full border border-inherit bg-gradient-to-t from-light-accent/70 to-light-accent bg-cover align-middle after:absolute after:inset-0 after:animate-progress-after after:bg-[linear-gradient(_45deg,#ffffff_25%,rgba(0,0,0,0)_25%,rgba(0,0,0,0)_50%,#ffffff_50%,#ffffff_75%,rgba(0,0,0,0)_75%,rgba(0,0,0,0)_)] after:bg-[length:30px_30px] after:opacity-30 dark:from-dark-accent/70 dark:to-dark-accent"></span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col items-center space-y-4">
                {hasError ? (
                    <>
                        <p className="text-sm text-red-500">Upload failed. Please try again.</p>
                        <div className="flex w-full justify-end gap-x-2">
                            <JelloButton variant="info" onClick={onRetry}>
                                Retry
                            </JelloButton>
                            <JelloButton variant="danger" onClick={onCancel}>
                                Cancel
                            </JelloButton>
                        </div>
                    </>
                ) : (
                    <JelloButton className="ml-auto" variant="danger" onClick={onCancel}>
                        Cancel
                    </JelloButton>
                )}
            </div>
        </div>
    )
}

export default UploadProgressBar
