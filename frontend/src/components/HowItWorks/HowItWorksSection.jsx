const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Sign Up / Create Account',
      description: 'Create your account in seconds. Simple registration process to get you started.',
    },
    {
      number: '2',
      title: 'Search / Find Parking',
      description: 'Enter your destination and find available parking spots nearby in real-time.',
    },
    {
      number: '3',
      title: 'Reserve / Book Spot',
      description: 'Select your preferred spot and reserve it instantly with just a few clicks.',
    },
    {
      number: '4',
      title: 'Park & Pay',
      description: 'Arrive at your reserved spot, park safely, and complete payment seamlessly.',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with ParkEase in four simple steps
          </p>
        </div>

        {/* Desktop Layout - Horizontal with connecting lines */}
        <div className="hidden md:flex md:items-start md:justify-between md:relative">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 relative z-10">
              <div className="flex flex-col items-center">
                {/* Step Number Circle */}
                <div className="w-16 h-16 bg-brand text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                  {step.number}
                </div>
                
                {/* Connecting Line (between steps) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-brand z-0" style={{ width: '50%', marginLeft: '50%' }}></div>
                )}
                
                {/* Step Content */}
                <div className="text-center max-w-xs px-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout - Vertical */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection

