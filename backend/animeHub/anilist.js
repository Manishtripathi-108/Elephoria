const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

// Default Axios configuration for AniList API requests
const axiosConfig = {
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	baseURL: process.env.ANILIST_API_URL || "https://graphql.anilist.co",
};

// Unified error handler function: Logs the error, extracts rate limit info, and sends a formatted response back
const handleError = (res, message, error) => {
	console.error(message, error);

	const retryAfterSeconds = error.response?.headers["retry-after"];
	const remainingRateLimit = error.response?.headers["x-ratelimit-remaining"];

	if (error.response?.status === 401) {
		return res.status(401).json({
			message: "Session expired. Please log in again.",
			error: error?.response?.data || "Invalid or expired token.",
			retryAfterSeconds,
			remainingRateLimit,
		});
	}

	res.status(500).json({
		message,
		error: error || "Unexpected server error.",
		retryAfterSeconds,
		remainingRateLimit,
	});
};

/**
 * Fetches a list of anime from AniList API.
 *
 * @param {Object} req - Express request object with `query` and `variables` in the body
 * @param {Object} res - Express response object
 */
const fetchAnimeList = async (req, res) => {
	try {
		const response = await axios.post(
			"/",
			{
				query: req.body.query,
				variables: req.body.variables,
			},
			axiosConfig
		);
		res.json(response.data);
	} catch (error) {
		handleError(
			res,
			"Could not fetch anime list. Please try again.",
			error
		);
	}
};

/**
 * Exchanges an authorization code for an AniList access token.
 *
 * @param {Object} req - Express request object with `pin` in the body
 * @param {Object} res - Express response object
 */
const exchangePinForToken = async (req, res) => {
	try {
		const response = await axios.post(
			"https://anilist.co/api/v2/oauth/token",
			{
				grant_type: "authorization_code",
				client_id: process.env.ANILIST_CLIENT_ID,
				client_secret: process.env.ANILIST_CLIENT_SECRET,
				redirect_uri: process.env.ANILIST_REDIRECT_URI,
				code: req.body.pin,
			},
			axiosConfig
		);

		// Set the access token in an HTTP-only cookie with a 1-week expiration
		res.cookie("accessToken", response.data.access_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
		});

		// Send a response indicating success
		res.json({ success: true });
	} catch (error) {
		handleError(
			res,
			"Failed to exchange PIN for token. Please try again.",
			error
		);
	}
};

/**
 * Fetches the logged-in user's ID from AniList.
 *
 * @param {String} accessToken - Access token of the authenticated user.
 *
 * @returns {String} The user's ID from AniList.
 */
const fetchUserId = async (accessToken) => {
	const query = `
        query {
            Viewer {
                id
            }
        }
    `;
	try {
		const response = await axios.post(
			"/",
			{ query },
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		return response.data.data.Viewer.id;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves the logged-in user's profile data from AniList.
 *
 * @param {Object} req - Express request object with `userId` and `accessToken` in cookies
 * @param {Object} res - Express response object
 */
const fetchUserData = async (req, res) => {
	const accessToken = req.cookies.accessToken;
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

	try {
		const response = await axios.post(
			"/",
			{ query },
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		res.json({ userData: response.data.data.Viewer });
	} catch (error) {
		handleError(
			res,
			"Oops! Something went wrong while fetching your data. Please try refreshing the page or come back later.",
			error
		);
	}
};

/**
 * Retrieves a user's anime or manga list with detailed media information.
 *
 * @param {Object} req - Express request object with `mediaType` and `userId` in cookies
 * @param {Object} res - Express response object
 */
const fetchUserMediaDetails = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const userId = req.userId;

	const query = `
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

	try {
		const response = await axios.post(
			"/",
			{
				query,
				variables: {
					userId,
					type: String(req.body.mediaType || "ANIME").toUpperCase(),
				},
			},
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		res.json({ mediaList: response.data.data.MediaListCollection });
	} catch (error) {
		handleError(
			res,
			"Oops! Something went wrong while fetching your media list details. Please try again later.",
			error
		);
	}
};

/**
 * Retrieves only the AniList and MAL IDs of a user's anime/manga list.
 *
 * @param {Object} req - Express request object with `mediaType` and `userId` in cookies
 * @param {Object} res - Express response object
 */
const fetchUserMediaIDs = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const userId = req.userId;

	const query = `
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

	try {
		const response = await axios.post(
			"/",
			{
				query,
				variables: {
					userId,
					type: String(req.body.mediaType || "ANIME").toUpperCase(),
				},
			},
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		res.json({ mediaListIDs: response.data.data.MediaListCollection });
	} catch (error) {
		handleError(res, "Unable to fetch media IDs. Please try again.", error);
	}
};

/**
 * Retrieves the user's favourite anime/manga list from AniList.
 *
 * @param {Object} req - Express request object with `accessToken` in cookies
 * @param {Object} res - Express response object
 */
const fetchUserFavourites = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const userId = req.userId;

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

	try {
		const response = await axios.post(
			"/",
			{ query, variables: { userId } },
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const favourites = response.data?.data?.User?.favourites;

		if (!favourites) {
			return res
				.status(404)
				.json({ message: "Favourites data not found" });
		}

		res.json({
			favourites: {
				anime: favourites.anime?.nodes || [],
				manga: favourites.manga?.nodes || [],
			},
		});
	} catch (error) {
		handleError(
			res,
			"Unable to retrieve favourites. Please try again.",
			error
		);
	}
};

/**
 * Maps multiple MAL IDs to AniList IDs in bulk.
 *
 * @param {Object} req - Express request object with `malIds` and `mediaType` in body
 * @param {Object} res - Express response object
 */
const fetchAniListIds = async (req, res) => {
	const { malIds, mediaType } = req.body;

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

	try {
		const response = await axios.post(
			"/",
			{
				query,
				variables: {
					idMals: malIds,
					type: String(mediaType || "ANIME").toUpperCase(),
				},
			},
			axiosConfig
		);

		const aniListIds = response.data.data.Page.media.reduce(
			(acc, mediaItem) => {
				acc[mediaItem.idMal] = mediaItem.id;
				return acc;
			},
			{}
		);

		res.json({
			aniListIds,
			retryAfterSeconds: response.headers["retry-after"],
			remainingRateLimit: response.headers["x-ratelimit-remaining"],
		});
	} catch (error) {
		handleError(res, "Error fetching AniList IDs for MAL IDs.", error);
	}
};

/**
 * Adds or updates a media entry to the user's AniList account.
 *
 * @param {Object} req - Express request object with `accessToken`, `mediaId`, `status` and optionally `progress` in body
 * @param {Object} res - Express response object
 */
const saveMediaEntry = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const { mediaId } = req.body;
	const status = req.body.status.toUpperCase();
	let progress = status === "COMPLETED" ? 10000 : req.body.progress;

	const mutation = `
        mutation($mediaId: Int, $status: MediaListStatus, $progress: Int) {
            SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress) {
                id
				status
				progress
            }
        }
    `;

	try {
		const response = await axios.post(
			"/",
			{
				query: mutation,
				variables: { mediaId, status, progress },
			},
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		res.json({
			SaveMediaListEntry: response.data.data.SaveMediaListEntry,
			retryAfterSeconds: response.headers["retry-after"],
			remainingRateLimit: response.headers["x-ratelimit-remaining"],
		});
	} catch (error) {
		handleError(
			res,
			`Error adding media to AniList for Media ID ${mediaId}.`,
			error
		);
	}
};

const toggleFavourite = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const { mediaId, mediaType } = req.body;

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
	const mutation =
		mediaType.toLowerCase() === "anime" ? mutationAnime : mutationManga;

	try {
		const response = await axios.post(
			"/",
			{
				query: mutation,
				variables: { mediaId },
			},
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		// Extract favourite status from response
		const favouriteNodes =
			response.data.data.ToggleFavourite[mediaType.toLowerCase()].nodes;
		const isFavouriteNow = favouriteNodes.some(
			(node) => node.id === mediaId
		);

		// Return the updated favourite status
		res.json({
			mediaId,
			isFavourite: isFavouriteNow,
		});
	} catch (error) {
		handleError(
			res,
			"Failed to toggle favourite status. Please try again later.",
			error
		);
	}
};

const deleteMediaEntry = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const { entryId } = req.body;

	const mutation = `
		mutation DeleteMediaListEntry($entryId: Int) {
			DeleteMediaListEntry(id: $entryId) {
				deleted
			}
		}
	`;

	try {
		const response = await axios.post(
			"/",
			{
				query: mutation,
				variables: { entryId },
			},
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		res.json({
			deleted: response.data.data.DeleteMediaListEntry.deleted,
		});
	} catch (error) {
		handleError(
			res,
			"Failed to delete media entry. Please try again later.",
			error
		);
	}
};

module.exports = {
	fetchAnimeList,
	exchangePinForToken,
	fetchUserId,
	fetchUserData,
	fetchUserMediaDetails,
	fetchUserMediaIDs,
	fetchUserFavourites,
	fetchAniListIds,
	saveMediaEntry,
	toggleFavourite,
	deleteMediaEntry,
};
