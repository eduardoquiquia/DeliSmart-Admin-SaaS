import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const ROOT_DOMAIN = import.meta.env.VITE_ROOT_DOMAIN || 'delismart.publicvm.com'
export const LANDING_URL = import.meta.env.VITE_LANDING_URL || 'http://localhost:3000'

const BASE_URL = `${API_URL}/api/v1/admin`
const TOKENS_KEY = 'delismart-admin-tokens'
export const SESSION_EXPIRED_EVENT = 'delismart:session-expired'

type Tokens = { access: string; refresh: string }
type RetriableConfig = InternalAxiosRequestConfig & { retried?: boolean }

export function getTokens(): Tokens | null {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY) ?? 'null')
  } catch {
    return null
  }
}

export function setTokens(tokens: Tokens) {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

export function clearTokens() {
  localStorage.removeItem(TOKENS_KEY)
}

/** El login vive en el landing, que entrega la sesión en el fragmento de la URL. */
export function consumeLandingSession() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const access = params.get('access')
  const refresh = params.get('refresh')
  if (!access || !refresh) return
  setTokens({ access, refresh })
  window.history.replaceState(null, '', window.location.pathname)
}

export function redirectToLogin() {
  window.location.replace(`${LANDING_URL}/login`)
}

export const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const tokens = getTokens()
  if (tokens) config.headers.Authorization = `Bearer ${tokens.access}`
  return config
})

// Varias peticiones pueden caducar a la vez: todas esperan al mismo refresh.
let refreshing: Promise<void> | null = null

function refreshAccessToken() {
  const tokens = getTokens()
  if (!tokens) return Promise.reject(new Error('Sin sesión'))
  refreshing ??= axios
    .post<{ access: string }>(`${BASE_URL}/auth/refresh/`, { refresh: tokens.refresh })
    .then(({ data }) => setTokens({ ...tokens, access: data.access }))
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined
  if (error.response?.status !== 401 || !config || config.retried || !getTokens()) throw error

  config.retried = true
  try {
    await refreshAccessToken()
  } catch {
    clearTokens()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    throw error
  }
  return api(config)
})

/** Extrae el mensaje de un error de DRF: `detail` o el primer error de campo. */
export function errorMessage(error: unknown, fallback = 'Ocurrió un error inesperado.') {
  if (!axios.isAxiosError(error)) return fallback
  if (!error.response) return 'No pudimos conectar con el servidor.'
  const data = error.response.data as Record<string, unknown> | undefined
  if (typeof data?.detail === 'string') return data.detail
  const first = Object.values(data ?? {})[0]
  return Array.isArray(first) && typeof first[0] === 'string' ? first[0] : fallback
}
