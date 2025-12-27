// Mock user data
export const mockUser = {
  id: 1,
  name: 'Praveen',
  email: 'praveen@example.com',
  profilePicture: null, // Can be replaced with actual image URL
  phone: '+1 (555) 123-4567',
}

// Mock statistics for quick stats
export const mockStats = {
  totalReservations: 24,
  activeReservations: 3,
  totalSpent: 485,
  favoriteLocations: 2,
}

// Mock reservations data
export const mockReservations = [
  {
    id: 1,
    slotNumber: 'A-101',
    location: 'Downtown',
    date: '2024-01-15',
    time: '09:00',
    duration: 4,
    price: 20,
    status: 'active',
    vehicleType: 'Car',
  },
  {
    id: 2,
    slotNumber: 'B-201',
    location: 'Shopping Mall',
    date: '2024-01-16',
    time: '14:00',
    duration: 2,
    price: 14,
    status: 'upcoming',
    vehicleType: 'SUV',
  },
  {
    id: 3,
    slotNumber: 'M-301',
    location: 'University',
    date: '2024-01-17',
    time: '08:00',
    duration: 6,
    price: 12,
    status: 'upcoming',
    vehicleType: 'Motorcycle',
  },
]

// Mock vehicles data
export const mockVehicles = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    licensePlate: 'ABC-1234',
    type: 'Car',
    color: 'Silver',
  },
  {
    id: 2,
    make: 'Honda',
    model: 'CBR600',
    year: 2022,
    licensePlate: 'XYZ-5678',
    type: 'Motorcycle',
    color: 'Red',
  },
]

