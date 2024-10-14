import React from 'react'

function AnimeRow({ anime }) {
    return (
        <tr className="border-x border-b border-light-secondary p-2 py-2 transition-all duration-300 ease-in-out last:rounded-b-lg last:rounded-t-none hover:border-transparent hover:shadow-neu-light-xs dark:border-dark-secondary dark:hover:border-transparent hover:dark:shadow-neu-dark-xs">
            <td className="p-3">
                <div className="size-20">
                    <img className="h-full w-full rounded-lg object-cover" src={anime.media.coverImage.large} alt={anime.media.title.romaji} />
                </div>
            </td>
            <td className="text-primary p-3 align-middle font-indie-flower tracking-wide">
                <div className="line-clamp-3 leading-5">
                    {anime.media.title.english} ({anime.media.title.native})
                </div>
                <p className="text-secondary mt-1 text-sm sm:hidden">
                    <span className="mr-1 font-bold md:sr-only">Progress:</span>
                    {anime.progress}/{anime.media.episodes}
                </p>
            </td>
            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">
                {anime.progress}/{anime.media.episodes}
            </td>
            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">{anime.media.format}</td>
        </tr>
    )
}

export default AnimeRow
