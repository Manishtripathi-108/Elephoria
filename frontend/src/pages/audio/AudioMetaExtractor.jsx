import React, { useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react/dist/iconify.js'

import LoadingState from '../../components/Loading'
import UploadProgressBar from '../../components/common/UploadProgressBar'
import JelloButton from '../../components/common/buttons/JelloButton'
import UploadInput from '../../components/common/form/UploadInput'
import API_ROUTES from '../../constants/api.constants'
import APP_ROUTES from '../../constants/app.constants'
import iconMap from '../../constants/iconMap'
import { useAuthToken } from '../../context/AuthTokenProvider'
import AudioMetadataEditor from './AudioMetaEditor'

const INITIAL_UPLOAD_STATE = {
    status: 'idle', // idle | uploading | extracting | extracted | complete
    progress: { loaded: 0, total: 0 },
    errorMessage: null,
}

const INITIAL_EXTRACT_STATE = {
    metadata: {},
    coverImage: null,
    audioFileName: null,
}

const AudioMetaExtractor = () => {
    const { appApiClient } = useAuthToken()
    const [selectedAudioFile, setSelectedAudioFile] = useState(null)
    const [uploadState, setUploadState] = useState(INITIAL_UPLOAD_STATE)
    const [extractedData, setExtractedData] = useState(INITIAL_EXTRACT_STATE)
    const abortControllerRef = useRef(null)

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
    const handleExtraction = async (e) => {
        try {
            e.preventDefault()

            if (!selectedAudioFile) {
                setUploadState({ ...INITIAL_UPLOAD_STATE, errorMessage: 'Please select an audio file to upload.' })
                return
            }

            setUploadState({ ...INITIAL_UPLOAD_STATE, status: 'uploading' })

            const formData = new FormData()
            formData.append('audio', selectedAudioFile)

            // Set up AbortController for cancellation
            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal

            const response = await appApiClient.post(API_ROUTES.AUDIO.EXTRACT_METADATA, formData, {
                signal,
                onUploadProgress: (event) => {
                    setUploadState((prev) => ({ ...prev, progress: event }))
                    if (event.loaded === event.total) setUploadState((prev) => ({ ...prev, status: 'extracting' }))
                },
            })

            console.log('Upload Response:', response.data)
            if (response.data?.success) {
                window.addToast('Metadata extracted successfully!', 'success')
                const { metadata, coverImage, audioFileName } = response.data
                setExtractedData({ metadata, coverImage, audioFileName })
                setUploadState({ ...INITIAL_UPLOAD_STATE, status: 'extracted' })
            } else {
                throw new Error(response.data?.message || 'Metadata extraction failed.')
            }
        } catch (err) {
            if (!err.name === 'CanceledError') console.error('Upload failed:', err)
            setUploadState({ ...INITIAL_UPLOAD_STATE, errorMessage: err.response?.data?.message || err.message || 'Metadata extraction failed.' })
            window.addToast(err.response?.data?.message || err.message || 'Metadata extraction failed.', 'error')
        }
    }

    // Cancels ongoing upload or metadata extraction
    const cancelExtraction = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
            setUploadState(INITIAL_UPLOAD_STATE)
        }
    }

    // Resets the component states
    const resetStates = (status = 'idle') => {
        setUploadState({ ...INITIAL_UPLOAD_STATE, status })
        setExtractedData(INITIAL_EXTRACT_STATE)
        setSelectedAudioFile(null)
    }

    return (
        <div className="min-h-calc-full-height grid place-items-center gap-6 p-2 sm:p-6">
            {status === 'idle' && (
                <form
                    id="audio-upload-form"
                    onSubmit={handleExtraction}
                    className="shadow-neumorphic-lg flex w-full max-w-2xl rounded-3xl border p-2 sm:p-6">
                    <div className="grid size-full place-items-center rounded-2xl border p-6 sm:rounded-xl">
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
                    </div>
                </form>
            )}

            {/* Upload Progress Bar */}
            {status === 'uploading' && (
                <UploadProgressBar
                    bytesUploaded={progress.loaded || 0}
                    totalBytes={progress.total || 0}
                    fileName={selectedAudioFile?.name || 'Unknown File'}
                    onCancel={cancelExtraction}
                />
            )}

            {/* Metadata Extraction */}
            {status === 'extracting' && <LoadingState width="w-60 sm:w-96" height="h-60 sm:h-96" />}

            {/* extracted */}
            {status === 'extracted' && (
                <AudioMetadataEditor
                    metadata={extractedData.metadata}
                    coverImage={extractedData.coverImage}
                    audioFileName={extractedData.audioFileName}
                    onSuccess={() => resetStates('complete')}
                    onCancel={() => resetStates('idle')}
                />
            )}

            {/* Complete */}
            {status === 'complete' && (
                <section className="bg-primary shadow-neumorphic-sm w-full max-w-md rounded-3xl border p-2 text-center sm:p-6">
                    <div className="size-full rounded-2xl border p-6 sm:rounded-xl">
                        <Icon icon={iconMap.success} className="mx-auto mb-2 size-16 text-green-500" />
                        <h1 className="text-primary mb-2 text-2xl font-semibold">Success!</h1>
                        <p className="text-secondary mb-6">The meta tags for the audio file have been successfully updated.</p>

                        <div className="flex justify-center space-x-4">
                            <button onClick={() => resetStates('idle')} className="button">
                                Edit More
                            </button>
                            <Link to={APP_ROUTES.ROOT} className="button">
                                Home
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default AudioMetaExtractor
