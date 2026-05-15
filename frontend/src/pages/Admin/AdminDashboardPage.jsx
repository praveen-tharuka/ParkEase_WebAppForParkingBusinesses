import { Link } from 'react-router-dom'
import AdminDashboardLayout from '../../components/Admin/AdminDashboardLayout'
import WalkInRegistration from '../../components/Admin/WalkInRegistration'

const AdminDashboardPage = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your parking business operations.</p>
        </div>

        {/* Quick Stats Summary - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Available Slots</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">42 <span className="text-sm font-normal text-gray-500">/ 100</span></p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">58</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-medium">Today's Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">$340.00</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickLinkCard
            title="Customer Approvals"
            description="Review pending registrations and approve new customers."
            to="/admin-dashboard/officer/customer-approvals"
          />
          <QuickLinkCard
            title="Customers"
            description="Search the full customer list with filters and statuses."
            to="/admin-dashboard/officer/customers"
          />
          <QuickLinkCard
            title="Customer Details"
            description="Open a customer profile, history, and linked vehicles."
            to="/admin-dashboard/officer/customers/CUS-1001"
          />
          <QuickLinkCard
            title="Vehicle Management"
            description="Find vehicles fast and manage vehicle status updates."
            to="/admin-dashboard/officer/vehicles"
          />
        </div>

        {/* Walk-in Registration Form */}
        <WalkInRegistration />
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
