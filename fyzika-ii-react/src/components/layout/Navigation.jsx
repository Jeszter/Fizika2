import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const Navigation = ({ sidebarOpen, toggleSidebar }) => {
    const { isDark, toggleTheme } = useTheme()
    const location = useLocation()
    const [isContentPage, setIsContentPage] = useState(false)

    useEffect(() => {
        setIsContentPage(location.pathname === '/content')
    }, [location])

    return (
        <nav className="fixed top-0 left-0 w-full py-3 px-4 md:px-6 z-50 flex justify-between items-center bg-white dark:bg-gray-900 border-b border-border dark:border-gray-800 shadow-md">
            <div className="flex items-center gap-4">
                {isContentPage && (
                    <button
                        onClick={toggleSidebar}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-primary-blue-bg dark:hover:bg-gray-700 transition-all duration-300 group"
                        aria-label={sidebarOpen ? "Zavrieť menu" : "Otvoriť menu"}
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-text-dark dark:text-gray-300 group-hover:text-primary-blue dark:group-hover:text-blue-400`}></i>
                    </button>
                )}

                <Link to="/" className="logo flex items-center gap-3 no-underline group">
                    <div className="logo-icon w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-lg flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 group-hover:scale-105">
                        F
                    </div>
                    <span className="text-xl font-bold text-text-dark dark:text-white">Fyzika II</span>
                </Link>


            </div>

            <div className="flex items-center gap-3">


                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm hover:scale-105"
                    aria-label="Prepnúť tému"
                >
                    <i className={`fas ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-text-dark'}`}></i>
                </button>
            </div>
        </nav>
    )
}

export default Navigation