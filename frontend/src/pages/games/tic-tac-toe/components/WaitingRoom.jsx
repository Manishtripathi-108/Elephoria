import React from 'react'

import { Icon } from '@iconify/react'
import { motion } from 'motion/react'

import ElevateButton from '../../../../components/common/buttons/ElevateButton'
import iconMap from '../../../../constants/iconMap'

const WaitingRoom = ({ onExit, onStart, playerO = '', playerX = '', roomId, roomName }) => {
    // Utility to animate letters in a word
    const wordMap = (word) => (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="inline-flex"
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.1, duration: 0.5 },
                },
            }}>
            {word.split('').map((letter, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { scale: 0.8 },
                        visible: {
                            scale: 1,
                            transition: {
                                repeat: Infinity,
                                duration: 0.3,
                                repeatDelay: 1,
                                repeatType: 'reverse',
                            },
                        },
                    }}>
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </motion.div>
    )

    // Copy room code to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId)
        window.addToast('Room code copied to clipboard!', 'success')
    }

    // Share room code
    const shareRoom = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: `Join my Tic Tac Toe game: ${roomName}`,
                    text: `Use this room Id to join: ${roomId}`,
                })
                .catch((err) => {
                    window.addToast('Error sharing room code. Please try again.', 'error')
                })
        } else {
            window.addToast('Sharing is not supported on your device. Please copy the code.', 'info')
        }
    }

    // Reusable Player Block Component
    const PlayerBlock = ({ player, label }) => (
        <div className="shadow-neumorphic-inset-md w-full max-w-sm shrink-0 rounded-xl border p-3 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="shadow-neumorphic-md rounded-lg border border-inherit p-6">
                <div
                    className={`shadow-neumorphic-inset-md mx-auto flex size-20 items-center justify-center rounded-full border border-inherit p-4 text-6xl md:size-44 md:text-8xl ${
                        player ? 'text-highlight' : 'text-text-secondary animate-blob'
                    }`}>
                    {label}
                </div>
                <div className="shadow-neumorphic-inset-xs mt-4 rounded-md border border-inherit p-2">
                    {player || wordMap(`Waiting for ${label}...`)}
                </div>
            </motion.div>
        </div>
    )

    return (
        <motion.div
            key="waiting-room"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-primary text-text-primary flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center p-4">
            {/* Room Details */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-8 text-center">
                <h2 className="text-accent text-2xl font-semibold md:text-4xl">{`Room: ${roomName}`}</h2>
                <div className="mt-2 flex items-center justify-center gap-x-4">
                    <p
                        className="hover:text-highlight text-text-secondary cursor-pointer"
                        onClick={copyToClipboard}
                        title="Click to copy"
                        aria-label={`Room code ${roomId}`}>
                        {`Code: ${roomId}`}
                    </p>
                    <button
                        onClick={shareRoom}
                        className="button button-sm shrink-0 rounded-full p-2"
                        title="Share Room Code"
                        aria-label="Share Room Code">
                        <Icon icon={iconMap.share} className="size-5" />
                    </button>
                </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-accent mb-8 text-xl font-bold capitalize">
                {!(playerX.id && playerO.id) ? 'Waiting for another player to join...' : 'Ready to Start!'}
            </motion.h1>

            {/* Players Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
                <PlayerBlock player={playerX.name} label="X" />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-highlight text-3xl font-bold">
                    VS
                </motion.div>
                <PlayerBlock player={playerO.name} label="O" />
            </motion.div>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                className="mt-10 flex w-full items-center justify-center gap-4"
                title="Start Game">
                <ElevateButton
                    onClick={onStart}
                    disabled={!(playerX.id && playerO.id)}
                    className={`${!(playerX.id && playerO.id) ? 'cursor-not-allowed' : ''}`}>
                    Start Game
                </ElevateButton>
                <ElevateButton onClick={onExit} variant="danger" title="Exit Room">
                    Leave Room
                </ElevateButton>
            </motion.div>
        </motion.div>
    )
}

export default WaitingRoom
