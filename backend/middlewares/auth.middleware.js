import { fetchUserId } from '../services/anime.service.js';
import jwt from 'jsonwebtoken';

const verifyAuth = async (req, res, next) => {
    console.log('Verifying anime auth...');

    const token = req.cookies.anilistAccessToken;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    let userId;

    try {
        const decoded = jwt.decode(token);
        if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
        if (decoded.exp < Date.now() / 1000) return res.status(401).json({ message: 'Unauthorized' });
        if (!decoded.aud || decoded.aud !== process.env.ANILIST_CLIENT_ID)
            return res.status(401).json({ message: 'Unauthorized' });

        userId = decoded.sub;
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user ID if missing
    if (!userId) {
        try {
            userId = await fetchUserId(token);
            if (!userId) return handleUnauthorized(res, 'Unauthorized: Please log in again.');
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Attach user info to request
    req.body.anilistUserId = userId;
    req.body.anilistAccessToken = token;

    if (token && userId) next();
    else return res.status(401).json({ message: 'Unauthorized' });
};

export default verifyAuth;
