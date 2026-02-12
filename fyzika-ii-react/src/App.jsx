import React, { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import ContentPage from './pages/ContentPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navigation from './components/layout/Navigation'
import MathJaxProvider from './components/MathJaxProvider'

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const checkWidth = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(true)
            } else {
                setSidebarOpen(false)
            }
        }

        checkWidth()
        window.addEventListener('resize', checkWidth)

        return () => window.removeEventListener('resize', checkWidth)
    }, [])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <ThemeProvider>
            <MathJaxProvider>
                {/* ✨ PRIDANÉ basename PRE GITHUB PAGES ✨ */}
                <Router basename="/Fizika2">
                    <div className="min-h-screen bg-background dark:bg-gray-900">
                        <Navigation
                            sidebarOpen={sidebarOpen}
                            toggleSidebar={toggleSidebar}
                        />

                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/:sectionId" element={
                                <ContentPage
                                    sidebarOpen={sidebarOpen}
                                    setSidebarOpen={setSidebarOpen}
                                />
                            } />
                            <Route path="/test-:testId" element={
                                <ContentPage
                                    sidebarOpen={sidebarOpen}
                                    setSidebarOpen={setSidebarOpen}
                                />
                            } />
                        </Routes>
                    </div>
                </Router>
            </MathJaxProvider>
        </ThemeProvider>
    )
}

export default App