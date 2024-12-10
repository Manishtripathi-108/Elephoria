import React, { useState } from 'react'

import axios from 'axios'

import UploadProgressBar from '../../components/common/UploadProgressBar'
import UploadInput from '../../components/common/form/UploadInput'

const AudioEditor = () => {
    const [file, setFile] = useState(null) // File to upload
    const [metaData, setMetaData] = useState(null) // Metadata of the uploaded file
    const [coverImage, setCoverImage] = useState(null) // Cover image from the file metadata

    const [uploadProgress, setUploadProgress] = useState(0) // Upload progress percentage
    const [isUploading, setIsUploading] = useState(false) // Uploading state
    const [hasUploadError, setHasUploadError] = useState(false) // Error state for upload

    const handleFileUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            window.addToast('Please select a file first!', 'warning')
            return
        }

        const formData = new FormData()
        formData.append('audio', file)

        try {
            setIsUploading(true)
            setHasUploadError(false)

            const response = await axios.post('/api/audio/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    setUploadProgress(progressEvent)
                },
            })

            console.log(response.data)

            setMetaData(response.data?.metadata?.format?.tags || {})
            setCoverImage(response.data?.coverImage || null)
            window.addToast('File uploaded and metadata extracted successfully!', 'success')
        } catch (error) {
            console.error('Error uploading file:', error)
            setHasUploadError(true)
            window.addToast('File upload failed.', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    /**
     * Handle metadata editing and download the updated file.
     */
    const handleEditMetadata = async (e) => {
        e.preventDefault()
        if (!file || !metaData) return

        const formData = new FormData()

        // Append the file
        formData.append('audio', file)

        // Loop through the metaData object and append each key-value pair
        Object.entries(metaData).forEach(([key, value]) => {
            formData.append(key, value)
        })

        try {
            const response = await axios.post('/api/audio/edit-metadata', formData, {
                responseType: 'blob', // Expect a file as the response
            })

            const originalFilename = response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'edited_audio.mp3'

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', originalFilename)
            document.body.appendChild(link)
            link.click()

            window.addToast('Metadata edited successfully!', 'success')
        } catch (error) {
            console.error('Error editing metadata:', error)
            window.addToast('Failed to edit metadata.', 'error')
        }
    }

    return (
        <div className="flex-center min-h-calc-full-height flex-col gap-6 py-8">
            {/* Upload Progress Bar */}
            {isUploading ? (
                <UploadProgressBar
                    bytesUploaded={uploadProgress.loaded}
                    className="my-6"
                    totalBytes={uploadProgress.total}
                    fileName={file?.name || 'Unknown File'}
                    onRetry={handleFileUpload}
                    onCancel={() => setIsUploading(false)}
                    hasError={hasUploadError}
                />
            ) : (
                <form
                    id="upload-audio"
                    onSubmit={handleFileUpload}
                    className="flex-center w-full max-w-2xl flex-col rounded-3xl p-6 shadow-neumorphic-md">
                    <h2 className="text-primary mb-2 font-aladin text-2xl tracking-wider">Upload Audio</h2>
                    <p className="text-primary mb-6 text-center">Upload an audio file to edit metadata, convert format, and more!</p>

                    <UploadInput id="upload_audio" file={file} setFile={setFile} />

                    <button type="submit" title="Upload Audio" className="button flex-shrink-0" onClick={handleFileUpload}>
                        Upload Audio
                    </button>
                </form>
            )}

            {/* Edit Metadata Form */}
            {metaData && (
                <form
                    id="edit-metadata"
                    onSubmit={handleEditMetadata}
                    className="flex-center w-full max-w-2xl flex-col gap-6 rounded-3xl p-6 shadow-neumorphic-md">
                    <h2 className="text-primary font-aladin text-2xl tracking-wider">Edit Metadata</h2>

                    {/* Display Cover Image */}
                    {coverImage && (
                        <div className="size-72 overflow-hidden rounded-xl p-2 shadow-neumorphic-inset-sm">
                            <img src={coverImage} alt="Cover Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                    )}

                    {/* Metadata Fields */}
                    <div className="flex w-full flex-wrap gap-x-5">
                        {Object.entries(metaData)
                            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                            .map(([key, value]) => (
                                <div key={key} className="form-group mb-4 w-fit">
                                    <label className="form-label" htmlFor={key}>
                                        {key
                                            .split('_')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                            .join(' ')}
                                    </label>
                                    <input
                                        className="input-text"
                                        id={key}
                                        type="text"
                                        value={value}
                                        onChange={(e) => setMetaData({ ...metaData, [key]: e.target.value })}
                                    />
                                </div>
                            ))}
                    </div>

                    <button type="submit" className="button">
                        Save Changes
                    </button>
                </form>
            )}
        </div>
    )
}

export default AudioEditor
