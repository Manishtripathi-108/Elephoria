import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

const Toast = ({ message, duration = 3000, type = 'success', onDismiss }) => {
    const [visible, setVisible] = useState(true)

    // Automatically hide the toast after the specified duration
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(() => {
                onDismiss() // Remove the toast after fade-out animation
            }, 300) // 300ms for fade-out duration
        }, duration)

        return () => clearTimeout(timer) // Cleanup the timer on unmount
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
            className={`flex max-w-xs transform items-center rounded-md p-4 shadow-lg transition-all duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'} ${toastStyles[type]}`}
            role="alert">
            <Icon icon={iconNames[type]} className="mr-2 size-7" />
            <span className="flex-1 text-sm">{message}</span>
            <button
                onClick={() => {
                    setVisible(false)
                    setTimeout(() => onDismiss(), 300) // Allow fade-out before removing
                }}
                className="ml-3 text-2xl text-white focus:outline-none">
                &times;
            </button>
        </div>
    )
}

export default Toast
