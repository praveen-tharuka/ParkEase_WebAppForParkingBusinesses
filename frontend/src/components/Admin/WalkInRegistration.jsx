import { useState } from 'react'

const WalkInRegistration = () => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleType: 'Car',
    phoneNumber: '',
    slot: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setMessage('Customer registered successfully!')
      setFormData({
        licensePlate: '',
        vehicleType: 'Car',
        phoneNumber: '',
        slot: ''
      })
      setTimeout(() => setMessage(''), 3000)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-brand">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <svg className="w-6 h-6 mr-2 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Walk-in Customer Registration
        </h2>
        <p className="text-gray-500 mt-1">Register a vehicle that arrives without a prior reservation.</p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* License Plate */}
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle License Plate *
            </label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              required
              value={formData.licensePlate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand uppercase"
              placeholder="e.g. ABC-1234"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type *
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand bg-white"
            >
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Phone Number (Optional) */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Phone (Optional)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
              placeholder="e.g. +1 234 567 890"
            />
          </div>

          {/* Allocate Slot */}
          <div>
            <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-1">
              Allocate Parking Slot *
            </label>
            <select
              id="slot"
              name="slot"
              required
              value={formData.slot}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand bg-white"
            >
              <option value="" disabled>Select an available slot</option>
              <option value="A-101">A-101 (Level 1)</option>
              <option value="A-102">A-102 (Level 1)</option>
              <option value="B-201">B-201 (Level 2)</option>
              <option value="B-205">B-205 (Level 2)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-brand text-white font-medium rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Registering...' : 'Register Walk-in'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WalkInRegistration
