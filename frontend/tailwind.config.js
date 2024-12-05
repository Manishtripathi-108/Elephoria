/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                'close-n-zero': 'close-n-zero 0.2s forwards',
                'pulse-slow': 'pulse-slow 1s ease-in-out infinite alternate',
                'puff-in': 'puff-in 0.3s forwards',
                'puff-out': 'puff-out 0.3s forwards',
                'scale-up': 'scale-up 0.3s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards',
                'slide-left-return': 'slide-left-return 0.3s forwards',
                'slide-left': 'slide-left 0.3s forwards',
                'wipe-in-down': 'wipe-in-down 0.5s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards',
                'wipe-in-up': 'wipe-in-up 0.5s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards',
                'wipe-out-down': 'wipe-out-down 0.5s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards',
                'wipe-out-up': 'wipe-out-up 0.5s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards',
                unfoldIn: 'unfoldIn 0.5s forwards',
                unfoldOut: 'unfoldOut 0.5s 0.5s forwards',
                zoomIn: 'zoomIn 0.5s 0.5s forwards',
                zoomOut: 'zoomOut 0.5s forwards',
                'shimmer-ray': 'shimmer-ray 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                'push-release-from': 'push-release-from 0.3s forwards',
                'l-zoom-out': 'l-zoom-in 0.3s forwards',
                blob: 'blob 10s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                'loader-shadow': 'loader-shadow 0.5s var(--animation-delay, 0s) alternate infinite ease-in',
                'loader-circle': 'loader-circle 0.5s var(--animation-delay, 0s) alternate infinite ease-in',
            },
            keyframes: {
                'shimmer-ray': {
                    '0%': { left: '-30%', opacity: '0', width: '0' },
                    '100%': { left: '100%', opacity: '1', width: '35%' },
                },
                'close-n-zero': {
                    from: { 'stroke-dashoffset': '50' },
                    to: { 'stroke-dashoffset': '0' },
                },
                'pulse-slow': {
                    '0%': { opacity: '1', transform: 'scale(1.2)' },
                    to: { opacity: '.5', transform: 'scale(0.8)' },
                },
                'puff-in': {
                    '0%': { opacity: 0, transformOrigin: '50% 50%', transform: 'scale(2, 2)', filter: 'blur(2px)', visibility: 'hidden' },
                    '100%': { opacity: 1, transformOrigin: '50% 50%', transform: 'scale(1, 1)', filter: 'blur(0px)', visibility: 'visible' },
                },
                'puff-out': {
                    '0%': {
                        opacity: '1',
                        transform: 'scale(1)',
                        transformOrigin: '50% 50%',
                        filter: 'blur(0px)',
                    },
                    '100%': {
                        opacity: '0',
                        transform: 'scale(2)',
                        transformOrigin: '50% 50%',
                        filter: 'blur(2px)',
                    },
                },
                'scale-up': {
                    '0%': { transform: 'scale(0)', opacity: '0', visibility: 'hidden' },
                    '100%': { transform: 'scale(1)', opacity: '1', visibility: 'visible' },
                },
                'slide-left-return': {
                    '0%': { transformOrigin: '0 0', transform: 'translate(-100%)' },
                    '100%': { transformOrigin: '0 0', transform: 'translate(0)' },
                },
                'slide-left': {
                    '0%': { transformOrigin: '0 0', transform: 'translate(0)' },
                    '100%': { transformOrigin: '0 0', transform: 'translate(-100%)' },
                },
                'wipe-in-down': {
                    '0%': { clipPath: 'inset(0 0 100% 0)', display: 'none' },
                    '100%': { clipPath: 'inset(0 0 0 0)', display: 'block' },
                },
                'wipe-out-down': {
                    '0%': { clipPath: 'inset(0 0 0 0)', display: 'block' },
                    '100%': { clipPath: 'inset(0 0 100% 0)', display: 'none' },
                },
                unfoldIn: {
                    '0%': { transform: 'scaleY(0.005) scaleX(0)' },
                    '50%': { transform: 'scaleY(0.005) scaleX(1)' },
                    '100%': { transform: 'scaleY(1) scaleX(1)' },
                },
                unfoldOut: {
                    '0%': { transform: 'scaleY(1) scaleX(1)' },
                    '50%': { transform: 'scaleY(0.005) scaleX(1)' },
                    '100%': { transform: 'scaleY(0.005) scaleX(0)' },
                },
                zoomIn: {
                    '0%': { transform: 'scale(0)' },
                    '100%': { transform: 'scale(1)' },
                },
                zoomOut: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(0)' },
                },
                'push-release-from': {
                    from: { transform: 'scale(3, 3)', opacity: '0' },
                    '30%': { transform: 'scale(.5, .5)' },
                },
                'l-zoom-in': {
                    from: { transform: 'scale(10)', opacity: '0' },
                },

                blob: {
                    '0%': {
                        borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
                    },
                    '25%': {
                        borderRadius: '60% 40% 45% 55% / 55% 60% 40% 45%',
                    },
                    '50%': {
                        borderRadius: '50% 50% 60% 40% / 45% 55% 50% 60%',
                    },
                    '75%': {
                        borderRadius: '45% 55% 50% 50% / 60% 40% 55% 45%',
                    },
                    '100%': {
                        borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
                    },
                },

                'loader-shadow': {
                    '0%': { transform: 'scaleX(.2)', opacity: '.4' },
                    '80%': { transform: 'scaleX(1)', opacity: '.7' },
                    '100%': { transform: 'scaleX(1.5)' },
                },

                'loader-circle': {
                    '0%': { bottom: 'calc(var(--loader-base-height) + var(--loader-jump-height))' },
                    '80%': { height: 'var(--loader-circle-size)', borderRadius: '50%', transform: 'scaleX(1)' },
                    '100%': { bottom: 'var(--loader-base-height)', height: '5px', borderRadius: '50px 50px 25px 25px', transform: 'scaleX(1.7)' },
                },
            },
            backgroundImage: {
                'primary-gradient':
                    'linear-gradient(to left, rgba(31,41,55,1) 0%, rgba(51,65,85,1) 10%, rgba(51,65,85,1) 90%, rgba(31,41,55,1) 100%)',
                'secondary-gradient':
                    'linear-gradient(to left, rgba(51,65,85,1) 0%, rgba(67,76,94,1) 10%, rgba(67,76,94,1) 90%, rgba(51,65,85,1) 100%)',
                'yellow-gradient': 'linear-gradient(to left, #eab308 0%, #facc15 10%, #facc15 90%, #eab308 100%)',
                'green-gradient': 'linear-gradient(to left, #22c55e 0%, #4ade80 10%, #4ade80 90%, #22c55e 100%)',
                'blue-gradient': 'linear-gradient(to left, #3b82f6 0%, #60a5fa 10%, #60a5fa 90%, #3b82f6 100%)',
                'red-gradient':
                    'linear-gradient(to left, rgba(220,38,38,1) 0%, rgba(239,68,68,1) 10%, rgba(239,68,68,1) 90%, rgba(220,38,38,1) 100%)',
                'shimmer-ray-accent': 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,99,71,1) 100%)',
                'shimmer-ray-highlight': 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(30,144,255,1) 100%)',
            },
            colors: {
                // Light Mode Colors
                'light-primary': '#FFB6B9',
                'light-secondary': '#FFE6E6',
                'light-text-primary': '#333333',
                'light-text-secondary': '#666666',
                'light-accent': '#dc2626',
                'light-highlight': '#4169E1',

                // Dark Mode Colors
                'dark-primary': '#1f2937',
                'dark-secondary': '#334155',
                'dark-text-primary': '#ffffff',
                'dark-text-secondary': '#cbd5e1',
                'dark-accent': '#FF6347',
                'dark-highlight': '#1E90FF',
            },
            boxShadow: {
                'neumorphic-xs': '3px 3px 5px var(--lower-shadow), -3px -3px 5px var(--upper-shadow)',
                'neumorphic-sm': '5px 5px 10px var(--lower-shadow), -5px -5px 10px var(--upper-shadow)',
                'neumorphic-md': '6px 6px 12px var(--lower-shadow), -6px -6px 12px var(--upper-shadow)',
                'neumorphic-lg': '10px 10px 20px var(--lower-shadow), -10px -10px 20px var(--upper-shadow)',
                'neumorphic-xl': '20px 20px 40px var(--lower-shadow), -20px -20px 40px var(--upper-shadow)',

                'neumorphic-inset-xs': 'inset 3px 3px 7px var(--lower-shadow), inset -3px -3px 7px var(--upper-shadow)',
                'neumorphic-inset-sm': 'inset 5px 5px 10px var(--lower-shadow), inset -5px -5px 10px var(--upper-shadow)',
                'neumorphic-inset-md': 'inset 6px 6px 12px var(--lower-shadow), inset -6px -6px 12px var(--upper-shadow)',
                'neumorphic-inset-lg': 'inset 10px 10px 20px var(--lower-shadow), inset -10px -10px 20px var(--upper-shadow)',
                'neumorphic-inset-xl': 'inset 20px 20px 40px var(--lower-shadow), inset -20px -20px 40px var(--upper-shadow)',

                'neu-dark-secondary-xs': '3px 3px 5px #135ba1, -3px -3px 5px #29c5ff',
                'neu-inset-dark-secondary-xs': 'inset 3px 3px 5px #135ba1, inset -3px -3px 5px #29c5ff',
            },
            fontFamily: {
                'indie-flower': ['"Indie Flower"', 'cursive', 'serif'],
                aladin: ['"Aladin"', 'system-ui'],
                julee: ['"Julee"', 'cursive'],
            },
        },
    },

    darkMode: 'class',
    plugins: [],
}
