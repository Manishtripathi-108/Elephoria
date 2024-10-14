import React from 'react'

import AnimeCard from './AnimeCard'
import SkeletonCard from './loading/SkeletonCard'

function AnimeCardList({ dataList = [] }) {
    return (
        <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            {dataList.length > 0
                ? dataList.map((list) => (
                      <div key={list.name} className="mb-5 w-full">
                          {/* Category Header */}
                          <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                              {list.name}
                          </h2>

                          {/* Anime Grid */}
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                              {list.entries.length > 0
                                  ? list.entries.map((media) => <AnimeCard key={media.media?.id} anime={media} />)
                                  : 'No anime found in this list.'}
                          </div>
                      </div>
                  ))
                : /* Render Skeletons when dataList is empty */
                  Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
    )
}

export default React.memo(AnimeCardList)
