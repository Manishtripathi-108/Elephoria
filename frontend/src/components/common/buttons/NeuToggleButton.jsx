import React from 'react'

const NeuToggleButton = ({ handleClick, active, alignment = 'center', additionalClasses, ...props }) => {
    const alignmentStyles = {
        left: 'items-start',
        center: 'items-center',
        right: 'items-end',
    }

    return (
        <button
            className={`group border-light-secondary shadow-neumorphic-xs active:shadow-neumorphic-inset-md dark:border-dark-secondary flex size-10 shrink-0 grow-0 cursor-pointer flex-col justify-center rounded-lg border p-2 transition-shadow duration-500 ${alignmentStyles[active ? 'center' : alignment]} ${additionalClasses || ''}`}
            onClick={handleClick}
            {...props}>
            <span
                className={`h-[3px] w-full rounded-md transition-all duration-500 ease-in-out ${
                    active
                        ? 'group-active:bg-highlight bg-accent -m-[1.5px] origin-center group-active:my-0.5 group-active:rotate-0 first:-rotate-45 last:rotate-45'
                        : 'bg-highlight group-active:bg-accent my-0.5 origin-center group-active:-m-[1.5px] first:group-active:-rotate-45 last:group-active:rotate-45'
                }`}></span>
            <span
                className={`h-[3px] ${alignment !== 'center' ? 'w-3/5' : 'w-full'} rounded-md transition-all duration-500 ease-in-out ${
                    active
                        ? 'group-active:bg-highlight bg-accent -m-[1.5px] scale-0 group-active:my-0.5 group-active:scale-100 group-active:rotate-0'
                        : 'bg-highlight group-active:bg-accent my-0.5 group-active:-m-[1.5px] group-active:scale-0'
                }`}></span>
            <span
                className={`h-[3px] w-full rounded-md transition-all duration-500 ease-in-out ${
                    active
                        ? 'group-active:bg-highlight bg-accent -m-[1.5px] origin-center group-active:my-0.5 group-active:rotate-0 first:-rotate-45 last:rotate-45'
                        : 'bg-highlight group-active:bg-accent my-0.5 origin-center group-active:-m-[1.5px] first:group-active:-rotate-45 last:group-active:rotate-45'
                }`}></span>
        </button>
    )
}

export default NeuToggleButton
