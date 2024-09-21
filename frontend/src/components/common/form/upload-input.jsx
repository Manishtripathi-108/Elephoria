import React, { useRef } from 'react'

import { Icon } from '@iconify/react'

const UploadInput = ({ id, file, setFile, fileName, setFileName }) => {
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFileName(file.name)
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

    return (
        <div className="size-80 mb-6 shadow-neu-light-sm dark:shadow-neu-dark-sm font-indie-flower flex flex-col items-center justify-between gap-2 bg-primary p-2.5 rounded-lg">
            <div className="flex-1 w-full flex items-center justify-center flex-col rounded-lg border-2 border-dashed border-light-highlight-primary dark:border-dark-highlight-primary text-highlight-primary">
                <Icon icon="line-md:cloud-alt-upload-filled-loop" className="size-28" />
                <p className="text-center text-primary tracking-wider p-1">
                    {fileName !== 'Upload File' ? 'File Uploaded! Click on the button below to upload!' : 'Browse File to upload!'}
                </p>
            </div>
            <div className="flex w-full gap-2 items-center justify-center">
                <label
                    htmlFor={id}
                    className="bg-secondary w-full h-10 cursor-pointer flex items-center justify-end text-highlight-primary p-2 rounded-lg border-none">
                    <Icon icon="line-md:file-plus-filled" className="size-6 cursor-pointer" />
                    <p className="flex-1 text-center tracking-wider">{fileName}</p>
                </label>
                {file && (
                    <button
                        type="button"
                        title="Remove File"
                        onClick={handleFileRemove}
                        className="neu-btn neu-icon-only-square-btn shadow-none flex-1">
                        <Icon icon="entypo:trash" className="size-5" />
                    </button>
                )}
            </div>
            <input id={id} type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </div>
    )
}

export default UploadInput
