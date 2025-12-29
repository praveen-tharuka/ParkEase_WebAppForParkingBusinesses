import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navigation/Navbar'
import Footer from '../../components/Footer/Footer'

const LoginErrorPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Login Failed</h1>
              <p className="text-gray-600">
                Invalid email or password. Please check your credentials and try again.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="text-6xl">⚠️</div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-1">The email/username or password you entered is incorrect.</p>
              <p className="mt-2 text-xs opacity-80">Please verify and try again</p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
            >
              Try Again
            </button>

            <div className="border-t pt-4">
              <p className="text-gray-700 text-sm mb-3">
                Don't have an account?
              </p>
              <Link
                to="/signup"
                className="block w-full py-2 border-2 border-brand text-brand font-semibold rounded-lg hover:bg-brand hover:text-white transition-colors"
              >
                Create New Account
              </Link>
            </div>

            <Link
              to="/login"
              className="block text-brand font-semibold hover:text-opacity-80 transition-colors text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Troubleshooting Tips</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-brand font-bold">1.</span>
                <span>Make sure you're using the correct email address or username</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-brand font-bold">2.</span>
                <span>Check if CAPS LOCK is on and correct any typos in your password</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-brand font-bold">3.</span>
                <span>If you forgot your password, use the "Forgot Password" option</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-brand font-bold">4.</span>
                <span>If you don't have an account yet, sign up for a new one</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            <p className="font-semibold">Testing Credentials:</p>
            <p>Email: user@parkease.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LoginErrorPage
