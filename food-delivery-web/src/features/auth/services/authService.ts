import type { AuthResponse, LoginRequest, RegisterRequest } from '../../../types/api'
import { apiRequest, tokenKey } from '../../../lib/api'

export const authService = {
  async login(request: LoginRequest): Promise<void> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    })
    sessionStorage.setItem(tokenKey, response.token)
  },

  register(request: RegisterRequest): Promise<unknown> {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  logout(): void {
    sessionStorage.removeItem(tokenKey)
  },

  getToken(): string | null {
    return sessionStorage.getItem(tokenKey)
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken())
  },
}
