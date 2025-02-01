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

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_FILES = 10

const validationSchema = Yup.object().shape({
    files: Yup.array()
        .min(1, 'Please upload at least one file')
        .max(MAX_FILES, `You can only upload up to ${MAX_FILES} files`)
        .of(
            Yup.mixed()
                .test('fileType', 'Only audio files are allowed', (file) => file && file.type.startsWith('audio/'))
                .test('fileSize', 'Each file must be under 50MB', (file) => file && file.size <= MAX_FILE_SIZE)
        ),
    fileSettings: Yup.array().of(
        Yup.object().shape({
            format: Yup.string().oneOf(SUPPORTED_FORMATS, 'Invalid format').required('Format is required'),
            quality: Yup.number()
                .oneOf(
                    QUALITY_OPTIONS.map(({ value }) => value),
                    'Invalid quality'
                )
                .required('Quality is required'),
        })
    ),
    globalFormat: Yup.string().oneOf(SUPPORTED_FORMATS, 'Invalid format').required('Format is required'),
    globalQuality: Yup.number()
        .oneOf(
            QUALITY_OPTIONS.map(({ value }) => value),
            'Invalid quality'
        )
        .required('Quality is required'),
    sameFormatForAll: Yup.boolean(),
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

                values.fileSettings.forEach((settings) => {
                    formData.append('formats', values.sameFormatForAll ? values.globalFormat : settings.format)
                    formData.append('qualities', values.sameFormatForAll ? values.globalQuality : settings.quality)
                })

                return formData
            },
            onSuccess: (zipfile, response) => {
                const filename = response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'converted_audio.zip'
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
                    <h1 className="text-text-primary text-center text-4xl font-bold">Audio Converter</h1>
                    <p className="mb-6 text-center">Upload audio files and convert them to different formats and qualities.</p>

                    <Formik
                        initialValues={{ files: [], sameFormatForAll: true, globalFormat: 'M4A', globalQuality: 128, fileSettings: [] }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                        {({ setFieldValue, values, resetForm }) => (
                            <Form className="space-y-6">
                                {/* File Upload */}
                                <div className={`form-group flex flex-col items-center justify-center ${values.files.length > 0 ? 'hidden' : ''}`}>
                                    <div className="relative m-20 aspect-square w-full max-w-32">
                                        <span className="shadow-neumorphic-sm animate-waves absolute inset-0 h-full w-full rounded-full" />
                                        <span
                                            className="shadow-neumorphic-sm animate-waves absolute inset-0 h-full w-full rounded-full"
                                            style={{ animationDelay: '2.5s' }}
                                        />
                                        <label className="bg-primary button relative aspect-square w-full cursor-pointer rounded-full p-2">
                                            <input
                                                id="file-upload"
                                                type="file"
                                                multiple
                                                accept="audio/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const newFiles = Array.from(e.target.files)
                                                    const validFiles = [...values.files, ...newFiles].slice(0, MAX_FILES)

                                                    setFieldValue('files', validFiles)
                                                    setFieldValue(
                                                        'fileSettings',
                                                        validFiles.map(
                                                            (file, index) =>
                                                                values.fileSettings[index] || {
                                                                    format: values.globalFormat,
                                                                    quality: values.globalQuality,
                                                                }
                                                        )
                                                    )
                                                }}
                                            />
                                            <Icon icon={iconMap.upload} className="text-accent size-15" />
                                        </label>
                                    </div>
                                </div>

                                {/* File List */}
                                {values.files.length > 0 && (
                                    <>
                                        <div className="w-full border-b pb-6">
                                            {values.files.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="shadow-neumorphic-inset-xs mb-2 flex w-full flex-col items-center justify-between gap-4 rounded-xl border p-4 sm:flex-row">
                                                    {/* File Info */}
                                                    <div className="relative w-full min-w-0 shrink">
                                                        <Icon icon={iconMap.music} className="float-left mr-2 size-7" />
                                                        <p className="text-text-primary mr-10 line-clamp-1 text-sm font-medium" title={file.name}>
                                                            {file.name}
                                                        </p>
                                                        <span>
                                                            <p className="text-text-secondary inline text-xs">
                                                                {(file.size / 1024 ** 2).toFixed(2)} MB
                                                            </p>
                                                            <ErrorMessage
                                                                name={`fileSettings.${index}.format`}
                                                                component="p"
                                                                className="ml-5 inline-block text-center text-sm text-red-500"
                                                            />
                                                        </span>

                                                        {/* Mobile Delete Button */}
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-2 text-red-500 transition hover:text-red-600 sm:hidden"
                                                            onClick={() => {
                                                                const newFiles = values.files.filter((_, i) => i !== index)
                                                                const newFileSettings = values.fileSettings.filter((_, i) => i !== index)
                                                                setFieldValue('files', newFiles)
                                                                setFieldValue('fileSettings', newFileSettings)
                                                            }}>
                                                            <Icon icon={iconMap.closeAnimated} className="size-5" />
                                                        </button>
                                                    </div>

                                                    {/* Actions (Format Select + Buttons) */}
                                                    <div className="flex w-full items-center justify-between sm:w-auto sm:space-x-4">
                                                        {!values.sameFormatForAll && values.files.length > 1 && (
                                                            <>
                                                                {/* Format Selection */}
                                                                <Field
                                                                    as="select"
                                                                    name={`fileSettings.${index}.format`}
                                                                    className="form-field w-fit text-sm">
                                                                    {SUPPORTED_FORMATS.map((format) => (
                                                                        <option key={format} value={format}>
                                                                            {format}
                                                                        </option>
                                                                    ))}
                                                                </Field>

                                                                {/* Settings Button */}
                                                                <button type="button" className="sm:button rounded-full p-2">
                                                                    <Icon icon={iconMap.settingsOutlined} className="size-5" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {/* Desktop Delete Button */}
                                                        <button
                                                            type="button"
                                                            className="button hidden rounded-xl p-2 text-red-500 sm:block"
                                                            onClick={() => {
                                                                const newFiles = values.files.filter((_, i) => i !== index)
                                                                const newFileSettings = values.fileSettings.filter((_, i) => i !== index)
                                                                setFieldValue('files', newFiles)
                                                                setFieldValue('fileSettings', newFileSettings)
                                                            }}>
                                                            <Icon icon={iconMap.closeAnimated} className="size-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Same Format for All */}
                                            {values.files.length > 1 && (
                                                <div className="mt-4 ml-4 w-full">
                                                    <label className="form-checkbox">
                                                        <Field type="checkbox" name="sameFormatForAll" className="checkbox-field" />
                                                        <span className="form-text text-sm">Use the same format and quality for all files</span>
                                                    </label>
                                                </div>
                                            )}

                                            <ErrorMessage name="files" component="p" className="mt-1 text-center text-sm text-red-500" />

                                            {/* Add More Files Button */}
                                            <div className="mt-4 flex w-full justify-end">
                                                <JelloButton
                                                    icon={iconMap.filePlus}
                                                    disabled={isLoading || values.files.length >= MAX_FILES}
                                                    onClick={() => {
                                                        if (values.files.length >= MAX_FILES) return
                                                        document.getElementById('file-upload').click()
                                                    }}>
                                                    Add more Files
                                                </JelloButton>
                                            </div>
                                        </div>

                                        {(values.files.length < 2 || values.sameFormatForAll) && (
                                            <div className="w-full border-b pb-6">
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
                                            </div>
                                        )}

                                        <div className="mt-5 flex w-full justify-between">
                                            <JelloButton
                                                isSubmitting={isLoading}
                                                className="mr-2"
                                                onClick={() => resetForm()}
                                                variant="danger"
                                                iconClasses="size-4"
                                                icon={iconMap.trash}>
                                                Clear
                                            </JelloButton>
                                            <JelloButton type="submit" isSubmitting={isLoading} variant="accent" icon={iconMap.musicConvert}>
                                                Convert
                                            </JelloButton>
                                        </div>
                                    </>
                                )}
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
