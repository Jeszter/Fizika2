import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()
    const [typedText, setTypedText] = useState('')
    const [counts, setCounts] = useState({ chapters: 0, tests: 0, lessons: 0 })
    const fullText = 'Fyziky II'

    // Vygenerujeme pozície častíc LEN RAZ pomocou useMemo
    const particles = useMemo(() => {
        return [...Array(20)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${8 + Math.random() * 10}s`
        }))
    }, []) // Prázdne pole = vygeneruje sa len raz

    // Efekt písania
    useEffect(() => {
        let i = 0
        const typing = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.slice(0, i + 1))
                i++
            } else {
                clearInterval(typing)
            }
        }, 150)

        return () => clearInterval(typing)
    }, [])

    // Counter animácia
    useEffect(() => {
        const duration = 2000
        const steps = 60
        const interval = duration / steps

        let currentStep = 0

        const counter = setInterval(() => {
            currentStep++
            const progress = currentStep / steps

            setCounts({
                chapters: Math.min(12, Math.floor(12 * progress)),
                tests: Math.min(8, Math.floor(8 * progress)),
                lessons: Math.min(48, Math.floor(48 * progress))
            })

            if (currentStep >= steps) {
                clearInterval(counter)
            }
        }, interval)

        return () => clearInterval(counter)
    }, [])

    const startCourse = () => {
        setTimeout(() => navigate('/content'), 500)
    }

    const scrollToCTA = () => {
        document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

            {/* Animované častice v pozadí - TERAZ SA NETELEPORTUJÚ */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-500 rounded-full animate-float"
                        style={{
                            top: particle.top,
                            left: particle.left,
                            animationDelay: particle.delay,
                            animationDuration: particle.duration
                        }}
                    />
                ))}
            </div>

            {/* Hlavný obsah - ZVYŠOK NEZMENENÝ */}
            <div className="text-center max-w-4xl relative z-10">
                {/* Badge s animáciou */}
                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full font-semibold mb-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn">
                    <i className="fas fa-graduation-cap"></i>
                    <span>Vzdelávací portál</span>
                </div>

                {/* Hlavný nadpis */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white leading-tight animate-slideDown">
                    Objavte krásu<br />
                    <span className="text-blue-600 dark:text-blue-400 relative inline-block">
                        {typedText}
                    </span>
                </h1>

                {/* Popis */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{animationDelay: '0.3s'}}>
                    Komplexný vzdelávací portál pre študentov fyziky.
                    Preskúmajte <span className="font-semibold text-blue-600 dark:text-blue-400">elektromagnetizmus</span>,{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">optiku</span> a{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">modernú fyziku</span>{' '}
                    prostredníctvom prehľadných materiálov.
                </p>

                {/* Štatistiky */}
                <div className="flex justify-center gap-8 md:gap-12 my-8 animate-fadeIn" style={{animationDelay: '0.6s'}}>
                    <StatCard number={counts.chapters} label="Kapitol" icon="book-open" />
                    <StatCard number={counts.lessons} label="Lekcií" icon="video" />
                    <StatCard number={counts.tests} label="Testov" icon="puzzle-piece" />
                </div>

                {/* Hlavné tlačidlo */}
                <div className="animate-fadeIn" style={{animationDelay: '0.9s'}}>
                    <button
                        onClick={startCourse}
                        className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 rounded-2xl font-semibold text-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        <i className="fas fa-play animate-pulse"></i>
                        <span>Začať študovať</span>
                    </button>
                </div>

                {/* Scroll indikátor */}
                <button
                    onClick={scrollToCTA}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group animate-fadeIn"
                    style={{animationDelay: '1.2s'}}
                >
                </button>
            </div>
        </section>
    )
}

// Komponenta pre štatistiku
const StatCard = ({ number, label, icon }) => {
    return (
        <div className="text-center group cursor-pointer">
            <div className="relative">
                <span className="block text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                    {number}
                </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</span>
        </div>
    )
}

export default HeroSection