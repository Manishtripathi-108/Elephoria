/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                'anti-rotate': 'anti-rotate 5s linear infinite',
                'close-n-zero': 'close-n-zero 0.2s forwards',
                pulsate: 'pulsate 1s infinite',
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
                shimmerRay: 'shimmerRay 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
            keyframes: {
                shimmerRay: {
                    '0%': { left: '-30%', opacity: '0', width: '0' },
                    '100%': { left: '100%', opacity: '1', width: '35%' },
                },
                'anti-rotate': {
                    '0%': { transform: 'rotate(360deg)' },
                    '100%': { transform: 'rotate(0)' },
                },
                'close-n-zero': {
                    from: { 'stroke-dashoffset': '50' },
                    to: { 'stroke-dashoffset': '0' },
                },
                pulsate: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1, 1)', transformOrigin: '50% 50%' },
                    '50%': { opacity: '1', transform: 'scale(0.9, 0.9)', transformOrigin: '50% 50%' },
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
                'wipe-in-up': {
                    '0%': { clipPath: 'inset(100% 0 0 0)' },
                    '100%': { clipPath: 'inset(0 0 0 0)' },
                },
                'wipe-out-down': {
                    '0%': { clipPath: 'inset(0 0 0 0)', display: 'block' },
                    '100%': { clipPath: 'inset(0 0 100% 0)', display: 'none' },
                },
                'wipe-out-up': {
                    '0%': { clipPath: 'inset(0 0 0 0)' },
                    '100%': { clipPath: 'inset(100% 0 0 0)' },
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
                shimmerRayAccent: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,99,71,1) 100%)',
                shimmerRayHighlight: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(30,144,255,1) 100%)',
            },
            colors: {
                // Light Mode Colors
                'light-primary': '#FFB6B9',
                'light-secondary': '#FFE6E6',
                'light-text-primary': '#333333',
                'light-text-secondary': '#666666',
                'light-accent-primary': '#dc2626',
                'light-highlight-primary': '#4169E1',

                // Dark Mode Colors
                'dark-primary': '#1f2937',
                'dark-secondary': '#334155',
                'dark-text-primary': '#ffffff',
                'dark-text-secondary': '#cbd5e1',
                'dark-accent-primary': '#FF6347',
                'dark-highlight-primary': '#1E90FF',
            },
            boxShadow: {
                // Light Mode Shadows
                'neu-light-xs': '3px 3px 5px #db9d9f, -3px -3px 5px #ffcfd3',
                'neu-light-sm': '5px 5px 10px #db9d9f, -5px -5px 10px #ffcfd3',
                'neu-light-md': '6px 6px 12px #db9d9f, -6px -6px 12px #ffcfd3',
                'neu-light-lg': '10px 10px 20px #db9d9f, -10px -10px 20px #ffcfd3',
                'neu-light-xl': '20px 20px 40px #db9d9f, -20px -20px 40px #ffcfd3',

                // Light Mode Inset Shadows
                'neu-inset-light-xs': 'inset 3px 3px 7px #bd8789, inset -3px -3px 7px #ffd1d8',
                'neu-inset-light-sm': 'inset 5px 5px 10px #bd8789, inset -5px -5px 10px #ffd1d8',
                'neu-inset-light-md': 'inset 6px 6px 12px #bd8789, inset -6px -6px 12px #ffd1d8',
                'neu-inset-light-lg': 'inset 10px 10px 20px #bd8789, inset -10px -10px 20px #ffd1d8',
                'neu-inset-light-xl': 'inset 20px 20px 40px #bd8789, inset -20px -20px 40px #ffd1d8',

                // Light Mode Secondary Shadows
                'neu-light-secondary-xs': '3px 3px 5px #29428e, -3px -3px 5px #5990ff',
                'neu-inset-light-secondary-xs': 'inset 3px 3px 5px #29428e, inset -3px -3px 5px #5990ff',

                // Dark Mode Shadows
                'neu-dark-xs': '3px 3px 5px #0c1016, -3px -3px 5px #324258',
                'neu-dark-sm': '5px 5px 10px #0c1016, -5px -5px 10px #324258',
                'neu-dark-md': '6px 6px 12px #0c1016, -6px -6px 12px #324258',
                'neu-dark-lg': '10px 10px 20px #0c1016, -10px -10px 20px #324258',
                'neu-dark-xl': '20px 20px 40px #0c1016, -20px -20px 40px #324258;',

                'neu-dark-secondary-xs': '3px 3px 5px #135ba1, -3px -3px 5px #29c5ff',
                'neu-inset-dark-secondary-xs': 'inset 3px 3px 5px #135ba1, inset -3px -3px 5px #29c5ff',

                // Dark Mode Inset Shadows
                'neu-inset-dark-xs': 'inset 3px 3px 5px #0c1016, inset -3px -3px 5px #324258',
                'neu-inset-dark-sm': 'inset 5px 5px 10px #0c1016, inset -5px -5px 10px #324258',
                'neu-inset-dark-md': 'inset 6px 6px 12px #0c1016, inset -6px -6px 12px #324258',
                'neu-inset-dark-lg': 'inset 10px 10px 20px #0c1016, inset -10px -10px 20px #324258',
                'neu-inset-dark-xl': 'inset 20px 20px 40px #0c1016, inset -20px -20px 40px #324258',
            },
            fontFamily: {
                'indie-flower': ['"Indie Flower"', 'cursive', 'serif'],
                aladin: ['"Aladin"', 'system-ui'],
            },
        },
    },

    darkMode: 'class',
    plugins: [],
}
