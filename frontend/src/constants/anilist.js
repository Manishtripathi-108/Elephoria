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

export const ANILIST_TABS = ['All', 'Watching', 'Paused', 'Planning', 'Dropped', 'Repeating', 'Completed']

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const convertMonthNumberToName = (monthNumber) => {
    if (monthNumber >= 1 && monthNumber <= 12) {
        return MONTH_NAMES[monthNumber - 1]
    }
    return '...'
}
