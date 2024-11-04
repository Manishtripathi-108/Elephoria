import React from 'react'

import SkeletonCard from './SkeletonCard'
import SkeletonFilter from './SkeletonFilter'
import SkeletonList from './SkeletonList'

function LoadingSkeleton({ isListView }) {
    return (
        <div className="container mx-auto flex flex-col items-start justify-center gap-2 md:flex-row md:gap-5 md:p-5">
            <SkeletonFilter />
            <div className="bg-primary mx-auto grid w-full place-items-center rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
                {isListView ? (
                    <>
                        <SkeletonList />
                        <SkeletonList />
                        <SkeletonList />
                    </>
                ) : (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                )}
            </div>
        </div>
    )
}

export default LoadingSkeleton
