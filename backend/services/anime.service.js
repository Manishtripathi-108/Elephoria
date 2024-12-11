import anilistApi from "../config/anilist.config.js";
import { backendLogger } from "../utils/logger.js";

// const fetchAnimeList = async (req) => {
// 	const response = await anilistApi.post("/", {
// 		query: req.body.query,
// 		variables: req.body.variables,
// 	});

// 	return res.json(response.data);
// };

const exchangePinForToken = async (pin) => {
	const response = await anilistApi.post(
		"https://anilist.co/api/v2/oauth/token",
		{
			grant_type: "authorization_code",
			client_id: process.env.ANILIST_CLIENT_ID,
			client_secret: process.env.ANILIST_CLIENT_SECRET,
			redirect_uri: process.env.ANILIST_REDIRECT_URI,
			code: pin,
		}
	);

	const userId = await fetchUserId(response.data.access_token);
	response.data.user_id = userId;

	return response.data;
};

const renewAniListToken = async (refreshToken) => {
	const response = await anilistApi.post(
		"https://anilist.co/api/v2/oauth/token",
		{
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: process.env.ANILIST_CLIENT_ID,
			client_secret: process.env.ANILIST_CLIENT_SECRET,
		}
	);

	backendLogger.info("Renewed AniList token", {
		userId: response.data.user_id,
	});

	const userId = await fetchUserId(response.data.access_token);
	response.data.user_id = userId;

	return response.data;
};

const fetchUserId = async (token) => {
	const query = `
        query {
            Viewer {
                id
            }
        }
    `;

	const response = await anilistApi.post(
		"/",
		{ query },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data.data.Viewer.id;
};

const fetchUserData = async (token) => {
	const query = `
        query {
            Viewer {
                id
                name
                avatar { large }
                bannerImage
            }
        }
    `;

	const response = await anilistApi.post(
		"/",
		{ query },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data.data.Viewer;
};

const fetchUserMedia = async (token, userId, mediaType, onlyIds = false) => {
	const allMedia = `
        query ($userId: Int, $type: MediaType) {
            MediaListCollection(userId: $userId, type: $type) {
                lists {
                    name
                    entries {
						id
                        progress
                        status
                        updatedAt
                        createdAt
                        media {
                            id
                            type
                            format
                            chapters
                            status
                            description
                            duration
                            episodes
                            genres
                            averageScore
                            popularity
                            isFavourite
                            title {
                                romaji
                                english
                                native
                            }
                            bannerImage
                            coverImage {
                                large
                            }
                            startDate {
                                day
                                month
                                year
                            }
                        }
                    }
                }
            }
        }
    `;

	const onlyIdsQuery = `
        query ($userId: Int, $type: MediaType) {
            MediaListCollection(userId: $userId, type: $type) {
                lists {
                    name
                    entries {
                        media {
                            id
                            idMal
                        }
                    }
                }
            }
        }
    `;

	const query = onlyIds ? onlyIdsQuery : allMedia;

	const response = await anilistApi.post(
		"/",
		{
			query,
			variables: {
				userId,
				type: mediaType,
			},
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data.data.MediaListCollection;
};

const fetchUserFavourites = async (token, userId) => {
	const query = `
        query ($userId: Int) {
            User(id: $userId) {
                favourites {
                    anime {
                        nodes {
                            id
                            type
                            format
                            status
                            description
							isFavourite
                            duration
                            episodes
                            genres
                            title {
                                romaji
                                english
                                native
                            }
                            coverImage {
                                large
                            }
                            startDate {
                                day
                                month
                                year
                            }
                        }
                    }
                    manga {
                        nodes {
                            id
                            type
                            format
                            status
                            chapters
                            description
                            genres
							isFavourite
                            title {
                                romaji
                                english
                                native
                            }
                            coverImage {
                                large
                            }
                            startDate {
                                day
                                month
                                year
                            }
                        }
                    }
                }
            }
        }
    `;

	const response = await anilistApi.post(
		"/",
		{ query, variables: { userId } },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data?.data?.User?.favourites;
};

const fetchAniListIds = async (malIds, mediaType) => {
	const query = `
        query ($idMals: [Int], $type: MediaType) {
            Page {
                media(idMal_in: $idMals, type: $type) {
                    id
                    idMal
                }
            }
        }
    `;

	const response = await anilistApi.post("/", {
		query,
		variables: {
			idMals: malIds,
			type: mediaType,
		},
	});

	return response;
};

const saveMediaEntry = async (token, mediaId, status, progress) => {
	const mutation = `
        mutation($mediaId: Int, $status: MediaListStatus, $progress: Int) {
            SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress) {
                id
				status
				progress
            }
        }
    `;

	const response = await anilistApi.post(
		"/",
		{
			query: mutation,
			variables: { mediaId, status, progress },
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response;
};

const toggleFavourite = async (token, mediaId, mediaType) => {
	// Mutation strings for Anime and Manga
	const mutationAnime = `
		mutation ToggleFavourite($mediaId: Int) {
			ToggleFavourite(animeId: $mediaId) {
				anime {
					nodes {
						id
					}
				}
			}
		}
	`;

	const mutationManga = `
		mutation ToggleFavourite($mediaId: Int) {
			ToggleFavourite(mangaId: $mediaId) {
				manga {
					nodes {
						id
					}
				}
			}
		}
	`;

	// Choose the correct mutation based on mediaType
	const mutation = mediaType === "anime" ? mutationAnime : mutationManga;

	const response = await anilistApi.post(
		"/",
		{
			query: mutation,
			variables: { mediaId },
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	// Extract favourite status from response
	const favouriteNodes = response.data.data.ToggleFavourite[mediaType].nodes;
	const isFavouriteNow = favouriteNodes.some((node) => node.id === mediaId);

	// Return the updated favourite status
	return isFavouriteNow;
};

const deleteMediaEntry = async (token, entryId) => {
	const mutation = `
		mutation DeleteMediaListEntry($entryId: Int) {
			DeleteMediaListEntry(id: $entryId) {
				deleted
			}
		}
	`;

	const response = await anilistApi.post(
		"/",
		{
			query: mutation,
			variables: { entryId },
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data.data.DeleteMediaListEntry.deleted;
};

export {
	exchangePinForToken,
	renewAniListToken,
	fetchUserId,
	fetchUserData,
	fetchUserMedia,
	fetchUserFavourites,
	fetchAniListIds,
	saveMediaEntry,
	toggleFavourite,
	deleteMediaEntry,
};
