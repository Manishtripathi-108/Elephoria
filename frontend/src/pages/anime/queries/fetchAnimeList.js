import axios from 'axios'

const fetchAnimeList = async (page) => {
    const query = `
            query ($page: Int = 1) {
            Page(page: $page, perPage: 10) {
                media(type: ANIME) {
                id
                title {
                    romaji
                    english
                    native
                }
                episodes
                format
                genres
                status
                startDate {
                    day
                    month
                    year
                }
                coverImage {
                    medium
                    large
                }
                }
            }
            }
`

    const variables = {
        page: page || 1,
    }

    try {
        const response = await axios.post('/api/anime', {
            query,
            variables,
        })

        return response.data
    } catch (error) {
        console.error('Error fetching anime list:', error)
    }
}

export default fetchAnimeList
