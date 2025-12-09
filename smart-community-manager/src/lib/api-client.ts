const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Generic helper for JSON APIs
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    const message = await safeErrorMessage(res);
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Helper for blob downloads
export async function apiFetchBlob(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    const message = await safeErrorMessage(res);
    throw new Error(message);
  }

  return res.blob();
}

async function safeErrorMessage(res: Response) {
  try {
    const data = await res.json();
    return data?.message || res.statusText || 'Request failed';
  } catch {
    return res.statusText || 'Request failed';
  }
}
