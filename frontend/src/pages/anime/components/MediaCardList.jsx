import React from 'react'

import MediaCard from './MediaCard'
import SkeletonCard from './loading/SkeletonCard'

function MediaCardList({ data = [], isFavorite = false }) {
    // Render Favorite List (Anime and Manga)
    if (isFavorite) {
        return data['anime'] && data['manga'] ? (
            <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
                {/* Render Anime Favorites */}
                <div className="mb-5 w-full">
                    <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                        Favorite Anime
                    </h2>
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                        {data.anime.length > 0
                            ? data.anime.map((mediaItem) => <MediaCard key={mediaItem.id} mediaItem={mediaItem} isFavorite={true} />)
                            : 'No anime favorites available'}
                    </div>
                </div>

                {/* Render Manga Favorites */}
                <div className="w-full">
                    <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                        Favorite Manga
                    </h2>
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                        {data.manga.length > 0
                            ? data.manga.map((mediaItem) => <MediaCard key={mediaItem.id} mediaItem={mediaItem} isFavorite={true} />)
                            : 'No manga favorites available'}
                    </div>
                </div>
            </div>
        ) : (
            <SkeletonCard />
        )
    }

    // Render Regular Media List (Anime/Manga)
    return (
        <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            {data.length > 0
                ? data.map((list) => (
                      <div key={list.name} className="mb-5 w-full">
                          {/* Category Header */}
                          <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                              {list.name}
                          </h2>

                          {/* Anime Grid */}
                          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                              {list.entries.length > 0
                                  ? list.entries.map((media) => <MediaCard key={media.media?.id} mediaItem={media} />)
                                  : 'No anime found in this list.'}
                          </div>
                      </div>
                  ))
                : /* Render Skeletons when data is empty */
                  Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
    )
}

export default React.memo(MediaCardList)
