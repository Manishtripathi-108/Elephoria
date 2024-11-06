import React from 'react'

import NoDataSvg from '../../assets/svg/NoDataSvg'

function NoContentCard({ title, message, className }) {
    return (
        <div className={`bg-primary mx-auto flex max-w-lg flex-col items-center justify-center rounded-lg p-6 ${className ? className : ''}`}>
            <NoDataSvg className="mb-4 size-11/12" />

            <h2 className="text-accent-primary mb-2 text-center font-aladin text-4xl font-semibold tracking-widest">No {title} Found!</h2>

            <p className="text-secondary mb-4 text-center font-indie-flower text-lg tracking-wide">
                {message ? message : `Unfortunately, we couldn't find any data related to ${title}.`}
            </p>
        </div>
    )
}

export default NoContentCard