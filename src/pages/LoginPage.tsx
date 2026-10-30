import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ArrowRightIcon } from '../components/ui/Icons'
import { Logo } from '../components/ui/Logo'
import { cardClass, inputClass, primaryButtonClass } from '../components/ui/styles'
import { errorMessage } from '../lib/api'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (isAuthenticated) return <Navigate to={destination} replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
      navigate(destination, { replace: true })
    } catch (caught) {
      setSubmitting(false)
      setError(errorMessage(caught, 'No pudimos iniciar sesión.'))
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-4 py-10">
      <Logo />
      <form onSubmit={handleSubmit} className={`mt-8 w-full max-w-md p-6 sm:p-8 ${cardClass}`}>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Administración SaaS</h1>
        <p className="mt-1 text-sm text-slate-600">Acceso exclusivo para superusuarios de DeliSmart.</p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-800">
            Usuario
            <input
              required
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Contraseña
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
          </label>
          {error && (
            <p role="alert" className="text-sm font-medium text-brand-dark">
              {error}
            </p>
          )}
        </div>

        <button type="submit" disabled={submitting} className={`mt-6 w-full ${primaryButtonClass}`}>
          {submitting ? (
            'Ingresando...'
          ) : (
            <>
              Ingresar
              <ArrowRightIcon />
            </>
          )}
        </button>
      </form>
    </main>
  )
}
