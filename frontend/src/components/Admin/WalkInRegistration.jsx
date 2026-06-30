import { useState, useEffect } from 'react'
import api from '../../services/api'
const { walkinsAPI, slotsAPI } = api

const WalkInRegistration = () => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleType: 'Car',
    phoneNumber: '',
    slot: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Fetch available slots from backend database
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setLoadingSlots(true)
      try {
        const response = await slotsAPI.searchSlots({ status: 'AVAILABLE' })
        if (response.success && response.data) {
          const rawSlots = Array.isArray(response.data)
            ? response.data
            : (response.data.data || [])
          const mapped = rawSlots.map(s => ({
            id: s.id,
            slotNumber: s.slotNumber,
            location: s.location?.name || 'Downtown',
            type: s.supportedVehicleType?.name || 'Car',
            available: s.status === 'AVAILABLE'
          }))
          setSlots(mapped)
        }
      } catch (err) {
        console.error('Error fetching slots:', err)
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchAvailableSlots()
  }, [formData.vehicleType])

  // Filter available slots by vehicle type
  const availableSlots = slots.filter(
    slot => slot.type === formData.vehicleType
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.licensePlate.trim()) {
      setMessageType('error')
      setMessage('License plate is required')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    if (!formData.phoneNumber.trim()) {
      setMessageType('error')
      setMessage('Phone number is required')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    if (!formData.slot) {
      setMessageType('error')
      setMessage('Please select a parking slot')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await walkinsAPI.createWalkIn({
        licensePlate: formData.licensePlate.toUpperCase().trim(),
        vehicleType: formData.vehicleType,
        phoneNumber: formData.phoneNumber.trim(),
        slotNumber: formData.slot
      })

      if (response.success) {
        setMessageType('success')
        setMessage('✓ Vehicle registered successfully! Slot assigned: ' + formData.slot)
        
        // Remove the newly occupied slot from local state immediately
        setSlots(prev => prev.filter(s => s.slotNumber !== formData.slot))
        
        setFormData({
          licensePlate: '',
          vehicleType: 'Car',
          phoneNumber: '',
          slot: ''
        })
      } else {
        setMessageType('error')
        setMessage(response.error || 'Failed to register walk-in vehicle')
      }
    } catch (err) {
      console.error('Walk-In Registration Error:', err)
      setMessageType('error')
      setMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setMessage(''), 5000)
    }
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
        <div className={`mb-4 p-4 rounded-md flex items-center border ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {messageType === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
            )}
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

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
              placeholder="e.g. 03001234567"
            />
          </div>
        </div>

        {/* Slot Selection */}
        <div>
          <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-3">
            Assign Parking Slot ({formData.vehicleType}) *
          </label>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, slot: slot.slotNumber })}
                  className={`p-3 rounded-lg border-2 transition-all font-medium text-center ${
                    formData.slot === slot.slotNumber
                      ? 'border-brand bg-brand/10 text-brand shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-brand hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg font-bold">{slot.slotNumber}</div>
                  <div className="text-xs text-gray-500 mt-1">{slot.location}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                No available slots for {formData.vehicleType}. Please select a different vehicle type.
              </p>
            </div>
          )}
          {formData.slot && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              ✓ Selected: {formData.slot}
            </p>
          )}
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <button
            type="reset"
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => {
              setFormData({
                licensePlate: '',
                vehicleType: 'Car',
                phoneNumber: '',
                slot: ''
              })
              setMessage('')
            }}
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.slot}
            className={`px-8 py-2 bg-brand text-white font-medium rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors shadow-sm flex items-center gap-2 ${isSubmitting || !formData.slot ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isSubmitting ? 'Registering...' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WalkInRegistration
