import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="site-footer">
    <div className="site-logo"><span><i className="fas fa-atom" /></span><div><strong>Fyzika II</strong><small>interaktívny kurz</small></div></div>
    <p>Vzdelávanie, ktoré spája presnosť vedy s ľahkosťou moderného webu.</p>
    <div><Link to="/coulombov-zakon">Kurz</Link><Link to="/teacher">Pre učiteľa</Link><span>© 2026 Fyzika II</span></div>
  </footer>
)

export default Footer
