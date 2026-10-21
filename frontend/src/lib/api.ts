import type { ApiErrorBody } from '../types/api'

const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
export const tokenKey = 'food-delivery-token'

export class ApiError extends Error {
  status: number
  fields?: Record<string, string>

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || 'Não foi possível concluir a solicitação.')
    this.name = 'ApiError'
    this.status = status
    this.fields = body.fields
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem(tokenKey)
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')

  if (init.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers })
  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined)

  if (!response.ok) {
    const errorBody = (body && typeof body === 'object' ? body : {}) as ApiErrorBody
    if (response.status === 401 && token) {
      sessionStorage.removeItem(tokenKey)
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    throw new ApiError(response.status, errorBody)
  }

  return body as T
}
