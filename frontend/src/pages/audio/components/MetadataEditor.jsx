import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import JelloButton from '../../../components/common/buttons/JelloButton'
import { iconMap } from '../../../utils/globalConstants'
import { metaTags } from '../utils.js/constants'

const MetadataEditor = ({ fileId, fileUrl, coverImage, metadata, onCancel }) => {
    const [downloadUrl, setDownloadUrl] = useState(null)
    const [showAllTags, setShowAllTags] = useState(false)

    const validationSchema = Yup.object(
        Object.entries(metaTags).reduce((schema, [key, { validate }]) => {
            if (validate) {
                schema[key] = validate
            }
            return schema
        }, {})
    )

    const handleEditMetadata = async (values, { setSubmitting }) => {
        setSubmitting(true)
        try {
            const response = await axios.post('/api/audio/edit-metadata', { fileId, fileUrl, metadata: values })

            if (response.data?.success) {
                setDownloadUrl(response.data.editedFileUrl)
                window.addToast('Metadata edited successfully!', 'success')
            } else {
                throw new Error(response.data?.message || 'An error occurred.')
            }
        } catch (error) {
            window.addToast(error.response?.data?.message || 'Failed to edit metadata.', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    const downloadFile = async () => {
        if (downloadUrl) {
            try {
                const response = await fetch(downloadUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', metadata?.title || 'edited_file')
                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(url)
            } catch (error) {
                window.addToast('Failed to download the file. Please try again.', 'error')
            }
        } else {
            window.addToast('File not ready for download. Please try again.', 'error')
        }
    }

    const initialValues = Object.keys(metaTags).reduce((values, key) => {
        values[key] = metadata[key] || ''
        return values
    }, {})

    const displayedTags = showAllTags ? Object.entries(metaTags) : Object.entries(metaTags).slice(0, 10)

    return (
        <div
            className={`${downloadUrl ? 'm-4 rounded-xl' : 'w-full max-w-screen-lg sm:rounded-3xl'} border border-light-secondary p-6 shadow-neumorphic-lg dark:border-dark-secondary`}>
            <div className="flex-center flex-col gap-4 rounded-xl sm:border sm:border-light-secondary sm:p-6 sm:dark:border-dark-secondary">
                {downloadUrl ? (
                    <>
                        <h2 className="text-primary text-center text-xl font-semibold">File Ready for Download</h2>
                        <p className="text-secondary text-center">The file has been successfully edited. Click below to download it.</p>
                        <JelloButton className="mt-6" onClick={downloadFile}>
                            Download File
                        </JelloButton>
                    </>
                ) : (
                    <>
                        <h2 className="text-primary mb-6 text-center font-aladin text-2xl tracking-wider">Edit Tags</h2>
                        <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start">
                            <div className="size-72 shrink-0 overflow-hidden rounded-xl border border-light-secondary p-2 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                                <img src={coverImage} alt="Cover" className="h-full w-full rounded-lg object-cover" />
                            </div>
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleEditMetadata}>
                                {({ isSubmitting, resetForm }) => (
                                    <Form className="w-full space-y-6">
                                        <div className="grid w-full grid-cols-1 place-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {displayedTags.map(([key, { className, placeholder, type }]) => (
                                                <div key={key} className={`form-group ${className}`}>
                                                    <Field
                                                        id={key}
                                                        name={key}
                                                        rows={type === 'textarea' ? 6 : 1}
                                                        as={type === 'textarea' ? 'textarea' : 'input'}
                                                        type={type || 'text'}
                                                        placeholder={placeholder}
                                                        autoComplete="off"
                                                        className={type === 'textarea' ? 'input-textarea scrollbar-thin' : 'input-text'}
                                                    />
                                                    <label className="form-label" htmlFor={key}>
                                                        {key === 'date' ? 'Year' : key.replace('_', ' ')}
                                                    </label>
                                                    <ErrorMessage name={key} component="div" className="form-helper-text error order-3" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex w-full justify-end gap-4">
                                            <button
                                                className="button button-sm button-with-icon gap-1"
                                                type="button"
                                                onClick={() => setShowAllTags((prev) => !prev)}>
                                                {showAllTags ? 'Show Less' : 'Show All'}
                                                <Icon icon={iconMap[showAllTags ? 'up' : 'down']} className="size-4" />
                                            </button>
                                        </div>
                                        <div className="flex w-full justify-end gap-4 pt-8">
                                            <JelloButton type="submit" disabled={isSubmitting} isSubmitting={isSubmitting}>
                                                Save Changes
                                            </JelloButton>
                                            <JelloButton
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    resetForm()
                                                }}>
                                                Reset
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
                    </>
                )}
            </div>
        </div>
    )
}

export default MetadataEditor
