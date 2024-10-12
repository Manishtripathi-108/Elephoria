import React from 'react'

function SkeletonCard() {
    return (
        <div className="overflow-hidden rounded-xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
            <div className="bg-secondary h-44 w-full animate-pulse border-b border-light-secondary dark:border-dark-secondary md:h-64"></div>

            <div className="space-y-2 p-2">
                <div className="bg-secondary h-4 w-full animate-pulse rounded"></div>
                <div className="flex items-center space-x-2">
                    <div className="bg-secondary h-4 w-12 animate-pulse rounded"></div>
                    <span className="text-secondary animate-pulse text-xs">&#9679;</span>
                    <div className="bg-secondary h-4 w-4 animate-pulse rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonCard
