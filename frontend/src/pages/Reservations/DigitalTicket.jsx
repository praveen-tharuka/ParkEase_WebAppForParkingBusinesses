import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const DigitalTicket = ({ reservation, onClose }) => {
  const { id } = useParams();

  // Use prop reservation if available, otherwise use default data
  const [ticket] = useState(reservation || {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
                <p className="text-blue-100 mb-1">Confirmation Number</p>
                <h2 className="text-2xl sm:text-3xl font-bold">{ticket.confirmationNumber}</h2>
              </div>
              <div className="text-right">
                <p className="text-blue-100 mb-1">Booking Date</p>
                <p className="font-semibold">{ticket.bookedDate}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            {/* Location Info */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Parking Location</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xl font-semibold text-gray-900">{ticket.location || 'Downtown Parking'}</p>
                <p className="text-gray-600">{ticket.address || '123 Main Street, City Center'}</p>
                <p className="text-gray-600 mt-2">
                  Slot: <span className="font-semibold text-gray-900">{ticket.slotNumber}</span>
                  {ticket.floorLevel && <span> • Floor: {ticket.floorLevel}</span>}
                </p>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-semibold text-gray-900">
                    {ticket.vehicleInfo?.model ? `${ticket.vehicleInfo.make} ${ticket.vehicleInfo.model}` : ticket.vehicle || 'Toyota Camry'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">License Plate</p>
                  <p className="font-semibold text-gray-900">{ticket.vehicleInfo?.licensePlate || ticket.licensePlate || 'ABC123'}</p>
                </div>
                {ticket.vehicleInfo?.color && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold text-gray-900">{ticket.vehicleInfo.color}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Duration & Pricing */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Parking Duration & Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Check-In</p>
                  <p className="font-semibold text-gray-900">{ticket.startDate} at {ticket.startTime}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Check-Out</p>
                  <p className="font-semibold text-gray-900">{ticket.endDate} at {ticket.endTime}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">{ticket.duration?.hours || 8} hours</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Hourly Rate</p>
                  <p className="font-semibold text-gray-900">{ticket.pricing?.hourlyRate || '$2.50/hour'}</p>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-500">
              <p className="text-gray-600 mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-green-600">{ticket.amount || ticket.pricing?.total || '$20.00'}</p>
            </div>

            {/* Amenities */}
            {ticket.amenities && ticket.amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Parking Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ticket.amenities.map((amenity, idx) => (
                    <div key={idx} className="bg-gray-100 text-gray-800 text-center py-3 px-2 rounded-lg text-sm font-medium">
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code & Entry Code */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Entry Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ticket.qrCode && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-3">QR Code</p>
                    <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32 mx-auto" />
                  </div>
                )}
                {ticket.entryCode && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-3">Entry Code</p>
                    <p className="text-3xl font-mono font-bold text-gray-900">{ticket.entryCode}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            {ticket.instructions && (
              <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">Important Instructions</h4>
                <p className="text-gray-700">{ticket.instructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-center print:hidden">
          <button
            onClick={handlePrintTicket}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ticket
          </button>
          <button
            onClick={handleDownloadTicket}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button
            onClick={handleShareTicket}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.368 10.333 12.066 8 15.25 8c.42 0 .827.044 1.221.129m0 0a6.022 6.022 0 010 10.742m0 0c-.394.085-.801.129-1.221.129-3.184 0-5.882-2.333-6.566-5.342m12.866-12.142c.371.034.748.042 1.134.042A6 6 0 0121 12a6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6c.386 0 .763.008 1.134.042M9 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalTicket;

