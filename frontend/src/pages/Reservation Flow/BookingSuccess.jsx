import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navigation/Navbar'
import Footer from '../../components/Footer/Footer'

const BookingSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl p-12 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-2">
              Your parking reservation has been successfully created.
            </p>
            <p className="text-gray-500 mb-8">
              A confirmation message has been sent to your email and phone.
            </p>

            {/* Confirmation Details */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Confirmation #:</span>
                  <span className="font-mono font-semibold text-gray-900">PK-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Steps:</span>
                  <span className="text-gray-900">View your booking details in the dashboard</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Important Reminders</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Arrive at least 10 minutes before your check-in time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>You can cancel up to 1 hour before check-in for a full refund</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Download or print your digital ticket for quick entry</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/user-dashboard')}
                className="flex-1 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h2.05a1 1 0 01.82.47l2.84 4.27a1 1 0 001.82 0l2.84-4.27A1 1 0 0117 19h2.05a1 1 0 001-1V9M9 20h6" />
                </svg>
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/reservation/search')}
                className="flex-1 px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Book Another Slot
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Have questions? <a href="#support" className="text-blue-600 hover:underline font-semibold">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BookingSuccess
