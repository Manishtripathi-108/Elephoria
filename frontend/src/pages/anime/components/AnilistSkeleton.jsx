import React from 'react'

const AnilistSkeleton = () => {
    return (
        <div className="animate-pulse bg-inherit">
            {/* Main Content */}
            <div className="container mx-auto p-6">
                {/* Controls */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="bg-secondary h-8 w-48 rounded-lg"></div>
                    <div className="ml-3 flex items-center gap-3 *:rounded-lg">
                        <div className="bg-secondary h-10 w-10"></div>
                        <div className="bg-secondary h-10 w-10"></div>
                        <div className="bg-secondary h-10 w-10"></div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 *:rounded-lg">
                    <div className="bg-secondary h-10 w-24"></div>
                    <div className="bg-secondary h-10 w-24"></div>
                    <div className="bg-secondary h-10 w-24"></div>
                    <div className="bg-secondary h-10 w-24"></div>
                </div>

                {/* Media List */}
                <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 *:rounded-xl">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div key={index} className="bg-secondary h-52 w-full rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AnilistSkeleton
