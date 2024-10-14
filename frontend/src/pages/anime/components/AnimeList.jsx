import React from 'react'

import AnimeRow from './AnimeRow'
import SkeletonList from './loading/SkeletonList'

function AnimeList({ dataList = [] }) {
    // Render Table Header
    const renderTableHeader = () => (
        <thead className="bg-primary text-secondary border-x border-b border-light-secondary dark:border-dark-secondary">
            <tr className="hidden sm:table-row">
                <th className="sr-only"></th>
                <th className="w-2/3 p-2 text-left font-aladin font-normal tracking-widest">Title</th>
                <th className="w-1/6 p-2 text-center font-aladin font-normal tracking-widest">Progress</th>
                <th className="w-1/6 p-2 text-center font-aladin font-normal tracking-widest">Type</th>
            </tr>
        </thead>
    )

    // Render Anime List Table
    const renderAnimeTable = (list) => (
        <div key={list.name} className="w-full overflow-hidden rounded-xl shadow-neu-light-sm dark:shadow-neu-dark-sm">
            <div className="bg-secondary rounded-t-xl border border-light-secondary dark:border-dark-secondary">
                <h2 className="text-primary p-3 font-aladin text-lg tracking-widest">{list.name}</h2>
            </div>
            <table className="w-full table-auto">
                {renderTableHeader()}
                <tbody className="bg-primary">
                    {list.entries.length > 0 ? (
                        list.entries.map((media) => <AnimeRow key={media.media?.id} anime={media} />)
                    ) : (
                        <tr>
                            <td className="p-4 text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    // Main Component JSX
    return (
        <div className="bg-primary mx-auto grid w-full place-items-center gap-y-5 rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            {dataList.length > 0 ? dataList.map(renderAnimeTable) : Array.from({ length: 2 }).map((_, index) => <SkeletonList key={index} />)}
        </div>
    )
}

export default React.memo(AnimeList)
