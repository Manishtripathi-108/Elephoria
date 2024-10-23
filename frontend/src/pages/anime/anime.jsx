import React, { useCallback, useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { Icon } from '@iconify/react'
import axios from 'axios'

import NoDataCard from '../../components/common/NoDataCard'
import ImportAnime from './ImportAnime'
import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeNav from './components/AnimeNav'
import MediaCardList from './components/MediaCardList'
import MediaList from './components/MediaList'
import AnimeSkeleton from './components/loading/AnimeSkeleton'

function AnimePage() {
    const [activeTab, setActiveTab] = useState('ANIME')
    const [isListView, setIsListView] = useState(true)
    const [mediaData, setMediaData] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [filteredMediaData, setFilteredMediaData] = useState([])
    const [isFilterActive, setIsFilterActive] = useState(false)

    const navigate = useNavigate() // Use for redirection to /anime/auth
    const accessToken = localStorage.getItem('accessToken') // Retrieve access token from local storage

    // Redirect to /anime/auth if accessToken is missing
    useEffect(() => {
        if (!accessToken) {
            navigate('/anime/auth')
        }
    }, [accessToken, navigate])

    // Fetch media data based on the active tab (Anime, Manga, or Favorites)
    const fetchMediaData = useCallback(async () => {
        if (!accessToken) return

        setIsLoading(true)
        setErrorMessage(null)
        setFilteredMediaData([])
        setIsFilterActive(false)

        try {
            let endpoint = '/api/anime/user-media'
            if (activeTab === 'FAVORITES') {
                endpoint = '/api/anime/user-favorites'
            }

            const response = await axios.post(endpoint, {
                accessToken,
                type: activeTab === 'MANGA' ? 'Manga' : 'Anime',
            })

            const mediaList = response.data.mediaList?.lists || response.data.favorites || []
            setMediaData(mediaList)
        } catch (error) {
            setErrorMessage(`Error fetching ${activeTab.toLowerCase()} data.`)
            console.error(`Error fetching ${activeTab.toLowerCase()} data:`, error)
        } finally {
            setIsLoading(false)
        }
    }, [activeTab, accessToken])

    // Fetch media data when the active tab changes
    useEffect(() => {
        if (['ANIME', 'MANGA', 'FAVORITES'].includes(activeTab)) fetchMediaData()
    }, [activeTab, fetchMediaData])

    // Decide whether to show filtered data or all media data
    const displayMediaData = isFilterActive && filteredMediaData.length > 0 ? filteredMediaData : mediaData

    // Render error message if there is an error
    if (errorMessage) {
        return (
            <div className="container mx-auto text-center">
                <h1 className="text-2xl text-red-500 dark:text-red-400">{errorMessage}</h1>
                <div className="flex-center mt-5">
                    <Link to="/anime/auth" className="neu-btn">
                        Go back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            <AnimeHeader />
            <AnimeNav currentTab={setActiveTab} /> {/* Navigation for tabs */}
            {isLoading ? (
                // Show loading skeleton while data is being fetched
                <AnimeSkeleton isList={isListView} />
            ) : activeTab !== 'IMPORT' ? (
                <>
                    {/* Toggle between List and Card views */}
                    <div className="container mx-auto flex items-center justify-end px-4">
                        <button
                            className={`text-primary neu-btn ${isListView ? 'active' : ''} rounded-lg rounded-e-none p-2 shadow-none dark:shadow-none`}
                            aria-pressed={isListView}
                            aria-label="Display as list"
                            onClick={() => setIsListView(true)}>
                            <Icon icon="tabler:list" className="size-4" />
                        </button>
                        <button
                            className={`text-primary neu-btn ${!isListView ? 'active' : ''} rounded-lg rounded-s-none p-2 shadow-none dark:shadow-none`}
                            aria-pressed={!isListView}
                            aria-label="Display as card"
                            onClick={() => setIsListView(false)}>
                            <Icon icon="material-symbols:cards-outline-rounded" className="size-4" />
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="container mx-auto flex flex-col items-start justify-center gap-2 md:flex-row md:gap-5 md:p-5">
                        {activeTab !== 'FAVORITES' && (
                            <AnimeFilter
                                data={mediaData}
                                setFilteredData={setFilteredMediaData}
                                setIsFilterActive={setIsFilterActive}
                                isLoading={isLoading}
                            />
                        )}

                        {/* Show NoDataCard component if no filtered data is found */}
                        <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
                            {isFilterActive && filteredMediaData.length === 0 ? (
                                <NoDataCard name="Filtered Results" message="No media matches your filter criteria. Please adjust the filters." />
                            ) : isListView ? (
                                <MediaList data={displayMediaData} isFavorite={activeTab === 'FAVORITES'} />
                            ) : (
                                <MediaCardList data={displayMediaData} isFavorite={activeTab === 'FAVORITES'} />
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="md:p-5">
                    <ImportAnime />
                </div>
            )}
        </div>
    )
}

export default AnimePage
