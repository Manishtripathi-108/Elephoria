import React from 'react'

const CorrectInvalidStatuses = ({ correctedStatusList, setCorrectedStatusList, validStatusOptions, handleContinue, handleCancel }) => {
    const updateCorrectedStatus = (index, newStatus) => {
        setCorrectedStatusList((prev) =>
            prev.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        corrected: newStatus,
                    }
                }
                return item
            })
        )
    }

    return (
        <div className="bg-primary my-3 w-full max-w-lg rounded-lg border border-light-secondary p-6 shadow-neu-light-lg dark:border-dark-secondary dark:shadow-neu-dark-lg">
            <h2 className="text-primary mb-6 font-aladin text-2xl font-semibold tracking-widest">Correct Invalid Statuses</h2>

            <div className="space-y-4">
                {correctedStatusList.map((statusItem, index) => (
                    <div
                        key={index}
                        className="bg-primary form-group rounded-md border border-light-secondary p-4 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
                        <label className="form-label">
                            Invalid Status: <span className="error font-bold">{statusItem.status}</span>
                        </label>
                        <select
                            className="dropdown-select"
                            value={statusItem.corrected}
                            onChange={(e) => updateCorrectedStatus(index, e.target.value)}>
                            <option value="" disabled>
                                Select valid status
                            </option>
                            {validStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <div className="flex-center mt-5 gap-5">
                <button type="submit" className="button" onClick={handleContinue}>
                    Continue
                </button>
                <button className="button text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-700" onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default CorrectInvalidStatuses
