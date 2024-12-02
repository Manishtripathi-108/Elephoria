import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { exchangePin } from '../../api/animeHubApi'
import { useLoadingBar } from '../../context/LoadingBarContext'

const validationSchema = Yup.object().shape({
    pin: Yup.string()
        .required('Auth Pin is required')
        .matches(/^[0-9a-fA-F]+$/, 'Auth Pin must be a valid hexadecimal string'),
})

function AnimeHubAuth() {
    const navigate = useNavigate()
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
        checkServerIsAlive()
    }, [])

    const handleSubmit = async (values, { setSubmitting }) => {
        const result = await exchangePin(values.pin)
        if (result.success) {
            window.addToast('Authorization successful!', 'success')
            navigate('/anime-hub')
        } else {
            if (result.retryAfterSeconds) {
                window.addToast(`Rate limit exceeded. Please try again after ${result.retryAfterSeconds} seconds.`, 'error')
            } else {
                window.addToast(result.message || 'An error occurred. Please try again later.', 'error')
            }
        }
        setSubmitting(false)
    }

    const checkServerIsAlive = async () => {
        try {
            const response = await axios.get('/api', { withCredentials: true })
            console.log(response)

            if (response.data?.success) {
                window.addToast(response.data.message || 'Server is alive and ready to receive requests.', 'success')
            } else {
                window.addToast('Server is not reachable.', 'error')
            }

            if (response.status === 200) {
                window.addToast('Server is alive and ready to receive requests from ok.', 'success')
            }
        } catch (error) {
            window.addToast('Server is not reachable from catch.', 'error')
            console.log(error)
        }
    }

    return (
        <div className="bg-primary grid h-[calc(100dvh-4rem)] w-full place-items-center">
            <div className="bg-primary w-full max-w-md rounded-lg border border-light-secondary p-6 shadow-neu-light-md dark:border-dark-secondary dark:shadow-neu-dark-md">
                <h1 className="text-primary mb-4 text-center font-aladin text-2xl font-semibold tracking-widest">Anime Authorization</h1>
                <p className="text-secondary mb-4 text-center tracking-wide">
                    Please go to the AniList page, authorize the application, and paste your Auth Pin below.
                </p>
                <div className="mb-4 grid w-full place-items-center">
                    <a
                        className="button"
                        href={`https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ANILIST_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_ANILIST_REDIRECT_URI}&response_type=code`}
                        target="_blank"
                        rel="noopener noreferrer">
                        Get Anilist Auth Pin
                    </a>
                </div>

                <Formik initialValues={{ pin: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form id="pinForm" className="space-y-4">
                            <div className="form-group">
                                <label htmlFor="pin" className="form-label">
                                    Enter Auth Pin:
                                </label>
                                <Field type="text" id="pin" name="pin" className="input-text" placeholder="Enter Auth Pin:" />
                                <ErrorMessage name="pin" component="div" className="error form-helper-text ml-2 mt-1" />
                            </div>
                            <div className="grid w-full place-items-center">
                                <button type="submit" className="button" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AnimeHubAuth
