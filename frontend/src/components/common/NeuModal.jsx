import React, { useEffect } from 'react'

import { Icon } from '@iconify/react'

const Modal = ({ id, children }) => {
    const close = () => {
        const modal = document.getElementById(id)
        if (modal) {
            modal.close()
        }
    }

    return (
        <dialog
            id={id}
            onClick={(e) => e.target === e.currentTarget && close()}
            className="animation-modal bg-primary w-full max-w-2xl overflow-hidden rounded-lg p-6 shadow-neu-light-md outline-none dark:shadow-neu-dark-md">
            <button
                className="text-secondary hover:text-primary absolute right-2 top-2 z-20 select-none rounded-full bg-light-secondary p-1 text-lg dark:bg-dark-secondary"
                onClick={close}>
                <Icon icon="iconamoon:close" className="size-6" />
            </button>
            <div className="w-full">{children}</div>
        </dialog>
    )
}

const ModalTrigger = ({ id, children, ...props }) => {
    const open = () => {
        const modal = document.getElementById(id)
        if (modal) {
            modal.showModal()
        }
    }

    return (
        <button type="button" onClick={open} {...props}>
            {children}
        </button>
    )
}

export { Modal, ModalTrigger }
