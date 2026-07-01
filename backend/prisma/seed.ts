/**
 * ParkEase Database Seed
 *
 * Populates the database with realistic starter data that mirrors
 * the frontend mock data so backend devs can test immediately.
 *
 * Run: npx prisma db seed
 */

import { PrismaClient, Role, AccountStatus, SlotType, SlotStatus, VehicleStatus, ReservationStatus, AllocationType, TicketStatus, PaymentMethod, PaymentStatus, ReportType, ReportFormat, ApprovalStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/parkease?schema=public',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateId(prefix: string, num: number): string {
  return `${prefix}-${String(num).padStart(4, '0')}`;
}

// Generate real bcrypt hashes for database seeding
function fakePasswordHash(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------
async function main() {
  console.log('🌱 Seeding ParkEase database...\n');

  // ── 1. System Settings ──────────────────────────────────────────────────
  console.log('  → System settings...');
  const systemSetting = await prisma.systemSetting.upsert({
    where: { id: 'sys-default' },
    update: {},
    create: {
      id: 'sys-default',
      businessName: 'ParkEase',
      businessEmail: 'info@parkease.com',
      businessPhone: '+94 11 234 5678',
      businessAddress: '42 Galle Road, Colombo 03, Sri Lanka',
      businessLicense: 'BL-2024-001234',
      timezone: 'Asia/Colombo',
      currency: 'LKR',
      operatingOpen: '06:00',
      operatingClose: '22:00',
      maxVehiclesPerUser: 5,
      cancellationPolicy: 'Free cancellation up to 2 hours before start time. 25% fee applied for late cancellations.',
      supportEmail: 'support@parkease.com',
      supportPhone: '+94 11 234 5679',
      emailNotifications: true,
      smsNotifications: true,
      maintenanceMode: false,
    },
  });
  console.log(`    ✓ SystemSetting: ${systemSetting.businessName}`);

  // ── 2. Vehicle Types ────────────────────────────────────────────────────
  console.log('  → Vehicle types...');
  const vehicleTypeData = [
    { name: 'Car',        description: 'Standard cars and sedans' },
    { name: 'SUV',        description: 'Sport utility vehicles' },
    { name: 'Motorcycle', description: 'Motorcycles and scooters' },
    { name: 'Truck',      description: 'Trucks and large vehicles' },
    { name: 'Van',        description: 'Vans and minivans' },
    { name: 'Hatchback',  description: 'Compact hatchback cars' },
    { name: 'Bus',        description: 'Buses and large passenger vehicles' },
  ];

  const vehicleTypes: Record<string, string> = {};
  for (const vt of vehicleTypeData) {
    const created = await prisma.vehicleType.upsert({
      where: { name: vt.name },
      update: {},
      create: vt,
    });
    vehicleTypes[vt.name] = created.id;
    console.log(`    ✓ VehicleType: ${vt.name}`);
  }

  // ── 3. Parking Locations ────────────────────────────────────────────────
  console.log('  → Parking locations...');
  const locationData = [
    { name: 'Downtown',          address: '12 Main Street, Colombo 01' },
    { name: 'Shopping Mall',     address: '88 Liberty Plaza, Colombo 03' },
    { name: 'Airport',           address: 'Bandaranaike International Airport, Katunayake' },
    { name: 'University',        address: 'University of Colombo, Reid Avenue' },
    { name: 'Hospital',          address: 'National Hospital, Colombo 10' },
    { name: 'City Center',       address: '55 York Street, Colombo 01' },
    { name: 'Business District', address: 'World Trade Center, Colombo 01' },
    { name: 'Office Complex',    address: 'Orion City, Colombo 09' },
  ];

  const locations: Record<string, string> = {};
  for (const loc of locationData) {
    const created = await prisma.parkingLocation.upsert({
      where: { name: loc.name },
      update: {},
      create: { ...loc, operatingOpen: '06:00', operatingClose: '22:00' },
    });
    locations[loc.name] = created.id;
    console.log(`    ✓ Location: ${loc.name}`);
  }

  // ── 4. Parking Slots (matches frontend mockSlots.js) ────────────────────
  console.log('  → Parking slots...');
  const slotData = [
    { slotNumber: 'A-101', slotType: SlotType.REGULAR,  location: 'Downtown',          vehicleType: 'Car',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'A-102', slotType: SlotType.REGULAR,  location: 'Downtown',          vehicleType: 'Car',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'A-103', slotType: SlotType.REGULAR,  location: 'City Center',       vehicleType: 'Car',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'A-104', slotType: SlotType.REGULAR,  location: 'City Center',       vehicleType: 'Car',        status: SlotStatus.OCCUPIED },
    { slotNumber: 'B-201', slotType: SlotType.REGULAR,  location: 'Shopping Mall',     vehicleType: 'SUV',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'B-202', slotType: SlotType.REGULAR,  location: 'Shopping Mall',     vehicleType: 'SUV',        status: SlotStatus.OCCUPIED },
    { slotNumber: 'B-203', slotType: SlotType.REGULAR,  location: 'Business District', vehicleType: 'SUV',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'C-301', slotType: SlotType.REGULAR,  location: 'Airport',           vehicleType: 'Car',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'C-302', slotType: SlotType.REGULAR,  location: 'Airport',           vehicleType: 'Car',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'D-401', slotType: SlotType.REGULAR,  location: 'Office Complex',    vehicleType: 'Car',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'M-102', slotType: SlotType.COMPACT,  location: 'Downtown',          vehicleType: 'Motorcycle', status: SlotStatus.AVAILABLE },
    { slotNumber: 'M-301', slotType: SlotType.COMPACT,  location: 'University',        vehicleType: 'Motorcycle', status: SlotStatus.AVAILABLE },
    { slotNumber: 'M-302', slotType: SlotType.COMPACT,  location: 'University',        vehicleType: 'Motorcycle', status: SlotStatus.AVAILABLE },
    { slotNumber: 'M-303', slotType: SlotType.COMPACT,  location: 'Downtown',          vehicleType: 'Motorcycle', status: SlotStatus.AVAILABLE },
    { slotNumber: 'T-401', slotType: SlotType.REGULAR,  location: 'Airport',           vehicleType: 'Truck',      status: SlotStatus.AVAILABLE },
    { slotNumber: 'V-501', slotType: SlotType.REGULAR,  location: 'Hospital',          vehicleType: 'Van',        status: SlotStatus.AVAILABLE },
    { slotNumber: 'C-104', slotType: SlotType.REGULAR,  location: 'City Center',       vehicleType: 'Hatchback',  status: SlotStatus.AVAILABLE },
  ];

  const slots: Record<string, string> = {};
  for (const s of slotData) {
    const created = await prisma.parkingSlot.upsert({
      where: { slotNumber: s.slotNumber },
      update: {},
      create: {
        slotNumber: s.slotNumber,
        slotType: s.slotType,
        status: s.status,
        locationId: locations[s.location],
        supportedVehicleTypeId: vehicleTypes[s.vehicleType],
      },
    });
    slots[s.slotNumber] = created.id;
    console.log(`    ✓ Slot: ${s.slotNumber} @ ${s.location}`);
  }

  // ── 5. Fee Structures ───────────────────────────────────────────────────
  console.log('  → Fee structures...');
  const feeData = [
    { vehicleType: 'Car',        hourlyRate: 5.00,  dailyRate: 40.00 },
    { vehicleType: 'SUV',        hourlyRate: 7.00,  dailyRate: 55.00 },
    { vehicleType: 'Motorcycle', hourlyRate: 2.00,  dailyRate: 15.00 },
    { vehicleType: 'Truck',      hourlyRate: 10.00, dailyRate: 80.00 },
    { vehicleType: 'Van',        hourlyRate: 8.00,  dailyRate: 60.00 },
    { vehicleType: 'Hatchback',  hourlyRate: 5.00,  dailyRate: 40.00 },
    { vehicleType: 'Bus',        hourlyRate: 12.00, dailyRate: 95.00 },
  ];

  for (const fee of feeData) {
    await prisma.feeStructure.create({
      data: {
        vehicleTypeId: vehicleTypes[fee.vehicleType],
        hourlyRate: fee.hourlyRate,
        dailyRate: fee.dailyRate,
        modificationFee: 2.00,
        cancellationFeePercentage: 25.00,
        effectiveFrom: new Date('2026-01-01'),
        isActive: true,
      },
    });
    console.log(`    ✓ Fee: ${fee.vehicleType} — $${fee.hourlyRate}/hr, $${fee.dailyRate}/day`);
  }

  // ── 6. Users ────────────────────────────────────────────────────────────
  console.log('  → Users...');

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@parkease.com' },
    update: {},
    create: {
      email: 'admin@parkease.com',
      username: 'admin',
      passwordHash: fakePasswordHash('admin123'),
      fullName: 'Admin User',
      phone: '+94 11 555 0001',
      role: Role.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
    },
  });
  console.log(`    ✓ Admin: ${admin.email}`);

  // Officers
  const officerSilva = await prisma.user.upsert({
    where: { email: 'r.silva@parkease.com' },
    update: {},
    create: {
      email: 'r.silva@parkease.com',
      username: 'r.silva',
      passwordHash: fakePasswordHash('officer123'),
      fullName: 'R. Silva',
      phone: '+94 77 555 0010',
      role: Role.OFFICER,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      approvedById: admin.id,
    },
  });
  console.log(`    ✓ Officer: ${officerSilva.fullName}`);

  const officerJayasuriya = await prisma.user.upsert({
    where: { email: 'n.jayasuriya@parkease.com' },
    update: {},
    create: {
      email: 'n.jayasuriya@parkease.com',
      username: 'n.jayasuriya',
      passwordHash: fakePasswordHash('officer123'),
      fullName: 'N. Jayasuriya',
      phone: '+94 77 555 0011',
      role: Role.OFFICER,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      approvedById: admin.id,
    },
  });
  console.log(`    ✓ Officer: ${officerJayasuriya.fullName}`);

  // Customers (matching officerManagementData.js)
  const customerAyesha = await prisma.user.upsert({
    where: { email: 'ayesha.perera@example.com' },
    update: {},
    create: {
      email: 'ayesha.perera@example.com',
      username: 'ayesha.perera',
      passwordHash: fakePasswordHash('password123'),
      fullName: 'Ayesha Perera',
      phone: '+94 77 123 4567',
      company: 'BlueWave Ltd.',
      address: 'Colombo 03',
      role: Role.CUSTOMER,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      approvedById: officerSilva.id,
    },
  });
  console.log(`    ✓ Customer: ${customerAyesha.fullName}`);

  const customerNimal = await prisma.user.upsert({
    where: { email: 'nimal.fernando@example.com' },
    update: {},
    create: {
      email: 'nimal.fernando@example.com',
      username: 'nimal.fernando',
      passwordHash: fakePasswordHash('password123'),
      fullName: 'Nimal Fernando',
      phone: '+94 71 555 9123',
      company: 'Metro Logistics',
      address: 'Rajagiriya',
      role: Role.CUSTOMER,
      accountStatus: AccountStatus.PENDING_APPROVAL,
      isActive: true,
    },
  });
  console.log(`    ✓ Customer: ${customerNimal.fullName}`);

  const customerSithum = await prisma.user.upsert({
    where: { email: 'sithum.w@example.com' },
    update: {},
    create: {
      email: 'sithum.w@example.com',
      username: 'sithum.w',
      passwordHash: fakePasswordHash('password123'),
      fullName: 'Sithum Wijesinghe',
      phone: '+94 77 880 1100',
      company: 'University of Colombo',
      address: 'Nugegoda',
      role: Role.CUSTOMER,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      approvedById: officerJayasuriya.id,
    },
  });
  console.log(`    ✓ Customer: ${customerSithum.fullName}`);

  const customerMadhushi = await prisma.user.upsert({
    where: { email: 'madhushi.t@example.com' },
    update: {},
    create: {
      email: 'madhushi.t@example.com',
      username: 'madhushi.t',
      passwordHash: fakePasswordHash('password123'),
      fullName: 'Madhushi Thilakarathne',
      phone: '+94 77 900 2233',
      company: 'Swift Care Pvt Ltd',
      address: 'Kollupitiya',
      role: Role.CUSTOMER,
      accountStatus: AccountStatus.SUSPENDED,
      isActive: false,
      approvedById: officerSilva.id,
    },
  });
  console.log(`    ✓ Customer: ${customerMadhushi.fullName}`);

  const customerKavindu = await prisma.user.upsert({
    where: { email: 'kavindu.j@example.com' },
    update: {},
    create: {
      email: 'kavindu.j@example.com',
      username: 'kavindu.j',
      passwordHash: fakePasswordHash('password123'),
      fullName: 'Kavindu Jayasinghe',
      phone: '+94 77 432 8901',
      company: 'Freelance',
      address: 'Dehiwala',
      role: Role.CUSTOMER,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      approvedById: officerJayasuriya.id,
    },
  });
  console.log(`    ✓ Customer: ${customerKavindu.fullName}`);

  // The default test customer from mockUserData.js
  const customerPraveen = await prisma.user.upsert({
    where: { email: 'praveen@parkease.com' },
    update: {},
    create: {
      email: 'praveen@parkease.com',
      username: 'praveen',
      passwordHash: fakePasswordHash('password123'),
      fullName: 'Praveen',
      phone: '+1 (555) 123-4567',
      role: Role.CUSTOMER,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
    },
  });
  console.log(`    ✓ Customer: ${customerPraveen.fullName} (default test user)`);

  // ── 7. Staff Accounts ───────────────────────────────────────────────────
  console.log('  → Staff accounts...');
  await prisma.staffAccount.create({
    data: {
      managedByAdminId: admin.id,
      referenceUserId: officerSilva.id,
      accountType: Role.OFFICER,
    },
  });
  await prisma.staffAccount.create({
    data: {
      managedByAdminId: admin.id,
      referenceUserId: officerJayasuriya.id,
      accountType: Role.OFFICER,
    },
  });
  console.log('    ✓ Staff accounts for officers');

  // ── 8. Vehicles (matching officerManagementData.js) ─────────────────────
  console.log('  → Vehicles...');
  const vehicleData = [
    { plateNumber: 'CAB-2048', make: 'Toyota',     model: 'RAV4',       type: 'SUV',        color: 'Pearl White', customerId: customerAyesha.id,   status: VehicleStatus.ACTIVE,    registeredBy: officerSilva.id },
    { plateNumber: 'SCA-4120', make: 'Nissan',      model: 'Leaf',       type: 'Hatchback',  color: 'Silver',      customerId: customerAyesha.id,   status: VehicleStatus.INACTIVE,  registeredBy: officerSilva.id },
    { plateNumber: 'JH-7788',  make: 'Honda',       model: 'Civic',      type: 'Car',        color: 'Graphite',    customerId: customerNimal.id,    status: VehicleStatus.PENDING,   registeredBy: null },
    { plateNumber: 'KDY-4501', make: 'Yamaha',      model: 'MT-15',      type: 'Motorcycle', color: 'Red',         customerId: customerSithum.id,   status: VehicleStatus.ACTIVE,    registeredBy: officerJayasuriya.id },
    { plateNumber: 'KDY-4502', make: 'Suzuki',      model: 'Alto',       type: 'Hatchback',  color: 'Blue',        customerId: customerSithum.id,   status: VehicleStatus.ACTIVE,    registeredBy: officerJayasuriya.id },
    { plateNumber: 'KDY-4509', make: 'Toyota',      model: 'Axio',       type: 'Car',        color: 'White',       customerId: customerSithum.id,   status: VehicleStatus.INACTIVE,  registeredBy: officerJayasuriya.id },
    { plateNumber: 'QW-2211',  make: 'Mitsubishi',  model: 'Outlander',  type: 'SUV',        color: 'Black',       customerId: customerMadhushi.id, status: VehicleStatus.SUSPENDED, registeredBy: officerSilva.id },
    { plateNumber: 'LB-7780',  make: 'Mazda',       model: 'Demio',      type: 'Hatchback',  color: 'Blue',        customerId: customerKavindu.id,  status: VehicleStatus.ACTIVE,    registeredBy: officerJayasuriya.id },
    { plateNumber: 'LB-8810',  make: 'Toyota',      model: 'Prius',      type: 'Car',        color: 'Silver',      customerId: customerKavindu.id,  status: VehicleStatus.ACTIVE,    registeredBy: officerJayasuriya.id },
    // Default test user vehicles (mockUserData.js)
    { plateNumber: 'ABC-1234', make: 'Toyota',      model: 'Camry',      type: 'Car',        color: 'Silver',      customerId: customerPraveen.id,  status: VehicleStatus.ACTIVE,    registeredBy: null },
    { plateNumber: 'XYZ-5678', make: 'Honda',       model: 'CBR600',     type: 'Motorcycle', color: 'Red',         customerId: customerPraveen.id,  status: VehicleStatus.ACTIVE,    registeredBy: null },
  ];

  const vehicles: Record<string, string> = {};
  for (const v of vehicleData) {
    const created = await prisma.vehicle.upsert({
      where: { plateNumber: v.plateNumber },
      update: {},
      create: {
        plateNumber: v.plateNumber,
        make: v.make,
        model: v.model,
        color: v.color,
        status: v.status,
        isVerified: v.status === VehicleStatus.ACTIVE,
        customerId: v.customerId,
        vehicleTypeId: vehicleTypes[v.type],
        registeredByOfficerId: v.registeredBy,
      },
    });
    vehicles[v.plateNumber] = created.id;
    console.log(`    ✓ Vehicle: ${v.plateNumber} (${v.make} ${v.model})`);
  }

  // ── 9. Approval Requests (matching officerPendingRegistrations) ─────────
  console.log('  → Approval requests...');
  const approvalData = [
    {
      approvalCode: 'PEN-1001',
      requestedById: customerAyesha.id,
      vehiclePlate: 'CAB-2048', vehicleMake: 'Toyota', vehicleModel: 'RAV4', vehicleColor: 'Pearl White', vehicleTypeName: 'SUV',
      status: ApprovalStatus.APPROVED,
      reviewedById: officerSilva.id,
      documents: ['National ID', 'Vehicle Registration', 'Insurance'],
    },
    {
      approvalCode: 'PEN-1002',
      requestedById: customerNimal.id,
      vehiclePlate: 'JH-7788', vehicleMake: 'Honda', vehicleModel: 'Civic', vehicleColor: 'Graphite', vehicleTypeName: 'Sedan',
      status: ApprovalStatus.PENDING,
      reviewedById: null,
      documents: ['National ID', 'Vehicle Registration'],
    },
    {
      approvalCode: 'PEN-1003',
      requestedById: customerSithum.id,
      vehiclePlate: 'KDY-4501', vehicleMake: 'Yamaha', vehicleModel: 'MT-15', vehicleColor: 'Red', vehicleTypeName: 'Motorbike',
      status: ApprovalStatus.PENDING,
      reviewedById: null,
      documents: ['National ID', 'Vehicle Registration', 'Lease Letter'],
    },
  ];

  for (const appr of approvalData) {
    const created = await prisma.approvalRequest.create({
      data: {
        approvalCode: appr.approvalCode,
        requestedById: appr.requestedById,
        reviewedById: appr.reviewedById,
        status: appr.status,
        reviewedAt: appr.status === ApprovalStatus.APPROVED ? new Date() : null,
        vehiclePlate: appr.vehiclePlate,
        vehicleMake: appr.vehicleMake,
        vehicleModel: appr.vehicleModel,
        vehicleColor: appr.vehicleColor,
        vehicleTypeName: appr.vehicleTypeName,
        documents: {
          create: appr.documents.map((docType) => ({ documentType: docType })),
        },
      },
    });
    console.log(`    ✓ Approval: ${created.approvalCode} (${appr.status})`);
  }

  // ── 10. Reservations (matching mockBookings.js) ─────────────────────────
  console.log('  → Reservations...');
  const reservationData = [
    {
      code: 'BK-1001', customerId: customerAyesha.id, slotNumber: 'A-101', vehiclePlate: 'CAB-2048',
      startTime: '2026-05-28T09:00:00', endTime: '2026-05-28T18:00:00',
      baseFee: 45.00, status: ReservationStatus.CHECKED_IN,
    },
    {
      code: 'BK-1002', customerId: customerNimal.id, slotNumber: 'B-201', vehiclePlate: 'JH-7788',
      startTime: '2026-05-29T10:00:00', endTime: '2026-05-29T13:00:00',
      baseFee: 21.00, status: ReservationStatus.COMPLETED,
    },
    {
      code: 'BK-1003', customerId: customerSithum.id, slotNumber: 'A-102', vehiclePlate: 'KDY-4501',
      startTime: '2026-05-30T08:00:00', endTime: '2026-05-30T18:00:00',
      baseFee: 50.00, status: ReservationStatus.CHECKED_IN,
    },
    {
      code: 'BK-1004', customerId: customerAyesha.id, slotNumber: 'C-301', vehiclePlate: 'SCA-4120',
      startTime: '2026-05-27T11:00:00', endTime: '2026-05-27T16:00:00',
      baseFee: 25.00, status: ReservationStatus.COMPLETED,
    },
    {
      code: 'BK-1005', customerId: customerKavindu.id, slotNumber: 'B-202', vehiclePlate: 'LB-7780',
      startTime: '2026-05-31T14:00:00', endTime: '2026-05-31T22:00:00',
      baseFee: 56.00, status: ReservationStatus.CHECKED_IN,
    },
    {
      code: 'BK-1006', customerId: customerKavindu.id, slotNumber: 'D-401', vehiclePlate: 'LB-8810',
      startTime: '2026-05-25T07:00:00', endTime: '2026-05-25T18:00:00',
      baseFee: 55.00, status: ReservationStatus.COMPLETED,
    },
  ];

  const reservations: Record<string, string> = {};
  for (const r of reservationData) {
    const created = await prisma.reservation.create({
      data: {
        reservationCode: r.code,
        customerId: r.customerId,
        slotId: slots[r.slotNumber],
        vehicleId: vehicles[r.vehiclePlate],
        status: r.status,
        startTime: new Date(r.startTime),
        endTime: new Date(r.endTime),
        baseFee: r.baseFee,
        totalFee: r.baseFee,
      },
    });
    reservations[r.code] = created.id;
    console.log(`    ✓ Reservation: ${r.code} (${r.status})`);
  }

  // ── 11. Parking Tickets ─────────────────────────────────────────────────
  console.log('  → Parking tickets...');
  const ticketData = [
    {
      ticketNumber: 'TKT-0001', barcode: 'BC-0001', slotNumber: 'A-101', vehiclePlate: 'CAB-2048',
      reservationCode: 'BK-1001', customerId: customerAyesha.id, officerId: officerSilva.id,
      allocationType: AllocationType.RESERVED, status: TicketStatus.ACTIVE,
      checkInTime: '2026-05-28T09:00:00', parkingFee: 45.00,
    },
    {
      ticketNumber: 'TKT-0002', barcode: 'BC-0002', slotNumber: 'B-201', vehiclePlate: 'JH-7788',
      reservationCode: 'BK-1002', customerId: customerNimal.id, officerId: officerSilva.id,
      allocationType: AllocationType.RESERVED, status: TicketStatus.COMPLETED,
      checkInTime: '2026-05-29T10:00:00', checkOutTime: '2026-05-29T13:00:00', parkingFee: 21.00,
    },
    {
      ticketNumber: 'TKT-0003', barcode: 'BC-0003', slotNumber: 'A-102', vehiclePlate: 'KDY-4501',
      reservationCode: 'BK-1003', customerId: customerSithum.id, officerId: officerJayasuriya.id,
      allocationType: AllocationType.RESERVED, status: TicketStatus.ACTIVE,
      checkInTime: '2026-05-30T08:00:00', parkingFee: 50.00,
    },
    {
      ticketNumber: 'TKT-0004', barcode: 'BC-0004', slotNumber: 'C-301', vehiclePlate: 'SCA-4120',
      reservationCode: 'BK-1004', customerId: customerAyesha.id, officerId: officerSilva.id,
      allocationType: AllocationType.RESERVED, status: TicketStatus.COMPLETED,
      checkInTime: '2026-05-27T11:00:00', checkOutTime: '2026-05-27T16:00:00', parkingFee: 25.00,
    },
  ];

  for (const t of ticketData) {
    await prisma.parkingTicket.create({
      data: {
        ticketNumber: t.ticketNumber,
        ticketBarcode: t.barcode,
        slotId: slots[t.slotNumber],
        vehicleId: vehicles[t.vehiclePlate],
        officerId: t.officerId,
        reservationId: reservations[t.reservationCode],
        customerId: t.customerId,
        allocationType: t.allocationType,
        status: t.status,
        checkInTime: t.checkInTime ? new Date(t.checkInTime) : null,
        checkOutTime: t.checkOutTime ? new Date(t.checkOutTime) : null,
        parkingFee: t.parkingFee,
        totalFee: t.parkingFee,
        isPrinted: true,
        printedAt: t.checkInTime ? new Date(t.checkInTime) : null,
      },
    });
    console.log(`    ✓ Ticket: ${t.ticketNumber} (${t.status})`);
  }

  // ── 12. Payments ────────────────────────────────────────────────────────
  console.log('  → Payments...');
  const paymentData = [
    { ref: 'PAY-0001', reservationCode: 'BK-1002', customerId: customerNimal.id, officerId: officerSilva.id,    amount: 21.00, method: PaymentMethod.CARD,   status: PaymentStatus.PAID },
    { ref: 'PAY-0002', reservationCode: 'BK-1004', customerId: customerAyesha.id, officerId: officerSilva.id,   amount: 25.00, method: PaymentMethod.CASH,   status: PaymentStatus.PAID },
    { ref: 'PAY-0003', reservationCode: 'BK-1005', customerId: customerKavindu.id, officerId: null,             amount: 56.00, method: PaymentMethod.ONLINE, status: PaymentStatus.PAID },
    { ref: 'PAY-0004', reservationCode: 'BK-1006', customerId: customerKavindu.id, officerId: officerSilva.id,  amount: 55.00, method: PaymentMethod.CARD,   status: PaymentStatus.PAID },
  ];

  const payments: Record<string, string> = {};
  for (const p of paymentData) {
    const created = await prisma.payment.create({
      data: {
        paymentReference: p.ref,
        reservationId: reservations[p.reservationCode],
        customerId: p.customerId,
        processedByOfficerId: p.officerId,
        totalAmount: p.amount,
        paymentMethod: p.method,
        paymentStatus: p.status,
        paymentDate: p.status === PaymentStatus.PAID ? new Date() : null,
      },
    });
    payments[p.ref] = created.id;
    console.log(`    ✓ Payment: ${p.ref} — $${p.amount} (${p.method})`);
  }

  // ── 13. Receipts ────────────────────────────────────────────────────────
  console.log('  → Receipts...');
  const receiptData = [
    { receiptNumber: 'RCT-0001', paymentRef: 'PAY-0001', officerId: officerSilva.id,      amount: 21.00, method: PaymentMethod.CARD },
    { receiptNumber: 'RCT-0002', paymentRef: 'PAY-0002', officerId: officerSilva.id,      amount: 25.00, method: PaymentMethod.CASH },
    { receiptNumber: 'RCT-0004', paymentRef: 'PAY-0004', officerId: officerSilva.id,      amount: 55.00, method: PaymentMethod.CARD },
  ];

  for (const r of receiptData) {
    await prisma.receipt.create({
      data: {
        receiptNumber: r.receiptNumber,
        paymentId: payments[r.paymentRef],
        generatedByOfficerId: r.officerId,
        amountPaid: r.amount,
        paymentMethod: r.method,
      },
    });
    console.log(`    ✓ Receipt: ${r.receiptNumber}`);
  }

  // ── 14. User Activities (matching officerCustomers history) ─────────────
  console.log('  → User activities...');
  const activityData = [
    { userId: customerAyesha.id, title: 'Checked in',           detail: 'CAB-2048 entered Level 2, Slot B-201.',              date: '2026-05-13' },
    { userId: customerAyesha.id, title: 'Subscription renewed', detail: 'Monthly plan extended for 30 days.',                  date: '2026-05-11' },
    { userId: customerAyesha.id, title: 'Vehicle updated',      detail: 'Added backup vehicle SCA-4120.',                      date: '2026-05-08' },
    { userId: customerNimal.id,  title: 'Registration submitted', detail: 'Manual review requested by customer.',              date: '2026-05-12' },
    { userId: customerSithum.id, title: 'Payment recorded',     detail: 'Monthly fee credited successfully.',                  date: '2026-05-10' },
    { userId: customerSithum.id, title: 'Vehicle check',        detail: 'Vehicle KDY-4501 updated with motorbike class.',      date: '2026-05-06' },
    { userId: customerSithum.id, title: 'Visit completed',      detail: 'Parking session ended without issues.',               date: '2026-04-29' },
    { userId: customerMadhushi.id, title: 'Overdue notice sent', detail: 'Balance reminder issued to customer.',               date: '2026-04-20' },
    { userId: customerMadhushi.id, title: 'Vehicle updated',     detail: 'Replaced temporary plate with permanent plate.',     date: '2026-03-14' },
    { userId: customerKavindu.id, title: 'Slot changed',         detail: 'Moved from Level 1 to Level 3.',                    date: '2026-05-12' },
    { userId: customerKavindu.id, title: 'Access approved',      detail: 'Added secondary vehicle to account.',               date: '2026-05-01' },
  ];

  for (const a of activityData) {
    await prisma.userActivity.create({
      data: {
        userId: a.userId,
        title: a.title,
        detail: a.detail,
        occurredAt: new Date(a.date),
      },
    });
  }
  console.log(`    ✓ ${activityData.length} activity entries`);

  // ── 15. User Preferences (for default test user) ────────────────────────
  console.log('  → User preferences...');
  await prisma.userPreference.create({
    data: {
      userId: customerPraveen.id,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      reservationReminders: true,
      paymentAlerts: true,
      profileVisibility: 'private',
      showReservationHistory: false,
      allowDataCollection: true,
      allowThirdPartySharing: false,
    },
  });
  console.log('    ✓ Preferences for test user');

  // ── Done ────────────────────────────────────────────────────────────────
  console.log('\n✅ Seeding complete!\n');
  console.log('  Test accounts:');
  console.log('  ─────────────────────────────────────────');
  console.log('  Admin:    admin@parkease.com     / admin123');
  console.log('  Officer:  r.silva@parkease.com   / officer123');
  console.log('  Officer:  n.jayasuriya@parkease.com / officer123');
  console.log('  Customer: praveen@parkease.com   / password123');
  console.log('  Customer: ayesha.perera@example.com / password123');
  console.log('  Customer: nimal.fernando@example.com / password123');
  console.log('  Customer: sithum.w@example.com   / password123');
  console.log('  Customer: kavindu.j@example.com  / password123');
  console.log('  ─────────────────────────────────────────');
  console.log('  ⚠️  Replace fakePasswordHash() with bcrypt in production!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
