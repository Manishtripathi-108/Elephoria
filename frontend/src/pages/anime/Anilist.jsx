import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Icon } from '@iconify/react'

import Modal, { openModal } from '../../components/common/Modals'
import TabNavigation from '../../components/common/TabNavigation'
import { getTabOptions } from '../../constants/anilist'
import iconMap from '../../constants/iconMap'
import { useAnilist } from '../../context/AnilistContext'
import useFilteredData from '../../hooks/useFilteredData'
import usePagination from '../../hooks/usePagination'
import MediaCard from './MediaCard'
import AnilistFilter from './components/AnilistFIlter'
import AnilistHeader from './components/AnilistHeader'
import AnilistSkeleton from './components/AnilistSkeleton'
import EditMedia from './components/EditMedia'
import NavigationBar from './components/NavigationBar'

const ITEMS_PER_PAGE = 50

const Anilist = () => {
    const { mediaType, watchList, loading, editEntry, setEditEntry } = useAnilist()
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

    return (
        <div className="bg-inherit">
            <AnilistHeader />

            {loading ? (
                <AnilistSkeleton />
            ) : (
                <>
                    {/* Main Content */}
                    <div className="container mx-auto p-3 sm:p-6">
                        {/* Controls */}
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h2 className="text-highlight text-2xl font-bold text-nowrap capitalize sm:text-3xl">Your {mediaType} List</h2>
                            <div className="form-field-wrapper hidden max-w-86 sm:flex">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search..."
                                    value={filters.search || ''}
                                    className="form-field"
                                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    className="cursor-pointer border-l"
                                    onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}>
                                    <Icon icon={filters.search ? iconMap.close : iconMap.search} className="form-icon" />
                                </button>
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
                            tabs={getTabOptions(mediaType)}
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

                    {/* Edit Modal */}
                    <Modal modalId="modal-anilist-edit-media" onClose={() => setEditEntry(null)}>
                        <EditMedia entry={editEntry} />
                    </Modal>

                    {/* Filters Modal */}
                    <Modal modalId="filters-modal">
                        <AnilistFilter filters={filters} setFilters={(f) => setFilters((prev) => ({ ...prev, ...f }))} />
                    </Modal>
                </>
            )}
        </div>
    )
}

export default Anilist
