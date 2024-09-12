import React from 'react'

import NeuButton from '../../../../components/common/buttons/neu-button'
import Players from '../../../../components/common/svg/players'

const PlayerNameModal = ({ playerXName, playerOName, setPlayerXName, setPlayerOName, closeModal }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div id="player-form-modal" className="bg-primary rounded-lg p-3">
                <div className="bg-primary grid grid-rows-2 gap-4 rounded-lg p-8 shadow-neu-light-sm dark:shadow-neu-dark-sm">
                    <h2 className="text-primary m-0 flex items-center justify-center font-indie-flower text-xl font-bold leading-none">
                        Set Player Names
                    </h2>
                    <div className="neu-input-group neu-input-group-prepend">
                        <Players className="neu-input-icon" />
                        <input
                            id="player1"
                            className="neu-form-input"
                            type="text"
                            placeholder="Player 1"
                            value={playerXName}
                            onChange={(e) => setPlayerXName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && document.getElementById('player2').focus()}
                        />
                    </div>
                    <div className="neu-input-group neu-input-group-prepend">
                        <Players className="neu-input-icon" />
                        <input
                            id="player2"
                            className="neu-form-input"
                            type="text"
                            placeholder="Player 2"
                            value={playerOName}
                            onChange={(e) => setPlayerOName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && closeModal()}
                        />
                    </div>

                    <NeuButton type="button" title="Close Modal" onClick={closeModal}>
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Close</span>
                    </NeuButton>
                </div>
            </div>
        </div>
    )
}

export default PlayerNameModal
