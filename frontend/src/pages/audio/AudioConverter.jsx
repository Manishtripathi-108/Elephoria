import React, { useState } from 'react'

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
        .test('fileSize', 'Each file must be under 50MB', (files) => Array.from(files || []).every((file) => file.size <= MAX_FILE_SIZE))
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
                values.files.forEach((file) => formData.append('files', file))
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
                    <Formik
                        initialValues={{ files: [], sameFormatForAll: true, globalFormat: 'MP3', globalQuality: 128, fileSettings: [] }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                        {({ setFieldValue, values }) => (
                            <Form className="space-y-6 divide-y-2">
                                <div className="form-group flex flex-col items-center justify-center pb-6">
                                    <label htmlFor="file-upload" className="sr-only">
                                        Upload Audio Files
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        accept="audio/*"
                                        className={`form-field field-sizing-fixed max-w-sm p-1`}
                                        onChange={(e) => {
                                            const selectedFiles = Array.from(e.target.files)
                                            setFieldValue('files', selectedFiles)
                                            setFieldValue(
                                                'fileSettings',
                                                selectedFiles.map(() => ({ format: 'MP3', quality: 128 }))
                                            )
                                        }}
                                    />
                                    <ErrorMessage name="files" component="p" className="mt-2 text-sm text-red-500" />

                                    {values.files.length > 1 && (
                                        <div className="mt-4 w-full">
                                            <label className="flex items-center">
                                                <Field type="checkbox" name="sameFormatForAll" className="mr-2" />
                                                Use the same format and quality for all files
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full pb-6">
                                    {values?.files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="shadow-neumorphic-inset-xs mb-2 flex w-full flex-col items-center justify-between gap-4 rounded-xl border p-4 sm:flex-row">
                                            {/* File Info */}
                                            <div className="relative w-full min-w-0 shrink">
                                                <p className="text-text-primary mr-10 line-clamp-1 text-sm font-medium" title={file.name}>
                                                    {file.name}
                                                </p>
                                                <p className="text-text-secondary text-xs">{(file.size / 1024 ** 2).toFixed(2)} MB</p>

                                                {/* Mobile Delete Button */}
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-2 text-red-500 transition hover:text-red-600 sm:hidden"
                                                    onClick={() => {
                                                        const newFiles = values.files.filter((_, i) => i !== index)
                                                        setFieldValue('files', newFiles)
                                                        setFieldValue(
                                                            'fileSettings',
                                                            newFiles.map(() => ({ format: 'MP3', quality: 128 }))
                                                        )
                                                    }}>
                                                    <Icon icon={iconMap.closeAnimated} className="size-5" />
                                                </button>
                                            </div>

                                            {/* Actions (Format Select + Buttons) */}
                                            <div className="flex w-full items-center justify-between sm:w-auto sm:space-x-4">
                                                {!values.sameFormatForAll && (
                                                    <>
                                                        {/* Format Selection */}
                                                        <select
                                                            className="form-field w-fit text-sm"
                                                            value={'MP3'}
                                                            onChange={(e) => setFieldValue(index, e.target.value)}>
                                                            {SUPPORTED_FORMATS.map((format) => (
                                                                <option key={format} value={format}>
                                                                    {format}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* Settings Button */}
                                                        <button type="button" className="sm:button button-icon-only p-2">
                                                            <Icon icon={iconMap.settingsOutlined} className="size-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {/* Desktop Delete Button */}
                                                <button
                                                    type="button"
                                                    className="button button-icon-only-square hidden text-red-500 sm:block"
                                                    onClick={() => {
                                                        const newFiles = values.files.filter((_, i) => i !== index)
                                                        setFieldValue('files', newFiles)
                                                        setFieldValue(
                                                            'fileSettings',
                                                            newFiles.map(() => ({ format: 'MP3', quality: 128 }))
                                                        )
                                                    }}>
                                                    <Icon icon={iconMap.closeAnimated} className="size-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {values.files.length < 2 ||
                                        (values.sameFormatForAll && (
                                            <>
                                                <label className="text-text-primary text-base">Format</label>
                                                <TabNavigation
                                                    tabs={SUPPORTED_FORMATS}
                                                    currentTab={values.globalFormat}
                                                    setCurrentTab={(tab) => setFieldValue('globalFormat', tab)}
                                                    className="mt-2"
                                                />
                                                <ErrorMessage name="globalFormat" component="p" className="mt-2 text-sm text-red-500" />

                                                <div className="mt-4">
                                                    <label className="text-text-primary text-base">Quality</label>
                                                    <Field
                                                        as="input"
                                                        type="range"
                                                        name="globalQuality"
                                                        min="64"
                                                        max="320"
                                                        step="64"
                                                        style={{
                                                            '--value-percentage': `${((values.globalQuality - 64) / (320 - 64)) * 100}%`,
                                                        }}
                                                        onChange={(e) => setFieldValue('globalQuality', Number(e.target.value))}
                                                        className="form-field mt-2 w-full"
                                                    />
                                                    <div className="mt-2 flex justify-between text-sm">
                                                        {QUALITY_OPTIONS.map(({ label, value }) => (
                                                            <button
                                                                key={value}
                                                                type="button"
                                                                className={`cursor-pointer focus:outline-none ${
                                                                    values.globalQuality === value ? 'text-highlight font-bold' : ''
                                                                }`}
                                                                onClick={() => setFieldValue('globalQuality', value)}>
                                                                {label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <ErrorMessage name="globalQuality" component="p" className="mt-2 text-sm text-red-500" />
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <button type="button" className="button flex items-center justify-center gap-2">
                                                        <Icon icon={iconMap.settings} className="size-5" />
                                                        Advanced Settings
                                                    </button>
                                                </div>
                                            </>
                                        ))}
                                </div>

                                <div className="mt-5 flex w-full justify-between">
                                    <label htmlFor="file-upload">
                                        <JelloButton
                                            variant="info"
                                            icon={iconMap.plus}
                                            onClick={() => {
                                                if (values.files.length >= MAX_FILES) {
                                                    return
                                                }
                                                document.getElementById('file-upload').click()
                                            }}>
                                            Add more Files
                                        </JelloButton>
                                    </label>
                                    <JelloButton type="submit" variant="accent" icon={iconMap.musicConvert} iconClasses="size-5">
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
