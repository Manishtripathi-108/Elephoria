const APP_ROUTES = {
    ROOT: '/',
    SHADOWS: '/shadows',
    AUDIO: {
        TAGS_EDITOR: '/audio/tags-editor',
        TAGS_EXTRACTOR: '/audio/tags-extractor',
    },
    ANIME: {
        ROOT: '/anime',
        ANIMELIST: '/anime/animelist',
        LOGIN: '/anime/login',
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
    NOT_FOUND: '*',
}

export default APP_ROUTES
