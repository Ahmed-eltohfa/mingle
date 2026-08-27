import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/users';

  // Holds in-memory user state
  readonly currentUser = signal<User | null>(null);

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/me`).pipe(
      tap((res) => this.currentUser.set(res.user))
    );
  }

  clearCurrentUser(): void {
    this.currentUser.set(null);
  }

  updateProfile(userId: string, payload: FormData): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.baseUrl}/${userId}`, payload).pipe(
      tap((res) => this.currentUser.set(res.user)) // Update state after saving
    );
  }
}