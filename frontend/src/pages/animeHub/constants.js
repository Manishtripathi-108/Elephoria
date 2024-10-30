export const TabEnum = {
    ANIME: 'anime',
    MANGA: 'manga',
    FAVOURITES: 'favourites',
    LOGOUT: 'logout',
}

export const filterOptions = [
    {
        name: 'format',
        options: ['TV', 'Short', 'Movie', 'Special', 'OVA', 'ONA', 'Music'],
    },
    {
        name: 'genres',
        options: [
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
    },
    {
        name: 'status',
        options: ['Finished', 'Releasing', 'Not Yet Released', 'Cancelled'],
    },
]

export const sortOptions = ['Average Score', 'Last Added', 'Last Updated', 'Popularity', 'Progress', 'Score', 'Title']

export const validStatus = ['COMPLETED', 'CURRENT', 'DROPPED', 'PAUSED', 'PLANNING', 'REPEATING']
