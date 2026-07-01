import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('parkease_token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.getCurrentUser()

        if (response.success) {
          setUser(response.data)

          localStorage.setItem(
            'parkease_user',
            JSON.stringify(response.data)
          )
        } else {
          localStorage.removeItem('parkease_token')
          localStorage.removeItem('parkease_user')
          localStorage.removeItem('parkease_refresh_token')
        }
      } catch (error) {
        console.error('Authentication check failed:', error)

        localStorage.removeItem('parkease_token')
        localStorage.removeItem('parkease_user')
        localStorage.removeItem('parkease_refresh_token')
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData)

    localStorage.setItem(
      'parkease_user',
      JSON.stringify(userData)
    )

    localStorage.setItem(
      'parkease_token',
      accessToken
    )

    localStorage.setItem(
      'parkease_refresh_token',
      refreshToken
    )
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }

    setUser(null)

    localStorage.removeItem('parkease_user')
    localStorage.removeItem('parkease_token')
    localStorage.removeItem('parkease_refresh_token')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role?.toUpperCase() === 'ADMIN',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext