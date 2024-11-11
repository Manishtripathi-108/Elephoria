import React from 'react'

function NeuToggleButton({ handleClick, active, alignment = 'center', additionalClasses, ...props }) {
    const alignmentStyles = {
        left: 'items-start',
        center: 'items-center',
        right: 'items-end',
    }

    return (
        <button
            className={`group flex size-10 shrink-0 flex-grow-0 cursor-pointer flex-col justify-center rounded-lg border border-light-secondary p-2 shadow-neu-light-xs transition-shadow duration-500 active:shadow-neu-inset-light-md dark:border-dark-secondary dark:shadow-neu-dark-md dark:active:shadow-neu-inset-dark-sm ${alignmentStyles[active ? 'center' : alignment]} ${additionalClasses || ''}`}
            onClick={handleClick}
            {...props}>
            <span
                className={`h-[3px] w-full rounded-md transition-all duration-500 ease-in-out ${
                    active
                        ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] origin-center first:-rotate-45 last:rotate-45 group-active:my-0.5 group-active:rotate-0'
                        : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 origin-center group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45'
                }`}></span>
            <span
                className={`h-[3px] ${alignment !== 'center' ? 'w-3/5' : 'w-full'} rounded-md transition-all duration-500 ease-in-out ${
                    active
                        ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] scale-0 group-active:my-0.5 group-active:rotate-0 group-active:scale-100'
                        : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 group-active:-m-[1.5px] group-active:scale-0'
                }`}></span>
            <span
                className={`h-[3px] w-full rounded-md transition-all duration-500 ease-in-out ${
                    active
                        ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] origin-center first:-rotate-45 last:rotate-45 group-active:my-0.5 group-active:rotate-0'
                        : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 origin-center group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45'
                }`}></span>
        </button>
    )
}

export default NeuToggleButton
