import React from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../constants/iconMap'
import cn from '../../utils/cn'
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
 * A modal dialog component with a backdrop and a close button.
 *
 * @param {string} modalId - The ID of the modal element to open.
 * @param {string} [className] - Additional CSS classes for the modal.
 * @param {boolean} [showCloseButton=true] - Whether to show the close button.
 * @param {React.ReactNode} children - The content of the modal.
 * @param {Function} [shouldClose=() => true] - A function to call to determine whether the modal
 * should be closed when the user clicks the backdrop.
 */
const Modal = ({ modalId, className = '', showCloseButton = true, children, shouldClose = () => true, onClose }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && shouldClose()) {
            closeModal(modalId)
        }
    }

    const handleCloseClick = () => {
        if (shouldClose()) {
            closeModal(modalId)
        }
    }

    const handleDialogClose = () => {
        if (onClose) onClose()
    }

    return (
        <dialog
            id={modalId}
            onClick={handleBackdropClick}
            onClose={handleDialogClose}
            className={cn(
                'bg-primary shadow-neumorphic-inset-md m-auto hidden w-full max-w-2xl scale-0 overflow-visible rounded-xl border p-5 opacity-0 outline-hidden transition-all transition-discrete duration-300 ease-in-out',
                'backdrop:bg-primary backdrop:opacity-75 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 backdrop:ease-in',
                'open:block open:scale-100 open:opacity-100 open:delay-300 open:backdrop:scale-100',
                'starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:scale-x-100 starting:open:backdrop:scale-y-0',
                className
            )}>
            <div className="shadow-neumorphic-md w-full max-w-full overflow-hidden rounded-lg border">
                {showCloseButton && (
                    <button
                        title="Close Modal"
                        className="text-text-secondary hover:text-text-primary bg-secondary absolute top-2 right-2 z-20 cursor-pointer rounded-full p-1 text-lg select-none"
                        onClick={handleCloseClick}
                        aria-label="Close Modal">
                        <Icon icon={iconMap.close} className="size-6" />
                    </button>
                )}
                <div className="scrollbar-thin max-h-[calc(100vh-6rem)] w-full max-w-full overflow-y-auto overscroll-x-none">{children}</div>
            </div>
        </dialog>
    )
}

/**
 * A modal dialog for confirming actions. Contains a prompt and two buttons, "Yes" and "No", or
 * "Confirm" and "Cancel". The buttons are coloured differently depending on whether the
 * confirmation is considered safe or dangerous.
 *
 * @param {string} modalId - The ID of the modal element to open.
 * @param {string} icon - The icon to display above the prompt.
 * @param {Function} onConfirm - The function to call when the user clicks the confirmation button.
 * @param {Function} [onCancel] - The function to call when the user clicks the cancellation button.
 * @param {string} [confirmText='Yes'] - The text of the confirmation button.
 * @param {string} [cancelText='No'] - The text of the cancellation button.
 * @param {React.ReactNode} children - The content of the prompt.
 * @param {boolean} [isConfirmDanger=false] - If true, the confirmation button is red.
 * @param {Function} [shouldClose=() => true] - A function to call to determine whether the modal
 * should be closed when the user clicks the backdrop.
 */
const ConfirmationModal = ({
    modalId,
    icon,
    onConfirm,
    onCancel,
    confirmText = 'Yes',
    cancelText = 'No',
    children,
    isConfirmDanger = false,
    shouldClose = () => true,
    onClose,
}) => {
    const handleCancelClick = () => {
        if (onCancel) {
            onCancel()
        }
        if (shouldClose()) {
            closeModal(modalId)
        }
    }

    const handleConfirmClick = () => {
        onConfirm()
        if (shouldClose()) {
            closeModal(modalId)
        }
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && shouldClose()) {
            closeModal(modalId)
        }
    }

    const handleDialogClose = () => {
        if (onClose) onClose()
    }

    return (
        <dialog
            id={modalId}
            onClick={handleBackdropClick}
            onClose={handleDialogClose}
            className="bg-primary shadow-neumorphic-inset-md backdrop:bg-primary m-auto hidden w-fit max-w-2xl scale-0 rounded-xl border p-5 opacity-0 outline-hidden transition-all transition-discrete duration-300 ease-in-out backdrop:opacity-75 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 backdrop:ease-in open:block open:scale-100 open:opacity-100 open:delay-300 open:backdrop:scale-100 starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:scale-x-100 starting:open:backdrop:scale-y-0">
            <div className="shadow-neumorphic-md overflow-hidden rounded-lg border">
                <div className="relative max-h-full w-full max-w-md p-8 text-center md:p-10">
                    <Icon icon={icon} className="mx-auto mb-4 size-12 text-red-500" />
                    <h3 className="text-text-primary mb-5 text-lg font-normal">{children}</h3>
                    <JelloButton onClick={handleConfirmClick} title={confirmText} variant={isConfirmDanger ? 'danger' : 'primary'}>
                        {confirmText}
                    </JelloButton>
                    <JelloButton
                        title={cancelText}
                        className="mt-4 ml-4"
                        variant={!isConfirmDanger ? 'danger' : 'primary'}
                        onClick={handleCancelClick}>
                        {cancelText}
                    </JelloButton>
                </div>
            </div>
        </dialog>
    )
}

export default Modal
export { ConfirmationModal, openModal, closeModal }
