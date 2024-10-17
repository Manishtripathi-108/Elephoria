import React from 'react'

import NoDataSvg from '../../assets/svg/NoDataSvg'

function NoDataCard({ name, message, className }) {
    return (
        <div className={`bg-primary flex flex-col items-center justify-center rounded-lg p-6 ${className ? className : ''}`}>
            <NoDataSvg className="mb-4 size-11/12" />

            <h2 className="text-accent-primary mb-2 font-aladin text-4xl font-semibold tracking-widest">No {name} Found</h2>

            <p className="text-secondary mb-4 text-center font-indie-flower text-lg tracking-wide">
                {message ? message : `Unfortunately, we couldn't find any data related to ${name}.`}
            </p>
        </div>
    )
}

export default NoDataCard
