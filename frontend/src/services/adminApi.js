const API_BASE_URL = 'http://127.0.0.1:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || '요청을 처리하지 못했습니다.');
  }

  return data;
}

export function adminLogin(payload) {
  return request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createAcademicProgram(token, payload) {
  return request('/api/admin/programs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateAcademicProgram(token, programId, payload) {
  return request(`/api/admin/programs/${programId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAcademicProgram(token, programId) {
  return request(`/api/admin/programs/${programId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAcademicPrograms(token) {
  return request('/api/admin/programs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
