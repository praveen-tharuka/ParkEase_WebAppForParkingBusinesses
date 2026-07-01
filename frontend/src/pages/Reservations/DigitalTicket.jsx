import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const DigitalTicket = ({ reservation, onClose }) => {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!reservation?.id) return;
      setIsLoading(true);
      try {
        const response = await api.ticketsAPI.getTicket(reservation.id);
        if (response.success) {
          setTicket(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [reservation?.id]);

  const handlePrintTicket = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <svg className="animate-spin h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 font-medium">Generating digital ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
        <h3 className="font-semibold">Error Loading Ticket</h3>
        <p className="text-sm mt-1">Failed to generate or retrieve the parking ticket.</p>
      </div>
    );
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.ticketBarcode)}`;
  
  const checkIn = reservation?.startDate && reservation?.startTime 
    ? `${reservation.startDate} at ${reservation.startTime}`
    : ticket.reservation?.startTime ? new Date(ticket.reservation.startTime).toLocaleString() : 'N/A';

  const checkOut = reservation?.endDate && reservation?.endTime
    ? `${reservation.endDate} at ${reservation.endTime}`
    : ticket.reservation?.endTime ? new Date(ticket.reservation.endTime).toLocaleString() : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-6 border border-gray-150 print:border-none print:shadow-none max-w-2xl mx-auto">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Ticket Number</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono">{ticket.ticketNumber}</h2>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Allocation</p>
            <p className="font-bold bg-blue-700 bg-opacity-50 px-2 py-1 rounded text-xs capitalize">{ticket.allocationType.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8">
        {/* Location Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Parking Location</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-lg font-bold text-gray-900">{ticket.slot?.location?.name || 'Unknown Location'}</p>
            <p className="text-sm text-gray-600 mt-0.5">{ticket.slot?.location?.address || 'N/A'}</p>
            <p className="text-gray-700 text-sm mt-3 pt-3 border-t">
              Slot: <span className="font-bold text-brand">{ticket.slot?.slotNumber}</span>
              <span className="mx-2">•</span>
              Type: <span className="font-semibold text-gray-800 capitalize">{ticket.slot?.slotType?.toLowerCase()}</span>
            </p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Vehicle Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold uppercase">Vehicle</p>
              <p className="font-bold text-gray-900 capitalize">
                {ticket.vehicle ? `${ticket.vehicle.make} ${ticket.vehicle.model}` : 'N/A'}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold uppercase">License Plate</p>
              <p className="font-bold text-gray-950 font-mono uppercase">{ticket.vehicle?.plateNumber || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Duration & Pricing */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Duration</h3>
          <div className="grid grid-cols-2 gap-4 border border-gray-100 p-4 rounded-lg bg-gray-50">
            <div>
              <p className="text-xs text-gray-500">CHECK-IN</p>
              <p className="text-sm font-semibold text-gray-800">{checkIn}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">CHECK-OUT</p>
              <p className="text-sm font-semibold text-gray-800">{checkOut}</p>
            </div>
          </div>
        </div>

        {/* Access Code Section */}
        <div className="mb-6 border-t pt-6">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3 text-center">Entry Access Barcode & Code</h3>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-around bg-indigo-50 p-6 rounded-lg border border-indigo-150">
            <div className="text-center">
              <img src={qrCodeUrl} alt="Ticket QR Code" className="w-36 h-36 bg-white p-2 rounded shadow-md border" />
              <p className="text-xs text-gray-500 mt-2 font-mono">{ticket.ticketBarcode}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Gate entry passcode</p>
              <p className="text-4xl font-mono font-black text-indigo-900 tracking-widest mt-2">{ticket.entryCode || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-2">Enter this code at the gate keypad</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm">
          <h4 className="font-bold text-yellow-800 mb-1">Important Parking Instructions</h4>
          <p className="text-yellow-700">
            Please park only in your designated slot <span className="font-bold">{ticket.slot?.slotNumber}</span>. Scan the QR code or enter your keypad entry code at the gate barrier to enter and exit.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 print:hidden">
          <button
            onClick={handlePrintTicket}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ticket
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalTicket;
