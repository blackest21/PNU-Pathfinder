import type { AuthResult, LoginPayload, SignupPayload, UserSession } from '../types';
import { request } from './apiClient';

export function signup(payload: SignupPayload): Promise<AuthResult> {
  return request<AuthResult>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResult> {
  return request<AuthResult>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe(token: string): Promise<UserSession> {
  return request<UserSession>('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
