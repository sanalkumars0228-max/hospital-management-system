import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  _id?: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address?: string;
  bloodGroup?: string;
  status: string;
}

export interface Doctor {
  _id?: string;
  name: string;
  specialization: string;
  phone: string;
  email?: string;
  experienceYears: number;
  availability: string;
}

export interface Appointment {
  _id?: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: string;
}

export interface Stats {
  totalPatients: number;
  admitted: number;
  totalDoctors: number;
  availableDoctors: number;
  scheduledAppointments: number;
  completedAppointments: number;
}

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private base = 'https://hospital-management-system-tl11.onrender.com/api';

  constructor(private http: HttpClient) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/stats`);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.base}/patients`);
  }
  addPatient(p: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.base}/patients`, p);
  }
  updatePatient(id: string, p: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.base}/patients/${id}`, p);
  }
  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.base}/patients/${id}`);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.base}/doctors`);
  }
  addDoctor(d: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.base}/doctors`, d);
  }
  updateDoctor(id: string, d: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.base}/doctors/${id}`, d);
  }
  deleteDoctor(id: string): Observable<any> {
    return this.http.delete(`${this.base}/doctors/${id}`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/appointments`);
  }
  addAppointment(a: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.base}/appointments`, a);
  }
  updateAppointment(id: string, a: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.base}/appointments/${id}`, a);
  }
  deleteAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.base}/appointments/${id}`);
  }
}
