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
                        <div className="bg-primary border-light-secondary shadow-neumorphic-xs dark:border-dark-secondary rounded-lg border p-6">
                            <div className="bg-primary border-light-secondary shadow-neumorphic-inset-xs dark:border-dark-secondary relative -mt-24 size-44 rounded-full border p-3">
                                <img
                                    className="shadow-neumorphic-xs size-full rounded-full object-cover p-3"
                                    src={user.photoURL}
                                    alt={user.displayName}
                                />
                            </div>
                            <span>
                                <h3 className="text-primary font-alegreya mt-5 text-2xl font-semibold">{user.displayName}</h3>
                                <span className="text-secondary text-sm">{user.email}</span>

                                <p className="text-secondary font-karla mt-3 tracking-wide">{user.uid}</p>
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
