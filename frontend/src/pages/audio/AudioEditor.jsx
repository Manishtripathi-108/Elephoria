import React, { useEffect, useState } from 'react'

import axios from 'axios'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import UploadInput from '../../components/common/form/upload-input'
import Toast from '../../components/common/notifications/toast'

const AudioEditor = () => {
    const [file, setFile] = useState(null)
    const [metaData, setMetadata] = useState(null)
    const [coverImage, setCoverImage] = useState(null)

    const [fileName, setFileName] = useState('Upload File')
    const [toast, setToast] = useState(null)

    const showToast = (message, type) => {
        setToast({ message, type })
    }

    const handleDismiss = () => {
        setToast(null)
    }

    const handleFileUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            showToast('Please select a file first!', 'warning')
            return
        }

        const formData = new FormData()
        formData.append('audio', file)

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log('Response:', response.data)

            // Set metadata and cover image URL
            setMetadata(response.data?.metadata?.format?.tags)
            setCoverImage(response.data?.coverImage) // Set the full URL of the cover image

            showToast('File uploaded and metadata extracted successfully!', 'success')
        } catch (error) {
            console.error('Error uploading file:', error)
            showToast('File upload failed', 'error')
        }
    }

    const handleEditMetadata = async (e) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()

        // Append the file
        formData.append('audio', file)

        // Loop through the metaData object and append each key-value pair
        Object.entries(metaData).forEach(([key, value]) => {
            formData.append(key, value)
        })

        try {
            const response = await axios.post('/api/edit-metadata', formData, {
                responseType: 'blob', // Expect a file as the response
            })

            const originalFilename = response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', originalFilename) // Use original filename for download
            document.body.appendChild(link)
            link.click()

            setToast({ message: 'Metadata edited successfully!', type: 'success' })
        } catch (error) {
            console.error('Error editing metadata:', error)
            setToast({ message: 'Error editing metadata', type: 'error' })
        }
    }

    return (
        <div className="m-6 flex-center gap-6 flex-col">
            {/* Logo and app name */}
            <div className="flex-center gap-2 text-primary">
                <Logo className="w-12 h-12" />
                <AppName className="w-24 h-12" />
            </div>

            {/* Upload audio form */}
            <form
                id="upload-audio"
                onSubmit={handleFileUpload}
                className="w-full max-w-2xl flex-center flex-col rounded-lg p-6 shadow-neu-light-md dark:shadow-neu-dark-md">
                <h2 className="text-primary font-aladin tracking-wider text-2xl mb-2">Upload Audio</h2>
                <p className="text-primary text-center mb-6">Upload an audio file to edit metadata, convert format, and more!</p>

                <UploadInput id="upload_audio" file={file} setFile={setFile} fileName={fileName} setFileName={setFileName} />

                <button type="submit" title="Upload Audio" className="neu-btn flex-shrink-0" onClick={handleFileUpload}>
                    Upload Audio
                </button>
            </form>

            {/* Edit metadata form */}
            <form
                id="edit-metadata"
                className="w-full max-w-2xl flex-center flex-col rounded-lg gap-6 p-6 shadow-neu-light-md dark:shadow-neu-dark-md"
                onSubmit={handleEditMetadata}>
                <h2 className="text-primary font-aladin tracking-wider text-2xl">Edit Metadata</h2>

                {/* Display cover image if available */}
                {coverImage && (
                    <div className="size-72 dark:shadow-neu-inset-dark-sm p-3 shadow-neu-inset-light-sm rounded-lg overflow-hidden">
                        <div className="rounded-md overflow-hidden w-full">
                            <img src={coverImage} alt="Cover Image" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {metaData && (
                    <div className="w-full flex flex-wrap gap-x-5">
                        {Object.entries(metaData)
                            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                            .map(([key, value]) => (
                                <div key={key} className="neu-form-group mb-4 w-fit">
                                    <label className="neu-form-label" htmlFor={key}>
                                        {key
                                            .split('_')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                            .join(' ')}
                                    </label>
                                    <input
                                        className="neu-form-input"
                                        id={key}
                                        type="text"
                                        placeholder={key
                                            .split('_')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                            .join(' ')}
                                        value={value}
                                        onChange={(e) => setMetadata({ ...metaData, [key]: e.target.value })}
                                    />
                                </div>
                            ))}
                    </div>
                )}

                <button type="submit" className="neu-btn">
                    Edit Metadata
                </button>
            </form>

            {/* Display toast notification */}
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={handleDismiss} duration={5000} />}
        </div>
    )
}

export default AudioEditor
