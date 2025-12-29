import DashboardLayout from '../components/Dashboard/DashboardLayout'
import { mockVehicles } from '../data/mockUserData'

const MyVehiclesPage = () => {
  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 transition-colors">
            Add Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-brand rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                  {vehicle.type}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {vehicle.make} {vehicle.model}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Year:</span>
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">License Plate:</span>
                  <span className="font-mono">{vehicle.licensePlate}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Color:</span>
                  <span>{vehicle.color}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyVehiclesPage


