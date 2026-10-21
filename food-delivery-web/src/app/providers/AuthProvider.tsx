import { useEffect, useState, type ReactNode } from 'react'
import { authService } from '../../features/auth/services/authService'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(authService.isAuthenticated())

  useEffect(() => {
    const handleUnauthorized = () => setAuthenticated(false)
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  return <AuthContext.Provider value={{ authenticated, setAuthenticated }}>{children}</AuthContext.Provider>
}
