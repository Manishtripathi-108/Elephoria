import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { deleteMediaEntry, saveMediaEntry, toggleFavourite } from '../../../api/animeHubApi'
import Modal, { closeModal } from '../../../components/common/Modals'
import JelloButton from '../../../components/common/buttons/JelloButton'
import { VALID_STATUSES } from '../../../constants/anilist.constants'
import iconMap from '../../../constants/iconMap'

const AnimeModal = ({ entryId, modalId, media, mediaStatus = '', mediaProgress = '0' }) => {
    const bannerStyle = { backgroundImage: `url(${media?.bannerImage})` }
    const [isLiked, setIsLiked] = useState(media.isFavourite || false)
    const [isToggling, setIsToggling] = useState(false)
    const maxProgress = media?.episodes || media?.chapters || 100000

    // Form validation schema
    const validationSchema = Yup.object({
        status: Yup.string().oneOf(VALID_STATUSES).required('Status is required'),
        progress: Yup.number()
            .min(0, 'Progress must be zero or more')
            .max(maxProgress, `Progress must be less than ${maxProgress}`)
            .required('Progress is required'),
    })

    // Save media entry updates
    const handleSave = async (values) => {
        if (values.status === mediaStatus && values.progress === mediaProgress) {
            window.addToast('No changes to save.', 'info')
            closeModal(modalId)
            return
        }
        const result = await saveMediaEntry(media.id, values.status, values.progress)

        if (result === -1) {
            window.addToast('ID not found', 'error')
            return
        }

        if (result.success) {
            window.addToast('Entry updated successfully', 'success')
            closeModal(modalId)
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

    // Delete media entry
    const deleteEntry = async () => {
        setIsToggling(true)
        const result = await deleteMediaEntry(entryId)
        setIsToggling(false)

        if (result.success) {
            window.addToast('Entry deleted successfully', 'success')
            closeModal(modalId)
        } else if (result.retryAfterSeconds > 0) {
            window.addToast(`Rate limit exceeded. Please try again in ${result.retryAfterSeconds} seconds.`, 'error')
        } else {
            window.addToast(result.message || 'An error occurred while deleting.', 'error')
        }
    }

    return (
        <Modal modalId={modalId}>
            {/* Banner image */}
            <div
                className="after:bg-secondary relative h-44 rounded-t-lg bg-cover bg-center after:absolute after:size-full after:rounded-t-lg after:opacity-40 md:h-64"
                style={bannerStyle}></div>

            {/* Cover image */}
            <div className="bg-primary shadow-neumorphic-inset-xs relative -mt-24 ml-5 w-full max-w-40 rounded-lg border p-3">
                <img
                    className="size-full rounded-lg object-cover"
                    src={media?.coverImage?.large}
                    alt={media?.title?.english || media?.title?.native}
                    loading="lazy"
                />
            </div>

            {/* Title */}
            <h2 className="text-primary font-aladin mt-4 mb-6 ml-7 text-xl leading-none font-normal tracking-widest capitalize">
                {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
            </h2>

            {/* Favourite button */}
            <button
                type="button"
                className={`button button-icon-only absolute top-2/4 right-8 cursor-pointer ${isLiked ? 'shadow-neumorphic-inset-xs text-red-500 dark:text-red-500' : ''}`}
                onClick={toggleLike}
                disabled={isToggling}>
                <Icon icon={iconMap.heart} className="size-5 text-inherit" />
            </button>

            <Formik initialValues={{ status: mediaStatus, progress: mediaProgress }} validationSchema={validationSchema} onSubmit={handleSave}>
                {({ isSubmitting }) => (
                    <Form className="px-4 pb-4">
                        {/* Status and Progress fields */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="form-group">
                                <label htmlFor="media_status" className="form-text">
                                    Status:
                                </label>
                                <Field as="select" name="status" id="media_status" className="form-field">
                                    <option value="">Select Status</option>
                                    {VALID_STATUSES.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="status" component="p" className="form-text text-red-500 dark:text-red-500" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="media_progress" className="form-text">
                                    Episode Progress:
                                </label>
                                <Field
                                    type="number"
                                    id="media_progress"
                                    name="progress"
                                    min="0"
                                    max={maxProgress}
                                    className="form-field text-center"
                                />
                                <ErrorMessage name="progress" component="p" className="form-text text-red-500 dark:text-red-500" />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex justify-end space-x-2">
                            <JelloButton title="Delete" variant="danger" type="button" onClick={deleteEntry} disabled={isToggling}>
                                {isToggling ? <Icon icon={iconMap.loading} className="mx-2 size-5" /> : 'Delete'}
                            </JelloButton>
                            <JelloButton title="Save" variant="info" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Icon icon={iconMap.loading} className="mx-2 size-5" /> : 'Save'}
                            </JelloButton>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AnimeModal
