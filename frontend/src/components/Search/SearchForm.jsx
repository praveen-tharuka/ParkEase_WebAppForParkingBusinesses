import { useState, useEffect } from 'react'

const SearchForm = ({ onSearch, onClear, initialFilters }) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '')
  const [date, setDate] = useState(initialFilters.date || '')
  const [time, setTime] = useState(initialFilters.time || '')
  const [vehicleType, setVehicleType] = useState(initialFilters.vehicleType || '')
  const [location, setLocation] = useState(initialFilters.location || '')

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Van', 'SUV']
  const locations = [
    'Downtown',
    'Shopping Mall',
    'Airport',
    'University',
    'Hospital',
    'City Center',
    'Business District',
  ]

  useEffect(() => {
    setSearchQuery(initialFilters.searchQuery || '')
    setDate(initialFilters.date || '')
    setTime(initialFilters.time || '')
    setVehicleType(initialFilters.vehicleType || '')
    setLocation(initialFilters.location || '')
  }, [initialFilters])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({
      searchQuery,
      date,
      time,
      vehicleType,
      location,
    })
  }

  const handleClear = () => {
    setSearchQuery('')
    setDate('')
    setTime('')
    setVehicleType('')
    setLocation('')
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Search Bar */}
        <div className="md:col-span-2 lg:col-span-3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by slot number or location..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        {/* Date Picker */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        {/* Time Picker */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        {/* Vehicle Type Dropdown */}
        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          >
            <option value="">All Types</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Clear Filters
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          Apply Filters
        </button>
      </div>
    </form>
  )
}

export default SearchForm

