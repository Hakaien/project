import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  /**
   * Protège une route
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthenticated(state.url, route.data);
  }

  /**
   * Protège les routes enfants
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  /**
   * Protège le lazy loading des modules
   */
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthenticated();
  }

  /**
   * Vérifie l'authentification de l'utilisateur
   */
  private checkAuthenticated(redirectUrl?: string, routeData?: any): Observable<boolean> {
    // Vérification rapide du token
    if (!this.tokenService.hasValidToken()) {
      this.redirectToLogin(redirectUrl);
      return of(false);
    }

    // Vérification de l'état d'authentification
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.redirectToLogin(redirectUrl);
          return false;
        }

        // Vérification des rôles requis
        if (routeData?.roles && !this.checkRoles(routeData.roles)) {
          this.router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      }),
      catchError(() => {
        this.redirectToLogin(redirectUrl);
        return of(false);
      })
    );
  }

  /**
   * Vérifie si l'utilisateur a les rôles requis
   */
  private checkRoles(requiredRoles: string[]): boolean {
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      return false;
    }

    // Si l'utilisateur est admin, il a accès à tout
    if (currentUser.roles.includes('ROLE_ADMIN') || currentUser.roles.includes('ROLE_SUPER_ADMIN')) {
      return true;
    }

    // Vérification des rôles spécifiques
    return requiredRoles.some(role => currentUser.roles.includes(role));
  }

  /**
   * Redirige vers la page de connexion
   */
  private redirectToLogin(returnUrl?: string): void {
    const navigationExtras = returnUrl ? { queryParams: { returnUrl } } : {};
    this.router.navigate(['/login'], navigationExtras);
  }
}
