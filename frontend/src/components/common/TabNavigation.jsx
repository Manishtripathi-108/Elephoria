import React, { memo, useEffect, useRef, useState } from 'react'

import cn from '../../utils/cn'

/**
 * Tab navigation component with animated indicator
 *
 * @param {Array<string>} tabs the array of tab names
 * @param {string} currentTab the current selected tab
 * @param {Function} onTabChange the function to set the current selected tab
 * @param {string} className the class name of the component
 *
 * @returns The Tab Navigation component
 */
const TabNavigation = ({ tabs, currentTab, onTabChange, className = '' }) => {
    const [indicatorStyle, setIndicatorStyle] = useState({})
    const buttonRefs = useRef([])

    useEffect(() => {
        if (buttonRefs.current && buttonRefs.current.length > 0) {
            const currentButton = buttonRefs.current[tabs.indexOf(currentTab)]
            if (currentButton) {
                setIndicatorStyle({
                    height: `${currentButton.offsetHeight}px`,
                    top: `${currentButton.offsetTop}px`,
                    width: `${currentButton.offsetWidth}px`,
                    left: `${currentButton.offsetLeft}px`,
                })
            }
        }

        if (!currentTab)
            setIndicatorStyle({
                width: 0,
                height: 0,
            })
    }, [currentTab, tabs])

    return (
        <nav className={cn('bg-primary shadow-neumorphic-xs relative flex w-fit flex-wrap gap-1 rounded-xl border p-1', className)}>
            {tabs?.map((tab, index) => (
                <button
                    key={index}
                    role="tab"
                    type="button"
                    ref={(el) => (buttonRefs.current[index] = el)}
                    data-selected={currentTab === tab}
                    aria-selected={currentTab === tab}
                    onClick={() => onTabChange(tab)}
                    className="hover:text-text-primary text-text-secondary data-[selected=true]:text-text-primary z-30 flex-1 cursor-pointer rounded-lg px-4 py-2 font-medium transition-colors">
                    {tab}
                </button>
            ))}
            <div
                className="bg-primary shadow-neumorphic-inset-xs absolute top-1 max-h-[calc(100%-0.5rem)] rounded-lg border transition-all duration-500 ease-out"
                style={indicatorStyle}></div>
        </nav>
    )
}

export default memo(TabNavigation)
