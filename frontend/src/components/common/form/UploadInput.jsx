import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../../constants/iconMap'
import cn from '../../../utils/cn'

/**
 * UploadInput
 *
 * A component for uploading files with a customizable appearance.
 *
 * @param {string} acceptType - The file type(s) accepted by the input element.
 * @param {string} className - Additional classes to apply to the component.
 * @param {File} file - The currently selected file.
 * @param {string} id - The unique identifier for the file input element.
 * @param {Function} setFile - Function to update the selected file state.
 *
 * @returns {JSX.Element} The rendered file upload input component with functionality
 * to select, display, and remove a file, including visual feedback for file upload status.
 */
const UploadInput = ({ acceptType, className, file, id, setFile }) => {
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState('Upload File')

    const handleFileRemove = () => {
        setFileName('Upload File')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setFile(null)
    }

    useEffect(() => {
        if (file) {
            setFileName(file.name)
        }

        return () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }, [file])

    return (
        <div
            className={cn(
                'bg-primary shadow-neumorphic-sm flex size-80 flex-col items-center justify-between gap-2 rounded-lg border p-2.5',
                className
            )}>
            <label
                htmlFor={id}
                className="text-highlight border-light-highlight dark:border-dark-highlight flex w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <Icon icon={file ? iconMap.success : iconMap.upload} className="size-28" />
                <p className="text-primary p-1 text-center tracking-wider">
                    {fileName !== 'Upload File' ? 'File Uploaded! Click on the button below to upload!' : 'Browse File to upload!'}
                </p>
            </label>
            <div className="flex w-full items-center justify-center gap-2">
                <label
                    htmlFor={id}
                    className={`bg-secondary text-highlight flex h-10 cursor-pointer items-center justify-end rounded-lg border-none p-2 ${file ? 'w-10/12' : 'w-full'}`}>
                    {!file && <Icon icon={iconMap.filePlus} className="size-6" />}
                    <p className="line-clamp-1 w-full text-center tracking-wider">{fileName}</p>
                </label>
                {file && (
                    <button type="button" title="Remove File" onClick={handleFileRemove} className="button button-icon-only-square shadow-none">
                        <Icon icon={iconMap.trash} className="size-5" />
                    </button>
                )}
            </div>
            <input id={id} type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files[0])} accept={acceptType} />
        </div>
    )
}

export default UploadInput
