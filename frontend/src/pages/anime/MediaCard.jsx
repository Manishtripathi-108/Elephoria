import React, { memo } from 'react'

import { Icon } from '@iconify/react'

import { openModal } from '../../components/common/Modals'
import iconMap from '../../constants/iconMap'
import cn from '../../utils/cn'
import { convertMonthNumberToName } from '../animeHub/utils/constants'
import AnimeModal from './components/AnimeModal'

const MediaCard = ({ mediaItem, isFavouriteList = false }) => {
    // Handle favourites, which don't have the `media` nesting.
    const media = isFavouriteList ? mediaItem : mediaItem?.media

    return (
        <div id={`card-${media.id}`} className="shadow-neumorphic-sm bg-primary relative min-h-62 rounded-lg border">
            {/* Cover Image */}
            <img
                className="text-secondary h-4/5 max-h-56 w-full rounded-t-lg border-b object-cover sm:max-h-72"
                src={media?.coverImage?.large}
                alt={media?.title?.english || media?.title?.native}
                loading="lazy"
            />

            {/* Title and Info */}
            <div className="flex h-1/5 flex-col items-start justify-center p-2">
                <h2
                    className={cn('text-primary font-aladin w-full truncate text-sm leading-none font-normal tracking-widest capitalize', {
                        flex: isFavouriteList,
                    })}>
                    {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                </h2>
                {!isFavouriteList && (
                    <span className="text-secondary shrink-0 text-xs tracking-wider">
                        {media?.format || 'Unknown Format'}
                        {media?.type === 'ANIME'
                            ? media?.format === 'MOVIE'
                                ? ` ${media?.duration ?? '??'} min`
                                : ` ${mediaItem?.progress ?? 0}/${media?.episodes ?? '??'}  ${media?.duration ?? '??'} min/ep`
                            : ` ${mediaItem?.progress ?? 0}/${media?.chapters ?? '??'} chapters`}
                    </span>
                )}
            </div>

            {/* Info Button */}
            <button
                className="text-secondary hover:text-primary absolute right-1 bottom-10 cursor-pointer rounded-full bg-inherit p-1"
                popovertarget={`description-popover-${media.id}`}
                popovertargetaction="toggle"
                aria-label="Show Description">
                <Icon icon={iconMap.infoOutlined} className="size-4" />
            </button>

            {/* Modal */}
            {!isFavouriteList && (
                <>
                    <button
                        type="button"
                        onClick={() => openModal(`modal_${media.id}`)}
                        className="bg-secondary text-secondary hover:text-primary absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-full p-0.5">
                        <Icon icon={iconMap.moreDots} className="size-4" />
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

            {/* Description Popover */}
            {/* // ToDo: Implement Popover with anchor when supported */}
            <div
                id={`description-popover-${media.id}`}
                popover="auto"
                className={cn(
                    'bg-light-primary/60 dark:bg-dark-primary/50 top-1/2 left-1/12 w-72 rounded-lg border p-3 opacity-0 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-all transition-discrete duration-500',
                    'open:opacity-100 sm:left-1/3 starting:open:opacity-0'
                )}>
                <div className="mb-2">
                    <h3 className="text-primary font-aladin text-xl font-bold tracking-widest" aria-live="polite">
                        {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                    </h3>
                </div>
                <p className="text-secondary mb-3 line-clamp-5 text-sm" aria-live="polite">
                    {media?.description || 'No description available.'}
                </p>

                {/* Additional Info */}
                <div className="text-secondary mb-4 space-y-1 text-xs">
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
        </div>
    )
}

export default memo(MediaCard)
