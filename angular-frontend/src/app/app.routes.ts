import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { GuestGuard } from './core/auth/guards/guest.guard';
import { AdminGuard } from './core/auth/guards/admin.guard';

// Import de vos composants
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './features/auth/set-password/set-password.component';
import { Setup2FAComponent } from './features/auth/setup-2fa/setup-2fa.component';
import { TwoFactorComponent } from './features/auth/two-factor/two-factor.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';

export const appRoutes: Routes = [
  // Routes protégées (utilisateurs connectés)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },

  // Routes d'administration (admin uniquement)
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [AdminGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },

  // Routes pour invités (utilisateurs non connectés)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'set-password',
    component: SetPasswordComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'setup-2fa',
    component: Setup2FAComponent,
    canActivate: [GuestGuard]
  },
  {
    path: '2fa',
    component: TwoFactorComponent,
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
