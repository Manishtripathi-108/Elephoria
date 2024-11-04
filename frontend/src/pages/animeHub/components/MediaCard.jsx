import React, { memo, useState } from 'react'

import { Icon } from '@iconify/react'

import { ModalTrigger } from '../../../components/common/NeuModal'
import { convertMonthNumberToName } from '../constants'
import AnimeModal from './AnimeModal'

function MediaCard({ mediaItem, isFavouriteList = false }) {
    // Handle favourites, which don't have the `media` nesting.
    const media = isFavouriteList ? mediaItem : mediaItem?.media

    return (
        <div
            id={`card-${media.id}`}
            className="relative min-h-44 rounded-lg border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
            <img
                className="text-secondary h-4/5 max-h-56 w-full rounded-t-lg border-b border-light-secondary object-cover dark:border-dark-secondary sm:max-h-72"
                src={media?.coverImage?.large}
                alt={media?.title?.english || media?.title?.native}
                loading="lazy"
            />

            <div className="flex h-1/5 flex-col items-start justify-center p-2">
                <h2
                    className={`text-primary line-clamp-1 shrink-0 font-aladin text-sm font-normal capitalize leading-none tracking-widest ${isFavouriteList && 'flex'}`}>
                    {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                </h2>
                {!isFavouriteList && (
                    <span className="text-secondary shrink-0 font-indie-flower text-xs tracking-wider">
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

            {/* Info Button to Trigger Popover */}
            <button
                className="bg-secondary text-secondary absolute bottom-12 right-2 rounded-full p-1"
                popovertarget={`description-popover-${media.id}`}
                popovertargetaction="toggle"
                aria-label="Show Description">
                <Icon icon="carbon:information" className="text-primary size-5" />
            </button>

            {/* Description Popover */}
            <div
                id={`description-popover-${media.id}`}
                popover="auto"
                className="w-72 rounded-lg border border-light-secondary bg-light-primary/60 p-3 shadow-lg backdrop-blur-md backdrop-saturate-150 dark:border-dark-secondary dark:bg-dark-primary/50">
                <div className="mb-2">
                    <h3 className="text-primary font-aladin text-xl font-bold tracking-widest" aria-live="polite">
                        {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
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

            {/* Modal */}
            {!isFavouriteList && (
                <>
                    <ModalTrigger
                        id={`modal_${media.id}`}
                        className="bg-secondary text-secondary absolute right-1 top-1 flex items-center justify-center rounded-lg p-0.5">
                        <Icon icon="pepicons-pop:dots-y" className="size-6" />
                    </ModalTrigger>

                    <AnimeModal
                        modalId={`modal_${media.id}`}
                        entryId={mediaItem.id}
                        media={media}
                        mediaStatus={mediaItem?.status}
                        mediaProgress={mediaItem?.progress}
                    />
                </>
            )}
        </div>
    )
}

export default memo(MediaCard)
