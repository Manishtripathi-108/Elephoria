import React from 'react'

function SkeletonRow() {
    return (
        <tr className="border-x border-b border-light-secondary p-2 transition-all duration-300 ease-in-out last:rounded-b-lg hover:border-transparent hover:shadow-neu-light-xs dark:border-dark-secondary dark:hover:border-transparent hover:dark:shadow-neu-dark-xs">
            <td className="p-3">
                <div className="bg-secondary size-20 animate-pulse rounded-lg"></div>
            </td>
            <td className="w-full p-3 align-middle tracking-wide">
                <div className="bg-secondary h-4 w-full animate-pulse rounded"></div>
                <div className="bg-secondary mt-2 h-2 w-1/3 animate-pulse rounded sm:hidden"></div>
            </td>
            <td className="hidden p-3 align-middle sm:table-cell">
                <div className="bg-secondary mx-auto h-4 w-1/2 animate-pulse rounded"></div>
            </td>
            <td className="hidden p-3 align-middle sm:table-cell">
                <div className="bg-secondary mx-auto h-4 w-1/2 animate-pulse rounded"></div>
            </td>
        </tr>
    )
}

export default SkeletonRow
