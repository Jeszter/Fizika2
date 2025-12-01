import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const Header = () => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <nav className="nav">
            <Link to="/" className="logo">
                <div className="logo-icon">F</div>
                <span>Fyzika II</span>
            </Link>

            <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Prepnúť tému"
            >
                <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
        </nav>
    )
}

export default Header