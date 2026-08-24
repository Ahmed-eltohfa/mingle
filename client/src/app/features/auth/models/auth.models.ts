export interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
  message?: string;
}

export interface ApiMessageResponse {
  message: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  username?: string;
  avatarUrl?: string;
}
