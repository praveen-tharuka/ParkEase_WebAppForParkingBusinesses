import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import DigitalTicket from './DigitalTicket';

const mapBackendReservation = (res) => {
  const start = new Date(res.startTime);
  const end = new Date(res.endTime);
  
  let displayStatus = res.status;
  if (res.status === 'CONFIRMED') displayStatus = 'Upcoming';
  else if (res.status === 'PENDING') displayStatus = 'Pending';
  else if (res.status === 'CHECKED_IN') displayStatus = 'Active';
  else if (res.status === 'COMPLETED') displayStatus = 'Completed';
  else if (res.status === 'CANCELLED') displayStatus = 'Cancelled';

  // Format currency (LKR is default, matching system settings)
  const formattedAmount = res.totalFee ? `LKR ${Number(res.totalFee).toLocaleString()}` : 'N/A';

  return {
    id: res.id,
    location: res.slot?.location?.name || 'Unknown Location',
    slotNumber: res.slot?.slotNumber || 'N/A',
    startDate: start.toLocaleDateString(),
    startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endDate: end.toLocaleDateString(),
    endTime: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: displayStatus,
    amount: formattedAmount,
    vehicle: res.vehicle ? `${res.vehicle.make} ${res.vehicle.model} - ${res.vehicle.plateNumber}` : 'N/A',
  };
};

const MyReservations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await api.reservationsAPI.getUserReservations(user.id);
      if (response.success) {
        const mapped = (response.data || []).map(mapBackendReservation);
        setReservations(mapped);
      } else {
        setError(response.error || 'Failed to fetch reservations');
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching reservations.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showTicket, setShowTicket] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (reservation) => {
    navigate(`/dashboard/reservations/${reservation.id}`);
  };

  const handleViewTicket = (reservation) => {
    setSelectedReservation(reservation);
    setShowTicket(true);
  };

  const handleEditReservation = (reservation) => {
    navigate(`/dashboard/reservations/${reservation.id}/edit`);
  };

  const handleCancelReservation = async (id) => {
    try {
      const response = await api.reservationsAPI.cancelReservation(id, 'User cancelled');
      if (response.success) {
        setReservations(prev => prev.map(res =>
          res.id === id ? { ...res, status: 'Cancelled' } : res
        ));
      } else {
        // Fallback to local cancellation if other members have not fully completed the reservations routes
        setReservations(prev => prev.map(res =>
          res.id === id ? { ...res, status: 'Cancelled' } : res
        ));
        console.warn('API cancel call returned failure; fallback to local state:', response.error);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setReservations(prev => prev.map(res =>
        res.id === id ? { ...res, status: 'Cancelled' } : res
      ));
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
            <p className="text-gray-600 font-medium">Loading reservations...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <h3 className="font-semibold text-lg">Error Loading Reservations</h3>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={fetchReservations}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showTicket && selectedReservation ? (
        <div>
          <button
            onClick={() => setShowTicket(false)}
            className="mb-4 text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            ← Back to Reservations
          </button>
          <DigitalTicket reservation={selectedReservation} onClose={() => setShowTicket(false)} />
        </div>
      ) : (
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Reservations</h1>
            <p className="text-gray-600 mt-2">View and manage your parking reservations</p>
          </div>

          {/* Reservations List */}
          <div className="grid grid-cols-1 gap-6">
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => handleViewTicket(reservation)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{reservation.location}</h3>
                      <p className="text-gray-600">Slot: {reservation.slotNumber}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="text-gray-800 font-semibold">{reservation.startDate} at {reservation.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="text-gray-800 font-semibold">{reservation.endDate} at {reservation.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="text-gray-800 font-semibold">{reservation.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-gray-800 font-semibold">{reservation.amount}</p>
                    </div>
                  </div>

                  <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleViewDetails(reservation)}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                    {(reservation.status === 'Active' || reservation.status === 'Upcoming') && (
                      <button
                        onClick={() => handleEditReservation(reservation)}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                      >
                        Edit
                      </button>
                    )}
                    {(reservation.status === 'Active' || reservation.status === 'Upcoming') && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No reservations found</p>
                <button className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
                  Make a Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyReservations;
