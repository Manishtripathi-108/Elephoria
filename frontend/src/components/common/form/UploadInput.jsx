import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@iconify/react'

import { iconMap } from '../../../utils/globalConstants'

const UploadInput = ({ id, file, setFile }) => {
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState('Upload File')

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const fileName = file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name
            setFileName(fileName)
            setFile(file)
        }
    }

    const handleFileRemove = () => {
        setFileName('Upload File')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setFile(null)
    }

    useEffect(() => {
        // Reset file input value on unmount
        return () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }, [])

    return (
        <div className="bg-primary mb-6 flex size-80 flex-col items-center justify-between gap-2 rounded-lg p-2.5 shadow-neumorphic-sm">
            <label
                htmlFor={id}
                className="text-highlight flex w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-light-highlight dark:border-dark-highlight">
                <Icon icon={iconMap.upload} className="size-28" />
                <p className="text-primary p-1 text-center tracking-wider">
                    {fileName !== 'Upload File' ? 'File Uploaded! Click on the button below to upload!' : 'Browse File to upload!'}
                </p>
            </label>
            <div className="flex w-full items-center justify-center gap-2">
                <label
                    htmlFor={id}
                    className="bg-secondary text-highlight flex h-10 w-full cursor-pointer items-center justify-end rounded-lg border-none p-2">
                    <Icon icon={iconMap.filePlus} className="size-6 cursor-pointer" />
                    <p className="flex-1 text-center tracking-wider">{fileName}</p>
                </label>
                {file && (
                    <button
                        type="button"
                        title="Remove File"
                        onClick={handleFileRemove}
                        className="button button-icon-only-square flex-1 shadow-none">
                        <Icon icon={iconMap.trash} className="size-5" />
                    </button>
                )}
            </div>
            <input id={id} type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </div>
    )
}

export default UploadInput
