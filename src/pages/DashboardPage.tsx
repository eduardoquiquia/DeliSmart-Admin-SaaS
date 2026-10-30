import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DataTable, type Column } from '../components/ui/DataTable'
import { AlertIcon, BagIcon, CardIcon, StoreIcon, TrendUpIcon } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { Badge, StatusBadge } from '../components/ui/StatusBadge'
import { cardClass } from '../components/ui/styles'
import { formatDate, formatDateTime, formatMoney, tenantUrl } from '../lib/format'
import { useMetrics } from '../lib/queries'
import type { License, Metrics, Payment, Tenant } from '../lib/types'

const CRITICAL_DAYS = 3

const TONES = {
  neutral: 'bg-slate-100 text-slate-600',
  brand: 'bg-red-50 text-brand',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
}

type StatCardProps = {
  label: string
  value: string | number
  note: string
  icon: ReactNode
  tone?: keyof typeof TONES
}

function StatCard({ label, value, note, icon, tone = 'neutral' }: StatCardProps) {
  return (
    <article className={`p-5 ${cardClass}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>{icon}</span>
      </div>
      <p className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </article>
  )
}

function expiringTone(licenses: License[]) {
  if (licenses.length === 0) return 'success'
  return licenses.some((license) => license.dias_restantes <= CRITICAL_DAYS) ? 'brand' : 'warning'
}

const RECENT_COLUMNS: Column<Tenant>[] = [
  {
    header: 'Restaurante',
    cell: (tenant) => (
      <>
        <span className="block font-semibold text-slate-900">{tenant.nombre}</span>
        <a
          href={tenantUrl(tenant.subdominio)}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-brand hover:text-brand-dark"
        >
          {tenant.subdominio}
        </a>
      </>
    ),
  },
  { header: 'Plan', cell: (tenant) => <span className="capitalize">{tenant.licencia?.plan ?? tenant.plan_id}</span> },
  {
    header: 'Licencia',
    cell: (tenant) =>
      tenant.licencia ? (
        <>
          <StatusBadge status={tenant.licencia.estado} />
          <span className="mt-1 block text-xs text-slate-500">Vence {formatDate(tenant.licencia.fecha_vencimiento)}</span>
        </>
      ) : (
        'Sin licencia'
      ),
  },
  { header: 'Estado', cell: (tenant) => <StatusBadge status={tenant.estado} /> },
]

const PAYMENT_COLUMNS: Column<Payment>[] = [
  {
    header: 'Restaurante',
    cell: (payment) => (
      <>
        <span className="block font-semibold text-slate-900">{payment.restaurante_nombre}</span>
        <span className="text-xs text-slate-500">{payment.restaurante_subdominio}</span>
      </>
    ),
  },
  { header: 'Fecha', cell: (payment) => formatDateTime(payment.fecha_pago) },
  {
    header: 'Monto',
    align: 'right',
    cell: (payment) => (
      <span className="font-semibold text-slate-900">{formatMoney(payment.monto, payment.moneda)}</span>
    ),
  },
]

function ExpiringList({ licenses }: { licenses: License[] }) {
  if (licenses.length === 0) {
    return <p className="px-6 py-12 text-center text-sm text-slate-500">Ninguna licencia vence esta semana.</p>
  }
  return (
    <ul className="divide-y divide-slate-100">
      {licenses.map((license) => (
        <li key={license.id} className="flex items-center justify-between gap-3 px-6 py-3.5">
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-900">{license.restaurante_nombre}</span>
            <span className="text-xs text-slate-500">Vence {formatDate(license.fecha_vencimiento)}</span>
          </span>
          <Badge tone={license.dias_restantes <= CRITICAL_DAYS ? 'red' : 'amber'}>
            {license.dias_restantes === 0 ? 'Hoy' : `${license.dias_restantes} d`}
          </Badge>
        </li>
      ))}
    </ul>
  )
}

function DashboardContent({ metrics }: { metrics: Metrics }) {
  const expiring = metrics.licencias_por_vencer

  return (
    <>
      <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total ingresos"
          value={formatMoney(metrics.ingresos_totales)}
          note="Pagos confirmados por Stripe"
          icon={<CardIcon />}
          tone="brand"
        />
        <StatCard
          label="Restaurantes activos"
          value={metrics.restaurantes_activos}
          note={`${metrics.nuevas_suscripciones_mes} nuevas suscripciones este mes`}
          icon={<StoreIcon />}
          tone="success"
        />
        <StatCard
          label="Licencias por vencer"
          value={expiring.length}
          note="En los próximos 7 días"
          icon={<AlertIcon />}
          tone={expiringTone(expiring)}
        />
        <StatCard
          label="Pedidos globales"
          value={metrics.pedidos_globales ?? 'Sin datos'}
          note="Pendiente de conectar con restaurantes"
          icon={<BagIcon />}
        />
      </section>

      <section aria-label="Indicadores de suscripción" className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Ingresos mensuales recurrentes (MRR)"
          value={formatMoney(metrics.mrr)}
          note="Suscripciones vigentes en su equivalente mensual"
          icon={<TrendUpIcon />}
          tone="success"
        />
        <StatCard
          label="Ratio de cancelación"
          value={`${metrics.ratio_cancelacion}%`}
          note="Cancelaciones sobre las licencias vigentes al inicio del mes"
          icon={<TrendUpIcon className="size-5 -scale-y-100" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className={`min-w-0 xl:col-span-2 ${cardClass}`}>
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <h2 className="text-base font-bold text-slate-900">Últimos restaurantes por Stripe</h2>
            <Link to="/tenants" className="text-sm font-semibold text-brand hover:text-brand-dark">
              Ver todos
            </Link>
          </div>
          <DataTable
            columns={RECENT_COLUMNS}
            rows={metrics.ultimos_restaurantes}
            rowKey={(tenant) => tenant.id}
            emptyMessage="Aún no hay restaurantes registrados por Stripe."
          />
        </div>
        <div className={`min-w-0 ${cardClass}`}>
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <h2 className="text-base font-bold text-slate-900">Por vencer</h2>
            <Link to="/licencias" className="text-sm font-semibold text-brand hover:text-brand-dark">
              Gestionar
            </Link>
          </div>
          <ExpiringList licenses={expiring} />
        </div>
      </section>

      <section className={`mt-6 ${cardClass}`}>
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Últimos pagos</h2>
          <Link to="/pagos" className="text-sm font-semibold text-brand hover:text-brand-dark">
            Ver todos
          </Link>
        </div>
        <DataTable
          columns={PAYMENT_COLUMNS}
          rows={metrics.ultimos_pagos}
          rowKey={(payment) => payment.id}
          emptyMessage="Aún no hay pagos registrados."
        />
      </section>
    </>
  )
}

export function DashboardPage() {
  const metrics = useMetrics()
  return (
    <>
      <PageHeader eyebrow="Analíticas globales" title="Dashboard" subtitle="El estado de toda la plataforma DeliSmart." />
      <QueryBoundary
        query={metrics}
        skeleton={
          <div aria-label="Cargando" className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="h-36 rounded-2xl bg-slate-200/60" />
            ))}
          </div>
        }
      >
        {(data) => <DashboardContent metrics={data} />}
      </QueryBoundary>
    </>
  )
}
