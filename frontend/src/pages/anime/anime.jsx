import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import AnimeCardList from './components/AnimeCardList'
import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeList from './components/AnimeList'
import AnimeNav from './components/AnimeNav'
import { TabEnum } from './components/constants'
import fetchAnimeList from './queries/fetchAnimeList'

function AnimePage() {
    const [activeTab, setActiveTab] = useState(TabEnum.ANIME)
    const [isListView, setIsListView] = useState(true)
    const [animeDataList, setAnimeDataList] = useState([])

    useEffect(() => {
        const loadAnimeData = async () => {
            const fetchedData = await fetchAnimeList(1)
            setAnimeDataList(fetchedData?.data?.Page?.media || [])
        }

        loadAnimeData()
    }, [])

    return (
        <div>
            <AnimeHeader />
            <AnimeNav currentTab={setActiveTab} />

            {/* Toggle Buttons for List and Card View */}
            <div className="flex items-center justify-end px-4">
                {/* Display List Button */}
                <button
                    className={`text-primary neu-btn ${isListView ? 'active' : ''} rounded-lg rounded-e-none p-2 shadow-none dark:shadow-none`}
                    aria-pressed={isListView}
                    aria-label="Display as list"
                    onClick={() => setIsListView(true)}>
                    <Icon icon="tabler:list" className="size-4" />
                </button>

                {/* Display Card Button */}
                <button
                    className={`text-primary neu-btn ${!isListView ? 'active' : ''} rounded-lg rounded-s-none p-2 shadow-none dark:shadow-none`}
                    aria-pressed={!isListView}
                    aria-label="Display as card"
                    onClick={() => setIsListView(false)}>
                    <Icon icon="material-symbols:cards-outline-rounded" className="size-4" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto flex flex-col items-start justify-center gap-2 p-2 md:flex-row md:gap-5 md:p-5">
                {/* Anime Filter */}
                <AnimeFilter currentList={activeTab} />

                {/* Conditional rendering based on view type */}
                {isListView ? <AnimeList dataList={animeDataList} /> : <AnimeCardList dataList={animeDataList} />}
            </div>
        </div>
    )
}

export default AnimePage
