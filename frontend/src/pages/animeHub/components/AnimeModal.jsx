import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { saveMediaEntry } from '../../../api/animeHubApi'
import JelloButton from '../../../components/common/buttons/JelloButton'
import { validStatus } from '../constants'

export default function AnimeModal({ onClose, media, mediaStatus = '', mediaProgress = '0' }) {
    const bannerStyle = { backgroundImage: `url(${media?.bannerImage})` }
    const [isFavorite, setIsFavorite] = useState(media?.isFavorite || false)

    // Form validation schema
    const validationSchema = Yup.object({
        status: Yup.string().oneOf(validStatus).required('Status is required'),
        progress: Yup.number().min(0, 'Progress must be zero or more').required('Progress is required'),
    })

    // Save media entry updates
    const handleSave = async (values, { setSubmitting }) => {
        const result = await saveMediaEntry(media?.id, values.status, values.progress)

        setSubmitting(false)

        if (result === -1) {
            window.addToast('ID not found', 'error')
            return
        }

        if (result.success) {
            window.addToast('Entry updated successfully', 'success')
            onClose()
        } else if (result.retryAfterSeconds > 0) {
            window.addToast(`Rate limit exceeded. Please try again in ${result.retryAfterSeconds} seconds.`, 'error')
        } else {
            window.addToast(result.message || 'An error occurred while updating.', 'error')
        }
    }

    return (
        <div className="fixed inset-0 z-50 animate-unfoldIn overflow-y-auto rounded-lg" onClick={onClose}>
            {/* Background overlay */}
            <div className="fixed inset-0 h-dvh bg-light-primary/75 bg-opacity-75 dark:bg-dark-primary/75"></div>

            {/* Modal content */}
            <div className="flex h-dvh scale-0 animate-zoomIn items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
                <div className="bg-primary relative m-1 w-full max-w-lg rounded-lg p-6 shadow-neu-light-md dark:shadow-neu-dark-md">
                    {/* Close button */}
                    <button className="text-secondary hover:text-primary absolute right-2 top-2 z-20 text-xl" onClick={onClose}>
                        &#x2715;
                    </button>

                    {/* Banner image */}
                    <div
                        className="after:bg-secondary relative h-44 rounded-lg bg-cover bg-center after:absolute after:size-full after:rounded-lg after:opacity-40 md:h-64"
                        style={bannerStyle}></div>

                    {/* Cover image */}
                    <div className="bg-primary relative mx-auto -mt-24 w-full max-w-40 rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-xs dark:border-dark-secondary dark:shadow-neu-inset-dark-xs">
                        <img
                            className="size-full rounded-lg object-cover"
                            src={media?.coverImage?.large}
                            alt={media?.title?.english || media?.title?.native}
                            loading="lazy"
                        />
                    </div>

                    {/* Title */}
                    <h2 className="text-primary my-6 font-aladin text-xl font-normal capitalize leading-none tracking-widest">
                        {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                    </h2>

                    <Formik
                        initialValues={{ favorite: isFavorite, status: mediaStatus, progress: mediaProgress }}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}>
                        {({ isSubmitting, setFieldValue }) => (
                            <Form>
                                {/* Favorite button */}
                                <button
                                    type="button"
                                    className={`neu-btn neu-icon-only-btn absolute right-6 top-2/3 ${isFavorite ? 'active' : ''}`}
                                    onClick={() => {
                                        setIsFavorite((prev) => !prev)
                                        setFieldValue('favorite', !isFavorite)
                                    }}>
                                    <Icon icon="icomoon-free:heart" className={`size-5 ${isFavorite ? 'text-[#ff4545]' : ''}`} />
                                </button>

                                {/* Status and Progress fields */}
                                <div className="flex-center gap-4">
                                    <div className="neu-form-group">
                                        <label htmlFor="status" className="neu-form-label">
                                            Status:
                                        </label>
                                        <Field as="select" name="status" className="neu-form-select">
                                            <option value="">Select Status</option>
                                            {validStatus.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="status" component="div" className="neu-form-text error" />
                                    </div>

                                    <div className="neu-form-group">
                                        <label htmlFor="progress" className="neu-form-label">
                                            Episode Progress:
                                        </label>
                                        <Field type="number" name="progress" min="0" className="neu-form-input text-center" />
                                        <ErrorMessage name="progress" component="div" className="neu-form-text error" />
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="mt-8 flex justify-end space-x-2">
                                    <JelloButton title="Delete" variant="danger" onClick={onClose} disabled={isSubmitting}>
                                        Delete
                                    </JelloButton>
                                    <JelloButton title="Save" variant="info" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Icon icon="line-md:loading-loop" className="mx-2 size-5" /> : 'Save'}
                                    </JelloButton>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}
