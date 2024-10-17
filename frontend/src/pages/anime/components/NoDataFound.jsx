import React from 'react'

import NoDataCard from '../../../components/common/NoDataCard'

function NoDataFound({ name, message = '' }) {
    return (
        <div className="bg-primary mx-auto grid w-full place-items-center rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
            <NoDataCard name={name} message={message} />
        </div>
    )
}

export default NoDataFound
