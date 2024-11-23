import React, { useCallback, useEffect, useState } from 'react'

import { AnimatePresence } from 'motion/react'

import Toast from './Toast_2'

const ToastStack = () => {
    const [toasts, setToasts] = useState([])

    // Function to add a new toast
    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        // Generate a unique ID for the toast
        const id = self.crypto.randomUUID() || Math.random().toString(36).substring(2, 9)
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])
    }, [])

    // Function to remove a toast by ID
    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, [])

    // Make `addToast` globally accessible
    useEffect(() => {
        window.addToast = addToast
    }, [addToast])

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col justify-end gap-y-2">
            <AnimatePresence>
                {toasts.map(({ id, message, type, duration }) => (
                    <Toast key={id} message={message} duration={duration} type={type} onDismiss={() => removeToast(id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

export default ToastStack
