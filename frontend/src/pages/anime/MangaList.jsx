import React, { useEffect, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Icon } from '@iconify/react'

import Modal, { openModal } from '../../components/common/Modals'
import TabNavigation from '../../components/common/TabNavigation'
import { ANILIST_TABS } from '../../constants/anilist'
import iconMap from '../../constants/iconMap'
import { useAnilist } from '../../context/AnilistContext'
import useFilteredData from '../../hooks/useFilteredData'
import usePagination from '../../hooks/usePagination'
import MediaCard from './MediaCard'
import AnilistHeader from './components/AnilistHeader'
import AnilistSkeleton from './components/AnilistSkeleton'
import NavigationBar from './components/NavigationBar'

const ITEMS_PER_PAGE = 50

const MangaList = () => {
    const { watchList, loading } = useAnilist()
    const [viewMode, setViewMode] = useState('card')
    const [selectedTab, setSelectedTab] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)

    const [searchParams, setSearchParams] = useSearchParams()

    // Update selected tab and page based on URL parameters
    useEffect(() => {
        console.log('useEffect -> searchParams')
        const tab = searchParams.get('tab') || 'All'
        const page = parseInt(searchParams.get('page') || '1', 10)

        if (selectedTab !== tab) {
            setSelectedTab(tab)
        }

        if (currentPage !== page) {
            setCurrentPage(page)
        }
    }, [searchParams])

    // Filtered data based on the selected tab
    const filteredData = useFilteredData(watchList, {}, selectedTab)

    const { currentData, Pagination } = usePagination(filteredData, ITEMS_PER_PAGE, {
        current: currentPage,
        setCurrent: (page) => setSearchParams({ tab: selectedTab, page }),
    })

    if (loading) return <AnilistSkeleton />
    // if (error) return <div>Error: {error}</div>

    return (
        <div className="bg-inherit">
            <AnilistHeader />

            {/* Main Content */}
            <div className="container mx-auto p-3 sm:p-6">
                {/* Controls */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-highlight text-3xl font-bold">Your Manga List</h2>
                    <div className="flex items-center justify-end px-4">
                        <button
                            className={`text-primary button rounded-e-none border-r-0 p-2 shadow-none ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}>
                            <Icon icon={iconMap.list} className="size-4" />
                        </button>
                        <button
                            className={`text-primary button rounded-s-none p-2 shadow-none ${viewMode === 'card' ? 'active' : ''}`}
                            onClick={() => setViewMode('card')}>
                            <Icon icon={iconMap.card} className="size-4" />
                        </button>

                        <button className="button button-icon-only-square text-highlight ml-4" onClick={() => openModal('filters-modal')}>
                            <Icon icon={iconMap.filter} className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <TabNavigation
                    className="mb-6"
                    tabs={ANILIST_TABS}
                    currentTab={selectedTab}
                    setCurrentTab={(tab) => {
                        setSearchParams({ tab, page: 1 })
                    }}
                />

                {/* Media List */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                    {currentData?.map((entry) => (
                        <MediaCard key={entry.media?.id} mediaItem={entry} />
                    ))}
                </div>
            </div>

            <NavigationBar />

            {/* Pagination */}
            <Pagination />

            {/* Filters Modal */}
            <Modal modalId="filters-modal">
                <div className="filter-modal">
                    <h2 className="modal-title">Filters</h2>
                    <div className="modal-body">
                        <div className="filter-section">
                            <label htmlFor="filter-year">Year:</label>
                            <input id="filter-year" type="range" min="1985" className="filter-slider" />
                        </div>
                        <div className="filter-section">
                            <label htmlFor="sort-by">Sort By:</label>
                            <select id="sort-by" className="filter-select">
                                <option value="">Select...</option>
                            </select>
                        </div>
                    </div>
                    <button className="reset-filters">Reset Filters</button>
                </div>
            </Modal>
        </div>
    )
}

export default MangaList
