import React from 'react'
import { Link } from 'react-router-dom'

import NeuButton from '../../../../components/common/buttons/neu-button'

const Heading = ({ title }) => {
    return (
        <div className="mb-2 grid w-full grid-cols-2 border-b border-light-secondary py-3 dark:border-dark-secondary">
            <div className="text-primary flex-center font-indie-flower text-lg font-bold tracking-wider md:text-2xl">{title}</div>
            <div className="flex-center gap-3">
                <Link to="/games/tic-tac-toe" className="reset" aria-disabled>
                    <NeuButton type="button">
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Classic</span>
                    </NeuButton>
                </Link>
                <Link to="/games/tic-tac-toe/ultimate">
                    <NeuButton type="button">
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Ultimate</span>
                    </NeuButton>
                </Link>
            </div>
        </div>
    )
}

export default Heading
