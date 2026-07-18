import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospitalService, Appointment, Doctor, Patient } from '../../services/hospital.service';

const EMPTY: Appointment = { patientName: '', doctorName: '', department: '', date: '', time: '', status: 'Scheduled' };

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  saved = false;
  editingId: string | null = null;

  form: Appointment = { ...EMPTY };

  constructor(private hospital: HospitalService) {}

  ngOnInit(): void {
    this.load();
    this.hospital.getDoctors().subscribe((d) => (this.doctors = d));
    this.hospital.getPatients().subscribe((p) => (this.patients = p));
  }

  load() {
    this.hospital.getAppointments().subscribe((a) => (this.appointments = a));
  }

  onDoctorChange() {
    const doc = this.doctors.find((d) => d.name === this.form.doctorName);
    this.form.department = doc ? doc.specialization : '';
  }

  statusClass(status: string) {
    return status.toLowerCase();
  }

  shortId(id: string | undefined, index: number) {
    return 'AP-' + String(index + 1).padStart(3, '0');
  }

  startEdit(a: Appointment) {
    this.editingId = a._id || null;
    this.form = { ...a };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { ...EMPTY };
  }

  remove(a: Appointment) {
    if (!a._id) return;
    if (!confirm(`Remove this appointment for ${a.patientName}?`)) return;
    this.hospital.deleteAppointment(a._id).subscribe(() => this.load());
  }

  setStatus(a: Appointment, status: string) {
    if (!a._id) return;
    this.hospital.updateAppointment(a._id, { ...a, status }).subscribe(() => this.load());
  }

  submit() {
    if (!this.form.patientName || !this.form.doctorName || !this.form.date || !this.form.time) return;

    if (this.editingId) {
      this.hospital.updateAppointment(this.editingId, this.form).subscribe(() => {
        this.saved = true;
        this.cancelEdit();
        this.load();
        setTimeout(() => (this.saved = false), 2500);
      });
    } else {
      this.hospital.addAppointment(this.form).subscribe(() => {
        this.saved = true;
        this.form = { ...EMPTY };
        this.load();
        setTimeout(() => (this.saved = false), 2500);
      });
    }
  }
}
