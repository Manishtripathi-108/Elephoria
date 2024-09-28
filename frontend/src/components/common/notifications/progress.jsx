import React from 'react'

import { Icon } from '@iconify/react'

const Progress = ({ percentage }) => {
    return (
        <div
            className="max-w-xs relative bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
            role="alert"
            tabIndex="-1"
            aria-labelledby="toast-progress-label">
            <div className="flex gap-x-3 p-4">
                <div className="shrink-0">
                    <span className="m-1 inline-flex justify-center items-center size-8 rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200">
                        <Icon icon="line-md:cloud-alt-upload-filled-loop" className="size-5" />
                    </span>

                    <button
                        type="button"
                        className="absolute top-3 end-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white"
                        aria-label="Close">
                        <span className="sr-only">Close</span>
                        <Icon icon="line-md:close-small" className="size-5" />
                    </button>
                </div>

                <div className="grow me-5">
                    <h3 id="toast-progress-label" className="text-gray-800 font-medium text-sm dark:text-white">
                        Uploading...
                    </h3>

                    {/* Progress */}
                    <div className="mt-2 flex flex-col gap-x-3">
                        <span className="block mb-1.5 text-xs text-gray-500 dark:text-neutral-400">57% · 5 seconds left</span>
                        <div
                            className="flex w-full h-1 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
                            role="progressbar"
                            aria-valuenow="57"
                            aria-valuemin="0"
                            aria-valuemax="100">
                            <div className="flex flex-col justify-center w-[57%] overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap dark:bg-neutral-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <!-- End Toast -->
    )
}

export default Progress
