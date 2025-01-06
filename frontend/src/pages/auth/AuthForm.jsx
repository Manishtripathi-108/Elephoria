import React, { useRef } from 'react'

import { Icon } from '@iconify/react/dist/iconify.js'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import iconMap from '../../constants/iconMap'
import GoogleLogin from './GoogleLogin'

const validateRegistration = Yup.object({
    registerName: Yup.string().required('Required'),
    registerEmail: Yup.string().email('Invalid email address').required('Required'),
    registerPassword: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    confirmRegisterPassword: Yup.string()
        .oneOf([Yup.ref('registerPassword'), null], 'Passwords must match')
        .required('Required'),
})

const validateLogin = Yup.object({
    loginEmail: Yup.string().email('Invalid email address').required('Required'),
    loginPassword: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
})

const AuthComponent = () => {
    const switchContainerRef = useRef(null)
    const registerContainerRef = useRef(null)
    const loginContainerRef = useRef(null)
    const switchSignInRef = useRef(null)
    const switchSignUpRef = useRef(null)

    const toggleForm = () => {
        const switchContainer = switchContainerRef.current
        const registerContainer = registerContainerRef.current
        const loginContainer = loginContainerRef.current
        const switchSignIn = switchSignInRef.current
        const switchSignUp = switchSignUpRef.current

        // Add animation
        switchContainer.classList.add('animate-auth-slider')
        setTimeout(() => {
            switchContainer.classList.remove('animate-auth-slider')
        }, 1500)

        // Toggle classes for animations
        switchContainer.classList.toggle('left-[60%]')
        ;[...switchContainer.querySelectorAll('.switch-circles')].forEach((circle) => {
            circle.classList.toggle('left-[60%]')
        })

        switchSignIn.classList.toggle('invisible')
        switchSignIn.classList.toggle('opacity-0')
        switchSignUp.classList.toggle('invisible')
        switchSignUp.classList.toggle('opacity-0')

        registerContainer.classList.toggle('left-0')
        registerContainer.classList.toggle('left-[40%]')
        registerContainer.classList.toggle('z-200')
        loginContainer.classList.toggle('left-0')
        loginContainer.classList.toggle('left-[40%]')
    }

    return (
        <div className="grid h-dvh w-dvw place-items-center">
            <div className="bg-primary shadow-neumorphic-lg relative h-[600px] w-[70%] overflow-hidden rounded-xl p-6">
                {/* Register Form with Formik */}
                <div
                    className="bg-primary absolute top-0 left-[40%] z-0 flex h-full w-3/5 items-center justify-center p-6 transition-all duration-[1.25s]"
                    ref={registerContainerRef}>
                    <Formik
                        initialValues={{ registerName: '', registerEmail: '', registerPassword: '', confirmRegisterPassword: '' }}
                        validationSchema={validateRegistration}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 2))
                        }}>
                        {({ errors, touched }) => (
                            <Form className="flex h-full w-full flex-col items-center justify-center">
                                <h2 className="form_title text-primary mb-8 text-3xl font-bold">Create Your Account</h2>
                                <div className="text-primary flex items-center justify-center gap-5">
                                    <GoogleLogin />
                                </div>
                                <span className="text-secondary mt-8 mb-3">Or use your email for registration</span>

                                {/* Name Field */}
                                <div className="form-group">
                                    <label htmlFor="registerName" className="form-text">
                                        Name
                                    </label>
                                    <div className="form-field-wrapper">
                                        <Icon icon={iconMap.user} />
                                        <Field
                                            data-error={errors.registerName && touched.registerName}
                                            type="text"
                                            name="registerName"
                                            id="registerName"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <ErrorMessage name="registerName" component="div" className="form-text text-red-500 dark:text-red-500" />
                                </div>

                                {/* Email Field */}
                                <div className="form-group">
                                    <label htmlFor="registerEmail" className="form-text">
                                        Email
                                    </label>
                                    <div className="form-field-wrapper">
                                        <Icon icon={iconMap.email} />
                                        <Field
                                            data-error={errors.registerEmail && touched.registerEmail}
                                            type="email"
                                            name="registerEmail"
                                            id="registerEmail"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    <ErrorMessage name="registerEmail" component="div" className="form-text text-red-500 dark:text-red-500" />
                                </div>

                                {/* Password Field */}
                                <div className="form-group">
                                    <label htmlFor="registerPassword" className="form-text">
                                        Password
                                    </label>
                                    <div className="form-field-wrapper">
                                        <Icon icon={iconMap.password} />
                                        <Field
                                            data-error={errors.registerPassword && touched.registerPassword}
                                            type="password"
                                            name="registerPassword"
                                            id="registerPassword"
                                            placeholder="Create a secure password"
                                        />
                                    </div>
                                    <ErrorMessage name="registerPassword" component="div" className="form-text text-red-500 dark:text-red-500" />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="form-group">
                                    <label htmlFor="confirmRegisterPassword" className="form-text">
                                        Confirm Password
                                    </label>
                                    <div className="form-field-wrapper">
                                        <Icon icon={iconMap.password} />
                                        <Field
                                            data-error={errors.confirmRegisterPassword && touched.confirmRegisterPassword}
                                            type="password"
                                            name="confirmRegisterPassword"
                                            id="confirmRegisterPassword"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="confirmRegisterPassword"
                                        component="div"
                                        className="form-text text-red-500 dark:text-red-500"
                                    />
                                </div>

                                <button className="button mt-5" type="submit">
                                    SIGN UP
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Login Form with Formik */}
                <div
                    className="bg-primary absolute top-0 left-[40%] z-100 flex h-full w-3/5 items-center justify-center p-6 transition-all duration-[1.25s]"
                    ref={loginContainerRef}>
                    <Formik
                        initialValues={{ loginEmail: '', loginPassword: '' }}
                        validationSchema={validateLogin}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 2))
                        }}>
                        {({ errors, touched }) => (
                            <Form className="flex h-full w-full flex-col items-center justify-center">
                                <h2 className="form_title text-primary mb-8 text-3xl font-bold">Sign in to Your Account</h2>
                                <div className="text-primary flex items-center justify-center gap-5">
                                    <GoogleLogin />
                                </div>
                                <span className="text-secondary mt-8 mb-3">Or use your email account to log in</span>

                                {/* Email Field */}
                                <div className="form-group">
                                    <label htmlFor="loginEmail" className="form-text">
                                        Email
                                    </label>
                                    <div className="form-field-wrapper">
                                        <Icon icon={iconMap.email} />
                                        <Field
                                            data-error={errors.loginEmail && touched.loginEmail}
                                            type="email"
                                            name="loginEmail"
                                            id="loginEmail"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    <ErrorMessage name="loginEmail" component="div" className="form-text text-red-500 dark:text-red-500" />
                                </div>

                                {/* Password Field */}
                                <div className="form-group">
                                    <label htmlFor="loginPassword" className="form-text">
                                        Password
                                    </label>
                                    <div className="form-field-wrapper">
                                        <Icon icon={iconMap.password} />
                                        <Field
                                            data-error={errors.loginPassword && touched.loginPassword}
                                            type="password"
                                            name="loginPassword"
                                            id="loginPassword"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    <ErrorMessage name="loginPassword" component="div" className="form-text text-red-500 dark:text-red-500" />
                                </div>

                                <a
                                    className="text-secondary hover:text-highlight hover:border-b-light-highlight dark:hover:border-b-dark-highlight mt-2 mb-8 ml-auto border-b border-solid border-transparent text-right text-sm transition-colors duration-300"
                                    href="#">
                                    Forgot your password?
                                </a>

                                <button className="button mt-5" type="submit">
                                    LOGIN
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Switch Container */}
                <div
                    className="bg-primary shadow-neumorphic-md absolute top-0 left-0 z-200 flex h-full w-2/5 items-center justify-center overflow-hidden p-[50px] transition-all duration-[1.25s]"
                    ref={switchContainerRef}>
                    {/* Background Circles for Animation */}
                    <div className="switch-circles bg-primary shadow-neumorphic-inset-sm absolute bottom-[-60%] left-[-60%] size-[500px] rounded-full transition-all duration-[1.25s]"></div>
                    <div className="switch-circles bg-primary shadow-neumorphic-inset-sm absolute top-[-30%] bottom-[-60%] left-[-60%] size-[350px] rounded-full transition-all duration-[1.25s]"></div>

                    {/* Login Switch */}
                    <div
                        className="absolute flex w-full flex-col items-center justify-center px-13 py-12 transition-all duration-[1.25s]"
                        ref={switchSignInRef}>
                        <h2 className="text-primary mb-8 text-3xl font-bold">Welcome Back!</h2>
                        <p className="text-secondary px-2 text-center text-sm leading-relaxed tracking-wide">
                            To stay connected with us, please log in with your personal details.
                        </p>
                        <button className="button mt-5" onClick={toggleForm}>
                            SIGN IN
                        </button>
                    </div>

                    {/* Register Switch */}
                    <div
                        className="invisible absolute flex w-full flex-col items-center justify-center px-13 py-12 opacity-0 transition-all duration-[1.25s]"
                        ref={switchSignUpRef}>
                        <h2 className="text-primary mb-8 text-3xl font-bold">Hello, Friend!</h2>
                        <p className="text-secondary px-2 text-center text-sm leading-relaxed tracking-wide">
                            Create an account to start your journey with us. Let’s get started by filling out the form.
                        </p>
                        <button className="button mt-5" onClick={toggleForm}>
                            SIGN UP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthComponent
