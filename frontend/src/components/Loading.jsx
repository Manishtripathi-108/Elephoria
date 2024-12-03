import React from 'react'

import { useLoadingBar } from '../context/LoadingBarContext'

const Loading = () => {
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        return () => completeLoading()
    }, [])

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
        </div>
    )
}

export default Loading
