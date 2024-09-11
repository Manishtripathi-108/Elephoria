import React from 'react'

const ShadowsItem = ({ shadows, isDark = false }) => {
    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {shadows.map((shadow, index) => (
                <div key={index} className={`${isDark ? 'bg-dark-primary' : 'bg-light-primary'} rounded-lg p-8 ${shadow} flex-center`}>
                    <p className={`${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} font-serif text-lg font-medium`}>{shadow}</p>
                </div>
            ))}
        </div>
    )
}

export default ShadowsItem
