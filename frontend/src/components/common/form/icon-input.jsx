import React from 'react'

import Heart from '../../../assets/svgs/heart'

const IconInput = ({ type, placeholder, value, onChange, name, id, error, groupClass, inputClass }) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
        <div className={`neu-form-group ${groupClass && groupClass}`}>
            <label className="neu-form-label" htmlFor={id}>
                {placeholder}
            </label>
            <div className={`neu-input-group neu-input-group-prepend ${error && 'error'}`}>
                {type === 'password' ? (
                    <span className="neu-input-icon" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? '🙈' : '👁️'}
                    </span>
                ) : (
                    <Heart className={`neu-input-icon ${error && 'error'}`} />
                )}
                <input
                    className={`neu-form-input ${inputClass && inputClass}`}
                    type={showPassword ? 'text' : type}
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
