import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import DigitalTicket from './DigitalTicket';


const MyReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([
    {
      id: 1,
      location: 'Downtown Parking',
      slotNumber: 'A-12',
      startDate: '2026-01-20',
      startTime: '09:00 AM',
      endDate: '2026-01-20',
      endTime: '05:00 PM',
      status: 'Active',
      amount: '$15.00',
      vehicle: 'Toyota Camry - ABC123'
    },
    {
      id: 2,
      location: 'Mall Parking',
      slotNumber: 'B-45',
      startDate: '2026-01-25',
      startTime: '10:00 AM',
      endDate: '2026-01-25',
      endTime: '06:00 PM',
      status: 'Upcoming',
      amount: '$12.00',
      vehicle: 'Honda Civic - XYZ789'
    },
    {
      id: 3,
      location: 'Airport Parking',
      slotNumber: 'C-78',
      startDate: '2026-01-15',
      startTime: '08:00 AM',
      endDate: '2026-01-15',
      endTime: '04:00 PM',
      status: 'Completed',
      amount: '$20.00',
      vehicle: 'Toyota Camry - ABC123'
    }
  ]);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showTicket, setShowTicket] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
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

  const handleCancelReservation = (id) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, status: 'Cancelled' } : res
    ));
  };

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
