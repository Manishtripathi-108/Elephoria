import React, { useState } from 'react'

import { Icon } from '@iconify/react/dist/iconify.js'

import TabNavigation from '../../components/common/TabNavigation'
import JelloButton from '../../components/common/buttons/JelloButton'
import iconMap from '../../constants/iconMap'

const AudioConverter = () => {
    const [quality, setQuality] = useState(128) // Default quality set to Standard (128 kbps)
    const [format, setFormat] = useState('MP3') // Default format set to mp3

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
                        <input type="file" accept="audio/*" multiple className="form-field field-sizing-fixed max-w-sm p-1" />
                    </div>
                    /* Step 2: Format and Quality Selection */
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
                                        className={`cursor-pointer focus:outline-none ${quality == val ? 'text-highlight' : ''}`}>
                                        {
                                            ['Economy (64 kbps)', 'Standard (128 kbps)', 'Good (192 kbps)', 'Ultra (256 kbps)', 'Best (320 kbps)'][
                                                index
                                            ]
                                        }
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button className="text-blue-500 underline">Advanced Settings</button>
                            <button className="text-blue-500 underline">Edit Track Info</button>
                        </div>
                    </div>
                    {/* Step 3: Convert Button */}
                    <div className="w-full text-center">
                        <JelloButton variant="info" className="button">
                            Convert
                        </JelloButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AudioConverter
