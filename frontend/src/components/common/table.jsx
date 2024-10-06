import React from 'react'

import NeuButton from './buttons/neu-button'

// usage
// <Table
//     heading="My Table Heading"
//     columns={['Column 1', 'Column 2', 'Column 3']}
//     rows={[
//         ['Row 1 Data 1', 'Row 1 Data 2', 'Row 1 Data 3'],
//         ['Row 2 Data 1', 'Row 2 Data 2', 'Row 2 Data 3'],
//         ['Row 3 Data 1', 'Row 3 Data 2', 'Row 3 Data 3'],
//     ]}
// />

function Table({ heading, columns, rows }) {
    return (
        <div className="bg-primary w-full max-w-2xl rounded-2xl shadow-xl">
            {/* Table heading */}
            <header className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-primary font-semibold">{heading}</h2>
            </header>

            {/* Table structure */}
            <div className="p-3">
                <div className="scrollbar-thin overflow-x-auto">
                    <table className="w-full table-auto">
                        {/* Table header */}
                        <thead className="text-secondary text-[13px]">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="bg-secondary px-5 py-2 first:rounded-l first:pl-3 last:sticky last:right-0 last:rounded-r last:pl-5 last:pr-3">
                                        <div className="text-left font-medium">{column}</div>
                                    </th>
                                ))}
                                <th className="bg-secondary px-5 py-2 first:rounded-l first:pl-3 last:sticky last:right-0 last:rounded-r last:pl-5 last:pr-3">
                                    <div className="sr-only text-left font-medium">Action</div>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-primary text-sm font-medium">
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="border-b border-slate-200 px-5 py-3 first:pl-3 last:sticky last:right-0 last:border-none last:bg-gradient-to-r last:from-transparent last:to-light-primary last:to-[12px] last:pl-5 last:pr-3 dark:last:to-dark-primary">
                                            {cell}
                                        </td>
                                    ))}
                                    <td className="border-b border-slate-200 px-5 py-3 first:pl-3 last:sticky last:right-0 last:border-none last:bg-gradient-to-r last:from-transparent last:to-light-primary last:to-[12px] last:pl-5 last:pr-3 dark:last:to-dark-primary">
                                        <NeuButton>Edit</NeuButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Table
