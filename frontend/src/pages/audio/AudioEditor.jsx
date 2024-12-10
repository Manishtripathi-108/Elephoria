import React, { useState } from 'react'

import axios from 'axios'

import UploadProgressBar from '../../components/common/UploadProgressBar'
import JelloButton from '../../components/common/buttons/JelloButton'
import UploadInput from '../../components/common/form/UploadInput'

const AudioEditor = () => {
    const [audio, setAudio] = useState({
        file: null,
        meta: null,
        cover: null,
    })

    const [upload, setUpload] = useState({
        status: 'idle', // idle | uploading | success | error
        progress: 0,
        error: null, // Upload error, if any
    })

    const [name, setName] = useState('')

    const { file, meta, cover } = audio
    const { status, progress, error } = upload

    const handleFileUpload = async (e) => {
        e.preventDefault()

        if (!file) {
            window.addToast('Please select a file first!', 'warning')
            return
        }

        const formData = new FormData()
        formData.append('audio', file)

        setUpload({ status: 'uploading', progress: 0, error: null })

        await axios
            .post('/api/audio/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    setUpload((prev) => ({ ...prev, progress: event.loaded }))
                },
            })
            .then((response) => {
                console.log('Upload Response:', response.data)
                setName(response.data.fileName)

                setAudio({
                    file,
                    meta: response.data?.metadata?.format?.tags || null,
                    cover: response.data?.coverImage || null,
                })

                setUpload({ status: 'success', progress: 100, error: null })
                window.addToast('File uploaded successfully!', 'success')
            })
            .catch((error) => {
                setUpload({ status: 'idle', progress: 0, error: error.response?.data?.message || 'Upload failed.' })
                console.log(error)

                window.addToast(error.response?.data?.message || 'File upload failed.', 'error')
            })
    }

    const handleEditMetadata = async (e) => {
        e.preventDefault()

        if (!meta || !name) return

        try {
            const response = await axios.post('/api/audio/edit-metadata', { name, metadata: meta }, { responseType: 'blob' })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
            link.remove()

            console.log('Edit Metadata Response:', response)
            window.addToast('Metadata edited successfully!', 'success')
        } catch (error) {
            console.log('Failed to edit metadata.', error)
            window.addToast(error.response?.data?.message || 'Failed to edit metadata.', 'error')
        }
    }

    const handleCancelUpload = () => {
        setUpload({ status: 'idle', progress: 0, error: null })
        setAudio({ file: null, meta: null, cover: null })
    }

    return (
        <div className="flex-center min-h-calc-full-height flex-col gap-6 py-8">
            {/* Upload Progress Bar */}
            {status === 'uploading' && (
                <UploadProgressBar
                    bytesUploaded={progress || 0}
                    totalBytes={file ? file.size : 0}
                    fileName={file?.name || 'Unknown File'}
                    onRetry={handleFileUpload}
                    onCancel={handleCancelUpload}
                    hasError={status === 'error'}
                />
            )}

            {/* Upload Form */}
            {status === 'idle' && (
                <form
                    id="upload-audio"
                    onSubmit={handleFileUpload}
                    className="flex-center w-full max-w-2xl flex-col rounded-3xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
                    <h2 className="text-primary mb-2 font-aladin text-2xl tracking-wider">Upload Audio</h2>
                    <p className="text-primary mb-6 text-center">Upload an audio file to edit metadata, convert format, and more!</p>

                    <UploadInput
                        className="shadow-neumorphic-xs"
                        id="upload_audio"
                        file={file}
                        setFile={(newFile) => setAudio((prev) => ({ ...prev, file: newFile }))}
                    />

                    <JelloButton type="submit">Upload Audio</JelloButton>
                </form>
            )}

            {/* Edit Metadata Form */}
            {meta && (
                <form
                    id="edit-metadata"
                    onSubmit={handleEditMetadata}
                    className="flex-center w-full max-w-2xl flex-col gap-6 rounded-3xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
                    <h2 className="text-primary font-aladin text-2xl tracking-wider">Edit Metadata</h2>

                    {/* Display Cover Image */}
                    {cover && (
                        <div className="size-72 overflow-hidden rounded-xl border border-light-secondary p-2 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                            <img src={cover} alt="Cover Image" className="h-full w-full rounded-lg object-cover" />
                        </div>
                    )}

                    {/* Metadata Fields */}
                    <div className="grid w-full grid-cols-3 place-items-center gap-5">
                        {Object.entries(meta)
                            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                            .map(([key, value]) => {
                                if (key === 'lyrics') return null
                                return (
                                    <div key={key} className="form-group">
                                        <label className="form-label" htmlFor={key}>
                                            {key.toLowerCase().split('_').join(' ')}
                                        </label>
                                        <input
                                            className="input-text"
                                            id={key}
                                            type="text"
                                            placeholder={`Enter ${key.toLowerCase().split('_').join(' ')}`}
                                            value={value}
                                            onChange={(e) =>
                                                setAudio((prev) => ({
                                                    ...prev,
                                                    meta: { ...prev.meta, [key]: e.target.value },
                                                }))
                                            }
                                        />
                                    </div>
                                )
                            })}
                    </div>

                    {/* Lyrics Field if available */}
                    {meta.lyrics && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="lyrics">
                                Lyrics
                            </label>
                            <textarea
                                className="input-textarea scrollbar-thin"
                                id="lyrics"
                                placeholder="Enter Lyrics"
                                value={meta.lyrics}
                                onChange={(e) =>
                                    setAudio((prev) => ({
                                        ...prev,
                                        meta: { ...prev.meta, lyrics: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    )}

                    <div className="ml-auto mt-5">
                        <JelloButton type="submit">Save Changes</JelloButton>
                        <JelloButton
                            variant="danger"
                            className="ml-4"
                            onClick={(e) => {
                                e.preventDefault()
                                handleCancelUpload()
                            }}>
                            Cancel
                        </JelloButton>
                    </div>
                </form>
            )}
        </div>
    )
}

export default AudioEditor
