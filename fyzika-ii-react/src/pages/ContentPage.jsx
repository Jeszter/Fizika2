import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import Sidebar from '../components/layout/Sidebar'
import '../physics-content.css'

// Мемоизируем компонент, чтобы избежать лишних ререндеров
const ContentSection = memo(({ activeSection, sectionContent, loading, sectionTitles, getChapterNumber }) => {
    const contentRef = useRef(null)
    const currentIndex = sections.indexOf(activeSection)
    const isFirstSection = currentIndex === 0
    const isLastSection = currentIndex === sections.length - 1

    const navigateToPrevious = () => {
        const currentIndex = sections.indexOf(activeSection)
        if (currentIndex > 0) {
            window.dispatchEvent(new CustomEvent('sectionChange', {
                detail: { sectionId: sections[currentIndex - 1] }
            }))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const navigateToNext = () => {
        const currentIndex = sections.indexOf(activeSection)
        if (currentIndex < sections.length - 1) {
            window.dispatchEvent(new CustomEvent('sectionChange', {
                detail: { sectionId: sections[currentIndex + 1] }
            }))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    // Рендерим формулы только после полной загрузки
    useEffect(() => {
        if (window.MathJax && !loading && sectionContent) {
            // Даем время для рендеринга DOM
            const timer = setTimeout(() => {
                if (contentRef.current) {
                    window.MathJax.typesetPromise([contentRef.current])
                        .catch(err => console.log('MathJax typeset error:', err))
                }
            }, 150)
            return () => clearTimeout(timer)
        }
    }, [sectionContent, loading, activeSection])

    return (
        <div className="max-w-5xl mx-auto pb-8">
            {/* Кнопка открытия сайдбара на мобильных */}
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                className="fixed top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md md:hidden"
                aria-label="Otvoriť menu"
            >
                <i className="fas fa-bars text-text-dark dark:text-gray-300"></i>
            </button>

            {/* Заголовок */}
            <div className="mb-8 mt-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-blue/10 dark:bg-blue-500/20 text-primary-blue dark:text-blue-400 rounded-full text-sm font-medium">
                                <i className="fas fa-bookmark text-xs"></i>
                                <span>{getChapterNumber()}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-white">
                            {sectionTitles[activeSection] || 'Kapitola kurzu'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Контент с физическими стилями */}
            <div className="content-wrapper bg-white dark:bg-gray-800 shadow-custom dark:shadow-dark-custom border border-border dark:border-gray-700">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue dark:border-blue-400 mb-4"></div>
                        <p className="text-text-light dark:text-gray-400">Načítavam obsah...</p>
                    </div>
                ) : (
                    <div
                        ref={contentRef}
                        className="physics-content"
                        key={activeSection} // Ключ для принудительного ререндера при смене секции
                        dangerouslySetInnerHTML={{ __html: sectionContent }}
                    />
                )}
            </div>

            {/* Навигационные кнопки */}
            {!loading && (
                <div className="navigation-buttons mt-8">
                    <button
                        onClick={navigateToPrevious}
                        disabled={isFirstSection}
                        className={`btn-nav ${
                            isFirstSection
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'btn-secondary'
                        }`}
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Predchádzajúca kapitola</span>
                    </button>

                    <button
                        onClick={navigateToNext}
                        disabled={isLastSection}
                        className={`btn-nav ${
                            isLastSection
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'btn-secondary'
                        }`}
                    >
                        <span>Ďalšia kapitola</span>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            )}
        </div>
    )
})

// Выносим sections наружу, чтобы они были доступны в обоих компонентах
const sections = [
    'coulombov-zakon',
    'intenzita-pola',
    'tok-intenzity',
    'praca-potencial',
    'pohyb-castice',
    'energia-sustavy',
    'kapacita',
    'dielektrika',
    'intenzita-proudu',
    'ohmov-zakon',
    'elektromotoricke-napatie'
]

const sectionTitles = {
    'coulombov-zakon': 'Coulombov zákon',
    'intenzita-pola': 'Intenzita elektrostatického poľa',
    'tok-intenzity': 'Tok intenzity elektrostatického poľa, Gaussov zákon',
    'praca-potencial': 'Práca a potenciálna energia v elektrostatickom poli',
    'pohyb-castice': 'Pohyb nabitej častice v elektrickom poli',
    'energia-sustavy': 'Energia sústavy nábojov, nabitého vodiča a elektrostatického poľa',
    'kapacita': 'Kapacita vodiča, elektrický kondenzátor',
    'dielektrika': 'Dielektriká',
    'intenzita-proudu': 'Intenzita prúdu, hustota prúdu',
    'ohmov-zakon': 'Ohmov zákon, Jouleov zákon',
    'elektromotoricke-napatie': 'Elektromotorické napätie'
}

const ContentPage = ({ sidebarOpen, setSidebarOpen }) => {
    const [activeSection, setActiveSection] = useState('coulombov-zakon')
    const [sectionContent, setSectionContent] = useState('')
    const [loading, setLoading] = useState(true)

    const loadSection = useCallback(async (sectionId) => {
        setLoading(true)

        try {
            const response = await fetch(`/content/${sectionId}.html`)
            if (!response.ok) throw new Error('Failed to load content')
            let htmlContent = await response.text()

            htmlContent = htmlContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            htmlContent = htmlContent.replace(/<div class="animated-bg"><\/div>/gi, '')
            htmlContent = htmlContent.replace(/<div class="floating-shapes">.*?<\/div>/gs, '')

            setSectionContent(htmlContent)
        } catch (error) {
            console.error('Error loading section:', error)
            setSectionContent(`
                <div class="section active" id="error">
                    <h2><i class="fas fa-exclamation-triangle"></i> Chyba pri načítavaní</h2>
                    <p>Obsah sekcie sa nepodarilo načítať. Skúste to prosím neskôr.</p>
                </div>
            `)
        } finally {
            setLoading(false)
        }
    }, [])

    // Загружаем секцию при смене activeSection
    useEffect(() => {
        loadSection(activeSection)
    }, [activeSection, loadSection])

    // Слушаем события изменения секции
    useEffect(() => {
        const handleSectionChange = (e) => {
            setActiveSection(e.detail.sectionId)
        }

        const handleToggleSidebar = () => {
            setSidebarOpen(prev => !prev)
        }

        window.addEventListener('sectionChange', handleSectionChange)
        window.addEventListener('toggleSidebar', handleToggleSidebar)

        return () => {
            window.removeEventListener('sectionChange', handleSectionChange)
            window.removeEventListener('toggleSidebar', handleToggleSidebar)
        }
    }, [setSidebarOpen])

    const getChapterNumber = useCallback(() => {
        const currentIndex = sections.indexOf(activeSection)

        if (currentIndex <= 8) {
            return `Kapitola ${currentIndex + 1} z 9`
        } else {
            const topicIndex = currentIndex - 9
            return `Kapitola ${topicIndex + 1} z 3`
        }
    }, [activeSection])

    const handleSectionSelect = useCallback((sectionId) => {
        setActiveSection(sectionId)
        if (window.innerWidth <= 768) {
            setSidebarOpen(false)
        }
    }, [setSidebarOpen])

    const handleOverlayClick = useCallback((e) => {
        if (sidebarOpen && window.innerWidth <= 768) {
            setSidebarOpen(false)
        }
    }, [sidebarOpen, setSidebarOpen])

    return (
        <div className="relative min-h-screen flex">
            {/* Сайдбар */}
            <div
                className={`sidebar-wrapper fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar
                    activeSection={activeSection}
                    onSectionSelect={handleSectionSelect}
                    sections={sections}
                    sectionTitles={sectionTitles}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    getChapterNumber={getChapterNumber}
                />
            </div>

            {/* Overlay для мобильных */}
            {sidebarOpen && window.innerWidth <= 768 && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={handleOverlayClick}
                ></div>
            )}

            {/* Основной контент - фиксированная ширина */}
            <div className={`content-area flex-1 pt-16 px-4 md:px-8 transition-all duration-300 min-h-screen ml-0 ${
                sidebarOpen && window.innerWidth > 768 ? 'md:ml-80' : ''
            }`}>
                <ContentSection
                    activeSection={activeSection}
                    sectionContent={sectionContent}
                    loading={loading}
                    sectionTitles={sectionTitles}
                    getChapterNumber={getChapterNumber}
                />
            </div>
        </div>
    )
}

export default ContentPage