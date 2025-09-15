import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  createUser(userData: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/admin/users`, userData);
  }

  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.API_URL}/admin/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/admin/users/${id}`);
  }

  updateUser(id: number, userData: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/users/${id}`);
  }
}
