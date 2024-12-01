import React from 'react'

import { Icon } from '@iconify/react'

import { iconMap } from '../../utils/globalConstants'

const DialogModal = ({ modalId, maxWidthAndClasses = 'w-full max-w-2xl', closeButton = true, children }) => {
    const closeModal = () => {
        const modalElement = document.getElementById(modalId)
        if (modalElement) modalElement.close()
    }

    return (
        <dialog
            id={modalId}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            className={`modal-animation rounded-xl border border-light-secondary p-5 shadow-neu-inset-light-md dark:border-dark-secondary dark:shadow-neu-inset-dark-md ${maxWidthAndClasses}`}>
            <div className="overflow-hidden rounded-lg border border-light-secondary shadow-neu-light-md dark:border-dark-secondary dark:shadow-neu-dark-md">
                {closeButton && (
                    <button
                        className="text-secondary hover:text-primary absolute right-2 top-2 z-20 select-none rounded-full bg-light-secondary p-1 text-lg dark:bg-dark-secondary"
                        onClick={closeModal}
                        aria-label="Close Modal">
                        <Icon icon={iconMap.close} className="size-6" />
                    </button>
                )}
                <div className="w-full">{children}</div>
            </div>
        </dialog>
    )
}

const DialogTrigger = ({ modalId, children, ...props }) => {
    const openModal = () => {
        const modalElement = document.getElementById(modalId)
        if (modalElement) modalElement.showModal()
    }

    return (
        <button type="button" onClick={openModal} {...props}>
            {children}
        </button>
    )
}

export { DialogModal, DialogTrigger }
