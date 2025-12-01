
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    blue: '#2563eb',
                    'blue-light': '#3b82f6',
                    'blue-dark': '#1d4ed8',
                    'blue-bg': '#f0f9ff',
                    teal: '#0d9488',
                    green: '#10b981',
                    amber: '#f59e0b',
                    red: '#ef4444',
                },
                text: {
                    dark: '#1e293b',
                    light: '#64748b',
                },
                background: '#ffffff',
                surface: '#f8fafc',
                border: '#e2e8f0',
            },
            animation: {
                'float': 'float 20s infinite linear',
                'float-slow': 'float 30s infinite linear',
                'fade-in': 'fadeIn 0.6s ease forwards',
                'slide-up': 'slideUp 0.8s ease forwards',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'scale-in': 'scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'text-reveal': 'textReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': {
                        transform: 'translate(0, 0) rotate(0deg)'
                    },
                    '25%': {
                        transform: 'translate(100px, 50px) rotate(90deg)'
                    },
                    '50%': {
                        transform: 'translate(50px, 100px) rotate(180deg)'
                    },
                    '75%': {
                        transform: 'translate(-50px, 75px) rotate(270deg)'
                    },
                },
                fadeIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                },
                slideUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                },
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                scaleIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.8)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1)'
                    }
                },
                textReveal: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
            },
            borderRadius: {
                'custom': '20px',
                'custom-lg': '28px',
                'custom-xl': '36px',
            },
            boxShadow: {
                'custom': '0 8px 30px rgba(37, 99, 235, 0.15)',
                'custom-lg': '0 20px 60px rgba(37, 99, 235, 0.25)',
                'custom-hover': '0 25px 80px rgba(37, 99, 235, 0.35)',
                'dark-custom': '0 8px 30px rgba(0, 0, 0, 0.3)',
                'dark-custom-lg': '0 20px 60px rgba(0, 0, 0, 0.4)',
                'dark-custom-hover': '0 25px 80px rgba(0, 0, 0, 0.5)',
            },
            transitionDuration: {
                '600': '600ms',
            },
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '20px',
            },
        },
    },
    plugins: [],
}