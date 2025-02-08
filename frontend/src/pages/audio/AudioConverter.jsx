import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'

import Modal, { closeModal, openModal } from '../../components/common/Modals'
import ProgressBar from '../../components/common/ProgressBar'
import TabNavigation from '../../components/common/TabNavigation'
import JelloButton from '../../components/common/buttons/JelloButton'
import API_ROUTES from '../../constants/api.constants'
import {
    AUDIO_CONVERTER_INITIAL_VALUES,
    MAX_FILES,
    QUALITY_OPTIONS,
    SUPPORTED_FORMATS,
    audioConverterValidationSchema,
} from '../../constants/audio.constants'
import iconMap from '../../constants/iconMap'
import useAuthToken from '../../context/AuthTokenContext'
import useSafeApiCall from '../../hooks/useSafeApiCall'
import useUploadProgress from '../../hooks/useUploadProgress'
import { getFileExtension } from '../../utils/file.utils'
import AudioOptions from './AudioOptions'

const AudioConverter = () => {
    const { appApiClient } = useAuthToken()
    const { isLoading, error, makeApiCall, cancelRequest } = useSafeApiCall(appApiClient)
    const { uploadState, resetUploadProgress, onUploadProgress } = useUploadProgress()
    const [open, setOpen] = useState({ values: null, name: null })

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
                    formData.append('formats', values.sameFormatForAll ? values.global.format : settings.format)
                    formData.append('qualities', values.sameFormatForAll ? values.global.quality : settings.quality)
                    formData.append('advanceSettings', values.sameFormatForAll ? values.global.advanceSettings : settings.advanceSettings)
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
            onUploadProgress,
            onEnd: () => {
                resetUploadProgress()
                console.log('Audio conversion completed.')
            },
        })
    }

    const openAdvancedSettings = (values, name) => {
        setOpen({ values, name })
        openModal('advancedSettingsModal')
    }

    return (
        <div className="min-h-calc-full-height text-text-secondary grid place-items-center p-2">
            <div className="shadow-neumorphic-lg w-full max-w-(--breakpoint-lg) rounded-2xl border bg-inherit p-2 sm:p-6">
                <div className="w-full rounded-xl border p-6">
                    <h1 className="text-text-primary text-center text-4xl font-bold">Audio Converter</h1>
                    <p className="mb-6 text-center">Upload audio files and convert them to different formats and qualities.</p>

                    {!isLoading && (
                        <>
                            <Formik
                                initialValues={AUDIO_CONVERTER_INITIAL_VALUES}
                                validationSchema={audioConverterValidationSchema}
                                onSubmit={handleSubmit}>
                                {({ setFieldValue, values, resetForm }) => (
                                    <>
                                        <Form className="space-y-6">
                                            {/* File Upload */}
                                            <div
                                                className={`form-group flex flex-col items-center justify-center ${values.files.length > 0 ? 'hidden' : ''}`}>
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
                                                                const validFiles = [...values.files, ...newFiles]
                                                                    .slice(0, MAX_FILES)
                                                                    .filter(
                                                                        (file, index, self) =>
                                                                            self.findIndex((f) => f.name === file.name && f.size === file.size) ===
                                                                            index
                                                                    )

                                                                setFieldValue('files', validFiles)
                                                                setFieldValue(
                                                                    'fileSettings',
                                                                    validFiles.map((file, index) => values.fileSettings[index] || values.global)
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
                                                                <div className="relative flex w-full min-w-0 shrink items-center gap-4">
                                                                    <span className="shadow-neumorphic-xs block rounded-lg border p-1.5">
                                                                        <Icon icon={iconMap.music} className="size-7" />
                                                                    </span>
                                                                    <span>
                                                                        <p
                                                                            className="text-text-primary mr-10 line-clamp-1 text-sm font-medium"
                                                                            title={file.name}>
                                                                            {file.name}
                                                                        </p>
                                                                        <p className="text-text-secondary inline text-xs">
                                                                            {`${getFileExtension(file.name).toUpperCase()} - ${(file.size / 1024 ** 2).toFixed(2)} MB`}
                                                                        </p>
                                                                        <ErrorMessage
                                                                            name={`fileSettings.${index}.format`}
                                                                            component="p"
                                                                            className="ml-4 inline-block text-center text-sm text-red-500"
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
                                                                            <button
                                                                                type="button"
                                                                                className="sm:button rounded-full p-2"
                                                                                onClick={() =>
                                                                                    openAdvancedSettings(
                                                                                        values.fileSettings[index]?.advanceSettings,
                                                                                        `fileSettings.${index}.advanceSettings`
                                                                                    )
                                                                                }>
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
                                                                    <span className="form-text text-sm">
                                                                        Use the same format and quality for all files
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        )}

                                                        <ErrorMessage name="files" component="p" className="mt-1 text-center text-sm text-red-500" />

                                                        {/* Add More Files Button */}
                                                        <JelloButton
                                                            icon={iconMap.filePlus}
                                                            className="mt-4 ml-auto block"
                                                            disabled={isLoading || values.files.length >= MAX_FILES}
                                                            onClick={() => {
                                                                if (values.files.length >= MAX_FILES) return
                                                                document.getElementById('file-upload').click()
                                                            }}>
                                                            Add more Files
                                                        </JelloButton>
                                                    </div>

                                                    {(values.files.length < 2 || values.sameFormatForAll) && (
                                                        <div className="w-full border-b pb-6">
                                                            <p className="text-text-primary text-base">Format</p>
                                                            <TabNavigation
                                                                tabs={SUPPORTED_FORMATS}
                                                                currentTab={values.global.format}
                                                                onTabChange={(tab) => setFieldValue('global.format', tab)}
                                                                className="mt-2"
                                                            />
                                                            <ErrorMessage name="global.format" component="p" className="mt-2 text-sm text-red-500" />

                                                            <div className="mt-4">
                                                                <label htmlFor="global.quality" className="text-text-primary text-base">
                                                                    Quality
                                                                </label>
                                                                <Field
                                                                    as="input"
                                                                    type="range"
                                                                    name="global.quality"
                                                                    min="64"
                                                                    max="320"
                                                                    step="64"
                                                                    style={{
                                                                        '--value-percentage': `${((values.global.quality - 64) / (320 - 64)) * 100}%`,
                                                                    }}
                                                                    onChange={(e) => setFieldValue('global.quality', Number(e.target.value))}
                                                                    className="form-field mt-2 w-full"
                                                                />
                                                                <div className="mt-2 flex justify-between text-sm">
                                                                    {QUALITY_OPTIONS.map(({ label, value }) => (
                                                                        <button
                                                                            key={value}
                                                                            type="button"
                                                                            className={`cursor-pointer focus:outline-none ${
                                                                                values.global.quality === value ? 'text-highlight font-bold' : ''
                                                                            }`}
                                                                            onClick={() => setFieldValue('global.quality', value)}>
                                                                            {label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                <ErrorMessage
                                                                    name="global.quality"
                                                                    component="p"
                                                                    className="mt-2 text-sm text-red-500"
                                                                />
                                                            </div>

                                                            <JelloButton
                                                                icon={iconMap.settings}
                                                                className="mt-4 ml-auto block"
                                                                onClick={() =>
                                                                    openAdvancedSettings(values.global.advanceSettings, 'global.advanceSettings')
                                                                }>
                                                                Advanced Settings
                                                            </JelloButton>
                                                        </div>
                                                    )}

                                                    <div className="mt-5 flex w-full justify-between">
                                                        <JelloButton
                                                            disabled={isLoading}
                                                            className="mr-2"
                                                            onClick={() => resetForm()}
                                                            variant="danger"
                                                            iconClasses="size-4"
                                                            icon={iconMap.trash}>
                                                            Clear
                                                        </JelloButton>
                                                        <JelloButton
                                                            type="submit"
                                                            isSubmitting={isLoading}
                                                            variant="accent"
                                                            icon={iconMap.musicConvert}>
                                                            Convert
                                                        </JelloButton>
                                                    </div>
                                                </>
                                            )}
                                        </Form>

                                        <Modal modalId="advancedSettingsModal" title="Advanced Settings">
                                            <AudioOptions
                                                values={open.values}
                                                onApply={(values) => {
                                                    setFieldValue(open.name, values)
                                                    setOpen({ values: null, name: null })
                                                    closeModal('advancedSettingsModal')
                                                }}
                                            />
                                        </Modal>
                                    </>
                                )}
                            </Formik>
                        </>
                    )}

                    {/* Progress Bar */}
                    {isLoading && (
                        <div className="rounded-xl border p-6">
                            <h2 className="text-text-primary text-center text-2xl font-bold">Uploading...</h2>

                            <p className="mt-4 text-center text-lg">{`${uploadState.formattedLoaded}/${uploadState.formattedTotal}`}</p>
                            <p className="mt-4 text-center text-lg">{uploadState.formattedRate}</p>
                            <p className="mt-4 text-center text-lg">{uploadState.formattedEstimated}</p>
                            <p className="mt-4 text-center text-lg">{uploadState.formattedProgress}</p>

                            <ProgressBar percentage={uploadState.progress} className="mt-6 h-3 p-0" />

                            {/* cancel btn */}
                            <div className="flex justify-center">
                                <JelloButton className="mt-6" variant="danger" onClick={cancelRequest}>
                                    Cancel
                                </JelloButton>
                            </div>
                        </div>
                    )}

                    {/* Error Handling */}
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default AudioConverter
