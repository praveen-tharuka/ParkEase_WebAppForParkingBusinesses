import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { mockVehicles } from '../../data/mockUserData'
import Navbar from '../../components/Navigation/Navbar'
import { reservationsAPI } from '../../services/api'
import Footer from '../../components/Footer/Footer'

const ReservationForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedSlot = location.state?.selectedSlot || null

  if (!selectedSlot) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No parking slot selected</p>
            <button
              onClick={() => navigate('/reservation/search')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to Search
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkInTime: '',
    duration: '1',
    vehicleId: '',
    specialRequests: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required'
    }
    if (!formData.checkInTime) {
      newErrors.checkInTime = 'Check-in time is required'
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required'
    }
    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Calculate pricing
    const selectedVehicle = mockVehicles.find(v => v.id === parseInt(formData.vehicleId))
    const duration = parseInt(formData.duration)
    const hourlyRate = selectedSlot.price.hourly
    const totalAmount = hourlyRate * duration

    const reservationData = {
      selectedSlot,
      formData,
      selectedVehicle,
      duration,
      totalAmount,
      checkOut: calculateCheckOut(formData.checkInDate, formData.checkInTime, duration)
    }

    // Simulate API call
    setTimeout(() => {
      navigate('/reservation/confirm', { state: { reservationData } })
      setIsSubmitting(false)
    }, 500)
  }

  const calculateCheckOut = (date, time, hours) => {
    const [year, month, day] = date.split('-')
    const [hour, minute] = time.split(':')
    const checkInTime = new Date(year, month - 1, day, hour, minute)
    const checkOutTime = new Date(checkInTime.getTime() + hours * 60 * 60 * 1000)
    return checkOutTime.toLocaleString()
  }

  const checkOutDateTime = formData.checkInDate && formData.checkInTime 
    ? calculateCheckOut(formData.checkInDate, formData.checkInTime, parseInt(formData.duration))
    : ''

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8 flex justify-center gap-8">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">✓</div>
              <p className="text-sm text-gray-600">Search</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">2</div>
              <p className="text-sm text-gray-900 font-semibold">Details</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">3</div>
              <p className="text-sm text-gray-600">Confirm</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">4</div>
              <p className="text-sm text-gray-600">Success</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reservation Details</h1>
            <p className="text-gray-600 mt-2">Step 2 of 4</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                {/* Selected Slot Info */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-600">Selected Parking Slot</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedSlot.slotNumber}</h3>
                      <p className="text-gray-600">{selectedSlot.location}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/reservation/search')}
                      className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-semibold"
                    >
                      Change Slot
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Date & Time</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-in Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.checkInDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-in Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="checkInTime"
                        value={formData.checkInTime}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.checkInTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.checkInTime && <p className="text-red-500 text-sm mt-1">{errors.checkInTime}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration (hours) <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      >
                        <option value="">Select duration</option>
                        {[...Array(24)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} hour(s)</option>
                        ))}
                      </select>
                      {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-out Time
                      </label>
                      <input
                        type="text"
                        value={checkOutDateTime}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Selection</h2>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Vehicle <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.vehicleId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Choose a vehicle</option>
                    {mockVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>}
                </div>

                {/* Special Requests */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Special Requests</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <input
                        type="text"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        placeholder="e.g., Near entrance, close to elevator"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any additional information..."
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Terms & Policies</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Free cancellation up to 1 hour before check-in</li>
                    <li>✓ 15-minute grace period for late arrival</li>
                    <li>✓ Overstay charges apply beyond reserved time</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/reservation/search')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-semibold"
                  >
                    {isSubmitting ? 'Processing...' : 'Continue to Confirm'}
                  </button>
                </div>
              </form>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Reservation Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600">Parking Slot</p>
                    <p className="text-lg font-bold text-gray-900">{selectedSlot.slotNumber}</p>
                    <p className="text-sm text-gray-600">{selectedSlot.location}</p>
                  </div>

                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600">Vehicle Type</p>
                    <p className="text-lg font-bold text-gray-900">{selectedSlot.type}</p>
                  </div>

                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-bold text-gray-900">{formData.duration || 'N/A'} hour(s)</p>
                  </div>

                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-lg font-bold text-gray-900">${selectedSlot.price.hourly}/hr</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Estimated Total</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${(selectedSlot.price.hourly * (parseInt(formData.duration) || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/reservation/search')}
                  className="w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-semibold"
                >
                  Change Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ReservationForm
