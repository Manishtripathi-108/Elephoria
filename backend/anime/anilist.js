const dotenv = require("dotenv");
const axios = require("axios"); // Ensure axios is required

// Load environment variables from the root .env file
dotenv.config({ path: "../.env" }); // Correct relative path

// Function to fetch anime list from AniList API
const getAnimeList = async (req, res) => {
	const { query, variables } = req.body;

	try {
		const response = await axios.post(
			process.env.ANILIST_API_URL,
			{
				query: query,
				variables: variables,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}
		);

		res.json(response.data);
	} catch (error) {
		console.error("Error fetching data from AniList:", error);
		res.status(500).json({
			message: "Error fetching data from AniList",
			error: error.message,
		});
	}
};

// Function to exchange the pin for an access token
const exchangePinForToken = async (req, res) => {
	const { pin } = req.body;

	try {
		const response = await axios.post(
			"https://anilist.co/api/v2/oauth/token",
			{
				grant_type: "authorization_code",
				client_id: process.env.ANILIST_CLIENT_ID,
				client_secret: process.env.ANILIST_CLIENT_SECRET,
				redirect_uri: "https://anilist.co/api/v2/oauth/pin",
				code: pin,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}
		);

		res.json({ accessToken: response.data.access_token });
	} catch (error) {
		console.error(
			"Error exchanging pin for token:",
			error.response ? error.response.data : error.message
		);
		res.status(500).json({ message: "Error exchanging pin for token" });
	}
};

module.exports = { getAnimeList, exchangePinForToken };
