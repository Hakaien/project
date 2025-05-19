import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://your-api-url/auth'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Handle successful login, e.g., store user data or token
      })
    );
  }

  logout(): void {
    // Handle logout logic, e.g., clear user data or token
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  isAuthenticated(): boolean {
    // Implement logic to check if the user is authenticated
    return false; // Placeholder
  }
}