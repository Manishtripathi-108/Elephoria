import React, { useEffect, useState } from 'react'

import AnimeCard from './AnimeCard'
import SkeletonCard from './loading/SkeletonCard'

function AnimeCardList({ dataList }) {
    return (
        <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            <h2 className="text-primary bg-secondary mb-4 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                Planing
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {dataList.length > 0
                    ? dataList.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
                    : Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)}
            </div>
        </div>
    )
}

export default AnimeCardList
