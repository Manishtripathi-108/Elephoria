export const FILTER_OPTIONS = {
    format: ['TV', 'Short', 'Movie', 'Special', 'OVA', 'ONA', 'Music'],
    genres: [
        'Action',
        'Adventure',
        'Comedy',
        'Drama',
        'Ecchi',
        'Fantasy',
        'Horror',
        'Mahou Shoujo',
        'Mecha',
        'Music',
        'Mystery',
        'Psychological',
        'Romance',
        'Slice of Life',
        'Sports',
        'Supernatural',
        'Thriller',
    ],
    status: ['Finished', 'Releasing', 'Not Yet Released', 'Cancelled'],
    sort: ['Average Score', 'Last Added', 'Last Updated', 'Popularity', 'Progress', 'Score', 'Title'],
}

export const SORT_OPTIONS = ['Average Score', 'Last Added', 'Last Updated', 'Popularity', 'Progress', 'Score', 'Title']
export const VALID_STATUSES = ['COMPLETED', 'CURRENT', 'DROPPED', 'PAUSED', 'PLANNING', 'REPEATING']
export const ANILIST_ANIME_TABS = ['All', 'Watching', 'Paused', 'Planning', 'Dropped', 'Repeating', 'Completed']
export const ANILIST_MANGA_TABS = ['All', 'Reading', 'Paused', 'Planning', 'Dropped', 'Repeating', 'Completed']

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const convertMonthNumberToName = (monthNumber) => {
    if (monthNumber >= 1 && monthNumber <= 12) {
        return MONTH_NAMES[monthNumber - 1]
    }
    return '...'
}

export const getTabOptions = (mediaType) => {
    switch (mediaType) {
        case 'anime':
            return ANILIST_ANIME_TABS
        case 'manga':
            return ANILIST_MANGA_TABS
        default:
            return ANILIST_ANIME_TABS
    }
}
