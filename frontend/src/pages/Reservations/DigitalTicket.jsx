import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navigation/Navbar';
import Footer from '../../components/Footer/Footer';

const DigitalTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket] = useState({
    id: 1,
    confirmationNumber: 'PK-2026-001245',
    status: 'Active',
    location: 'Downtown Parking',
    address: '123 Main Street, City Center',
    slotNumber: 'A-12',
    floorLevel: '2nd Floor',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      licensePlate: 'ABC123',
      color: 'Silver'
    },
    duration: {
      checkIn: '2026-01-20T09:00',
      checkOut: '2026-01-20T17:00',
      hours: 8
    },
    pricing: {
      hourlyRate: '$2.50',
      totalHours: 8,
      total: '$20.00'
    },
    entryCode: '1234',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    bookedDate: '2026-01-18',
    amenities: ['CCTV', '24/7 Security', 'EV Charging', 'Covered'],
    instructions: 'Please park in the assigned slot. Use your confirmation number or QR code to exit.',
    validFrom: '2026-01-20 09:00 AM',
    validTo: '2026-01-20 05:00 PM'
  });

  const handleDownloadTicket = () => {
    alert('Ticket download functionality would be implemented here');
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleShareTicket = () => {
    alert('Ticket sharing functionality would be implemented here');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/my-reservations')}
              className="text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-2 mb-4"
            >
              ← Back to Reservations
            </button>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Digital Parking Ticket</h1>
              <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                {ticket.status}
              </span>
            </div>
          </div>

          {/* Main Ticket */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-6 print:shadow-none">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-semibold">CONFIRMATION NUMBER</p>
                  <p className="text-3xl font-bold">{ticket.confirmationNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Valid From</p>
                  <p className="text-lg font-semibold">{ticket.validFrom}</p>
                </div>
              </div>
              <div className="border-t border-blue-400 pt-4">
                <p className="text-blue-100 text-sm mb-1">Booked on</p>
                <p className="font-semibold">{ticket.bookedDate}</p>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-6 sm:p-8">
              {/* Location & Parking Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Parking Location</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Location Name</p>
                      <p className="text-xl font-bold text-gray-800">{ticket.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-700">{ticket.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Slot Number</p>
                        <p className="text-xl font-bold text-blue-600">{ticket.slotNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Floor Level</p>
                        <p className="text-xl font-bold text-gray-800">{ticket.floorLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                  <div className="mb-4 border-4 border-gray-300 p-2 bg-white rounded">
                    <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32" />
                  </div>
                  <p className="text-sm text-gray-600 text-center font-semibold">Scan for Quick Entry</p>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Entry Code</p>
                    <p className="text-2xl font-bold text-gray-800 tracking-widest">{ticket.entryCode}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Vehicle Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Make</p>
                    <p className="font-semibold text-gray-800">{ticket.vehicleInfo.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-semibold text-gray-800">{ticket.vehicleInfo.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-semibold text-gray-800">{ticket.vehicleInfo.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-bold text-blue-600 text-lg tracking-wider">{ticket.vehicleInfo.licensePlate}</p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Parking Duration</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(ticket.duration.checkIn).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(ticket.duration.checkOut).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded p-4 flex flex-col justify-center">
                    <p className="text-sm text-gray-500 text-center">Total Hours</p>
                    <p className="text-3xl font-bold text-center text-blue-600">{ticket.duration.hours}h</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8 rounded">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Pricing Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-700">Hourly Rate</p>
                    <p className="font-semibold text-gray-800">{ticket.pricing.hourlyRate}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-700">Hours Booked</p>
                    <p className="font-semibold text-gray-800">{ticket.pricing.totalHours} hours</p>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <p className="text-lg font-bold text-gray-800">Total Amount</p>
                    <p className="text-3xl font-bold text-green-600">{ticket.pricing.total}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Available Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ticket.amenities.map((amenity, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="font-semibold text-gray-800">{amenity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Important Instructions</h2>
                <p className="text-gray-700 leading-relaxed">{ticket.instructions}</p>
              </div>

              {/* Footer Notice */}
              <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600">
                <p>Valid from {ticket.validFrom} to {ticket.validTo}</p>
                <p className="mt-2">This is your digital parking ticket. Please keep it safe.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
            <button
              onClick={handleDownloadTicket}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
            >
              ⬇ Download Ticket
            </button>
            <button
              onClick={handlePrintTicket}
              className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition font-semibold flex items-center justify-center gap-2"
            >
              🖨 Print Ticket
            </button>
            <button
              onClick={handleShareTicket}
              className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
            >
              📤 Share Ticket
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DigitalTicket;
