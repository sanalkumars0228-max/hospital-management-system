require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const memStore = require('./data/memoryStore');
const makeRouter = require('./routes/makeRouter');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error, falling back to in-memory store:', err.message));
} else {
  console.log('No MONGODB_URI set — running with in-memory demo data store.');
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'mongodb' : 'in-memory-demo',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', makeRouter(Patient, memStore.patients));
app.use('/api/doctors', makeRouter(Doctor, memStore.doctors));
app.use('/api/appointments', makeRouter(Appointment, memStore.appointments));

app.get('/api/stats', async (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  const patients = dbReady ? await Patient.find() : memStore.patients.findAll();
  const doctors = dbReady ? await Doctor.find() : memStore.doctors.findAll();
  const appointments = dbReady ? await Appointment.find() : memStore.appointments.findAll();

  res.json({
    totalPatients: patients.length,
    admitted: patients.filter((p) => p.status === 'Admitted').length,
    totalDoctors: doctors.length,
    availableDoctors: doctors.filter((d) => d.availability === 'Available').length,
    scheduledAppointments: appointments.filter((a) => a.status === 'Scheduled').length,
    completedAppointments: appointments.filter((a) => a.status === 'Completed').length,
  });
});

app.get('/', (req, res) => {
  res.send('CareHMS Backend API is running successfully 🚀');
});

app.listen(PORT, () => console.log(`CareHMS API running on port ${PORT}`));
