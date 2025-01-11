import React, { memo, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../constants/iconMap'
import cn from '../utils/cn'

const MAX_VISIBLE_BUTTONS = 4

/**
 * usePagination is a custom hook that provides a way to paginate data. It returns a pagination component and an array of data for the current page.
 *
 * @param data The data to paginate
 * @param itemsPerPage The number of items per page
 * @param options An object with the following properties:
 *   - current: The current page number (default: 1)
 *   - setCurrent: A function to set the current page number (default: useState)
 * @returns An object with the following properties:
 *   - currentData: The data for the current page
 *   - Pagination: A memoized pagination component
 *   - currentPage: The current page number
 *   - totalPages: The total number of pages
 *   - setCurrent: A function to set the current page number
 */
const usePagination = (data, itemsPerPage, { current = 1, setCurrent: externalSetCurrent } = {}) => {
    const [internalCurrent, setInternalCurrent] = useState(current || 1)
    const totalPages = Math.ceil(data.length / itemsPerPage) || 1

    // Determine if we are using an external state handler
    const isExternalControl = typeof externalSetCurrent === 'function'

    // Define the current page state based on external or internal control
    const currentPage = isExternalControl ? current : internalCurrent
    const setCurrent = isExternalControl ? externalSetCurrent : setInternalCurrent

    // Ensure the current page is within valid bounds
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrent(totalPages)
        } else if (currentPage < 1) {
            setCurrent(1)
        }
    }, [currentPage, totalPages, setCurrent])

    const handlePageChange = (page) => {
        if (page !== currentPage) {
            setCurrent(page)
            scroll(0, 0) // Scroll to top on page change
        }
    }

    const getPageNumbers = () => {
        let pages = []
        const halfVisible = Math.floor(MAX_VISIBLE_BUTTONS / 2)

        if (totalPages <= MAX_VISIBLE_BUTTONS) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        } else if (currentPage <= halfVisible) {
            pages = Array.from({ length: MAX_VISIBLE_BUTTONS }, (_, i) => i + 1)
        } else if (currentPage > totalPages - halfVisible) {
            pages = Array.from({ length: MAX_VISIBLE_BUTTONS }, (_, i) => totalPages - MAX_VISIBLE_BUTTONS + i + 1)
        } else {
            for (let i = 0; i < MAX_VISIBLE_BUTTONS; i++) {
                pages.push(currentPage - halfVisible + i)
            }
        }
        return pages
    }

    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const Pagination = memo(({ className }) => {
        if (totalPages <= 1) return null

        return (
            <div className={cn('bg-primary shadow-neumorphic-xs mx-auto w-fit rounded-full border p-3', className)}>
                <ul className="flex list-none items-center justify-center">
                    {/* Previous Arrow */}
                    <li className="bg-primary shadow-neumorphic-xs active:shadow-neumorphic-inset-xs mx-1 flex-1 rounded-full border first:mr-2 last:ml-2 sm:first:mr-4 sm:last:ml-4">
                        <button
                            className="text-secondary hover:text-primary font-karla block px-2 py-1"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>
                            <Icon icon={iconMap.leftArrow} className="size-5" />
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                        <li
                            key={page}
                            className={`bg-primary mx-1 flex-1 rounded-full border ${
                                currentPage === page
                                    ? 'text-primary shadow-neumorphic-inset-xs'
                                    : 'text-secondary hover:text-primary shadow-neumorphic-xs active:shadow-neumorphic-inset-xs'
                            }`}>
                            <button className="block min-w-7 p-1 text-center" onClick={() => handlePageChange(page)}>
                                {page}
                            </button>
                        </li>
                    ))}

                    {/* Ellipsis for Hidden Pages */}
                    {totalPages > MAX_VISIBLE_BUTTONS && currentPage < totalPages - 1 && (
                        <li className="bg-primary shadow-neumorphic-xs mx-1 flex-1 rounded-full border">
                            <span className="text-secondary font-karla block min-w-7 p-1 text-center">...</span>
                        </li>
                    )}

                    {/* Next Arrow */}
                    <li className="bg-primary shadow-neumorphic-xs active:shadow-neumorphic-inset-xs mx-1 flex-1 rounded-full border first:mr-2 last:ml-2 sm:first:mr-4 sm:last:ml-4">
                        <button
                            className="text-secondary hover:text-primary font-karla block px-2 py-1 text-center"
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>
                            <Icon icon={iconMap.rightArrow} className="size-5" />
                        </button>
                    </li>
                </ul>
            </div>
        )
    })

    return { currentData, Pagination, currentPage, totalPages, setCurrent }
}

export default usePagination
