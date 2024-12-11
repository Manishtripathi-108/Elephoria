import React from 'react'

import axios from 'axios'
import { Field, Form, Formik } from 'formik'

import JelloButton from '../../../components/common/buttons/JelloButton'

const tagOrder = {
    title: 'order-1 col-span-2 sm:col-span-2',
    artist: 'order-2 col-span-1',
    album: 'order-3 col-span-1',
    album_artist: 'order-4 col-span-1',
    genre: 'order-5 col-span-1 sm:col-span-2 lg:col-span-2',
    date: 'order-6 col-span-1',
    track: 'order-7 col-span-1',
    lyrics: 'order-8 col-span-1 sm:col-span-2 lg:col-span-3',
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
            // If an error occurs during the request itself
            console.error('Failed to edit tags 1:', error)

            // Attempt to read the error response
            if (error.response?.data) {
                const reader = new FileReader()
                reader.onload = () => {
                    const errorData = JSON.parse(reader.result)
                    window.addToast(errorData.message || 'Failed to edit tags.', 'error')
                }
                reader.readAsText(error.response.data)
            } else {
                window.addToast('Failed to edit tags.', 'error')
            }
        }
        setSubmitting(false)
    }

    if (!metadata) return 'Loading...'

    return (
        <div className="w-full max-w-screen-lg rounded-3xl border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary">
            <h2 className="text-primary mb-6 text-center font-aladin text-2xl tracking-wider">Edit Tags</h2>

            {/* Cover Image and Metadata Form */}
            <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start">
                <div className="size-72 shrink-0 overflow-hidden rounded-xl border border-light-secondary p-2 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                    <img src={coverImage} alt="Cover Image" className="h-full w-full rounded-lg object-cover" />
                </div>

                {/* Metadata Form */}
                <Formik initialValues={metadata} onSubmit={handleEditMetadata}>
                    {({ values, isSubmitting }) => (
                        <Form className="w-full space-y-6">
                            {/* Metadata Fields */}
                            <div className="grid w-full grid-cols-1 place-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(tagOrder).map(([key, value]) => (
                                    <div key={key} className={`form-group ${value}`}>
                                        <Field
                                            id={key}
                                            rows="10"
                                            name={key}
                                            as={key === 'lyrics' ? 'textarea' : 'input'}
                                            className={key === 'lyrics' ? 'input-textarea scrollbar-thin' : 'input-text'}
                                            max={key === 'date' ? new Date().getFullYear() : undefined}
                                            type={key === 'date' ? 'number' : 'text'}
                                            placeholder={`Enter ${key.replace('_', ' ')}`}
                                        />
                                        <label className="form-label" htmlFor={key}>
                                            {key === 'date' ? 'Year' : key.replace('_', ' ')}
                                        </label>
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
                                        </div>
                                    ))}
                            </div>

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
