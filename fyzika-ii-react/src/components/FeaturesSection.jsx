import { Link } from 'react-router-dom'
import { courseGroups, getGroupSections } from '../data/courseCatalog'

const FeaturesSection = () => (
  <>
    <section className="benefits-strip">
      <article><span><i className="fas fa-gauge-high" /></span><div><strong>Rýchle štúdium</strong><p>Obsah sa načítava bez čakania</p></div></article>
      <article><span><i className="fas fa-brain" /></span><div><strong>Aktívne učenie</strong><p>Teória, príklady a overenie vedomostí</p></div></article>
      <article><span><i className="fas fa-chart-simple" /></span><div><strong>Jasný pokrok</strong><p>Výsledky zostanú vo vašom zariadení</p></div></article>
    </section>
    <section className="course-map-section" id="course-map">
      <div className="section-heading">
        <span className="eyebrow">Mapa kurzu</span>
        <h2>Od elektrického náboja<br />až po kvantový svet</h2>
        <p>Vyberte si oblasť a pokračujte vlastným tempom.</p>
      </div>
      <div className="course-map-grid">
        {courseGroups.map((group, index) => {
          const sections = getGroupSections(group.id)
          const firstReady = sections.find((section) => section.ready)
          const ready = sections.filter((section) => section.ready).length
          return (
            <Link key={group.id} to={firstReady ? `/${firstReady.id}` : '/'} className={`course-map-card accent-${group.accent} ${!firstReady ? 'is-upcoming' : ''}`}>
              <span className="course-card-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="group-icon"><i className={`fas ${group.icon}`} /></span>
              <h3>{group.title}</h3>
              <p>{ready ? `${ready} pripravených kapitol` : 'Obsah sa pripravuje'}</p>
              <div><span>{ready}/{sections.length}</span><i className="fas fa-arrow-right" /></div>
            </Link>
          )
        })}
      </div>
    </section>
  </>
)

export default FeaturesSection
