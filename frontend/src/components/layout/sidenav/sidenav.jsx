import React from 'react'

const Sidenav = () => {
    return (
        <div className="relative h-[700px]">
            <aside className="group/sidebar fixed inset-y-0 left-0 z-40 m-0 flex w-[250px] shrink-0 flex-col overflow-hidden rounded-lg border-r border-dashed border-r-neutral-600 bg-secondary transition-all duration-300 ease-in-out lg:w-[300px]">
                <div className="flex h-28 w-full shrink-0 items-center justify-between">
                    <a className="h-full w-full transition-colors duration-200 ease-in-out" href="#">
                        <img
                            className="size-full overflow-hidden object-cover object-center"
                            src="https://ui-library.test/images/landscape/fantasy-scene-gearworks.png"
                            alt=""
                        />
                    </a>
                </div>

                <div className="border-b border-dashed border-neutral-600 lg:block"></div>

                <div className="flex items-center justify-between px-8 py-5">
                    <div className="mr-5 flex items-center">
                        <div className="mr-5">
                            <div className="relative inline-block shrink-0 cursor-pointer">
                                <img
                                    className="inline-block size-11 shrink-0 rounded-lg"
                                    src="https://ui-library.test/images/square/animal-orange-bird.png"
                                    alt="Avatar Image"
                                />
                            </div>
                        </div>
                        <div className="mr-2">
                            <a
                                className="font-medium text-white transition-colors duration-200 ease-in-out hover:text-light-primary"
                                href="javascript:void(0)">
                                Roronoa Zoro
                            </a>
                            <span className="block text-xs font-medium text-gray-400">Sword Master</span>
                        </div>
                    </div>
                    <a
                        className="group relative inline-flex cursor-pointer items-center justify-end border-0 bg-transparent text-center align-middle text-base font-medium leading-normal text-white shadow-none transition-colors duration-150 ease-in-out"
                        href="javascript:void(0)">
                        <span className="mr-2 inline-block text-sm text-gray-400">Logout</span>
                    </a>
                </div>

                <div className="border-b border-dashed border-neutral-600 lg:block"></div>

                <div className="scrollbar-thin relative my-5 overflow-y-scroll pl-3">
                    <div className="flex w-full flex-col font-medium">
                        <div className="block px-4 pb-2">
                            <span className="text-secondary-dark font-semibold uppercase text-gray-500">Profile</span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Profile
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Settings
                                </a>
                            </span>
                        </div>
                        <div className="block px-4 pb-2 pt-5">
                            <span className="text-secondary-dark font-semibold uppercase text-gray-500">Applications</span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Users
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Orders
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Track Orders
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Products
                                </a>
                            </span>
                        </div>
                        <div className="block px-4 pb-2 pt-5">
                            <span className="text-secondary-dark font-semibold uppercase text-gray-500">Reports</span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Sales
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Expenses
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Profit
                                </a>
                            </span>
                        </div>
                        <div className="block px-4 pb-2 pt-5">
                            <span className="text-secondary-dark font-semibold uppercase text-gray-500">Settings</span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    General
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Security
                                </a>
                            </span>
                        </div>

                        <div>
                            <span className="my-1 flex cursor-pointer select-none items-center px-4 py-2">
                                <a className="flex flex-grow items-center text-sm text-gray-400 hover:text-light-primary" href="javascript:;">
                                    Notifications
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default Sidenav
