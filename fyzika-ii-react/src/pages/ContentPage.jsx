import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import TestComponent from '../components/TestComponent'
import '../physics-content.css'

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
        <div className="max-w-6xl mx-auto pb-8 px-4 md:px-6 lg:px-8">
            <div className="mb-8 mt-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <div className="mb-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-blue/10 dark:bg-blue-500/20 text-primary-blue dark:text-blue-400 rounded-full text-sm font-medium">
                                <i className="fas fa-bookmark text-xs"></i>
                                <span>{getChapterNumber()}</span>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark dark:text-white break-words pr-12">
                            {sectionTitles[activeSection] || 'Kapitola kurzu'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="content-wrapper bg-white dark:bg-gray-800 shadow-custom dark:shadow-dark-custom border border-border dark:border-gray-700 overflow-x-hidden">
                {loading ? (
                    <div className="p-8 sm:p-10 md:p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary-blue dark:border-blue-400 mb-4"></div>
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
                <div className="navigation-buttons mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={navigateToPrevious}
                        disabled={isFirstSection}
                        className={`btn-nav w-full sm:flex-1 ${
                            isFirstSection
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'btn-secondary'
                        }`}
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        <span className="truncate">Predchádzajúca</span>
                    </button>

                    <button
                        onClick={() => onStartTest(activeSection)}
                        className="btn-nav btn-test w-full sm:flex-1 order-first sm:order-none"
                    >
                        <i className="fas fa-graduation-cap mr-2"></i>
                        <span className="truncate">Spustiť test</span>
                    </button>

                    <button
                        onClick={navigateToNext}
                        disabled={isLastSection}
                        className={`btn-nav w-full sm:flex-1 ${
                            isLastSection
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'btn-secondary'
                        }`}
                    >
                        <span className="truncate">Ďalšia</span>
                        <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            )}
        </div>
    )
})

const TestView = memo(({ testTopic }) => {
    const formatTopicName = useCallback((topicId) => {
        return topicId
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, []);

    return (
        <div className="max-w-6xl mx-auto pb-8 px-4 md:px-6 lg:px-8">
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
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                                <i className="fas fa-file-pen text-sm sm:text-lg"></i>
                            </div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-dark dark:text-white break-words pr-12">
                                {formatTopicName(testTopic)}
                            </h1>
                        </div>

                        <p className="text-text-light dark:text-gray-400 text-xs sm:text-sm">
                            Vyberte správne odpovede a overte svoje vedomosti
                        </p>
                    </div>
                </div>
            </div>

            <TestComponent topicId={testTopic} />
        </div>
    );
});

const ContentPage = ({ sidebarOpen, setSidebarOpen }) => {
    const { sectionId } = useParams()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState('coulombov-zakon')
    const [sectionContent, setSectionContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [showTest, setShowTest] = useState(false)
    const [testTopic, setTestTopic] = useState('')
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        window.addEventListener('orientationchange', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('orientationchange', handleResize)
        }
    }, [])

    useEffect(() => {
        if (isMobile) {
            const setVh = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            setVh();
            window.addEventListener('resize', setVh);
            window.addEventListener('orientationchange', setVh);
            return () => {
                window.removeEventListener('resize', setVh);
                window.removeEventListener('orientationchange', setVh);
            };
        }
    }, [isMobile])

    useEffect(() => {
        if (sectionId) {
            if (sectionId.startsWith('test-')) {
                const topicId = sectionId.replace('test-', '')
                if (sections.includes(topicId)) {
                    setTestTopic(topicId)
                    setShowTest(true)
                    document.title = `Test: ${sectionTitles[topicId]}`
                }
            } else if (sections.includes(sectionId)) {
                setActiveSection(sectionId)
                setShowTest(false)
                document.title = `${sectionTitles[sectionId]} - Fyzika pre stredné školy`
            } else if (sectionId !== 'content') {
                navigate('/coulombov-zakon', { replace: true })
            }
        }
    }, [sectionId, navigate])

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
            const newSectionId = e.detail.sectionId
            setActiveSection(newSectionId)
            setShowTest(false)
            navigate(`/${newSectionId}`, { replace: true })
        }

        const handleToggleSidebar = () => {
            setSidebarOpen(prev => !prev)
        }

        const handleCloseTest = () => {
            setShowTest(false)
            navigate(`/${activeSection}`, { replace: true })
        }

        window.addEventListener('sectionChange', handleSectionChange)
        window.addEventListener('toggleSidebar', handleToggleSidebar)
        window.addEventListener('closeTest', handleCloseTest)

        return () => {
            window.removeEventListener('sectionChange', handleSectionChange)
            window.removeEventListener('toggleSidebar', handleToggleSidebar)
            window.removeEventListener('closeTest', handleCloseTest)
        }
    }, [setSidebarOpen, activeSection, navigate])

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
        navigate(`/${sectionId}`, { replace: true })
        if (isMobile) {
            setSidebarOpen(false)
        }
    }, [setSidebarOpen, navigate, isMobile])

    const handleOverlayClick = useCallback((e) => {
        if (sidebarOpen && isMobile) {
            setSidebarOpen(false)
        }
    }, [sidebarOpen, setSidebarOpen, isMobile])

    const startTest = useCallback((topicId) => {
        setTestTopic(topicId)
        setShowTest(true)
        navigate(`/test-${topicId}`, { replace: true })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        const formattedTopicName = topicId
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        document.title = `Test: ${formattedTopicName}`;
    }, [navigate])

    return (
        <div className="relative min-h-screen flex flex-col">
            <nav className="fixed top-0 left-0 w-full py-3 px-4 md:px-6 z-50 flex justify-between items-center bg-white dark:bg-gray-900 border-b border-border dark:border-gray-800 shadow-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-primary-blue-bg dark:hover:bg-gray-700 transition-all duration-300 group"
                        aria-label={sidebarOpen ? "Zavrieť menu" : "Otvoriť menu"}
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-text-dark dark:text-gray-300 group-hover:text-primary-blue dark:group-hover:text-blue-400`}></i>
                    </button>

                    <a href="/" className="logo flex items-center gap-3 no-underline group">
                        <div className="logo-icon w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-lg flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 group-hover:scale-105">
                            F
                        </div>
                        <span className="text-xl font-bold text-text-dark dark:text-white">Fyzika II</span>
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        id="theme-toggle"
                        onClick={() => {
                            if (document.documentElement.classList.contains('dark')) {
                                document.documentElement.classList.remove('dark');
                                localStorage.setItem('theme', 'light');
                            } else {
                                document.documentElement.classList.add('dark');
                                localStorage.setItem('theme', 'dark');
                            }
                        }}
                        className="w-10 h-10 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm hover:scale-105"
                        aria-label="Prepnúť tému"
                    >
                        <i className="fas fa-moon text-text-dark dark:hidden"></i>
                        <i className="fas fa-sun text-yellow-400 hidden dark:block"></i>
                    </button>
                </div>
            </nav>

            <div
                className={`sidebar-wrapper fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ top: '64px', height: 'calc(100% - 64px)' }}
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

            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={handleOverlayClick}
                    style={{ top: '64px', height: 'calc(100% - 64px)' }}
                ></div>
            )}

            <div className={`flex-1 pt-20 transition-all duration-300 min-h-screen ${
                sidebarOpen && !isMobile ? 'md:ml-80' : ''
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