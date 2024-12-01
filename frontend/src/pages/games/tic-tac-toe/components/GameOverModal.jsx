import React, { useEffect, useRef } from 'react'

import { motion } from 'motion/react'

import ElevateButton from '../../../../components/common/buttons/ElevateButton'

const GameOverModal = ({ clearBoard, status }) => {
    const playRef = useRef(null)

    useEffect(() => {
        if (playRef.current) {
            playRef.current.focus()
        }
    }, [])

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            role="dialog"
            aria-label={status}
            aria-live="assertive"
            className="before:bg-primary text-primary absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-xl border border-light-secondary bg-opacity-10 text-center tracking-widest before:absolute before:inset-0 before:-z-10 before:size-full before:opacity-70 before:blur-sm before:saturate-150 dark:border-dark-secondary">
            <h2 className="text-accent text-4xl font-bold capitalize md:text-5xl">{status}</h2>
            <p className="text-primary mb-3 mt-10 text-lg">Would you like to play again?</p>

            <div className="flex justify-center gap-x-5">
                <ElevateButton ref={playRef} onClick={clearBoard} tabIndex={0}>
                    Play Again
                </ElevateButton>
                <ElevateButton variant="danger" onClick={() => alert('Thanks for playing!')} tabIndex={1}>
                    Exit
                </ElevateButton>
            </div>
        </motion.div>
    )
}

export default GameOverModal
