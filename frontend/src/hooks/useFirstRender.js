import { useRef } from 'react'

/**
 * Custom hook to detect if a component is rendering for the first time.
 * @returns {boolean} - Returns `true` if it's the first render, otherwise `false`.
 */
function useFirstRender() {
    const isFirstRender = useRef(true)

    if (isFirstRender.current) {
        isFirstRender.current = false
        return true
    }

    return false
}

export default useFirstRender
