const HeroSection = () => {
  return (
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            ParkEase - Smart Parking Solutions
          </h1>
          
          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find, reserve, and manage parking spaces effortlessly. 
            Your smart solution for stress-free parking.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-3 bg-brand text-white text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-lg">
              Find Parking
            </button>
            <button className="px-8 py-3 border-2 border-brand text-brand text-lg font-semibold rounded-lg hover:bg-brand hover:text-white transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

