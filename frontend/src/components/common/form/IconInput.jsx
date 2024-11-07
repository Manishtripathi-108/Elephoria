import React, { useState } from 'react'

import { Icon } from '@iconify/react'

const ICONS = {
    email: 'line-md:email-alt-filled',
    password: 'line-md:watch-loop',
    showPassword: 'line-md:watch-off-loop',
    default: 'line-md:emoji-angry-filled',
}

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
            return isPasswordVisible ? ICONS.showPassword : ICONS.password
        }
        if (type === 'email') return ICONS.email
        return customIcon || ICONS.default
    }

    return (
        <div className={`neu-form-group ${containerClass}`}>
            <label htmlFor={id} className="neu-form-label">
                {placeholder}
            </label>
            <div className={`neu-input-group ${isIconAtEnd ? 'neu-input-group-append' : 'neu-input-group-prepend'} ${error ? 'error' : ''}`}>
                {!isIconAtEnd && (
                    <Icon
                        icon={iconToDisplay()}
                        onClick={type === 'password' ? () => setIsPasswordVisible(!isPasswordVisible) : null}
                        className={`neu-input-icon ${error ? 'error' : ''}`}
                    />
                )}

                <input
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`neu-form-input ${inputClass}`}
                    type={isPasswordVisible && type === 'password' ? 'text' : type}
                    {...props}
                />

                {isIconAtEnd && (
                    <Icon
                        icon={iconToDisplay()}
                        onClick={type === 'password' ? () => setIsPasswordVisible(!isPasswordVisible) : null}
                        className={`neu-input-icon ${error ? 'error' : ''}`}
                    />
                )}
            </div>
            {error && <small className="neu-form-text error">{error}</small>}
        </div>
    )
}

export default IconInput
