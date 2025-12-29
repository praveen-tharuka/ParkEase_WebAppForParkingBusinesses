import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import LoginSuccessPage from './pages/Auth/LoginSuccessPage'
import SignupSuccessPage from './pages/Auth/SignupSuccessPage'
import LoginErrorPage from './pages/Auth/LoginErrorPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />
        <Route path="/signup-success" element={<SignupSuccessPage />} />
        <Route path="/login-error" element={<LoginErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App
