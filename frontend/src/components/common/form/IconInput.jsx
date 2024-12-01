import React, { useState } from 'react'

import { Icon } from '@iconify/react'

import { iconMap } from '../../../utils/globalConstants'

const IconInput = ({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    name,
    id,
    error,
    isIconAtEnd = false,
    containerClass = '',
    inputClass = '',
    customIcon = '',
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const iconToDisplay = () => {
        if (type === 'password') {
            return isPasswordVisible ? iconMap.showPassword : iconMap.password
        }
        if (type === 'email') return iconMap.email
        return customIcon || 'line-md:emoji-angry-filled'
    }

    return (
        <div className={`form-group ${containerClass}`}>
            <label htmlFor={id} className="form-label">
                {placeholder}
            </label>
            <div className={`input-wrapper ${isIconAtEnd ? 'input-group-end' : 'input-group-start'} ${error ? 'error' : ''}`}>
                {!isIconAtEnd && (
                    <Icon
                        icon={iconToDisplay()}
                        onClick={type === 'password' ? () => setIsPasswordVisible(!isPasswordVisible) : null}
                        className={`input-icon ${error ? 'error' : ''}`}
                    />
                )}

                <input
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`input-text ${inputClass}`}
                    type={isPasswordVisible && type === 'password' ? 'text' : type}
                    {...props}
                />

                {isIconAtEnd && (
                    <Icon
                        icon={iconToDisplay()}
                        onClick={type === 'password' ? () => setIsPasswordVisible(!isPasswordVisible) : null}
                        className={`input-icon ${error ? 'error' : ''}`}
                    />
                )}
            </div>
            {error && <small className="form-helper-text error">{error}</small>}
        </div>
    )
}

export default IconInput
