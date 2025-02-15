export const AUTH_ENDPOINTS = {
  LOGIN: 'http://localhost:8000/api/auth/token/',
  REGISTER: 'http://localhost:8000/api/auth/register/',
};

export async function loginUser(email: string, password: string) {
  const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Login failed');
  }

  return data;
}

export async function registerUser(email: string, password: string) {
  const res = await fetch(AUTH_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Registration failed');
  }

  return data;
}
