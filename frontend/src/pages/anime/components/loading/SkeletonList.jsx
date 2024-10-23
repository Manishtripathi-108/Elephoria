import React from 'react'

function SkeletonList() {
    return (
        <div className="w-full overflow-hidden rounded-xl shadow-neu-light-sm dark:shadow-neu-dark-sm">
            <div className="bg-secondary block rounded-t-xl border border-light-secondary dark:border-dark-secondary">
                <div className="bg-primary m-3 h-8 w-1/3 animate-pulse rounded-lg"></div>
            </div>
            <table className="w-full table-auto">
                <thead className="bg-primary text-secondary border-x border-b border-light-secondary dark:border-dark-secondary">
                    <tr className="hidden sm:table-row">
                        <th className="sr-only"></th>
                        <th className="w-2/3 p-2">
                            <div className="bg-secondary h-4 w-full animate-pulse rounded"></div>
                        </th>
                        <th className="w-1/12 px-1 py-2">
                            <div className="bg-secondary mx-auto h-4 w-full animate-pulse rounded"></div>
                        </th>
                        <th className="w-1/12 px-1 py-2">
                            <div className="bg-secondary mx-auto h-4 w-full animate-pulse rounded"></div>
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-primary">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <tr
                            key={index}
                            className="border-x border-b border-light-secondary p-2 transition-all duration-300 ease-in-out last:rounded-b-lg hover:border-transparent hover:shadow-neu-light-xs dark:border-dark-secondary dark:hover:border-transparent hover:dark:shadow-neu-dark-xs">
                            <td className="p-3">
                                <div className="bg-secondary size-20 animate-pulse rounded-lg"></div>
                            </td>
                            <td className="w-full px-2 align-middle tracking-wide md:w-2/3">
                                <div className="bg-secondary h-4 w-full animate-pulse rounded"></div>
                                <div className="bg-secondary mt-2 h-2 w-1/2 animate-pulse rounded sm:hidden"></div>
                            </td>
                            <td className="hidden px-1 align-middle sm:table-cell">
                                <div className="bg-secondary mx-auto h-4 w-full animate-pulse rounded"></div>
                            </td>
                            <td className="hidden px-1 align-middle sm:table-cell">
                                <div className="bg-secondary mx-auto h-4 w-full animate-pulse rounded"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SkeletonList