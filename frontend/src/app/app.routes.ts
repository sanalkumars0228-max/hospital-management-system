import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'appointments', component: AppointmentsComponent },
    ],
  },
];
