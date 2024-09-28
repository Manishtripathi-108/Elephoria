import React, { useEffect, useState } from 'react'

import axios from 'axios'

import UploadInput from '../../components/common/form/upload-input'
import Toast from '../../components/common/notifications/toast'

const AudioEditor = () => {
    const [file, setFile] = useState(null)
    const [metadata, setMetadata] = useState({
        artist: '',
        album: '',
        title: '',
        format: '',
    })

    const [fileName, setFileName] = useState('Upload File')
    const [toast, setToast] = useState(null)

    const { artist, album, title, format } = metadata || {}

    const showToast = (message, type) => {
        setToast({ message, type })
    }

    const handleDismiss = () => {
        setToast(null)
    }

    const handleFileUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            showToast('Please select a file first!', 'warning')
            return
        }

        const formData = new FormData()
        formData.append('audio', file)

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            setMetadata((prev) => ({
                ...prev,
                artist: response.data?.metadata?.tags?.artist || 'No artist found',
                album: response.data?.metadata?.tags?.album || 'No album found',
                title: response.data?.metadata?.tags?.title || 'No title found',
                format: response.data?.metadata?.format || 'No format found',
            }))

            showToast('File uploaded and metadata extracted successfully!', 'success')
        } catch (error) {
            console.error('Error uploading file:', error)
            showToast('File upload failed', 'error')
        }
    }

    const handleEditMetadata = async (e) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()
        formData.append('audio', file)
        formData.append('artist', artist)
        formData.append('album', album)
        formData.append('title', title)

        try {
            const response = await axios.post('/api/edit-metadata', formData, {
                responseType: 'blob', // Expect a file as the response
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'edited_audio.mp3')
            document.body.appendChild(link)
            link.click()
            setToast({ message: 'Metadata edited successfully!', type: 'success' })
        } catch (error) {
            console.error('Error editing metadata:', error)
            setToast({ message: 'Error editing metadata', type: 'error' })
        }
    }

    const handleConvert = async (e) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()
        formData.append('audio', file)
        formData.append('format', format)

        try {
            const response = await axios.post('/api/convert', formData, {
                responseType: 'blob',
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `converted_audio.${format}`)
            document.body.appendChild(link)
            link.click()
            setToast({ message: 'File converted successfully!', type: 'success' })
        } catch (error) {
            console.error('Error converting file:', error)
            showToast('Error converting file', 'error')
        }
    }

    return (
        <div className="m-6 flex-center gap-6 flex-col">
            {/* Upload audio form */}
            <form
                id="upload-audio"
                onSubmit={handleFileUpload}
                className="w-full max-w-2xl flex-center flex-col rounded-lg p-6 shadow-neu-light-md dark:shadow-neu-dark-md">
                <h2 className="text-primary font-aladin tracking-wider text-2xl mb-2">Upload Audio</h2>
                <p className="text-primary text-center mb-6">Upload an audio file to edit metadata, convert format, and more!</p>

                <UploadInput id="upload_audio" file={file} setFile={setFile} fileName={fileName} setFileName={setFileName} />

                <button type="submit" title="Upload Audio" className="neu-btn flex-shrink-0" onClick={handleFileUpload}>
                    Upload Audio
                </button>
            </form>

            {/* Edit metadata form */}
            <form
                id="edit-metadata"
                className="w-full max-w-2xl flex-center flex-col rounded-lg gap-6 p-6 shadow-neu-light-md dark:shadow-neu-dark-md"
                onSubmit={handleEditMetadata}>
                <h2 className="text-primary font-aladin tracking-wider text-2xl">Edit Metadata</h2>
                <div className="neu-form-group mb-4">
                    <label className="neu-form-label" htmlFor="artist">
                        Artist
                    </label>
                    <input
                        className="neu-form-input"
                        id="artist"
                        type="text"
                        placeholder="Artist"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                    />
                </div>
                <div className="neu-form-group mb-4">
                    <label className="neu-form-label" htmlFor="album">
                        Album
                    </label>
                    <input
                        className="neu-form-input"
                        id="album"
                        type="text"
                        placeholder="Album"
                        value={album}
                        onChange={(e) => setAlbum(e.target.value)}
                    />
                </div>
                <div className="neu-form-group mb-4">
                    <label className="neu-form-label" htmlFor="title">
                        Title
                    </label>
                    <input
                        className="neu-form-input"
                        id="title"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <button type="submit" className="neu-btn">
                    Edit Metadata
                </button>
            </form>

            {/* Convert audio format */}
            <form
                id="convert-audio"
                onSubmit={handleConvert}
                className="w-full max-w-2xl flex-center flex-col rounded-lg gap-6 p-6 shadow-neu-light-md dark:shadow-neu-dark-md">
                <h2 className="text-primary font-aladin tracking-wider text-2xl">Convert Audio Format</h2>

                <div className="neu-form-group w-full">
                    <label className="neu-form-label" htmlFor="format">
                        Format
                    </label>
                    <select id="format" className="neu-form-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                    </select>
                </div>
            </form>

            {/* Display toast notification */}
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={handleDismiss} duration={5000} />}
        </div>
    )
}

export default AudioEditor
