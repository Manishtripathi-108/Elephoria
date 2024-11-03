import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { saveMediaEntry, toggleFavourite } from '../../../api/animeHubApi'
import { Modal } from '../../../components/common/NeuModal'
import JelloButton from '../../../components/common/buttons/JelloButton'
import { useAnimeHubContext } from '../../../context/AnimeHubContext'
import { validStatus } from '../constants'

export default function AnimeModal({ id, media, mediaStatus = '', mediaProgress = '0' }) {
    const bannerStyle = { backgroundImage: `url(${media?.bannerImage})` }
    const [isLiked, setIsLiked] = useState(media.isFavourite || false)
    const [isToggling, setIsToggling] = useState(false)
    const { refetchMedia } = useAnimeHubContext()
    const maxProgress = media?.episodes || media?.chapters || 100000

    const closeModal = () => {
        const modal = document.getElementById(id)
        if (modal) {
            modal.close()
        }
    }

    // Form validation schema
    const validationSchema = Yup.object({
        status: Yup.string().oneOf(validStatus).required('Status is required'),
        progress: Yup.number()
            .min(0, 'Progress must be zero or more')
            .max(maxProgress, `Progress must be less than ${maxProgress}`)
            .required('Progress is required'),
    })

    // Save media entry updates
    const handleSave = async (values) => {
        if (values.status === mediaStatus && values.progress === mediaProgress) {
            window.addToast('No changes to save.', 'info')
            closeModal()
            return
        }
        const result = await saveMediaEntry(media.id, values.status, values.progress)

        if (result === -1) {
            window.addToast('ID not found', 'error')
            return
        }

        if (result.success) {
            window.addToast('Entry updated successfully', 'success')
            refetchMedia()
            closeModal()
        } else if (result.retryAfterSeconds > 0) {
            window.addToast(`Rate limit exceeded. Please try again in ${result.retryAfterSeconds} seconds.`, 'error')
        } else {
            window.addToast(result.message || 'An error occurred while updating.', 'error')
        }
    }

    // Toggle the favourite status of a media item
    const toggleLike = async () => {
        setIsToggling(true)
        const result = await toggleFavourite(media.id, media.type)
        setIsToggling(false)

        if (result.success) {
            setIsLiked((prev) => !prev)
            window.addToast(`${isLiked ? 'Removed from' : 'Added to'} favourites successfully.`, 'success')
        } else if (result.retryAfterSeconds > 0) {
            window.addToast(`Rate limit exceeded. Please try again in ${result.retryAfterSeconds} seconds.`, 'error')
        } else {
            window.addToast(result.message || 'An error occurred while toggling favourite status.', 'error')
        }
    }

    return (
        <Modal id={id}>
            {/* Banner image */}
            <div
                className="after:bg-secondary relative h-44 rounded-lg bg-cover bg-center after:absolute after:size-full after:rounded-lg after:opacity-40 md:h-64"
                style={bannerStyle}></div>

            {/* Cover image */}
            <div className="bg-primary relative -mt-24 ml-5 w-full max-w-40 rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-xs dark:border-dark-secondary dark:shadow-neu-inset-dark-xs">
                <img
                    className="size-full rounded-lg object-cover"
                    src={media?.coverImage?.large}
                    alt={media?.title?.english || media?.title?.native}
                    loading="lazy"
                />
            </div>

            {/* Title */}
            <h2 className="text-primary mb-6 ml-7 mt-4 font-aladin text-xl font-normal capitalize leading-none tracking-widest">
                {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
            </h2>

            {/* Favourite button */}
            <button
                type="button"
                className={`neu-btn neu-icon-only-btn absolute right-6 top-2/4 ${isLiked ? 'active' : ''}`}
                onClick={toggleLike}
                disabled={isToggling}>
                <Icon icon="icomoon-free:heart" className={`size-5 ${isLiked ? 'text-[#ff4545]' : ''}`} />
            </button>

            <Formik initialValues={{ status: mediaStatus, progress: mediaProgress }} validationSchema={validationSchema} onSubmit={handleSave}>
                {({ isSubmitting }) => (
                    <Form>
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
                                <Field type="number" name="progress" min="0" max={maxProgress} className="neu-form-input text-center" />
                                <ErrorMessage name="progress" component="div" className="neu-form-text error" />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex justify-end space-x-2">
                            <JelloButton title="Delete" variant="danger" type="button" onClick={closeModal} disabled={isSubmitting}>
                                Delete
                            </JelloButton>
                            <JelloButton title="Save" variant="info" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Icon icon="line-md:loading-loop" className="mx-2 size-5" /> : 'Save'}
                            </JelloButton>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}
