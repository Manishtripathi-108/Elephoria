import React, { useCallback, useState } from 'react'

import { Icon } from '@iconify/react'

import NeuHamburgerBtn from '../../../components/common/buttons/NeuHamburgerBtn'

const currentYear = new Date().getFullYear()

const AnimeFilter = () => {
    // State for each filter
    const [selectedList, setSelectedList] = useState('All')
    const [filters, setFilters] = useState({
        format: '',
        status: '',
        genre: '',
        country: '',
        year: 2024,
        sort: 'Score',
    })

    // Handlers for input changes (memoized to avoid unnecessary re-renders)
    const handleFilterChange = useCallback((filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }))
    }, [])

    // Reset filters to default values
    const resetFilters = useCallback(() => {
        setFilters({
            format: '',
            status: '',
            genre: '',
            country: '',
            year: 2024,
            sort: 'Name',
        })
        setSelectedList('All')
    }, [])

    // Range input style for dynamic background based on the value
    const rangeStyle = {
        background: `linear-gradient(to right, #334155 ${((filters.year - 1985) / (currentYear - 1985)) * 100}%, #00000000 ${((filters.year - 1985) / (currentYear - 1985)) * 100}%)`,
    }

    return (
        <div className="bg-primary text-primary h-full w-full md:max-w-64">
            {/* Search */}
            <div className="flex items-center justify-between gap-5">
                <div className="neu-input-group neu-input-group-append md:mb-4">
                    <label htmlFor="anime-search" className="sr-only">
                        Search Anime
                    </label>
                    <input id="anime-search" className="neu-form-input" type="text" placeholder="Filter" aria-label="Search anime" />
                    <Icon icon="mingcute:search-fill" className="neu-input-icon" aria-hidden="true" />
                </div>

                <NeuHamburgerBtn onClick={() => {}} isActive={false} aria-label="Toggle Filters" title="Toggle Filters" className="md:hidden" />
            </div>

            <div className="hidden md:block">
                {/* Lists */}
                <div className="mt-4">
                    <h3 className="neu-form-label mb-2 text-base">Lists:</h3>
                    <div className="space-y-2" role="listbox" aria-label="Filter by list">
                        {['All', 'Watching', 'Planning'].map((list) => (
                            <button
                                key={list}
                                onClick={() => setSelectedList(list)}
                                className={`neu-btn w-full text-left ${selectedList === list && 'active'}`}
                                role="option"
                                aria-selected={selectedList === list}>
                                {list}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-4">
                    <h3 className="neu-form-label mb-2 text-base">Filters:</h3>

                    {['Format', 'Status', 'Genre', 'Country'].map((filterType) => (
                        <div className="mb-2" key={filterType}>
                            <label htmlFor={`${filterType.toLowerCase()}-filter`} className="sr-only">
                                {filterType}
                            </label>
                            <select
                                className="neu-form-select"
                                id={`${filterType.toLowerCase()}-filter`}
                                onChange={(e) => handleFilterChange(filterType.toLowerCase(), e.target.value)}
                                value={filters[filterType.toLowerCase()]}
                                aria-label={`Filter by ${filterType}`}>
                                <option value="" disabled>
                                    {filterType}
                                </option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
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
                            onClick={() => handleFilterChange('year', currentYear)}
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
                        style={rangeStyle}
                        aria-label="Filter by year"
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
                        <option value="Name">Name</option>
                        <option value="Name">Option 2</option>
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
