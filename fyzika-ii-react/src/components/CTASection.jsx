import React from 'react'
import { useNavigate } from 'react-router-dom'

const CTASection = () => {
    const navigate = useNavigate()

    const startCourse = () => {
        const body = document.body
        body.style.opacity = '0'
        body.style.transition = 'opacity 0.5s ease'

        setTimeout(() => {
            navigate('/content')
        }, 500)
    }

    return (
        <section className="py-24 px-8">

            <div className="max-w-3xl mx-auto text-center relative z-10">
                <h2 className="text-5xl font-bold mb-6 text-text-dark dark:text-white">
                    Ste pripravení začať?
                </h2>
                <p className="text-xl text-text-light dark:text-gray-300 mb-12">
                    Prejdite na prvú kapitolu a začnite svojou cestou svetom fyziky
                </p>

                <button
                    onClick={startCourse}
                    className="btn btn-primary btn-large"
                >
                    <i className="fas fa-book-open"></i>
                    Prejsť do kurzu
                </button>
            </div>
        </section>
    )
}

export default CTASection