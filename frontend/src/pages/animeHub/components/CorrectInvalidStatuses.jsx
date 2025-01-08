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
        <div className="bg-primary shadow-neumorphic-lg my-3 w-full max-w-lg rounded-lg border p-6">
            <h2 className="text-primary font-aladin mb-6 text-2xl font-semibold tracking-widest">Correct Invalid Statuses</h2>

            <div className="space-y-4">
                {correctedStatusList.map((statusItem, index) => (
                    <div key={index} className="bg-primary form-group shadow-neumorphic-inset-sm rounded-md border p-4">
                        <label className="form-text">
                            Invalid Status: <span className="font-bold text-red-500">{statusItem.status}</span>
                        </label>
                        <select className="form-field" value={statusItem.corrected} onChange={(e) => updateCorrectedStatus(index, e.target.value)}>
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
            <div className="mt-5 flex items-center justify-center gap-5">
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
