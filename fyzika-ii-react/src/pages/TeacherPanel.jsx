import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { courseGroups, courseSections, getGroupSections } from '../data/courseCatalog'
import { downloadJson, resultTopicId, storage } from '../utils/storage'

const tabs = [
  { id: 'overview', label: 'Prehľad', icon: 'fa-chart-pie' },
  { id: 'students', label: 'Študenti', icon: 'fa-user-group' },
  { id: 'tests', label: 'Testy', icon: 'fa-list-check' },
  { id: 'assignments', label: 'Zadania', icon: 'fa-calendar-check' },
  { id: 'content', label: 'Obsah', icon: 'fa-layer-group' },
  { id: 'settings', label: 'Nastavenia', icon: 'fa-sliders' },
]

const uid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
const average = (values) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0
const today = () => new Date().toISOString().slice(0, 10)

const EmptyState = ({ icon, title, text, action }) => (
  <div className="teacher-empty">
    <i className={`fas ${icon}`} />
    <h3>{title}</h3>
    <p>{text}</p>
    {action}
  </div>
)

const Metric = ({ icon, label, value, note, tone = 'blue' }) => (
  <article className={`teacher-metric tone-${tone}`}>
    <span className="teacher-metric-icon"><i className={`fas ${icon}`} /></span>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  </article>
)

const Overview = ({ results, students, assignments, tests }) => {
  const percentages = results.map((result) => Number(result.percentage) || 0)
  const passed = percentages.filter((value) => value >= 51).length
  const recent = [...results].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 6)
  const activity = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - offset))
    const key = date.toISOString().slice(0, 10)
    return {
      label: date.toLocaleDateString('sk-SK', { weekday: 'short' }),
      count: results.filter((result) => (result.date || '').slice(0, 10) === key).length,
    }
  })
  const maxActivity = Math.max(1, ...activity.map((day) => day.count))

  return (
    <div className="teacher-stack">
      <section className="teacher-metrics-grid">
        <Metric icon="fa-user-graduate" label="Študenti" value={students.length || '—'} note="v lokálnom zozname" tone="blue" />
        <Metric icon="fa-chart-line" label="Priemer" value={`${average(percentages)} %`} note={`${results.length} pokusov`} tone="violet" />
        <Metric icon="fa-circle-check" label="Úspešnosť" value={`${results.length ? Math.round((passed / results.length) * 100) : 0} %`} note="hranica 51 %" tone="green" />
        <Metric icon="fa-calendar-day" label="Aktívne zadania" value={assignments.filter((item) => item.status !== 'done').length} note={`${Object.keys(tests).length + 2} testov pripravených`} tone="amber" />
      </section>

      <section className="teacher-two-column">
        <article className="teacher-card">
          <header className="teacher-card-head">
            <div><span className="eyebrow">Aktivita</span><h2>Posledných 7 dní</h2></div>
            <span className="status-pill"><i className="fas fa-arrow-trend-up" /> živé dáta</span>
          </header>
          <div className="activity-chart" aria-label="Aktivita za sedem dní">
            {activity.map((day) => (
              <div className="activity-column" key={day.label}>
                <span>{day.count}</span>
                <div style={{ height: `${Math.max(8, (day.count / maxActivity) * 100)}%` }} />
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="teacher-card">
          <header className="teacher-card-head">
            <div><span className="eyebrow">Kurz</span><h2>Pripravenosť obsahu</h2></div>
            <strong className="big-percentage">73 %</strong>
          </header>
          <div className="master-progress"><span style={{ width: '72.5%' }} /></div>
          <div className="readiness-list">
            <p><span><i className="fas fa-file-lines" /> Hotové kapitoly</span><strong>29 / 40</strong></p>
            <p><span><i className="fas fa-clipboard-question" /> Publikované testy</span><strong>{Object.keys(tests).length + 2} / 40</strong></p>
            <p><span><i className="fas fa-triangle-exclamation" /> Čaká na obsah</span><strong>11</strong></p>
          </div>
        </article>
      </section>

      <section className="teacher-card">
        <header className="teacher-card-head">
          <div><span className="eyebrow">Výsledky</span><h2>Najnovšie pokusy</h2></div>
        </header>
        {recent.length ? (
          <div className="teacher-table-wrap">
            <table className="teacher-table">
              <thead><tr><th>Téma</th><th>Výsledok</th><th>Čas</th><th>Dátum</th></tr></thead>
              <tbody>
                {recent.map((result, index) => (
                  <tr key={`${result.timestamp}-${index}`}>
                    <td><strong>{resultTopicId(result)?.replaceAll('-', ' ')}</strong></td>
                    <td><span className={`score-badge ${result.percentage >= 51 ? 'is-good' : 'is-low'}`}>{result.percentage} %</span></td>
                    <td>{result.timeSpent ? `${Math.floor(result.timeSpent / 60)} min` : '—'}</td>
                    <td>{result.date ? new Date(result.date).toLocaleDateString('sk-SK') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="fa-chart-column" title="Zatiaľ bez výsledkov" text="Výsledky študentských testov sa zobrazia na tomto mieste." />}
      </section>
    </div>
  )
}

const Students = ({ students, setStudents, results }) => {
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState({ name: '', email: '', className: '' })
  const filtered = students.filter((student) => `${student.name} ${student.email} ${student.className}`.toLowerCase().includes(query.toLowerCase()))

  const addStudent = (event) => {
    event.preventDefault()
    if (!draft.name.trim()) return
    setStudents([...students, { ...draft, id: uid(), addedAt: new Date().toISOString() }])
    setDraft({ name: '', email: '', className: '' })
  }

  return (
    <div className="teacher-stack">
      <section className="teacher-card teacher-toolbar">
        <div className="search-field"><i className="fas fa-magnifying-glass" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hľadať študenta alebo triedu…" /></div>
        <button className="button button-secondary" onClick={() => downloadJson('studenti-fyzika.json', students)}><i className="fas fa-download" /> Exportovať</button>
      </section>
      <section className="teacher-two-column teacher-student-layout">
        <article className="teacher-card">
          <header className="teacher-card-head"><div><span className="eyebrow">Nový záznam</span><h2>Pridať študenta</h2></div></header>
          <form className="teacher-form" onSubmit={addStudent}>
            <label>Meno a priezvisko<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Napr. Jana Nováková" required /></label>
            <label>E-mail<input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="jana@skola.sk" /></label>
            <label>Trieda<input value={draft.className} onChange={(event) => setDraft({ ...draft, className: event.target.value })} placeholder="2.A" /></label>
            <button className="button button-primary" type="submit"><i className="fas fa-plus" /> Pridať študenta</button>
          </form>
        </article>
        <article className="teacher-card">
          <header className="teacher-card-head"><div><span className="eyebrow">Databáza</span><h2>Študenti <span className="count-chip">{filtered.length}</span></h2></div></header>
          {filtered.length ? (
            <div className="student-list">
              {filtered.map((student) => {
                const studentResults = results.filter((result) => result.studentId === student.id)
                return (
                  <div className="student-row" key={student.id}>
                    <span className="student-avatar">{student.name.slice(0, 2).toUpperCase()}</span>
                    <div><strong>{student.name}</strong><small>{student.className || 'Bez triedy'} · {student.email || 'bez e-mailu'}</small></div>
                    <span className="student-average">{studentResults.length ? `${average(studentResults.map((item) => item.percentage))} %` : '—'}</span>
                    <button className="icon-button danger" aria-label="Odstrániť študenta" onClick={() => setStudents(students.filter((item) => item.id !== student.id))}><i className="fas fa-trash" /></button>
                  </div>
                )
              })}
            </div>
          ) : <EmptyState icon="fa-users" title="Žiadni študenti" text="Pridajte prvého študenta pomocou formulára." />}
        </article>
      </section>
    </div>
  )
}

const Tests = ({ tests, setTests }) => {
  const [sectionId, setSectionId] = useState(courseSections[0].id)
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const activeQuestions = tests[sectionId]?.questions || []

  const addQuestion = (event) => {
    event.preventDefault()
    if (!question.trim() || options.some((option) => !option.trim())) return
    const nextQuestion = { id: uid(), question, options, correctAnswer, difficulty: 'medium', explanation: '' }
    setTests({ ...tests, [sectionId]: { questions: [...activeQuestions, nextQuestion], updatedAt: new Date().toISOString() } })
    setQuestion('')
    setOptions(['', '', '', ''])
    setCorrectAnswer(0)
  }

  return (
    <div className="teacher-stack">
      <section className="teacher-card teacher-toolbar">
        <label className="inline-select"><span>Téma testu</span><select value={sectionId} onChange={(event) => setSectionId(event.target.value)}>{courseSections.map((section) => <option value={section.id} key={section.id}>{section.title}</option>)}</select></label>
        <span className={`status-pill ${activeQuestions.length ? 'success' : ''}`}><i className={`fas ${activeQuestions.length ? 'fa-circle-check' : 'fa-circle-info'}`} /> {activeQuestions.length} otázok</span>
      </section>
      <section className="teacher-two-column">
        <article className="teacher-card">
          <header className="teacher-card-head"><div><span className="eyebrow">Editor</span><h2>Nová otázka</h2></div></header>
          <form className="teacher-form" onSubmit={addQuestion}>
            <label>Otázka<textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows="3" placeholder="Napíšte znenie otázky…" required /></label>
            <div className="option-editor">
              {options.map((option, index) => (
                <label key={index} className={correctAnswer === index ? 'correct-option' : ''}>
                  <input type="radio" name="correct" checked={correctAnswer === index} onChange={() => setCorrectAnswer(index)} />
                  <span>{String.fromCharCode(65 + index)}</span>
                  <input value={option} onChange={(event) => setOptions(options.map((item, optionIndex) => optionIndex === index ? event.target.value : item))} placeholder={`Možnosť ${index + 1}`} required />
                </label>
              ))}
            </div>
            <button className="button button-primary" type="submit"><i className="fas fa-plus" /> Pridať otázku</button>
          </form>
        </article>
        <article className="teacher-card">
          <header className="teacher-card-head"><div><span className="eyebrow">Banka otázok</span><h2>{courseSections.find((section) => section.id === sectionId)?.title}</h2></div></header>
          {activeQuestions.length ? (
            <div className="question-bank">
              {activeQuestions.map((item, index) => (
                <div className="question-bank-item" key={item.id}>
                  <span>{index + 1}</span><div><strong>{item.question}</strong><small>Správne: {item.options[item.correctAnswer]}</small></div>
                  <button className="icon-button danger" onClick={() => setTests({ ...tests, [sectionId]: { ...tests[sectionId], questions: activeQuestions.filter((questionItem) => questionItem.id !== item.id) } })}><i className="fas fa-trash" /></button>
                </div>
              ))}
            </div>
          ) : <EmptyState icon="fa-clipboard-question" title="Test ešte nie je pripravený" text="Pridajte prvú otázku. Zmeny sa okamžite prejavia v študentskom teste." />}
        </article>
      </section>
    </div>
  )
}

const Assignments = ({ assignments, setAssignments }) => {
  const [draft, setDraft] = useState({ title: '', sectionId: courseSections[0].id, due: today(), className: '' })
  const addAssignment = (event) => {
    event.preventDefault()
    if (!draft.title.trim()) return
    setAssignments([{ ...draft, id: uid(), status: 'active', createdAt: new Date().toISOString() }, ...assignments])
    setDraft({ title: '', sectionId: courseSections[0].id, due: today(), className: '' })
  }
  return (
    <div className="teacher-stack">
      <section className="teacher-card">
        <header className="teacher-card-head"><div><span className="eyebrow">Plánovanie</span><h2>Vytvoriť zadanie</h2></div></header>
        <form className="assignment-form" onSubmit={addAssignment}>
          <label>Názov<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Domáca úloha č. 1" required /></label>
          <label>Kapitola<select value={draft.sectionId} onChange={(event) => setDraft({ ...draft, sectionId: event.target.value })}>{courseSections.map((section) => <option value={section.id} key={section.id}>{section.title}</option>)}</select></label>
          <label>Termín<input type="date" value={draft.due} onChange={(event) => setDraft({ ...draft, due: event.target.value })} /></label>
          <label>Trieda<input value={draft.className} onChange={(event) => setDraft({ ...draft, className: event.target.value })} placeholder="2.A" /></label>
          <button className="button button-primary" type="submit"><i className="fas fa-paper-plane" /> Pridať</button>
        </form>
      </section>
      <section className="assignment-grid">
        {assignments.map((assignment) => (
          <article className={`assignment-card ${assignment.status === 'done' ? 'is-done' : ''}`} key={assignment.id}>
            <div className="assignment-card-head"><span className="assignment-icon"><i className="fas fa-book-open" /></span><span className={`status-pill ${assignment.status === 'done' ? 'success' : ''}`}>{assignment.status === 'done' ? 'Ukončené' : 'Aktívne'}</span></div>
            <h3>{assignment.title}</h3>
            <p>{courseSections.find((section) => section.id === assignment.sectionId)?.title}</p>
            <div className="assignment-meta"><span><i className="fas fa-users" /> {assignment.className || 'Všetci'}</span><span><i className="fas fa-calendar" /> {new Date(assignment.due).toLocaleDateString('sk-SK')}</span></div>
            <div className="assignment-actions">
              <button onClick={() => setAssignments(assignments.map((item) => item.id === assignment.id ? { ...item, status: item.status === 'done' ? 'active' : 'done' } : item))}><i className="fas fa-check" /> {assignment.status === 'done' ? 'Obnoviť' : 'Ukončiť'}</button>
              <button className="danger" onClick={() => setAssignments(assignments.filter((item) => item.id !== assignment.id))}><i className="fas fa-trash" /></button>
            </div>
          </article>
        ))}
        {!assignments.length && <EmptyState icon="fa-calendar-plus" title="Žiadne zadania" text="Naplánujte prvú domácu úlohu alebo test." />}
      </section>
    </div>
  )
}

const ContentStatus = ({ tests }) => (
  <div className="teacher-stack">
    {courseGroups.map((group) => {
      const sections = getGroupSections(group.id)
      const ready = sections.filter((section) => section.ready).length
      return (
        <section className="teacher-card content-group-card" key={group.id}>
          <header>
            <span className={`group-icon accent-${group.accent}`}><i className={`fas ${group.icon}`} /></span>
            <div><h2>{group.title}</h2><p>{ready} z {sections.length} kapitol pripravených</p></div>
            <div className="mini-progress"><span style={{ width: `${(ready / sections.length) * 100}%` }} /></div>
          </header>
          <div className="content-status-list">
            {sections.map((section) => (
              <div key={section.id}>
                <span className={`content-dot ${section.ready ? 'ready' : ''}`}><i className={`fas ${section.ready ? 'fa-check' : 'fa-clock'}`} /></span>
                <strong>{section.title}</strong>
                <span className="content-tags">
                  <small className={section.ready ? 'tag-ready' : 'tag-wait'}>{section.ready ? 'Obsah hotový' : 'Čaká na obsah'}</small>
                  <small className={(section.testReady || tests[section.id]?.questions?.length) ? 'tag-ready' : 'tag-muted'}>{(section.testReady || tests[section.id]?.questions?.length) ? 'Test' : 'Bez testu'}</small>
                </span>
              </div>
            ))}
          </div>
        </section>
      )
    })}
  </div>
)

const Settings = ({ settings, setSettings, allData, importData }) => {
  const fileRef = useRef(null)
  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      importData(JSON.parse(await file.text()))
    } catch {
      alert('Súbor sa nepodarilo načítať. Skontrolujte formát JSON.')
    }
    event.target.value = ''
  }
  return (
    <div className="teacher-two-column">
      <section className="teacher-card">
        <header className="teacher-card-head"><div><span className="eyebrow">Kurz</span><h2>Základné nastavenia</h2></div></header>
        <div className="teacher-form">
          <label>Názov školy alebo kurzu<input value={settings.schoolName} onChange={(event) => setSettings({ ...settings, schoolName: event.target.value })} /></label>
          <label>Hranica úspešnosti ({settings.passScore} %)<input type="range" min="1" max="100" value={settings.passScore} onChange={(event) => setSettings({ ...settings, passScore: Number(event.target.value) })} /></label>
          <label>Čas na test (minúty)<input type="number" min="1" max="180" value={settings.testMinutes} onChange={(event) => setSettings({ ...settings, testMinutes: Number(event.target.value) })} /></label>
        </div>
      </section>
      <section className="teacher-card">
        <header className="teacher-card-head"><div><span className="eyebrow">Záloha</span><h2>Import a export</h2></div></header>
        <p className="settings-copy">Stiahnite kompletnú lokálnu databázu alebo ju preneste do iného prehliadača. Dáta ostávajú pod vašou kontrolou.</p>
        <div className="settings-actions">
          <button className="button button-primary" onClick={() => downloadJson(`fyzika-zaloha-${today()}.json`, allData)}><i className="fas fa-file-export" /> Stiahnuť zálohu</button>
          <button className="button button-secondary" onClick={() => fileRef.current?.click()}><i className="fas fa-file-import" /> Importovať zálohu</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
        </div>
        <div className="privacy-note"><i className="fas fa-shield-halved" /><div><strong>Lokálne a bezpečné</strong><span>Táto verzia neposiela osobné údaje na server.</span></div></div>
      </section>
    </div>
  )
}

const TeacherPanel = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [students, setStudentsState] = useState(storage.getStudents)
  const [assignments, setAssignmentsState] = useState(storage.getAssignments)
  const [tests, setTestsState] = useState(storage.getTeacherTests)
  const [settings, setSettingsState] = useState(storage.getSettings)
  const [results] = useState(storage.getResults)

  const persist = (setter, writer) => (value) => {
    setter(value)
    writer(value)
  }
  const setStudents = persist(setStudentsState, storage.setStudents)
  const setAssignments = persist(setAssignmentsState, storage.setAssignments)
  const setTests = persist(setTestsState, storage.setTeacherTests)
  const setSettings = persist(setSettingsState, storage.setSettings)
  const importData = (data) => {
    if (Array.isArray(data.students)) setStudents(data.students)
    if (Array.isArray(data.assignments)) setAssignments(data.assignments)
    if (data.tests && typeof data.tests === 'object') setTests(data.tests)
    if (data.settings && typeof data.settings === 'object') setSettings(data.settings)
    if (Array.isArray(data.results)) storage.setResults(data.results)
  }
  const allData = { version: 1, exportedAt: new Date().toISOString(), students, assignments, tests, settings, results }

  return (
    <div className="teacher-shell">
      <aside className="teacher-sidebar">
        <Link className="teacher-brand" to="/">
          <span><i className="fas fa-atom" /></span>
          <div><strong>Fyzika II</strong><small>Učiteľské centrum</small></div>
        </Link>
        <nav aria-label="Navigácia učiteľskej administrácie">
          {tabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}><i className={`fas ${tab.icon}`} /><span>{tab.label}</span></button>)}
        </nav>
        <div className="teacher-sidebar-foot">
          <Link to="/coulombov-zakon"><i className="fas fa-arrow-up-right-from-square" /> Otvoriť kurz</Link>
          <p><span className="online-dot" /> Dáta uložené</p>
        </div>
      </aside>

      <main className="teacher-main">
        <header className="teacher-topbar">
          <div><span className="eyebrow">Fyzika II · administrácia</span><h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1></div>
          <div className="teacher-profile"><span>FU</span><div><strong>Učiteľ</strong><small>{settings.schoolName}</small></div></div>
        </header>
        <div className="teacher-mobile-tabs">{tabs.map((tab) => <button aria-label={tab.label} key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}><i className={`fas ${tab.icon}`} /><span>{tab.label}</span></button>)}</div>
        <div className="teacher-content">
          {activeTab === 'overview' && <Overview results={results} students={students} assignments={assignments} tests={tests} />}
          {activeTab === 'students' && <Students students={students} setStudents={setStudents} results={results} />}
          {activeTab === 'tests' && <Tests tests={tests} setTests={setTests} />}
          {activeTab === 'assignments' && <Assignments assignments={assignments} setAssignments={setAssignments} />}
          {activeTab === 'content' && <ContentStatus tests={tests} />}
          {activeTab === 'settings' && <Settings settings={settings} setSettings={setSettings} allData={allData} importData={importData} />}
        </div>
      </main>
    </div>
  )
}

export default TeacherPanel
