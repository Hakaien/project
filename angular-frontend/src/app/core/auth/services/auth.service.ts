import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenService } from './token.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest
} from '../models/login-request.model';
import {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ApiResponse
} from '../models/login-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

  private refreshTokenTimer?: any;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialise l'authentification au démarrage de l'application
   */
  private initializeAuth(): void {
    if (this.tokenService.hasValidToken()) {
      this.loadCurrentUser();
      this.scheduleTokenRefresh();
    }
  }

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.isLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(error => this.handleError(error)),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Inscription utilisateur
   */
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    this.isLoadingSubject.next(true);

    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, userData).pipe(
      catchError(error => this.handleError(error)),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}).pipe(
      tap(() => this.handleLogout()),
      catchError(() => {
        // Même en cas d'erreur, on déconnecte localement
        this.handleLogout();
        return throwError('Erreur lors de la déconnexion');
      })
    );
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/forgot-password`, data).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Réinitialisation du mot de passe
   */
  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/reset-password`, data).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Rafraîchissement du token
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.handleLogout();
      return throwError('Aucun refresh token disponible');
    }

    const refreshData: RefreshTokenRequest = { refreshToken };

    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/refresh`, refreshData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.tokenService.updateAccessToken(
            response.data.accessToken,
            response.data.expiresIn
          );
          this.scheduleTokenRefresh();
        }
      }),
      catchError(error => {
        this.handleLogout();
        return this.handleError(error);
      })
    );
  }

  /**
   * Charge l'utilisateur courant
   */
  private loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      },
      error: () => {
        this.handleLogout();
      }
    });
  }

  /**
   * Gère le succès de l'authentification
   */
  private handleAuthSuccess(authData: any): void {
    this.tokenService.setTokens({
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      tokenType: authData.tokenType,
      expiresIn: authData.expiresIn,
      expiresAt: new Date(Date.now() + (authData.expiresIn * 1000))
    });

    this.currentUserSubject.next(authData.user);
    this.isAuthenticatedSubject.next(true);
    this.scheduleTokenRefresh();
  }

  /**
   * Gère la déconnexion
   */
  private handleLogout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }

    this.router.navigate(['/login']);
  }

  /**
   * Programme le rafraîchissement automatique du token
   */
  private scheduleTokenRefresh(): void {
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }

    const tokens = this.tokenService.getTokens();
    if (!tokens) return;

    // Rafraîchit le token 5 minutes avant son expiration
    const refreshTime = tokens.getTimeToExpiration() - 300;

    if (refreshTime > 0) {
      this.refreshTokenTimer = setTimeout(() => {
        this.refreshToken().subscribe({
          error: () => this.handleLogout()
        });
      }, refreshTime * 1000);
    }
  }

  /**
   * Gère les erreurs HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(errorMessage);
  }

  // Méthodes utilitaires publiques
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUser;
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser;
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN') || this.hasRole('ROLE_SUPER_ADMIN');
  }
}
