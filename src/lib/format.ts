import { ROOT_DOMAIN } from './api'

export function formatMoney(value: string | number, currency = 'pen') {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: currency.toUpperCase() }).format(Number(value))
}

/** Las fechas sin hora llegan como YYYY-MM-DD y `Date` las leería en UTC, un día antes en Lima. */
export function formatDate(value: string) {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
}

export function tenantUrl(subdomain: string) {
  return `https://${subdomain}.${ROOT_DOMAIN}`
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}
