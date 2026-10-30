import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'
import { api, clearTokens, getTokens, SESSION_EXPIRED_EVENT, setTokens } from '../lib/api'
import { useProfile } from '../lib/queries'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(() => getTokens() !== null)
  const { data: profile } = useProfile(isAuthenticated)

  useEffect(() => {
    const expire = () => {
      queryClient.clear()
      setIsAuthenticated(false)
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, expire)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, expire)
  }, [queryClient])

  async function login(username: string, password: string) {
    const { data } = await api.post('/auth/login/', { username, password })
    setTokens(data)
    setIsAuthenticated(true)
  }

  function logout() {
    clearTokens()
    queryClient.clear()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, profile, login, logout }}>{children}</AuthContext.Provider>
  )
}
