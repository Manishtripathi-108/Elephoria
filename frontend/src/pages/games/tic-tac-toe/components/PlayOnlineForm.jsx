import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useTicTacToeContext } from '../../../../context/TicTacToeContext'
import { iconMap } from '../../../../utils/globalConstants'

const PlayOnlineForm = () => {
    const [isJoinForm, setIsJoinForm] = useState(true)
    const { joinRoom, createRoom } = useTicTacToeContext()

    const handleFormToggle = (isJoining) => setIsJoinForm(isJoining)

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true)
        isJoinForm ? joinRoom(values.roomId, values.playerName) : createRoom(values.roomName, values.playerName)
        setSubmitting(false)
        const modal = document.getElementById('play_online')
        if (modal) modal.close()
    }

    const renderFormContent = (isJoin) => (
        <Formik
            initialValues={{ [isJoin ? 'roomId' : 'roomName']: '', playerName: '' }}
            validationSchema={Yup.object().shape({
                [isJoin ? 'roomId' : 'roomName']: Yup.string()
                    .required(isJoin ? 'Room ID is required' : 'Room Name is required')
                    .max(isJoin ? '6' : '10', isJoin ? 'Room ID must not exceed 6 characters' : 'Room Name must not exceed 10 characters'),
                playerName: Yup.string().required('Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
            })}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
                <Form id={isJoin ? 'joinRoomForm' : 'createRoomForm'} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label" htmlFor={isJoin ? 'roomId' : 'roomName'}>
                            {isJoin ? 'Enter Room ID' : 'Room Name'}
                        </label>
                        <Field
                            type="text"
                            id={isJoin ? 'roomId' : 'roomName'}
                            name={isJoin ? 'roomId' : 'roomName'}
                            placeholder={isJoin ? 'Room ID' : 'Enter a room name'}
                            className="input-text"
                            required
                            disabled={isSubmitting}
                            maxLength={isJoin ? '6' : '10'}
                        />
                        <ErrorMessage component="div" className="form-helper-text error" name={isJoin ? 'roomId' : 'roomName'} />
                    </div>

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
                            required
                            disabled={isSubmitting}
                            maxLength={20}
                        />
                        <ErrorMessage component="div" className="form-helper-text error" name="playerName" />
                    </div>
                    <button type="submit" className="button w-full" disabled={isSubmitting}>
                        {isJoin ? 'Join Room' : 'Create Room'}
                    </button>
                </Form>
            )}
        </Formik>
    )

    return (
        <div className="relative max-h-full w-full max-w-md p-8 md:p-10">
            <Icon icon={iconMap.gamePadTurbo} className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="text-highlight mb-3 text-center font-aladin text-4xl font-bold tracking-widest">Play Online</h2>
            <h3 className="text-primary mb-5 text-center font-indie-flower font-normal tracking-wider">
                Join a room or create a new one to start playing
            </h3>

            <div className="mb-5 flex justify-center space-x-4">
                <button className={`button ${isJoinForm ? 'active' : ''}`} title="Join a Room" onClick={() => handleFormToggle(true)}>
                    Join a Room
                </button>
                <button className={`button ${!isJoinForm ? 'active' : ''}`} title="Create a Room" onClick={() => handleFormToggle(false)}>
                    Create a Room
                </button>
            </div>

            {renderFormContent(isJoinForm)}
        </div>
    )
}

export default PlayOnlineForm
