const API_ROUTES = {
    TOKEN_FETCH: '/api/token',
    AUDIO: {
        UPLOAD: '/api/audio/upload',
        EXTRACT_METADATA: '/api/audio/extract-metadata',
        EDIT_METADATA: '/api/audio/edit-metadata',
    },
    USER: {
        LOGIN: '/api/user/login',
        REGISTER: '/api/user/register',
    },
    ANIME_HUB: {
        CHECK_AUTH: '/api/anime-hub/check-auth',
        LOGOUT: '/api/anime-hub/logout',
        LOGIN: '/api/anime-hub/login',
        USER_DATA: '/api/anime-hub/user-data',
        USER_MEDIA: '/api/anime-hub/user-media',
        FAVOURITE: '/api/anime-hub/favourite',
        ANILIST_IDS: '/api/anime-hub/anilist-ids',
        USER_MEDIA_IDS: '/api/anime-hub/user-media-ids',
        REFRESH_TOKEN: '/api/anime-hub/refresh-token',
        SAVE: '/api/anime-hub/save',
        TOGGLE_FAVOURITE: '/api/anime-hub/toggle-favourite',
        DELETE: '/api/anime-hub/delete',
    },
    LOGS: {
        FRONTEND: '/api/logs/frontend',
    },
}

export const API_TYPES = {
    APP: 'app',
    ANILIST: 'anilist',
}

// Dynamic API Endpoints

// const API_ROUTES = {
//   AUDIO: {
//     UPLOAD: `${BASE_URL}/audio/upload`,
//     DELETE: (id) => `${BASE_URL}/audio/delete/${id}`,
//     DETAILS: (id) => `${BASE_URL}/audio/details/${id}`,
//   },
// };

// usage

// axios.delete(API_ROUTES.AUDIO.DELETE(audioId));
// axios.get(API_ROUTES.AUDIO.DETAILS(audioId));

export default API_ROUTES
