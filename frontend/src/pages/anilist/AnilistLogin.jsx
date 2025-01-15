import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'

import { exchangeCode } from '../../api/animeHubApi'
import LoadingState from '../../components/Loading'
import APP_ROUTES from '../../constants/app.constants'
import { useAuthToken } from '../../context/AuthTokenProvider'

const AnilistLogin = () => {
    const navigate = useNavigate()
    const { isAuth, checkAuth } = useAuthToken()
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const code = searchParams.get('code')

    const handleSubmit = async (code) => {
        console.log('logging in')

        setLoading(true)
        try {
            const result = await exchangeCode(code)
            code = null
            if (result.success) {
                window.addToast('login successful!', 'success')
                console.log('login successful!')

                navigate(APP_ROUTES.ANILIST.ANIME, { replace: true })
                checkAuth('anilist')
            } else {
                throw result
            }
        } catch (error) {
            console.error('Error during anime login:', error)
            window.addToast(error.message || 'AniList login failed. Please try again', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuth.anilist) {
            navigate(APP_ROUTES.ANILIST.ANIME, { replace: true })
        } else if (code) {
            handleSubmit(code)
        } else {
            setLoading(false)
        }
    }, [isAuth])

    if (loading) return <LoadingState />

    return (
        <div className="bg-primary h-calc-full-height grid w-full place-items-center p-2">
            <div className="bg-primary shadow-neumorphic-lg w-full max-w-md space-y-6 rounded-2xl border p-6">
                <h1 className="text-primary font-aladin text-center text-2xl font-semibold tracking-widest">Login with AniList</h1>
                <p className="text-secondary text-center tracking-wide">Use the button below to authorize and connect your AniList account.</p>
                <div className="grid w-full place-items-center">
                    <a
                        className="button w-3/4"
                        href={`https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ANILIST_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_ANILIST_REDIRECT_URI}&response_type=code`}>
                        Login with AniList
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AnilistLogin
