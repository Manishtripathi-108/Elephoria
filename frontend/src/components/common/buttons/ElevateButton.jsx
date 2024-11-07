import React from 'react'

const ElevateButton = ({ children, onClick, title = '', className = '', ...props }) => {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`bg-primary dark:lineargradient-dark lineargradient-light group flex items-center justify-center overflow-hidden rounded-full border border-light-secondary p-1.5 shadow-neu-light-xs active:shadow-none dark:border-dark-secondary dark:shadow-neu-dark-xs ${className}`}
            {...props}>
            <div className="text-secondary group-focus:text-primary group-active:text-primary dark:lineargradient-dark lineargradient-light inline-flex h-full w-full items-center justify-center gap-2 rounded-full px-2 py-1 font-medium shadow-neu-light-xs transition-all duration-300 group-active:shadow-none dark:shadow-neu-dark-xs">
                {children}
            </div>
        </button>
    )
}

export default ElevateButton
