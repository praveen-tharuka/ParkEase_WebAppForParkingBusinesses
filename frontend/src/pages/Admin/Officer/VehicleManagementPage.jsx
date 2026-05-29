import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminDashboardLayout from '../../../components/Admin/AdminDashboardLayout'
import { officerVehicles, vehicleStatusOptions } from '../../../data/officerManagementData'

// Tailwind styles for vehicle status badges (Active, Pending, Suspended)
const badgeStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
}

// Page for searching vehicles and managing their status and assignments
const VehicleManagementPage = () => {
  // State: search input, status filter, and vehicle type filter
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  // Extract unique vehicle types from data for filter options
  const vehicleTypes = ['All', ...new Set(officerVehicles.map((vehicle) => vehicle.type))]

  // Filter vehicles based on search, status, and type
  const filteredVehicles = useMemo(() => {
    return officerVehicles.filter((vehicle) => {
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
  }, [searchTerm, statusFilter, typeFilter])

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
              {vehicleStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
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
                  <Th>Slot</Th>
                  <Th>Last Check-in</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50/70">
                    <Td>
                      <p className="font-semibold text-gray-900">{vehicle.plate}</p>
                      <p className="text-sm text-gray-500">
                        {vehicle.make} {vehicle.model} · {vehicle.color}
                      </p>
                    </Td>
                    <Td>
                      <p className="font-medium text-gray-900">{vehicle.customerName}</p>
                      <p className="text-sm text-gray-500">{vehicle.paymentPlan}</p>
                    </Td>
                    <Td>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyles[vehicle.status]}`}>
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
                        <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                          Update
                        </button>
                        <Link
                          to={`/admin-dashboard/officer/customers/${vehicle.customerId}`}
                          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                          View Owner
                        </Link>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVehicles.length === 0 && (
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
