import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Icon } from '@iconify/react'
import { signInWithPopup } from 'firebase/auth'

import iconMap from '../../constants/iconMap'
import { auth, provider } from '../../firebase'

const GoogleLogin = () => {
    const navigate = useNavigate()

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider)
            navigate('/')
        } catch (error) {
            console.error('Error during login:', error)
        }
    }

    return (
        <div>
            <Icon icon={iconMap.google} className="size-7 cursor-pointer" onClick={handleGoogleLogin} />
        </div>
    )
}

export default GoogleLogin
