import { fetchUserId, renewAniListToken } from "../services/animeService.js";
const setCookie = (res, name, value, options = {}) => {
	res.cookie(name, value, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		...options,
	});
};

const handleUnauthorized = (
	res,
	message = "Unauthorized: Please log in again."
) => {
	return res.status(401).json({ message });
};

const verifyAuth = async (req, res, next) => {
	let {
		anilistToken: token,
		anilistRefreshToken: refreshToken,
		anilistUserId: userId,
	} = req.cookies;

	// Check and renew token if missing
	if (!token && refreshToken) {
		const response = await renewAniListToken(refreshToken);
		if (!response.access_token) return handleUnauthorized(res);

		token = response.access_token;
		setCookie(res, "anilistToken", response.access_token, {
			maxAge: response.expires_in * 10000,
		});
		setCookie(res, "anilistRefreshToken", response.refresh_token);
		setCookie(res, "anilistUserId", response.user_id);
		userId = response.user_id;
	} else if (!token) {
		return handleUnauthorized(res);
	}

	// Fetch user ID if missing
	if (!userId) {
		try {
			userId = await fetchUserId(token);
			if (!userId)
				return handleUnauthorized(
					res,
					"Unauthorized: Please log in again."
				);
			setCookie(res, "anilistUserId", userId);
		} catch (error) {
			return res.status(500).json({
				message:
					"Failed to fetch user ID. Please reload the page or log in again.",
				error,
			});
		}
	}

	// Attach user info to request for access in further middleware/route handlers
	req.body.anilistUserId = userId;
	req.body.anilistToken = token;

	if (token && userId) next();
	else handleUnauthorized(res);
};

export default verifyAuth;
