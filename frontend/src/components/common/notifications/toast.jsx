import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

const Toast = ({ message, duration = 3000, type = 'success', onDismiss }) => {
    const [visible, setVisible] = useState(true)

    // Automatically hide the toast after a specific duration
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
            if (onDismiss) onDismiss() // Notify parent component when toast is dismissed
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onDismiss])

    if (!visible) return null

    const toastStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white',
    }

    const iconNames = {
        success: 'ep:success-filled',
        error: 'ic:round-error',
        info: 'ic:round-info',
        warning: 'ic:round-warning',
    }

    return (
        <div
            className={`fixed bottom-5 right-5 flex items-center max-w-xs w-full p-4 rounded-md shadow-lg transition-opacity duration-300 ${toastStyles[type]}`}
            role="alert">
            <Icon icon={iconNames[type]} className="size-7 mr-2" />
            <span className="flex-1 text-sm text-primary mt-2 font-indie-flower">{message}</span>
            <button
                onClick={() => {
                    setVisible(false)
                    if (onDismiss) onDismiss()
                }}
                className="ml-3 text-white focus:outline-none text-4xl">
                &times;
            </button>
        </div>
    )
}

export default Toast
