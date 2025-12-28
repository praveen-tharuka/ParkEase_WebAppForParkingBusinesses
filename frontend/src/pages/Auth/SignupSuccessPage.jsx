import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navigation/Navbar'
import Footer from '../../components/Footer/Footer'

const SignupSuccessPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Created Successfully!</h1>
              <p className="text-gray-600">
                Welcome to ParkEase! Your account has been created and is ready to use. You can now log in and start booking parking spaces.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="text-6xl">🎉</div>
            </div>

            <div className="bg-brand bg-opacity-10 border border-brand rounded-lg p-4 text-sm text-brand">
              <p className="font-semibold">Registration Complete</p>
              <p className="mt-1">Your account has been created successfully. You can now log in and start booking parking!</p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
            >
              Proceed to Login
            </button>

            <Link
              to="/"
              className="block text-brand font-semibold hover:text-opacity-80 transition-colors"
            >
              Return to Home
            </Link>
          </div>

      
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">What You Can Do Next</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 flex items-start space-x-4 shadow-md">
                <div className="text-3xl flex-shrink-0">🔐</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Login</h3>
                  <p className="text-sm text-gray-600">Use your credentials to access your account</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex items-start space-x-4 shadow-md">
                <div className="text-3xl flex-shrink-0">🅿️</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Find Parking</h3>
                  <p className="text-sm text-gray-600">Browse available parking spaces near you</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex items-start space-x-4 shadow-md">
                <div className="text-3xl flex-shrink-0">📅</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reserve Ahead</h3>
                  <p className="text-sm text-gray-600">Book parking spaces in advance</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex items-start space-x-4 shadow-md">
                <div className="text-3xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track History</h3>
                  <p className="text-sm text-gray-600">View all your parking bookings and history</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignupSuccessPage
