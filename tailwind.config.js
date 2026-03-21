/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                fm: {
                    'bg-base':        '#EFF5F0',
                    'bg-surface':     '#E2EEE4',
                    'bg-elevated':    '#CDE3CF',
                    'bg-subtle':      '#B8D9BC',
                    'accent':         '#22623A',
                    'accent-hover':   '#1A4D2D',
                    'accent-deep':    '#0F3D1E',
                    'accent-muted':   '#C8E4D4',
                    'text-primary':   '#1A3020',
                    'text-secondary': '#5A7A62',
                    'text-muted':     '#8AA88E',
                    'border':         '#C8DEC9',
                    'border-strong':  '#A8C8AB',
                }
            },
            fontFamily: {
                syne: ['Syne', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'gradient-mesh': 'gradientMesh 15s ease infinite',
                'pulse-border': 'pulseBorder 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'slide-indicator': 'slideIndicator 0.3s ease-out',
                'grain': 'grain 0.5s steps(10) infinite',
            },
            keyframes: {
                gradientMesh: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                pulseBorder: {
                    '0%, 100%': { borderColor: 'rgba(74, 222, 128, 0.3)' },
                    '50%': { borderColor: 'rgba(74, 222, 128, 0.8)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                slideIndicator: {
                    '0%': { transform: 'scaleX(0)' },
                    '100%': { transform: 'scaleX(1)' },
                },
                grain: {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '10%': { transform: 'translate(-5%, -10%)' },
                    '20%': { transform: 'translate(-15%, 5%)' },
                    '30%': { transform: 'translate(7%, -25%)' },
                    '40%': { transform: 'translate(-5%, 25%)' },
                    '50%': { transform: 'translate(-15%, 10%)' },
                    '60%': { transform: 'translate(15%, 0%)' },
                    '70%': { transform: 'translate(0%, 15%)' },
                    '80%': { transform: 'translate(3%, 35%)' },
                    '90%': { transform: 'translate(-10%, 10%)' },
                }
            },
            backgroundSize: {
                '300%': '300% 300%',
            }
        },
    },
    plugins: [],
};
