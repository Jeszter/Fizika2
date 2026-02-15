import React, { useState, useEffect } from 'react'

const Sidebar = ({ activeSection, onSectionSelect, sections, sectionTitles, sidebarOpen, setSidebarOpen }) => {
    const [openMenus, setOpenMenus] = useState(['elektrostatika', 'elektricky-proud'])

    useEffect(() => {
        const index = sections.indexOf(activeSection)
        if (index >= 0 && index <= 8) {
            if (!openMenus.includes('elektrostatika')) {
                setOpenMenus(prev => [...prev, 'elektrostatika'])
            }
        } else if (index >= 9) {
            if (!openMenus.includes('elektricky-proud')) {
                setOpenMenus(prev => [...prev, 'elektricky-proud'])
            }
        }
    }, [activeSection])

    const toggleSubmenu = (menuId) => {
        setOpenMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        )
    }

    const isSubmenuOpen = (menuId) => openMenus.includes(menuId)

    const elektrostatikaSections = sections.slice(0, 8)
    const elektrickyProudSections = sections.slice(8, 11)
    const magnetickePoleSections = sections.slice(11, 18)
    const elektromagnetickePoleSections = sections.slice(18, 22)
    const maxwellSections = sections.slice(22)


    const menuData = [
        {
            id: 'elektrostatika',
            icon: 'fa-bolt',
            title: 'Elektrostatické pole',
            description: '8 kapitol',
            sections: elektrostatikaSections
        },
        {
            id: 'elektricky-proud',
            icon: 'fa-bolt',
            title: 'Elektrický prúd v kovoch',
            description: '3 kapitoly',
            sections: elektrickyProudSections
        },
        {
            id: 'magneticke-pole',
            icon: 'fa-magnet',
            title: 'Magnetické pole',
            description: '7 kapitol',
            sections: magnetickePoleSections
        },
        {
            id: 'elektromagneticke-pole',
            icon: 'fa-wave-square',
            title: 'Elektromagnetické pole',
            description: '4 kapitoly',
            sections: elektromagnetickePoleSections
        },
        {
            id: 'maxwell',
            icon: 'fa-atom',
            title: 'Maxwellove rovnice',
            description: '1 kapitola',
            sections: maxwellSections
        }
    ]


    const handleSectionSelect = (sectionId) => {
        window.dispatchEvent(new CustomEvent('sectionChange', {
            detail: { sectionId }
        }))
        onSectionSelect(sectionId)
    }

    const handleSidebarClick = (e) => {
        e.stopPropagation()
    }

    return (
        <div
            className="w-80 h-full bg-white dark:bg-gray-800 border-r border-border dark:border-gray-700 shadow-lg flex flex-col"
            onClick={handleSidebarClick}
        >
            <div className="p-6 border-b border-border dark:border-gray-700 bg-primary-blue-bg dark:bg-gray-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-lg flex items-center justify-center shadow-md">
                            <i className="fas fa-book text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 className="text-primary-blue dark:text-blue-400 font-semibold text-lg">Obsah kurzu</h3>
                            <p className="text-text-light dark:text-gray-400 text-sm">
                                {sections.length} kapitol
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                        aria-label="Zavrieť menu"
                    >
                        <i className="fas fa-times text-text-dark dark:text-gray-300"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <ul className="p-4">
                    {menuData.map((menu) => (
                        <li key={menu.id} className="menu-item mb-2">
                            <button
                                onClick={() => toggleSubmenu(menu.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                    isSubmenuOpen(menu.id)
                                        ? 'bg-primary-blue/10 dark:bg-blue-500/20 text-primary-blue dark:text-blue-400'
                                        : 'text-text-dark dark:text-gray-300 hover:bg-primary-blue-bg dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        isSubmenuOpen(menu.id)
                                            ? 'bg-primary-blue/20 dark:bg-blue-500/30'
                                            : 'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                        <i className={`fas ${menu.icon} ${
                                            isSubmenuOpen(menu.id)
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
                                    isSubmenuOpen(menu.id)
                                        ? 'rotate-180 text-primary-blue dark:text-blue-400'
                                        : 'text-text-light dark:text-gray-400'
                                }`}></i>
                            </button>

                            <ul className={`submenu pl-4 overflow-hidden transition-all duration-300 ${
                                isSubmenuOpen(menu.id) ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                            }`}>
                                {menu.sections.map((sectionId) => {
                                    const isActive = activeSection === sectionId
                                    const index = sections.indexOf(sectionId)

                                    return (
                                        <li key={sectionId} className="mb-1">
                                            <button
                                                onClick={() => handleSectionSelect(sectionId)}
                                                className={`w-full text-left p-3 pl-12 rounded-lg transition-colors duration-200 relative group min-h-[56px] ${
                                                    isActive
                                                        ? 'bg-primary-blue/10 dark:bg-blue-500/20 text-primary-blue dark:text-blue-400'
                                                        : 'hover:bg-primary-blue/5 dark:hover:bg-blue-500/10 text-text-dark dark:text-gray-400'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                        isActive
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
                                                </div>
                                                {isActive && (
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-blue dark:bg-blue-400"></span>
                                                )}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-6 border-t border-border dark:border-gray-700 bg-surface dark:bg-gray-900/30">
                <h4 className="text-sm font-semibold text-text-dark dark:text-gray-300 mb-3 flex items-center gap-2">
                    <i className="fas fa-chart-line"></i>
                    Váš pokrok
                </h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-text-light dark:text-gray-400">
                        <span>Dokončené kapitoly</span>
                        <span>{sections.indexOf(activeSection) + 1} / {sections.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-primary-blue dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${((sections.indexOf(activeSection) + 1) / sections.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar