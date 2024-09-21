import React, { useEffect, useState } from 'react'

import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../../firebase'
import AuthComponent from './AuthForm'
import Logout from './SignOut'

const AuthState = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })

        // Cleanup the subscription
        return () => unsubscribe()
    }, [])

    return (
        <div>
            {user ? (
                <div>
                    <div className="mt-4 w-full px-3 pt-24 md:w-1/2 md:pt-20">
                        <div className="bg-primary rounded-lg border border-light-secondary p-6 shadow-neu-light-xs dark:border-dark-secondary dark:shadow-neu-dark-xs">
                            <div className="bg-primary size-44 relative -mt-24 rounded-full border border-light-secondary p-3 shadow-neu-inset-light-xs dark:border-dark-secondary dark:shadow-neu-inset-dark-xs">
                                <img
                                    className="size-full rounded-full object-cover p-3 shadow-neu-light-xs dark:shadow-neu-dark-xs"
                                    src={user.photoURL}
                                    alt={user.displayName}
                                />
                            </div>
                            <span>
                                <h3 className="text-primary mt-5 font-alegreya text-2xl font-semibold">{user.displayName}</h3>
                                <span className="text-secondary text-sm">{user.email}</span>

                                <p className="text-secondary mt-3 font-karla tracking-wide">{user.uid}</p>
                            </span>
                        </div>
                    </div>
                    <Logout />
                </div>
            ) : (
                <AuthComponent />
            )}
        </div>
    )
}

export default AuthState
