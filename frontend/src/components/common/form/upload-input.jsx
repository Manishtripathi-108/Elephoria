import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@iconify/react'

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
        <div className="bg-primary mb-6 flex size-80 flex-col items-center justify-between gap-2 rounded-lg p-2.5 font-indie-flower shadow-neu-light-sm dark:shadow-neu-dark-sm">
            <label
                htmlFor={id}
                className="text-highlight-primary flex w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-light-highlight-primary dark:border-dark-highlight-primary">
                <Icon icon="line-md:cloud-alt-upload-filled-loop" className="size-28" />
                <p className="text-primary p-1 text-center tracking-wider">
                    {fileName !== 'Upload File' ? 'File Uploaded! Click on the button below to upload!' : 'Browse File to upload!'}
                </p>
            </label>
            <div className="flex w-full items-center justify-center gap-2">
                <label
                    htmlFor={id}
                    className="bg-secondary text-highlight-primary flex h-10 w-full cursor-pointer items-center justify-end rounded-lg border-none p-2">
                    <Icon icon="line-md:file-plus-filled" className="size-6 cursor-pointer" />
                    <p className="flex-1 text-center tracking-wider">{fileName}</p>
                </label>
                {file && (
                    <button
                        type="button"
                        title="Remove File"
                        onClick={handleFileRemove}
                        className="neu-btn neu-icon-only-square-btn flex-1 shadow-none">
                        <Icon icon="entypo:trash" className="size-5" />
                    </button>
                )}
            </div>
            <input id={id} type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </div>
    )
}

export default UploadInput
