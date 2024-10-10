import React from 'react'

function AnimeList({ currentList }) {
    return (
        <div className="bg-primary mx-auto grid place-items-center gap-y-4 rounded-lg p-4 shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
            <div className="overflow-hidden rounded-xl shadow-neu-light-sm dark:shadow-neu-dark-sm">
                <div className="bg-secondary rounded-t-xl border border-light-secondary dark:border-dark-secondary">
                    <h2 className="text-primary p-4 font-aladin text-lg tracking-widest">Planing</h2>
                </div>

                <table className="w-full table-auto">
                    {/* <!-- Table Header --> */}
                    <thead className="bg-primary text-secondary border-x border-b border-light-secondary dark:border-dark-secondary">
                        <tr className="hidden sm:table-row">
                            <th className="sr-only"></th>
                            <th className="w-2/3 p-3 text-left font-aladin font-normal tracking-widest">Title</th>
                            <th className="w-1/6 p-3 text-center font-aladin font-normal tracking-widest">Progress</th>
                            <th className="w-1/6 p-3 text-center font-aladin font-normal tracking-widest">Type</th>
                        </tr>
                    </thead>

                    {/* <!-- Table Body --> */}
                    <tbody className="bg-primary">
                        {/* Data */}
                        <tr className="border-x border-b border-light-secondary p-2 py-2 transition-all duration-300 ease-in-out last:rounded-b-lg last:rounded-t-none hover:border-transparent hover:shadow-neu-light-xs dark:border-dark-secondary dark:hover:border-transparent hover:dark:shadow-neu-dark-xs">
                            <td className="p-3">
                                <div className="size-20">
                                    <img
                                        className="h-full w-full rounded-lg object-cover"
                                        src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx148098-MI9Rm8JVhSh0.jpg"
                                        alt="anime"
                                    />
                                </div>
                            </td>
                            <td className="text-primary p-3 align-middle font-indie-flower tracking-wide">
                                <div className="line-clamp-3 pb-1 leading-5">
                                    The Misfit of Demon King Academy II: History's Strongest Demon King Reincarnates and Goes to School with His
                                    Descendants
                                </div>
                                <p className="text-secondary text-sm sm:hidden">
                                    <span className="mr-1 font-bold md:sr-only">Progress:</span> 0/12
                                </p>
                            </td>
                            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">0/12</td>
                            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">TV</td>
                        </tr>

                        {/* Data */}
                        <tr className="border-x border-b border-light-secondary p-2 py-2 transition-all duration-300 ease-in-out last:rounded-b-lg last:rounded-t-none hover:border-transparent hover:shadow-neu-light-xs dark:border-dark-secondary dark:hover:border-transparent hover:dark:shadow-neu-dark-xs">
                            <td className="p-3">
                                <div className="size-20">
                                    <img
                                        className="h-full w-full rounded-lg object-cover"
                                        src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx148098-MI9Rm8JVhSh0.jpg"
                                        alt="anime"
                                    />
                                </div>
                            </td>
                            <td className="text-primary p-3 align-middle font-indie-flower tracking-wide">
                                <div className="line-clamp-3 pb-1 leading-5">
                                    The Misfit of Demon King Academy II: History's Strongest Demon King Reincarnates and Goes to School with His
                                    Descendants
                                </div>
                                <p className="text-secondary text-sm sm:hidden">
                                    <span className="mr-1 font-bold md:sr-only">Progress:</span> 0/12
                                </p>
                            </td>
                            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">0/12</td>
                            <td className="text-secondary hidden p-3 text-center align-middle font-indie-flower tracking-wide sm:table-cell">TV</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AnimeList
