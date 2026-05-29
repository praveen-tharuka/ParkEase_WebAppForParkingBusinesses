import DashboardHeader from '../Dashboard/DashboardHeader'
import AdminDashboardSidebar from './AdminDashboardSidebar'

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <AdminDashboardSidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboardLayout
