import { React, useState } from 'react'

import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeList from './components/AnimeList'
import AnimeNav from './components/AnimeNav'
import { TabEnum } from './components/constants'

function Anime() {
    const [currentTab, setCurrentTab] = useState(TabEnum.ANIME)

    return (
        <div>
            <AnimeHeader />
            <AnimeNav currentTab={setCurrentTab} />
            <div className="container mx-auto flex flex-col items-start justify-center gap-5 p-5 md:flex-row">
                <AnimeFilter currentList={currentTab} />
                <AnimeList currentList={currentTab} />
            </div>
        </div>
    )
}

export default Anime
