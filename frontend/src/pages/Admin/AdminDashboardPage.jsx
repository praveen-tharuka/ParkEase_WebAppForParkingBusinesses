import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminDashboardLayout from '../../components/Admin/AdminDashboardLayout'
import api from '../../services/api'

const { reportsAPI } = api

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    availableSlots: 0,
    totalSlots: 0,
    activeBookings: 0,
    todayRevenue: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reportsAPI.getOverview()
        if (response.success && response.data) {
          setStats(response.data)
        }
      } catch (err) {
        console.error('Fetch dashboard stats error:', err)
      }
    }
    fetchStats()
  }, [])

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your parking business operations.</p>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Available Slots</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.availableSlots} <span className="text-sm font-normal text-gray-500">/ {stats.totalSlots}</span></p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-medium">Today's Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">LKR {Number(stats.todayRevenue || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickLinkCard
            title="Walk-In Registration"
            description="Register vehicles arriving without prior reservations."
            to="/admin-dashboard/walk-in-registration"
            icon="car"
          />
          <QuickLinkCard
            title="Walk-In Registrations"
            description="View and manage all active walk-in vehicle registrations."
            to="/admin-dashboard/walk-in-registrations"
            icon="list"
          />
          <QuickLinkCard
            title="Customer Approvals"
            description="Review pending registrations and approve new customers."
            to="/admin-dashboard/officer/customer-approvals"
            icon="check"
          />
          <QuickLinkCard
            title="Customers"
            description="Search the full customer list with filters and statuses."
            to="/admin-dashboard/officer/customers"
            icon="users"
          />
          <QuickLinkCard
            title="Vehicle Management"
            description="Find vehicles fast and manage vehicle status updates."
            to="/admin-dashboard/officer/vehicles"
            icon="vehicle"
          />
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

export default AdminDashboardPage

const QuickLinkCard = ({ title, description, to }) => (
  <Link
    to={to}
    className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      <div className="rounded-full bg-brand/10 p-2 text-brand">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Link>
)
