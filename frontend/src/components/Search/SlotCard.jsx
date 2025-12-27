const SlotCard = ({ slot }) => {
  const getTypeBadgeColor = (type) => {
    const colors = {
      car: 'bg-blue-100 text-blue-800',
      motorcycle: 'bg-green-100 text-green-800',
      truck: 'bg-orange-100 text-orange-800',
      van: 'bg-purple-100 text-purple-800',
      suv: 'bg-red-100 text-red-800',
    }
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const getAvailabilityBadge = (available) => {
    if (available) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
          Available
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
        Unavailable
      </span>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Slot Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {slot.image ? (
          <img
            src={slot.image}
            alt={`Parking slot ${slot.slotNumber}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand to-blue-400">
            <svg
              className="w-24 h-24 text-white opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        {/* Availability Badge Overlay */}
        <div className="absolute top-4 right-4">
          {getAvailabilityBadge(slot.available)}
        </div>
      </div>

      {/* Slot Details */}
      <div className="p-6">
        {/* Slot Number and Type */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Slot {slot.slotNumber}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(
                slot.type
              )}`}
            >
              {slot.type}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <svg
            className="w-5 h-5 mr-2 text-brand"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm">{slot.location}</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${slot.price.hourly}
            </span>
            <span className="text-gray-600 text-sm">/hour</span>
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-lg font-semibold text-gray-700">
              ${slot.price.daily}
            </span>
            <span className="text-gray-600 text-sm">/day</span>
          </div>
        </div>

        {/* Reserve Button */}
        <button
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            slot.available
              ? 'bg-brand text-white hover:bg-opacity-90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!slot.available}
          onClick={() => {
            if (slot.available) {
              alert(`Reserving slot ${slot.slotNumber}...`)
              // TODO: Implement reservation logic
            }
          }}
        >
          {slot.available ? 'Reserve Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}

export default SlotCard

