import React, { useRef, useState } from 'react'

import axios from 'axios'

import LoadingState from '../../components/Loading'
import UploadProgressBar from '../../components/common/UploadProgressBar'
import JelloButton from '../../components/common/buttons/JelloButton'
import UploadInput from '../../components/common/form/UploadInput'
import MetadataEditor from './components/MetadataEditor'

const initialAudioState = { fileId: 'uploads/audio/wr1nwraarbyyshkhab8i', fileUrl: null, file: null, metadata: null, coverImage: null }
const initialUploadState = {
    status: 'uploaded', // idle | uploading | uploaded | processing | extracted | error
    progress: 0,
    error: null,
}

const AudioEditor = () => {
    const [audio, setAudio] = useState(initialAudioState)
    const [upload, setUpload] = useState(initialUploadState)
    const abortControllerRef = useRef(null)

    const { fileId, fileUrl, file, metadata, coverImage } = audio
    const { status, progress, error } = upload

    // Handles audio file upload
    const handleUploadAudio = async (e) => {
        e.preventDefault()
        setUpload(initialUploadState)

        if (!file) {
            setUpload({ ...initialUploadState, error: 'Please select an audio file to upload.' })
            return
        }

        const formData = new FormData()
        formData.append('audio', file)

        // Set up AbortController for cancellation
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        setUpload({ ...initialUploadState, status: 'uploading' })

        try {
            const response = await axios.post('/api/audio/upload', formData, {
                signal,
                onUploadProgress: (event) => {
                    setUpload((prev) => ({ ...prev, progress: event }))
                },
            })

            console.log('Upload Response:', response.data)
            setAudio((prev) => ({ ...prev, fileId: response.data.publicId, fileUrl: response.data.url }))
            setUpload({ ...initialUploadState, status: 'uploaded' })
            window.addToast('Audio file uploaded successfully!', 'success')
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.error('Upload canceled:', err)
                window.addToast('Upload canceled.', 'error')
            } else {
                console.error('Upload failed:', err)
                setUpload({ ...initialUploadState, error: err.response?.data?.message || 'Upload failed.' })
                window.addToast(err.response?.data?.message || 'Upload failed.', 'error')
            }
        }
    }

    // Handles metadata extraction
    const handleExtractMetadata = async () => {
        if (!(fileId || fileUrl)) {
            setUpload({ ...initialUploadState, error: 'No audio file uploaded to extract metadata from.' })
            return
        }

        // Set up AbortController for cancellation
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        setUpload({ ...initialUploadState, status: 'processing' })

        try {
            const response = await axios.post('/api/audio/extract-metadata', { fileId }, { signal })

            console.log('Metadata Extraction Response:', response.data)
            setAudio((prev) => ({
                ...prev,
                metadata: response.data?.metadata?.format?.tags || null,
                coverImage: response.data?.coverImage || null,
            }))
            setUpload({ ...initialUploadState, status: 'extracted' })
            window.addToast('Metadata extracted successfully!', 'success')
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.error('Extraction canceled:', err)
                window.addToast('Metadata extraction canceled.', 'error')
            } else {
                console.error('Metadata extraction failed:', err)
                setUpload({ ...initialUploadState, error: err.response?.data?.message || 'Metadata extraction failed.' })
                window.addToast(err.response?.data?.message || 'Metadata extraction failed.', 'error')
            }
        }
    }

    // Cancels ongoing upload or metadata extraction
    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
            setUpload({ ...initialUploadState, status: 'uploaded' })
        }
    }

    // Reset state for a new upload session
    const resetAudioEditor = () => {
        setAudio(initialAudioState)
        setUpload(initialUploadState)
    }

    return (
        <div className="flex-center min-h-calc-full-height flex-col gap-6 px-4 py-8">
            {/* Upload Form */}
            {status === 'idle' && (
                <form
                    id="upload-audio"
                    onSubmit={handleUploadAudio}
                    className="flex-center w-full max-w-2xl flex-col rounded-3xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
                    <h2 className="text-primary mb-2 font-aladin text-2xl tracking-wider">Upload Audio</h2>
                    <p className="text-primary mb-6 text-center">Upload an audio file to extract metadata and edit tags.</p>

                    <UploadInput
                        acceptType="audio/*"
                        className="mb-6 shadow-neumorphic-xs"
                        id="upload_audio"
                        file={file}
                        setFile={(newFile) => setAudio((prev) => ({ ...prev, file: newFile }))}
                    />

                    <JelloButton type="submit" disabled={status === 'uploading'}>
                        Upload Audio
                    </JelloButton>
                    {error && <p className="error mt-4">{error}</p>}
                </form>
            )}

            {/* Upload Progress Bar */}
            {status === 'uploading' && (
                <UploadProgressBar
                    bytesUploaded={progress.loaded || 0}
                    totalBytes={progress.total || 0}
                    fileName={file?.name || 'Unknown File'}
                    onRetry={handleUploadAudio}
                    onCancel={handleCancel}
                    hasError={error}
                />
            )}

            {/* Metadata Extraction */}
            {status === 'uploaded' && !metadata && (
                <div className="text-center">
                    <p className="text-primary mb-6">File uploaded successfully! Extract metadata to continue.</p>
                    <JelloButton onClick={handleExtractMetadata}>Extract Metadata</JelloButton>
                    {error && <p className="error mt-4">{error}</p>}
                </div>
            )}

            {/* Metadata Extraction */}
            {status === 'processing' && (
                <>
                    <LoadingState width="w-60 sm:w-96" height="h-60 sm:h-96" />
                    {/* //cancel button */}
                    <JelloButton onClick={handleCancel}>Cancel</JelloButton>
                </>
            )}

            {/* Metadata Editing */}
            {status === 'extracted' && (
                <MetadataEditor fileUrl={fileUrl} fileId={fileId} coverImage={coverImage} metadata={metadata} onCancel={resetAudioEditor} />
            )}
        </div>
    )
}

export default AudioEditor
