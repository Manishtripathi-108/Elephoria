import React, { memo, useEffect } from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../constants/iconMap'
import cn from '../../utils/cn'

const maxVisible = 4

const Pagination = ({ className = '', currentPage, totalPages, setPage }) => {
    useEffect(() => {
        if (currentPage > totalPages) {
            setPage(totalPages)
        } else if (currentPage < 1) {
            setPage(1)
        }
    }, [currentPage, totalPages, setPage])

    if (totalPages === 1 || totalPages === 0) {
        return null
    }

    const handlePageChange = (page) => {
        if (page === currentPage) {
            return
        }

        scroll(0, 0)
        setPage(page)
    }

    const getPageNumbers = () => {
        let pages = []
        const halfVisible = Math.floor(maxVisible / 2)

        if (totalPages <= maxVisible) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        } else if (currentPage <= halfVisible) {
            pages = Array.from({ length: maxVisible }, (_, i) => i + 1)
        } else if (currentPage > totalPages - halfVisible) {
            pages = Array.from({ length: maxVisible }, (_, i) => totalPages - maxVisible + i + 1)
        } else {
            for (let i = 0; i < maxVisible; i++) {
                pages.push(currentPage - halfVisible + i)
            }
        }

        return pages
    }

    return (
        <div className={cn('bg-primary shadow-neumorphic-xs rounded-full border p-3', className)}>
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
                        className={`bg-primary mx-1 flex-1 rounded-full border ${currentPage === page ? 'text-primary shadow-neumorphic-inset-xs' : 'text-secondary hover:text-primary shadow-neumorphic-xs active:shadow-neumorphic-inset-xs'}`}>
                        <button className="block min-w-7 p-1 text-center" onClick={() => handlePageChange(page)}>
                            {page}
                        </button>
                    </li>
                ))}

                {/* Ellipsis for Hidden Pages */}
                {totalPages > maxVisible && currentPage < totalPages - 1 && (
                    <li className="bg-primary shadow-neumorphic-xs mx-1 flex-1 rounded-full border">
                        <span className="text-secondary font-karla block min-w-7 p-1 text-center">...</span>
                    </li>
                )}

                {/* Next Arrow */}
                <li className="bg-primary shadow-neumorphic-xs active:shadow-neumorphic-inset-xs mx-1 flex-1 rounded-full first:mr-2 last:ml-2 sm:first:mr-4 sm:last:ml-4">
                    <button
                        className="text-secondary hover:text-primary font-karla block px-2 py-1 text-center"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>
                        <Icon icon={iconMap.rightArrow} className="size-5" />
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default memo(Pagination)
