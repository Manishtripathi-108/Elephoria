import React from 'react'

const StatusTable = ({ data, title, failed = false }) => {
    return (
        <div className="bg-primary w-full max-w-2xl rounded-2xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
            <header className="border-b border-light-secondary px-4 py-3 dark:border-dark-secondary">
                <h2 className="text-primary font-aladin text-xl font-semibold tracking-widest">{title}</h2>
            </header>
            <div className="p-3">
                <div className="relative">
                    <div className="scrollbar-thin h-80 overflow-y-scroll">
                        <table className="w-full table-auto">
                            <thead className="text-secondary text-left font-indie-flower tracking-wide">
                                <tr>
                                    <th className="bg-secondary sticky top-0 z-10 px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Item</th>
                                    <th className="bg-secondary sticky top-0 z-10 px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-primary font-indie-flower text-sm tracking-wide">
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-light-secondary transition-all duration-300 ease-in-out first:rounded-t-lg last:rounded-b-lg hover:border-transparent hover:shadow-neu-light-md dark:border-dark-secondary dark:hover:border-transparent dark:hover:shadow-neu-dark-sm">
                                        <td className="px-5 py-3">{item.name}</td>
                                        <td className={`px-5 py-3 ${failed ? 'text-red-500' : 'text-green-500'}`}>{item.statusText}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusTable
