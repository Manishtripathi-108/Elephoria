import React, { useEffect, useRef, useState } from 'react'

import { NavLink, Outlet, useSearchParams } from 'react-router-dom'

import { Icon } from '@iconify/react'

import Pagination from '../../components/common/Pagination'
import { DialogModal, openModal } from '../../components/common/PrimaryModal'
import APP_ROUTES from '../../constants/appRoutes'
import iconMap from '../../constants/iconMap'

const tabs = ['All', 'Watching', 'Paused', 'Planing', 'Dropped', 'Completed']

const AnimeLayout = () => {
    const [viewMode, setViewMode] = useState('card')
    const [watchList, setWatchList] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedTab, setSelectedTab] = useState('All')
    const [searchParams, setSearchParams] = useSearchParams()
    const abortControllerRef = useRef(null)
    const [page, setPage] = useState({
        currentPage: 1,
        totalPages: 10,
    })

    const fetchWatchList = async () => {
        try {
            abortPreviousRequest()
            setLoading(true)
            setError(null)

            const result = await fetchUserMediaList(activeTab, activeTab === 'FAVOURITES', abortControllerRef.current.signal)

            if (result.success) {
                const sortedMedia = activeTab !== 'FAVOURITES' ? result.mediaList.sort((a, b) => a.name.localeCompare(b.name)) : result.mediaList

                setMediaContent(sortedMedia)
            } else {
                setError(result.message)
                console.warn(result.message)
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError('Failed to fetch media content.')
                console.error('Error fetching media content:', error)
            }
        } finally {
            setLoading(false)
        }
    }

    const abortPreviousRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()
    }

    useEffect(() => {
        const tab = searchParams.get('tab') || 'All'
        const page = searchParams.get('page') || 1
        const filters = searchParams.get('filters') || ''
        console.log({ tab, page, filters })
        setSelectedTab(tab)
        setPage((prev) => ({
            ...prev,
            currentPage: parseInt(page, 10),
        }))
    }, [searchParams])

    const handleTabChange = (tab) => {
        setSelectedTab(tab)
        setSearchParams({ tab })
    }

    const bannerStyle = {
        backgroundImage: `url(https://picsum.photos/1920/1080)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    const dataToPass = {
        viewMode,
        watchList,
        loading,
        error,
        selectedTab,
        searchParams,
        page,
    }

    return (
        <div className="bg-primary grid min-h-screen place-items-center">
            {/* Header */}
            <header className="border-secondary w-full border-b shadow-neumorphic-inset-lg" style={bannerStyle}>
                <div className="flex h-full w-full items-end justify-center bg-white/20 dark:bg-black/30">
                    <div className="flex w-5/6 max-w-screen-md flex-wrap items-end justify-start gap-5 opacity-100 md:pt-20">
                        <img
                            src="https://picsum.photos/150"
                            alt="Hello"
                            className="max-h-36 w-full max-w-28 rounded-t-lg align-text-top md:max-h-48 md:max-w-36"
                        />
                        <h1 className="text-primary mb-5 font-aladin text-3xl font-bold tracking-widest">hello</h1>
                    </div>
                </div>
            </header>

            <div className="container p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-accent text-3xl font-bold">Watch List</h2>
                    <div className="flex items-center justify-end px-4">
                        <button
                            className={`text-primary button ${viewMode === 'list' ? 'active' : ''} rounded-e-none border-r-0 p-2 shadow-none`}
                            aria-pressed={viewMode === 'list'}
                            aria-label="List View"
                            onClick={() => setViewMode('list')}>
                            <Icon icon={iconMap.list} className="size-4" />
                        </button>
                        <button
                            className={`text-primary button ${viewMode === 'card' ? 'active' : ''} rounded-s-none p-2 shadow-none`}
                            aria-pressed={viewMode === 'card'}
                            aria-label="Card View"
                            onClick={() => setViewMode('card')}>
                            <Icon icon={iconMap.card} className="size-4" />
                        </button>

                        <button className="button button-icon-only-square text-highlight ml-4" onClick={() => openModal('filters-modal')}>
                            <Icon icon={iconMap.filter} className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex space-x-2 sm:space-x-4">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => handleTabChange(tab)}
                            className={`button button-sm sm:button-base ${selectedTab === tab ? 'active' : ''}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Watch List Cards */}
                <Outlet context={dataToPass} />
            </div>

            <nav className="fixed right-0 top-1/4 flex">
                <input type="checkbox" name="open-menu" id="open-menu" className="peer sr-only" />
                <label
                    htmlFor="open-menu"
                    className="bg-primary text-secondary hover:text-primary peer-checked:text-primary border-secondary flex h-10 grow-0 cursor-pointer items-center justify-center rounded-l-lg border-y border-l p-2 sm:h-20">
                    <Icon icon={iconMap.arrowOpenLeft} className="size-4" />
                </label>
                <div className="bg-primary text-secondary border-secondary hidden place-items-center gap-4 rounded-bl-xl rounded-tr-xl border px-2 py-4 peer-checked:grid">
                    <NavLink to={APP_ROUTES.ANIME.ANIMELIST} title="Anime List">
                        <Icon icon={iconMap.anime} className="size-6" />
                    </NavLink>
                    <NavLink to={APP_ROUTES.ANIME.ROOT} title="Manga List">
                        <Icon icon={iconMap.manga} className="size-6" />
                    </NavLink>
                    <NavLink to={APP_ROUTES.ANIME.ROOT} title="Import Anime/Manga">
                        <Icon icon={iconMap.upload} className="size-6" />
                    </NavLink>
                    <button type="button" to={APP_ROUTES.ANIME.ROOT} title="Log Out">
                        <Icon icon={iconMap.logOut} className="size-6 text-red-500" />
                    </button>
                </div>
            </nav>

            <Pagination
                className="mb-6"
                currentPage={page.currentPage}
                totalPages={page.totalPages}
                setPage={(page) => {
                    setSearchParams({ tab: selectedTab, page, filters: '' })
                }}
            />

            <DialogModal modalId="filters-modal" maxWidthAndClasses="w-fit">
                <div className="grid place-items-center p-4">
                    <h2 className="text-primary text-2xl font-bold">Filters</h2>
                    <div className="bg-primary text-primary h-full w-full p-2 md:max-w-64">
                        {/* Search Input */}
                        <div className="flex items-center justify-between gap-3 md:mb-4">
                            <div className="input-wrapper input-group-start">
                                <label htmlFor="media-search" className="sr-only">
                                    Search Media
                                </label>
                                <Icon icon={iconMap.search} className="input-icon" aria-hidden="true" />
                                <input
                                    id="media-search"
                                    className="input-text"
                                    type="text"
                                    placeholder="Search"
                                    // value={searchTerm}
                                    // onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter Panel */}
                        <div className={`p-2`}>
                            <div className="range-slider-group mt-4">
                                <label htmlFor="filter-year" className="form-label text-secondary flex items-center justify-between text-base">
                                    <span>Year:</span>
                                    <button
                                        aria-label="Reset Year Filter"
                                        type="button"
                                        // onClick={() => handleFilterChange('year', '')}
                                        className="text-secondary text-sm">
                                        ✕
                                    </button>
                                </label>
                                <input
                                    id="filter-year"
                                    type="range"
                                    min="1985"
                                    // max={currentYear}
                                    step="1"
                                    // value={filters.year}
                                    // onChange={(e) => handleFilterChange('year', parseInt(e.target.value, 10))}
                                    className="range-slider w-full"
                                />
                            </div>

                            <div className="form-group mt-4 w-full">
                                <label className="form-label text-base" htmlFor="sort_by">
                                    Sort By:
                                </label>
                                <select
                                    // value={filters.sort}
                                    id="sort_by"
                                    // onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="dropdown-select"
                                    aria-label="Sort media by">
                                    <option value="">Sort By</option>
                                    {/* {sortOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))} */}
                                </select>
                            </div>

                            {/* Reset Filters Button */}
                            <button
                                type="button"
                                // onClick={resetFilters}
                                className="button button-with-icon mt-4 w-full"
                                aria-label="Reset all filters">
                                <Icon icon={iconMap.refresh} className="size-6" /> Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </div>
    )
}

export default AnimeLayout
