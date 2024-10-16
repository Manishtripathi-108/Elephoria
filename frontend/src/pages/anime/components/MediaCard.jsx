import React from 'react'

import { Icon } from '@iconify/react'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const convertMonthNumberToName = (monthNumber) => {
    if (monthNumber >= 1 && monthNumber <= 12) {
        return monthNames[monthNumber - 1]
    }
    return '...'
}

function MediaCard({ mediaItem, isFavorite = false }) {
    // Handle favorites, which don't have the `media` nesting.
    const media = isFavorite ? mediaItem : mediaItem?.media

    return (
        <div className="group relative rounded-lg border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
            <img
                className="text-secondary h-full max-h-56 w-full rounded-t-lg border-b border-light-secondary object-cover dark:border-dark-secondary sm:max-h-72"
                src={media?.coverImage?.large}
                alt={media?.title?.english || media?.title?.native}
            />

            <div className="p-2">
                <h2
                    className={`text-primary line-clamp-1 font-aladin text-sm font-normal capitalize leading-none tracking-widest ${isFavorite && 'my-2'}`}>
                    {media?.title?.english || 'Untitled'}
                </h2>
                {!isFavorite && (
                    <span className="text-secondary font-indie-flower text-xs tracking-wider">
                        {media?.format || 'Unknown Format'}
                        {media?.type === 'ANIME' ? (
                            media?.format === 'MOVIE' ? (
                                <> &#8226; {media?.duration ?? '??'} min</>
                            ) : (
                                <>
                                    &nbsp;&#8226; {mediaItem?.progress ?? 0}/{media?.episodes ?? '??'} &#8226; {media?.duration ?? '??'} min/ep
                                </>
                            )
                        ) : (
                            // For manga, display chapters
                            <>
                                &nbsp;&#8226; Chapters: {mediaItem?.progress ?? 0}/{media?.chapters ?? '??'}
                            </>
                        )}
                    </span>
                )}
            </div>

            {/* Description Popup */}
            <div
                className="absolute inset-x-1/2 top-1/3 z-10 hidden w-72 rounded-lg border border-light-secondary bg-light-primary/60 p-3 opacity-0 backdrop-blur-md backdrop-saturate-150 transition-opacity duration-300 ease-in-out dark:border-dark-secondary dark:bg-dark-primary/50 sm:group-hover:block sm:group-hover:opacity-100"
                aria-hidden="true"
                aria-label="Anime Description Popup">
                {/* Title Section */}
                <div className="mb-2">
                    <h3 className="text-primary font-aladin text-xl font-bold tracking-widest" aria-live="polite">
                        {media?.title?.english || 'Untitled'}
                    </h3>
                </div>

                {/* Description Section */}
                <p className="text-secondary mb-3 line-clamp-5 font-indie-flower text-sm" aria-live="polite">
                    {media?.description || 'No description available.'}
                </p>

                {/* Additional Info */}
                <div className="text-secondary mb-4 space-y-1 font-indie-flower text-xs">
                    <p>
                        <strong className="text-primary">Japanese: </strong> {media?.title?.native || 'N/A'}
                    </p>
                    <p>
                        <strong className="text-primary">Aired: </strong>
                        {media?.startDate?.day + ' ' + convertMonthNumberToName(media?.startDate?.month) + ' ' + media?.startDate?.year}
                    </p>
                    <p>
                        <strong className="text-primary">Status: </strong> {media?.status || 'Unknown'}
                    </p>
                    <p>
                        <strong className="text-primary">Genres: </strong> {media?.genres?.join(', ') || 'N/A'}
                    </p>
                    {media?.type === 'ANIME' && (
                        <p>
                            <strong className="text-primary">Duration: </strong> {media?.duration} min/ep
                        </p>
                    )}
                </div>
            </div>

            {/* Dots Menu */}
            <button type="button" className="bg-secondary text-secondary absolute right-1 top-1 flex items-center justify-center rounded-lg p-0.5">
                <Icon icon="pepicons-pop:dots-y" className="size-6" />
            </button>
        </div>
    )
}

export default React.memo(MediaCard)
