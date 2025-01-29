import React, { useState } from 'react'

import { Icon } from '@iconify/react/dist/iconify.js'

import TabNavigation from '../../components/common/TabNavigation'
import JelloButton from '../../components/common/buttons/JelloButton'
import API_ROUTES from '../../constants/api.constants'
import iconMap from '../../constants/iconMap'
import useAuthToken from '../../context/AuthTokenContext'
import useSafeApiCall from '../../hooks/useSafeApiCall'

const AudioConverter = () => {
    const { appApiClient } = useAuthToken()
    const [quality, setQuality] = useState(128)
    const [file, setFile] = useState(null)
    const [format, setFormat] = useState('MP3')
    const { isLoading, error, data, makeApiCall, cancelRequest } = useSafeApiCall(appApiClient)

    const convertAudio = async () => {
        const formData = new FormData()
        formData.append('audio', file)
        formData.append('format', format.toLowerCase())
        formData.append('quality', quality)

        makeApiCall({
            url: API_ROUTES.AUDIO.CONVERT_AUDIO,
            method: 'POST',
            data: formData,
            responseType: 'blob',
            onSuccess: (response) => {
                const url = window.URL.createObjectURL(new Blob([response]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${file.name.split('.')[0]}.${format.toLowerCase()}`)
                document.body.appendChild(link)
                link.click()
                link.remove()
            },
        })
    }

    return (
        <div className="min-h-calc-full-height text-text-secondary grid place-items-center p-2">
            <div className="shadow-neumorphic-lg w-full max-w-(--breakpoint-lg) rounded-2xl border bg-inherit p-2 sm:p-6">
                <div className="w-full space-y-6 divide-y-2 rounded-xl border p-6">
                    <div className="border-none pb-6 text-center">
                        <h1 className="text-text-primary text-4xl font-bold">Audio Converter</h1>
                        <p>Upload an audio file to convert it to a different format and quality.</p>
                    </div>

                    {/* Step 1: File Upload */}
                    <div className="form-group flex flex-col items-center justify-center pb-6">
                        <label htmlFor="file" className="sr-only">
                            Upload File
                        </label>
                        <input
                            type="file"
                            // accept="audio/*"
                            multiple
                            className="form-field field-sizing-fixed max-w-sm p-1"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    {/* Step 2: Format and Quality Selection */}
                    <div className="w-full pb-6">
                        <label htmlFor="format" className="text-text-primary text-base">
                            Format
                        </label>
                        <TabNavigation
                            tabs={['AAC', 'AMR', 'MP3', 'WMA', 'AIFF', 'FLAC', 'OGG', 'ALAC', 'M4A', 'WAV']}
                            currentTab={format}
                            setCurrentTab={setFormat}
                            className="mt-2"
                        />
                        <div className="mt-4">
                            <label htmlFor="quality" className="text-text-primary text-base">
                                Quality
                            </label>
                            <input
                                id="quality"
                                type="range"
                                min="64"
                                max="320"
                                step="64"
                                value={quality}
                                style={{
                                    '--value-percentage': `${((quality - 64) / (320 - 64)) * 100}%`,
                                }}
                                onChange={(e) => setQuality(e.target.value)}
                                className="form-field mt-2 w-full"
                            />

                            <div className="mt-2 flex justify-between text-sm">
                                {['64', '128', '192', '256', '320'].map((val, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setQuality(parseInt(val))}
                                        className={`hover:text-text-primary cursor-pointer focus:outline-none ${quality == val ? 'text-highlight' : ''}`}>
                                        {
                                            ['Economy (64 kbps)', 'Standard (128 kbps)', 'Good (192 kbps)', 'Ultra (256 kbps)', 'Best (320 kbps)'][
                                                index
                                            ]
                                        }
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="button flex items-center justify-center gap-2">
                                <Icon icon={iconMap.settings} className="size-5" />
                                Advanced Settings
                            </button>
                        </div>
                    </div>
                    {/* Step 3: Convert Button */}
                    <div className="w-full text-center">
                        <JelloButton variant="info" isSubmitting={isLoading} onClick={convertAudio}>
                            Convert
                        </JelloButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AudioConverter
