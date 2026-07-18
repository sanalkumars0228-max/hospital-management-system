import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospitalService, Doctor } from '../../services/hospital.service';

const EMPTY: Doctor = { name: '', specialization: '', phone: '', email: '', experienceYears: 0, availability: 'Available' };

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  saved = false;
  editingId: string | null = null;

  form: Doctor = { ...EMPTY };

  constructor(private hospital: HospitalService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.hospital.getDoctors().subscribe((d) => (this.doctors = d));
  }

  availClass(a: string) {
    if (a === 'Available') return 'available';
    if (a === 'On Leave') return 'leave';
    return 'surgery';
  }

  shortId(id: string | undefined, index: number) {
    return 'DR-' + String(index + 1).padStart(3, '0');
  }

  startEdit(d: Doctor) {
    this.editingId = d._id || null;
    this.form = { ...d };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { ...EMPTY };
  }

  remove(d: Doctor) {
    if (!d._id) return;
    if (!confirm(`Remove ${d.name} from the roster?`)) return;
    this.hospital.deleteDoctor(d._id).subscribe(() => this.load());
  }

  submit() {
    if (!this.form.name || !this.form.specialization) return;

    if (this.editingId) {
      this.hospital.updateDoctor(this.editingId, this.form).subscribe(() => {
        this.saved = true;
        this.cancelEdit();
        this.load();
        setTimeout(() => (this.saved = false), 2500);
      });
    } else {
      this.hospital.addDoctor(this.form).subscribe(() => {
        this.saved = true;
        this.form = { ...EMPTY };
        this.load();
        setTimeout(() => (this.saved = false), 2500);
      });
    }
  }
}
