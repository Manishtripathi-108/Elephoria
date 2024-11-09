import React from 'react'

import { signOut } from 'firebase/auth'

import { auth } from '../../firebase'

const Logout = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth)
            console.log('User signed out')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <button className="button ml-12 mt-12" onClick={handleLogout}>
            Sign out
        </button>
    )
}

export default Logout
