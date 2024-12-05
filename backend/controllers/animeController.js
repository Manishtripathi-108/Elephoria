const {
	exchangePinForToken,
	fetchUserData,
	fetchUserMedia,
	fetchUserFavourites,
	fetchAniListIds,
	saveMediaEntry,
	toggleFavourite,
	deleteMediaEntry,
} = require("../services/animeService");

const {
	successResponse,
	anilistErrorResponse,
} = require("../utils/responseHandler");

const setCookie = (res, name, value, options = {}) => {
	res.cookie(name, value, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		...options,
	});
};

exports.getToken = async (req, res) => {
	try {
		const data = await exchangePinForToken(req.body.pin);

		if (data.access_token) {
			setCookie(res, "anilistToken", data.access_token, {
				maxAge: data.expires_in * 10000,
			});
			setCookie(res, "anilistRefreshToken", data.refresh_token);
			setCookie(res, "anilistUserId", data.user_id);

			return successResponse(res, true);
		} else {
			return anilistErrorResponse(
				res,
				"Failed to Login. Please try again",
				data
			);
		}
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Failed to Login. Please try again",
			error
		);
	}
};

exports.getUserData = async (req, res) => {
	try {
		const data = await fetchUserData(req.body.anilistToken);
		return successResponse(res, data);
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Oops! Something went wrong while fetching your data. Please try refreshing the page or come back later.",
			error
		);
	}
};

exports.getUserMedia = async (req, res) => {
	try {
		const data = await fetchUserMedia(
			req.body.anilistToken,
			req.body.anilistUserId,
			String(req.body.mediaType || "ANIME").toUpperCase()
		);
		return successResponse(res, data);
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Oops! Something went wrong while fetching your media. Please try refreshing the page or come back later.",
			error
		);
	}
};

exports.getUserMediaIds = async (req, res) => {
	try {
		const data = await fetchUserMedia(
			req.body.anilistToken,
			req.body.anilistUserId,
			String(req.body.mediaType || "ANIME").toUpperCase(),
			true
		);
		return successResponse(res, data);
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Unable to fetch media IDs. Please try again.",
			error
		);
	}
};

exports.getUserFavourites = async (req, res) => {
	try {
		const data = await fetchUserFavourites(
			req.body.anilistToken,
			req.body.anilistUserId
		);

		if (!data) {
			return res
				.status(404)
				.json({ message: "Favourites data not found" });
		}

		return successResponse(res, {
			favourites: {
				anime: data.anime?.nodes || [],
				manga: data.manga?.nodes || [],
			},
		});
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Unable to retrieve favourites. Please try again.",
			error
		);
	}
};

exports.getAniListIds = async (req, res) => {
	try {
		const data = await fetchAniListIds(
			req.body.malIds,
			String(req.body.mediaType || "ANIME").toUpperCase()
		);

		const aniListIds = data.data.data.Page.media.reduce(
			(acc, mediaItem) => {
				acc[mediaItem.idMal] = mediaItem.id;
				return acc;
			},
			{}
		);
		return successResponse(res, {
			aniListIds,
			retryAfterSeconds: data.headers["retry-after"],
			remainingRateLimit: data.headers["x-ratelimit-remaining"],
		});
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Error fetching AniList IDs for MAL IDs.",
			error
		);
	}
};

exports.saveMedia = async (req, res) => {
	const status = req.body.status.toUpperCase();
	let progress = status === "COMPLETED" ? 10000 : req.body.progress;

	try {
		const data = await saveMediaEntry(
			req.body.anilistToken,
			req.body.mediaId,
			status,
			progress
		);
		return successResponse(res, {
			SaveMediaListEntry: data.data.data.SaveMediaListEntry,
			retryAfterSeconds: data.headers["retry-after"],
			remainingRateLimit: data.headers["x-ratelimit-remaining"],
		});
	} catch (error) {
		return anilistErrorResponse(res, "Failed to fetch AniList IDs", error);
	}
};

exports.toggleFavouriteMedia = async (req, res) => {
	try {
		const data = await toggleFavourite(
			req.body.anilistToken,
			req.body.mediaId,
			String(req.body.mediaType || "ANIME").toLowerCase()
		);
		return successResponse(res, data);
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Failed to toggle favourite status. Please try again later.",
			error
		);
	}
};

exports.deleteMedia = async (req, res) => {
	try {
		const data = await deleteMediaEntry(
			req.body.anilistToken,
			req.body.entryId
		);
		return successResponse(res, data);
	} catch (error) {
		return anilistErrorResponse(
			res,
			"Failed to delete media entry. Please try again later.",
			error
		);
	}
};

exports.logoutUser = (req, res) => {
	const { anilistToken, anilistRefreshToken, aniListUserId } = req.cookies;

	if (!anilistToken && !anilistRefreshToken && !aniListUserId) {
		return res.status(200).json({ message: "Already logged out." });
	}

	res.clearCookie("anilistToken", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});
	res.clearCookie("anilistRefreshToken", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});
	res.clearCookie("anilistUserId", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});

	res.status(200).json({ message: "Logged out successfully." });
};
