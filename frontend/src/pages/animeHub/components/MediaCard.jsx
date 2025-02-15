import React, { memo } from 'react'

import { Icon } from '@iconify/react'

import { openModal } from '../../../components/common/Modals'
import iconMap from '../../../constants/iconMap'
import { convertMonthNumberToName } from '../utils/constants'
import AnimeModal from './AnimeModal'

const MediaCard = ({ mediaItem, isFavouriteList = false }) => {
    // Handle favourites, which don't have the `media` nesting.
    const media = isFavouriteList ? mediaItem : mediaItem?.media

    return (
        <div id={`card-${media.id}`} className="shadow-neumorphic-sm relative min-h-44 rounded-lg border">
            <img
                className="text-text-secondary h-4/5 max-h-56 w-full rounded-t-lg border-b object-cover sm:max-h-72"
                src={media?.coverImage?.large}
                alt={media?.title?.english || media?.title?.native}
                loading="lazy"
            />

            <div className="flex h-1/5 flex-col items-start justify-center p-2">
                <h2
                    className={`text-text-primary font-aladin line-clamp-1 shrink-0 text-sm leading-none font-normal tracking-widest capitalize ${isFavouriteList && 'flex'}`}>
                    {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                </h2>
                {!isFavouriteList && (
                    <span className="text-text-secondary shrink-0 text-xs tracking-wider">
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
                className="bg-secondary text-text-secondary absolute right-2 bottom-12 rounded-full p-1"
                popovertarget={`description-popover-${media.id}`}
                popovertargetaction="toggle"
                aria-label="Show Description">
                <Icon icon={iconMap.infoOutlined} className="text-text-primary size-5" />
            </button>

            {/* Description Popover */}
            <div
                id={`description-popover-${media.id}`}
                popover="auto"
                className="bg-primary/60 /50 w-72 rounded-lg border p-3 shadow-lg backdrop-blur-md backdrop-saturate-150">
                <div className="mb-2">
                    <h3 className="text-text-primary font-aladin text-xl font-bold tracking-widest" aria-live="polite">
                        {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                    </h3>
                </div>

                {/* Description Section */}
                <p className="text-text-secondary mb-3 line-clamp-5 text-sm" aria-live="polite">
                    {media?.description || 'No description available.'}
                </p>

                {/* Additional Info */}
                <div className="text-text-secondary mb-4 space-y-1 text-xs">
                    <p>
                        <strong className="text-text-primary">Japanese: </strong> {media?.title?.native || 'N/A'}
                    </p>
                    <p>
                        <strong className="text-text-primary">Aired: </strong>
                        {media?.startDate?.day + ' ' + convertMonthNumberToName(media?.startDate?.month) + ' ' + media?.startDate?.year}
                    </p>
                    <p>
                        <strong className="text-text-primary">Status: </strong> {media?.status || 'Unknown'}
                    </p>
                    <p>
                        <strong className="text-text-primary">Genres: </strong> {media?.genres?.join(', ') || 'N/A'}
                    </p>
                    {media?.type === 'ANIME' && (
                        <p>
                            <strong className="text-text-primary">Duration: </strong> {media?.duration} min/ep
                        </p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {!isFavouriteList && (
                <>
                    <button
                        type="button"
                        onClick={() => openModal(`modal_${media.id}`)}
                        className="bg-secondary text-text-secondary absolute top-1 right-1 flex items-center justify-center rounded-lg p-0.5">
                        <Icon icon={iconMap.moreDots} className="size-6" />
                    </button>

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
