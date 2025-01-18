import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import JelloButton from '../../components/common/buttons/JelloButton'
import API_ROUTES from '../../constants/api.constants'
import { META_TAGS } from '../../constants/audio.constants'
import iconMap from '../../constants/iconMap'
import useAuthToken from '../../context/AuthTokenContext'
import useSafeApiCall from '../../hooks/useSafeApiCall'

const AudioMetadataEditor = ({ metadata, coverImage, audioFileName, onCancel, onSuccess }) => {
    const { appApiClient } = useAuthToken()
    const { error, makeApiCall, cancelRequest } = useSafeApiCall({ apiClient: appApiClient })
    const [cover, setCover] = useState(coverImage)
    const [showAllTags, setShowAllTags] = useState(false)

    const validationSchema = Yup.object({
        ...Object.entries(META_TAGS).reduce((schema, [key, { validate }]) => {
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
        await makeApiCall({
            url: API_ROUTES.AUDIO.EDIT_METADATA,
            method: 'post',
            responseType: 'blob',
            onStart: () => {
                setSubmitting(true)
                const formData = new FormData()
                formData.append('audioFileName', audioFileName)
                if (values.cover) formData.append('cover', values.cover || '')
                values.cover = ''

                formData.append('metadata', JSON.stringify(values))
                return formData
            },
            onSuccess: (data) => {
                const url = window.URL.createObjectURL(new Blob([data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${values.title || 'edited_audio_file'}.${audioFileName.split('.').pop()}`)
                document.body.appendChild(link)
                link.click()

                link.parentNode.removeChild(link)
                window.URL.revokeObjectURL(url)

                if (onSuccess) onSuccess()
            },
            onEnd: () => {
                setSubmitting(false)
            },
        })
    }

    const initialFormValues = {
        ...Object.keys(META_TAGS).reduce((values, key) => {
            values[key] = metadata[key] || ''
            return values
        }, {}),
        cover: '',
    }

    const tagsToDisplay = showAllTags ? Object.entries(META_TAGS) : Object.entries(META_TAGS).slice(0, 10)

    return (
        <section aria-labelledby="editor-title" className="shadow-neumorphic-lg w-full max-w-(--breakpoint-lg) rounded-3xl border p-2 sm:p-6">
            <div className="grid place-items-center gap-4 rounded-2xl border p-6 sm:rounded-xl">
                <h1 className="text-primary font-aladin text-center text-3xl tracking-wider">Edit Tags</h1>

                <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleMetadataEdit}>
                    {({ isSubmitting, setFieldValue, resetForm }) => (
                        <Form className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start">
                            <div className="relative size-3/4 max-w-72 shrink-0">
                                <label
                                    htmlFor="cover"
                                    className="shadow-neumorphic-inset-xs block aspect-square cursor-pointer overflow-hidden rounded-xl border p-2">
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
                                    disabled={isSubmitting}
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        setFieldValue('cover', file)
                                        setCover(URL.createObjectURL(file))
                                    }}
                                />
                                <ErrorMessage
                                    name="cover"
                                    component="p"
                                    className="form-text mt-1 w-full text-center text-red-500 dark:text-red-500"
                                />
                            </div>

                            <div className="grid w-full grid-cols-1 place-items-center gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {tagsToDisplay.map(([key, { className, placeholder, type }]) => (
                                    <div key={key} className={`form-group ${className}`}>
                                        <label className="form-text" htmlFor={key}>
                                            {key === 'date' ? 'Year' : key.replace('_', ' ')}
                                        </label>
                                        <Field
                                            id={key}
                                            name={key}
                                            as={type === 'textarea' ? 'textarea' : 'input'}
                                            rows={type === 'textarea' ? 6 : undefined}
                                            type={type || 'text'}
                                            disabled={isSubmitting}
                                            placeholder={placeholder}
                                            autoComplete="off"
                                            className="form-field scrollbar-thin"
                                        />
                                        <ErrorMessage name={key} component="p" className="form-text text-red-500 dark:text-red-500" />
                                    </div>
                                ))}

                                <button
                                    className="button button-sm order-last col-span-full inline-flex items-center justify-center gap-2 text-sm"
                                    type="button"
                                    onClick={() => setShowAllTags((prev) => !prev)}>
                                    {showAllTags ? 'Show Less Tags' : 'Show All Tags'}
                                    <Icon icon={iconMap[showAllTags ? 'minus' : 'plus']} />
                                </button>

                                <div className="order-last col-span-full flex w-full justify-end gap-3 pt-6">
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
                                            cancelRequest()
                                            onCancel()
                                        }}>
                                        Cancel
                                    </JelloButton>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
                {error && <p className="col-span-full text-red-500 dark:text-red-500">{error}</p>}
            </div>
        </section>
    )
}

export default AudioMetadataEditor
