import React, { useState, useEffect } from 'react'

// ─── Storage helpers ──────────────────────────────────────────────────────────
export const getTestResults = () => {
    try { return JSON.parse(localStorage.getItem('testResults') || '[]') }
    catch { return [] }
}

export const buildTestMap = (results) => {
    const map = {}
    results.forEach(r => {
        const sectionId = r.topic.replace(' ', '-')
        if (!map[sectionId] || r.percentage > map[sectionId].percentage) {
            map[sectionId] = r
        }
    })
    return map
}

export const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const formatTime = (seconds) => {
    if (!seconds) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
}

const menuData = (sections) => [
    { id: 'elektrostatika',           icon: 'fa-bolt',            title: 'Elektrostatické pole',         range: [0, 7] },
    { id: 'elektricky-proud',          icon: 'fa-plug',            title: 'Elektrický prúd v kovoch',     range: [8, 10] },
    { id: 'magneticke-pole',           icon: 'fa-magnet',          title: 'Magnetické pole',              range: [11, 16] },
    { id: 'elektromagneticke-pole',    icon: 'fa-wave-square',     title: 'Elektromagnetické pole',       range: [17, 20] },
    { id: 'maxwell',                   icon: 'fa-infinity',        title: 'Maxwellove rovnice',           range: [21, 21] },
    { id: 'elektromagneticke-vlnenie', icon: 'fa-broadcast-tower', title: 'Elektromagnetické vlnenie',    range: [22, 24] },
    { id: 'kvantova-mechanika',        icon: 'fa-atom',            title: 'Základy kvantovej mechaniky',  range: [25, 28] },
    { id: 'atom',                      icon: 'fa-circle-dot',      title: 'Atóm',                         range: [29, 32] },
    { id: 'jadro',                     icon: 'fa-radiation',       title: 'Jadro atómu',                  range: [33, 36] },
    { id: 'elementarne-castice',       icon: 'fa-asterisk',        title: 'Elementárne častice a sily',   range: [37, sections.length - 1] },
]

const SumBox = ({ value, label, color }) => {
    const colors = {
        green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        red:   'bg-red-50 dark:bg-red-900/20 text-red-500',
        blue:  'bg-primary-blue-bg dark:bg-blue-900/20 text-primary-blue dark:text-blue-400',
    }
    return (
        <div className={`flex-1 rounded-xl p-3 text-center ${colors[color]}`}>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs">{label}</p>
        </div>
    )
}

// ─── ProgressDrawer ───────────────────────────────────────────────────────────
// Slides in from the right, sits BELOW the header (top-16 = 64px)
const ProgressModal = ({ sections, sectionTitles, onClose }) => {
    const [activeTab,  setActiveTab]  = useState('overview')
    const [testMap,    setTestMap]    = useState({})
    const [allResults, setAllResults] = useState([])
    const [visible,    setVisible]    = useState(false)

    useEffect(() => {
        const results = getTestResults()
        setAllResults(results)
        setTestMap(buildTestMap(results))
        requestAnimationFrame(() => setVisible(true))
    }, [])

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 300)
    }

    const readSections  = sections.filter(s => testMap[s] && testMap[s].percentage >= 51)
    const readCount     = readSections.length
    const total         = sections.length
    const pct           = total > 0 ? Math.round((readCount / total) * 100) : 0
    const passedEntries = Object.entries(testMap).filter(([, t]) => t.percentage >= 51)
    const failedEntries = Object.entries(testMap).filter(([, t]) => t.percentage < 51)
    const sortedResults = [...allResults].sort((a, b) => b.timestamp - a.timestamp)
    const lastActivity  = sortedResults[0]
    const menus         = menuData(sections)

    return (
        <>
            <div
                className={`fixed left-0 right-0 bottom-0 top-16 z-30 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div
                className={`fixed top-16 right-0 bottom-0 z-40 w-full max-w-sm bg-white dark:bg-gray-800 border-l border-border dark:border-gray-700 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
            >

                <div className="flex items-center justify-between px-5 py-4 bg-primary-blue-bg dark:bg-gray-900/50 border-b border-border dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-lg flex items-center justify-center shadow-md">
                            <i className="fas fa-chart-line text-white"></i>
                        </div>
                        <div>
                            <h2 className="text-primary-blue dark:text-blue-400 font-semibold">Váš pokrok</h2>
                            <p className="text-text-light dark:text-gray-400 text-xs">Fyzika II – prehľad štúdia</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-text-dark dark:text-gray-300"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="grid grid-cols-3 border-b border-border dark:border-gray-700 flex-shrink-0">
                    {[
                        { value: `${pct}%`,            label: 'Celkovo',       color: 'text-primary-blue dark:text-blue-400',    icon: 'fa-graduation-cap' },
                        { value: readCount,             label: `z ${total} kap.`, color: 'text-green-600 dark:text-green-400',   icon: 'fa-book-open' },
                        { value: passedEntries.length,  label: 'Testov OK',     color: 'text-purple-600 dark:text-purple-400',   icon: 'fa-check-circle' },
                    ].map((stat, i) => (
                        <div key={i} className={`py-3 px-2 text-center ${i > 0 ? 'border-l border-border dark:border-gray-700' : ''}`}>
                            <i className={`fas ${stat.icon} text-xs ${stat.color} mb-1 block opacity-60`}></i>
                            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-text-light dark:text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="px-5 py-3 border-b border-border dark:border-gray-700 flex-shrink-0">
                    <div className="flex justify-between text-xs text-text-light dark:text-gray-400 mb-1.5">
                        <span>Postup cez kurz</span>
                        <span>{readCount} / {total}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-blue dark:bg-blue-500 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-text-light dark:text-gray-500 mt-1 flex items-center gap-1">
                        <i className="fas fa-info-circle"></i>
                        Dokončená = test ≥51&nbsp;%
                    </p>
                </div>

                {lastActivity && (
                    <div className="px-5 py-2.5 border-b border-border dark:border-gray-700 bg-surface dark:bg-gray-900/30 flex items-center gap-3 flex-shrink-0">
                        <div className="w-7 h-7 bg-primary-blue/10 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-clock text-primary-blue dark:text-blue-400 text-xs"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-text-light dark:text-gray-400">Posledná aktivita</p>
                            <p className="text-xs font-medium text-text-dark dark:text-gray-200 truncate">
                                {sectionTitles[lastActivity.topic.replace(' ', '-')] || lastActivity.topic}
                                <span className={`ml-1.5 font-bold ${lastActivity.percentage >= 51 ? 'text-green-500' : 'text-red-400'}`}>
                                    {lastActivity.percentage}%
                                </span>
                            </p>
                        </div>
                        <p className="text-[10px] text-text-light dark:text-gray-500 flex-shrink-0">{formatDate(lastActivity.date)}</p>
                    </div>
                )}
                <div className="flex border-b border-border dark:border-gray-700 bg-surface dark:bg-gray-900/30 flex-shrink-0">
                    {[
                        { id: 'overview', label: 'Kapitoly', icon: 'fa-list' },
                        { id: 'tests',    label: 'Testy',    icon: 'fa-clipboard-check' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-primary-blue text-primary-blue dark:text-blue-400 bg-white dark:bg-gray-800'
                                    : 'border-transparent text-text-light dark:text-gray-400 hover:text-text-dark dark:hover:text-gray-300'
                            }`}
                        >
                            <i className={`fas ${tab.icon} text-xs`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto">

                    {activeTab === 'overview' && (
                        <div className="p-3 space-y-2">
                            {menus.map(menu => {
                                const menuSections = sections.slice(menu.range[0], menu.range[1] + 1)
                                const doneCount    = menuSections.filter(s => readSections.includes(s)).length
                                const menuPct      = Math.round((doneCount / menuSections.length) * 100)
                                const allDone      = doneCount === menuSections.length

                                return (
                                    <div key={menu.id} className="bg-surface dark:bg-gray-900/30 border border-border dark:border-gray-700 rounded-xl p-3">
                                        <div className="flex items-center gap-2.5 mb-2.5">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
                                                allDone
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                    : doneCount > 0
                                                        ? 'bg-primary-blue/20 dark:bg-blue-500/30 text-primary-blue dark:text-blue-400'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-text-light dark:text-gray-400'
                                            }`}>
                                                <i className={`fas ${allDone ? 'fa-check' : menu.icon}`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-semibold text-text-dark dark:text-gray-200 truncate">{menu.title}</p>
                                                    <span className="text-[10px] text-text-light dark:text-gray-400 flex-shrink-0">{doneCount}/{menuSections.length}</span>
                                                </div>
                                                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-green-500' : 'bg-primary-blue dark:bg-blue-500'}`}
                                                        style={{ width: `${menuPct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-10 space-y-0.5">
                                            {menuSections.map(sectionId => {
                                                const result   = testMap[sectionId]
                                                const isPassed = result && result.percentage >= 51
                                                const isFailed = result && result.percentage < 51

                                                return (
                                                    <div key={sectionId} className="flex items-center gap-2 py-0.5">
                                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${
                                                            isPassed ? 'bg-green-500 text-white'
                                                                : isFailed ? 'bg-red-400 text-white'
                                                                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-gray-400'
                                                        }`}>
                                                            {isPassed && <i className="fas fa-check"></i>}
                                                            {isFailed && <i className="fas fa-times"></i>}
                                                        </div>
                                                        <span className={`text-xs flex-1 truncate ${
                                                            isPassed ? 'text-text-dark dark:text-gray-300'
                                                                : isFailed ? 'text-red-500 dark:text-red-400'
                                                                    : 'text-text-light dark:text-gray-500'
                                                        }`}>
                                                            {sectionTitles[sectionId] || sectionId}
                                                        </span>
                                                        {result && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                                                isPassed
                                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                                                            }`}>
                                                                {result.percentage}%
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {activeTab === 'tests' && (
                        <div className="p-3">
                            {Object.keys(testMap).length === 0 ? (
                                <div className="text-center py-16 text-text-light dark:text-gray-500">
                                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <i className="fas fa-clipboard text-xl opacity-40"></i>
                                    </div>
                                    <p className="text-sm">Zatiaľ ste nevyplnili žiadny test</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-2 mb-3">
                                        <SumBox value={passedEntries.length} label="Splnené"   color="green" />
                                        <SumBox value={failedEntries.length} label="Nesplnené" color="red"   />
                                        <SumBox value={Object.keys(testMap).length} label="Celkovo" color="blue" />
                                    </div>

                                    <div className="space-y-2">
                                        {sortedResults.map((result, i) => {
                                            const sectionId = result.topic.replace(' ', '-')
                                            const isPassed  = result.percentage >= 51
                                            return (
                                                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                                                    isPassed
                                                        ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                                                        : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
                                                }`}>
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}>
                                                        <i className={`fas ${isPassed ? 'fa-check' : 'fa-times'} text-xs`}></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-text-dark dark:text-gray-200 truncate">
                                                            {sectionTitles[sectionId] || result.topic}
                                                        </p>
                                                        <p className="text-[10px] text-text-light dark:text-gray-500 flex items-center gap-1.5">
                                                            <span>{formatDate(result.date)}</span>
                                                            {result.timeSpent > 0 && <span>· {formatTime(result.timeSpent)}</span>}
                                                            <span>· {result.score}/{result.total}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className={`text-base font-black ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                                            {result.percentage}%
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-5 py-3 border-t border-border dark:border-gray-700 bg-surface dark:bg-gray-900/30 flex justify-between items-center flex-shrink-0">
                    <p className="text-[10px] text-text-light dark:text-gray-500">Pokrok sa ukladá do prehliadača</p>
                    <button
                        onClick={() => {
                            if (confirm('Naozaj chcete vymazať všetky výsledky testov?')) {
                                localStorage.removeItem('testResults')
                                setAllResults([])
                                setTestMap({})
                            }
                        }}
                        className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                        <i className="fas fa-trash-alt text-[10px]"></i> Vymazať pokrok
                    </button>
                </div>
            </div>
        </>
    )
}

export default ProgressModal