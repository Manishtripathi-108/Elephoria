import React from 'react'

import MediaCard from './MediaCard'
import NoDataCard from './NoDataCard'
import SkeletonCard from './loading/SkeletonCard'

function MediaCardList({ data = [], isFavorite = false, loading = false }) {
    // Render NoDataCard if no data is found
    const noDataFound = (name) => (
        <div className="bg-primary mx-auto grid w-full place-items-center rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            <NoDataCard name={name} />
        </div>
    )

    // Render loading skeletons while data is being fetched
    if (loading) {
        return (
            <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        )
    }

    // Render Favorite List (Anime and Manga)
    if (isFavorite) {
        return data?.anime?.length > 0 || data?.manga?.length > 0 ? (
            <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
                {/* Favorite Anime Section */}
                {data.anime.length > 0 && (
                    <div className="mb-5 w-full">
                        <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                            Favorite Anime
                        </h2>
                        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                            {data.anime.map((mediaItem) => (
                                <MediaCard key={mediaItem.id} mediaItem={mediaItem} isFavorite={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Favorite Manga Section */}
                {data.manga.length > 0 && (
                    <div className="w-full">
                        <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                            Favorite Manga
                        </h2>
                        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                            {data.manga.map((mediaItem) => (
                                <MediaCard key={mediaItem.id} mediaItem={mediaItem} isFavorite={true} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ) : (
            noDataFound('favorites')
        )
    }

    // Render Regular Media List (Anime/Manga)
    return data.length > 0 ? (
        <div className="bg-primary mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            {data.map((list) => (
                <div key={list.name} className="mb-5 w-full">
                    {/* Category Header */}
                    <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                        {list.name}
                    </h2>

                    {/* Media Grid */}
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                        {list.entries.length > 0
                            ? list.entries.map((media) => <MediaCard key={media.media?.id} mediaItem={media} />)
                            : noDataFound(list.name)}
                    </div>
                </div>
            ))}
        </div>
    ) : (
        noDataFound('media')
    )
}

export default React.memo(MediaCardList)
