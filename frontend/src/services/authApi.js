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

export function signup(payload) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe(token) {
  return request('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
