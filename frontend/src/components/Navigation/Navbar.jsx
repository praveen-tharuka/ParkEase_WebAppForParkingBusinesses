import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Check if we're on the landing page for hash link navigation
  const isLandingPage = location.pathname === '/'

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
                <Link to="/search" className="text-gray-700 hover:text-brand transition-colors">
                  Find Parking
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-brand transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 transition-colors">
              Sign Up
            </Link>
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
                  <Link
                    to="/search"
                    className="block px-3 py-2 text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    Find Parking
                  </Link>
                </>
              )}
              <div className="pt-4 space-y-2">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

