import React, { useState, useEffect } from 'react'
import { getTestResults, buildTestMap } from './Progressmodal'
import { getCourseData } from '../../utils/courseCms'

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({
    activeSection,
    onSectionSelect,
    sections,
    sectionTitles,
    setSidebarOpen,
    teacherEditMode = false,
    onRenameGroup,
    onRenameChapter,
    onDeleteGroup,
    onDeleteChapter,
}) => {
    const [openMenus, setOpenMenus] = useState(['electrostatics', 'current'])
    const [testMap, setTestMap]     = useState({})
    const course = getCourseData()

    useEffect(() => {
        setTestMap(buildTestMap(getTestResults()))
    }, [activeSection])

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'testResults') setTestMap(buildTestMap(getTestResults()))
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    useEffect(() => {
        const chapter = course.chapters.find(item => item.id === activeSection)
        if (chapter && !openMenus.includes(chapter.groupId)) {
            setOpenMenus(prev => [...prev, chapter.groupId])
        }
    }, [activeSection])

    const menuData = course.groups.map(group => {
        const groupChapters = course.chapters
            .filter(chapter => chapter.groupId === group.id)
            .sort((a, b) => a.order - b.order)
        const ordered = groupChapters
            .filter(chapter => !chapter.parentId)
            .flatMap(chapter => [chapter, ...groupChapters.filter(child => child.parentId === chapter.id)])
        return {
            ...group,
            description: `${ordered.length} kapitol`,
            sections: ordered.map(chapter => chapter.id),
        }
    }).filter(menu => menu.sections.length)
    const orderedMenuSections = menuData.flatMap(menu => menu.sections)

    const handleSectionSelect = (sectionId) => {
        onSectionSelect(sectionId)
    }

    const editGroupTitle = (event, menu) => {
        event.preventDefault()
        event.stopPropagation()
        const title = window.prompt('Názov oddielu:', menu.title)?.trim()
        if (title && title !== menu.title) onRenameGroup?.(menu.id, title)
    }

    const editChapterTitle = (event, sectionId) => {
        event.preventDefault()
        event.stopPropagation()
        const currentTitle = sectionTitles[sectionId] || sectionId
        const title = window.prompt('Názov kapitoly:', currentTitle)?.trim()
        if (title && title !== currentTitle) onRenameChapter?.(sectionId, title)
    }

    const readSections = sections.filter(s => testMap[s] && testMap[s].percentage >= 51)
    const readCount    = readSections.length
    const pct          = sections.length > 0 ? Math.round((readCount / sections.length) * 100) : 0

    return (
        <div
            className="w-80 h-full bg-white dark:bg-gray-800 border-r border-border dark:border-gray-700 shadow-lg flex flex-col"
            onClick={e => e.stopPropagation()}
        >
            <div className="p-6 border-b border-border dark:border-gray-700 bg-primary-blue-bg dark:bg-gray-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-lg flex items-center justify-center shadow-md">
                            <i className="fas fa-book text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 className="text-primary-blue dark:text-blue-400 font-semibold text-lg">Obsah kurzu</h3>
                            <p className="text-text-light dark:text-gray-400 text-sm">{sections.length} kapitol</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                        <i className="fas fa-times text-text-dark dark:text-gray-300"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <ul className="p-4">
                    {menuData.map((menu) => (
                        <li key={menu.id} className="menu-item mb-2">
                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenus(prev =>
                                        prev.includes(menu.id) ? prev.filter(id => id !== menu.id) : [...prev, menu.id]
                                    )}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                    openMenus.includes(menu.id)
                                        ? 'bg-primary-blue/10 dark:bg-blue-500/20 text-primary-blue dark:text-blue-400'
                                        : 'text-text-dark dark:text-gray-300 hover:bg-primary-blue-bg dark:hover:bg-gray-700/50'
                                } ${teacherEditMode ? 'pr-24' : ''}`}
                                >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        openMenus.includes(menu.id)
                                            ? 'bg-primary-blue/20 dark:bg-blue-500/30'
                                            : 'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                        <i className={`fas ${menu.icon} ${
                                            openMenus.includes(menu.id)
                                                ? 'text-primary-blue dark:text-blue-400'
                                                : 'text-text-light dark:text-gray-400'
                                        }`}></i>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-sm">{menu.title}</div>
                                        <div className="text-xs text-text-light dark:text-gray-400">{menu.description}</div>
                                    </div>
                                </div>
                                    <i className={`fas fa-chevron-down transition-transform duration-300 ${
                                    openMenus.includes(menu.id)
                                        ? 'rotate-180 text-primary-blue dark:text-blue-400'
                                        : 'text-text-light dark:text-gray-400'
                                }`}></i>
                                </button>
                                {teacherEditMode && (
                                    <button
                                        type="button"
                                        onClick={event => editGroupTitle(event, menu)}
                                        className="teacher-sidebar-pencil absolute right-12 top-1/2 -translate-y-1/2"
                                        aria-label={`Upraviť názov oddielu ${menu.title}`}
                                        title="Upraviť názov oddielu"
                                    >
                                        <i className="fas fa-pen"></i>
                                    </button>
                                )}
                                {teacherEditMode && (
                                    <button
                                        type="button"
                                        onClick={event => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            onDeleteGroup?.(menu.id)
                                        }}
                                        className="teacher-sidebar-delete absolute right-2 top-1/2 -translate-y-1/2"
                                        aria-label={`Odstrániť oddiel ${menu.title}`}
                                        title="Odstrániť oddiel"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                            </div>

                            <ul className={`submenu pl-4 overflow-hidden transition-all duration-300 ${
                                openMenus.includes(menu.id) ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                            }`}>
                                {menu.sections.map((sectionId) => {
                                    const isActive = activeSection === sectionId
                                    const index    = orderedMenuSections.indexOf(sectionId)
                                    const isSubchapter = Boolean(course.chapters.find(chapter => chapter.id === sectionId)?.parentId)
                                    const result   = testMap[sectionId]
                                    const isPassed = result && result.percentage >= 51
                                    const isFailed = result && result.percentage < 51

                                    return (
                                        <li key={sectionId} className="mb-1 relative">
                                            <button
                                                onClick={() => handleSectionSelect(sectionId)}
                                                className={`w-full text-left p-3 ${isSubchapter ? 'pl-16' : 'pl-12'} ${teacherEditMode ? 'pr-20' : ''} rounded-lg transition-colors duration-200 relative group min-h-[56px] ${
                                                    isActive
                                                        ? 'bg-primary-blue/10 dark:bg-blue-500/20 text-primary-blue dark:text-blue-400'
                                                        : 'hover:bg-primary-blue/5 dark:hover:bg-blue-500/10 text-text-dark dark:text-gray-400'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                        isPassed
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                            : isFailed
                                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                                                                : isActive
                                                                    ? 'bg-primary-blue text-white'
                                                                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-gray-400'
                                                    }`}>
                                                        {index + 1}
                                                    </div>

                                                    <span className={`flex-1 text-left text-sm leading-snug whitespace-normal ${
                                                        isActive
                                                            ? 'text-primary-blue dark:text-blue-400'
                                                            : 'text-text-dark dark:text-gray-400 group-hover:text-primary-blue dark:group-hover:text-blue-300'
                                                    }`}>
                                                        {sectionTitles[sectionId] || sectionId}
                                                    </span>

                                                    {result && (
                                                        <span className={`text-[10px] font-bold px-1 py-0.5 rounded flex-shrink-0 ${
                                                            isPassed
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                                : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                                                        }`}>
                                                            {result.percentage}%
                                                        </span>
                                                    )}
                                                </div>
                                                {isActive && (
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-blue dark:bg-blue-400"></span>
                                                )}
                                            </button>
                                            {teacherEditMode && (
                                                <button
                                                    type="button"
                                                    onClick={event => editChapterTitle(event, sectionId)}
                                                    className="teacher-sidebar-pencil absolute right-11 top-1/2 -translate-y-1/2"
                                                    aria-label={`Upraviť názov kapitoly ${sectionTitles[sectionId] || sectionId}`}
                                                    title="Upraviť názov kapitoly"
                                                >
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                            )}
                                            {teacherEditMode && (
                                                <button
                                                    type="button"
                                                    onClick={event => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        onDeleteChapter?.(sectionId)
                                                    }}
                                                    className="teacher-sidebar-delete absolute right-2 top-1/2 -translate-y-1/2"
                                                    aria-label={`Odstrániť kapitolu ${sectionTitles[sectionId] || sectionId}`}
                                                    title="Odstrániť kapitolu"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            {!teacherEditMode && <div className="p-4 border-t border-border dark:border-gray-700 bg-surface dark:bg-gray-900/30">
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openProgress'))}
                    className="w-full group"
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-sm font-semibold text-text-dark dark:text-gray-300 flex items-center gap-2">
                            <i className="fas fa-chart-line text-primary-blue dark:text-blue-400"></i>
                            Váš pokrok
                        </h4>
                        <span className="text-xs text-primary-blue dark:text-blue-400 group-hover:underline flex items-center gap-1">
                            Detail <i className="fas fa-arrow-right text-[10px]"></i>
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-text-light dark:text-gray-400 mb-1">
                        <span>Dokončené kapitoly</span>
                        <span>{readCount} / {sections.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-primary-blue dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </button>
            </div>}
        </div>
    )
}

export default Sidebar
