import React from 'react'

import ShadowsItem from '../components/ShadowsItem'

const shadowsLight = ['shadow-neu-light-xs', 'shadow-neu-light-sm', 'shadow-neu-light-md', 'shadow-neu-light-lg', 'shadow-neu-light-xl']

const shadowsLightInset = [
    'shadow-neu-inset-light-xs',
    'shadow-neu-inset-light-sm',
    'shadow-neu-inset-light-md',
    'shadow-neu-inset-light-lg',
    'shadow-neu-inset-light-xl',
]

const shadowsDark = ['shadow-neu-dark-xs', 'shadow-neu-dark-sm', 'shadow-neu-dark-md', 'shadow-neu-dark-lg', 'shadow-neu-dark-xl']

const shadowsDarkInset = [
    'shadow-neu-inset-dark-xs',
    'shadow-neu-inset-dark-sm',
    'shadow-neu-inset-dark-md',
    'shadow-neu-inset-dark-lg',
    'shadow-neu-inset-dark-xl',
]

const ShadowsGrid = () => {
    return (
        <div className="flex-center w-full flex-col">
            <div className="w-full bg-light-primary p-4 lg:p-8">
                <h1 className="text-primary mb-8 text-center text-3xl font-bold">Neumorphic Shadows</h1>
                <ShadowsItem shadows={shadowsLight} />
            </div>
            <div className="w-full bg-light-primary p-4 lg:p-8">
                <h1 className="text-primary mb-8 text-center text-3xl font-bold">Neumorphic Inset Shadows</h1>
                <ShadowsItem shadows={shadowsLightInset} />
            </div>
            <div className="w-full bg-dark-primary p-4 lg:p-8">
                <h1 className="text-primary mb-8 text-center text-3xl font-bold">Dark Mode Neumorphic Shadows</h1>
                <ShadowsItem shadows={shadowsDark} isDark={true} />
            </div>
            <div className="w-full bg-dark-primary p-4 lg:p-8">
                <h1 className="text-primary mb-8 text-center text-3xl font-bold">Dark Mode Neumorphic Inset Shadows</h1>
                <ShadowsItem shadows={shadowsDarkInset} isDark={true} />
            </div>
        </div>
    )
}

export default ShadowsGrid
