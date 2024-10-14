import React, { useState } from 'react'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import Toast from '../../components/common/notifications/toast'

// Import the Toast component

const validationSchema = Yup.object().shape({
    pin: Yup.string()
        .required('Auth Pin is required')
        .matches(/^[0-9a-fA-F]+$/, 'Auth Pin must be a valid hexadecimal string'),
})

function AnimeAuth() {
    const [accessToken, setAccessToken] = useState(null) // State to store access token
    const [toast, setToast] = useState({ show: false, message: '', type: '' }) // State for toast messages

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch('/api/anime/exchange-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pin: values.pin }),
            })

            const data = await response.json()
            if (response.ok) {
                console.log('Access Token:', data.accessToken)
                setAccessToken(data.accessToken) // Save the access token in state
                localStorage.setItem('accessToken', data.accessToken) // Store in local storage
                setToast({ show: true, message: 'Successfully signed in!', type: 'success' })
            } else {
                console.error('Error:', data.message)
                setToast({ show: true, message: data.message || 'An error occurred. Try Again!', type: 'error' })
            }
        } catch (error) {
            console.error('Error submitting pin:', error)
            setToast({ show: true, message: 'Failed to sign in. Please try again.', type: 'error' })
        } finally {
            setSubmitting(false) // Stop the loading state
        }
    }

    return (
        <div className="bg-primary grid h-screen w-full place-items-center p-4">
            <div className="bg-primary w-full max-w-md rounded-lg border border-light-secondary p-6 shadow-neu-light-md dark:border-dark-secondary dark:shadow-neu-dark-md">
                <h1 className="text-primary mb-4 text-center font-aladin text-2xl font-semibold tracking-widest">Anime Authorization</h1>
                <p className="text-secondary mb-4 text-center font-indie-flower tracking-wide">
                    Please go to the AniList page, authorize the application, and paste your Auth Pin below.
                </p>
                <div className="mb-4 grid w-full place-items-center">
                    <a
                        className="neu-btn"
                        href="https://anilist.co/api/v2/oauth/authorize?client_id=21724&redirect_uri=https://anilist.co/api/v2/oauth/pin&response_type=code"
                        target="_blank"
                        rel="noopener noreferrer">
                        Get Anilist Auth Pin
                    </a>
                </div>

                <Formik initialValues={{ pin: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form id="pinForm" className="space-y-4">
                            <div className="neu-form-group">
                                <label htmlFor="pin" className="neu-form-label">
                                    Enter Auth Pin:
                                </label>
                                <Field type="text" id="pin" name="pin" className="neu-form-input" placeholder="Enter Auth Pin:" />
                                <ErrorMessage name="pin" component="div" className="error neu-form-text ml-2 mt-1 font-indie-flower tracking-wide" />
                            </div>
                            <div className="grid w-full place-items-center">
                                <button type="submit" className="neu-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* Toast notification */}
                {toast.show && (
                    <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ show: false, message: '', type: 'success' })} />
                )}
            </div>
        </div>
    )
}

export default AnimeAuth
