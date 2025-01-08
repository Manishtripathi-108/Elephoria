import React from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../constants/iconMap'
import JelloButton from './buttons/JelloButton'

/**
 * Closes the modal dialog with the specified ID.
 * @param {string} modalId - The ID of the modal element to close.
 */
const closeModal = (modalId) => {
    const modalElement = document.getElementById(modalId)
    if (modalElement) modalElement.close()
}

/**
 * Opens the modal dialog with the specified ID.
 * @param {string} modalId - The ID of the modal element to open.
 */
const openModal = (modalId) => {
    const modalElement = document.getElementById(modalId)
    if (modalElement) modalElement.showModal()
}

/**
 * A generic modal dialog component that wraps its children in a dialog element.
 * The modal has a close button at the top right corner by default, but this can
 * be disabled by setting the `showCloseButton` prop to `false`. The modal also
 * has a maximum width of `max-w-2xl`, but this can be overridden by setting the
 * `maxWidthAndClasses` prop to a different class name.
 *
 * @param {string} modalId - The ID of the modal element to display.
 * @param {string} maxWidthAndClasses - An optional class name to apply to the
 * modal element, which should include a maximum width value. Defaults to
 * `w-full max-w-2xl`.
 * @param {boolean} showCloseButton - Whether to show the close button at the top
 * right corner of the modal. Defaults to `true`.
 * @param {React.ReactNode} children - The content of the modal dialog.
 */
const DialogModal = ({ modalId, maxWidthAndClasses = 'w-full max-w-2xl', showCloseButton = true, children }) => {
    return (
        <dialog
            id={modalId}
            onClick={(e) => e.target === e.currentTarget && closeModal(modalId)}
            className={`modal-animation scrollbar-thin bg-primary shadow-neumorphic-inset-md rounded-xl border p-5 ${maxWidthAndClasses}`}>
            <div className="shadow-neumorphic-md overflow-hidden rounded-lg border">
                {showCloseButton && (
                    <button
                        className="text-secondary hover:text-primary bg-light-secondary dark:bg-dark-secondary absolute top-2 right-2 z-20 rounded-full p-1 text-lg select-none"
                        onClick={() => closeModal(modalId)}
                        aria-label="Close Modal">
                        <Icon icon={iconMap.close} className="size-6" />
                    </button>
                )}
                <div className="w-full">{children}</div>
            </div>
        </dialog>
    )
}

/**
 * ConfirmationModal is a component that renders a modal dialog for user confirmation actions.
 *
 * @param {string} modalId - The ID of the modal element to manage open/close operations.
 * @param {string} icon - The icon to display at the top of the modal for visual context.
 * @param {Function} onConfirm - Callback function executed when the confirm button is clicked.
 * @param {Function} onCancel - Callback function executed when the cancel button is clicked.
 * @param {string} confirmText - Text to display on the confirm button. Defaults to 'Yes'.
 * @param {string} cancelText - Text to display on the cancel button. Defaults to 'No'.
 * @param {React.ReactNode} children - The content or message to display within the modal.
 * @param {boolean} isConfirmDanger - Whether the confirm button should have a danger variant.
 */
const ConfirmationModal = ({ modalId, icon, onConfirm, onCancel, confirmText = 'Yes', cancelText = 'No', children, isConfirmDanger = false }) => {
    return (
        <dialog
            id={modalId}
            onClick={(e) => e.target === e.currentTarget && closeModal(modalId)}
            className={`modal-animation shadow-neumorphic-inset-md w-fit max-w-2xl rounded-xl border p-5`}>
            <div className="shadow-neumorphic-md overflow-hidden rounded-lg border">
                <div className="relative max-h-full w-full max-w-md p-8 text-center md:p-10">
                    <Icon icon={icon} className="mx-auto mb-4 size-12 text-red-500" />
                    <h3 className="text-primary mb-5 text-lg font-normal">{children}</h3>
                    <JelloButton
                        onClick={() => {
                            onConfirm()
                            closeModal(modalId)
                        }}
                        title={confirmText}
                        variant={isConfirmDanger ? 'danger' : 'primary'}>
                        {confirmText}
                    </JelloButton>
                    <JelloButton
                        title={cancelText}
                        className="mt-4 ml-4"
                        variant={!isConfirmDanger ? 'danger' : 'primary'}
                        onClick={
                            onCancel
                                ? () => {
                                      onCancel()
                                      closeModal(modalId)
                                  }
                                : () => closeModal(modalId)
                        }>
                        {cancelText}
                    </JelloButton>
                </div>
            </div>
        </dialog>
    )
}

export { DialogModal, ConfirmationModal, openModal, closeModal }
