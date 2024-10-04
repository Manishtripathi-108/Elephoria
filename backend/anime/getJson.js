const fs = require("fs");

const Anime = fs.readFileSync("./anime/anime.json", "utf-8");

// Parse the JSON string into an object
const parsedAnime = JSON.parse(Anime);

const getJson = (req, res) => {
	// console.log("Get Anime", parsedAnime);

	// Send the parsed JSON in the response
	res.json(parsedAnime);
};

module.exports = getJson;
