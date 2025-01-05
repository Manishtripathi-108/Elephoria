import React from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../../constants/iconMap'

const Progress = ({ percentage, timeLeft }) => {
    return (
        <div
            className="relative max-w-xs rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
            role="alert"
            tabIndex="-1"
            aria-labelledby="toast-progress-label">
            <div className="flex gap-x-3 p-4">
                <div className="shrink-0">
                    <span className="m-1 inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200">
                        <Icon icon={iconMap.upload} className="size-5" />
                    </span>

                    <button
                        type="button"
                        className="focus:outline-hidden absolute right-3 top-3 inline-flex size-5 shrink-0 items-center justify-center rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:opacity-100 dark:text-white"
                        aria-label="Close">
                        <span className="sr-only">Close</span>
                        <Icon icon={iconMap.closeAnimated} className="size-5" />
                    </button>
                </div>

                <div className="me-5 grow">
                    <h3 id="toast-progress-label" className="text-sm font-medium text-gray-800 dark:text-white">
                        Uploading...
                    </h3>

                    {/* Progress */}
                    <div className="mt-2 flex flex-col gap-x-3">
                        <span className="mb-1.5 block text-xs text-gray-500 dark:text-neutral-400">
                            {percentage}% · {timeLeft} seconds left
                        </span>
                        <div
                            className="flex h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700"
                            role="progressbar"
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100">
                            <div
                                className="flex flex-col justify-center whitespace-nowrap bg-blue-600 text-center text-xs text-white dark:bg-neutral-200"
                                style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Progress
