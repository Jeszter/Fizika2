import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const Navigation = () => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <nav className="fixed top-0 left-0 w-full py-4 px-8 z-50 flex justify-between items-center bg-surface/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-border dark:border-gray-700 shadow-custom dark:shadow-dark-custom">
            <Link to="/" className="logo flex items-center gap-3 no-underline">
                <div className="logo-icon w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-custom">
                    F
                </div>
                <span className="text-2xl font-bold text-text-dark dark:text-white">Fyzika II</span>
            </Link>

            <button
                onClick={toggleTheme}
                className="w-12 h-12 bg-surface dark:bg-gray-800 border border-border dark:border-gray-700 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-custom hover:scale-110 hover:shadow-custom-hover"
                aria-label="Prepnúť tému"
            >
                <i className={`fas ${isDark ? 'fa-sun text-yellow-400 text-lg' : 'fa-moon text-text-dark text-lg'}`}></i>
            </button>
        </nav>
    )
}

export default Navigation