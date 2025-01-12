import React, { useEffect, useRef, useState } from 'react'

import { NavLink, useSearchParams } from 'react-router-dom'

import { Icon } from '@iconify/react'

import { fetchUserMediaList } from '../../api/animeHubApi'
import Modal, { openModal } from '../../components/common/Modals'
import TabNavigation from '../../components/common/TabNavigation'
import APP_ROUTES from '../../constants/appRoutes'
import iconMap from '../../constants/iconMap'
import useFilteredData from '../../hooks/useFilteredData'
import usePagination from '../../hooks/usePagination'
import MediaCard from './MediaCard'
import AnimeSkeleton from './Skeleton'

const TABS = ['All', 'Watching', 'Paused', 'Planning', 'Dropped', 'Completed']
const ITEMS_PER_PAGE = 50

const AnimeWatchList = () => {
    const [viewMode, setViewMode] = useState('card')
    const [mediaList, setMediaList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedTab, setSelectedTab] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)

    const [searchParams, setSearchParams] = useSearchParams()
    const abortControllerRef = useRef(null)

    const abortPreviousRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
        abortControllerRef.current = new AbortController()
    }

    const fetchWatchList = async () => {
        try {
            console.log('fetchWatchList')

            abortPreviousRequest()
            setLoading(true)
            setError(null)

            const {
                mediaList: fetchedMedia,
                success,
                message,
            } = await fetchUserMediaList('anime', {
                abortSignal: abortControllerRef.current.signal,
            })

            if (success) {
                console.log('Fetched media')

                setMediaList((prevMediaList) => (JSON.stringify(prevMediaList) !== JSON.stringify(fetchedMedia) ? fetchedMedia : prevMediaList))
            } else {
                setError(message || 'Error fetching data.')
            }
        } catch (fetchError) {
            setError('Failed to fetch media content.')
            console.error('Error fetching media content:', fetchError)
        } finally {
            console.log('fetchWatchList -> finally')

            setLoading(false)
        }
    }

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

    // Fetch media list on component mount
    useEffect(() => {
        console.log('useEffect -> fetchWatchList')
        fetchWatchList()
    }, [])

    // Filtered data based on the selected tab
    const filteredData = useFilteredData(mediaList, {}, selectedTab)

    const { currentData, Pagination } = usePagination(filteredData, ITEMS_PER_PAGE, {
        current: currentPage,
        setCurrent: (page) => setSearchParams({ tab: selectedTab, page }),
    })

    if (loading) return <AnimeSkeleton />
    // if (error) return <div>Error: {error}</div>

    const bannerStyle = {
        backgroundImage: `url(https://picsum.photos/1920/1080)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    return (
        <div className="bg-inherit">
            <header className="shadow-neumorphic-inset-lg w-full border-b" style={bannerStyle}>
                <div className="flex h-full w-full items-end justify-center bg-white/20 dark:bg-black/30">
                    <div className="flex w-5/6 max-w-(--breakpoint-md) flex-wrap items-end justify-start gap-5 opacity-100 md:pt-20">
                        <img
                            src="https://picsum.photos/150"
                            alt="Hello"
                            className="max-h-36 w-full max-w-28 rounded-t-lg align-text-top md:max-h-48 md:max-w-36"
                        />
                        <h1 className="text-primary font-aladin mb-5 text-3xl font-bold tracking-widest">hello</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto p-3 sm:p-6">
                {/* Controls */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-highlight text-3xl font-bold">Your Anime List</h2>
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
                    tabs={TABS}
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

            <nav className="fixed top-1/4 right-0 flex">
                <input type="checkbox" name="open-menu" id="open-menu" className="peer sr-only" />
                <label
                    htmlFor="open-menu"
                    className="bg-primary text-secondary hover:text-primary peer-checked:text-primary flex h-10 grow-0 cursor-pointer items-center justify-center rounded-l-lg border-y border-l p-2 sm:h-20">
                    <Icon icon={iconMap.arrowOpenLeft} className="size-4" />
                </label>
                <div className="bg-primary text-secondary hidden place-items-center gap-4 rounded-tr-xl rounded-bl-xl border px-2 py-4 peer-checked:grid">
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

export default AnimeWatchList
