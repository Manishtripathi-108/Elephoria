const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables from the .env file
// This includes API URLs, client IDs, secrets, etc.
dotenv.config({ path: "../.env" });

// Default configuration for Axios requests
const axiosConfig = {
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	baseURL: process.env.ANILIST_API_URL || "https://graphql.anilist.co", // Fallback to AniList's API
};

// Unified error handler function
// Logs the error, extracts rate limit info, and sends a formatted response back
const handleError = (res, message, error) => {
	console.error(message, error); // Log the error details

	const retryAfterSeconds = error.response?.headers["retry-after"]; // Time to wait before retrying
	const remainingRateLimit = error.response?.headers["x-ratelimit-remaining"]; // Remaining requests in the rate limit

	// Handle Unauthorized (401) errors separately
	if (error.response?.status === 401) {
		return res.status(401).json({
			message: "Unauthorized. Please log in again.",
			error: error?.response?.data || "Token expired or invalid.",
			retryAfterSeconds,
			remainingRateLimit,
		});
	}

	// Generic error response for other types of errors
	res.status(500).json({
		message,
		error: error || "Internal Server Error",
		retryAfterSeconds,
		remainingRateLimit,
	});
};

/**
 * Fetches the logged-in user's ID from AniList.
 *
 * @param {String} accessToken - Access token of the authenticated user.
 *
 * @returns {Number|null} Returns the user ID or null if the request fails.
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
					Authorization: `Bearer ${accessToken}`, // Auth header with access token
				},
			}
		);
		return response.data.data.Viewer.id; // Return the user's ID
	} catch (error) {
		console.error("Error fetching user ID:", error.message);
		return null; // Return null in case of error
	}
};

/**
 * Fetches a list of anime from AniList API.
 *
 * @param {Object} req - Express request object, expects `query` and `variables` in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Sends JSON response with data or error message.
 */
const getAnimeList = async (req, res) => {
	try {
		const response = await axios.post(
			"/",
			{
				query: req.body.query,
				variables: req.body.variables,
			},
			axiosConfig
		);
		res.json(response.data); // Send fetched data back to the client
	} catch (error) {
		handleError(res, "Error fetching data from AniList", error);
	}
};

/**
 * Exchanges a pin (authorization code) for an access token with AniList's OAuth.
 *
 * @param {Object} req - Express request object, expects `pin` in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Sends the access token as JSON or an error message.
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
				code: req.body.pin, // Authorization code provided by the user
			},
			axiosConfig
		);

		res.json({ accessToken: response.data.access_token }); // Return the access token to the user
	} catch (error) {
		const message =
			error.response?.data?.hint ||
			error?.message ||
			"Error exchanging pin for token";
		handleError(res, message, error);
	}
};

/**
 * Fetches the currently logged-in user's data from AniList.
 *
 * @param {Object} req - Express request object, expects `accessToken` in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Sends JSON response with user data or an error message.
 */
const fetchUserData = async (req, res) => {
	const { accessToken } = req.body;
	const query = `
        query {
            Viewer {
                id
                name
                avatar {
                    large
                }
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
					Authorization: `Bearer ${accessToken}`, // Auth header with access token
				},
			}
		);
		res.json(response.data.data.Viewer); // Send user data back to the client
	} catch (error) {
		handleError(res, "Error fetching user data", error);
	}
};

/**
 * Fetches the user's detailed anime/manga list from AniList, including media information like title, score, and genre.
 *
 * @param {Object} req - Express request object. Expects:
 *                       - `accessToken` (String) in the body, which is required for authentication.
 *                       - `mediaType` (optional, String: "ANIME" or "MANGA"), specifying the media type.
 * @param {Object} res - Express response object for sending back the result or error message.
 *
 * @returns {void} Sends a JSON response containing the user's media list with detailed media info or an error message.
 */
const fetchUserMediaDetails = async (req, res) => {
	const { accessToken, mediaType } = req.body;
	const userId = await fetchUserId(accessToken);

	if (!userId) {
		return res.status(500).json({ message: "Error fetching user ID" });
	}

	// GraphQL query to fetch user's media list with detailed information
	const query = `
        query ($userId: Int, $type: MediaType) {
            MediaListCollection(userId: $userId, type: $type) {
                lists {
                    name
                    entries {
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
					type: String(mediaType || "ANIME").toUpperCase(),
				},
			},
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`, // Auth header with access token
				},
			}
		);

		// Send back the media list details in the response
		res.json({
			mediaList: response.data.data.MediaListCollection,
		});
	} catch (error) {
		handleError(res, "Error fetching user media list details", error);
	}
};

/**
 * Fetches the user's anime/manga list from AniList, but only retrieves the AniList and MAL IDs for each media.
 *
 * @param {Object} req - Express request object. Expects:
 *                       - `accessToken` (String) in the body, required for authentication.
 *                       - `mediaType` (optional, String: "ANIME" or "MANGA"), specifying the media type.
 * @param {Object} res - Express response object for sending back the result or error message.
 *
 * @returns {void} Sends a JSON response containing the user's media list with AniList and MAL IDs or an error message.
 */
const fetchUserMediaIDs = async (req, res) => {
	const { accessToken, mediaType } = req.body;
	const userId = await fetchUserId(accessToken);

	if (!userId) {
		return res.status(500).json({ message: "Error fetching user ID" });
	}

	// GraphQL query to fetch only AniList ID and MAL ID for each media in the user's list
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
					type: String(mediaType || "ANIME").toUpperCase(),
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

		// Send back the media list IDs in the response
		res.json({
			mediaListIDs: response.data.data.MediaListCollection,
		});
	} catch (error) {
		handleError(res, "Error fetching user media list IDs", error);
	}
};

/**
 * Fetches the user's favorite anime/manga from AniList based on userId.
 *
 * @param {Object} req - Express request object, expects `accessToken` in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Sends JSON response with user's favorites or error message.
 */
const fetchUserFavorites = async (req, res) => {
	const { accessToken } = req.body;
	const userId = await fetchUserId(accessToken); // Fetch the user's ID

	if (!userId) {
		return res.status(500).json({ message: "Error fetching user ID" });
	}

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
					Authorization: `Bearer ${accessToken}`, // Auth header with access token
				},
			}
		);

		const favorites = response.data?.data?.User?.favourites;

		if (!favorites) {
			return res
				.status(404)
				.json({ message: "Favorites data not found" });
		}

		res.json({
			favorites: {
				anime: favorites.anime?.nodes || [],
				manga: favorites.manga?.nodes || [],
			},
		});
	} catch (error) {
		handleError(res, "Error fetching user favorites", error);
	}
};

/**
 * Maps multiple MAL IDs to AniList IDs in bulk.
 *
 * @param {Object} req - Express request object, expects `malIds` and `mediaType('ANIME'/'MANGA')` in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Sends JSON response with mapped AniList IDs or error message.
 */
const getAniListIds = async (req, res) => {
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
		handleError(res, "Error fetching AniList IDs for MAL IDs:", error);
	}
};

/**
 * Adds media to the user's AniList list.
 *
 * @param {Object} req - Express request object, expects `accessToken`, `mediaId`, and `status` in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Sends JSON response with the media list entry or error message.
 */
const addToAniList = async (req, res) => {
	const { accessToken, mediaId, status } = req.body;

	const mutation = `
        mutation($mediaId: Int, $status: MediaListStatus) {
            SaveMediaListEntry(mediaId: $mediaId, status: $status) {
                id
				status
			}
		}
    `;

	try {
		const response = await axios.post(
			"/",
			{
				query: mutation,
				variables: { mediaId, status },
			},
			{
				...axiosConfig,
				headers: {
					...axiosConfig.headers,
					Authorization: `Bearer ${accessToken}`, // Auth header with access token
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
			`Error adding media to AniList for Media ID ${mediaId}:`,
			error
		);
	}
};

const editAniListEntry = async (req, res) => {
	const { accessToken, mediaId, status, progress } = req.body;

	const mutation = `
        mutation($mediaId: Int, $status: MediaListStatus, $progress: Int) {
            SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress) {
                id
                status
                progress
                score
            }
        }
    `;

	try {
		const response = await axios.post(
			"/",
			{
				query: mutation,
				variables: {
					mediaId,
					status,
					progress,
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

		res.json({
			SaveMediaListEntry: response.data.data.SaveMediaListEntry,
			retryAfterSeconds: response.headers["retry-after"],
			remainingRateLimit: response.headers["x-ratelimit-remaining"],
		});
	} catch (error) {
		handleError(res, "Failed to update media entry", error);
	}
};

module.exports = {
	getAnimeList,
	exchangePinForToken,
	fetchUserData,
	fetchUserMediaDetails,
	fetchUserMediaIDs,
	fetchUserFavorites,
	getAniListIds,
	addToAniList,
	editAniListEntry,
};
