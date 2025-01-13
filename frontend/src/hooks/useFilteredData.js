import React, { useDeferredValue, useMemo } from 'react'

/**
 * Custom Hook for filtering and sorting data.
 *
 * @param {Array} data - The original dataset.
 * @param {Object} filters - Filters to apply, including format, status, genres, sort, search, and year.
 * @param {string} selectedList - The name of the list to filter by. If 'All', no list filtering is applied.
 *
 * @returns {Array} - The filtered and sorted data.
 */
const useFilteredData = (data, filters = {}, selectedList = 'All') => {
    const deferredSearchTerm = useDeferredValue(filters.search)

    const filteredData = useMemo(() => {
        // Early exit for empty or invalid inputs
        if (!Array.isArray(data) || data.length === 0) {
            console.log('No data to filter')
            return []
        }

        if (selectedList === 'All' && !filters.search && !filters.year && !filters.format && !filters.status && !filters.genres && !filters.sort) {
            console.log('No filters applied, returning original data')
            return data.flatMap((list) => list.entries || [])
        }

        let result = data

        // Step 1: Apply list selection filter
        if (selectedList !== 'All') {
            result = result.filter((item) => item.name.trim().toLowerCase() === selectedList.trim().toLowerCase())
        }

        result = result.flatMap((list) => list.entries || [])
        // console.log('After list filtering:', result)

        // Step 2: Apply deferred search term filter
        if (deferredSearchTerm) {
            const searchTerm = deferredSearchTerm.toLowerCase()
            result = result.filter((entry) => {
                const { english, romaji, native } = entry.media.title || {}
                return (
                    english?.toLowerCase().includes(searchTerm) ||
                    romaji?.toLowerCase().includes(searchTerm) ||
                    native?.toLowerCase().includes(searchTerm)
                )
            })
        }

        // console.log('After search filter:', result)
        console.log(filters.search, deferredSearchTerm)

        // Step 3: Apply additional filters
        result = result.filter((entry) => {
            const { format, status, genres, startDate } = entry.media || {}
            const matchFormat = filters.format ? format?.toUpperCase() === filters.format.toUpperCase() : true
            const matchStatus = filters.status ? status?.toUpperCase() === filters.status.toUpperCase() : true
            const matchGenres = filters.genres
                ? Array.isArray(filters.genres)
                    ? filters.genres.every((genre) => genres?.map((g) => g.toUpperCase()).includes(genre.toUpperCase()))
                    : genres?.map((genre) => genre.toUpperCase()).includes(filters.genres.toUpperCase())
                : true
            const matchYear = filters.year ? startDate?.year === filters.year : true

            return matchFormat && matchStatus && matchGenres && matchYear
        })

        // console.log('After additional filters:', result)

        // Step 4: Apply sorting
        if (filters.sort) {
            result = result.sort((a, b) => {
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
                        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
                    case 'Last Added':
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                    default:
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                }
            })
        }

        // console.log('After sorting:', result)

        return result
    }, [data, filters, selectedList, deferredSearchTerm])

    return filteredData
}

export default useFilteredData
