import { useMemo, useState } from 'react'
import AdminDashboardLayout from '../../../components/Admin/AdminDashboardLayout'
import { officerPendingRegistrations } from '../../../data/officerManagementData'

// Tailwind styles for approval status badges (Pending, Approved, Rejected)
const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
}

// Page for reviewing and approving pending customer registrations
const CustomerApprovalPage = () => {
  // State: search input, status filter, and pending registrations list
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Pending')
  const [items, setItems] = useState(officerPendingRegistrations)

  // Filter registrations based on search and approval status
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = [item.name, item.email, item.vehicle.plate, item.vehicle.make]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === 'All' || item.approvalStatus === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [items, searchTerm, selectedStatus])

  // Handle approval/rejection: update status in local state
  const updateStatus = (id, approvalStatus) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, approvalStatus } : item)),
    )
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Officer</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Customer Authorization / Approval</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Review new customer registrations, verify documents, and approve access to the parking system.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-brand to-cyan-500 px-5 py-4 text-white shadow-lg shadow-cyan-200">
            <p className="text-sm/5 text-white/85">Pending approvals</p>
            <p className="text-3xl font-bold">{filteredItems.length}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="approval-search">
              Search pending registrations
            </label>
            <input
              id="approval-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
              placeholder="Search by customer name, email, vehicle plate, or make"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Approval status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[item.approvalStatus]}`}>
                      {item.approvalStatus}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {item.customerId}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoCell label="Email" value={item.email} />
                    <InfoCell label="Phone" value={item.phone} />
                    <InfoCell label="Requested" value={item.requestedAt} />
                    <InfoCell label="Vehicle" value={`${item.vehicle.make} ${item.vehicle.type}`} />
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Vehicle Summary</p>
                      <p className="text-gray-600">
                        {item.vehicle.plate} · {item.vehicle.color} · {item.vehicle.make}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Notes</p>
                      <p className="text-gray-600">{item.notes}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Submitted documents</p>
                    <div className="flex flex-wrap gap-2">
                      {item.documents.map((doc) => (
                        <span key={doc} className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0 xl:w-52">
                  <button
                    onClick={() => updateStatus(item.id, 'Approved')}
                    className="rounded-xl bg-brand px-4 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    Approve Registration
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'Rejected')}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'Pending')}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Reset to Pending
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-gray-500">
              No registrations match your search criteria.
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

const InfoCell = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-900 break-words">{value}</p>
  </div>
)

export default CustomerApprovalPage
