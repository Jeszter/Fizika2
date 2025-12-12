
import React from 'react'
import Navigation from '../components/layout/Navigation'
import AnimatedBackground from '../components/AnimatedBackground'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

const HomePage = () => {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />

            <main>
                <HeroSection />
                <FeaturesSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}

export default HomePage