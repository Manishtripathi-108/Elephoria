import * as Yup from 'yup'

/* -------------------------------- Meta tags ------------------------------- */
export const META_TAGS = {
    title: {
        className: 'order-1 col-span-1 sm:col-span-2',
        placeholder: 'e.g., My Song',
        validate: Yup.string().required('Title is required'),
    },
    artist: {
        className: 'order-2 col-span-1',
        placeholder: 'e.g., John Doe',
        validate: Yup.string().required('Artist is required'),
    },
    album: {
        className: 'order-3 col-span-1',
        placeholder: 'e.g., My Album',
        validate: Yup.string(),
    },
    album_artist: {
        className: 'order-4 col-span-1',
        placeholder: 'e.g., John Doe, Jane Doe',
        validate: Yup.string(),
    },
    genre: {
        className: 'order-5 col-span-1 sm:col-span-2 lg:col-span-2',
        placeholder: 'e.g., Pop, Rock, Country',
        validate: Yup.string(),
    },
    date: {
        className: 'order-6 col-span-1',
        placeholder: 'e.g., 2021',
        validate: Yup.string()
            .test('year', 'Year must be between 1700 and current year', (value) => {
                const year = parseInt(value, 10)
                const currentYear = new Date().getFullYear()
                return year >= 1700 && year <= currentYear
            })
            .required('Year is required'),
        type: 'number',
    },
    track: {
        className: 'order-7 col-span-1',
        placeholder: 'e.g., 1',
        validate: Yup.string().matches(/^\d+$/, 'Track number must be a number').required('Track number is required'),
        type: 'number',
    },
    composer: {
        className: 'order-8 col-span-1',
        placeholder: 'e.g., Ludwig van Beethoven',
        validate: Yup.string(),
    },
    lyricist: {
        className: 'order-9 col-span-1',
        placeholder: 'e.g., John Doe',
        validate: Yup.string(),
    },
    lyrics: {
        className: 'order-10 col-span-full',
        placeholder: 'Lyrics here...',
        type: 'textarea',
        validate: Yup.string(),
    },
    comment: {
        className: 'order-11 col-span-1',
        placeholder: 'Additional notes here...',
        validate: Yup.string(),
    },
    publisher: {
        className: 'order-12 col-span-1',
        placeholder: 'e.g., Universal Music',
        validate: Yup.string(),
    },
    isrc: {
        className: 'order-13 col-span-1',
        placeholder: 'e.g., USRC17607839',
        validate: Yup.string().matches(/^\w{2}-\w{3}-\w{5}-\d{2}$/, 'Invalid ISRC format'),
    },
    bpm: {
        className: 'order-14 col-span-1',
        placeholder: 'e.g., 120',
        validate: Yup.string().matches(/^\d+$/, 'BPM must be a number'),
        type: 'number',
    },
    language: {
        className: 'order-15 col-span-1',
        placeholder: 'e.g., English',
        validate: Yup.string(),
    },
    conductor: {
        className: 'order-16 col-span-1',
        placeholder: 'e.g., John Smith',
        validate: Yup.string(),
    },
    mood: {
        className: 'order-17 col-span-1',
        placeholder: 'e.g., Happy, Sad',
        validate: Yup.string(),
    },
    rating: {
        className: 'order-18 col-span-1',
        placeholder: 'e.g., 5',
        validate: Yup.string().matches(/^\d+$/, 'Rating must be a number'),
        type: 'number',
    },
    media_type: {
        className: 'order-19 col-span-1',
        placeholder: 'e.g., Digital, Vinyl',
        validate: Yup.string(),
    },
    catalog_number: {
        className: 'order-20 col-span-1',
        placeholder: 'e.g., 123456',
        validate: Yup.string().matches(/^\w+$/, 'Catalog number must be alphanumeric'),
    },
    encoder: {
        className: 'order-21 col-span-1',
        placeholder: 'e.g., LAME 3.99',
        validate: Yup.string(),
    },
    copyright: {
        className: 'order-22 col-span-1',
        placeholder: 'e.g., © 2024',
        validate: Yup.string(),
    },
    url: {
        className: 'order-23 col-span-1',
        placeholder: 'e.g., https://example.com',
        validate: Yup.string().url('Must be a valid URL'),
    },
}

/* ---------------------------- Constants --------------------------- */
export const MAX_FILES = 10
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const SUPPORTED_SAMPLE_RATES = ['no change', '44100 Hz', '48000 Hz', '96000 Hz']
export const SUPPORTED_CHANNELS = ['no change', 'mono', 'stereo']
export const SUPPORTED_PLAYBACK_SPEEDS = ['0.25x (Very Slow)', '0.5x (Slow)', '1.0x (Normal)', '1.5x (Fast)', '2.0x (Very Fast)']
export const SUPPORTED_FORMATS = ['AAC', 'MP3', 'WMA', 'AIFF', 'FLAC', 'OGG', 'M4A', 'WAV']
export const QUALITY_OPTIONS = [
    { label: 'Economy (64 kbps)', value: 64 },
    { label: 'Standard (128 kbps)', value: 128 },
    { label: 'Good (192 kbps)', value: 192 },
    { label: 'Ultra (256 kbps)', value: 256 },
    { label: 'Best (320 kbps)', value: 320 },
]

/* ----------------------------- Initial Values ----------------------------- */
export const AUDIO_OPTIONS_INITIAL_VALUES = {
    audio: {
        channels: '0',
        volume: 100,
        sampleRate: '44100 Hz',
    },
    effects: {
        fadeIn: '',
        fadeOut: '',
        playbackSpeed: '1.0x (Normal)',
        pitchShift: '',
        normalize: false,
    },
    trim: {
        trimStart: '',
        trimEnd: '',
    },
}

export const AUDIO_CONVERTER_INITIAL_VALUES = {
    files: [],
    sameFormatForAll: true,
    global: {
        format: 'M4A',
        quality: 128,
        advanceSettings: {
            ...AUDIO_OPTIONS_INITIAL_VALUES,
        },
    },
    fileSettings: [],
}

/* --------------------------- Validation Schemas --------------------------- */
export const audioOptionsValidationSchema = Yup.object().shape({
    audio: Yup.object().shape({
        channels: Yup.string().oneOf(['0', '1', '2'], 'Invalid channel selection'),
        volume: Yup.number().min(0, 'Volume cannot be negative').max(500, 'Volume cannot exceed 500%'),
        sampleRate: Yup.string().oneOf(SUPPORTED_SAMPLE_RATES, 'Invalid sample rate'),
    }),

    effects: Yup.object().shape({
        fadeIn: Yup.number().min(0, 'Fade-in cannot be negative').max(10, 'Fade-in too long'),
        fadeOut: Yup.number().min(0, 'Fade-out cannot be negative').max(10, 'Fade-out too long'),
        playbackSpeed: Yup.string().oneOf(SUPPORTED_PLAYBACK_SPEEDS, 'Invalid playback speed'),
        pitchShift: Yup.number().min(-12, 'Pitch shift cannot go lower than -12 semitones').max(12, 'Pitch shift cannot exceed +12 semitones'),
        normalize: Yup.boolean(),
    }),

    trim: Yup.object().shape({
        trimStart: Yup.string()
            .matches(/^(\d{2}):(\d{2}):(\d{2})$/, 'Format must be HH:MM:SS')
            .test('isValidTime', 'Time is invalid', (value) => {
                if (value) {
                    const [hours, minutes, seconds] = value.split(':').map(Number)
                    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60
                }
                return true
            }),

        trimEnd: Yup.string()
            .matches(/^(\d{2}):(\d{2}):(\d{2})$/, 'Format must be HH:MM:SS')
            .test('isValidTime', 'Time is invalid', (value) => {
                if (value) {
                    const [hours, minutes, seconds] = value.split(':').map(Number)
                    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60
                }
                return true
            })
            .test('isAfterTrimStart', 'End time must be after start time', function (value) {
                const trimStart = this.parent.trimStart
                if (value && trimStart) {
                    const [startHours, startMinutes, startSeconds] = trimStart.split(':').map(Number)
                    const [endHours, endMinutes, endSeconds] = value.split(':').map(Number)

                    return (
                        endHours > startHours ||
                        (endHours === startHours && endMinutes > startMinutes) ||
                        (endHours === startHours && endMinutes === startMinutes && endSeconds > startSeconds)
                    )
                }
                return true
            }),
    }),
})

export const audioConverterValidationSchema = Yup.object().shape({
    files: Yup.array()
        .min(1, 'Please upload at least one file')
        .max(MAX_FILES, `You can only upload up to ${MAX_FILES} files`)
        .of(
            Yup.mixed()
                .test('fileType', 'Only audio files are allowed', (file) => file && file.type.startsWith('audio/'))
                .test('fileSize', 'Each file must be under 50MB', (file) => file && file.size <= MAX_FILE_SIZE)
        ),
    fileSettings: Yup.array().of(
        Yup.object().shape({
            format: Yup.string().oneOf(SUPPORTED_FORMATS, 'Invalid format').required('Format is required'),
            quality: Yup.number()
                .oneOf(
                    QUALITY_OPTIONS.map(({ value }) => value),
                    'Invalid quality'
                )
                .required('Quality is required'),
        })
    ),
    global: Yup.object().shape({
        format: Yup.string().oneOf(SUPPORTED_FORMATS, 'Invalid format').required('Format is required'),
        quality: Yup.number()
            .oneOf(
                QUALITY_OPTIONS.map(({ value }) => value),
                'Invalid quality'
            )
            .required('Quality is required'),
    }),
    sameFormatForAll: Yup.boolean(),
})
