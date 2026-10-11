function getApiBaseUrl() {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)?.trim()
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '')
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    throw new Error('Configuration error: VITE_API_URL environment variable is not configured for production.')
  }
  return 'http://localhost:5000/api'
}

export async function apiFetch(endpoint, options = {}) {
  const apiBase = getApiBaseUrl()
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let response
  try {
    response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Network error: Unable to reach the server. Please check your connection.')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token')
      throw new Error(data?.message || 'Session expired. Please log in again.')
    }
    if (response.status === 403) {
      throw new Error(data?.message || 'Access denied: Administrator privileges required.')
    }
    throw new Error(data?.message || `Request failed with status ${response.status}`)
  }

  return data
}

export function loginApi(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getCurrentUserApi() {
  return apiFetch('/auth/me')
}

export function getPostsApi() {
  return apiFetch('/posts')
}

export function deletePostApi(id) {
  return apiFetch(`/posts/${id}`, {
    method: 'DELETE',
  })
}
