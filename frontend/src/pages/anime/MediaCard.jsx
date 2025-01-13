import React, { memo } from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../constants/iconMap'
import { useAnilist } from '../../context/AnilistContext'
import { convertMonthNumberToName } from '../animeHub/utils/constants'

const MediaCard = ({ mediaItem, isFavouriteList = false }) => {
    const { setEditEntry } = useAnilist()

    // Handle favourites, which don't have the `media` nesting.
    const media = isFavouriteList ? mediaItem : mediaItem?.media

    return (
        <section className="shadow-neumorphic-sm bg-primary relative min-h-62 rounded-lg border" aria-labelledby={`media-title-${media?.id}`}>
            {/* Cover Image */}
            <figure className="h-4/5 max-h-56 w-full sm:max-h-72">
                <img
                    className="text-secondary h-full w-full rounded-t-lg border-b object-cover"
                    src={media?.coverImage?.large}
                    alt={media?.title?.english || media?.title?.native || 'Cover image'}
                    loading="lazy"
                />
                <figcaption className="sr-only">
                    {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                </figcaption>
            </figure>

            {/* Title and Info */}
            <header className="grid h-1/5 place-items-center p-2">
                <h2
                    id={`media-title-${media?.id}`}
                    className="text-primary font-aladin w-full truncate text-sm leading-none font-normal tracking-widest capitalize">
                    {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                </h2>
                <p className="text-secondary w-full shrink-0 text-xs tracking-wider">
                    {media?.format || 'Unknown Format'}
                    {media?.type === 'ANIME'
                        ? media?.format === 'MOVIE'
                            ? ` ${media?.duration ?? '??'} min`
                            : ` ${isFavouriteList ? (mediaItem?.episodes ?? '??') : (mediaItem?.progress ?? 0)}/${media?.episodes ?? '??'}  ${media?.duration ?? '??'}min/ep`
                        : ` ${isFavouriteList ? (mediaItem?.chapters ?? '??') : (mediaItem?.progress ?? 0)}/${media?.chapters ?? '??'} chapters`}
                </p>
            </header>

            {/* Info Button */}
            <button
                className="text-secondary hover:text-primary absolute right-1 bottom-10 cursor-pointer rounded-full bg-inherit p-1"
                popovertarget={`description-popover-${media?.id}`}
                popovertargetaction="toggle"
                aria-label="Show Description">
                <Icon icon={iconMap.infoOutlined} className="size-4" />
            </button>

            {/* Edit Button */}
            {!isFavouriteList && (
                <button
                    type="button"
                    title="Edit"
                    onClick={() => setEditEntry(mediaItem)}
                    className="bg-secondary text-secondary hover:text-primary absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-lg p-0.5"
                    aria-label="Edit">
                    <Icon icon={iconMap.edit} className="size-4" />
                </button>
            )}

            {/* Description Popover */}
            <article
                id={`description-popover-${media?.id}`}
                popover="auto"
                role="dialog"
                aria-labelledby={`media-title-${media?.id}`}
                className="bg-light-primary/60 dark:bg-dark-primary/50 top-1/2 left-1/12 w-72 rounded-lg border p-3 opacity-0 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-all transition-discrete duration-500 open:opacity-100 sm:left-1/3 starting:open:opacity-0">
                <header>
                    <h3 className="text-primary font-aladin text-xl font-bold tracking-widest" id={`description-title-${media?.id}`}>
                        {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                    </h3>
                </header>
                <p className="text-secondary mb-3 line-clamp-5 text-sm">{media?.description || 'No description available.'}</p>

                {/* Additional Info */}
                <footer className="text-secondary mb-4 space-y-1 text-xs">
                    <p>
                        <strong className="text-primary">Japanese: </strong> {media?.title?.native || 'N/A'}
                    </p>
                    <p>
                        <strong className="text-primary">Aired: </strong>
                        {media?.startDate?.day && media?.startDate?.month && media?.startDate?.year
                            ? `${media?.startDate?.day} ${convertMonthNumberToName(media?.startDate?.month)} ${media?.startDate?.year}`
                            : 'Unknown'}
                    </p>
                    <p>
                        <strong className="text-primary">Status: </strong> {media?.status || 'Unknown'}
                    </p>
                    <p>
                        <strong className="text-primary">Genres: </strong> {media?.genres?.join(', ') || 'N/A'}
                    </p>
                    {media?.type === 'ANIME' && (
                        <p>
                            <strong className="text-primary">Duration: </strong> {media?.duration ?? 'Unknown'} min/ep
                        </p>
                    )}
                </footer>
            </article>
        </section>
    )
}

export default memo(MediaCard)
