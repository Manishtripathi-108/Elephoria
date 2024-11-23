import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import { DialogModal } from '../../../../components/common/PrimaryModal'
import ElevateButton from '../../../../components/common/buttons/ElevateButton'
import { useTicTacToeContext } from '../../../../context/TicTacToeContext'
import { iconMap } from '../../../../utils/globalConstants'

const PlayerNameModal = () => {
    const [validationError, setValidationError] = useState('')
    const { state, setPlayerNames } = useTicTacToeContext()
    const { playerX, playerO } = state

    // Utility function to capitalize the first letter of a string
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    // Validation Function
    const validateAndSetPlayerName = (player, value) => {
        setPlayerNames(player, value)

        const nameRegex = /^[a-zA-Z0-9 ]+$/

        if (!value.trim()) {
            setValidationError('Player names cannot be empty!')
            return
        }

        if (value.length > 30) {
            setValidationError('Player names cannot exceed 30 characters.')
            return
        }

        if (!nameRegex.test(value)) {
            setValidationError('Player names can only contain letters, numbers, and spaces.')
            return
        }

        setValidationError('')
    }

    // Function to close the modal
    const closePlayerModal = () => {
        const modal = document.getElementById('playerNameModal')
        if (modal && !validationError) modal.close()
    }

    // Handle Enter key press
    const handleKeyDown = (e, player) => {
        if (e.key === 'Enter') {
            if (player === 'playerX' && !validationError) {
                document.getElementById('playerOInput').focus()
            } else if (player === 'playerO' && !validationError) {
                document.getElementById('closePlayerModalBtn').focus()
            }
        }
    }

    return (
        <DialogModal modalId="playerNameModal" closeButton={false} maxWidthAndClasses="w-full max-w-96">
            <div className="bg-primary grid gap-5 p-5">
                <h2 className="text-primary text-center text-xl font-bold">Set Player Names</h2>

                {/* Error Message */}
                {validationError && (
                    <div className="flex gap-2 rounded-xl pl-2 tracking-wider">
                        <Icon icon={iconMap.error} className="error size-5 shrink-0" />
                        <span className="error text-sm">{validationError}</span>
                    </div>
                )}

                {/* Player X Input */}
                <div className="input-wrapper input-group-start">
                    <span className="input-icon flex-center text-center font-julee text-2xl">X</span>
                    <input
                        id="playerXInput"
                        name="playerXInput"
                        className="input-text"
                        type="text"
                        aria-label="Player 1 Name"
                        placeholder="Player 1 Name"
                        value={playerX.name}
                        onChange={(e) => validateAndSetPlayerName('playerX', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'playerX')}
                        maxLength={30}
                        minLength={1}
                        required
                    />
                </div>

                {/* Player O Input */}
                <div className="input-wrapper input-group-start">
                    <span className="input-icon flex-center text-center font-julee text-2xl">O</span>
                    <input
                        id="playerOInput"
                        name="playerOInput"
                        className="input-text"
                        type="text"
                        aria-label="Player 2 Name"
                        placeholder="Player 2 Name"
                        value={playerO.name}
                        onChange={(e) => validateAndSetPlayerName('playerO', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'playerO')}
                        maxLength={30}
                        minLength={1}
                        required
                    />
                </div>

                {/* Close Button */}
                <ElevateButton title="Close" id="closePlayerModalBtn" onClick={closePlayerModal}>
                    <span className="text-sm font-semibold">Close</span>
                </ElevateButton>
            </div>
        </DialogModal>
    )
}

export default PlayerNameModal
