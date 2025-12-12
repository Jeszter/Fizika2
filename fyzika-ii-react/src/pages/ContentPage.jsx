import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import Sidebar from '../components/layout/Sidebar'
import TestComponent from '../components/TestComponent'
import '../physics-content.css'

const ContentSection = memo(({
                                 activeSection,
                                 sectionContent,
                                 loading,
                                 sectionTitles,
                                 getChapterNumber,
                                 onStartTest
                             }) => {
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

    useEffect(() => {
        if (window.MathJax && !loading && sectionContent) {
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
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                className="fixed top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md md:hidden"
                aria-label="Otvoriť menu"
            >
                <i className="fas fa-bars text-text-dark dark:text-gray-300"></i>
            </button>

            <div className="mb-8 mt-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
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
                        key={activeSection}
                        dangerouslySetInnerHTML={{ __html: sectionContent }}
                    />
                )}
            </div>

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
                        onClick={() => onStartTest(activeSection)}
                        className="btn-nav btn-test"
                    >
                        <i className="fas fa-graduation-cap"></i>
                        <span>Spustiť test</span>
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

const TestView = memo(({ testTopic }) => {
    const formatTopicName = useCallback((topicId) => {
        return topicId
            .replace('-', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, []);

    return (
        <div className="max-w-5xl mx-auto pb-8">
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                className="fixed top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md md:hidden"
                aria-label="Otvoriť menu"
            >
                <i className="fas fa-bars text-text-dark dark:text-gray-300"></i>
            </button>

            <div className="mb-8 mt-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium shadow-lg">
                                <i className="fas fa-graduation-cap text-xs"></i>
                                <span>Test z kapitoly</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <i className="fas fa-file-pen text-lg"></i>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white">
                                {formatTopicName(testTopic)}
                            </h1>
                        </div>

                        <p className="text-text-light dark:text-gray-400 text-sm">
                            Vyberte správne odpovede a overte svoje vedomosti
                        </p>
                    </div>
                </div>
            </div>

            <TestComponent topicId={testTopic} />
        </div>
    );
});

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
    const [showTest, setShowTest] = useState(false)
    const [testTopic, setTestTopic] = useState('')

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

    useEffect(() => {
        if (!showTest) {
            loadSection(activeSection)
        }
    }, [activeSection, loadSection, showTest])

    useEffect(() => {
        const handleSectionChange = (e) => {
            setActiveSection(e.detail.sectionId)
            setShowTest(false)
        }

        const handleToggleSidebar = () => {
            setSidebarOpen(prev => !prev)
        }

        const handleCloseTest = () => {
            setShowTest(false)
        }

        window.addEventListener('sectionChange', handleSectionChange)
        window.addEventListener('toggleSidebar', handleToggleSidebar)
        window.addEventListener('closeTest', handleCloseTest)

        return () => {
            window.removeEventListener('sectionChange', handleSectionChange)
            window.removeEventListener('toggleSidebar', handleToggleSidebar)
            window.removeEventListener('closeTest', handleCloseTest)
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
        setShowTest(false)
        if (window.innerWidth <= 768) {
            setSidebarOpen(false)
        }
    }, [setSidebarOpen])

    const handleOverlayClick = useCallback((e) => {
        if (sidebarOpen && window.innerWidth <= 768) {
            setSidebarOpen(false)
        }
    }, [sidebarOpen, setSidebarOpen])

    const startTest = useCallback((topicId) => {
        setTestTopic(topicId)
        setShowTest(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })

        const formattedTopicName = topicId
            .replace('-', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        const title = `Test: ${formattedTopicName}`;
        document.title = title;
    }, [])

    return (
        <div className="relative min-h-screen flex">
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

            {sidebarOpen && window.innerWidth <= 768 && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={handleOverlayClick}
                ></div>
            )}

            <div className={`content-area flex-1 pt-16 px-4 md:px-8 transition-all duration-300 min-h-screen ml-0 ${
                sidebarOpen && window.innerWidth > 768 ? 'md:ml-80' : ''
            }`}>
                {showTest ? (
                    <TestView testTopic={testTopic} />
                ) : (
                    <ContentSection
                        activeSection={activeSection}
                        sectionContent={sectionContent}
                        loading={loading}
                        sectionTitles={sectionTitles}
                        getChapterNumber={getChapterNumber}
                        onStartTest={startTest}
                    />
                )}
            </div>
        </div>
    )
}

export default ContentPage