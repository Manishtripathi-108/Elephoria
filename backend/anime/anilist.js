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
	console.error(message, error.message || error);
	res.status(500).json({
		message,
		error: error.message || "Internal Server Error",
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
					Authorization: `Bearer ${accessToken}`, // Fixed template literal
				},
			}
		);

		return response.data.data.Viewer.id;
	} catch (error) {
		console.error("Error fetching user ID:", error.message);
		return null;
	}
};

// Function to fetch user's anime, manga, and favorite lists by userId
const fetchUserMediaAndFavorites = async (req, res) => {
	const { accessToken } = req.body;

	const userId = await fetchUserId(accessToken);

	if (!userId) {
		return res.status(500).json({ message: "Error fetching user ID" });
	}

	const query = `
        query ($userId: Int) {
            MediaListCollection(userId: $userId, type: ANIME) {
                lists {
                    name
                    entries {
                        score
                        progress
                        status
                        media {
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

		res.json({
			animeList: response.data.data.MediaListCollection,
		});
	} catch (error) {
		console.error("Error fetching user anime list:", error.message);
		res.status(500).json({
			message: "Error fetching user anime list",
		});
	}
};

module.exports = {
	getAnimeList,
	exchangePinForToken,
	fetchUserData,
	fetchUserMediaAndFavorites,
};
