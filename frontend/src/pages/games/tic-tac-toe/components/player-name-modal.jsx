import React, { useEffect, useState } from 'react'

import NeuButton from '../../../../components/common/buttons/neu-button'
import ErrorIcon from '../../../../components/common/svg/error-circle'
import Players from '../../../../components/common/svg/players'

const PlayerNameModal = ({ playerXName, playerOName, setPlayerXName, setPlayerOName, closeModal }) => {
    const [Error, setError] = useState(false)

    const handlePlayer1NameChange = (value) => {
        if (value === '') {
            setError(true)
            setPlayerXName(value)
        } else {
            setError(false)
            setPlayerXName(value)
        }
    }

    const handlePlayer2NameChange = (value) => {
        if (value === '') {
            setError(true)
            setPlayerOName(value)
        } else {
            setError(false)
            setPlayerOName(value)
        }
    }

    // Handle closing the modal if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            const playerModal = document.getElementById('player-form-modal')
            if (playerModal && !playerModal.contains(event.target)) {
                !Error && closeModal()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [closeModal])

    // Handle focusing the player1 input field when the modal opens
    useEffect(() => {
        const player1Input = document.getElementById('player1')
        if (player1Input) {
            player1Input.focus()
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div id="player-form-modal" className="bg-primary rounded-lg p-3 w-[23rem] -mt-48 sm:mt-0">
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
                            placeholder="Enter Name for Player 1"
                            value={playerXName}
                            onChange={(e) => handlePlayer1NameChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && document.getElementById('player2').focus()}
                            required
                        />
                    </div>
                    <div className="neu-input-group neu-input-group-prepend">
                        <Players className="neu-input-icon" />
                        <input
                            id="player2"
                            className="neu-form-input"
                            type="text"
                            placeholder="Enter Name for Player 2"
                            value={playerOName}
                            onChange={(e) => handlePlayer2NameChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !Error && closeModal()}
                            required
                        />
                    </div>

                    <NeuButton type="button" title="Close Modal" onClick={() => !Error && closeModal()}>
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Close</span>
                    </NeuButton>

                    {Error && (
                        <div className="flex items-center justify-start bg-red-500 gap-2 rounded-xl border border-light-secondary px-2 py-2 font-indie-flower tracking-wider text-primary shadow-neu-md-soft dark:border-dark-secondary dark:shadow-neu-dark-md">
                            <ErrorIcon className="size-6 shrink-0" />
                            <span className="text-xs">
                                Player names cannot be empty! <br /> Please enter a name for both players.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlayerNameModal
