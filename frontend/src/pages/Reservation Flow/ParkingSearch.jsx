import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navigation/Navbar'
import Footer from '../../components/Footer/Footer'
import { slotsAPI } from '../../services/api'
// Keep mockSlots as a fallback during development
import { mockSlots } from '../../data/mockSlots'

const ParkingSearch = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All')
  const [selectedSlot, setSelectedSlot] = useState(null)
  // API state
  const [slots, setSlots] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true)
      setApiError(null)
      try {
        const response = await slotsAPI.searchSlots({}) // no filters initially
        if (response.success && response.data) {
          const mappedSlots = response.data.map(slot => ({
            id: slot.id,
            slotNumber: slot.slotNumber,
            type: slot.supportedVehicleType?.name || (slot.slotType === 'REGULAR' ? 'Car' : slot.slotType),
            location: slot.location?.name || 'Unknown Location',
            price: {
              hourly: slot.price?.hourly || 5,
              daily: slot.price?.daily || 40,
            },
            available: slot.status === 'AVAILABLE',
          }))
          setSlots(mappedSlots)
        } else {
          setApiError('Failed to load slots')
          setSlots(mockSlots) // fallback to mock data
        }
      } catch (e) {
        setApiError('Error contacting server')
        setSlots(mockSlots)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSlots()
  }, [])

  const filteredSlots = (slots.length ? slots : mockSlots).filter(slot => {
    const matchesSearch = slot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = vehicleTypeFilter === 'All' || slot.type === vehicleTypeFilter
    const isAvailable = slot.available
    
    return matchesSearch && matchesType && isAvailable
  })

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    navigate('/reservation/details', { state: { selectedSlot: slot } })
  }

  const vehicleTypes = ['All', ...new Set(mockSlots.map(s => s.type))]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-4">
          {apiError}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      )}
      <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Parking</h1>
            <p className="text-gray-600">Search and select a parking slot that suits your needs</p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Location or Slot
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., Downtown, A-101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={vehicleTypeFilter}
                  onChange={(e) => setVehicleTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setVehicleTypeFilter('All')
                  }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-700 font-semibold mb-4">
              Found {filteredSlots.length} available parking slot(s)
            </p>

            {filteredSlots.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No parking slots match your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSlots.map(slot => (
                  <div
                    key={slot.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                    onClick={() => handleSelectSlot(slot)}
                  >
                    {/* Slot Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                      <h3 className="text-3xl font-bold mb-2">{slot.slotNumber}</h3>
                      <p className="text-blue-100">{slot.location}</p>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <div className="mb-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Vehicle Type:</span>
                          <span className="font-semibold text-gray-900 bg-blue-100 px-3 py-1 rounded-full text-sm">
                            {slot.type}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Hourly Rate:</span>
                          <span className="font-semibold text-green-600">${slot.price.hourly}/hr</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Daily Rate:</span>
                          <span className="font-semibold text-green-600">${slot.price.daily}/day</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                          ✓ Available Now
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectSlot(slot)}
                        className="w-full mt-4 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                      >
                        Select This Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ParkingSearch
