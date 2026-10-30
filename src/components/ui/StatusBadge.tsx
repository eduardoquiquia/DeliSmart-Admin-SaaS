import type { LicenseStatus, TenantStatus } from '../../lib/types'

const STYLES = {
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-brand-dark',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-slate-100 text-slate-600',
}

const DOTS = {
  green: 'bg-success',
  red: 'bg-brand',
  amber: 'bg-amber-500',
  gray: 'bg-slate-400',
}

const STATUSES: Record<TenantStatus | LicenseStatus, { label: string; tone: keyof typeof STYLES }> = {
  activo: { label: 'Activo', tone: 'green' },
  suspendido: { label: 'Suspendido', tone: 'red' },
  pendiente: { label: 'Pendiente', tone: 'amber' },
  activa: { label: 'Activa', tone: 'green' },
  vencida: { label: 'Vencida', tone: 'red' },
  cancelada: { label: 'Cancelada', tone: 'gray' },
}

export function Badge({ tone, children }: { tone: keyof typeof STYLES; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${STYLES[tone]}`}
    >
      <span className={`size-1.5 rounded-full ${DOTS[tone]}`} />
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: TenantStatus | LicenseStatus }) {
  const { label, tone } = STATUSES[status]
  return <Badge tone={tone}>{label}</Badge>
}
