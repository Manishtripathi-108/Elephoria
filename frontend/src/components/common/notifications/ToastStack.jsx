import React, { useCallback, useEffect, useState } from 'react'

import Toast from './Toast'

const ToastStack = () => {
    const [toasts, setToasts] = useState([])

    // Function to add a new toast
    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now() // Generate unique ID for each toast
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
        <div className="fixed bottom-5 right-5 z-50 space-y-2">
            {toasts.map(({ id, message, type, duration }) => (
                <Toast
                    key={id}
                    message={message}
                    type={type}
                    duration={duration}
                    onDismiss={() => removeToast(id)} // Pass the remove function to Toast
                />
            ))}
        </div>
    )
}

export default ToastStack
