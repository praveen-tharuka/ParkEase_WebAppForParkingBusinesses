import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navigation/Navbar'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext'
import { reservationsAPI } from '../../services/api'

const ReservationConfirm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const reservationData = location.state?.reservationData || null
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  if (!reservationData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No reservation data found</p>
            <button
              onClick={() => navigate('/reservation/search')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start New Reservation
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const { selectedSlot, formData, selectedVehicle, duration, totalAmount, checkOut } = reservationData

  const handleConfirm = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the Terms & Conditions')
      return
    }

    setIsProcessing(true)

    try {
      const response = await reservationsAPI.createReservation({
        customerId: user?.id,
        slotId: selectedSlot.id,
        vehicleId: selectedVehicle.id,
        startTime: reservationData.startTimeISO,
        endTime: reservationData.endTimeISO,
        specialRequests: formData.specialRequests || '',
        notes: formData.notes || '',
      })

      if (response.success) {
        navigate('/reservation/success')
      } else {
        alert(response.error || 'Failed to create reservation')
      }
    } catch (err) {
      console.error(err)
      alert('An unexpected error occurred while creating the reservation.')
    } finally {
      setIsProcessing(false)
    }
  }

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
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">✓</div>
              <p className="text-sm text-gray-600">Details</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">3</div>
              <p className="text-sm text-gray-900 font-semibold">Confirm</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">4</div>
              <p className="text-sm text-gray-600">Success</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Confirm Your Reservation</h1>
            <p className="text-gray-600 mt-2">Step 3 of 4 - Please review all details before confirming</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Parking Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Parking Details</h2>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Slot Number</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedSlot.slotNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedSlot.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vehicle Type</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedSlot.type}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Date & Time</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Check-in Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.checkInDate}</p>
                    <p className="text-sm text-gray-600">{formData.checkInTime}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Check-out</p>
                    <p className="text-lg font-semibold text-gray-900">{checkOut}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Total Duration</p>
                    <p className="text-2xl font-bold text-green-600">{duration} Hour(s)</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Details</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Make & Model:</span>
                    <span className="font-semibold text-gray-900">{selectedVehicle.make} {selectedVehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License Plate:</span>
                    <span className="font-mono font-semibold text-gray-900">{selectedVehicle.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Type:</span>
                    <span className="font-semibold text-gray-900">{selectedVehicle.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-semibold text-gray-900">{selectedVehicle.color}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Important Terms & Policies</h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Free cancellation up to 1 hour before check-in</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>15-minute grace period for late arrival</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-3">⚠️</span>
                    <span>Overstay charges apply beyond reserved time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-3">⚠️</span>
                    <span>No-show will result in full charge</span>
                  </li>
                </ul>

                <label className="flex items-center mt-4 p-3 bg-white rounded border-2 border-yellow-300">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="ml-3 text-gray-900 font-semibold">
                    I agree to the Terms & Conditions
                  </span>
                </label>
              </div>

              {/* Additional Notes */}
              {(formData.specialRequests || formData.notes) && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Your Special Requests</h3>
                  {formData.specialRequests && (
                    <p className="text-gray-700 mb-2"><strong>Requests:</strong> {formData.specialRequests}</p>
                  )}
                  {formData.notes && (
                    <p className="text-gray-700"><strong>Notes:</strong> {formData.notes}</p>
                  )}
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Price Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-semibold text-gray-900">${selectedSlot.price.hourly}/hr</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-gray-900">{duration} hours</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">${(selectedSlot.price.hourly * duration).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-3xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!agreedToTerms || isProcessing}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                    agreedToTerms && !isProcessing
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Confirm Reservation'}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full mt-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Edit Details
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your payment will be processed securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ReservationConfirm
