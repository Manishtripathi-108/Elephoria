import React, { useCallback, useDeferredValue, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import NeuToggleButton from '../../../components/common/buttons/NeuToggleButton'
import iconMap from '../../../constants/iconMap'
import { filterOptions, sortOptions } from '../utils/constants'

const currentYear = new Date().getFullYear()

const FilterPanel = ({ data = [], onFilterUpdate, onFilterStatusChange, onFiltering }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedList, setSelectedList] = useState('All')
    const [filters, setFilters] = useState({
        format: '',
        status: '',
        genres: '',
        year: '',
        sort: '',
    })
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(window.innerWidth >= 768)

    // Deferred states
    const deferredSearchTerm = useDeferredValue(searchTerm)
    const deferredYear = useDeferredValue(filters.year)

    useEffect(() => {
        onFiltering(true)

        if (!Array.isArray(data)) return

        let filteredData = data

        // Apply list selection filter
        if (selectedList !== 'All') {
            filteredData = filteredData.filter((item) => item.name === selectedList)
        }

        // Apply deferred search term filter
        if (deferredSearchTerm) {
            filteredData = filteredData
                .map((list) => ({
                    ...list,
                    entries: list.entries.filter((entry) => {
                        const { english, romaji, native } = entry.media.title || {}
                        const lowerTerm = deferredSearchTerm.toLowerCase()
                        return (
                            (english?.toLowerCase() || '').includes(lowerTerm) ||
                            (romaji?.toLowerCase() || '').includes(lowerTerm) ||
                            (native?.toLowerCase() || '').includes(lowerTerm)
                        )
                    }),
                }))
                .filter((list) => list.entries.length > 0)
        }

        // Apply additional filters
        filteredData = filteredData
            .map((list) => ({
                ...list,
                entries: list.entries.filter((entry) => {
                    const { format, status, genres, startDate } = entry.media || {}
                    const matchFormat = filters.format ? format?.toUpperCase() === filters.format.toUpperCase() : true
                    const matchStatus = filters.status ? status?.toUpperCase() === filters.status.toUpperCase() : true
                    const matchGenres = filters.genres ? genres?.map((genre) => genre.toUpperCase()).includes(filters.genres.toUpperCase()) : true
                    const matchYear = deferredYear ? startDate?.year === deferredYear : true
                    return matchFormat && matchStatus && matchGenres && matchYear
                }),
            }))
            .filter((list) => list.entries.length > 0)

        // Apply sorting
        if (filters.sort) {
            filteredData = filteredData.map((list) => ({
                ...list,
                entries: list.entries.sort((a, b) => {
                    const titleA = a.media.title || {}
                    const titleB = b.media.title || {}
                    switch (filters.sort) {
                        case 'Title':
                            return (
                                titleA.english?.localeCompare(titleB.english) ||
                                titleA.romaji?.localeCompare(titleB.romaji) ||
                                titleA.native?.localeCompare(titleB.native)
                            )
                        case 'Year':
                            return a.media.startDate.year - b.media.startDate.year
                        case 'Average Score':
                            return b.media.averageScore - a.media.averageScore
                        case 'Popularity':
                            return b.media.popularity - a.media.popularity
                        case 'Progress':
                            return b.progress - a.progress
                        case 'Last Updated':
                            return new Date(b.updatedAt) - new Date(a.updatedAt)
                        case 'Last Added':
                            return new Date(b.createdAt) - new Date(a.createdAt)
                        default:
                            return 0
                    }
                }),
            }))
        }

        // Check if any filter is applied
        const noActiveFilters =
            !filters.format && !filters.genres && !filters.status && !deferredYear && !filters.sort && !deferredSearchTerm && selectedList === 'All'

        onFilterStatusChange(!noActiveFilters)
        onFilterUpdate(filteredData)
        onFiltering(false)
    }, [data, filters, deferredSearchTerm, deferredYear, selectedList, onFilterUpdate, onFilterStatusChange])

    const handleFilterChange = useCallback((filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters({ format: '', status: '', genres: '', year: '', sort: '' })
        setSearchTerm('')
        setSelectedList('All')
        onFilterUpdate([])
        onFilterStatusChange(false)
    }, [onFilterUpdate, onFilterStatusChange])

    const listOptions = ['All', ...(Array.isArray(data) ? data.map((list) => list.name) : [])]

    return (
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <NeuToggleButton
                    aria-label="Toggle Filter Menu"
                    title="Toggle Filters"
                    handleClick={() => setIsFilterMenuOpen((prev) => !prev)}
                    active={isFilterMenuOpen}
                    additionalClasses="md:hidden"
                />
            </div>

            {/* Filter Panel */}
            <div className={`${!isFilterMenuOpen ? 'animate-wipe-out-down' : 'animate-wipe-in-down'} p-2`}>
                <div className="mt-4">
                    <h3 className="form-label mb-2 text-base">Lists:</h3>
                    <div className="space-y-2">
                        {listOptions.map((list) => (
                            <button
                                key={list}
                                onClick={() => setSelectedList(list)}
                                className={`button w-full text-left ${selectedList === list ? 'active' : ''}`}>
                                {list}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="form-label mb-2 text-base">Filters:</h3>
                    {filterOptions.map((option) => (
                        <div className="mb-2" key={option.name}>
                            <label htmlFor={`${option.name}-filter`} className="sr-only">
                                {option.name}
                            </label>
                            <select
                                id={`${option.name}-filter`}
                                onChange={(e) => handleFilterChange(option.name.toLowerCase(), e.target.value)}
                                value={filters[option.name.toLowerCase()]}
                                className="dropdown-select capitalize">
                                <option value="">{option.name}</option>
                                {option.options.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="range-slider-group mt-4">
                    <label htmlFor="filter-year" className="form-label text-secondary flex items-center justify-between text-base">
                        <span>Year: {filters.year}</span>
                        <button
                            aria-label="Reset Year Filter"
                            type="button"
                            onClick={() => handleFilterChange('year', '')}
                            className="text-secondary text-sm">
                            ✕
                        </button>
                    </label>
                    <input
                        id="filter-year"
                        type="range"
                        min="1985"
                        max={currentYear}
                        step="1"
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', parseInt(e.target.value, 10))}
                        className="range-slider w-full"
                    />
                </div>

                <div className="form-group mt-4 w-full">
                    <label className="form-label text-base" htmlFor="sort_by">
                        Sort By:
                    </label>
                    <select
                        value={filters.sort}
                        id="sort_by"
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="dropdown-select"
                        aria-label="Sort media by">
                        <option value="">Sort By</option>
                        {sortOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Filters Button */}
                <button type="button" onClick={resetFilters} className="button button-with-icon mt-4 w-full" aria-label="Reset all filters">
                    <Icon icon={iconMap.refresh} className="size-6" /> Reset Filters
                </button>
            </div>
        </div>
    )
}

export default FilterPanel
