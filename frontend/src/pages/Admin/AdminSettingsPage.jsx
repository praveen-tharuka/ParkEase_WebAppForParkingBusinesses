import { useState } from 'react'
import AdminDashboardLayout from '../../components/Admin/AdminDashboardLayout'

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    businessName: 'ParkEase Parking',
    email: 'admin@parkease.com',
    phone: '+94 71 234 5678',
    address: 'Colombo, Sri Lanka',
    businessLicense: 'LICENSE-2024-12345',
    timezone: 'Asia/Colombo',
    currency: 'LKR',
    operatingHours: {
      open: '06:00 AM',
      close: '10:00 PM',
    },
    maxVehiclesPerUser: 5,
    cancellationPolicy: 'Free cancellation up to 2 hours before booking',
    supportEmail: 'support@parkease.com',
    supportPhone: '+94 77 999 9999',
    emailNotifications: true,
    smsNotifications: true,
    maintenanceMode: false,
  })

  const [editMode, setEditMode] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    const nestedKey = name.split('.')
    
    if (nestedKey.length > 1) {
      setSettings(prev => ({
        ...prev,
        [nestedKey[0]]: {
          ...prev[nestedKey[0]],
          [nestedKey[1]]: value,
        },
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
    setEditMode(false)
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-2">Manage your business settings and preferences</p>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Settings
            </button>
          )}
        </div>

        {savedMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            {savedMessage}
          </div>
        )}

        {/* Business Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={settings.businessName}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
              <input
                type="text"
                name="businessLicense"
                value={settings.businessLicense}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Operating Settings Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Operating Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              >
                <option>Asia/Colombo</option>
                <option>UTC</option>
                <option>Asia/Bangkok</option>
                <option>Asia/Singapore</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              >
                <option>LKR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>INR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours - Open</label>
              <input
                type="time"
                name="operatingHours.open"
                value={settings.operatingHours.open}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours - Close</label>
              <input
                type="time"
                name="operatingHours.close"
                value={settings.operatingHours.close}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Vehicles Per User</label>
              <input
                type="number"
                name="maxVehiclesPerUser"
                value={settings.maxVehiclesPerUser}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Policies</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
            <textarea
              name="cancellationPolicy"
              value={settings.cancellationPolicy}
              onChange={handleInputChange}
              disabled={!editMode}
              rows="4"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Support Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
              <input
                type="tel"
                name="supportPhone"
                value={settings.supportPhone}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                  !editMode ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm text-gray-700">Enable Email Notifications</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm text-gray-700">Enable SMS Notifications</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm text-gray-700">Maintenance Mode</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        {editMode && (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  )
}

export default AdminSettingsPage
