import React, { memo } from 'react'

import cn from '../utils/cn'

const waves = ({ children, className }) => {
    return (
        <div className={cn('relative aspect-square w-full max-w-32', className)}>
            <span className="shadow-neumorphic-sm animate-waves absolute inset-0 h-full w-full rounded-full" />
            <span className="shadow-neumorphic-sm animate-waves absolute inset-0 h-full w-full rounded-full" style={{ animationDelay: '1.6s' }} />
            <span className="shadow-neumorphic-sm animate-waves absolute inset-0 h-full w-full rounded-full" style={{ animationDelay: '3.2s' }} />
            {children}
        </div>
    )
}

export default memo(waves)
