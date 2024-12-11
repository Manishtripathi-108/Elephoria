import React, { useState } from 'react'

import axios from 'axios'

import UploadProgressBar from '../../components/common/UploadProgressBar'
import JelloButton from '../../components/common/buttons/JelloButton'
import UploadInput from '../../components/common/form/UploadInput'
import MetadataEditor from './components/MetadataEditor'

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
                if (!response.data.metadata) {
                    setUpload({ status: 'idle', progress: 100, error: 'No metadata found' })
                    window.addToast('No metadata found', 'error')
                    return
                }

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

    const handleCancelUpload = () => {
        setUpload({ status: 'idle', progress: 0, error: null })
        setAudio({ file: null, meta: null, cover: null })
    }

    return (
        <div className="flex-center min-h-calc-full-height flex-col gap-6 px-2 py-8">
            {/* Upload Form */}
            {status === 'idle' && (
                <form
                    id="upload-audio"
                    onSubmit={handleFileUpload}
                    className="flex-center w-full max-w-2xl flex-col rounded-3xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
                    <h2 className="text-primary mb-2 font-aladin text-2xl tracking-wider">Upload Audio</h2>
                    <p className="text-primary mb-6 text-center">Upload an audio file to edit metadata, cover image and more!</p>

                    <UploadInput
                        acceptType="audio/*"
                        className="shadow-neumorphic-xs"
                        id="upload_audio"
                        file={file}
                        setFile={(newFile) => setAudio((prev) => ({ ...prev, file: newFile }))}
                    />

                    <JelloButton type="submit">Upload Audio</JelloButton>
                </form>
            )}

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

            {/* Edit Metadata Form */}
            {status === 'success' && <MetadataEditor fileName={name} coverImage={cover} metadata={meta} onCancel={handleCancelUpload} />}
        </div>
    )
}

export default AudioEditor
