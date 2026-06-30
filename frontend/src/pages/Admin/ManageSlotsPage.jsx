import { useState } from 'react'
import AdminDashboardLayout from '../../components/Admin/AdminDashboardLayout'
import { mockSlots } from '../../data/mockSlots'

const ManageSlotsPage = () => {
  const [slots, setSlots] = useState(mockSlots)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [formData, setFormData] = useState({
    slotNumber: '',
    type: 'Car',
    location: '',
    price: {
      hourly: 0,
      daily: 0,
    },
    available: true,
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || 0,
        },
      }))
    } else if (name === 'available') {
      setFormData(prev => ({
        ...prev,
        available: value === 'true',
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAddSlot = () => {
    if (!formData.slotNumber || !formData.location) {
      alert('Please fill in all required fields')
      return
    }
    const newSlot = {
      id: Math.max(...slots.map(s => s.id), 0) + 1,
      ...formData,
    }
    setSlots([...slots, newSlot])
    resetForm()
    setShowAddForm(false)
  }

  const handleEditSlot = slot => {
    setEditingSlot(slot.id)
    setFormData(slot)
  }

  const handleUpdateSlot = () => {
    if (!formData.slotNumber || !formData.location) {
      alert('Please fill in all required fields')
      return
    }
    setSlots(slots.map(slot => (slot.id === editingSlot ? formData : slot)))
    resetForm()
    setEditingSlot(null)
  }

  const handleDeleteSlot = id => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      setSlots(slots.filter(slot => slot.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      slotNumber: '',
      type: 'Car',
      location: '',
      price: {
        hourly: 0,
        daily: 0,
      },
      available: true,
    })
  }

  const cancelEdit = () => {
    setEditingSlot(null)
    resetForm()
  }

  const cancelAdd = () => {
    setShowAddForm(false)
    resetForm()
  }

  const locations = [...new Set(slots.map(s => s.location))]
  const types = [...new Set(slots.map(s => s.type))]

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Parking Slots</h1>
            <p className="text-gray-500 mt-2">Add, edit, or delete parking slots</p>
          </div>
          {!showAddForm && !editingSlot && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Slot
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingSlot) && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingSlot ? 'Edit Slot' : 'Add New Slot'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slot Number *</label>
                <input
                  type="text"
                  name="slotNumber"
                  value={formData.slotNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., A-101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option>Car</option>
                  <option>SUV</option>
                  <option>Motorbike</option>
                  <option>Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">Select Location</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                  <option value="">Add new location...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="available"
                  value={formData.available}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Price (LKR) *</label>
                <input
                  type="number"
                  name="price.hourly"
                  value={formData.price.hourly}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price (LKR) *</label>
                <input
                  type="number"
                  name="price.daily"
                  value={formData.price.daily}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {editingSlot ? (
                <>
                  <button
                    onClick={handleUpdateSlot}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Slot
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddSlot}
                    className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                  >
                    Create Slot
                  </button>
                  <button
                    onClick={cancelAdd}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map(slot => (
            <div key={slot.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{slot.slotNumber}</h3>
                  <p className="text-sm text-gray-500">{slot.location}</p>
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {slot.available ? 'Available' : 'Occupied'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium text-gray-900">{slot.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hourly Price:</span>
                  <span className="text-sm font-medium text-gray-900">LKR {slot.price.hourly}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Price:</span>
                  <span className="text-sm font-medium text-gray-900">LKR {slot.price.daily}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditSlot(slot)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {slots.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <p className="text-gray-500">No parking slots added yet</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  )
}

export default ManageSlotsPage
