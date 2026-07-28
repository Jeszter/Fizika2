import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navigation from './components/layout/Navigation'
import MathJaxProvider from './components/MathJaxProvider'

const HomePage = lazy(() => import('./pages/HomePage'))
const ContentPage = lazy(() => import('./pages/ContentPage'))
const TeacherPanel = lazy(() => import('./pages/TeacherPanel'))

const PageLoader = () => (
  <div className="page-loader" role="status">
    <span className="loader-orbit"><i className="fas fa-atom" /></span>
    <p>Načítavam Fyziku II…</p>
  </div>
)

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1024)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ThemeProvider>
      <BrowserRouter basename="/Fizika2">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Navigation sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((open) => !open)} />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/:sectionId" element={<MathJaxProvider><ContentPage sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></MathJaxProvider>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="/teacher" element={<TeacherPanel />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
