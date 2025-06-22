import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Ajouter le token d'authentification si disponible
    const authRequest = this.addAuthHeader(request);

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gestion des erreurs d'authentification
        if (error.status === 401) {
          return this.handle401Error(authRequest, next);
        }

        // Gestion des autres erreurs
        return this.handleError(error);
      })
    );
  }

  /**
   * Ajoute l'en-tête d'authentification à la requête
   */
  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    // Ne pas ajouter l'en-tête pour certaines URLs
    if (this.shouldSkipAuth(request)) {
      return request;
    }

    const authHeader = this.tokenService.getAuthorizationHeader();

    if (authHeader) {
      return request.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });
    }

    return request;
  }

  /**
   * Vérifie si l'authentification doit être ignorée pour cette requête
   */
  private shouldSkipAuth(request: HttpRequest<any>): boolean {
    const skipAuthUrls = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/refresh'
    ];

    return skipAuthUrls.some(url => request.url.includes(url));
  }

  /**
   * Gère les erreurs 401 (Non autorisé)
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.data?.accessToken);

            // Retry la requête originale avec le nouveau token
            return next.handle(this.addAuthHeader(request));
          }),
          catchError((error) => {
            this.isRefreshing = false;

            // Échec du refresh, déconnecter l'utilisateur
            this.authService.logout().subscribe();

            return throwError(error);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      } else {
        // Pas de refresh token, déconnecter l'utilisateur
        this.authService.logout().subscribe();
        return throwError('No refresh token available');
      }
    } else {
      // Un refresh est déjà en cours, attendre qu'il se termine
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(this.addAuthHeader(request)))
      );
    }
  }

  /**
   * Gère les autres types d'erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 422:
          errorMessage = 'Données invalides';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        case 503:
          errorMessage = 'Service temporairement indisponible';
          break;
        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = `Erreur ${error.status}: ${error.message}`;
          }
      }
    }

    // Log l'erreur pour le débogage
    console.error('HTTP Error:', error);

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }

  /**
   * Vérifie si la requête concerne l'API
   */
  private isApiRequest(request: HttpRequest<any>): boolean {
    return request.url.startsWith(environment.apiUrl);
  }

  /**
   * Ajoute des en-têtes personnalisés pour l'API
   */
  private addCustomHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const customHeaders: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Ne pas écraser Content-Type pour les uploads de fichiers
    if (request.body instanceof FormData) {
      delete customHeaders['Content-Type'];
    }

    return request.clone({
      setHeaders: customHeaders
    });
  }
}
