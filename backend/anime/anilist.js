const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables from the root .env file
dotenv.config({ path: "../.env" });

// Default configuration for Axios
const axiosConfig = {
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	baseURL: process.env.ANILIST_API_URL || "https://graphql.anilist.co",
};

// Unified error handler
const handleError = (res, message, error) => {
	console.error(message, error);

	const retryAfter = error.response?.headers["retry-after"];

	// Handling unauthorized errors separately
	if (error.response?.status === 401) {
		return res.status(401).json({
			message: "Unauthorized. Please log in again.",
			error: error.response.data || "Token expired or invalid.",
			retryAfter,
		});
	}

	// General error response
	res.status(500).json({
		message,
		error:
			error?.response?.data ||
			error?.message ||
			error ||
			"Internal Server Error",
		retryAfter,
	});
};

// Function to fetch anime list from AniList API
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
		res.json(response.data);
	} catch (error) {
		handleError(res, "Error fetching data from AniList", error);
	}
};

// Function to exchange the pin for an access token
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

		res.json({ accessToken: response.data.access_token });
	} catch (error) {
		handleError(res, "Error exchanging pin for token", error);
	}
};

// Function to fetch user data
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
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		res.json(response.data.data.Viewer);
	} catch (error) {
		handleError(res, "Error fetching user data", error);
	}
};

// Function to fetch the current logged-in user's ID
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
		console.error("Error fetching user ID:", error.message);
		return null;
	}
};

// Function to fetch user's anime/manga list by userId
const fetchUserMedia = async (req, res) => {
	const { accessToken } = req.body;
	const userId = await fetchUserId(accessToken);

	if (!userId) {
		return res.status(500).json({ message: "Error fetching user ID" });
	}

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
					userId: userId,
					type: String(req.body.type || "ANIME").toUpperCase(),
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
			mediaList: response.data.data.MediaListCollection,
		});
	} catch (error) {
		handleError(res, "Error fetching user media list", error);
	}
};

// Function to fetch user's favorites by userId
const fetchUserFavorites = async (req, res) => {
	const { accessToken } = req.body;
	const userId = await fetchUserId(accessToken);

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

// Function to map multiple MAL IDs to AniList IDs
const getAniListIds = async (req, res) => {
	const { malIds, mediaType } = req.body;

	// Construct a GraphQL query that fetches AniList IDs for multiple MAL IDs
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
				variables: { idMals: malIds, type: mediaType.toUpperCase() },
			},
			axiosConfig
		);

		// Map of MAL ID to AniList ID
		const aniListIds = response.data.data.Page.media.reduce(
			(acc, mediaItem) => {
				acc[mediaItem.idMal] = mediaItem.id;
				return acc;
			},
			{}
		);

		res.json({
			aniListIds,
		});
	} catch (error) {
		handleError(res, "Error fetching AniList IDs for MAL IDs:", error);
	}
};

// Function to add media to AniList user list
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
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		res.json({
			SaveMediaListEntry: response.data.data.SaveMediaListEntry,
			retryAfter: response.headers["retry-after"],
			rateRemaining: response.headers["x-ratelimit-remaining"],
		});
	} catch (error) {
		handleError(
			res,
			`Error adding media to AniList for Media ID ${mediaId}:`,
			error
		);
	}
};

module.exports = {
	getAnimeList,
	exchangePinForToken,
	fetchUserData,
	fetchUserMedia,
	fetchUserFavorites,
	getAniListIds,
	addToAniList,
};
