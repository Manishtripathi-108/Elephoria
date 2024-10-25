import React, { useCallback, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Icon } from '@iconify/react'

import { getUserMediaList } from '../../api/animeHubApi'
import NoDataCard from '../../components/common/NoDataCard'
import ImportAnime from './ImportMedia'
import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeNav from './components/AnimeNav'
import MediaCardList from './components/MediaCardList'
import MediaList from './components/MediaList'
import AnimeSkeleton from './components/loading/AnimeSkeleton'

function AnimeHub() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('ANIME')
    const [isListView, setIsListView] = useState(true)
    const [mediaData, setMediaData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filteredMediaData, setFilteredMediaData] = useState([])
    const [isFilterActive, setIsFilterActive] = useState(false)

    const accessToken = localStorage.getItem('accessToken')

    // Redirect to /anime-hub/auth if accessToken is missing
    useEffect(() => {
        if (!accessToken) {
            navigate('/anime-hub/auth')
        }
    }, [accessToken, navigate])

    // Fetch media data based on the active tab (Anime, Manga, or Favorites)
    const fetchMediaData = useCallback(async () => {
        if (!accessToken) return

        setIsLoading(true)
        setFilteredMediaData([])
        setIsFilterActive(false)

        try {
            let result = await getUserMediaList(accessToken, activeTab, activeTab === 'FAVORITES')

            if (result.success) {
                setMediaData(result.mediaList)
            } else if (result.retryAfterSeconds > 0) {
                window.addToast(`Rate limit exceeded. Try again after ${result.retryAfterSeconds} seconds.`, 'error')
            } else {
                window.addToast(result.message, 'error')
            }
        } catch (error) {
            window.addToast(`Error fetching ${activeTab.toLowerCase()} data.`, 'error', 10000)
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

export default AnimeHub
