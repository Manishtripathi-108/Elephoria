import React, { useEffect, useState } from 'react'

import axios from 'axios'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import UploadInput from '../../components/common/form/upload-input'
import Toast from '../../components/common/notifications/Toast'
import { useLoadingBar } from '../../context/LoadingBarContext'

const AudioEditor = () => {
    const [file, setFile] = useState(null)
    const [metaData, setMetadata] = useState(null)
    const [coverImage, setCoverImage] = useState(null)

    const [toast, setToast] = useState(null)
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
    }, [])

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
        <div className="flex-center flex-col gap-6">
            {/* Upload audio form */}
            <form
                id="upload-audio"
                onSubmit={handleFileUpload}
                className="flex-center w-full max-w-2xl flex-col rounded-lg p-6 shadow-neu-light-md dark:shadow-neu-dark-md">
                <h2 className="text-primary mb-2 font-aladin text-2xl tracking-wider">Upload Audio</h2>
                <p className="text-primary mb-6 text-center">Upload an audio file to edit metadata, convert format, and more!</p>

                <UploadInput id="upload_audio" file={file} setFile={setFile} />

                <button type="submit" title="Upload Audio" className="neu-btn flex-shrink-0" onClick={handleFileUpload}>
                    Upload Audio
                </button>
            </form>

            {/* Edit metadata form */}
            <form
                id="edit-metadata"
                className="flex-center w-full max-w-2xl flex-col gap-6 rounded-lg p-6 shadow-neu-light-md dark:shadow-neu-dark-md"
                onSubmit={handleEditMetadata}>
                <h2 className="text-primary font-aladin text-2xl tracking-wider">Edit Metadata</h2>

                {/* Display cover image if available */}
                {coverImage && (
                    <div className="size-72 overflow-hidden rounded-lg p-3 shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
                        <div className="w-full overflow-hidden rounded-md">
                            <img src={coverImage} alt="Cover Image" className="h-full w-full object-cover" />
                        </div>
                    </div>
                )}

                {metaData && (
                    <div className="flex w-full flex-wrap gap-x-5">
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
