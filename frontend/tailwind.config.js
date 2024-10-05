/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                'anti-rotate': 'anti-rotate 5s linear infinite',
                'close-n-zero': 'close-n-zero 0.2s forwards',
                pulse: 'pulse 1s infinite',
                'puff-in': 'puff-in 0.3s forwards',
                'scale-up': 'scale-up 0.3s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards',
                'slide-left-return': 'slide-left-return 0.3s forwards',
                'slide-left': 'slide-left 0.3s forwards',
            },
            keyframes: {
                'anti-rotate': {
                    '0%': { transform: 'rotate(360deg)' },
                    '100%': { transform: 'rotate(0)' },
                },
                'close-n-zero': {
                    from: { 'stroke-dashoffset': '50' },
                    to: { 'stroke-dashoffset': '0' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1, 1)', transformOrigin: '50% 50%' },
                    '50%': { opacity: '1', transform: 'scale(0.9, 0.9)', transformOrigin: '50% 50%' },
                },
                'puff-in': {
                    '0%': { opacity: 0, transformOrigin: '50% 50%', transform: 'scale(2, 2)', filter: 'blur(2px)', visibility: 'hidden' },
                    '100%': { opacity: 1, transformOrigin: '50% 50%', transform: 'scale(1, 1)', filter: 'blur(0px)', visibility: 'visible' },
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
                'neu-dark-xs': '3px 3px 5px #11171e, -3px -3px 5px #2d3b50',
                'neu-dark-sm': '5px 5px 10px #11171e, -5px -5px 10px #2d3b50',
                'neu-dark-md': '6px 6px 12px #11171e, -6px -6px 12px #2d3b50',
                'neu-dark-lg': '10px 10px 20px #11171e, -10px -10px 20px #2d3b50',
                'neu-dark-xl': '20px 20px 40px #11171e, -20px -20px 40px #2d3b50;',

                'neu-dark-secondary-xs': '3px 3px 5px #135ba1, -3px -3px 5px #29c5ff',
                'neu-inset-dark-secondary-xs': 'inset 3px 3px 5px #135ba1, inset -3px -3px 5px #29c5ff',

                // Dark Mode Inset Shadows
                'neu-inset-dark-xs': 'inset 3px 3px 7px #11171e, inset -3px -3px 7px #2d3b50',
                'neu-inset-dark-sm': 'inset 5px 5px 10px #11171e, inset -5px -5px 10px #2d3b50',
                'neu-inset-dark-md': 'inset 6px 6px 12px #11171e, inset -6px -6px 12px #2d3b50',
                'neu-inset-dark-lg': 'inset 10px 10px 20px #11171e, inset -10px -10px 20px #2d3b50',
                'neu-inset-dark-xl': 'inset 20px 20px 40px #171614, inset -20px -20px 40px #2d3b50',
            },
            fontFamily: {
                'indie-flower': ['"Indie Flower"', 'cursive', 'serif'],
                aladin: ['"Aladin"', 'system-ui'],
            },
        },
    },
    plugins: [],
}
