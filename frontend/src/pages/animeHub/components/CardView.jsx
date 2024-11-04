import React from 'react'

import NoContentCard from '../../../components/common/NoContentCard'
import MediaCard from './MediaCard'

function CardView({ data = [], isFavourite = false }) {
    // Render Favourite List (Anime and Manga)
    if (isFavourite) {
        return data?.anime?.length > 0 || data?.manga?.length > 0 ? (
            <>
                {/* Favourite Anime Section */}
                {data.anime.length > 0 && (
                    <div className="mb-5 w-full">
                        <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                            Favourite Anime
                        </h2>
                        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                            {data.anime.map((mediaItem) => (
                                <MediaCard key={mediaItem.id} mediaItem={mediaItem} isFavouriteList={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Favourite Manga Section */}
                {data.manga.length > 0 && (
                    <div className="w-full">
                        <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                            Favourite Manga
                        </h2>
                        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                            {data.manga.map((mediaItem) => (
                                <MediaCard key={mediaItem.id} mediaItem={mediaItem} isFavouriteList={true} />
                            ))}
                        </div>
                    </div>
                )}
            </>
        ) : (
            <NoContentCard name="favourites" message={`Add some favourite anime or manga to your list to see them here.`} />
        )
    }

    // Render Regular Media List (Anime/Manga)
    return data.length > 0 ? (
        data.map((list) => (
            <div key={list.name} className="mb-5 w-full">
                {/* Category Header */}
                <h2 className="text-primary bg-secondary mb-2 rounded-t-xl p-3 font-aladin text-lg tracking-widest shadow-neu-light-sm dark:shadow-neu-dark-sm">
                    {list.name}
                </h2>

                {/* Media Grid */}
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {list.entries.length > 0 ? (
                        list.entries.map((entry) => <MediaCard key={entry.media?.id} mediaItem={entry} />)
                    ) : (
                        <NoContentCard name={list.name} message={`Add some media to your list to see them here.`} />
                    )}
                </div>
            </div>
        ))
    ) : (
        <NoContentCard name="media" message={`Add some media to your lists to see them here.`} />
    )
}

export default React.memo(CardView)
