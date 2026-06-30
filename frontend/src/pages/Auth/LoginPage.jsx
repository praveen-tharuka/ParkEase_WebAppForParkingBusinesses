import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockUser, mockAdmin, MOCK_CREDENTIALS, MOCK_ADMIN_CREDENTIALS } from '../../data/mockUserData'
import Navbar from '../../components/Navigation/Navbar'
import Footer from '../../components/Footer/Footer'

const LoginPage = () => {
  const [loginType, setLoginType] = useState('user') // 'user' or 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { login, logout } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email or username is required'
    } else if (
      !email.includes('@') &&
      email.length < 3
    ) {
      newErrors.email = 'Please enter a valid email or username'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await login(email, password)
      if (response.success) {
        const userRole = response.user.role
        if (loginType === 'admin') {
          if (userRole === 'ADMIN' || userRole === 'OFFICER') {
            navigate('/admin-dashboard')
          } else {
            setErrors({ email: 'Access denied: You do not have administrator permissions.' })
            await logout().catch(() => {})
          }
        } else {
          navigate('/user-dashboard')
        }
      } else {
        setErrors({ submit: response.error || 'Invalid email or password' })
      }
    } catch (err) {
      console.error('Login Error:', err)
      setErrors({ submit: 'An unexpected error occurred. Please try again later.' })
    }
  }

  const clearForm = () => {
    setEmail('')
    setPassword('')
    setErrors({})
  }

  const handleTabChange = (type) => {
    setLoginType(type)
    clearForm()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your ParkEase account</p>
          </div>

          {/* Login Type Tabs */}
          <div className="flex gap-4 mb-6 bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => handleTabChange('user')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === 'user'
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Admin Login
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                {errors.submit}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: '' })
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={loginType === 'user' ? "Enter your email or username" : "Enter admin email or username"}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: '' })
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a href="#forgot" className="text-sm text-brand hover:text-opacity-80 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
            >
              Login as {loginType === 'user' ? 'User' : 'Admin'}
            </button>

            {/* Demo Credentials */}
            <div className={`border rounded-lg p-3 text-sm ${
              loginType === 'user'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-purple-50 border-purple-200 text-purple-700'
            }`}>
              <p className="font-semibold">Demo Credentials:</p>
              {loginType === 'user' ? (
                <>
                  <p>Email: praveen@parkease.com | Password: password123</p>
                  <p className="mt-1 text-xs">Or use username: praveen</p>
                </>
              ) : (
                <>
                  <p>Email: admin@parkease.com | Password: admin123</p>
                  <p className="mt-1 text-xs">Or use username: admin</p>
                </>
              )}
            </div>
          </form>

          {loginType === 'user' && (
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand font-semibold hover:text-opacity-80 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LoginPage
