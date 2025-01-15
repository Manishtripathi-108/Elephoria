import * as Yup from 'yup'

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
