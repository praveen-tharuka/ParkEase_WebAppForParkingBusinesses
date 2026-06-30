import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import api from '../../services/api';

const EditReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: '',
    slotNumber: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    vehicle: '',
    specialRequests: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateForInput = (dateObj) => {
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  const formatTimeForInput = (dateObj) => {
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchReservation = async () => {
      setIsLoading(true);
      try {
        const response = await api.reservationsAPI.getReservationById(id);
        if (response.success) {
          const res = response.data;
          setFormData({
            location: res.slot?.location?.name || 'Unknown Location',
            slotNumber: res.slot?.slotNumber || 'N/A',
            startDate: formatDateForInput(res.startTime),
            startTime: formatTimeForInput(res.startTime),
            endDate: formatDateForInput(res.endTime),
            endTime: formatTimeForInput(res.endTime),
            vehicle: res.vehicle ? `${res.vehicle.make} ${res.vehicle.model} - ${res.vehicle.plateNumber}` : 'N/A',
            specialRequests: res.specialRequests || '',
            notes: res.notes || ''
          });
        } else {
          alert(response.error || 'Failed to load reservation details.');
          navigate('/dashboard/reservations');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load reservation details.');
        navigate('/dashboard/reservations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (isNaN(startDateTime.getTime())) {
        newErrors.startTime = 'Invalid start date/time';
      }
      if (isNaN(endDateTime.getTime())) {
        newErrors.endTime = 'Invalid end date/time';
      }

      if (endDateTime <= startDateTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const updatePayload = {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        specialRequests: formData.specialRequests,
        notes: formData.notes,
      };

      const response = await api.reservationsAPI.updateReservation(id, updatePayload);
      if (response.success) {
        alert('Reservation updated successfully!');
        navigate(`/dashboard/reservations/${id}`);
      } else {
        alert(response.error || 'Failed to update reservation.');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/reservations/${id}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-10 w-10 text-brand" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Loading reservation...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/dashboard/reservations/${id}`)}
            className="text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-2 mb-4"
          >
            ← Back to Reservation Details
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Reservation</h1>
          <p className="text-gray-600 mt-2">Modify your parking reservation details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 border border-gray-150">
          {/* Location Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parking Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-650 cursor-not-allowed focus:outline-none"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slot Number
                </label>
                <input
                  type="text"
                  name="slotNumber"
                  value={formData.slotNumber}
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-650 cursor-not-allowed focus:outline-none"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-out Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand ${
                    errors.endTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Information</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle
              </label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-650 cursor-not-allowed focus:outline-none"
                disabled
              />
            </div>
          </div>

          {/* Additional Requests Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Special Requests & Notes</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requests
                </label>
                <input
                  type="text"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="e.g., Near entrance, covered spot"
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
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Any additional information or requests..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Changes to your reservation will be subject to availability and may incur additional charges if extending your stay.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditReservation;
