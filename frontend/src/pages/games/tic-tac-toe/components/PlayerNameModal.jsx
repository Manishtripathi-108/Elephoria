import React, { useRef, useState } from 'react'

import { Icon } from '@iconify/react'

import { DialogModal } from '../../../../components/common/PrimaryModal'
import ElevateButton from '../../../../components/common/buttons/ElevateButton'

const PlayerNameModal = ({ updatePlayerName, playerOName, playerXName }) => {
    const [validationError, setValidationError] = useState({ hasError: false, message: '' })
    const playerXInputRef = useRef(null)
    const playerOInputRef = useRef(null)

    const validateAndSetPlayerName = (player, value) => {
        updatePlayerName(player, value)
        const nameRegex = /^[a-zA-Z0-9 ]+$/

        if (value.trim() === '') {
            setValidationError({ hasError: true, message: 'Player names cannot be empty! Please enter a name for both players.' })
            return
        }

        if (value.length > 30) {
            setValidationError({ hasError: true, message: 'Player names cannot exceed 30 characters.' })
            return
        }

        if (!nameRegex.test(value)) {
            setValidationError({ hasError: true, message: 'Player names can only contain letters, numbers, and spaces.' })
            return
        }

        setValidationError({ hasError: false, message: '' })
    }

    const closePlayerModal = () => {
        const modal = document.getElementById('playerNameModal')
        if (modal) {
            modal.close()
        }
    }

    return (
        <DialogModal modalId="playerNameModal" closeButton={false} maxWidthAndClasses="w-full max-w-80 backdrop:opacity-40 backdrop:bg-secondary">
            <div className="bg-primary grid gap-5 p-5">
                <h2 className="text-primary text-center font-indie-flower text-xl font-bold">Set Player Names</h2>

                <div className="neu-input-group neu-input-group-prepend">
                    <Icon icon="mingcute:close-line" className="neu-input-icon" />
                    <input
                        ref={playerXInputRef}
                        className="neu-form-input"
                        type="text"
                        placeholder="Player 1 Name"
                        value={playerXName}
                        onChange={(e) => validateAndSetPlayerName('playerX', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && playerOInputRef.current?.focus()}
                        required
                    />
                </div>

                <div className="neu-input-group neu-input-group-prepend">
                    <Icon icon="tabler:circle" className="neu-input-icon" />
                    <input
                        ref={playerOInputRef}
                        className="neu-form-input"
                        type="text"
                        placeholder="Player 2 Name"
                        value={playerOName}
                        onChange={(e) => validateAndSetPlayerName('playerO', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !validationError.hasError && closePlayerModal()}
                        required
                    />
                </div>

                <ElevateButton title="Close" onClick={() => !validationError.hasError && closePlayerModal()}>
                    <span className="font-indie-flower text-sm font-semibold">Close</span>
                </ElevateButton>

                {validationError.hasError && (
                    <div className="text-primary flex items-center gap-2 rounded-xl border border-light-secondary bg-red-500 px-3 py-2 font-indie-flower dark:border-dark-secondary">
                        <Icon icon="meteocons:code-yellow-fill" className="size-10 shrink-0" />
                        <span className="text-xs">{validationError.message}</span>
                    </div>
                )}
            </div>
        </DialogModal>
    )
}

export default PlayerNameModal
