import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockUser } from '../../data/mockUserData'
import Navbar from '../../components/Navigation/Navbar'
import Footer from '../../components/Footer/Footer'

const LoginSuccessPage = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  // Ensure user is authenticated when they reach this page
  // This is a safety check in case they navigate directly
  useEffect(() => {
    if (!isAuthenticated) {
      login(mockUser)
    }
  }, [isAuthenticated, login])

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">
                You have successfully logged into your ParkEase account. You're all set to find and reserve parking.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="text-6xl">🚗</div>
            </div>

            <div className="bg-brand bg-opacity-10 border border-brand rounded-lg p-4 text-sm text-brand">
              <p className="font-semibold">Account Status: Active</p>
              <p className="mt-1">All features are available. Start booking parking spaces now!</p>
            </div>

            <button
              onClick={() => navigate('/user-dashboard')}
              className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
            >
              Go to Dashboard
            </button>

            <Link
              to="/"
              className="block text-brand font-semibold hover:text-opacity-80 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🅿️</div>
              <h3 className="font-semibold text-gray-900">Quick Booking</h3>
              <p className="text-sm text-gray-600 mt-1">Reserve parking in seconds</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <h3 className="font-semibold text-gray-900">Track Parking</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor your bookings anytime</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2">🔧</div>
              <h3 className="font-semibold text-gray-900">Manage Vehicles</h3>
              <p className="text-sm text-gray-600 mt-1">Add and manage multiple vehicles</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LoginSuccessPage
