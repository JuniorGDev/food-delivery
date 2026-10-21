import { createContext } from 'react'

export interface AuthContextValue {
  authenticated: boolean
  setAuthenticated: (value: boolean) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)