const APP_ROUTES = {
    ROOT: '/',
    SHADOWS: '/shadows',
    AUDIO: {
        TAGS_EDITOR: '/audio/tags-editor',
    },
    ANILIST: {
        ANIME: '/anilist/anime',
        MANGA: '/anilist/manga',
        FAVOURITES: '/anilist/favourites',
        IMPORT_EXPORT: '/anilist/import-export',
        LOGIN: '/anilist/login',
    },
    ANIME_HUB: {
        ROOT: '/anime-hub',
        LOGIN: '/anime-hub/auth',
    },
    GAMES: {
        TIC_TAC_TOE: {
            ROOT: '/games/tic-tac-toe',
            CLASSIC: '/games/tic-tac-toe/classic',
            ULTIMATE: '/games/tic-tac-toe/ultimate',
        },
    },
    SPOTIFY: {
        LOGIN: '/spotify/login',
    },
    NOT_FOUND: '*',
}

export default APP_ROUTES
