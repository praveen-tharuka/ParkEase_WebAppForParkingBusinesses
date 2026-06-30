import { useState } from 'react'
import AdminDashboardLayout from '../../components/Admin/AdminDashboardLayout'
import WalkInRegistration from '../../components/Admin/WalkInRegistration'

const WalkInRegistrationPage = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Walk-In Vehicle Registration</h1>
          <p className="text-gray-500 mt-2">
            Register walk-in vehicles and assign them to available parking spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <WalkInRegistration />
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Available Slots Today</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Car</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SUV</span>
                  <span className="font-bold text-green-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Motorcycle</span>
                  <span className="font-bold text-purple-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Van/Truck</span>
                  <span className="font-bold text-orange-600">3</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>✓ Verify the license plate carefully</li>
                <li>✓ Confirm vehicle type match</li>
                <li>✓ Get valid contact number</li>
                <li>✓ Assign appropriate slot</li>
                <li>✓ Keep confirmation receipt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

export default WalkInRegistrationPage
