import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import api from '../../services/api';

const ReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservationDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.reservationsAPI.getReservationById(id);
      if (response.success) {
        const resData = response.data?.data || response.data;
        setReservation(resData);
      } else {
        setError(response.error || 'Failed to fetch reservation details.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while loading reservation details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservationDetails();
  }, [id]);

  const handleCancelReservation = async () => {
    if (!reservation) return;
    const reason = window.prompt('Please enter a reason for cancellation (optional):');
    if (reason === null) return; // user cancelled prompt

    try {
      setIsLoading(true);
      const response = await api.reservationsAPI.cancelReservation(reservation.id, reason || 'Cancelled by user');
      if (response.success) {
        alert('Reservation cancelled successfully.');
        fetchReservationDetails();
      } else {
        alert(response.error || 'Failed to cancel reservation.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while cancelling the reservation.');
      setIsLoading(false);
    }
  };

  const handleModifyReservation = () => {
    navigate(`/dashboard/reservations/${id}/edit`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CHECKED_IN':
        return 'bg-green-100 text-green-800';
      case 'CONFIRMED':
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'Upcoming';
      case 'PENDING': return 'Pending';
      case 'CHECKED_IN': return 'Active';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status || 'Unknown';
    }
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
            <p className="text-gray-600 font-medium">Loading reservation details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !reservation) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <h3 className="font-semibold text-lg">Error Loading Details</h3>
            <p className="text-sm mt-1">{error || 'Reservation not found.'}</p>
            <button 
              onClick={() => navigate('/dashboard/reservations')}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Back to Reservations
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const start = new Date(reservation.startTime);
  const end = new Date(reservation.endTime);
  const hours = Math.ceil(Math.abs(end - start) / 36e5) || 1;

  const payment = reservation.payments?.[0];
  const paymentMethod = payment?.paymentMethod || 'N/A';
  const paymentStatus = payment?.paymentStatus || 'PENDING';

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/reservations')}
            className="text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-2 mb-4"
          >
            ← Back to Reservations
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {reservation.slot?.location?.name || 'Unknown Location'}
              </h1>
              <p className="text-gray-600 mt-1">
                {reservation.slot?.location?.address || 'No address details'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold capitalize ${getStatusColor(reservation.status)}`}>
              {formatStatus(reservation.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Reservation Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Reservation Overview</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Confirmation Code</p>
                  <p className="text-lg font-semibold text-gray-850 font-mono text-indigo-600">{reservation.reservationCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(reservation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot Number</p>
                  <p className="text-lg font-semibold text-gray-855 text-brand">{reservation.slot?.slotNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot Type</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {reservation.slot?.slotType?.toLowerCase() || 'Regular'}
                  </p>
                </div>
              </div>
            </div>

            {/* Check-in & Check-out */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Check-in & Check-out</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="text-lg font-semibold text-gray-800">{start.toLocaleDateString()}</p>
                  <p className="text-lg font-medium text-gray-600">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="text-lg font-semibold text-gray-800">{end.toLocaleDateString()}</p>
                  <p className="text-lg font-medium text-gray-600">{end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {reservation.vehicle ? `${reservation.vehicle.make} ${reservation.vehicle.model}` : 'N/A'}
                  </p>
                </div>
                {reservation.vehicle?.color && (
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{reservation.vehicle.color}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="text-lg font-mono font-bold text-gray-800 bg-gray-50 px-2 py-0.5 border rounded w-max mt-0.5">
                    {reservation.vehicle?.plateNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes & Special Requests */}
            {(reservation.notes || reservation.specialRequests) && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 space-y-4">
                {reservation.specialRequests && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-850 mb-1">Special Requests</h2>
                    <p className="text-gray-700">{reservation.specialRequests}</p>
                  </div>
                )}
                {reservation.notes && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-850 mb-1">Notes</h2>
                    <p className="text-gray-700">{reservation.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing Summary</h2>
              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Base Fee</p>
                  <p className="font-semibold text-gray-800">LKR {Number(reservation.baseFee || 0).toLocaleString()}</p>
                </div>
                {Number(reservation.modificationFee || 0) > 0 && (
                  <div className="flex justify-between">
                    <p className="text-gray-600">Modification Fee</p>
                    <p className="font-semibold text-gray-850">LKR {Number(reservation.modificationFee).toLocaleString()}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium text-gray-600">{hours} {hours === 1 ? 'hour' : 'hours'}</p>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-lg font-bold text-gray-800">Total Fee</p>
                <p className="text-2xl font-bold text-brand">LKR {Number(reservation.totalFee || 0).toLocaleString()}</p>
              </div>
              <div className="text-sm text-gray-500 border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Method:</span>
                  <span className="font-semibold capitalize text-gray-750">{paymentMethod.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className={`font-semibold capitalize ${
                    paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                  }`}>{paymentStatus.toLowerCase()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {reservation.status !== 'CANCELLED' && reservation.status !== 'COMPLETED' && (
                  <>
                    <button
                      onClick={handleModifyReservation}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Modify Reservation
                    </button>
                    <button
                      onClick={handleCancelReservation}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Cancel Reservation
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationDetails;
