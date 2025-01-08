import React, { useEffect, useRef, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import axios from 'axios'

import LoadingState from '../../components/Loading'
import UploadProgressBar from '../../components/common/UploadProgressBar'
import JelloButton from '../../components/common/buttons/JelloButton'
import UploadInput from '../../components/common/form/UploadInput'
import API_ROUTES from '../../constants/apiRoutes'
import APP_ROUTES from '../../constants/appRoutes'

const INITIAL_UPLOAD_STATE = {
    status: 'idle', // idle | uploading | processing
    progress: { loaded: 0, total: 0 },
    errorMessage: null,
}

const AudioMetaExtractor = () => {
    const [selectedAudioFile, setSelectedAudioFile] = useState(null)
    const [uploadState, setUploadState] = useState(INITIAL_UPLOAD_STATE)
    const abortControllerRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    // Access state passed via navigation
    const { error } = location.state || {}
    if (error) {
        window.addToast(error, 'error')
    }

    const { status, progress, errorMessage } = uploadState

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
                abortControllerRef.current = null
            }
        }
    }, [])

    // Handles audio file upload
    const handleAudioUpload = async (e) => {
        e.preventDefault()
        setUploadState(INITIAL_UPLOAD_STATE)

        if (!selectedAudioFile) {
            setUploadState({ ...INITIAL_UPLOAD_STATE, errorMessage: 'Please select an audio file to upload.' })
            return
        }

        const formData = new FormData()
        formData.append('audio', selectedAudioFile)

        // Set up AbortController for cancellation
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        setUploadState({ ...INITIAL_UPLOAD_STATE, status: 'uploading' })

        try {
            const response = await axios.post(API_ROUTES.AUDIO.UPLOAD, formData, {
                signal,
                onUploadProgress: (event) => {
                    setUploadState((prev) => ({ ...prev, progress: event }))
                    if (event.loaded === event.total) setUploadState((prev) => ({ ...prev, status: 'processing' }))
                },
            })

            console.log('Upload Response:', response.data)
            if (response.data?.success) {
                processMetadataExtraction(response.data.publicId, response.data.url)
            } else {
                throw new Error(response.data?.message || 'Upload failed.')
            }
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.error('Upload canceled:', err)
            } else {
                console.error('Upload failed:', err)
                setUploadState({ ...INITIAL_UPLOAD_STATE, errorMessage: err.response?.data?.message || 'Upload failed.' })
                window.addToast(err.response?.data?.message || 'Upload failed.', 'error')
            }
        }
    }

    // Handles metadata extraction after successful upload
    const processMetadataExtraction = async (audioFileId, audioFileUrl) => {
        if (!(audioFileId || audioFileUrl)) {
            setUploadState({ ...INITIAL_UPLOAD_STATE, errorMessage: 'Metadata extraction failed. Try again.' })
            return
        }

        // Set up AbortController for cancellation
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        try {
            const response = await axios.post(API_ROUTES.AUDIO.EXTRACT_METADATA, { audioFileId, audioFileUrl }, { signal })

            console.log('Metadata Extraction Response:', response.data)

            if (response.data?.success) {
                sessionStorage.setItem('fromExtractor', 'true')
                navigate(APP_ROUTES.AUDIO.TAGS_EXTRACTOR, {
                    state: {
                        metadata: response.data?.metadata?.format?.tags || null,
                        coverImage: response.data?.coverImage || null,
                        audioFileId,
                        audioFileUrl,
                    },
                })

                window.addToast('Metadata extracted successfully!', 'success')
            } else {
                throw new Error(response.data?.message || 'Metadata extraction failed.')
            }
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.error('Extraction canceled:', err)
            } else {
                console.error('Metadata extraction failed:', err)
                setUploadState({ ...INITIAL_UPLOAD_STATE, errorMessage: err.response?.data?.message || 'Metadata extraction failed.' })
                window.addToast(err.response?.data?.message || 'Metadata extraction failed.', 'error')
            }
        }
    }

    // Cancels ongoing upload or metadata extraction
    const cancelUploadOrExtraction = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
            setUploadState(INITIAL_UPLOAD_STATE)
        }
    }

    return (
        <div className="min-h-calc-full-height flex flex-col items-center justify-center gap-6 p-2">
            {status === 'idle' && (
                <form
                    id="audio-upload-form"
                    onSubmit={handleAudioUpload}
                    className="shadow-neumorphic-lg flex w-full max-w-2xl flex-col items-center justify-center rounded-3xl border p-6">
                    <h2 className="text-primary font-aladin mb-2 text-2xl tracking-wider">Upload Audio</h2>
                    <p className="text-primary mb-6 text-center">Upload an audio file to extract metadata and edit tags.</p>

                    <UploadInput
                        acceptType="audio/*"
                        className="shadow-neumorphic-xs mb-6"
                        id="audio-upload-input"
                        file={selectedAudioFile}
                        setFile={setSelectedAudioFile}
                    />

                    <JelloButton type="submit" disabled={status === 'uploading'}>
                        Edit Tags
                    </JelloButton>

                    {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
                </form>
            )}

            {/* Upload Progress Bar */}
            {status === 'uploading' && (
                <UploadProgressBar
                    bytesUploaded={progress.loaded || 0}
                    totalBytes={progress.total || 0}
                    fileName={selectedAudioFile?.name || 'Unknown File'}
                    onCancel={cancelUploadOrExtraction}
                />
            )}

            {/* Metadata Extraction */}
            {status === 'processing' && (
                <>
                    <LoadingState width="w-60 sm:w-96" height="h-60 sm:h-96" />
                    <JelloButton onClick={cancelUploadOrExtraction}>Cancel</JelloButton>
                </>
            )}
        </div>
    )
}

export default AudioMetaExtractor
