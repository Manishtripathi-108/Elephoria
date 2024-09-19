import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@iconify/react'

import NeuButton from '../../../../components/common/buttons/neu-button'
import Players from '../../../../components/common/svg/players'

const PlayerNameModal = ({ setPlayerName, playerXName, playerOName, closeModal }) => {
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const player1InputRef = useRef(null)
    const player2InputRef = useRef(null)

    const handlePlayerNameChange = (player, value) => {
        setPlayerName(player, value)
        const regex = /^[a-zA-Z0-9 ]+$/

        if (value === '') {
            setError(true)
            setMessage('Player names cannot be empty! Please enter a name for both players.')
            return
        }

        if (value.length > 30) {
            setError(true)
            setMessage('Player names cannot be more than 30 characters long.')
            return
        }

        if (!regex.test(value)) {
            setError(true)
            setMessage('Player names must be only contain alphabets and numbers.')
            return
        }

        setError(false)
        setMessage('')
    }

    // Handle closing the modal if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            const playerModal = document.getElementById('player-form-modal')
            if (playerModal && !playerModal.contains(event.target) && !error) {
                closeModal()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [closeModal, error])

    // Focus the player1 input field when the modal opens
    useEffect(() => {
        player1InputRef.current?.focus()
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
                            ref={player1InputRef}
                            id="player1"
                            className="neu-form-input"
                            type="text"
                            placeholder="Enter Name for Player 1"
                            value={playerXName}
                            onChange={(e) => handlePlayerNameChange('playerX', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && player2InputRef.current?.focus()}
                            required
                        />
                    </div>
                    <div className="neu-input-group neu-input-group-prepend">
                        <Players className="neu-input-icon" />
                        <input
                            ref={player2InputRef}
                            id="player2"
                            className="neu-form-input"
                            type="text"
                            placeholder="Enter Name for Player 2"
                            value={playerOName}
                            onChange={(e) => handlePlayerNameChange('playerO', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !error && closeModal()}
                            required
                        />
                    </div>

                    <NeuButton type="button" title="Close Modal" onClick={() => !error && closeModal()}>
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Close</span>
                    </NeuButton>

                    {error && (
                        <div className="flex items-center justify-start bg-red-500 gap-2 rounded-xl border border-light-secondary px-2 py-2 font-indie-flower tracking-wider text-primary shadow-neu-light-md dark:border-dark-secondary dark:shadow-neu-dark-md">
                            <Icon icon="meteocons:code-yellow-fill" className="size-10 shrink-0" />
                            <span className="text-xs">{message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlayerNameModal
