import React from 'react'

import ElevateButton from '../../../../components/common/buttons/ElevateButton'
import { useTicTacToeContext } from '../../../../context/TicTacToe/TicTacToeContext'

const TicTacToeHeader = ({ title, playingOnline }) => {
    const { setMode } = useTicTacToeContext()
    return (
        <div
            className={`grid border-b border-light-secondary py-3 dark:border-dark-secondary md:grid-cols-2 ${playingOnline ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <h1 className="text-primary flex-center text-center text-lg font-bold capitalize tracking-wider md:text-2xl">{title}</h1>
            <div className={`flex-center flex-wrap gap-3 md:col-span-1 ${playingOnline ? '' : 'col-span-3'}`}>
                <ElevateButton onClick={() => setMode('classic')}>Classic</ElevateButton>
                <ElevateButton onClick={() => setMode('ultimate')}>Ultimate</ElevateButton>
                {!playingOnline && (
                    <ElevateButton
                        onClick={() => {
                            const playModal = document.getElementById('play_online')
                            if (playModal) playModal.showModal()
                        }}>
                        Play Online
                    </ElevateButton>
                )}
            </div>
        </div>
    )
}

export default React.memo(TicTacToeHeader)
