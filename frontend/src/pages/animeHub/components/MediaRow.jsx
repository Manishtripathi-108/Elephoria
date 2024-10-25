import React from 'react'

function MediaRow({ mediaItem, isFavorite = false }) {
    // Handle favorites, which don't have the `media` nesting.
    const media = isFavorite ? mediaItem : mediaItem?.media

    return (
        <tr className="border-x border-b border-light-secondary p-2 transition-all duration-300 ease-in-out last:rounded-b-lg last:rounded-t-none hover:border-transparent hover:shadow-neu-light-xs dark:border-dark-secondary dark:hover:border-transparent hover:dark:shadow-neu-dark-xs">
            {/* Cover Image */}
            <td className="p-3">
                <div className="size-20">
                    <img
                        className="h-full w-full rounded-lg object-cover"
                        src={media?.coverImage?.large || '/placeholder-image.jpg'}
                        alt={media?.title?.romaji || 'Cover Image'}
                        loading="lazy"
                    />
                </div>
            </td>
            {/* Title and Progress (for small screens) */}
            <td className="text-primary p-3 align-middle font-indie-flower tracking-wide">
                <div className="line-clamp-3 leading-5">
                    {media?.title?.english || media?.title?.native || 'Unknown Title'} (
                    <span className="text-secondary text-sm">{media?.title?.romaji || 'Unknown romaji Title'}</span>)
                </div>
                {/* Display progress on small screens */}
                <p className="text-secondary mt-1 text-sm sm:hidden">
                    <span className="mr-1 font-bold md:sr-only">Progress:</span>
                    {mediaItem?.progress ?? 0}/{media?.episodes ?? media?.chapters ?? 'Unknown'}
                </p>
            </td>
            {/* Progress (for larger screens) */}
            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">
                {mediaItem?.progress ?? 0}/{media?.episodes ?? media?.chapters ?? 'Unknown'}
            </td>
            {/* Media format */}
            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">
                {media?.format || 'Unknown Format'}
            </td>
        </tr>
    )
}

export default MediaRow
