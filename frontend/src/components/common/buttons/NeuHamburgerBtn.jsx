import React from 'react'

function NeuHamburgerBtn({ onClick, isActive, className, ...props }) {
    return (
        <button
            className={
                'flex-center group size-10 cursor-pointer flex-col rounded-lg border border-light-secondary shadow-neu-light-xs transition-shadow duration-300 active:shadow-neu-inset-light-md dark:border-dark-secondary dark:shadow-neu-dark-md dark:active:shadow-neu-inset-dark-sm' +
                (className ? ` ${className}` : '')
            }
            onClick={onClick}
            {...props}>
            {/* Hamburger lines */}
            <span
                className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                    isActive
                        ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] origin-center first:-rotate-45 last:rotate-45 group-active:my-0.5 group-active:rotate-0'
                        : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 origin-center group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45'
                }`}></span>
            <span
                className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                    isActive
                        ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] scale-0 group-active:my-0.5 group-active:rotate-0 group-active:scale-100'
                        : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 group-active:-m-[1.5px] group-active:scale-0'
                }`}></span>
            <span
                className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                    isActive
                        ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] origin-center first:-rotate-45 last:rotate-45 group-active:my-0.5 group-active:rotate-0'
                        : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 origin-center group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45'
                }`}></span>
        </button>
    )
}

export default NeuHamburgerBtn
