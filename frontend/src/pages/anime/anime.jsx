import { useState } from 'react'

import { Icon } from '@iconify/react'

import AnimeCardList from './components/AnimeCardList'
import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeList from './components/AnimeList'
import AnimeNav from './components/AnimeNav'
import { TabEnum } from './components/constants'

function Anime() {
    const [currentTab, setCurrentTab] = useState(TabEnum.ANIME)
    const [isListView, setIsListView] = useState(true) // true for list view, false for card view

    return (
        <div>
            <AnimeHeader />
            <AnimeNav currentTab={setCurrentTab} />

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
            <div className="container mx-auto flex flex-col items-start justify-center gap-5 p-5 md:flex-row">
                {/* Anime Filter */}
                <AnimeFilter currentList={currentTab} />

                {/* Conditional rendering based on view type */}
                {isListView ? <AnimeList currentList={currentTab} /> : <AnimeCardList />}
            </div>
        </div>
    )
}

export default Anime
