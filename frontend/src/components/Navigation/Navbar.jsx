import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    setIsMenuOpen(false)
    navigate('/')
  }

  // Check if we're on the landing page for hash link navigation
  const isLandingPage = location.pathname === '/'

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-brand">
              ParkEase
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8 md:flex-1 md:justify-center">
            {isLandingPage ? (
              <>
                <a href="#home" className="text-gray-700 hover:text-brand transition-colors">
                  Home
                </a>
                <a href="#features" className="text-gray-700 hover:text-brand transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-brand transition-colors">
                  How It Works
                </a>
                <a href="#about" className="text-gray-700 hover:text-brand transition-colors">
                  About
                </a>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-brand transition-colors">
                  Home
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/reservation/search" className="text-gray-700 hover:text-brand transition-colors">
                      Find Parking
                    </Link>
                    <Link to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} className="text-gray-700 hover:text-brand transition-colors">
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Desktop Auth/User Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-brand"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <span className="text-sm text-gray-700">{user?.name?.split(' ')[0]}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          if (user?.role === 'admin') {
                            navigate('/admin-dashboard')
                          } else {
                            navigate('/user-dashboard')
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        Dashboard
                      </button>
                      {user?.role !== 'admin' && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            navigate('/dashboard/reservations')
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          My Reservations
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md border-t border-gray-200 mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-brand transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-brand focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {isLandingPage ? (
                <>
                  <a
                    href="#home"
                    className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    Home
                  </a>
                  <a
                    href="#features"
                    className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    How It Works
                  </a>
                  <a
                    href="#about"
                    className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    About
                  </a>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/reservation/search"
                        className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                        onClick={toggleMenu}
                      >
                        Find Parking
                      </Link>
                      <Link
                        to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                        className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                        onClick={toggleMenu}
                      >
                        Dashboard
                      </Link>
                    </>
                  )}
                </>
              )}
              <div className="pt-4 space-y-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    {user?.role !== 'admin' && (
                      <Link
                        to="/dashboard/reservations"
                        className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                        onClick={toggleMenu}
                      >
                        My Reservations
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md block"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      className="w-full px-4 py-2 text-gray-700 hover:text-brand text-left rounded-md block"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup"
                      className="w-full px-4 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 block text-center"
                      onClick={toggleMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

