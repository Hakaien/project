import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isPasswordSet: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface Setup2FARequest {
  method: 'email' | 'totp' | 'google';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/login']);
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/profile`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  setPassword(data: SetPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/set-password`, data);
  }

  setup2FA(data: Setup2FARequest): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/setup-2fa`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/forgot-password`, { email });
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    if (this.isAuthenticated()) {
      this.getProfile().subscribe({
        error: () => {
          this.clearAuth();
        }
      });
    }
  }
}
