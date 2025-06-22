import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { GuestGuard } from './core/auth/guards/guest.guard';

// Import de vos composants (à créer)
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';

export const appRoutes: Routes = [
  // Routes protégées (utilisateurs connectés)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },

  // Routes pour invités (utilisateurs non connectés)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent, // À créer
    canActivate: [GuestGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent, // À créer
    canActivate: [GuestGuard]
  },

  // Redirections
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
