import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const Navigation = ({ sidebarOpen, toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const isContentPage = location.pathname !== '/'

  return (
    <>
      <header className="site-header">
        <div className="header-left">
          {isContentPage && (
            <button onClick={toggleSidebar} className="header-icon-button" aria-label={sidebarOpen ? 'Zavrieť obsah' : 'Otvoriť obsah'}>
              <i className={`fas ${sidebarOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          )}
          <Link to="/" className="site-logo" aria-label="Fyzika II – domov">
            <span><i className="fas fa-atom" /></span>
            <div><strong>Fyzika II</strong><small>interaktívny kurz</small></div>
          </Link>
        </div>
        <nav className="header-actions" aria-label="Hlavná navigácia">
          <Link className="teacher-link" to="/teacher"><i className="fas fa-chalkboard-user" /><span>Pre učiteľa</span></Link>
          <button onClick={toggleTheme} className="header-icon-button" aria-label="Prepnúť farebnú tému">
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} />
          </button>
        </nav>
      </header>
      <Outlet />
    </>
  )
}

export default Navigation
