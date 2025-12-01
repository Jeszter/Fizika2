import React from 'react'
import Navigation from '../components/layout/Navigation'
import { Link } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'

const ContentPage = () => {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />

            <div className="pt-24 px-8">
                <div className="max-w-7xl mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-primary-blue dark:text-blue-400 hover:text-primary-blue-dark dark:hover:text-blue-300 transition-colors mb-8">
                        <i className="fas fa-arrow-left"></i>
                        Späť na hlavnú stránku
                    </Link>

                    <div className="text-center py-12">
                        <h1 className="text-5xl font-bold mb-6 text-text-dark dark:text-white">
                            Obsah kurzu Fyzika II
                        </h1>
                        <p className="text-xl text-text-light dark:text-gray-300 mb-8">
                            Tu bude obsah všetkých kapitol a testov...
                        </p>
                        <div className="mt-8 p-8 bg-surface dark:bg-gray-800 rounded-custom-xl shadow-custom dark:shadow-dark-custom">
                            <p className="text-text-light dark:text-gray-400">
                                Obsah stránky sa pripravuje...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentPage