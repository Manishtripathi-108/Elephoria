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
const useFilteredData = (data, filters = {}, selectedList = 'All', isFavourite) => {
    const deferredSearchTerm = useDeferredValue(filters.search)

    const filteredData = useMemo(() => {
        // Early exit for empty or invalid inputs
        if ((Array.isArray(data) && data.length === 0) || !Object.keys(data).length === 0) {
            return []
        }

        if (selectedList === 'All' && !filters.search && !filters.year && !filters.format && !filters.status && !filters.genres && !filters.sort) {
            return isFavourite ? Object.values(data).flat() : data.flatMap((list) => list.entries || [])
        }

        let result = data

        // Step 1: Apply list selection filter
        if (selectedList !== 'All') {
            result = isFavourite
                ? data[selectedList.trim().toLowerCase()]
                : result.filter((item) => item.name.trim().toLowerCase() === selectedList.trim().toLowerCase())
        }

        result = isFavourite ? (selectedList !== 'All' ? result : Object.values(data).flat()) : result.flatMap((list) => list.entries || [])

        // Step 2: Apply deferred search term filter
        if (deferredSearchTerm) {
            const searchTerm = deferredSearchTerm.toLowerCase()
            result = result.filter((entry) => {
                const { english, romaji, native } = isFavourite ? entry.title : entry.media.title || {}
                return (
                    english?.toLowerCase().includes(searchTerm) ||
                    romaji?.toLowerCase().includes(searchTerm) ||
                    native?.toLowerCase().includes(searchTerm)
                )
            })
        }

        // Step 3: Apply additional filters
        result = result.filter((entry) => {
            const { format, status, genres, startDate } = isFavourite ? entry : entry.media || {}
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

        // Step 4: Apply sorting
        if (filters.sort) {
            result = result.sort((a, b) => {
                const titleA = isFavourite ? a.title : a.media.title || {}
                const titleB = isFavourite ? b.title : b.media.title || {}
                switch (filters.sort) {
                    case 'Title':
                        return (
                            titleA.english?.localeCompare(titleB.english) ||
                            titleA.romaji?.localeCompare(titleB.romaji) ||
                            titleA.native?.localeCompare(titleB.native)
                        )
                    case 'Year':
                        return isFavourite ? a.startDate.year - b.startDate.year : a.media.startDate.year - b.media.startDate.year
                    case 'Average Score':
                        return isFavourite ? true : b.media.averageScore - a.media.averageScore
                    case 'Popularity':
                        return isFavourite ? true : b.media.popularity - a.media.popularity
                    case 'Progress':
                        return isFavourite ? true : b.progress - a.progress
                    case 'Last Updated':
                        return isFavourite ? true : new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
                    case 'Last Added':
                        return isFavourite ? true : new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                    default:
                        return isFavourite ? true : new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                }
            })
        }

        return result
    }, [data, filters, selectedList, deferredSearchTerm])

    return filteredData
}

export default useFilteredData
