const dotenv = require("dotenv");
const axios = require("axios"); // Ensure axios is required

// Load environment variables from the root .env file
dotenv.config({ path: "../.env" }); // Correct relative path

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

module.exports = { getAnimeList };
