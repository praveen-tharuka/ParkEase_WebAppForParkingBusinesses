import { useState } from 'react'
import Navbar from '../components/Navigation/Navbar'
import SearchForm from '../components/Search/SearchForm'
import SlotCard from '../components/Search/SlotCard'
import { mockSlots } from '../data/mockSlots'

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [filters, setFilters] = useState({
    searchQuery: '',
    date: '',
    time: '',
    vehicleType: '',
    location: '',
  })

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters)
    setHasSearched(true)
    
    // Filter slots based on search criteria
    let filtered = [...mockSlots]

    // Filter by search query (slot number or location)
    if (searchFilters.searchQuery) {
      const query = searchFilters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (slot) =>
          slot.slotNumber.toLowerCase().includes(query) ||
          slot.location.toLowerCase().includes(query)
      )
    }

    // Filter by vehicle type
    if (searchFilters.vehicleType) {
      filtered = filtered.filter(
        (slot) => slot.type.toLowerCase() === searchFilters.vehicleType.toLowerCase()
      )
    }

    // Filter by location
    if (searchFilters.location) {
      filtered = filtered.filter(
        (slot) => slot.location.toLowerCase() === searchFilters.location.toLowerCase()
      )
    }

    // Filter by availability
    filtered = filtered.filter((slot) => slot.available)

    setSearchResults(filtered)
  }

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      date: '',
      time: '',
      vehicleType: '',
      location: '',
    })
    setHasSearched(false)
    setSearchResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Find Parking
          </h1>

          <SearchForm
            onSearch={handleSearch}
            onClear={handleClearFilters}
            initialFilters={filters}
          />

          {hasSearched && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Available Slots ({searchResults.length})
                </h2>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((slot) => (
                    <SlotCard key={slot.id} slot={slot} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">
                    No parking slots found matching your criteria.
                  </p>
                  <p className="text-gray-500">
                    Try adjusting your filters or search again.
                  </p>
                </div>
              )}
            </div>
          )}

          {!hasSearched && (
            <div className="mt-12 text-center py-12">
              <p className="text-gray-600 text-lg">
                Enter your search criteria and click "Apply Filters" to find available parking slots.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage

