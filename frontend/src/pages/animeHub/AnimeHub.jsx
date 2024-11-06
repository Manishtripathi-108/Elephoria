import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import NoContentCard from '../../components/common/NoContentCard'
import { useAnimeHubContext } from '../../context/AnimeHubContext'
import { useLoadingBar } from '../../context/LoadingBarContext'
import ImportMedia from './ImportMedia'
import CardView from './components/CardView'
import FilterPanel from './components/FilterPanel'
import Header from './components/Header'
import ListView from './components/ListView'
import NavigationBar from './components/NavigationBar'
import LoadingSkeleton from './components/loading/LoadingSkeleton'

function AnimeHub() {
    const [viewMode, setViewMode] = useState('card')
    const [filteredContent, setFilteredContent] = useState([])
    const [isFilterApplied, setIsFilterApplied] = useState(false)
    const [isFilteringActive, setIsFilteringActive] = useState(false)

    const { mediaContent, activeTab, isLoading, error } = useAnimeHubContext()
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
    }, [])

    // Reset filtered content when the active tab changes
    useEffect(() => {
        setFilteredContent([])
        setIsFilterApplied(false)
    }, [activeTab])

    // Determine whether to show filtered or full content
    const contentToDisplay = isFilterApplied && filteredContent.length > 0 ? filteredContent : mediaContent

    return (
        <div>
            <Header />
            <NavigationBar />

            {isLoading ? (
                <LoadingSkeleton isListView={viewMode === 'list'} />
            ) : activeTab === 'IMPORT' ? (
                <div className="md:p-5">
                    <ImportMedia />
                </div>
            ) : (
                <>
                    {/* Toggle between List and Card view modes */}
                    <div className="container mx-auto flex items-center justify-end px-4">
                        <button
                            className={`text-primary neu-btn ${viewMode === 'list' ? 'active' : ''} rounded-lg rounded-e-none p-2 shadow-none dark:shadow-none`}
                            aria-pressed={viewMode === 'list'}
                            aria-label="List View"
                            onClick={() => setViewMode('list')}>
                            <Icon icon="tabler:list" className="size-4" />
                        </button>
                        <button
                            className={`text-primary neu-btn ${viewMode === 'card' ? 'active' : ''} rounded-lg rounded-s-none p-2 shadow-none dark:shadow-none`}
                            aria-pressed={viewMode === 'card'}
                            aria-label="Card View"
                            onClick={() => setViewMode('card')}>
                            <Icon icon="material-symbols:cards-outline-rounded" className="size-4" />
                        </button>
                    </div>

                    {/* Main Content Display */}
                    <div className="container mx-auto flex flex-col items-start justify-center gap-2 md:flex-row md:gap-5 md:p-5">
                        {activeTab !== 'FAVOURITES' && (
                            <FilterPanel
                                data={mediaContent}
                                onFilterUpdate={setFilteredContent}
                                onFilterStatusChange={setIsFilterApplied}
                                onFiltering={setIsFilteringActive}
                            />
                        )}

                        <div
                            className={`bg-primary relative mx-auto w-full rounded-lg border border-light-secondary p-2 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm md:p-5 ${
                                isFilteringActive
                                    ? 'after:bg-primary after:absolute after:right-0 after:top-0 after:z-40 after:size-full after:animate-pulse after:opacity-60'
                                    : ''
                            }`}>
                            {isFilterApplied && filteredContent.length === 0 ? (
                                <NoContentCard title="Filtered Results" message="No matches found for the applied filters. Try adjusting them." />
                            ) : viewMode === 'list' ? (
                                <ListView data={contentToDisplay} isFavourite={activeTab === 'FAVOURITES'} />
                            ) : (
                                <CardView data={contentToDisplay} isFavourite={activeTab === 'FAVOURITES'} />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AnimeHub