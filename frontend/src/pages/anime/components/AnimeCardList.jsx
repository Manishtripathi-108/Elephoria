import React from 'react'

import AnimeCard from './AnimeCard'

function AnimeCardList({ anime }) {
    return (
        <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-4 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
            <h2 className="text-primary bg-secondary mb-4 rounded-t-xl p-4 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                Planing
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                <AnimeCard />
                <AnimeCard />
                <AnimeCard />
                <AnimeCard />
                <AnimeCard />
            </div>
        </div>
    )
}

export default AnimeCardList
