import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { redirectToLogin } from '../lib/api'
import type { Role } from '../lib/types'
import { useAuth } from './AuthContext'

const HOME_BY_ROLE: Record<Role, string> = {
  superusuario: '/dashboard',
  cliente: '/mi-plan',
}

export function RequireAuth() {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) redirectToLogin()
  }, [isAuthenticated])

  return isAuthenticated ? <Outlet /> : null
}

/** Cada rol solo entra a sus vistas; la API lo exige igual, esto evita pantallas de error. */
export function RequireRole({ role }: { role: Role }) {
  const { profile } = useAuth()
  if (!profile) return null
  return profile.rol === role ? <Outlet /> : <Navigate to={HOME_BY_ROLE[profile.rol]} replace />
}

export function RoleHome() {
  const { profile } = useAuth()
  return profile ? <Navigate to={HOME_BY_ROLE[profile.rol]} replace /> : null
}
