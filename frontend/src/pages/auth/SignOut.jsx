import React from 'react'

import { signOut } from 'firebase/auth'

import { auth } from '../../firebase'
import logger from '../../utils/logger'

const Logout = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth)
            logger.info('User signed out')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <button className="button mt-12 ml-12" onClick={handleLogout}>
            Sign out
        </button>
    )
}

export default Logout
