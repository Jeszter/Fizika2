import React from 'react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()

    const startCourse = () => {
        navigate('/content')
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden">

            <div className="text-center max-w-4xl relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary-blue-bg dark:bg-gray-800 text-primary-blue dark:text-blue-400 px-6 py-3 rounded-full font-semibold mb-8 border border-border dark:border-gray-700 backdrop-blur-lg">
                    <i className="fas fa-graduation-cap"></i>
                    <span>Vzdelávací portál</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
                    Objavte krásu<br />
                    <span className="text-primary-blue dark:text-blue-400 relative inline-block">
                        Fyziky II

                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                    Komplexný vzdelávací portál pre študentov fyziky.
                    Preskúmajte elektromagnetizmus, optiku a modernú fyziku prostredníctvom prehľadných materiálov.
                </p>

                <div className="flex justify-center gap-8 md:gap-12 my-8">
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-primary-blue dark:text-blue-400 mb-2">12</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Kapitol</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-primary-blue dark:text-blue-400 mb-2">8</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Testov</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-primary-blue dark:text-blue-400 mb-2">24+</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Hodín</span>
                    </div>
                </div>

                <button
                    onClick={startCourse}
                    className="inline-flex items-center justify-center gap-4 px-12 py-6 rounded-custom font-semibold text-xl bg-primary-blue text-white shadow-custom hover:bg-primary-blue-dark hover:-translate-y-1 hover:shadow-custom-hover transition-all duration-300 relative overflow-hidden"
                >
                    <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 hover:translate-x-full"></span>
                    <i className="fas fa-play"></i>
                    Začať študovať
                </button>
            </div>
        </section>
    )
}

export default HeroSection