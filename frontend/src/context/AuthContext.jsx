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

const mapBackendUserToFrontendUser = (backendUser) => {
  if (!backendUser) return null
  return {
    ...backendUser,
    name: backendUser.fullName || '',
    profilePicture: backendUser.profilePictureUrl || null,
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    const token = localStorage.getItem('parkease_token')
    if (token) {
      const response = await authAPI.getCurrentUser()
      if (response.success) {
        const mappedUser = mapBackendUserToFrontendUser(response.data.user)
        setUser(mappedUser)
        localStorage.setItem('parkease_user', JSON.stringify(mappedUser))
      } else {
        // Access token failed/expired; try to refresh it
        const refreshResponse = await authAPI.refreshToken()
        if (refreshResponse.success) {
          localStorage.setItem('parkease_token', refreshResponse.data.accessToken)
          localStorage.setItem('parkease_refresh_token', refreshResponse.data.refreshToken)
          const mappedUser = mapBackendUserToFrontendUser(refreshResponse.data.user)
          setUser(mappedUser)
          localStorage.setItem('parkease_user', JSON.stringify(mappedUser))
        } else {
          // Refresh token also invalid/expired; log out
          logout()
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (emailOrUserData, password) => {
    if (typeof emailOrUserData === 'string') {
      // Real API authentication
      const response = await authAPI.login({ email: emailOrUserData, password })
      if (response.success) {
        localStorage.setItem('parkease_token', response.data.accessToken)
        localStorage.setItem('parkease_refresh_token', response.data.refreshToken)
        const mappedUser = mapBackendUserToFrontendUser(response.data.user)
        setUser(mappedUser)
        localStorage.setItem('parkease_user', JSON.stringify(mappedUser))
        return { success: true, user: mappedUser }
      } else {
        return { success: false, error: response.error }
      }
    } else {
      // Backward compatibility for mock logins
      setUser(emailOrUserData)
      localStorage.setItem('parkease_user', JSON.stringify(emailOrUserData))
      return { success: true, user: emailOrUserData }
    }
  }

  const signup = async (userData) => {
    const response = await authAPI.signup(userData)
    return response
  }

  const updateUser = (updatedUserData) => {
    const mappedUser = mapBackendUserToFrontendUser(updatedUserData)
    setUser(mappedUser)
    localStorage.setItem('parkease_user', JSON.stringify(mappedUser))
  }

  const logout = async () => {
    await authAPI.logout().catch(() => {})
    setUser(null)
    localStorage.removeItem('parkease_user')
    localStorage.removeItem('parkease_token')
    localStorage.removeItem('parkease_refresh_token')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
    isAdmin: user?.role?.toUpperCase() === 'ADMIN',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
