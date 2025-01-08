import React from 'react'

const MediaRow = ({ mediaItem, isFavourite = false }) => {
    // Handle favourites, which don't have the `media` nesting.
    const media = isFavourite ? mediaItem : mediaItem?.media

    return (
        <tr className="hover:shadow-neumorphic-xs border-x border-b p-2 transition-all duration-300 ease-in-out last:rounded-t-none last:rounded-b-lg hover:border-transparent dark:hover:border-transparent">
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
            <td className="text-primary p-3 align-middle tracking-wide">
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
            <td className="text-secondary hidden p-3 text-center align-middle tracking-wide sm:table-cell">
                {mediaItem?.progress ?? 0}/{media?.episodes ?? media?.chapters ?? 'Unknown'}
            </td>
            {/* Media format */}
            <td className="text-secondary hidden p-3 text-center align-middle tracking-wide sm:table-cell">{media?.format || 'Unknown Format'}</td>
        </tr>
    )
}

export default MediaRow
