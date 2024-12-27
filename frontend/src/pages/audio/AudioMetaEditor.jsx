import React, { useEffect, useRef, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { Icon } from '@iconify/react'
import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import FileDownload from '../../components/common/FileDownload'
import JelloButton from '../../components/common/buttons/JelloButton'
import API_ROUTES from '../../constants/apiEndpoints'
import ROUTES from '../../constants/routes'
import { iconMap } from '../../utils/globalConstants'
import { metaTags } from './utils.js/constants'

const AudioMetadataEditor = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const { metadata, coverImage, audioFileId, audioFileUrl } = location.state || {}

    const [downloadUrl, setDownloadUrl] = useState(null)
    const [cover, setCover] = useState(coverImage)
    const [showAllTags, setShowAllTags] = useState(false)
    const abortControllerRef = useRef(null)

    // Check sessionStorage for the flag
    const fromExtractor = sessionStorage.getItem('fromExtractor') === 'true'

    useEffect(() => {
        // If not from the extractor, redirect to the AudioTagsExtractor page
        if (!fromExtractor) {
            navigate(ROUTES.AUDIO_TAGS_EXTRACTOR)
        }

        // Clear the sessionStorage flag after redirect or navigation
        return () => {
            sessionStorage.removeItem('fromExtractor')
        }
    }, [fromExtractor, navigate])

    if (!fromExtractor) return null

    useEffect(() => {
        if (abortControllerRef.current) {
            console.log('Aborting previous request...')

            abortControllerRef.current.abort()
        }
    }, [])

    // Validation schema for Formik
    const validationSchema = Yup.object({
        ...Object.entries(metaTags).reduce((schema, [key, { validate }]) => {
            if (validate) {
                schema[key] = validate
            }
            return schema
        }, {}),
        cover: Yup.mixed()
            .test('fileSize', 'File size must not exceed 5MB', (value) => !value || value.size <= 5 * 1024 * 1024)
            .test('fileType', 'File must be a valid image', (value) => !value || value.type.startsWith('image/')),
    })

    const handleMetadataEdit = async (values, { setSubmitting }) => {
        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('audioFileId', audioFileId)
            formData.append('audioFileUrl', audioFileUrl)
            if (values.cover) formData.append('cover', values.cover || '')
            values.cover = ''

            formData.append('metadata', JSON.stringify(values))

            // Set up AbortController for cancellation
            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal

            const response = await axios.post(API_ROUTES.AUDIO.EDIT_METADATA, formData, { signal })

            console.log('Edit Metadata Response:', response.data)
            if (response.data?.success) {
                setDownloadUrl(response.data.editedFileUrl)
                window.addToast('Metadata edited successfully!', 'success')
            } else {
                throw new Error(response.data?.message || 'An error occurred.')
            }
        } catch (error) {
            console.error('Error editing metadata:', error)
            window.addToast(error.response?.data?.message || 'Failed to edit metadata.', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    const initialFormValues = {
        ...Object.keys(metaTags).reduce((values, key) => {
            values[key] = metadata[key] || ''
            return values
        }, {}),
        cover: '',
    }

    const tagsToDisplay = showAllTags ? Object.entries(metaTags) : Object.entries(metaTags).slice(0, 10)

    return (
        <div className="flex-center px-2 py-6">
            {downloadUrl ? (
                <FileDownload
                    title="File Ready for Download"
                    description="The file has been successfully edited. Click below to download it."
                    buttonText="Download"
                    fileUrl={downloadUrl}
                    fileName={metadata.title || 'edited_audio_file'}
                />
            ) : (
                <div className="w-full max-w-screen-lg rounded-3xl border border-light-secondary p-2 shadow-neumorphic-lg dark:border-dark-secondary sm:p-6">
                    <div className="flex-center flex-col gap-4 rounded-2xl border border-light-secondary p-6 dark:border-dark-secondary sm:rounded-xl">
                        <h1 className="text-primary text-center font-aladin text-2xl tracking-wider">Edit Tags</h1>

                        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleMetadataEdit}>
                            {({ isSubmitting, setFieldValue, resetForm }) => (
                                <Form className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start">
                                    <div className="relative size-3/4 max-w-72 shrink-0">
                                        <label
                                            htmlFor="cover"
                                            className="block aspect-square cursor-pointer overflow-hidden rounded-xl border border-light-secondary p-2 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                                            <img
                                                src={cover}
                                                alt="Cover"
                                                className="size-full rounded-lg object-cover"
                                                title="Upload a 1:1 aspect ratio image. Other ratios will be adjusted automatically."
                                            />
                                        </label>
                                        <input
                                            id="cover"
                                            name="cover"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                setFieldValue('cover', file)
                                                setCover(URL.createObjectURL(file))
                                            }}
                                        />
                                        <ErrorMessage name="cover" component="p" className="form-helper-text error mt-1 w-full text-center" />
                                    </div>

                                    <div className="grid w-full grid-cols-1 place-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {tagsToDisplay.map(([key, { className, placeholder, type }]) => (
                                            <div key={key} className={`form-group ${className}`}>
                                                <Field
                                                    id={key}
                                                    name={key}
                                                    as={type === 'textarea' ? 'textarea' : 'input'}
                                                    rows={type === 'textarea' ? 6 : undefined}
                                                    type={type || 'text'}
                                                    placeholder={placeholder}
                                                    autoComplete="off"
                                                    className={type === 'textarea' ? 'input-textarea scrollbar-thin' : 'input-text'}
                                                />
                                                <label className="form-label" htmlFor={key}>
                                                    {key === 'date' ? 'Year' : key.replace('_', ' ')}
                                                </label>
                                                <ErrorMessage name={key} component="p" className="form-helper-text error order-3" />
                                            </div>
                                        ))}

                                        <div className="order-last col-span-1 flex w-full justify-end gap-4 sm:col-span-2 lg:col-span-3">
                                            <button
                                                className="button button-sm button-with-icon gap-1"
                                                type="button"
                                                onClick={() => setShowAllTags((prev) => !prev)}>
                                                {showAllTags ? 'Show Less' : 'Show All'}
                                                <Icon icon={iconMap[showAllTags ? 'up' : 'down']} className="size-4" />
                                            </button>
                                        </div>

                                        <div className="order-last col-span-1 flex w-full justify-end gap-4 pt-8 sm:col-span-2 lg:col-span-3">
                                            <JelloButton type="submit" disabled={isSubmitting} isSubmitting={isSubmitting}>
                                                Save Changes
                                            </JelloButton>
                                            <JelloButton
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    resetForm()
                                                    setCover(coverImage)
                                                }}>
                                                Reset
                                            </JelloButton>
                                            <JelloButton
                                                variant="danger"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    abortControllerRef.current?.abort()
                                                }}>
                                                Cancel
                                            </JelloButton>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AudioMetadataEditor
