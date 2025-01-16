import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { exchangeCode } from '../../api/anilistApi'

const validationSchema = Yup.object().shape({
    pin: Yup.string()
        .required('Auth Pin is required')
        .matches(/^[0-9a-fA-F]+$/, 'Auth Pin must be a valid hexadecimal string'),
})

const AnimeHubAuth = () => {
    const navigate = useNavigate()

    const handleSubmit = async (values, { setSubmitting }) => {
        const result = await exchangeCode(values.pin)
        if (result.success) {
            window.addToast('Authorization successful!', 'success')
            navigate('/anilist')
        } else {
            if (result.retryAfterSeconds) {
                window.addToast(`Rate limit exceeded. Please try again after ${result.retryAfterSeconds} seconds.`, 'error')
            } else {
                window.addToast(result.message || 'An error occurred. Please try again later.', 'error')
            }
        }
        setSubmitting(false)
    }

    return (
        <div className="bg-primary grid h-[calc(100dvh-4rem)] w-full place-items-center">
            <div className="bg-primary shadow-neumorphic-md w-full max-w-md rounded-lg border p-6">
                <h1 className="text-primary font-aladin mb-4 text-center text-2xl font-semibold tracking-widest">Anime Authorization</h1>
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
                                <label htmlFor="pin" className="form-text">
                                    Enter Auth Pin:
                                </label>
                                <Field type="text" id="pin" name="pin" className="form-field" placeholder="Enter Auth Pin:" autoComplete="off" />
                                <ErrorMessage name="pin" component="p" className="form-text mt-1 ml-2 text-red-500" />
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
