import { useMemo, useState, useEffect } from 'react'
import AdminDashboardLayout from '../../../components/Admin/AdminDashboardLayout'
import api from '../../../services/api'

const { approvalsAPI } = api

// Tailwind styles for approval status badges (Pending, Approved, Rejected)
const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
}

// Page for reviewing and approving pending customer registrations
const CustomerApprovalPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Pending')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchApprovals = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await approvalsAPI.getPendingApprovals({ status: selectedStatus })
      if (response.success && response.data) {
        setItems(response.data)
      } else {
        setError(response.error || 'Failed to load registrations')
      }
    } catch (err) {
      console.error('Fetch Approvals Error:', err)
      setError('An error occurred while loading approvals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [selectedStatus])

  // Filter registrations based on search and approval status
  const filteredItems = useMemo(() => {
    return items.map(item => ({
      id: item.id,
      customerId: item.requestedById,
      name: item.requestedBy?.fullName || 'Unknown Customer',
      email: item.requestedBy?.email || '—',
      phone: item.requestedBy?.phone || '—',
      requestedAt: new Date(item.requestedAt).toLocaleString(),
      vehicle: {
        plate: item.vehiclePlate || '—',
        type: item.vehicleTypeName || '—',
        color: item.vehicleColor || '—',
        make: item.vehicleMake || '—',
      },
      documents: item.documents?.map(d => d.documentType) || [],
      notes: item.notes || 'No notes provided.',
      approvalStatus: item.status === 'PENDING' ? 'Pending' : item.status === 'APPROVED' ? 'Approved' : 'Rejected'
    })).filter((item) => {
      const matchesSearch = [item.name, item.email, item.vehicle.plate, item.vehicle.make]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === 'All' || item.approvalStatus === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [items, searchTerm, selectedStatus])

  // Handle approval/rejection: update status in database
  const updateStatus = async (id, approvalStatus) => {
    try {
      let response;
      if (approvalStatus === 'Approved') {
        response = await approvalsAPI.approveRegistration(id);
      } else if (approvalStatus === 'Rejected') {
        const reason = window.prompt('Enter rejection reason:') || 'Documents invalid or incomplete';
        response = await approvalsAPI.rejectRegistration(id, reason);
      } else {
        alert('Resetting status is not supported on the live database.');
        return;
      }

      if (response && response.success) {
        alert(`Registration updated to ${approvalStatus}`);
        fetchApprovals();
      } else {
        alert(response?.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Update Status Error:', err)
      alert('An error occurred while updating status')
    }
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
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading registrations...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 font-semibold">{error}</div>
          ) : filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[item.approvalStatus] || 'bg-gray-150 text-gray-700'}`}>
                      {item.approvalStatus}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 break-all">
                      Request ID: {item.id}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoCell label="Email" value={item.email} />
                    <InfoCell label="Phone" value={item.phone} />
                    <InfoCell label="Requested" value={item.requestedAt} />
                    <InfoCell label="Vehicle Type" value={item.vehicle.type} />
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Vehicle Summary</p>
                      <p className="text-gray-600 uppercase font-semibold">
                        {item.vehicle.plate} <span className="font-normal text-sm capitalize">· {item.vehicle.color} · {item.vehicle.make}</span>
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

                      {item.documents.length === 0 && (
                        <span className="text-sm text-gray-500 italic">No documents uploaded</span>
                      )}
                    </div>
                  </div>
                </div>

                {item.approvalStatus === 'Pending' && (
                  <div className="flex flex-col gap-3 shrink-0 xl:w-52 w-full mt-4 xl:mt-0">
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
                  </div>
                )}
              </div>
            </div>
          ))}

          {!loading && !error && filteredItems.length === 0 && (
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
