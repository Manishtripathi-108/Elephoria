import React, { useState } from 'react'

import { Icon } from '@iconify/react'

import UploadInput from '../../components/common/form/upload-input'

// import { set } from 'mongoose'

// import axios from 'axios'

const AudioEditor = () => {
    const [file, setFile] = useState(null)
    const [artist, setArtist] = useState('')
    const [album, setAlbum] = useState('')
    const [title, setTitle] = useState('')
    const [format, setFormat] = useState('mp3')
    const [fileName, setFileName] = useState('Upload File')

    // const handleUpload = async (e) => {
    //     e.preventDefault()
    //     if (!file) return

    //     const formData = new FormData()
    //     formData.append('audio', file)

    //     try {
    //         const response = await axios.post('http://localhost:5000/upload', formData)
    //         console.log('File uploaded:', response.data)
    //     } catch (error) {
    //         console.error('Error uploading file:', error)
    //     }
    // }

    // const handleEditMetadata = async (e) => {
    //     e.preventDefault()
    //     if (!file) return

    //     const formData = new FormData()
    //     formData.append('audio', file)
    //     formData.append('artist', artist)
    //     formData.append('album', album)
    //     formData.append('title', title)

    //     try {
    //         const response = await axios.post('http://localhost:5000/edit-metadata', formData, {
    //             responseType: 'blob', // Expect a file as the response
    //         })
    //         const url = window.URL.createObjectURL(new Blob([response.data]))
    //         const link = document.createElement('a')
    //         link.href = url
    //         link.setAttribute('download', 'edited_audio.mp3')
    //         document.body.appendChild(link)
    //         link.click()
    //     } catch (error) {
    //         console.error('Error editing metadata:', error)
    //     }
    // }

    // const handleConvert = async (e) => {
    //     e.preventDefault()
    //     if (!file) return

    //     const formData = new FormData()
    //     formData.append('audio', file)
    //     formData.append('format', format)

    //     try {
    //         const response = await axios.post('http://localhost:5000/convert', formData, {
    //             responseType: 'blob',
    //         })
    //         const url = window.URL.createObjectURL(new Blob([response.data]))
    //         const link = document.createElement('a')
    //         link.href = url
    //         link.setAttribute('download', `converted_audio.${format}`)
    //         document.body.appendChild(link)
    //         link.click()
    //     } catch (error) {
    //         console.error('Error converting file:', error)
    //     }
    // }

    return (
        <div className="m-6 flex-center gap-6 flex-col">
            <form
                id="upload-audio"
                onSubmit={handleUpload}
                className="w-full max-w-2xl flex-center flex-col rounded-lg p-6 shadow-neu-light-md dark:shadow-neu-dark-md">
                <h2 className="text-primary font-aladin tracking-wider text-2xl">Upload Audio</h2>
                <p className="text-primary text-center mb-6">Upload an audio file to edit metadata, convert format, and more!</p>

                <UploadInput id="upload_audio" file={file} setFile={setFile} fileName={fileName} setFileName={setFileName} />

                <button type="submit" title="Upload Audio" className="neu-btn flex-shrink-0">
                    Upload Audio
                </button>
            </form>

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

            <form
                id="convert-audio"
                onSubmit={handleConvert}
                className="w-full max-w-2xl flex-center flex-col rounded-lg gap-6 p-6 shadow-neu-light-md dark:shadow-neu-dark-md">
                <h2 className="text-primary font-aladin tracking-wider text-2xl">Convert Audio Format</h2>

                <div className="neu-form-group w-full">
                    <label className="neu-form-label" htmlFor="format">
                        Format
                    </label>
                    <select className="neu-form-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                    </select>
                </div>
            </form>
        </div>
    )
}

export default AudioEditor
