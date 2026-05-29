const BASE_URL = import.meta.env.VITE_API_URL

// Module-level singleton — ensures only ONE refresh call is in flight at a time.
// Token rotation means the refresh token is invalidated after use, so concurrent
// 401s must all wait on the same promise instead of each firing their own refresh.
let refreshing: Promise<boolean> | null = null

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
    if (!refreshing) {
      refreshing = fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      })
        .then((r) => r.ok)
        .catch(() => false)
        .finally(() => { refreshing = null })
    }

    const ok = await refreshing
    if (ok) return fetch(`${BASE_URL}${path}`, init)
  }

  return res
}
