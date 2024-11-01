import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import NoDataCard from '../../components/common/NoDataCard'
import { useAnimeHubContext } from '../../context/AnimeHubContext'
import ImportAnime from './ImportMedia'
import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeNav from './components/AnimeNav'
import MediaCardList from './components/MediaCardList'
import MediaList from './components/MediaList'
import AnimeSkeleton from './components/loading/AnimeSkeleton'

function AnimeHub() {
    const [isListView, setIsListView] = useState(false)
    const [filteredMediaData, setFilteredMediaData] = useState([])
    const [isFilterActive, setIsFilterActive] = useState(false)

    const { mediaData, activeTab, setActiveTab, isLoading, error } = useAnimeHubContext()

    // Reset filtered data and filter state when the active tab changes
    useEffect(() => {
        setFilteredMediaData([])
        setIsFilterActive(false)
    }, [activeTab])

    // Decide whether to show filtered data or all media data
    const displayMediaData = isFilterActive && filteredMediaData.length > 0 ? filteredMediaData : mediaData

    return (
        <div>
            <AnimeHeader />
            <AnimeNav currentTab={setActiveTab} />

            {isLoading ? (
                <AnimeSkeleton isList={isListView} />
            ) : activeTab === 'IMPORT' ? (
                <div className="md:p-5">
                    <ImportAnime />
                </div>
            ) : (
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
                        {activeTab !== 'FAVOURITES' && (
                            <AnimeFilter
                                data={mediaData}
                                setFilteredData={setFilteredMediaData}
                                setIsFilterActive={setIsFilterActive}
                                isLoading={isLoading}
                            />
                        )}

                        <div
                            className={`bg-primary mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5 ${isListView ? '' : 'scrollbar-thin h-dvh overflow-y-scroll'}`}>
                            {isFilterActive && filteredMediaData.length === 0 ? (
                                <NoDataCard name="Filtered Results" message="No media matches your filter criteria. Please adjust the filters." />
                            ) : isListView ? (
                                <MediaList data={displayMediaData} isFavourite={activeTab === 'FAVOURITES'} />
                            ) : (
                                <MediaCardList data={displayMediaData} isFavourite={activeTab === 'FAVOURITES'} />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AnimeHub
