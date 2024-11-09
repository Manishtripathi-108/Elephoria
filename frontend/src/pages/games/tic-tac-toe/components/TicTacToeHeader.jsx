import React from 'react'

import { Link } from 'react-router-dom'

import ElevateButton from '../../../../components/common/buttons/ElevateButton'

const TicTacToeHeader = ({ title }) => {
    return (
        <div className="grid grid-cols-2 border-b border-light-secondary py-3 dark:border-dark-secondary">
            <h1 className="text-primary flex-center font-indie-flower text-lg font-bold tracking-wider md:text-2xl">{title}</h1>
            <div className="flex-center gap-3">
                <Link to="/games/tic-tac-toe/classic" aria-disabled>
                    <ElevateButton>
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Classic</span>
                    </ElevateButton>
                </Link>
                <Link to="/games/tic-tac-toe/ultimate">
                    <ElevateButton>
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Ultimate</span>
                    </ElevateButton>
                </Link>
            </div>
        </div>
    )
}

export default React.memo(TicTacToeHeader)
