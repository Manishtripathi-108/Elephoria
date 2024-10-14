import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import axios from 'axios'

import AnimeCardList from './components/AnimeCardList'
import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeList from './components/AnimeList'
import AnimeNav from './components/AnimeNav'
import { TabEnum } from './components/constants'

function AnimePage() {
    const [activeTab, setActiveTab] = useState(TabEnum.ANIME)
    const [isListView, setIsListView] = useState(true)
    const [animeDataList, setAnimeDataList] = useState([])

    const accessToken = localStorage.getItem('accessToken')

    useEffect(() => {
        const loadAnimeData = async () => {
            try {
                const response = await axios.post('/api/anime/user-all-media', {
                    accessToken,
                })

                setAnimeDataList(response.data.animeList.lists)
            } catch (error) {
                console.error('Error fetching anime data:', error)
            }
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
