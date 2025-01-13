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
import AnilistFilter from './components/AnilistFIlter'
import AnilistHeader from './components/AnilistHeader'
import AnilistSkeleton from './components/AnilistSkeleton'
import NavigationBar from './components/NavigationBar'

const ITEMS_PER_PAGE = 50

const AnimeList = () => {
    const { watchList, loading } = useAnilist()
    const [viewMode, setViewMode] = useState('card')
    const [filters, setFilters] = useState({})
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
    const filteredData = useFilteredData(watchList, filters, selectedTab)

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
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-highlight text-2xl sm:text-3xl font-bold text-nowrap">Your Anime List</h2>
                    <div className="form-field-wrapper hidden max-w-86 sm:flex">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="form-field"
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                        />
                        <Icon icon={iconMap.search} className="form-icon" />
                    </div>
                    <div className="flex items-center justify-end pr-4">
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
                <AnilistFilter filters={filters} setFilters={(f) => setFilters((prev) => ({ ...prev, ...f }))} />
            </Modal>
        </div>
    )
}

export default AnimeList
