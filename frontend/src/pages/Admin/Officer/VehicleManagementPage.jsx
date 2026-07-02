import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminDashboardLayout from '../../../components/Admin/AdminDashboardLayout'
import api from '../../../services/api'

const { vehiclesAPI } = api

const badgeStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
}

const mapStatusToDisplay = (status) => {
  if (status === 'ACTIVE') return 'Active'
  if (status === 'PENDING') return 'Pending'
  return 'Suspended'
}

// Page for searching vehicles and managing their status and assignments
const VehicleManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVehicles = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await vehiclesAPI.getUserVehicles()
      if (response.success && response.data) {
        setVehicles(response.data)
      } else {
        setError(response.error || 'Failed to load vehicle directory')
      }
    } catch (err) {
      console.error('Fetch Vehicles Error:', err)
      setError('An error occurred while loading vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleVerify = async (id) => {
    try {
      const response = await vehiclesAPI.verifyVehicle(id)
      if (response.success) {
        alert('Vehicle verified successfully')
        fetchVehicles()
      } else {
        alert(response.error || 'Failed to verify vehicle')
      }
    } catch (err) {
      console.error('Verify Vehicle Error:', err)
      alert('An error occurred during verification')
    }
  }

  const mappedVehicles = useMemo(() => {
    return vehicles.map(v => ({
      id: v.id,
      customerId: v.customerId || 'walk-in',
      customerName: v.customer?.fullName || v.ownerName || 'Walk-In Customer',
      plate: v.plateNumber,
      make: v.make,
      model: v.model,
      type: v.vehicleType?.name || 'Car',
      color: v.color || '—',
      status: mapStatusToDisplay(v.status),
      slot: '—', // slots can be resolved if needed
      lastCheckIn: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '—',
      paymentPlan: v.isVerified ? 'Verified Owner' : 'Pending Verification'
    }))
  }, [vehicles])

  // Extract unique vehicle types from data for filter options
  const vehicleTypes = useMemo(() => {
    return ['All', ...new Set(mappedVehicles.map((vehicle) => vehicle.type))]
  }, [mappedVehicles])

  // Filter vehicles based on search, status, and type
  const filteredVehicles = useMemo(() => {
    return mappedVehicles.filter((vehicle) => {
      const matchesSearch = [
        vehicle.plate,
        vehicle.customerName,
        vehicle.make,
        vehicle.model,
        vehicle.slot,
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter
      const matchesType = typeFilter === 'All' || vehicle.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [mappedVehicles, searchTerm, statusFilter, typeFilter])

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Officer</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Vehicle Search & Management</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Find vehicles fast, review their status, and update account or parking assignments as needed.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-4 text-white shadow-lg shadow-gray-200">
            <p className="text-sm/5 text-white/75">Vehicle records</p>
            <p className="text-3xl font-bold">{filteredVehicles.length}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="vehicle-search">
              Search vehicles
            </label>
            <input
              id="vehicle-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plate, customer, make, model, or slot"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle type</label>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  typeFilter === type
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Vehicle</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th>Assigned Slot</Th>
                  <Th>Registered Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Loading vehicle directory...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-red-500 font-medium">
                      {error}
                    </td>
                  </tr>
                ) : filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50/70">
                    <Td>
                      <p className="font-semibold text-gray-900 uppercase">{vehicle.plate}</p>
                      <p className="text-sm text-gray-500">
                        {vehicle.make} {vehicle.model} · {vehicle.color}
                      </p>
                    </Td>
                    <Td>
                      <p className="font-medium text-gray-900">{vehicle.customerName}</p>
                      <p className="text-sm text-gray-500">{vehicle.paymentPlan}</p>
                    </Td>
                    <Td>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyles[vehicle.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {vehicle.status}
                      </span>
                    </Td>
                    <Td>
                      <p className="font-semibold text-gray-900">{vehicle.slot}</p>
                      <p className="text-sm text-gray-500">{vehicle.type}</p>
                    </Td>
                    <Td>
                      <p className="font-medium text-gray-900">{vehicle.lastCheckIn}</p>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.status === 'Pending' && (
                          <button
                            onClick={() => handleVerify(vehicle.id)}
                            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                          >
                            Verify
                          </button>
                        )}
                        {vehicle.customerId && vehicle.customerId !== 'walk-in' && (
                          <Link
                            to={`/admin-dashboard/officer/customers/${vehicle.customerId}`}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            View Owner
                          </Link>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && !error && filteredVehicles.length === 0 && (
            <div className="py-16 text-center text-gray-500">No vehicles match your search or filters.</div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

const Th = ({ children }) => (
  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
    {children}
  </th>
)

const Td = ({ children }) => <td className="px-6 py-4 align-top text-sm">{children}</td>

export default VehicleManagementPage
