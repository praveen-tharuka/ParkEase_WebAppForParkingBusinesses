import { useState, useMemo, useEffect } from 'react'
import AdminDashboardLayout from '../../components/Admin/AdminDashboardLayout'
import api from '../../services/api'

const { reservationsAPI } = api

const ManageBookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('All')
  const [sortBy, setSortBy] = useState('bookingDate')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await reservationsAPI.listReservations()
      if (response.success && response.data) {
        // listReservations returns { success: true, count: N, data: [...] }
        const rawBookings = response.data.data || response.data || []
        setBookings(rawBookings)
      } else {
        setError(response.error || 'Failed to load bookings directory')
      }
    } catch (err) {
      console.error('Fetch Bookings Error:', err)
      setError('An error occurred while loading bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancelBooking = async (id) => {
    const reason = window.prompt('Enter cancellation reason:')
    if (reason === null) return
    try {
      const response = await reservationsAPI.cancelReservation(id, reason)
      if (response.success) {
        alert('Booking cancelled successfully')
        fetchBookings()
      } else {
        alert(response.error || 'Failed to cancel booking')
      }
    } catch (err) {
      console.error('Cancel Booking Error:', err)
      alert('An error occurred while cancelling booking')
    }
  }

  const mappedBookings = useMemo(() => {
    return bookings.map(b => {
      const isPaid = b.status === 'COMPLETED' || b.payments?.some(p => p.paymentStatus === 'PAID')
      
      const startTimeStr = new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const endTimeStr = new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      let displayStatus = 'Pending'
      if (b.status === 'CONFIRMED' || b.status === 'CHECKED_IN') displayStatus = 'Active'
      if (b.status === 'COMPLETED') displayStatus = 'Completed'
      if (b.status === 'CANCELLED') displayStatus = 'Cancelled'

      return {
        id: b.reservationCode || b.id,
        dbId: b.id,
        customerId: b.customerId,
        customerName: b.customer?.fullName || 'Walk-In Customer',
        customerEmail: b.customer?.email || '—',
        slotNumber: b.slot?.slotNumber || '—',
        slotLocation: b.slot?.location?.name || 'Downtown',
        vehiclePlate: b.vehicle?.plateNumber || '—',
        vehicleType: b.vehicle?.vehicleType?.name || 'Car',
        bookingDate: new Date(b.createdAt || b.startTime).toLocaleDateString(),
        checkInTime: startTimeStr,
        checkOutTime: endTimeStr,
        status: displayStatus,
        paymentStatus: isPaid ? 'Paid' : 'Pending',
        price: Number(b.totalFee || 0),
        notes: b.notes || '—'
      }
    })
  }, [bookings])

  const filteredBookings = useMemo(() => {
    let result = mappedBookings

    // Filter by status
    if (filterStatus !== 'All') {
      result = result.filter(booking => booking.status === filterStatus)
    }

    // Filter by payment status
    if (filterPaymentStatus !== 'All') {
      result = result.filter(booking => booking.paymentStatus === filterPaymentStatus)
    }

    // Search by customer name, email, slot number, or vehicle plate
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        booking =>
          booking.customerName.toLowerCase().includes(term) ||
          booking.customerEmail.toLowerCase().includes(term) ||
          booking.slotNumber.toLowerCase().includes(term) ||
          booking.vehiclePlate.toLowerCase().includes(term) ||
          booking.id.toLowerCase().includes(term)
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'customerName':
          return a.customerName.localeCompare(b.customerName)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'price':
          return (b.price || 0) - (a.price || 0)
        case 'bookingDate':
        default:
          return new Date(a.bookingDate) - new Date(b.bookingDate)
      }
    })

    return result
  }, [mappedBookings, searchTerm, filterStatus, filterPaymentStatus, sortBy])

  const getStatusBadgeColor = status => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentBadgeColor = status => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-500 mt-2">View and manage all parking bookings</p>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Box */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, slot, vehicle..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option>All</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={filterPaymentStatus}
                onChange={e => setFilterPaymentStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option>All</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="bookingDate">Booking Date</option>
                <option value="customerName">Customer Name</option>
                <option value="status">Status</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Found {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Slot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                      Loading bookings...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-red-500 font-semibold">
                      {error}
                    </td>
                  </tr>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{booking.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 uppercase">{booking.vehiclePlate}</div>
                        <div className="text-xs text-gray-500">{booking.vehicleType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.slotNumber}</div>
                        <div className="text-xs text-gray-500">{booking.slotLocation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.bookingDate}</div>
                        <div className="text-xs text-gray-500">
                          {booking.checkInTime}
                          {booking.checkOutTime && ` - ${booking.checkOutTime}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadgeColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">LKR {booking.price ? booking.price.toFixed(2) : '0.00'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.status === 'Active' && (
                          <button
                            onClick={() => handleCancelBooking(booking.dbId)}
                            className="text-red-600 hover:text-red-700 transition-colors font-medium"
                          >
                            Cancel Booking
                          </button>
                        )}
                        {booking.status !== 'Active' && (
                          <span className="text-gray-400 italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No bookings found matching your criteria</p>
                      </div>
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

export default ManageBookingsPage
