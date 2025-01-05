import React from 'react'

const SkeletonFilter = () => {
    return (
        <div className="bg-primary text-primary h-full w-full p-2 md:max-w-64">
            {/* Search Section Skeleton */}
            <div className="flex items-center justify-between gap-3 md:mb-4">
                <div className="bg-secondary h-10 w-full animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                <div className="bg-secondary h-10 w-10 animate-pulse rounded-sm shadow-neumorphic-sm md:hidden"></div>
            </div>

            {/* Filters/List Section Skeleton */}
            <div className="hidden p-2 md:block">
                {/* Lists Skeleton */}
                <div className="mt-4">
                    <div className="bg-secondary mb-2 h-6 w-24 animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                    <div className="space-y-2" role="listbox" aria-label="Filter by list">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-secondary h-8 w-full animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                        ))}
                    </div>
                </div>

                {/* Filters Skeleton */}
                <div className="mt-4">
                    <div className="bg-secondary mb-2 h-6 w-24 animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="mb-2">
                            <div className="bg-secondary h-10 w-full animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                        </div>
                    ))}
                </div>

                {/* Year Filter Skeleton */}
                <div className="mt-4">
                    <div className="bg-secondary mb-2 h-6 w-24 animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                    <div className="bg-secondary h-10 w-full animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                </div>

                {/* Sort Filter Skeleton */}
                <div className="mt-4">
                    <div className="bg-secondary mb-2 h-6 w-24 animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                    <div className="bg-secondary h-10 w-full animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                </div>

                {/* Reset Filters Button Skeleton */}
                <div className="mt-4">
                    <div className="bg-secondary h-10 w-full animate-pulse rounded-sm shadow-neumorphic-sm"></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonFilter
