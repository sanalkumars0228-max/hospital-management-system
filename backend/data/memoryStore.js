// Lightweight in-memory fallback so the API runs out-of-the-box in demo/dev
// mode without a MongoDB connection. In production, set MONGODB_URI (e.g. a
// MongoDB Atlas connection string) and server.js will use the real Mongoose
// models in models/ instead of this file automatically.

let patients = [
  { _id: 'p1', name: 'Anjali Menon', age: 34, gender: 'Female', phone: '9847012345', address: 'Kochi, Kerala', bloodGroup: 'O+', status: 'Admitted', createdAt: new Date() },
  { _id: 'p2', name: 'Rahul Nair', age: 45, gender: 'Male', phone: '9946123456', address: 'Aluva, Kerala', bloodGroup: 'B+', status: 'Outpatient', createdAt: new Date() },
  { _id: 'p3', name: 'Fathima Beevi', age: 29, gender: 'Female', phone: '9895123123', address: 'Kothamangalam, Kerala', bloodGroup: 'A+', status: 'Outpatient', createdAt: new Date() },
  { _id: 'p4', name: 'Thomas Jacob', age: 58, gender: 'Male', phone: '9744012399', address: 'Muvattupuzha, Kerala', bloodGroup: 'AB+', status: 'Discharged', createdAt: new Date() },
];

let doctors = [
  { _id: 'd1', name: 'Dr. Priya Krishnan', specialization: 'Cardiology', phone: '9847099887', email: 'priya.k@carehms.in', experienceYears: 12, availability: 'Available', createdAt: new Date() },
  { _id: 'd2', name: 'Dr. Arjun Menon', specialization: 'Orthopedics', phone: '9847011223', email: 'arjun.m@carehms.in', experienceYears: 9, availability: 'In Surgery', createdAt: new Date() },
  { _id: 'd3', name: 'Dr. Sneha Thomas', specialization: 'Pediatrics', phone: '9847055667', email: 'sneha.t@carehms.in', experienceYears: 7, availability: 'Available', createdAt: new Date() },
  { _id: 'd4', name: 'Dr. Vishnu Prasad', specialization: 'General Medicine', phone: '9847033445', email: 'vishnu.p@carehms.in', experienceYears: 15, availability: 'On Leave', createdAt: new Date() },
];

let appointments = [
  { _id: 'a1', patientName: 'Anjali Menon', doctorName: 'Dr. Priya Krishnan', department: 'Cardiology', date: '2026-07-20', time: '10:30 AM', status: 'Scheduled', createdAt: new Date() },
  { _id: 'a2', patientName: 'Rahul Nair', doctorName: 'Dr. Arjun Menon', department: 'Orthopedics', date: '2026-07-18', time: '02:00 PM', status: 'Scheduled', createdAt: new Date() },
  { _id: 'a3', patientName: 'Fathima Beevi', doctorName: 'Dr. Sneha Thomas', department: 'Pediatrics', date: '2026-07-15', time: '11:00 AM', status: 'Completed', createdAt: new Date() },
  { _id: 'a4', patientName: 'Thomas Jacob', doctorName: 'Dr. Vishnu Prasad', department: 'General Medicine', date: '2026-07-22', time: '09:15 AM', status: 'Scheduled', createdAt: new Date() },
];

let users = [
  // Demo login: sanal@carehms.in / password123
  { _id: 'u1', name: 'Sanalkumar S', email: 'sanal@carehms.in', passwordHash: '$2b$10$Kp58sg/nEureTjIYoVJwiu3xH4Vqpec5cWoNYr2/j1HKxetYbSYI.', role: 'Admin', createdAt: new Date() },
];

const genId = (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

function makeCollection(getArr, setArr, prefix) {
  return {
    findAll: () => getArr(),
    create: (doc) => {
      const record = { _id: genId(prefix), createdAt: new Date(), ...doc };
      setArr([...getArr(), record]);
      return record;
    },
    update: (id, doc) => {
      const arr = getArr();
      const idx = arr.findIndex((r) => r._id === id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...doc };
      setArr(arr);
      return arr[idx];
    },
    remove: (id) => {
      const arr = getArr();
      const next = arr.filter((r) => r._id !== id);
      const removed = arr.length !== next.length;
      setArr(next);
      return removed;
    },
  };
}

module.exports = {
  patients: makeCollection(() => patients, (v) => (patients = v), 'p'),
  doctors: makeCollection(() => doctors, (v) => (doctors = v), 'd'),
  appointments: makeCollection(() => appointments, (v) => (appointments = v), 'a'),
  users: {
    ...makeCollection(() => users, (v) => (users = v), 'u'),
    findByEmail: (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  },
};
