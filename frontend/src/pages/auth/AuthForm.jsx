import React, { useRef } from 'react'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import IconInput from '../../components/common/form/icon-input'
import { iconMap } from '../../utils/globalConstants'
import GoogleLogin from './GoogleLogin'

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
})

function AuthComponent() {
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
        registerContainer.classList.toggle('z-[200]')
        loginContainer.classList.toggle('left-0')
        loginContainer.classList.toggle('left-[40%]')
    }

    return (
        <div className="grid h-dvh w-dvw place-items-center">
            <div className="bg-primary relative h-[600px] w-[70%] overflow-hidden rounded-xl p-6 shadow-neu-light-lg dark:shadow-neu-dark-lg">
                {/* Register Form with Formik */}
                <div
                    className="bg-primary absolute left-[40%] top-0 z-0 flex h-full w-3/5 items-center justify-center p-6 transition-all duration-[1.25s]"
                    ref={registerContainerRef}>
                    <Formik
                        initialValues={{ name: '', email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 2))
                        }}>
                        {() => (
                            <Form className="flex h-full w-full flex-col items-center justify-center">
                                <h2 className="form_title text-primary mb-8 text-3xl font-bold">Create Your Account</h2>
                                <div className="flex-center text-primary gap-5">
                                    <GoogleLogin />
                                </div>
                                <span className="text-secondary mb-3 mt-8">Or use your email for registration</span>

                                {/* Name Field */}
                                <Field name="name">
                                    {({ field, form }) => (
                                        <IconInput
                                            groupClass="my-3 w-3/4"
                                            type="text"
                                            placeholder="Enter your full name"
                                            icon={iconMap.person}
                                            {...field}
                                            error={form.errors.name && form.touched.name ? form.errors.name : ''}
                                        />
                                    )}
                                </Field>

                                {/* Email Field */}
                                <Field name="email">
                                    {({ field, form }) => (
                                        <IconInput
                                            groupClass="my-3 w-3/4"
                                            type="email"
                                            placeholder="Enter your email address"
                                            {...field}
                                            error={form.errors.email && form.touched.email ? form.errors.email : ''}
                                        />
                                    )}
                                </Field>

                                {/* Password Field */}
                                <Field name="password">
                                    {({ field, form }) => (
                                        <IconInput
                                            groupClass="my-3 w-3/4"
                                            type="password"
                                            placeholder="Create a secure password"
                                            {...field}
                                            error={form.errors.password && form.touched.password ? form.errors.password : ''}
                                        />
                                    )}
                                </Field>

                                <button className="button mt-5" type="submit">
                                    SIGN UP
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Login Form with Formik */}
                <div
                    className="bg-primary absolute left-[40%] top-0 z-[100] flex h-full w-3/5 items-center justify-center p-6 transition-all duration-[1.25s]"
                    ref={loginContainerRef}>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string().email('Invalid email address').required('Required'),
                            password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
                        })}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 2))
                        }}>
                        {() => (
                            <Form className="flex h-full w-full flex-col items-center justify-center">
                                <h2 className="form_title text-primary mb-8 text-3xl font-bold">Sign in to Your Account</h2>
                                <div className="flex-center text-primary gap-5">
                                    <GoogleLogin />
                                </div>
                                <span className="text-secondary mb-3 mt-8">Or use your email account to log in</span>

                                {/* Email Field */}
                                <Field name="email">
                                    {({ field, form }) => (
                                        <IconInput
                                            groupClass="my-3 w-3/4"
                                            type="email"
                                            placeholder="Enter your email address"
                                            {...field}
                                            error={form.errors.email && form.touched.email ? form.errors.email : ''}
                                        />
                                    )}
                                </Field>

                                {/* Password Field */}
                                <Field name="password">
                                    {({ field, form }) => (
                                        <IconInput
                                            groupClass="my-3 w-3/4"
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                            error={form.errors.password && form.touched.password ? form.errors.password : ''}
                                        />
                                    )}
                                </Field>

                                <a
                                    className="text-secondary hover:text-highlight mb-8 ml-auto mt-2 border-b border-solid border-transparent text-right text-sm transition-colors duration-300 hover:border-b-light-highlight-primary dark:hover:border-b-dark-highlight-primary"
                                    href="#">
                                    Forgot your password?
                                </a>

                                <button className="button mt-5" type="submit">
                                    SIGN IN
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Switch Container */}
                <div
                    className="bg-primary absolute left-0 top-0 z-[200] flex h-full w-2/5 items-center justify-center overflow-hidden p-[50px] shadow-neu-light-md transition-all duration-[1.25s] dark:shadow-neu-dark-md"
                    ref={switchContainerRef}>
                    {/* Background Circles for Animation */}
                    <div className="switch-circles bg-primary absolute bottom-[-60%] left-[-60%] size-[500px] rounded-full shadow-neu-inset-light-sm transition-all duration-[1.25s] dark:shadow-neu-inset-dark-sm"></div>
                    <div className="switch-circles bg-primary absolute bottom-[-60%] left-[-60%] top-[-30%] size-[350px] rounded-full shadow-neu-inset-light-sm transition-all duration-[1.25s] dark:shadow-neu-inset-dark-sm"></div>

                    {/* Login Switch */}
                    <div
                        className="px-13 absolute flex w-full flex-col items-center justify-center py-12 transition-all duration-[1.25s]"
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
                        className="px-13 invisible absolute flex w-full flex-col items-center justify-center py-12 opacity-0 transition-all duration-[1.25s]"
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
