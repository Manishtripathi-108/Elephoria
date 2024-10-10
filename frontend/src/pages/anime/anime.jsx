import { React, useState } from 'react'

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
            <AnimeList currentList={currentTab} />
        </div>
    )
}

export default Anime
