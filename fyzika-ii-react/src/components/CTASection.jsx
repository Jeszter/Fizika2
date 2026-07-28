import { Link } from 'react-router-dom'

const CTASection = () => (
  <section className="home-cta">
    <div>
      <span className="eyebrow">Pripravení?</span>
      <h2>Prvý krok je len jedno kliknutie.</h2>
      <p>Začnite Coulombovým zákonom a postupne si vybudujte pevné základy elektromagnetizmu.</p>
    </div>
    <Link to="/coulombov-zakon" className="button button-light button-large">Otvoriť prvú kapitolu <i className="fas fa-arrow-right" /></Link>
  </section>
)

export default CTASection
