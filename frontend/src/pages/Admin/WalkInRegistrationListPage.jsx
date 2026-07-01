import { useState, useEffect } from 'react'
import AdminDashboardLayout from '../../components/Admin/AdminDashboardLayout'
import api from '../../services/api'
const { walkinsAPI } = api

const WalkInRegistrationListPage = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchWalkins = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await walkinsAPI.getWalkIns({ status: filterStatus })
      if (response.success && response.data) {
        const rawWalkins = Array.isArray(response.data)
          ? response.data
          : (response.data.data || [])
        setRegistrations(rawWalkins)
      } else {
        setError(response.error || 'Failed to load walk-in registrations')
      }
    } catch (err) {
      console.error('Fetch Walk-Ins Error:', err)
      setError('An error occurred while loading walk-ins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWalkins()
  }, [filterStatus])

  const filteredRegistrations = registrations

  const handleRemoveVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to remove this walk-in registration?')) {
      return
    }
    try {
      const response = await walkinsAPI.deleteWalkIn(id)
      if (response.success) {
        setRegistrations(prev => prev.filter(reg => reg.id !== id))
      } else {
        alert(response.error || 'Failed to remove walk-in registration')
      }
    } catch (err) {
      console.error('Delete Walk-In Error:', err)
      alert('An error occurred while removing walk-in')
    }
  }

  const handleCheckout = async (id) => {
    try {
      const response = await walkinsAPI.checkoutWalkIn(id)
      if (response.success) {
        fetchWalkins()
      } else {
        alert(response.error || 'Failed to checkout vehicle')
      }
    } catch (err) {
      console.error('Checkout Error:', err)
      alert('An error occurred during checkout')
    }
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800'
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Walk-In Registrations</h1>
          <p className="text-gray-500 mt-2">
            Track and manage all walk-in vehicle registrations and parking assignments.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Active Registrations</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {registrations.filter(r => r.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {registrations.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Completed Today</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {registrations.filter(r => r.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm">Total Today</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{registrations.length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-brand text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">License Plate</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned Slot</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-In Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading walk-in registrations...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-red-500 font-medium">
                      {error}
                    </td>
                  </tr>
                ) : filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map(registration => (
                    <tr key={registration.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 uppercase">{registration.licensePlate}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{registration.vehicleType}</td>
                      <td className="px-6 py-4 text-gray-600">{registration.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {registration.assignedSlot}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{registration.checkInTime}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[registration.status]}`}>
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          {registration.status === 'active' && (
                            <button
                              onClick={() => handleCheckout(registration.id)}
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm transition"
                            >
                              Checkout
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveVehicle(registration.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm transition"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

export default WalkInRegistrationListPage
