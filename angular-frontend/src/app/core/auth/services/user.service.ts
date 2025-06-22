import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User, UserProfile } from '../models/user.model';
import { ChangePasswordRequest } from '../models/login-request.model';
import { ApiResponse } from '../models/login-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les informations de l'utilisateur courant
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/profile`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la récupération du profil');
      })
    );
  }

  /**
   * Récupère le profil complet de l'utilisateur
   */
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.API_URL}/profile/complete`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la récupération du profil complet');
      })
    );
  }

  /**
   * Met à jour les informations de l'utilisateur
   */
  updateProfile(userData: Partial<UserProfile>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/profile`, userData).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour du profil');
      })
    );
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  changePassword(passwordData: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/change-password`, passwordData);
  }

  /**
   * Upload de l'avatar utilisateur
   */
  uploadAvatar(file: File): Observable<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<ApiResponse<{ avatarUrl: string }>>(
      `${this.API_URL}/avatar`,
      formData
    );
  }

  /**
   * Supprime l'avatar de l'utilisateur
   */
  deleteAvatar(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/avatar`);
  }

  /**
   * Récupère l'historique des connexions
   */
  getLoginHistory(page: number = 1, limit: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.API_URL}/login-history?page=${page}&limit=${limit}`
    );
  }

  /**
   * Active/désactive les notifications
   */
  updateNotificationSettings(settings: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/notifications`, settings);
  }

  /**
   * Récupère les paramètres de notification
   */
  getNotificationSettings(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/notifications`);
  }

  /**
   * Supprime le compte utilisateur
   */
  deleteAccount(password: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/account`, {
      body: { password }
    });
  }

  /**
   * Vérifie si l'email est disponible
   */
  checkEmailAvailability(email: string): Observable<ApiResponse<{ available: boolean }>> {
    return this.http.post<ApiResponse<{ available: boolean }>>(
      `${this.API_URL}/check-email`,
      { email }
    );
  }

  /**
   * Demande de vérification d'email
   */
  requestEmailVerification(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/verify-email/request`, {});
  }

  /**
   * Vérifie l'email avec le token
   */
  verifyEmail(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/verify-email`, { token });
  }

  /**
   * Active l'authentification à deux facteurs
   */
  enableTwoFactor(): Observable<ApiResponse<{ qrCode: string; secret: string }>> {
    return this.http.post<ApiResponse<{ qrCode: string; secret: string }>>(
      `${this.API_URL}/2fa/enable`,
      {}
    );
  }

  /**
   * Confirme l'activation de l'authentification à deux facteurs
   */
  confirmTwoFactor(code: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/2fa/confirm`, { code });
  }

  /**
   * Désactive l'authentification à deux facteurs
   */
  disableTwoFactor(password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/2fa/disable`, { password });
  }

  /**
   * Génère de nouveaux codes de récupération pour 2FA
   */
  generateRecoveryCodes(): Observable<ApiResponse<{ codes: string[] }>> {
    return this.http.post<ApiResponse<{ codes: string[] }>>(
      `${this.API_URL}/2fa/recovery-codes`,
      {}
    );
  }
}
