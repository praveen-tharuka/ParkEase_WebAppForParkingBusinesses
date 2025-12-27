import Navbar from '../components/Navigation/Navbar'
import HeroSection from '../components/Hero/HeroSection'
import FeaturesSection from '../components/Features/FeaturesSection'
import HowItWorksSection from '../components/HowItWorks/HowItWorksSection'
import StatisticsSection from '../components/Statistics/StatisticsSection'
import Footer from '../components/Footer/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <Footer />
    </div>
  )
}

export default LandingPage

