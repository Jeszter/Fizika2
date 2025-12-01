import React, { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import ContentPage from './pages/ContentPage'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navigation from './components/layout/Navigation'

const AnimatedRoutes = () => {
    const location = useLocation()
    const [displayLocation, setDisplayLocation] = useState(location)
    const [transitionStage, setTransitionStage] = useState('fadeIn')

    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage('fadeOut')

            // Даем время для анимации исчезновения
            setTimeout(() => {
                setDisplayLocation(location)
                // Небольшая задержка перед появлением новой страницы
                setTimeout(() => {
                    setTransitionStage('fadeIn')
                }, 50)
            }, 300)
        }
    }, [location, displayLocation])

    return (
        <div
            className={`page-content ${transitionStage}`}
            style={{
                opacity: transitionStage === 'fadeOut' ? 0 : 1,
                transform: transitionStage === 'fadeOut' ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 0.3s ease-in-out',
                width: '100%',
                height: '100%'
            }}
        >
            <Routes location={displayLocation}>
                <Route path="/" element={<HomePage />} />
                <Route path="/content" element={<ContentPage />} />
            </Routes>
        </div>
    )
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
                    <Navigation />
                    <AnimatedRoutes />
                </div>
            </Router>
        </ThemeProvider>
    )
}

export default App