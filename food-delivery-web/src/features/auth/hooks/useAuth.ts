import { useContext } from 'react'
import { AuthContext } from '../../../app/providers/authContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('AuthProvider ausente')
  return context
}
