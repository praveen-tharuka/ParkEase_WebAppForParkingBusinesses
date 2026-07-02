const prisma = require('../prismaClient');

function generateReservationCode() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RES-${ts}-${rand}`;
}

function generateTicketNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${ts}-${rand}`;
}

function generateBarcode() {
  return `BC${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

async function isSlotAvailable(slotId, startTime, endTime, excludeReservationId = null) {
  const where = {
    slotId,
    status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
    AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
  };
  if (excludeReservationId) {
    where.id = { not: excludeReservationId };
  }
  const overlapping = await prisma.reservation.findFirst({ where });
  return !overlapping;
}

async function calculateFee(vehicleTypeId, slotType, startTime, endTime) {
  const now = new Date();

  const fee = await prisma.feeStructure.findFirst({
    where: {
      vehicleTypeId,
      isActive: true,
      effectiveFrom: { lte: now },
    },
    orderBy: { effectiveFrom: 'desc' },
  });

  const hours = Math.max(1, Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)));

  if (!fee) {
    // No fee structure configured yet — default flat rate so the flow still works
    const defaultHourly = 100;
    const baseFee = defaultHourly * hours;
    return { baseFee, totalFee: baseFee, feeStructureId: null, cancellationFeePercentage: 0, modificationFee: 0 };
  }

  const baseFee = Number(fee.hourlyRate) * hours;
  return {
    baseFee,
    totalFee: baseFee,
    feeStructureId: fee.id,
    cancellationFeePercentage: Number(fee.cancellationFeePercentage || 0),
    modificationFee: Number(fee.modificationFee || 0),
  };
}

async function createReservation({ customerId, slotId, vehicleId, startTime, endTime, specialRequests, notes }) {
  if (!customerId || !slotId || !vehicleId || !startTime || !endTime) {
    const err = new Error('customerId, slotId, vehicleId, startTime and endTime are required');
    err.statusCode = 400;
    throw err;
  }

  // Sanitize IDs to String to prevent database type casting errors
  const sanitizedCustomerId = String(customerId);
  const sanitizedSlotId = String(slotId);
  const sanitizedVehicleId = String(vehicleId);

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start) || isNaN(end) || start >= end) {
    const err = new Error('Invalid time range');
    err.statusCode = 400;
    throw err;
  }

  // Resolve slot (with fallback mapping for frontend mock slot IDs)
  let slot = null;
  if (sanitizedSlotId.length > 5) {
    slot = await prisma.parkingSlot.findUnique({ where: { id: sanitizedSlotId } });
  }
  
  if (!slot) {
    const mockSlotNumbers = {
      '1': 'A-101',
      '2': 'A-102',
      '3': 'B-201',
      '4': 'B-202',
      '5': 'M-301',
      '6': 'M-302',
      '7': 'T-401',
      '8': 'V-501',
      '9': 'A-103',
      '10': 'A-104',
      '11': 'B-203',
      '12': 'M-303'
    };
    const slotNo = mockSlotNumbers[sanitizedSlotId] || sanitizedSlotId;
    slot = await prisma.parkingSlot.findUnique({ where: { slotNumber: slotNo } });
  }

  if (!slot) {
    const err = new Error('Slot not found');
    err.statusCode = 404;
    throw err;
  }
  if (slot.status === 'MAINTENANCE') {
    const err = new Error('Slot is under maintenance');
    err.statusCode = 409;
    throw err;
  }

  // Resolve vehicle (with fallback mapping for frontend mock vehicle IDs)
  let vehicle = null;
  if (sanitizedVehicleId.length > 5) {
    vehicle = await prisma.vehicle.findUnique({ where: { id: sanitizedVehicleId } });
  }

  if (!vehicle) {
    const mockVehiclePlates = {
      '1': 'ABC-1234',
      '2': 'XYZ-5678'
    };
    const plate = mockVehiclePlates[sanitizedVehicleId] || sanitizedVehicleId;
    vehicle = await prisma.vehicle.findUnique({ where: { plateNumber: plate } });
  }

  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  // Resolve customer (with fallback mapping for frontend mock user IDs)
  let customer = await prisma.user.findUnique({ where: { id: sanitizedCustomerId } });
  if (!customer) {
    // If customer is mock user with id 1, map to seeded Praveen user
    if (sanitizedCustomerId === '1' || sanitizedCustomerId === '101') {
      const email = sanitizedCustomerId === '101' ? 'admin@parkease.com' : 'praveen@parkease.com';
      customer = await prisma.user.findFirst({ where: { email } });
    }
  }

  if (!customer) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }

  const available = await isSlotAvailable(slot.id, start, end);
  if (!available) {
    const err = new Error('Slot is not available for the selected time range');
    err.statusCode = 409;
    throw err;
  }

  const { baseFee, totalFee } = await calculateFee(vehicle.vehicleTypeId, slot.slotType, start, end);

  const reservation = await prisma.reservation.create({
    data: {
      reservationCode: generateReservationCode(),
      customerId: customer.id,
      slotId: slot.id,
      vehicleId: vehicle.id,
      startTime: start,
      endTime: end,
      specialRequests: specialRequests || null,
      notes: notes || null,
      baseFee,
      modificationFee: 0,
      cancellationFee: 0,
      totalFee,
      status: 'CONFIRMED',
    },
    include: { slot: true, vehicle: true, customer: true },
  });

  await prisma.parkingSlot.update({
    where: { id: slot.id },
    data: { status: 'RESERVED' },
  });

  return reservation;
}

async function getReservationById(id) {
  return prisma.reservation.findUnique({
    where: { id },
    include: { 
      slot: {
        include: {
          location: true
        }
      }, 
      vehicle: true, 
      customer: true, 
      ticket: true, 
      payments: true 
    },
  });
}

async function listReservations({ customerId, status }) {
  const where = {};
  if (customerId) where.customerId = customerId;
  if (status) where.status = status;

  return prisma.reservation.findMany({
    where,
    include: {
      slot: {
        include: {
          location: true
        }
      },
      vehicle: true
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function updateReservation(id, { startTime, endTime, specialRequests, notes }) {
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (['CANCELLED', 'COMPLETED'].includes(existing.status)) {
    const err = new Error(`Cannot modify a reservation that is already ${existing.status}`);
    err.statusCode = 409;
    throw err;
  }

  const data = {};

  if (startTime || endTime) {
    const newStart = startTime ? new Date(startTime) : existing.startTime;
    const newEnd = endTime ? new Date(endTime) : existing.endTime;

    if (isNaN(newStart) || isNaN(newEnd) || newStart >= newEnd) {
      const err = new Error('Invalid time range');
      err.statusCode = 400;
      throw err;
    }

    const available = await isSlotAvailable(existing.slotId, newStart, newEnd, id);
    if (!available) {
      const err = new Error('Slot is not available for the new time range');
      err.statusCode = 409;
      throw err;
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: existing.vehicleId } });
    const slot = await prisma.parkingSlot.findUnique({ where: { id: existing.slotId } });
    const { baseFee, modificationFee } = await calculateFee(vehicle.vehicleTypeId, slot.slotType, newStart, newEnd);

    data.startTime = newStart;
    data.endTime = newEnd;
    data.baseFee = baseFee;
    data.modificationFee = modificationFee;
    data.totalFee = baseFee + modificationFee;
  }

  if (specialRequests !== undefined) data.specialRequests = specialRequests;
  if (notes !== undefined) data.notes = notes;

  return prisma.reservation.update({
    where: { id },
    data,
    include: { slot: true, vehicle: true, customer: true },
  });
}

async function cancelReservation(id, cancellationReason) {
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (['CANCELLED', 'COMPLETED'].includes(existing.status)) {
    const err = new Error(`Reservation is already ${existing.status}`);
    err.statusCode = 409;
    throw err;
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: existing.vehicleId } });
  const slot = await prisma.parkingSlot.findUnique({ where: { id: existing.slotId } });
  const { cancellationFeePercentage } = await calculateFee(
    vehicle.vehicleTypeId,
    slot.slotType,
    existing.startTime,
    existing.endTime
  );

  const cancellationFee = (Number(existing.totalFee) * cancellationFeePercentage) / 100;

  const reservation = await prisma.reservation.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
      cancellationReason: cancellationReason || null,
      cancellationFee,
    },
  });

  await prisma.parkingSlot.update({
    where: { id: existing.slotId },
    data: { status: 'AVAILABLE' },
  });

  return reservation;
}

/**
 * Check-in: generates a ParkingTicket for the reservation and marks the slot OCCUPIED.
 */
async function checkInReservation(id, officerId = null) {
  const existing = await prisma.reservation.findUnique({ where: { id }, include: { ticket: true } });
  if (!existing) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (existing.status !== 'CONFIRMED' && existing.status !== 'PENDING') {
    const err = new Error(`Cannot check in a reservation with status ${existing.status}`);
    err.statusCode = 409;
    throw err;
  }
  if (existing.ticket) {
    const err = new Error('A ticket already exists for this reservation');
    err.statusCode = 409;
    throw err;
  }

  const ticket = await prisma.parkingTicket.create({
    data: {
      ticketNumber: generateTicketNumber(),
      ticketBarcode: generateBarcode(),
      slotId: existing.slotId,
      vehicleId: existing.vehicleId,
      officerId: officerId || null,
      reservationId: existing.id,
      customerId: existing.customerId,
      allocationType: 'RESERVED',
      checkInTime: new Date(),
      parkingFee: existing.totalFee,
      totalFee: existing.totalFee,
      status: 'ACTIVE',
    },
  });

  await prisma.reservation.update({
    where: { id },
    data: { status: 'CHECKED_IN' },
  });

  await prisma.parkingSlot.update({
    where: { id: existing.slotId },
    data: { status: 'OCCUPIED' },
  });

  return ticket;
}

/**
 * Checkout: closes the ticket, completes the reservation, frees the slot.
 */
async function checkoutReservation(id) {
  const existing = await prisma.reservation.findUnique({ where: { id }, include: { ticket: true } });
  if (!existing) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (!existing.ticket) {
    const err = new Error('No active ticket found for this reservation');
    err.statusCode = 409;
    throw err;
  }

  const ticket = await prisma.parkingTicket.update({
    where: { id: existing.ticket.id },
    data: { checkOutTime: new Date(), status: 'COMPLETED' },
  });

  await prisma.reservation.update({
    where: { id },
    data: { status: 'COMPLETED' },
  });

  await prisma.parkingSlot.update({
    where: { id: existing.slotId },
    data: { status: 'AVAILABLE' },
  });

  return ticket;
}

module.exports = {
  createReservation,
  getReservationById,
  listReservations,
  updateReservation,
  cancelReservation,
  checkInReservation,
  checkoutReservation,
};