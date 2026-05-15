import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';

const ReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation] = useState({
    id: 1,
    location: 'Downtown Parking',
    address: '123 Main Street, City Center',
    slotNumber: 'A-12',
    floorLevel: '2nd Floor',
    startDate: '2026-01-20',
    startTime: '09:00 AM',
    endDate: '2026-01-20',
    endTime: '05:00 PM',
    status: 'Active',
    totalAmount: '$15.00',
    hourlyRate: '$2.50',
    hours: 8,
    vehicle: 'Toyota Camry - ABC123',
    vehicleColor: 'Silver',
    licensePlate: 'ABC123',
    bookingDate: '2026-01-18',
    confirmationNumber: 'PK-2026-001245',
    paymentMethod: 'Credit Card (Visa)',
    amenities: ['CCTV Surveillance', '24/7 Security', 'EV Charging', 'Covered Parking'],
    notes: 'Reserved spot with direct elevator access',
    cancellationPolicy: 'Free cancellation up to 2 hours before check-in',
  });

  const handleCancelReservation = () => {
    alert('Are you sure you want to cancel this reservation?');
    // Cancel logic here
  };

  const handleExtendReservation = () => {
    alert('Extend reservation functionality');
    // Extend logic here
  };

  const handleModifyReservation = () => {
    navigate(`/dashboard/reservations/${id}/edit`);
  };

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
              <h1 className="text-3xl font-bold text-gray-800">{reservation.location}</h1>
              <p className="text-gray-600 mt-1">{reservation.address}</p>
            </div>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              {reservation.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Reservation Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Reservation Overview</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Confirmation Number</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.confirmationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.bookingDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot Number</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.slotNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Floor Level</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.floorLevel}</p>
                </div>
              </div>
            </div>

            {/* Check-in & Check-out */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Check-in & Check-out</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.startDate}</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.startTime}</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.endDate}</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.endTime}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.vehicleColor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="text-lg font-semibold text-gray-800">{reservation.licensePlate}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {reservation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-700">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Notes</h2>
              <p className="text-gray-700">{reservation.notes}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing Summary</h2>
              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Hourly Rate</p>
                  <p className="font-semibold">{reservation.hourlyRate}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Hours</p>
                  <p className="font-semibold">{reservation.hours}</p>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-lg font-bold text-gray-800">Total</p>
                <p className="text-2xl font-bold text-blue-600">{reservation.totalAmount}</p>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                <p className="font-semibold mb-1">Payment Method:</p>
                <p>{reservation.paymentMethod}</p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Cancellation Policy</h3>
              <p className="text-sm text-yellow-700">{reservation.cancellationPolicy}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleExtendReservation}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Extend Reservation
              </button>
              <button
                onClick={handleModifyReservation}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Modify
              </button>
              <button
                onClick={handleCancelReservation}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationDetails;
                  onClick={handleCancelReservation}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReservationDetails;