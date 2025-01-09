import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'

import { exchangeCode } from '../../api/animeHubApi'
import LoadingState from '../../components/Loading'
import { API_TYPES } from '../../constants/apiRoutes'
import APP_ROUTES from '../../constants/appRoutes'
import { useAuthToken } from '../../context/AuthTokenProvider'

const AnimeLogin = () => {
    const navigate = useNavigate()
    const { isAuth, setIsAuth } = useAuthToken()
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const code = searchParams.get('code')

    const handleSubmit = async (code) => {
        console.log('logging in')

        setLoading(true)
        try {
            const result = await exchangeCode(code)
            if (result.success) {
                window.addToast('login successful!', 'success')
                console.log('login successful!')

                setIsAuth((prev) => ({ ...prev, anilist: true }))
                navigate(APP_ROUTES.ANIME.ANIMELIST, { replace: true })
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
        isAuth.anilist && navigate(APP_ROUTES.ANIME.ANIMELIST, { replace: true })
        code ? handleSubmit(code) : setLoading(false)
    }, [isAuth, code, navigate, handleSubmit])

    if (loading) return <LoadingState />

    return (
        <div className="bg-primary h-calc-full-height grid w-full place-items-center p-2">
            <div className="bg-primary shadow-neumorphic-lg w-full max-w-md space-y-6 rounded-2xl border p-6">
                <h1 className="text-primary font-aladin text-center text-2xl font-semibold tracking-widest">Login with AniList</h1>
                <p className="text-secondary text-center tracking-wide">Use the button below to authorize and connect your AniList account.</p>
                <div className="grid w-full place-items-center">
                    <a
                        className="button w-3/4"
                        href={`https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ANILIST_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_ANILIST_REDIRECT_URI}&response_type=code`}
                        target="_blank"
                        rel="noopener noreferrer">
                        Login with AniList
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AnimeLogin
