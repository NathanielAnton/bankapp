import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StatistiqueComponent } from './components/statistique/statistique.component';
import { ADashboardComponent } from './components/admin/dashboard/dashboard.component';
import { RoleGuard } from './role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Interface utilisateur (role: USER)
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [RoleGuard], 
    data: { role: 'USER' } 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [RoleGuard], 
    data: { role: 'USER' } 
  },
  { 
    path: 'statistique', 
    component: StatistiqueComponent, 
    canActivate: [RoleGuard], 
    data: { role: 'USER' } 
  },

  // Interface administrateur (role: ADMIN)
  { 
    path: 'admin', 
    component: ADashboardComponent, 
    canActivate: [RoleGuard], 
    data: { role: 'ADMIN' } 
  },

  // Redirections
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
