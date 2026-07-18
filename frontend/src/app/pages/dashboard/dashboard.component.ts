import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HospitalService, Stats, Appointment } from '../../services/hospital.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats: Stats | null = null;
  upcoming: Appointment[] = [];

  constructor(private hospital: HospitalService) {}

  ngOnInit(): void {
    this.hospital.getStats().subscribe((s) => (this.stats = s));
    this.hospital.getAppointments().subscribe((a) => {
      this.upcoming = a.filter((x) => x.status === 'Scheduled').slice(0, 5);
    });
  }
}
