import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {
  ApiMessageResponse,
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  UpdateProfilePayload,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);

  // Toggle this to false once backend auth endpoints are available.
  private readonly useMock = true;

  private readonly apiBaseUrl = 'http://localhost:5000/api';

  signIn(payload: SignInPayload): Observable<AuthResponse> {
    if (this.useMock) {
      return of(this.mockAuthResponse(payload.email));
    }

    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, payload);
  }

  signUp(payload: SignUpPayload): Observable<AuthResponse> {
    if (this.useMock) {
      return of(this.mockAuthResponse(payload.email, payload.fullName, payload.username));
    }

    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, payload);
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<ApiMessageResponse> {
    if (this.useMock) {
      return of({ message: `Password reset link sent to ${payload.email}.` });
    }

    return this.http.post<ApiMessageResponse>(`${this.apiBaseUrl}/auth/forgot-password`, payload);
  }

  resetPassword(payload: ResetPasswordPayload): Observable<ApiMessageResponse> {
    if (this.useMock) {
      return of({ message: `Password reset completed for token ${payload.token.slice(0, 8)}...` });
    }

    return this.http.post<ApiMessageResponse>(`${this.apiBaseUrl}/auth/reset-password`, payload);
  }

  resendVerificationEmail(email: string): Observable<ApiMessageResponse> {
    if (this.useMock) {
      return of({ message: `Verification email re-sent to ${email}.` });
    }

    return this.http.post<ApiMessageResponse>(`${this.apiBaseUrl}/auth/resend-verification`, { email });
  }

  signOut(refreshToken?: string): Observable<ApiMessageResponse> {
    if (this.useMock) {
      return of({ message: 'Logged out from current session.' });
    }

    return this.http.post<ApiMessageResponse>(`${this.apiBaseUrl}/auth/logout`, { refreshToken });
  }

  refreshSession(refreshToken: string): Observable<AuthResponse> {
    if (this.useMock) {
      return of(this.mockAuthResponse('session@mingle.app'));
    }

    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/refresh`, { refreshToken });
  }

  getMe(): Observable<AuthUser> {
    if (this.useMock) {
      return of({
        id: 'mock-user-1',
        fullName: 'Mingle User',
        username: 'mingleuser',
        email: 'user@mingle.app',
      });
    }

    return this.http.get<AuthUser>(`${this.apiBaseUrl}/users/me`);
  }

  updateMe(payload: UpdateProfilePayload): Observable<AuthUser> {
    if (this.useMock) {
      return of({
        id: 'mock-user-1',
        fullName: payload.fullName ?? 'Mingle User',
        username: payload.username ?? 'mingleuser',
        email: 'user@mingle.app',
        avatarUrl: payload.avatarUrl,
      });
    }

    return this.http.patch<AuthUser>(`${this.apiBaseUrl}/users/me`, payload);
  }

  verifyEmail(token: string): Observable<ApiMessageResponse> {
    if (this.useMock) {
      return of({ message: `Email verified with token ${token.slice(0, 8)}...` });
    }

    return this.http.post<ApiMessageResponse>(`${this.apiBaseUrl}/auth/verify-email`, { token });
  }

  notImplementedPlaceholder(featureName: string): Observable<never> {
    return throwError(() => new Error(`${featureName} is not implemented yet.`));
  }

  private mockAuthResponse(
    email: string,
    fullName = 'Demo User',
    username = 'demouser',
  ): AuthResponse {
    return {
      user: {
        id: crypto.randomUUID(),
        fullName,
        username,
        email,
      },
      session: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
      message: 'Mock response. Replace useMock=false when backend is ready.',
    };
  }
}
