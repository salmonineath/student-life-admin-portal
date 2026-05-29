const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const init: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const res = await fetch(`${BASE_URL}${path}`, init)

  if (res.status === 401) {
    const refresh = await fetch(`${BASE_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    })
    if (refresh.ok) {
      return fetch(`${BASE_URL}${path}`, init)
    }
  }

  return res
}
