import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useTicTacToeContext } from '../../../../context/TicTacToe/TicTacToeContext'
import iconMap from '../../../../constants/iconMap'

const PlayOnlineForm = () => {
    const [isJoinForm, setIsJoinForm] = useState(true)
    const { joinRoom, createRoom, setLoading } = useTicTacToeContext()

    const handleFormToggle = (isJoining) => setIsJoinForm(isJoining)

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true)
        setLoading(true)
        if (isJoinForm) {
            joinRoom(values.roomId, values.playerName)
        } else {
            createRoom(values.roomName, values.playerName)
        }
        setSubmitting(false)
        const modal = document.getElementById('play_online')
        if (modal) modal.close()
    }

    return (
        <div className="relative max-h-full w-full max-w-md p-8 md:p-10">
            <Icon icon={iconMap.gamePadTurbo} className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="text-highlight mb-3 text-center font-aladin text-4xl font-bold tracking-widest">Play Online</h2>
            <h3 className="text-primary mb-5 text-center font-normal tracking-wider">Join a room or create a new one to start playing</h3>

            <div className="mb-5 flex justify-center gap-x-4">
                <button className={`button ${isJoinForm ? 'active' : ''}`} title="Join a Room" onClick={() => handleFormToggle(true)}>
                    Join a Room
                </button>
                <button className={`button ${!isJoinForm ? 'active' : ''}`} title="Create a Room" onClick={() => handleFormToggle(false)}>
                    Create a Room
                </button>
            </div>

            <Formik
                initialValues={{
                    roomId: '',
                    roomName: '',
                    playerName: '',
                }}
                validationSchema={Yup.object().shape({
                    roomId: isJoinForm ? Yup.string().required('Room ID is required').max(6, 'Room ID must not exceed 6 characters') : null,
                    roomName: !isJoinForm ? Yup.string().required('Room Name is required').max(10, 'Room Name must not exceed 10 characters') : null,
                    playerName: Yup.string().required('Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
                })}
                onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form id={isJoinForm ? 'joinRoomForm' : 'createRoomForm'} className="space-y-4">
                        {isJoinForm && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="roomId">
                                    Enter Room ID
                                </label>
                                <Field
                                    type="text"
                                    id="roomId"
                                    name="roomId"
                                    placeholder="Room ID"
                                    className="input-text"
                                    disabled={isSubmitting}
                                    maxLength={6}
                                    autoComplete="off"
                                />
                                <ErrorMessage component="div" className="form-helper-text error" name="roomId" />
                            </div>
                        )}

                        {!isJoinForm && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="roomName">
                                    Room Name
                                </label>
                                <Field
                                    type="text"
                                    id="roomName"
                                    name="roomName"
                                    placeholder="Enter a room name"
                                    className="input-text"
                                    disabled={isSubmitting}
                                    maxLength={10}
                                    autoComplete="off"
                                />
                                <ErrorMessage component="div" className="form-helper-text error" name="roomName" />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="playerName">
                                Player Name
                            </label>
                            <Field
                                type="text"
                                id="playerName"
                                name="playerName"
                                placeholder="Enter your name"
                                className="input-text"
                                disabled={isSubmitting}
                                maxLength={20}
                                autoComplete="off"
                            />
                            <ErrorMessage component="div" className="form-helper-text error" name="playerName" />
                        </div>

                        <button type="submit" className="button w-full" disabled={isSubmitting}>
                            {isJoinForm ? 'Join Room' : 'Create Room'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default PlayOnlineForm
