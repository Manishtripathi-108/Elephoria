const axios = require("axios");

const anilistApi = axios.create({
	baseURL: process.env.ANILIST_API_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

module.exports = anilistApi;
