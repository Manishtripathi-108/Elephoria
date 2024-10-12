import axios from 'axios'

const fetchUserData = async (accessToken) => {
    const query = `
        query {
            Viewer {
                id
                name
                bannerImage
                avatar {
                    large
                }
            }
        }
    `

    try {
        const response = await axios.post(
            'https://graphql.anilist.co',
            {
                query,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        // Check if the response is successful
        if (response.status !== 200) {
            throw new Error('Failed to fetch user data')
        }

        return response.data
    } catch (error) {
        console.error('Error fetching user data:', error)
        return null
    }
}

export default fetchUserData
