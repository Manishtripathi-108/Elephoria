import React, { useState } from 'react'

import { Icon } from '@iconify/react'

const iconNames = {
    email: 'line-md:email-alt-filled',
    password: 'line-md:watch-loop',
    showPassword: 'line-md:watch-off-loop',
    angry: 'line-md:emoji-angry-filled',
}

const IconInput = ({ type = 'text', placeholder = '', value, onChange, name, id, error, groupClass = '', inputClass = '', icon = '' }) => {
    const [showPassword, setShowPassword] = useState(false)

    // Determine the icon to display
    const getIcon = () => {
        if (type === 'password') {
            return showPassword ? iconNames.showPassword : iconNames.password
        } else if (type === 'email') {
            return iconNames.email
        } else if (icon) {
            return icon
        }
        return iconNames.angry
    }

    return (
        <div className={`neu-form-group ${groupClass}`}>
            <label className="neu-form-label" htmlFor={id}>
                {placeholder}
            </label>
            <div className={`neu-input-group neu-input-group-prepend svgs ${error ? 'error' : ''}`}>
                <Icon
                    icon={getIcon()}
                    onClick={type === 'password' ? () => setShowPassword(!showPassword) : null}
                    className={`neu-input-icon ${error ? 'error' : ''}`}
                />
                <input
                    className={`neu-form-input ${inputClass}`}
                    type={showPassword && type === 'password' ? 'text' : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    id={id}
                />
            </div>
            {error && <small className="neu-form-text error">{error}</small>}
        </div>
    )
}

export default IconInput
