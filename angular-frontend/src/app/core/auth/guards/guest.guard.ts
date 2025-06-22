import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { UserModel } from '../models/user.model'; // Ajout de l'import

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  /**
   * Protège les routes accessibles uniquement aux utilisateurs non connectés
   * (pages de login, register, forgot-password, etc.)
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkGuestAccess();
  }

  /**
   * Protège les routes enfants pour les invités
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  /**
   * Vérifie si l'utilisateur peut accéder aux pages "invité"
   */
  private checkGuestAccess(): Observable<boolean> {
    // Si un token valide existe, rediriger vers le dashboard
    if (this.tokenService.hasValidToken()) {
      return this.authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
          if (isAuthenticated) {
            this.redirectToDashboard();
            return false;
          }
          return true;
        })
      );
    }
    // Pas de token, l'utilisateur peut accéder aux pages invité
    return of(true);
  }

  /**
   * Redirige vers le dashboard ou la page d'accueil
   */
  private redirectToDashboard(): void {
    // Récupère l'URL de retour depuis les query params ou utilise la page par défaut
    const returnUrl = this.getReturnUrl();
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      // Redirection basée sur le rôle de l'utilisateur
      const currentUser = this.authService.currentUser;

      // Solution 1: Vérifier si c'est une instance de UserModel
      if (currentUser instanceof UserModel && currentUser.isAdmin()) {
        this.router.navigate(['/admin/dashboard']);
      }
      // Solution 2: Vérifier directement les rôles si c'est une interface User
      else if (currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_SUPER_ADMIN')) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  /**
   * Récupère l'URL de retour depuis les query params
   */
  private getReturnUrl(): string | null {
    // Cette méthode peut être améliorée pour récupérer l'URL depuis les query params
    // ou depuis un service de navigation
    return null;
  }

  /**
   * Méthode utilitaire pour vérifier si l'utilisateur est connecté de manière synchrone
   */
  isUserAuthenticated(): boolean {
    return this.tokenService.hasValidToken() && this.authService.isAuthenticated;
  }

  /**
   * Méthode utilitaire pour vérifier si l'utilisateur actuel est admin
   */
  private isCurrentUserAdmin(user: any): boolean {
    // Si c'est une instance de UserModel, utiliser la méthode isAdmin()
    if (user instanceof UserModel) {
      return user.isAdmin();
    }

    // Sinon, vérifier directement dans les rôles
    return user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_SUPER_ADMIN') || false;
  }
}
