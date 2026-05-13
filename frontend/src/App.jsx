import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import LoginSuccessPage from './pages/Auth/LoginSuccessPage'
import SignupSuccessPage from './pages/Auth/SignupSuccessPage'
import LoginErrorPage from './pages/Auth/LoginErrorPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import UserDashboardPage from './pages/UserDashboardPage'
import BookingSuccess from "./pages/Reservation Flow/BookingSuccess";
import ReservationConfirm from "./pages/Reservation Flow/ReservationConfirm";
import ReservationForm from "./pages/Reservation Flow/ReservationForm";




function App() {
  return (
    <AuthProvider>
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
          <Route path="/reservation/success" element={<BookingSuccess />} />
          <Route path="/reservation/confirm" element={<ReservationConfirm />} />
          <Route path="/reservation/details" element={<ReservationForm />} />



        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
