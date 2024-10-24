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

    // Dynamic styles and icons based on the 'type'
    const toastStyles = {
        success: 'bg-green-100 text-green-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        warning: 'bg-yellow-100 text-yellow-700',
    }

    const fillColors = {
        success: 'fill-green-500',
        error: 'fill-red-500',
        info: 'fill-blue-500',
        warning: 'fill-yellow-500',
    }

    const iconNames = {
        success: 'ep:success-filled',
        error: 'ic:round-error',
        info: 'ic:round-info',
        warning: 'ic:round-warning',
    }

    const titles = {
        success: 'Success',
        error: 'Error',
        info: 'Information',
        warning: 'Warning',
    }

    return (
        <div
            className={`relative box-border flex h-fit max-h-40 w-fit max-w-2xl transform items-center justify-around gap-4 overflow-hidden rounded-lg px-4 py-2.5 shadow-lg transition-all duration-300 ease-in-out ${
                toastStyles[type]
            } ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <svg className={`absolute -left-8 top-8 w-20 rotate-90 ${fillColors[type]}`} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                    fill-opacity="1"></path>
            </svg>

            <Icon icon={iconNames[type]} className="ml-2 flex size-7" />

            <div className="flex grow flex-col items-start justify-center">
                <p className="font-aladin text-xl font-bold tracking-widest">{titles[type]}</p>
                <p className="m-0 cursor-default font-indie-flower tracking-wider">{message}</p>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 15"
                strokeWidth="0"
                fill="none"
                stroke="currentColor"
                className="size-6 cursor-pointer text-dark-secondary"
                onClick={() => setVisible(false)}>
                <path
                    fill="currentColor"
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    clipRule="evenodd"
                    fillRule="evenodd"></path>
            </svg>
        </div>
    )
}

export default Toast
