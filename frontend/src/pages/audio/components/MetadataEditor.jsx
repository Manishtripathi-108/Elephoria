import React from 'react'

import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import JelloButton from '../../../components/common/buttons/JelloButton'

const tagOrder = {
    title: { className: 'order-1 col-span-2 sm:col-span-2', placeholder: 'i.e. My Song' },
    artist: { className: 'order-2 col-span-1', placeholder: 'i.e. John Doe' },
    album: { className: 'order-3 col-span-1', placeholder: 'i.e. My Album' },
    album_artist: { className: 'order-4 col-span-1', placeholder: 'i.e. John Doe, Jane Doe' },
    genre: { className: 'order-5 col-span-1 sm:col-span-2 lg:col-span-2', placeholder: 'i.e. Pop, Rock, Country' },
    date: { className: 'order-6 col-span-1', placeholder: 'i.e. 2021', validate: Yup.string().matches(/^\d{4}$/, 'Year must be a 4-digit number') },
    track: { className: 'order-7 col-span-1', placeholder: 'i.e. 1' },
    lyrics: { className: 'order-8 col-span-1 sm:col-span-2 lg:col-span-3', placeholder: 'i.e. Lyrics' },
}

const MetadataEditor = ({ fileName, coverImage, metadata, onCancel }) => {
    const handleEditMetadata = async (values, { setSubmitting }) => {
        if (!fileName || !values) return

        setSubmitting(true)
        try {
            console.log('Editing metadata:', values)

            const response = await axios.post('/api/audio/edit-metadata', { name: fileName, metadata: values }, { responseType: 'blob' })

            const originalFilename = response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'edited_audio.mp3'

            // Download the updated file
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', originalFilename)
            document.body.appendChild(link)
            link.click()
            link.remove()

            window.addToast('Metadata edited successfully!', 'success')
        } catch (error) {
            console.error('Failed to edit metadata:', error)
            window.addToast(error.response?.data?.message || 'Failed to edit metadata.', 'error')
        }
        setSubmitting(false)
    }

    const addNewTag = (values, setFieldValue) => {
        const newTagKey = `description`
        setFieldValue(newTagKey, '')
    }

    const validationSchema = Yup.object(
        Object.keys(tagOrder).reduce((schema, key) => {
            const tagValidation = tagOrder[key].validate
            if (tagValidation) {
                schema[key] = tagValidation
            }
            return schema
        }, {})
    )

    return (
        <div className="w-full max-w-screen-lg rounded-3xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
            <h2 className="text-primary mb-6 text-center font-aladin text-2xl tracking-wider">Edit Tags</h2>

            {/* Cover Image and Metadata Form */}
            <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start">
                <div className="size-72 shrink-0 overflow-hidden rounded-xl border border-light-secondary p-2 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                    <img src={coverImage} alt="Cover Image" className="h-full w-full rounded-lg object-cover" />
                </div>

                {/* Metadata Form */}
                <Formik initialValues={metadata} validationSchema={validationSchema} onSubmit={handleEditMetadata}>
                    {({ values, isSubmitting, setFieldValue }) => (
                        <Form className="w-full space-y-6">
                            {/* Metadata Fields */}
                            <div className="grid w-full grid-cols-1 place-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(tagOrder).map(([key, { className, placeholder }]) => (
                                    <div key={key} className={`form-group ${className}`}>
                                        <Field
                                            id={key}
                                            rows="10"
                                            name={key}
                                            as={key === 'lyrics' ? 'textarea' : 'input'}
                                            className={key === 'lyrics' ? 'input-textarea scrollbar-thin' : 'input-text'}
                                            placeholder={placeholder}
                                        />
                                        <label className="form-label" htmlFor={key}>
                                            {key === 'date' ? 'Year' : key.replace('_', ' ')}
                                        </label>
                                        <ErrorMessage name={key} component="div" className="form-helper-text error" />
                                    </div>
                                ))}

                                {/* Additional Metadata */}
                                {Object.entries(values)
                                    .filter(([key]) => !Object.keys(tagOrder).includes(key))
                                    .map(([key]) => (
                                        <div key={key} className="form-group order-last">
                                            <Field id={key} name={key} className="input-text" placeholder={`Enter ${key.replace('_', ' ')}`} />
                                            <label className="form-label" htmlFor={key}>
                                                {key.replace('_', ' ')}
                                            </label>
                                            <ErrorMessage name={key} component="div" className="form-helper-text error" />
                                        </div>
                                    ))}
                            </div>

                            {/* Add Tag Button */}
                            <JelloButton
                                variant="info"
                                onClick={(e) => {
                                    e.preventDefault()
                                    addNewTag(values, setFieldValue)
                                }}
                                disabled={isSubmitting}>
                                Add New Tag
                            </JelloButton>

                            {/* Action Buttons */}
                            <div className="ml-auto mt-8 flex w-full justify-end gap-4">
                                <JelloButton type="submit" disabled={Object.keys(values).length === 0} isSubmitting={isSubmitting}>
                                    Save Changes
                                </JelloButton>
                                <JelloButton
                                    variant="danger"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onCancel()
                                    }}>
                                    Cancel
                                </JelloButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default MetadataEditor
