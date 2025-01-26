import React, { Suspense, lazy, useState } from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react/dist/iconify.js'

import LoadingState from '../../components/Loading'
import UploadProgressBar from '../../components/common/UploadProgressBar'
import JelloButton from '../../components/common/buttons/JelloButton'
import UploadInput from '../../components/common/form/UploadInput'
import API_ROUTES from '../../constants/api.constants'
import APP_ROUTES from '../../constants/app.constants'
import iconMap from '../../constants/iconMap'
import useAuthToken from '../../context/AuthTokenContext'
import useSafeApiCall from '../../hooks/useSafeApiCall'

const AudioMetadataEditor = lazy(() => import('./AudioMetaEditor'))

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
    const { makeApiCall, error: apiError, cancelRequest } = useSafeApiCall({ apiClient: appApiClient })
    const [selectedAudioFile, setSelectedAudioFile] = useState(null)
    const [uploadState, setUploadState] = useState(INITIAL_UPLOAD_STATE)
    const [extractedData, setExtractedData] = useState(INITIAL_EXTRACT_STATE)

    const { status, progress, errorMessage } = uploadState

    const handleExtraction = async (e) => {
        e.preventDefault()

        if (!selectedAudioFile) {
            setUploadState({ ...INITIAL_UPLOAD_STATE, errorMessage: 'Please select an audio file to upload.' })
            return
        }

        setUploadState({ ...INITIAL_UPLOAD_STATE, status: 'uploading' })

        const formData = new FormData()
        formData.append('audio', selectedAudioFile)

        makeApiCall({
            url: API_ROUTES.AUDIO.EXTRACT_METADATA,
            method: 'POST',
            data: formData,
            onUploadProgress: (event) => {
                setUploadState((prev) => ({ ...prev, progress: event }))
                if (event.loaded === event.total) setUploadState((prev) => ({ ...prev, status: 'extracting' }))
            },
            onSuccess: (data) => {
                const { metadata, coverImage, audioFileName } = data
                setExtractedData({ metadata, coverImage, audioFileName })
                setUploadState({ ...INITIAL_UPLOAD_STATE, status: 'extracted' })
            },
            onError: () => {
                setUploadState(INITIAL_UPLOAD_STATE)
            },
            onEnd: () => setUploadState((prev) => ({ ...prev, status: prev.status === 'uploading' ? 'extracting' : prev.status })),
        })
    }

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
                        <h2 className="text-text-primary font-aladin mb-2 text-2xl tracking-wider">Upload Audio</h2>
                        <p className="text-text-primary mb-6 text-center">Upload an audio file to extract metadata and edit tags.</p>

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

                        {(errorMessage || apiError) && <p className="mt-4 text-red-500">{errorMessage || apiError}</p>}
                    </div>
                </form>
            )}

            {/* Upload Progress Bar */}
            {status === 'uploading' && (
                <UploadProgressBar
                    bytesUploaded={progress.loaded || 0}
                    totalBytes={progress.total || 0}
                    fileName={selectedAudioFile?.name || 'Unknown File'}
                    onCancel={() => {
                        resetStates('idle')
                        cancelRequest()
                    }}
                />
            )}

            {/* Metadata Extraction */}
            {status === 'extracting' && <LoadingState width="w-60 sm:w-96" height="h-60 sm:h-96" />}

            {/* extracted */}
            {status === 'extracted' && (
                <Suspense fallback={<LoadingState width="w-60 sm:w-96" height="h-60 sm:h-96" />}>
                    <AudioMetadataEditor
                        metadata={extractedData.metadata}
                        coverImage={extractedData.coverImage}
                        audioFileName={extractedData.audioFileName}
                        onSuccess={() => resetStates('complete')}
                        onCancel={() => resetStates('idle')}
                    />
                </Suspense>
            )}

            {/* Complete */}
            {status === 'complete' && (
                <section className="bg-primary shadow-neumorphic-sm w-full max-w-md rounded-3xl border p-2 text-center sm:p-6">
                    <div className="size-full rounded-2xl border p-6 sm:rounded-xl">
                        <Icon icon={iconMap.success} className="mx-auto mb-2 size-16 text-green-500" />
                        <h1 className="text-text-primary mb-2 text-2xl font-semibold">Success!</h1>
                        <p className="text-text-secondary mb-6">The meta tags for the audio file have been successfully updated.</p>

                        <div className="flex justify-center space-x-4">
                            <button onClick={() => resetStates('idle')} className="button">
                                Edit More
                            </button>
                            <Link to={APP_ROUTES.INDEX} className="button">
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
