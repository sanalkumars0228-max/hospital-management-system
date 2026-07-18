import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospitalService, Patient } from '../../services/hospital.service';

const EMPTY: Patient = { name: '', age: 0, gender: 'Female', phone: '', address: '', bloodGroup: '', status: 'Outpatient' };

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  saved = false;
  editingId: string | null = null;

  form: Patient = { ...EMPTY };

  constructor(private hospital: HospitalService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.hospital.getPatients().subscribe((p) => (this.patients = p));
  }

  statusClass(status: string) {
    return status.toLowerCase();
  }

  shortId(id: string | undefined, index: number) {
    return 'PT-' + String(index + 1).padStart(3, '0');
  }

  startEdit(p: Patient) {
    this.editingId = p._id || null;
    this.form = { ...p };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { ...EMPTY };
  }

  remove(p: Patient) {
    if (!p._id) return;
    if (!confirm(`Remove patient record for ${p.name}?`)) return;
    this.hospital.deletePatient(p._id).subscribe(() => this.load());
  }

  submit() {
    if (!this.form.name || !this.form.phone) return;

    if (this.editingId) {
      this.hospital.updatePatient(this.editingId, this.form).subscribe(() => {
        this.saved = true;
        this.cancelEdit();
        this.load();
        setTimeout(() => (this.saved = false), 2500);
      });
    } else {
      this.hospital.addPatient(this.form).subscribe(() => {
        this.saved = true;
        this.form = { ...EMPTY };
        this.load();
        setTimeout(() => (this.saved = false), 2500);
      });
    }
  }
}
