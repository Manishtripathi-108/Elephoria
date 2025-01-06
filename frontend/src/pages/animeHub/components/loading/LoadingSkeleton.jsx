import React from 'react'

import SkeletonCard from './SkeletonCard'
import SkeletonFilter from './SkeletonFilter'
import SkeletonList from './SkeletonList'

const LoadingSkeleton = ({ isListView }) => {
    return (
        <div className="container mx-auto flex flex-col items-start justify-center gap-2 md:flex-row md:gap-5 md:p-5">
            <SkeletonFilter />
            <div className="bg-primary border-light-secondary shadow-neumorphic-inset-sm dark:border-dark-secondary mx-auto grid w-full place-items-center rounded-lg border p-3">
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
