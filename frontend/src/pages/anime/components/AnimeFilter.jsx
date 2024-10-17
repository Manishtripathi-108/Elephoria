import React, { useCallback, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import NeuHamburgerBtn from '../../../components/common/buttons/NeuHamburgerBtn'
import { filterOptions, sortOptions } from './constants'

const currentYear = new Date().getFullYear()

const AnimeFilter = ({ data = [], setFilteredData, setIsFilterActive }) => {
    // Search input and filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedList, setSelectedList] = useState('All')
    const [filters, setFilters] = useState({
        format: '',
        status: '',
        genres: '',
        year: '',
        sort: '',
    })
    const [isFiltersOpen, setIsFiltersOpen] = useState(window.innerWidth >= 768)

    // Apply filters and update filtered data
    useEffect(() => {
        if (!Array.isArray(data)) {
            return
        }

        let filteredList = data

        // Filter by selected list (if not "All")
        if (selectedList !== 'All') {
            filteredList = filteredList.filter((item) => item.name === selectedList)
        }

        // Apply search query to filter by titles
        if (searchQuery) {
            filteredList = filteredList
                .map((list) => ({
                    ...list,
                    entries: list.entries.filter(
                        (entry) =>
                            entry.media.title.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            entry.media.title.romaji.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                }))
                .filter((list) => list.entries.length > 0)
        }

        // Apply additional filters (format, status, genres, year)
        filteredList = filteredList
            .map((list) => ({
                ...list,
                entries: list.entries.filter((entry) => {
                    const matchFormat = filters.format ? entry.media.format === filters.format : true
                    const matchStatus = filters.status ? entry.media.status === filters.status : true
                    const matchGenres = filters.genres ? entry.media.genres.includes(filters.genres) : true
                    const matchYear = filters.year ? entry.media.startDate.year === filters.year : true
                    return matchFormat && matchStatus && matchGenres && matchYear
                }),
            }))
            .filter((list) => list.entries.length > 0)

        // Determine if any filter is active
        const allFiltersReset =
            filters.format === '' &&
            filters.genres === '' &&
            filters.status === '' &&
            filters.year === '' &&
            filters.sort === '' &&
            searchQuery === '' &&
            selectedList === 'All'

        // Set active filter state and filtered data
        setIsFilterActive(!allFiltersReset)
        setFilteredData(filteredList)
    }, [data, filters, searchQuery, selectedList, setFilteredData, setIsFilterActive])

    // Handle filter input change
    const handleFilterChange = useCallback((filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }))
    }, [])

    // Reset all filters to their default state
    const resetFilters = useCallback(() => {
        setFilters({
            format: '',
            status: '',
            genres: '',
            year: '',
            sort: '',
        })
        setSearchQuery('')
        setSelectedList('All')
        setFilteredData([])
        setIsFilterActive(false)
    }, [setFilteredData, setIsFilterActive])

    // Generate list options with "All" option included
    const listOptions = ['All', ...(Array.isArray(data) ? data.map((list) => list.name) : [])]

    return (
        <div className="bg-primary text-primary h-full w-full p-2 md:max-w-64">
            {/* Search Input */}
            <div className="flex items-center justify-between gap-3 md:mb-4">
                <div className="neu-input-group neu-input-group-append">
                    <label htmlFor="anime-search" className="sr-only">
                        Search Anime
                    </label>
                    <input
                        id="anime-search"
                        className="neu-form-input"
                        type="text"
                        placeholder="Search"
                        aria-label="Search anime"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icon icon="mingcute:search-fill" className="neu-input-icon" aria-hidden="true" />
                </div>

                <NeuHamburgerBtn
                    onClick={() => setIsFiltersOpen((prev) => !prev)}
                    isActive={isFiltersOpen}
                    aria-label="Toggle Filters"
                    title="Toggle Filters"
                    className="md:hidden"
                />
            </div>

            {/* Filter Panel */}
            <div className={`${!isFiltersOpen ? 'animate-wipe-out-down' : 'animate-wipe-in-down'} p-2`}>
                {/* List Filter */}
                <div className="mt-4">
                    <h3 className="neu-form-label mb-2 text-base">Lists:</h3>
                    <div className="space-y-2" role="listbox" aria-label="Filter by list">
                        {listOptions.map((list) => (
                            <button
                                key={list}
                                onClick={() => setSelectedList(list)}
                                className={`neu-btn w-full text-left ${selectedList === list ? 'active' : ''}`}
                                role="option"
                                aria-selected={selectedList === list}>
                                {list}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Other Filters */}
                <div className="mt-4">
                    <h3 className="neu-form-label mb-2 text-base">Filters:</h3>

                    {filterOptions.map((item) => (
                        <div className="mb-2" key={item.name}>
                            <label htmlFor={`${item.name.toLowerCase()}-filter`} className="sr-only">
                                {item.name}
                            </label>
                            <select
                                className="neu-form-select capitalize"
                                id={`${item.name.toLowerCase()}-filter`}
                                onChange={(e) => handleFilterChange(item.name.toLowerCase(), e.target.value)}
                                value={filters[item.name.toLowerCase()]}
                                aria-label={`Filter by ${item.name}`}>
                                <option value="" disabled>
                                    {item.name}
                                </option>
                                {item.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Year Filter */}
                <div className="neu-form-range-group mt-4">
                    <label className="neu-form-label text-secondary flex items-center justify-between text-base" htmlFor="filter-year">
                        <span>Year: {filters.year}</span>
                        <button
                            type="button"
                            onClick={() => handleFilterChange('year', '')}
                            className="text-secondary text-sm"
                            aria-label="Reset Year Filter">
                            ✕
                        </button>
                    </label>

                    <input
                        className="neu-form-range w-full"
                        id="filter-year"
                        type="range"
                        min="1985"
                        max={currentYear}
                        step="1"
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', parseInt(e.target.value, 10))}
                    />
                </div>

                {/* Sort Filter */}
                <div className="neu-form-group mt-4 w-full">
                    <label className="neu-form-label text-base" htmlFor="sort_by">
                        Sort By:
                    </label>
                    <select
                        value={filters.sort}
                        id="sort_by"
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="neu-form-select"
                        aria-label="Sort anime by">
                        <option value="">Sort By</option>
                        {sortOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Filters Button */}
                <button type="button" onClick={resetFilters} className="neu-btn neu-icon-btn mt-4 w-full" aria-label="Reset all filters">
                    <Icon icon="grommet-icons:power-reset" className="size-6" /> Reset Filters
                </button>
            </div>
        </div>
    )
}

export default AnimeFilter
