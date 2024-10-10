import React from 'react'

function AnimeList({ currentList }) {
    return (
        <div class="bg-primary container mx-auto max-w-lg p-4 shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
            <div class="overflow-hidden rounded-t-xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
                <h2 className="text-primary p-4 font-aladin text-lg tracking-widest">Planing</h2>
            </div>

            <table class="w-full table-auto">
                {/* <!-- Table Header --> */}
                <thead class="bg-primary text-secondary border-x border-b border-light-secondary dark:border-dark-secondary">
                    <tr className="hidden sm:table-row">
                        <th className="sr-only"></th>
                        <th class="w-2/3 p-3 text-left font-aladin font-normal tracking-widest">Title</th>
                        <th class="w-1/6 p-3 text-center font-aladin font-normal tracking-widest">Progress</th>
                        <th class="w-1/6 p-3 text-center font-aladin font-normal tracking-widest">Type</th>
                    </tr>
                </thead>

                {/* <!-- Table Body --> */}
                <tbody class="bg-primary">
                    {/* Data */}
                    <tr class="border-x border-b border-light-secondary p-2 py-2 transition-all duration-300 ease-in-out last:rounded-b-lg last:rounded-t-none hover:border-transparent hover:shadow-neu-light-xs dark:border-dark-secondary dark:hover:border-transparent hover:dark:shadow-neu-dark-xs">
                        <td class="p-3">
                            <div class="size-20">
                                <img
                                    class="h-full w-full rounded-lg object-cover"
                                    src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx148098-MI9Rm8JVhSh0.jpg"
                                    alt="anime"
                                />
                            </div>
                        </td>
                        <td class="text-primary p-3 align-middle font-indie-flower tracking-wide">
                            <div className="line-clamp-3 pb-1 leading-5">
                                The Misfit of Demon King Academy II: History's Strongest Demon King Reincarnates and Goes to School with His
                                Descendants
                            </div>
                            <p className="text-secondary text-sm sm:hidden">
                                <span class="mr-1 font-bold md:sr-only">Progress:</span> 0/12
                            </p>
                        </td>
                        <td class="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">0/12</td>
                        <td class="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">TV</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default AnimeList
