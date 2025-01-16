import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const spotifyConfig = axios.create({
    baseURL: process.env.ANILIST_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

console.log('Spotify API configured!');

export default spotifyConfig;
