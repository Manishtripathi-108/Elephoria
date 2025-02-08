const API_ROUTES = {
    CHECK_ALL_AUTH: '/api/check-all-auth',
    APP: {
        CHECK_AUTH: '/api/app/check-auth',
        REFRESH_TOKEN: '/api/app/refresh-token',
    },
    AUDIO: {
        UPLOAD: '/api/audio/upload',
        EXTRACT_METADATA: '/api/audio/extract-metadata',
        EDIT_METADATA: '/api/audio/edit-metadata',
        CONVERT_AUDIO: '/api/audio/convert-audio',
    },
    USER: {
        LOGIN: '/api/user/login',
        REGISTER: '/api/user/register',
    },
    ANILIST: {
        CHECK_AUTH: '/api/anilist/check-auth',
        LOGOUT: '/api/anilist/logout',
        LOGIN: '/api/anilist/login',
        USER_DATA: '/api/anilist/user-data',
        USER_MEDIA: '/api/anilist/user-media',
        FAVOURITE: '/api/anilist/favourite',
        ANILIST_IDS: '/api/anilist/anilist-ids',
        USER_MEDIA_IDS: '/api/anilist/user-media-ids',
        REFRESH_TOKEN: '/api/anilist/refresh-token',
        SAVE: '/api/anilist/save',
        TOGGLE_FAVOURITE: '/api/anilist/toggle-favourite',
        DELETE: '/api/anilist/delete',
    },
    SPOTIFY: {
        CHECK_AUTH: '/api/spotify/check-auth',
        LOGIN: '/api/spotify/login',
        REFRESH_TOKEN: '/api/spotify/refresh-token',
    },
    LOGS: {
        FRONTEND: '/api/logs/frontend',
    },
}

export const API_TYPE = {
    APP: 'app',
    ANILIST: 'anilist',
    SPOTIFY: 'spotify',
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
