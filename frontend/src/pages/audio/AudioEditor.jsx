import React, { useState } from 'react'

import axios from 'axios'

import UploadProgressBar from '../../components/common/UploadProgressBar'
import JelloButton from '../../components/common/buttons/JelloButton'
import UploadInput from '../../components/common/form/UploadInput'
import MetadataEditor from './components/MetadataEditor'

const initialAudio = {
    name: '',
    file: null,
    meta: null,
    cover: null,
}

const initialUpload = {
    status: 'idle', // idle | uploading | success | error | processing
    progress: 0,
    cancelToken: null,
}

const AudioEditor = () => {
    const [audio, setAudio] = useState(initialAudio)
    const [upload, setUpload] = useState(initialUpload)
    const [error, setError] = useState(null)

    const { name, file, meta, cover } = audio
    const { status, progress, cancelToken } = upload

    const handleFileUploadAndExtractMetadata = async (e) => {
        e.preventDefault()
        setError(null)

        if (!file) {
            setError('Please select a file first!')
            return
        }

        const formData = new FormData()
        formData.append('audio', file)

        const source = axios.CancelToken.source()
        setUpload({ ...initialUpload, status: 'uploading', cancelToken: source })

        try {
            const response = await axios.post('/api/audio/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                cancelToken: source.token,
                onUploadProgress: (event) => {
                    setUpload((prev) => ({ ...prev, progress: event.loaded }))
                    if (event.loaded === event.total) {
                        setUpload((prev) => ({ ...prev, status: 'processing' }))
                    }
                },
            })

            if (!response.data.metadata) {
                setUpload(initialUpload)
                setError('No metadata found')
                window.addToast('No metadata found', 'error')
                return
            }

            console.log('Upload Response:', response.data)
            setAudio({
                name: response.data.fileName,
                file,
                meta: response.data?.metadata?.format?.tags || null,
                cover: response.data?.coverImage || null,
            })

            setUpload({ status: 'success', progress: 100 })
            window.addToast('File uploaded successfully!', 'success')
        } catch (error) {
            if (axios.isCancel(error)) {
                setUpload(initialUpload)
                setAudio(initialAudio)
                console.error('Upload canceled:', error)
                window.addToast('File upload canceled.', 'error')
            } else {
                console.error('Upload failed:', error)
                setUpload(initialUpload)
                setError(error.response?.data?.message || 'Upload failed.')
                window.addToast(error.response?.data?.message || 'File upload failed.', 'error')
            }
        }
    }

    // Cancel the upload if it's in progress
    const handleCancelUpload = () => cancelToken?.cancel('Upload canceled by the user.')

    return (
        <div className="flex-center min-h-calc-full-height flex-col gap-6 px-2 py-8">
            {/* Upload Form */}
            {status === 'idle' && (
                <form
                    id="upload-audio"
                    onSubmit={handleFileUploadAndExtractMetadata}
                    className="flex-center w-full max-w-2xl flex-col rounded-3xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
                    <h2 className="text-primary mb-2 font-aladin text-2xl tracking-wider">Upload Audio</h2>
                    <p className="text-primary mb-6 text-center">Upload an audio file to edit metadata, cover image and more!</p>

                    <UploadInput
                        acceptType="audio/*"
                        className="mb-6 shadow-neumorphic-xs"
                        id="upload_audio"
                        file={file}
                        setFile={(newFile) => setAudio((prev) => ({ ...prev, file: newFile }))}
                    />

                    <JelloButton type="submit">Upload Audio</JelloButton>
                    {error && <p className="error mt-4">{error}</p>}
                </form>
            )}

            {/* Upload Progress Bar */}
            {status === 'uploading' && (
                <UploadProgressBar
                    bytesUploaded={progress || 0}
                    totalBytes={file ? file.size : 0}
                    fileName={file?.name || 'Unknown File'}
                    onRetry={handleFileUploadAndExtractMetadata}
                    onCancel={handleCancelUpload}
                    hasError={status === 'error'}
                />
            )}

            {status === 'processing' && (
                <div>
                    <p className="text-primary">Processing...</p>
                    <JelloButton onClick={handleCancelUpload}> Cancel</JelloButton>
                </div>
            )}

            {/* Edit Metadata Form */}
            {status === 'success' && <MetadataEditor fileName={name} coverImage={cover} metadata={meta} onCancel={handleCancelUpload} />}
        </div>
    )
}

export default AudioEditor
