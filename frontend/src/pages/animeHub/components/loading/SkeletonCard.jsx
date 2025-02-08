import React from 'react'

const SkeletonCard = () => {
    return (
        <div className="mb-5 w-full">
            <div className="bg-secondary shadow-neumorphic-sm mb-2 rounded-t-xl p-3">
                <div className="bg-primary m-2 h-2 w-1/12 animate-pulse rounded-lg"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="bg-primary shadow-neumorphic-sm overflow-hidden rounded-xl border">
                        <div className="bg-secondary h-40 w-full animate-pulse border-b md:h-64"></div>

                        <div className="space-y-2 p-2">
                            <div className="bg-secondary h-4 w-full animate-pulse rounded-sm"></div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-secondary h-4 w-12 animate-pulse rounded-sm"></div>
                                <span className="text-text-secondary animate-pulse text-xs">&#9679;</span>
                                <div className="bg-secondary h-4 w-4 animate-pulse rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SkeletonCard
