import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isPasswordSet: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin: string | null;
}

interface UsersResponse {
  users: User[];
}

interface CreateUserResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer la liste des utilisateurs
   */
  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.API_URL}/users`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Créer un nouvel utilisateur
   */
  createUser(userData: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.API_URL}/users`, userData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Récupérer un utilisateur par ID
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Mettre à jour un utilisateur
   */
  updateUser(id: number, userData: Partial<CreateUserRequest>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API_URL}/users/${id}`, userData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/users/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Gère les erreurs HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(errorMessage);
  }
}