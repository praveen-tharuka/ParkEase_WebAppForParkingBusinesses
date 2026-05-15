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
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import CustomerApprovalPage from './pages/Admin/Officer/CustomerApprovalPage'
import CustomersListPage from './pages/Admin/Officer/CustomersListPage'
import CustomerDetailsPage from './pages/Admin/Officer/CustomerDetailsPage'
import VehicleManagementPage from './pages/Admin/Officer/VehicleManagementPage'
import BookingSuccess from "./pages/Reservation Flow/BookingSuccess";
import ReservationConfirm from "./pages/Reservation Flow/ReservationConfirm";
import ReservationForm from "./pages/Reservation Flow/ReservationForm";
import ParkingSearch from "./pages/Reservation Flow/ParkingSearch";
import MyReservations from "./pages/Reservations/MyReservations";
import ReservationDetails from "./pages/Reservations/ReservationDetails";
import EditReservation from "./pages/Reservations/EditReservation";
import DigitalTicket from "./pages/Reservations/DigitalTicket";





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
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/officer/customer-approvals"
            element={
              <ProtectedRoute>
                <CustomerApprovalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/officer/customers"
            element={
              <ProtectedRoute>
                <CustomersListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/officer/customers/:customerId"
            element={
              <ProtectedRoute>
                <CustomerDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/officer/vehicles"
            element={
              <ProtectedRoute>
                <VehicleManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login-success" element={<LoginSuccessPage />} />
          <Route path="/signup-success" element={<SignupSuccessPage />} />
          <Route path="/login-error" element={<LoginErrorPage />} />
          <Route path="/reservation/search" element={<ParkingSearch />} />
          <Route path="/reservation/success" element={<BookingSuccess />} />
          <Route path="/reservation/confirm" element={<ReservationConfirm />} />
          <Route path="/reservation/details" element={<ReservationForm />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route
            path="/dashboard/reservations"
            element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reservations/:id"
            element={
              <ProtectedRoute>
                <ReservationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reservations/:id/edit"
            element={
              <ProtectedRoute>
                <EditReservation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reservations/:id/ticket"
            element={
              <ProtectedRoute>
                <DigitalTicket />
              </ProtectedRoute>
            }
          />
          <Route path="/reservation" element={<ReservationDetails />} />
          <Route path="/reservation/edit" element={<EditReservation />} />
          <Route path="/digital-ticket" element={<DigitalTicket />} />



        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
