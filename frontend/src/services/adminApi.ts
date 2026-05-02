import type { AcademicProgram, AcademicProgramPayload, AdminLoginPayload, AuthResult } from '../types';
import { request } from './apiClient';

export function adminLogin(payload: AdminLoginPayload): Promise<AuthResult> {
  return request<AuthResult>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createAcademicProgram(token: string, payload: AcademicProgramPayload): Promise<AcademicProgram> {
  return request<AcademicProgram>('/api/admin/programs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateAcademicProgram(token: string, programId: number, payload: AcademicProgramPayload): Promise<AcademicProgram> {
  return request<AcademicProgram>(`/api/admin/programs/${programId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAcademicProgram(token: string, programId: number): Promise<void> {
  return request<void>(`/api/admin/programs/${programId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAcademicPrograms(token: string): Promise<AcademicProgram[]> {
  return request<AcademicProgram[]>('/api/admin/programs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
