import { Link } from 'react-router-dom'
import { courseGroups, readySections } from '../data/courseCatalog'

const HeroSection = () => (
  <section className="hero-section">
    <div className="hero-glow hero-glow-one" />
    <div className="hero-glow hero-glow-two" />
    <div className="hero-grid" />
    <div className="hero-copy">
      <div className="hero-badge"><span /><i className="fas fa-sparkles" /> Fyzika, ktorá dáva zmysel</div>
      <h1>Pochopte fyziku.<br /><span>Nie iba vzorce.</span></h1>
      <p>Prehľadné vysvetlenia, názorné príklady a okamžitá spätná väzba v jednom modernom kurze Fyziky II.</p>
      <div className="hero-actions">
        <Link className="button button-primary button-large" to="/coulombov-zakon">Začať študovať <i className="fas fa-arrow-right" /></Link>
        <a className="button button-ghost button-large" href="#course-map"><i className="fas fa-play" /> Preskúmať kurz</a>
      </div>
      <div className="hero-trust">
        <span><i className="fas fa-circle-check" /> Bez registrácie</span>
        <span><i className="fas fa-chart-line" /> Vlastný progres</span>
        <span><i className="fas fa-moon" /> Tmavý režim</span>
      </div>
    </div>
    <div className="hero-visual" aria-label="Ukážka študijného prostredia">
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />
      <div className="formula-chip formula-chip-one">E = mc²</div>
      <div className="formula-chip formula-chip-two">F = qE</div>
      <div className="formula-chip formula-chip-three">∇ · E = ρ/ε₀</div>
      <div className="hero-dashboard">
        <div className="dashboard-head"><span><i className="fas fa-atom" /></span><div><small>Aktuálna téma</small><strong>Elektrické pole</strong></div><i className="fas fa-ellipsis" /></div>
        <div className="dashboard-illustration">
          <span className="charge positive">+</span><div className="field-lines"><i /><i /><i /><i /><i /></div><span className="charge negative">−</span>
        </div>
        <div className="dashboard-progress"><div><span>Pokrok kapitoly</span><strong>72 %</strong></div><p><span /></p></div>
        <div className="dashboard-cards"><span><i className="fas fa-book-open" /><b>{readySections.length}</b><small>kapitol</small></span><span><i className="fas fa-layer-group" /><b>{courseGroups.length}</b><small>okruhov</small></span><span><i className="fas fa-bolt" /><b>2</b><small>testy</small></span></div>
      </div>
    </div>
  </section>
)

export default HeroSection
