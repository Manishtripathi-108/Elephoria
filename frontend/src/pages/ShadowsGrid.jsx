import React from 'react'

import ShadowsItem from '../components/ShadowsItem'

const shadowsLight = ['shadow-neumorphic-xs', 'shadow-neumorphic-sm', 'shadow-neumorphic-md', 'shadow-neumorphic-lg', 'shadow-neumorphic-xl']

const shadowsLightInset = [
    'shadow-neumorphic-inset-xs',
    'shadow-neumorphic-inset-sm',
    'shadow-neumorphic-inset-md',
    'shadow-neumorphic-inset-lg',
    'shadow-neumorphic-inset-xl',
]

const ShadowsGrid = () => {
    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div className="bg-primary w-full p-4 lg:p-8">
                <h1 className="text-text-primary mb-8 text-center text-3xl font-bold">Neumorphic Shadows</h1>
                <ShadowsItem shadows={shadowsLight} />
            </div>
            <div className="bg-primary w-full p-4 lg:p-8">
                <h1 className="text-text-primary mb-8 text-center text-3xl font-bold">Neumorphic Inset Shadows</h1>
                <ShadowsItem shadows={shadowsLightInset} />
            </div>
        </div>
    )
}

export default ShadowsGrid
