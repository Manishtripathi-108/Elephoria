import React from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import TabNavigation from '../../components/common/TabNavigation'
import JelloButton from '../../components/common/buttons/JelloButton'
import API_ROUTES from '../../constants/api.constants'
import iconMap from '../../constants/iconMap'
import useAuthToken from '../../context/AuthTokenContext'
import useSafeApiCall from '../../hooks/useSafeApiCall'

const SUPPORTED_FORMATS = ['AAC', 'MP3', 'WMA', 'AIFF', 'FLAC', 'OGG', 'M4A', 'WAV']
const QUALITY_OPTIONS = [
    { label: 'Economy (64 kbps)', value: 64 },
    { label: 'Standard (128 kbps)', value: 128 },
    { label: 'Good (192 kbps)', value: 192 },
    { label: 'Ultra (256 kbps)', value: 256 },
    { label: 'Best (320 kbps)', value: 320 },
]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
const MAX_FILES = 10

const validationSchema = Yup.object().shape({
    files: Yup.mixed()
        .test('fileCount', `You can only upload up to ${MAX_FILES} files`, (files) => files && files.length <= MAX_FILES)
        .test('fileType', 'Only audio files are allowed', (files) => Array.from(files || []).every((file) => file.type.startsWith('audio/')))
        .test('fileSize', 'Each file must be under 10MB', (files) => Array.from(files || []).every((file) => file.size <= MAX_FILE_SIZE))
        .test('required', 'Please upload at least one file', (files) => files && files.length > 0),
    format: Yup.string().oneOf(SUPPORTED_FORMATS, 'Invalid format').required('Format is required'),
    quality: Yup.number()
        .oneOf(
            QUALITY_OPTIONS.map(({ value }) => value),
            'Invalid quality'
        )
        .required('Quality is required'),
})

const AudioConverter = () => {
    const { appApiClient } = useAuthToken()
    const { isLoading, error, makeApiCall } = useSafeApiCall(appApiClient)

    const handleSubmit = async (values) => {
        // console.log('Form Values:', values)
        // return

        makeApiCall({
            url: API_ROUTES.AUDIO.CONVERT_AUDIO,
            method: 'POST',
            responseType: 'blob',
            onStart: () => {
                const formData = new FormData()
                Array.from(values.files).forEach((file) => formData.append('files', file))
                formData.append('format', values.format.toLowerCase())
                formData.append('quality', values.quality)
                return formData
            },
            onSuccess: (zipfile, response) => {
                const header = response.headers['content-disposition']
                let filename = 'converted_audio.zip'

                if (header) {
                    const matches = header.match(/filename="(.+)"/)
                    if (matches && matches[1]) {
                        filename = matches[1]
                    }
                }

                const url = window.URL.createObjectURL(new Blob([zipfile]))
                const link = document.createElement('a')
                link.href = url
                link.download = filename
                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(url)
            },
            onEnd: () => {
                console.log('Audio conversion completed.')
            },
        })
    }

    return (
        <div className="min-h-calc-full-height text-text-secondary grid place-items-center p-2">
            <div className="shadow-neumorphic-lg w-full max-w-(--breakpoint-lg) rounded-2xl border bg-inherit p-2 sm:p-6">
                <div className="w-full rounded-xl border p-6">
                    {/* Header */}
                    <div className="border-none pb-6 text-center">
                        <h1 className="text-text-primary text-4xl font-bold">Audio Converter</h1>
                        <p>Upload an audio file and convert it to another format and quality.</p>
                    </div>

                    {/* Formik Form */}
                    <Formik initialValues={{ files: [], format: 'MP3', quality: 128 }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ setFieldValue, values }) => (
                            <Form className="space-y-6 divide-y-2">
                                {/* Step 1: File Upload */}
                                <div className="form-group flex flex-col items-center justify-center pb-6">
                                    <label htmlFor="file-upload" className="sr-only">
                                        Upload Audio Files
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        accept="audio/*"
                                        className="form-field field-sizing-fixed max-w-sm p-1"
                                        onChange={(e) => setFieldValue('files', Array.from(e.target.files))}
                                    />
                                    <ErrorMessage name="files" component="p" className="mt-2 text-sm text-red-500" />

                                    {/* Display selected files */}
                                    {values.files.length > 0 && (
                                        <ul className="bg-secondary shadow-neumorphic-xs mt-4 w-full max-w-sm rounded-xl p-2 text-sm">
                                            {values.files.map((file, index) => (
                                                <li
                                                    key={index}
                                                    className="border-primary flex items-center justify-between border-b py-2 last:border-none">
                                                    <span className="truncate">{file.name}</span>
                                                    <button
                                                        type="button "
                                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newFiles = values.files.filter((_, i) => i !== index)
                                                            setFieldValue('files', newFiles)
                                                        }}>
                                                        <Icon icon={iconMap.close} className="size-5" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Step 2: Format & Quality Selection */}
                                <div className="w-full pb-6">
                                    <label className="text-text-primary text-base">Format</label>
                                    <TabNavigation
                                        tabs={SUPPORTED_FORMATS}
                                        currentTab={values.format}
                                        setCurrentTab={(tab) => setFieldValue('format', tab)}
                                        className="mt-2"
                                    />
                                    <ErrorMessage name="format" component="p" className="mt-2 text-sm text-red-500" />

                                    <div className="mt-4">
                                        <label className="text-text-primary text-base">Quality</label>
                                        <Field
                                            as="input"
                                            type="range"
                                            name="quality"
                                            min="64"
                                            max="320"
                                            step="64"
                                            style={{
                                                '--value-percentage': `${((values.quality - 64) / (320 - 64)) * 100}%`,
                                            }}
                                            onChange={(e) => setFieldValue('quality', Number(e.target.value))}
                                            className="form-field mt-2 w-full"
                                        />
                                        <div className="mt-2 flex justify-between text-sm">
                                            {QUALITY_OPTIONS.map(({ label, value }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    className={`cursor-pointer focus:outline-none ${
                                                        values.quality === value ? 'text-highlight font-bold' : ''
                                                    }`}
                                                    onClick={() => setFieldValue('quality', value)}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                        <ErrorMessage name="quality" component="p" className="mt-2 text-sm text-red-500" />
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button type="button" className="button flex items-center justify-center gap-2">
                                            <Icon icon={iconMap.settings} className="size-5" />
                                            Advanced Settings
                                        </button>
                                    </div>
                                </div>

                                {/* Step 3: Convert Button */}
                                <div className="w-full text-center">
                                    <JelloButton variant="info" isSubmitting={isLoading} type="submit">
                                        Convert
                                    </JelloButton>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {/* Error Handling */}
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default AudioConverter
