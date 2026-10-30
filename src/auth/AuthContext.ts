import { createContext, useContext } from 'react'
import type { Profile } from '../lib/types'

export type AuthValue = {
  isAuthenticated: boolean
  profile: Profile | undefined
  logout: () => void
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return value
}
