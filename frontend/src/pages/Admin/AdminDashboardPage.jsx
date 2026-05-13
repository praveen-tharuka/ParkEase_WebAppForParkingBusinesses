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

        {/* Walk-in Registration Form */}
        <WalkInRegistration />
      </div>
    </AdminDashboardLayout>
  )
}

export default AdminDashboardPage
