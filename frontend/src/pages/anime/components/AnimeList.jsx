import React, { useEffect, useState } from 'react'

import AnimeRow from './AnimeRow'
import SkeletonRow from './loading/SkeletonRow'

function AnimeList({ dataList }) {
    return (
        <div className="bg-primary mx-auto grid w-full place-items-center gap-y-5 rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5">
            <div className="w-full overflow-hidden rounded-xl shadow-neu-light-sm dark:shadow-neu-dark-sm">
                <div className="bg-secondary rounded-t-xl border border-light-secondary dark:border-dark-secondary">
                    <h2 className="text-primary p-3 font-aladin text-lg tracking-widest">Planing</h2>
                </div>
                <table className="w-full table-auto">
                    {/* <!-- Table Header --> */}
                    <thead className="bg-primary text-secondary border-x border-b border-light-secondary dark:border-dark-secondary">
                        <tr className="hidden sm:table-row">
                            <th className="sr-only"></th>
                            <th className="w-2/3 p-2 text-left font-aladin font-normal tracking-widest">Title</th>
                            <th className="w-1/6 p-2 text-center font-aladin font-normal tracking-widest">Progress</th>
                            <th className="w-1/6 p-2 text-center font-aladin font-normal tracking-widest">Type</th>
                        </tr>
                    </thead>

                    {/* <!-- Table Body --> */}
                    <tbody className="bg-primary">
                        {dataList.length > 0
                            ? dataList.map((anime) => <AnimeRow key={anime.id} anime={anime} />)
                            : Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AnimeList
