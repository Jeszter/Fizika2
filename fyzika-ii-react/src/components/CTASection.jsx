import React from 'react'
import { useNavigate } from 'react-router-dom'

const CTASection = () => {
    const navigate = useNavigate()

    const startCourse = () => {
        setTimeout(() => navigate('/content'), 500)
    }

    return (
        <section className="py-24 px-8 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
            {/* Jednoduché animované pozadie */}
            <div className="absolute inset-0 opacity-10">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-32 h-32 bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `pulse ${5 + Math.random() * 5}s infinite`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-3xl mx-auto text-center relative z-10">
                <h2 className="text-5xl font-bold mb-6 text-white">
                    Ste pripravení začať?
                </h2>
                <p className="text-xl text-white/90 mb-12">
                    Prejdite na prvú kapitolu a začnite svojou cestou svetom fyziky
                </p>

                <button
                    onClick={startCourse}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                    <i className="fas fa-play"></i>
                    <span>Začať študovať</span>
                </button>
            </div>
        </section>
    )
}

export default CTASection