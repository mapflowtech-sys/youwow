export function getAdminHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'x-admin-token': token } : {}),
  };
}

export async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      ...getAdminHeaders(),
      ...options?.headers,
    },
  });
}
