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

import CustomerProfilePage from "./pages/Profile/CustomerProfilePage"
import AccountSettingsPage from "./pages/Profile/AccountSettingsPage"
import VehicleManagementPage from "./pages/Vehicles/VehicleManagementPage"
import AddEditVehiclePage from "./pages/Vehicles/AddEditVehiclePage"

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

          <Route path="/profile" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
<Route path="/settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
<Route path="/vehicles" element={<ProtectedRoute><VehicleManagementPage /></ProtectedRoute>} />
<Route path="/vehicles/add" element={<ProtectedRoute><AddEditVehiclePage /></ProtectedRoute>} />
<Route path="/vehicles/edit/:id" element={<ProtectedRoute><AddEditVehiclePage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
