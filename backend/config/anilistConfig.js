import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const anilistApi = axios.create({
	baseURL: process.env.ANILIST_API_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export default anilistApi;
