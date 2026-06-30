import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminDashboardLayout from '../../../components/Admin/AdminDashboardLayout'
import { customerStatusOptions, officerCustomers } from '../../../data/officerManagementData'

// Tailwind styles for customer status badges (Approved, Pending, Suspended)
const badgeStyles = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
}

// Page for searching all registered customers with filters and sorting
const CustomersListPage = () => {
  // State: search input, status filter, and sort preference
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')

  // Filter and sort customers based on search, status, and sort option
  const filteredCustomers = useMemo(() => {
    return [...officerCustomers]
      .filter((customer) => {
        const combined = [
          customer.name,
          customer.email,
          customer.phone,
          customer.company,
          customer.address,
          customer.status,
        ]
          .join(' ')
          .toLowerCase()
        const matchesSearch = combined.includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'All' || customer.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'visits') return b.lifetimeVisits - a.lifetimeVisits
        if (sortBy === 'vehicles') return b.vehicles - a.vehicles
        return a.name.localeCompare(b.name)
      })
  }, [searchTerm, statusFilter, sortBy])

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Officer</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">All Customers List / Search</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Search customers, apply filters, and quickly inspect registration and usage details.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard label="Customers" value={officerCustomers.length} />
            <StatCard label="Approved" value={officerCustomers.filter((customer) => customer.status === 'Approved').length} />
            <StatCard label="Pending" value={officerCustomers.filter((customer) => customer.status === 'Pending Approval').length} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="customer-search">
              Search customers
            </label>
            <input
              id="customer-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, company, or address"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            >
              {customerStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Sort by</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { key: 'name', label: 'Name' },
                { key: 'visits', label: 'Lifetime Visits' },
                { key: 'vehicles', label: 'Vehicles' },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    sortBy === option.key
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <Link
            to="/admin-dashboard/officer/customer-approvals"
            className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-semibold text-brand hover:bg-brand/15 transition"
          >
            Review pending registrations
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Customer</Th>
                  <Th>Company</Th>
                  <Th>Status</Th>
                  <Th>Vehicles</Th>
                  <Th>Last Visit</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/70">
                    <Td>
                      <p className="font-semibold text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </Td>
                    <Td>
                      <p className="font-medium text-gray-900">{customer.company}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </Td>
                    <Td>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyles[customer.status]}`}>
                        {customer.status}
                      </span>
                    </Td>
                    <Td>
                      <p className="font-semibold text-gray-900">{customer.vehicles}</p>
                      <p className="text-sm text-gray-500">Lifetime visits: {customer.lifetimeVisits}</p>
                    </Td>
                    <Td>
                      <p className="font-medium text-gray-900">{customer.lastVisit}</p>
                      <p className="text-sm text-gray-500">Joined {customer.joinedAt}</p>
                    </Td>
                    <Td>
                      <Link
                        to={`/admin-dashboard/officer/customers/${customer.id}`}
                        className="inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                      >
                        View details
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="py-16 text-center text-gray-500">No customers match your search or filter.</div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm min-w-[120px]">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
  </div>
)

const Th = ({ children }) => (
  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
    {children}
  </th>
)

const Td = ({ children }) => <td className="px-6 py-4 align-top text-sm">{children}</td>

export default CustomersListPage
