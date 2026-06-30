const prisma = require('../prismaClient');

async function listSlots({ status, slotType, locationId }) {
  const where = {};
  if (status) where.status = status;
  if (slotType) where.slotType = slotType;
  if (locationId) where.locationId = locationId;

  return prisma.parkingSlot.findMany({
    where,
    include: {
      location: true,
      supportedVehicleType: true,
    },
    orderBy: { slotNumber: 'asc' },
  });
}

async function getSlotById(id) {
  return prisma.parkingSlot.findUnique({
    where: { id },
    include: { location: true, supportedVehicleType: true },
  });
}


async function findAvailableSlots({ startTime, endTime, slotType, locationId, vehicleTypeId }) {
  if (!startTime || !endTime) {
    const err = new Error('startTime and endTime are required');
    err.statusCode = 400;
    throw err;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start) || isNaN(end) || start >= end) {
    const err = new Error('Invalid time range');
    err.statusCode = 400;
    throw err;
  }

  const where = {
    status: { not: 'MAINTENANCE' },
  };
  if (slotType) where.slotType = slotType;
  if (locationId) where.locationId = locationId;
  if (vehicleTypeId) where.supportedVehicleTypeId = vehicleTypeId;

  const candidateSlots = await prisma.parkingSlot.findMany({
    where,
    include: { location: true, supportedVehicleType: true },
  });

  // Filter out slots that have an overlapping active reservation
  const available = [];
  for (const slot of candidateSlots) {
    const overlapping = await prisma.reservation.findFirst({
      where: {
        slotId: slot.id,
        status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });
    if (!overlapping) available.push(slot);
  }

  return available;
}

module.exports = {
  listSlots,
  getSlotById,
  findAvailableSlots,
};