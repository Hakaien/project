import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    // Services
    AuthService,
    TokenService,
    UserService,

    // Guards
    AuthGuard,
    GuestGuard,

    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule {

  /**
   * Méthode statique pour configurer le module avec des options personnalisées
   */
  static forRoot(config?: AuthModuleConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        // Services
        AuthService,
        TokenService,
        UserService,

        // Guards
        AuthGuard,
        GuestGuard,

        // Interceptors
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },

        // Configuration personnalisée
        {
          provide: AUTH_CONFIG,
          useValue: config || {}
        }
      ]
    };
  }
}

// Interface de configuration du module
export interface AuthModuleConfig {
  tokenKey?: string;
  refreshTokenKey?: string;
  loginUrl?: string;
  logoutUrl?: string;
  defaultRedirectUrl?: string;
  tokenRefreshThreshold?: number; // en secondes
  autoRefreshToken?: boolean;
}

// Token d'injection pour la configuration
export const AUTH_CONFIG = 'AUTH_CONFIG';
