import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const MyVehiclesPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    plateNumber: '',
    make: '',
    model: '',
    year: '',
    color: '',
    type: 'Car',
  });
  const [formErrors, setFormErrors] = useState({});

  const vehicleTypes = ['Car', 'SUV', 'Motorcycle', 'Truck', 'Van', 'Hatchback', 'Bus'];

  const fetchVehicles = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.vehiclesAPI.getUserVehicles(user.id);
      if (response.success) {
        setVehicles(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch vehicles.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while loading vehicles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const showToast = (message) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.plateNumber.trim()) errors.plateNumber = 'License plate is required';
    if (!formData.make.trim()) errors.make = 'Make is required';
    if (!formData.model.trim()) errors.model = 'Model is required';
    if (formData.year && (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
      errors.year = 'Please enter a valid year';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const openAddModal = () => {
    setFormData({
      plateNumber: '',
      make: '',
      model: '',
      year: '',
      color: '',
      type: 'Car',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      plateNumber: vehicle.plateNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year || '',
      color: vehicle.color || '',
      type: vehicle.vehicleType?.name || 'Car',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.vehiclesAPI.createVehicle(formData);
      if (response.success) {
        setIsAddModalOpen(false);
        fetchVehicles();
        showToast('Vehicle added successfully!');
      } else {
        setFormErrors({ form: response.error || 'Failed to add vehicle.' });
      }
    } catch (err) {
      console.error(err);
      setFormErrors({ form: 'Server error. Please try again.' });
    }
  };

  const handleEditVehicle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.vehiclesAPI.updateVehicle(currentVehicle.id, formData);
      if (response.success) {
        setIsEditModalOpen(false);
        fetchVehicles();
        showToast('Vehicle updated successfully!');
      } else {
        setFormErrors({ form: response.error || 'Failed to update vehicle.' });
      }
    } catch (err) {
      console.error(err);
      setFormErrors({ form: 'Server error. Please try again.' });
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) return;

    try {
      const response = await api.vehiclesAPI.deleteVehicle(vehicleId);
      if (response.success) {
        fetchVehicles();
        showToast('Vehicle removed successfully!');
      } else {
        alert(response.error || 'Failed to remove vehicle.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Failed to remove vehicle.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
            <p className="text-gray-600 mt-1">Manage vehicles registered to your account</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            + Add Vehicle
          </button>
        </div>

        {/* Success message / Toast */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Main content grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <svg className="animate-spin h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3l-2-3H9" />
            </svg>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No vehicles registered</h3>
            <p className="text-gray-500 mb-6">Add your vehicle license plate to make parking slot reservations.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              Add Vehicle Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-brand">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9 9 0 0112.138 0M12 4v1m0 11v1" />
                      </svg>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-full capitalize">
                      {vehicle.vehicleType?.name || vehicle.type || 'Car'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">License Plate:</span>
                      <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-gray-800 border font-semibold">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Color:</span>
                      <span className="capitalize">{vehicle.color || 'N/A'}</span>
                    </div>
                    {vehicle.year && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Year:</span>
                        <span>{vehicle.year}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex space-x-2 border-t pt-4">
                  <button
                    onClick={() => openEditModal(vehicle)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="flex-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modals */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  {isAddModalOpen ? 'Add New Vehicle' : 'Edit Vehicle Details'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={isAddModalOpen ? handleAddVehicle : handleEditVehicle} className="p-6 space-y-4">
                {formErrors.form && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">
                    {formErrors.form}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">License Plate *</label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. KDY-4509"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand font-mono uppercase ${
                      formErrors.plateNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.plateNumber && <p className="text-red-500 text-xs mt-1">{formErrors.plateNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Make *</label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      placeholder="e.g. Toyota"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                        formErrors.make ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.make && <p className="text-red-500 text-xs mt-1">{formErrors.make}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g. Camry"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                        formErrors.model ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.model && <p className="text-red-500 text-xs mt-1">{formErrors.model}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g. 2020"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                        formErrors.year ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.year && <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g. Silver"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    {vehicleTypes.map(vt => (
                      <option key={vt} value={vt}>{vt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                  >
                    {isAddModalOpen ? 'Add Vehicle' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyVehiclesPage;
