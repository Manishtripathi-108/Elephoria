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
        <div className="w-full max-w-2xl bg-primary shadow-xl rounded-2xl">
            {/* Table heading */}
            <header className="px-4 py-3 border-b border-slate-200">
                <h2 className="font-semibold text-primary">{heading}</h2>
            </header>

            {/* Table structure */}
            <div className="p-3">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="table-auto w-full">
                        {/* Table header */}
                        <thead className="text-[13px] text-secondary">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="px-5 py-2 first:pl-3 last:pr-3 bg-secondary first:rounded-l last:rounded-r last:pl-5 last:sticky last:right-0">
                                        <div className="font-medium text-left">{column}</div>
                                    </th>
                                ))}
                                <th className="px-5 py-2 first:pl-3 last:pr-3 bg-secondary first:rounded-l last:rounded-r last:pl-5 last:sticky last:right-0">
                                    <div className="font-medium text-left sr-only">Action</div>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-sm font-medium text-primary">
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-5 py-3 border-b border-slate-200 last:border-none first:pl-3 last:pr-3 last:bg-gradient-to-r last:from-transparent last:to-light-primary dark:last:to-dark-primary last:to-[12px] last:pl-5 last:sticky last:right-0">
                                            {cell}
                                        </td>
                                    ))}
                                    <td className="px-5 py-3 border-b border-slate-200 last:border-none first:pl-3 last:pr-3 last:bg-gradient-to-r last:from-transparent last:to-light-primary dark:last:to-dark-primary last:to-[12px] last:pl-5 last:sticky last:right-0">
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
