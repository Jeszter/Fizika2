import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    defaultCourseData,
    exportCourseBackup,
    getCourseData,
    getTeacherTests,
    importCourseBackup,
    makeSlug,
    resetCourseCms,
    saveCourseData,
    saveTeacherTests,
} from '../utils/courseCms'

const USERNAME = import.meta.env.VITE_TEACHER_USERNAME || 'teacher'
const PASSWORD = import.meta.env.VITE_TEACHER_PASSWORD || 'Fyzika2026!'
const uid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`

const PanelButton = ({ children, variant = 'primary', className = '', ...props }) => {
    const styles = {
        primary: 'bg-primary-blue text-white hover:bg-primary-blue-dark shadow-md',
        secondary: 'bg-white dark:bg-gray-800 text-text-dark dark:text-gray-200 border border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
        danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100',
        ghost: 'text-text-light dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
    }
    return <button className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${styles[variant]} ${className}`} {...props}>{children}</button>
}

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const submit = event => {
        event.preventDefault()
        if (username === USERNAME && password === PASSWORD) {
            sessionStorage.setItem('teacherAuthenticated', 'true')
            onLogin()
        } else {
            setError('Nesprávne používateľské meno alebo heslo.')
        }
    }

    return (
        <main className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gradient-to-br from-primary-blue-bg via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
            <form onSubmit={submit} className="w-full max-w-md bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom-lg shadow-custom-lg dark:shadow-dark-custom-lg p-8">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white flex items-center justify-center text-2xl shadow-lg">
                    <i className="fas fa-chalkboard-user"></i>
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-dark dark:text-white">Učiteľská administrácia</h1>
                    <p className="text-sm text-text-light dark:text-gray-400 mt-2">Prihláste sa pre správu kurzu Fyzika II</p>
                </div>
                {error && <div role="alert" className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm"><i className="fas fa-circle-exclamation mr-2"></i>{error}</div>}
                <div className="space-y-5">
                    <label className="block text-sm font-medium text-text-dark dark:text-gray-200">
                        Používateľské meno
                        <div className="mt-2 relative">
                            <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-text-light"></i>
                            <input autoFocus autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 focus:border-primary-blue focus:ring-2 focus:ring-blue-100 outline-none" required />
                        </div>
                    </label>
                    <label className="block text-sm font-medium text-text-dark dark:text-gray-200">
                        Heslo
                        <div className="mt-2 relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-text-light"></i>
                            <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full pl-11 pr-12 py-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 focus:border-primary-blue focus:ring-2 focus:ring-blue-100 outline-none" required />
                            <button type="button" onClick={() => setShowPassword(value => !value)} aria-label="Zobraziť heslo" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light"><i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                        </div>
                    </label>
                </div>
                <PanelButton type="submit" className="w-full mt-7 py-3"><i className="fas fa-right-to-bracket"></i> Prihlásiť sa</PanelButton>
                <p className="text-[11px] text-text-light dark:text-gray-500 text-center mt-5"><i className="fas fa-shield-halved mr-1"></i> Relácia sa ukončí po zatvorení prehliadača</p>
            </form>
        </main>
    )
}

const StatCard = ({ icon, value, label, color }) => (
    <article className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom p-5 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><i className={`fas ${icon}`}></i></div>
        <div><p className="text-2xl font-black text-text-dark dark:text-white">{value}</p><p className="text-xs text-text-light dark:text-gray-400">{label}</p></div>
    </article>
)

const Dashboard = ({ course, tests, onNavigate }) => {
    const subchapters = course.chapters.filter(chapter => chapter.parentId).length
    const questionCount = Object.values(tests).reduce((sum, test) => sum + (test.questions?.length || 0), 0)
    const results = (() => {
        try { return JSON.parse(localStorage.getItem('testResults') || '[]') }
        catch { return [] }
    })()

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon="fa-book" value={course.chapters.length} label="Všetky kapitoly" color="bg-blue-100 dark:bg-blue-900/30 text-primary-blue dark:text-blue-400" />
                <StatCard icon="fa-sitemap" value={subchapters} label="Podkapitoly" color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
                <StatCard icon="fa-circle-check" value={course.chapters.length} label="Viditeľné v kurze" color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" />
                <StatCard icon="fa-list-check" value={questionCount} label="Otázky v testoch" color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5"><div><p className="text-xs uppercase tracking-wider text-primary-blue font-bold">Rýchle akcie</p><h2 className="text-xl font-bold text-text-dark dark:text-white mt-1">Správa kurzu</h2></div><i className="fas fa-wand-magic-sparkles text-primary-blue text-xl"></i></div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <button onClick={() => onNavigate('chapters')} className="p-4 rounded-xl bg-primary-blue-bg dark:bg-blue-900/20 text-left hover:-translate-y-0.5 transition-transform"><i className="fas fa-plus-circle text-primary-blue mb-3"></i><strong className="block text-sm text-text-dark dark:text-white">Nová kapitola</strong><span className="text-xs text-text-light">Pridať obsah kurzu</span></button>
                        <button onClick={() => onNavigate('tests')} className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-left hover:-translate-y-0.5 transition-transform"><i className="fas fa-clipboard-question text-green-600 mb-3"></i><strong className="block text-sm text-text-dark dark:text-white">Nová otázka</strong><span className="text-xs text-text-light">Rozšíriť test</span></button>
                    </div>
                </section>
                <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5"><div><p className="text-xs uppercase tracking-wider text-primary-blue font-bold">Študenti</p><h2 className="text-xl font-bold text-text-dark dark:text-white mt-1">Výsledky testov</h2></div><span className="text-2xl font-black text-primary-blue">{results.length}</span></div>
                    {results.length ? <div className="space-y-3">{results.slice(-4).reverse().map((result, index) => <div key={`${result.timestamp}-${index}`} className="flex items-center justify-between p-3 bg-surface dark:bg-gray-900/40 rounded-xl"><span className="text-sm text-text-dark dark:text-gray-200 capitalize">{result.topic}</span><strong className={result.percentage >= 51 ? 'text-green-600' : 'text-red-500'}>{result.percentage}%</strong></div>)}</div> : <div className="h-36 flex flex-col items-center justify-center text-text-light"><i className="fas fa-chart-column text-3xl opacity-30 mb-3"></i><p className="text-sm">Zatiaľ bez výsledkov</p></div>}
                </section>
            </div>
        </div>
    )
}

const ChapterTree = ({ course, selectedId, onSelect, onCreate, query }) => (
    <div className="space-y-4">
        {course.groups.map(group => {
            const chapters = course.chapters.filter(chapter => chapter.groupId === group.id && !chapter.parentId && chapter.title.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.order - b.order)
            if (!chapters.length && query) return null
            return (
                <section key={group.id}>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-text-light dark:text-gray-400"><i className={`fas ${group.icon} w-5 text-primary-blue`}></i>{group.title}</h3>
                        <button onClick={() => onCreate(group.id)} className="w-7 h-7 rounded-lg hover:bg-primary-blue-bg text-primary-blue" title="Pridať kapitolu"><i className="fas fa-plus text-xs"></i></button>
                    </div>
                    <div className="space-y-1">
                        {chapters.map(chapter => {
                            const children = course.chapters.filter(item => item.parentId === chapter.id).sort((a, b) => a.order - b.order)
                            return <React.Fragment key={chapter.id}>
                                <button onClick={() => onSelect(chapter.id)} className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left text-sm ${selectedId === chapter.id ? 'bg-primary-blue text-white shadow-md' : 'hover:bg-primary-blue-bg dark:hover:bg-gray-700 text-text-dark dark:text-gray-300'}`}>
                                    <i className="fas fa-file-lines text-xs opacity-70"></i><span className="flex-1 truncate">{chapter.title}</span>{children.length > 0 && <span className="text-[10px] opacity-70">{children.length}</span>}
                                </button>
                                {children.map(child => <button key={child.id} onClick={() => onSelect(child.id)} className={`w-full flex items-center gap-2 py-2 pr-2 pl-8 rounded-xl text-left text-xs ${selectedId === child.id ? 'bg-primary-blue/90 text-white' : 'hover:bg-primary-blue-bg dark:hover:bg-gray-700 text-text-light dark:text-gray-400'}`}><i className="fas fa-turn-up rotate-90 text-[10px]"></i><span className="truncate">{child.title}</span></button>)}
                            </React.Fragment>
                        })}
                    </div>
                </section>
            )
        })}
    </div>
)

const GroupEditor = ({ course, setCourse, tests, setTests }) => {
    const [selectedId, setSelectedId] = useState(course.groups[0]?.id || null)
    const selected = course.groups.find(group => group.id === selectedId)
    const [draft, setDraft] = useState(selected ? { ...selected } : null)

    const selectGroup = id => {
        const group = course.groups.find(item => item.id === id)
        setSelectedId(id)
        setDraft(group ? { ...group } : null)
    }

    const addGroup = () => {
        const group = { id: `novy-oddiel-${Date.now()}`, title: 'Nový oddiel', icon: 'fa-folder' }
        setCourse({ ...course, groups: [...course.groups, group] })
        setSelectedId(group.id)
        setDraft(group)
    }

    const save = () => {
        const id = makeSlug(draft.id || draft.title)
        if (!id || course.groups.some(group => group.id === id && group.id !== selectedId)) {
            alert('Identifikátor oddielu musí byť jedinečný.')
            return
        }
        const nextGroup = { ...draft, id }
        setCourse({
            ...course,
            groups: course.groups.map(group => group.id === selectedId ? nextGroup : group),
            chapters: course.chapters.map(chapter => chapter.groupId === selectedId ? { ...chapter, groupId: id } : chapter),
        })
        setSelectedId(id)
        setDraft(nextGroup)
    }

    const move = direction => {
        const index = course.groups.findIndex(group => group.id === selectedId)
        const target = index + direction
        if (target < 0 || target >= course.groups.length) return
        const groups = [...course.groups]
        ;[groups[index], groups[target]] = [groups[target], groups[index]]
        setCourse({ ...course, groups })
    }

    const remove = () => {
        const chapters = course.chapters.filter(chapter => chapter.groupId === selectedId)
        const message = chapters.length
            ? `Oddiel obsahuje ${chapters.length} kapitol. Odstrániť oddiel aj všetky jeho kapitoly a testy?`
            : 'Odstrániť tento oddiel?'
        if (!confirm(message)) return
        const chapterIds = new Set(chapters.map(chapter => chapter.id))
        setCourse({
            ...course,
            groups: course.groups.filter(group => group.id !== selectedId),
            chapters: course.chapters.filter(chapter => !chapterIds.has(chapter.id)),
        })
        setTests(Object.fromEntries(Object.entries(tests).filter(([chapterId]) => !chapterIds.has(chapterId))))
        const next = course.groups.find(group => group.id !== selectedId)
        setSelectedId(next?.id || null)
        setDraft(next ? { ...next } : null)
    }

    const openStudentView = () => {
        const firstChapter = course.chapters
            .filter(chapter => chapter.groupId === selectedId)
            .sort((a, b) => a.order - b.order)[0]
        if (!firstChapter) {
            alert('V tomto oddiele zatiaľ nie je publikovaná kapitola.')
            return
        }
        window.open(`${import.meta.env.BASE_URL}${firstChapter.id}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-5">
            <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom shadow-sm overflow-hidden">
                <header className="p-5 border-b border-border dark:border-gray-700 flex items-center justify-between">
                    <div><p className="text-xs text-primary-blue font-bold uppercase tracking-wide">Menu študenta</p><h2 className="text-xl font-bold text-text-dark dark:text-white mt-1">Oddiely kurzu</h2></div>
                    <PanelButton onClick={addGroup} className="px-3"><i className="fas fa-plus"></i></PanelButton>
                </header>
                <div className="p-3 space-y-2">
                    {course.groups.map((group, index) => {
                        const count = course.chapters.filter(chapter => chapter.groupId === group.id).length
                        return <button key={group.id} onClick={() => selectGroup(group.id)} className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-colors ${selectedId === group.id ? 'bg-primary-blue text-white shadow-md' : 'bg-surface dark:bg-gray-900/40 text-text-dark dark:text-gray-300 hover:bg-primary-blue-bg dark:hover:bg-gray-700'}`}>
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === group.id ? 'bg-white/20' : 'bg-primary-blue/10 text-primary-blue'}`}><i className={`fas ${group.icon}`}></i></span>
                            <span className="flex-1 min-w-0"><strong className="block text-sm truncate">{group.title}</strong><small className={selectedId === group.id ? 'text-blue-100' : 'text-text-light'}>{count} kapitol</small></span>
                            <span className="text-xs opacity-60">{index + 1}</span>
                        </button>
                    })}
                </div>
            </section>
            {draft ? <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom shadow-sm overflow-hidden">
                <header className="p-5 border-b border-border dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
                    <div><p className="text-xs text-primary-blue font-bold uppercase tracking-wide">Nastavenie oddielu</p><h2 className="text-xl font-bold text-text-dark dark:text-white mt-1">{draft.title}</h2></div>
                    <div className="flex flex-wrap gap-2">
                        <PanelButton variant="secondary" onClick={() => move(-1)} disabled={course.groups[0]?.id === selectedId}><i className="fas fa-arrow-up"></i>Vyššie</PanelButton>
                        <PanelButton variant="secondary" onClick={() => move(1)} disabled={course.groups.at(-1)?.id === selectedId}><i className="fas fa-arrow-down"></i>Nižšie</PanelButton>
                        <PanelButton onClick={save}><i className="fas fa-floppy-disk"></i>Uložiť</PanelButton>
                    </div>
                </header>
                <div className="p-5 space-y-5">
                    <div className="p-4 rounded-xl bg-primary-blue-bg dark:bg-blue-900/20 flex items-center gap-4">
                        <span className="w-14 h-14 rounded-xl bg-primary-blue text-white flex items-center justify-center text-xl"><i className={`fas ${draft.icon}`}></i></span>
                        <div><strong className="text-text-dark dark:text-white">Takto sa oddiel zobrazí študentovi</strong><p className="text-sm text-text-light dark:text-gray-400 mt-1">Názov, ikona, poradie a všetky publikované kapitoly sa preberajú priamo z týchto nastavení.</p></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="text-sm font-medium text-text-dark dark:text-gray-200">Názov oddielu<input value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 outline-none focus:border-primary-blue" /></label>
                        <label className="text-sm font-medium text-text-dark dark:text-gray-200">Identifikátor<input value={draft.id} onChange={event => setDraft({ ...draft, id: event.target.value })} className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 outline-none focus:border-primary-blue font-mono text-sm" /></label>
                        <label className="md:col-span-2 text-sm font-medium text-text-dark dark:text-gray-200">Font Awesome ikona<input value={draft.icon} onChange={event => setDraft({ ...draft, icon: event.target.value })} placeholder="fa-bolt" className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 outline-none focus:border-primary-blue font-mono text-sm" /></label>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border dark:border-gray-700">
                        <PanelButton variant="danger" onClick={remove}><i className="fas fa-trash"></i>Odstrániť oddiel</PanelButton>
                        <PanelButton variant="secondary" onClick={openStudentView}><i className="fas fa-user-graduate"></i>Zobraziť ako študent</PanelButton>
                    </div>
                </div>
            </section> : <div className="bg-white dark:bg-gray-800 rounded-custom p-10 text-center text-text-light">Vytvorte prvý oddiel kurzu.</div>}
        </div>
    )
}

const ChapterEditor = ({ course, setCourse }) => {
    const navigate = useNavigate()
    const [selectedId, setSelectedId] = useState(course.chapters[0]?.id)
    const [draft, setDraft] = useState(course.chapters[0] || null)
    const [query, setQuery] = useState('')
    const current = course.chapters.find(chapter => chapter.id === selectedId)

    const selectChapter = id => {
        const chapter = course.chapters.find(item => item.id === id)
        setSelectedId(id)
        setDraft(chapter ? { ...chapter } : null)
    }

    const createChapter = (groupId, parentId = null) => {
        const groupOrder = course.chapters
            .filter(chapter => chapter.groupId === groupId)
            .reduce((maximum, chapter) => Math.max(maximum, chapter.order), -1) + 1
        const chapter = { id: `nova-kapitola-${Date.now()}`, title: parentId ? 'Nová podkapitola' : 'Nová kapitola', groupId, parentId, order: groupOrder, published: true, content: '<div class="section active"><h2><i class="fas fa-book"></i> Nová kapitola</h2><p>Začnite písať obsah…</p></div>', system: false, updatedAt: new Date().toISOString() }
        const next = { ...course, chapters: [...course.chapters, chapter] }
        setCourse(next)
        setSelectedId(chapter.id)
        setDraft({ ...chapter })
    }

    const save = () => {
        const slug = makeSlug(draft.id || draft.title)
        if (!slug || course.chapters.some(chapter => chapter.id === slug && chapter.id !== selectedId)) {
            alert('Adresa kapitoly musí byť jedinečná.')
            return null
        }
        const next = { ...draft, id: slug, published: true, updatedAt: new Date().toISOString() }
        const chapters = course.chapters.map(chapter => chapter.id === selectedId ? next : chapter.parentId === selectedId ? { ...chapter, parentId: slug } : chapter)
        setCourse({ ...course, chapters })
        setSelectedId(slug)
        setDraft(next)
        return slug
    }

    const openStudentView = () => {
        const slug = save()
        if (slug) window.open(`${import.meta.env.BASE_URL}${slug}`, '_blank', 'noopener,noreferrer')
    }

    const openVisualEditor = () => {
        const slug = save()
        if (slug) navigate(`/teacher/edit/${slug}`)
    }

    const remove = () => {
        if (!confirm(`Naozaj chcete odstrániť „${current.title}“ aj so všetkými podkapitolami?`)) return
        const ids = new Set([current.id, ...course.chapters.filter(chapter => chapter.parentId === current.id).map(chapter => chapter.id)])
        const chapters = course.chapters.filter(chapter => !ids.has(chapter.id))
        setCourse({ ...course, chapters })
        selectChapter(chapters[0]?.id || null)
    }

    const duplicate = () => {
        const groupOrder = course.chapters
            .filter(chapter => chapter.groupId === current.groupId)
            .reduce((maximum, chapter) => Math.max(maximum, chapter.order), -1) + 1
        const copy = { ...current, id: `${current.id}-kopia-${Date.now()}`, title: `${current.title} – kópia`, system: false, published: true, order: groupOrder }
        setCourse({ ...course, chapters: [...course.chapters, copy] })
        setSelectedId(copy.id)
        setDraft({ ...copy })
    }

    if (!draft) return <div className="bg-white dark:bg-gray-800 rounded-custom p-10 text-center"><PanelButton onClick={() => createChapter(course.groups[0].id)}><i className="fas fa-plus"></i> Vytvoriť prvú kapitolu</PanelButton></div>

    return (
        <div className="grid xl:grid-cols-[330px_minmax(0,1fr)] gap-5">
            <aside className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border dark:border-gray-700">
                    <div className="relative"><i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-xs"></i><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Hľadať kapitolu…" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 outline-none focus:border-primary-blue" /></div>
                </div>
                <div className="p-3 max-h-[calc(100vh-260px)] overflow-y-auto"><ChapterTree course={course} selectedId={selectedId} onSelect={selectChapter} onCreate={createChapter} query={query} /></div>
            </aside>
            <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom shadow-sm overflow-hidden">
                <header className="p-5 border-b border-border dark:border-gray-700 flex flex-wrap gap-3 items-center justify-between">
                    <div><p className="text-xs text-primary-blue font-bold uppercase tracking-wide">{draft.parentId ? 'Podkapitola' : 'Kapitola'}</p><h2 className="text-xl font-bold text-text-dark dark:text-white mt-1">{draft.title}</h2></div>
                    <div className="flex flex-wrap gap-2">
                        <PanelButton variant="secondary" onClick={openStudentView}><i className="fas fa-user-graduate"></i>Ako študent</PanelButton>
                        <PanelButton variant="secondary" onClick={duplicate}><i className="fas fa-copy"></i>Kópia</PanelButton>
                        {!draft.parentId && <PanelButton variant="secondary" onClick={() => createChapter(draft.groupId, draft.id)}><i className="fas fa-code-branch"></i>Podkapitola</PanelButton>}
                        <PanelButton onClick={openVisualEditor}><i className="fas fa-pen-ruler"></i>Upraviť na stránke</PanelButton>
                    </div>
                </header>
                <div className="p-5 space-y-5">
                        <button
                            type="button"
                            onClick={openVisualEditor}
                            className="w-full p-6 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-primary-blue-bg dark:bg-blue-900/20 text-left group hover:border-primary-blue transition-colors"
                        >
                            <span className="flex flex-col md:flex-row md:items-center gap-4">
                                <span className="w-14 h-14 rounded-2xl bg-primary-blue text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                                    <i className="fas fa-pen-ruler"></i>
                                </span>
                                <span className="flex-1">
                                    <strong className="block text-lg text-text-dark dark:text-white">Otvoriť vizuálny editor</strong>
                                    <span className="block text-sm text-text-light dark:text-gray-400 mt-1">Kapitola sa otvorí presne tak, ako ju vidí študent. Texty a bloky upravíte priamo na stránke pomocou ceruziek.</span>
                                </span>
                                <span className="text-primary-blue font-semibold text-sm">Otvoriť <i className="fas fa-arrow-right ml-1"></i></span>
                            </span>
                        </button>
                        <div className="grid md:grid-cols-2 gap-4">
                            <label className="text-sm font-medium text-text-dark dark:text-gray-200">Názov<input value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 outline-none focus:border-primary-blue" /></label>
                            <label className="text-sm font-medium text-text-dark dark:text-gray-200">URL identifikátor<input value={draft.id} onChange={event => setDraft({ ...draft, id: event.target.value })} className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 outline-none focus:border-primary-blue font-mono text-sm" /></label>
                            <label className="text-sm font-medium text-text-dark dark:text-gray-200">Tematická skupina<select value={draft.groupId} onChange={event => setDraft({ ...draft, groupId: event.target.value })} className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700">{course.groups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}</select></label>
                            <label className="text-sm font-medium text-text-dark dark:text-gray-200">Nadradená kapitola<select value={draft.parentId || ''} onChange={event => setDraft({ ...draft, parentId: event.target.value || null })} className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700"><option value="">Bez nadradenej kapitoly</option>{course.chapters.filter(chapter => !chapter.parentId && chapter.id !== draft.id).map(chapter => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></label>
                        </div>
                        <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-border dark:border-gray-700">
                            <PanelButton variant="danger" onClick={remove}><i className="fas fa-trash"></i>Odstrániť</PanelButton>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-text-light">{draft.updatedAt ? `Upravené ${new Date(draft.updatedAt).toLocaleString('sk-SK')}` : 'Bez lokálnych úprav'}</span>
                                <PanelButton variant="secondary" onClick={save}><i className="fas fa-floppy-disk"></i>Uložiť nastavenia</PanelButton>
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    )
}

const TestEditor = ({ course, tests, setTests }) => {
    const navigate = useNavigate()
    const [chapterId, setChapterId] = useState(course.chapters[0]?.id || '')
    const [editingId, setEditingId] = useState(null)
    const empty = { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'medium' }
    const [draft, setDraft] = useState(empty)
    const questions = tests[chapterId]?.questions || []

    const saveQuestion = event => {
        event.preventDefault()
        if (!draft.question.trim() || draft.options.some(option => !option.trim())) return
        const question = { ...draft, id: editingId || uid() }
        const nextQuestions = editingId ? questions.map(item => item.id === editingId ? question : item) : [...questions, question]
        setTests({
            ...tests,
            [chapterId]: {
                ...tests[chapterId],
                questions: nextQuestions,
                updatedAt: new Date().toISOString(),
            },
        })
        setDraft(empty)
        setEditingId(null)
    }

    const edit = question => {
        setDraft({ ...question, options: [...question.options] })
        setEditingId(question.id)
    }

    return (
        <div className="space-y-5">
            <button
                type="button"
                onClick={() => navigate(`/teacher/edit-test/${chapterId}`)}
                className="w-full p-6 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/15 text-left group hover:border-emerald-500 transition-colors"
            >
                <span className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                        <i className="fas fa-clipboard-check"></i>
                    </span>
                    <span className="flex-1">
                        <strong className="block text-lg text-text-dark dark:text-white">Otvoriť vizuálny editor testu</strong>
                        <span className="block text-sm text-text-light dark:text-gray-400 mt-1">Otázky upravíte priamo v rovnakom zobrazení, aké používa študent.</span>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">Upraviť vizuálne <i className="fas fa-arrow-right ml-1"></i></span>
                </span>
            </button>
            <div className="grid xl:grid-cols-[minmax(0,1fr)_420px] gap-5">
            <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom shadow-sm p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><p className="text-xs text-primary-blue font-bold uppercase tracking-wide">Banka otázok</p><h2 className="text-xl font-bold text-text-dark dark:text-white">Test kapitoly</h2></div><select value={chapterId} onChange={event => { setChapterId(event.target.value); setDraft(empty); setEditingId(null) }} className="p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 max-w-sm">{course.chapters.map(chapter => <option key={chapter.id} value={chapter.id}>{chapter.parentId ? '↳ ' : ''}{chapter.title}</option>)}</select></div>
                {questions.length ? <div className="space-y-3">{questions.map((question, index) => <article key={question.id} className="p-4 rounded-xl bg-surface dark:bg-gray-900/50 border border-border dark:border-gray-700 flex gap-4">
                    <span className="w-8 h-8 flex-shrink-0 rounded-lg bg-primary-blue text-white flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <div className="flex-1 min-w-0"><h3 className="font-semibold text-text-dark dark:text-white">{question.question}</h3><p className="text-xs text-green-600 mt-2"><i className="fas fa-check mr-1"></i>{question.options[question.correctAnswer]}</p></div>
                    <div className="flex gap-1"><button onClick={() => edit(question)} className="w-9 h-9 rounded-lg text-primary-blue hover:bg-primary-blue-bg"><i className="fas fa-pen"></i></button><button onClick={() => { if (confirm('Odstrániť otázku?')) setTests({ ...tests, [chapterId]: { ...tests[chapterId], questions: questions.filter(item => item.id !== question.id) } }) }} className="w-9 h-9 rounded-lg text-red-500 hover:bg-red-50"><i className="fas fa-trash"></i></button></div>
                </article>)}</div> : <div className="min-h-64 flex flex-col items-center justify-center text-text-light"><i className="fas fa-clipboard-question text-4xl opacity-30 mb-3"></i><p>Pre túto kapitolu ešte nie sú otázky</p></div>}
            </section>
            <form onSubmit={saveQuestion} className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom shadow-sm p-5 h-fit xl:sticky xl:top-24">
                <p className="text-xs text-primary-blue font-bold uppercase tracking-wide">{editingId ? 'Úprava otázky' : 'Nová otázka'}</p>
                <h2 className="text-xl font-bold text-text-dark dark:text-white mt-1 mb-5">{editingId ? 'Upraviť otázku' : 'Pridať otázku'}</h2>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-text-dark dark:text-gray-200">Otázka<textarea value={draft.question} onChange={event => setDraft({ ...draft, question: event.target.value })} rows="3" className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700 resize-y" required /></label>
                    <div className="space-y-2">{draft.options.map((option, index) => <label key={index} className={`flex items-center gap-3 p-2 rounded-xl border ${draft.correctAnswer === index ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border dark:border-gray-700'}`}><input type="radio" name="correct" checked={draft.correctAnswer === index} onChange={() => setDraft({ ...draft, correctAnswer: index })} /><span className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + index)}</span><input value={option} onChange={event => setDraft({ ...draft, options: draft.options.map((item, optionIndex) => optionIndex === index ? event.target.value : item) })} className="flex-1 bg-transparent outline-none text-sm" placeholder={`Možnosť ${index + 1}`} required /></label>)}</div>
                    <label className="block text-sm font-medium text-text-dark dark:text-gray-200">Vysvetlenie<textarea value={draft.explanation} onChange={event => setDraft({ ...draft, explanation: event.target.value })} rows="2" className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700" /></label>
                    <label className="block text-sm font-medium text-text-dark dark:text-gray-200">Obtiažnosť<select value={draft.difficulty} onChange={event => setDraft({ ...draft, difficulty: event.target.value })} className="mt-2 w-full p-3 rounded-xl bg-surface dark:bg-gray-900 border border-border dark:border-gray-700"><option value="easy">Ľahká</option><option value="medium">Stredná</option><option value="hard">Ťažká</option></select></label>
                </div>
                <div className="flex gap-2 mt-5"><PanelButton type="submit" className="flex-1"><i className="fas fa-floppy-disk"></i>{editingId ? 'Uložiť' : 'Pridať'}</PanelButton>{editingId && <PanelButton type="button" variant="secondary" onClick={() => { setDraft(empty); setEditingId(null) }}>Zrušiť</PanelButton>}</div>
            </form>
            </div>
        </div>
    )
}

const DataTools = ({ setCourse, setTests }) => {
    const inputRef = useRef(null)
    const download = () => {
        const blob = new Blob([JSON.stringify(exportCourseBackup(), null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `fyzika-ii-zaloha-${new Date().toISOString().slice(0, 10)}.json`
        link.click()
        URL.revokeObjectURL(url)
    }
    const upload = async event => {
        try {
            const backup = JSON.parse(await event.target.files[0].text())
            importCourseBackup(backup)
            setCourse(getCourseData())
            setTests(getTeacherTests())
            alert('Záloha bola úspešne importovaná.')
        } catch {
            alert('Súbor nemá správny formát.')
        }
        event.target.value = ''
    }
    const reset = () => {
        if (!confirm('Naozaj chcete odstrániť všetky úpravy, nové kapitoly a učiteľské testy?')) return
        resetCourseCms()
        setCourse(JSON.parse(JSON.stringify(defaultCourseData)))
        setTests({})
    }
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom p-6 shadow-sm"><div className="w-12 h-12 rounded-xl bg-primary-blue-bg text-primary-blue flex items-center justify-center mb-4"><i className="fas fa-file-export"></i></div><h2 className="text-xl font-bold text-text-dark dark:text-white">Záloha kurzu</h2><p className="text-sm text-text-light dark:text-gray-400 mt-2 mb-5">Stiahnite všetky kapitoly, podkapitoly a testy do jedného JSON súboru.</p><PanelButton onClick={download}><i className="fas fa-download"></i>Stiahnuť zálohu</PanelButton></section>
            <section className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-custom p-6 shadow-sm"><div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4"><i className="fas fa-file-import"></i></div><h2 className="text-xl font-bold text-text-dark dark:text-white">Obnoviť zo zálohy</h2><p className="text-sm text-text-light dark:text-gray-400 mt-2 mb-5">Import nahradí aktuálne lokálne dáta obsahom záložného súboru.</p><PanelButton variant="secondary" onClick={() => inputRef.current?.click()}><i className="fas fa-upload"></i>Vybrať súbor</PanelButton><input ref={inputRef} type="file" accept=".json,application/json" hidden onChange={upload} /></section>
            <section className="md:col-span-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-custom p-6 flex flex-wrap gap-5 items-center justify-between"><div><h2 className="font-bold text-red-700 dark:text-red-400">Obnoviť pôvodný kurz</h2><p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">Odstráni všetky lokálne zmeny vytvorené v učiteľskej administrácii.</p></div><PanelButton variant="danger" onClick={reset}><i className="fas fa-rotate-left"></i>Obnoviť pôvodné dáta</PanelButton></section>
        </div>
    )
}

const TeacherPanel = () => {
    const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('teacherAuthenticated') === 'true')
    const [tab, setTab] = useState('dashboard')
    const [course, setCourseState] = useState(getCourseData)
    const [tests, setTestsState] = useState(getTeacherTests)
    const nav = [
        ['dashboard', 'fa-chart-pie', 'Prehľad'],
        ['groups', 'fa-folder-tree', 'Oddiely'],
        ['chapters', 'fa-book-open', 'Kapitoly'],
        ['tests', 'fa-list-check', 'Testy'],
        ['data', 'fa-database', 'Dáta'],
    ]

    const setCourse = next => { setCourseState(next); saveCourseData(next) }
    const setTests = next => { setTestsState(next); saveTeacherTests(next) }
    const title = nav.find(item => item[0] === tab)?.[2]

    if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />

    return (
        <div className="min-h-screen pt-16 bg-background dark:bg-gray-900">
            <aside className="fixed top-16 bottom-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-border dark:border-gray-700 hidden lg:flex flex-col z-30">
                <div className="p-5 border-b border-border dark:border-gray-700"><p className="text-xs text-primary-blue font-bold uppercase tracking-wider">Administrácia</p><h2 className="text-lg font-bold text-text-dark dark:text-white mt-1">Učiteľský panel</h2></div>
                <nav className="p-3 space-y-1">{nav.map(([id, icon, label]) => <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'bg-primary-blue text-white shadow-md' : 'text-text-dark dark:text-gray-300 hover:bg-primary-blue-bg dark:hover:bg-gray-700'}`}><i className={`fas ${icon} w-5`}></i>{label}</button>)}</nav>
                <div className="mt-auto p-4 border-t border-border dark:border-gray-700 space-y-2"><Link to="/coulombov-zakon" className="flex items-center gap-2 p-3 text-sm text-primary-blue hover:bg-primary-blue-bg rounded-xl"><i className="fas fa-arrow-up-right-from-square"></i>Otvoriť kurz</Link><button onClick={() => { sessionStorage.removeItem('teacherAuthenticated'); setAuthenticated(false) }} className="w-full flex items-center gap-2 p-3 text-sm text-text-light hover:text-red-500 hover:bg-red-50 rounded-xl"><i className="fas fa-right-from-bracket"></i>Odhlásiť sa</button></div>
            </aside>
            <main className="lg:ml-64">
                <header className="bg-white dark:bg-gray-800 border-b border-border dark:border-gray-700 px-4 md:px-8 py-5"><div className="max-w-[1500px] mx-auto flex items-center justify-between"><div><p className="text-xs text-text-light dark:text-gray-400">Fyzika II / Administrácia</p><h1 className="text-2xl font-bold text-text-dark dark:text-white mt-1">{title}</h1></div><div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold">U</div></div></header>
                <nav className="lg:hidden flex overflow-x-auto gap-2 p-3 bg-white dark:bg-gray-800 border-b border-border dark:border-gray-700">{nav.map(([id, icon, label]) => <button key={id} onClick={() => setTab(id)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${tab === id ? 'bg-primary-blue text-white' : 'text-text-light'}`}><i className={`fas ${icon}`}></i>{label}</button>)}</nav>
                <div className="max-w-[1500px] mx-auto p-4 md:p-8">
                    {tab === 'dashboard' && <Dashboard course={course} tests={tests} onNavigate={setTab} />}
                    {tab === 'groups' && <GroupEditor course={course} setCourse={setCourse} tests={tests} setTests={setTests} />}
                    {tab === 'chapters' && <ChapterEditor course={course} setCourse={setCourse} />}
                    {tab === 'tests' && <TestEditor course={course} tests={tests} setTests={setTests} />}
                    {tab === 'data' && <DataTools setCourse={setCourse} setTests={setTests} />}
                </div>
            </main>
        </div>
    )
}

export default TeacherPanel
