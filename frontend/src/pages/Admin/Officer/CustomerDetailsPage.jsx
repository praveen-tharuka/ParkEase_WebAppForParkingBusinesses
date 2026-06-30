import { Link, useParams } from 'react-router-dom'
import AdminDashboardLayout from '../../../components/Admin/AdminDashboardLayout'
import { officerCustomers } from '../../../data/officerManagementData'

// Tailwind styles for customer status badges (Approved, Pending, Suspended)
const statusStyles = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
}

// Page for viewing a single customer's complete profile, vehicles, and history
const CustomerDetailsPage = () => {
  // Get customer ID from URL and find matching customer data
  const { customerId } = useParams()
  const customer = officerCustomers.find((item) => item.id === customerId) || officerCustomers[0]

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Officer</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Customer Details View</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              View customer profile data, linked vehicles, and activity history in one place.
            </p>
          </div>
          <Link
            to="/admin-dashboard/officer/customers"
            className="inline-flex rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to customer list
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[customer.status]}`}>
                      {customer.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{customer.company}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer ID</p>
                  <p className="text-lg font-bold text-gray-900">{customer.id}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DetailBox label="Email" value={customer.email} />
                <DetailBox label="Phone" value={customer.phone} />
                <DetailBox label="Address" value={customer.address} />
                <DetailBox label="Joined" value={customer.joinedAt} />
                <DetailBox label="Last Visit" value={customer.lastVisit} />
                <DetailBox label="Approved By" value={customer.approvalBy} />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-gray-900">Linked Vehicles</h3>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                  {customer.vehiclesList.length} vehicles
                </span>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {customer.vehiclesList.map((vehicle) => (
                  <div key={vehicle.plate} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{vehicle.plate}</p>
                        <p className="text-sm text-gray-500">
                          {vehicle.make} {vehicle.model} · {vehicle.type}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <Meta label="Color" value={vehicle.color} />
                      <Meta label="Type" value={vehicle.type} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Customer History</h3>
              <div className="mt-5 space-y-4">
                {customer.history.map((entry) => (
                  <div key={`${entry.date}-${entry.title}`} className="flex gap-4 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white font-semibold">
                      {entry.date.slice(-2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{entry.title}</p>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                      <p className="mt-1 text-gray-600">{entry.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Customer Summary</h3>
              <div className="mt-5 grid gap-4">
                <SummaryRow label="Vehicles" value={customer.vehicles} />
                <SummaryRow label="Lifetime Visits" value={customer.lifetimeVisits} />
                <SummaryRow label="Outstanding Balance" value={customer.balance} />
                <SummaryRow label="Notes" value={customer.notes} />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand/15 to-cyan-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Officer Actions</h3>
              <p className="mt-2 text-gray-600">
                Approve, update, or suspend this customer based on the latest compliance review.
              </p>
              <div className="mt-5 space-y-3">
                <button className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90">
                  Approve / Update Access
                </button>
                <button className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                  Edit Customer Details
                </button>
                <button className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-semibold text-rose-700 hover:bg-rose-100">
                  Suspend Account
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

const DetailBox = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-900 break-words">{value}</p>
  </div>
)

const Meta = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 font-medium text-gray-900">{value}</p>
  </div>
)

const SummaryRow = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value}</p>
  </div>
)

export default CustomerDetailsPage
