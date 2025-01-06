import React from 'react'

const StatusTable = ({ data, title, failed = false }) => {
    // Extract unique status texts
    const [filteredData, setFilteredData] = React.useState([])
    const uniqueStatusTexts = Array.from(new Set(data.map((item) => item.statusText).filter(Boolean)))

    const handleCategoryChange = (status) => {
        const selectedStatus = status
        if (selectedStatus === 'All') {
            setFilteredData([])
        } else {
            const filteredData = data.filter((item) => item.statusText === selectedStatus)
            setFilteredData(filteredData)
        }
    }

    const displayData = filteredData.length > 0 ? filteredData : data

    return (
        <div className="bg-primary border-light-secondary shadow-neumorphic-sm dark:border-dark-secondary w-full max-w-2xl rounded-2xl border">
            <header className="border-light-secondary dark:border-dark-secondary flex w-full items-center justify-between border-b px-4 py-3">
                <h2 className="text-primary font-aladin text-xl font-semibold tracking-widest text-nowrap">
                    {title} ({data.length})
                </h2>
                <select className="form-field max-w-40" aria-label="Filter by status" onChange={(e) => handleCategoryChange(e.target.value)}>
                    <option value="All">All</option>
                    {uniqueStatusTexts.map((status, index) => (
                        <option key={index} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </header>
            <div className="p-3">
                <div className="relative">
                    <div className="scrollbar-thin h-80 overflow-y-auto">
                        <table className="w-full table-auto">
                            <thead className="text-secondary text-left tracking-wide">
                                <tr>
                                    <th className="bg-secondary sticky top-0 z-10 px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Item</th>
                                    <th className="bg-secondary sticky top-0 z-10 px-5 py-2 first:rounded-l-lg last:rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-primary text-sm tracking-wide">
                                {displayData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-light-secondary hover:shadow-neumorphic-md dark:border-dark-secondary border-b transition-all duration-300 ease-in-out first:rounded-t-lg last:rounded-b-lg hover:border-transparent dark:hover:border-transparent">
                                        <td className="px-5 py-3">{item.name}</td>
                                        <td className={`px-5 py-3 text-nowrap ${failed ? 'text-red-500' : 'text-green-500'}`}>{item.statusText}</td>
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
