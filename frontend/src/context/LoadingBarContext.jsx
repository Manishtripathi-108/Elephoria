import React, { createContext, useCallback, useContext, useRef, useState } from 'react'

import LoadingBar from 'react-top-loading-bar'

const LoadingBarContext = createContext()

export const LoadingBarProvider = ({ children }) => {
    const loadingBarRef = useRef(null)
    const [progress, setProgress] = useState(0)

    // Ref-based methods for loading bar control
    const startContinuous = useCallback((startingValue = 20, refreshRate = 100) => {
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart(startingValue, refreshRate)
        }
    }, [])

    const startStatic = useCallback((startingValue = 30) => {
        if (loadingBarRef.current) {
            loadingBarRef.current.staticStart(startingValue)
        }
    }, [])

    const completeLoading = useCallback(() => {
        if (loadingBarRef.current) {
            loadingBarRef.current.complete()
        }
    }, [])

    // State-based methods for loading bar control
    const addProgress = useCallback((value) => {
        setProgress((prev) => Math.min(prev + value, 100))
    }, [])

    const decreaseProgress = useCallback((value) => {
        setProgress((prev) => Math.max(prev - value, 0))
    }, [])

    const completeProgress = useCallback(() => {
        setProgress(100)
    }, [])

    const contextValue = {
        startContinuous,
        startStatic,
        completeLoading,
        addProgress,
        decreaseProgress,
        completeProgress,
    }

    return (
        <LoadingBarContext.Provider value={contextValue}>
            <LoadingBar
                color="#FF6347"
                shadow={false}
                ref={loadingBarRef}
                height={3}
                waitingTime={300}
                className="after:animate-shimmer-ray relative overflow-hidden rounded-e-full after:absolute after:top-0 after:left-[-30%] after:h-full after:w-0 after:bg-radial-[circle] after:from-white after:to-[#FF6347]"
            />
            <LoadingBar
                color="#1E90FF"
                shadow={false}
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                height={3}
                waitingTime={300}
                className="after:animate-shimmer-ray after:bg-radial-[circle] from-white to-[#1E90FF] relative overflow-hidden rounded-e-full after:absolute after:top-0 after:left-[-30%] after:h-full after:w-0"
            />
            {children}
        </LoadingBarContext.Provider>
    )
}

export const useLoadingBar = () => useContext(LoadingBarContext)
