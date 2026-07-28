import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

const HomePage = () => (
  <div className="home-page">
    <main>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
    <Footer />
  </div>
)

export default HomePage
