import { DataTable, type Column } from '../components/ui/DataTable'
import { ExternalLinkIcon } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { StatusBadge } from '../components/ui/StatusBadge'
import { cardClass, primaryButtonClass, secondaryButtonClass } from '../components/ui/styles'
import { useState } from 'react'
import { errorMessage } from '../lib/api'
import { formatDate, formatDateTime, formatMoney } from '../lib/format'
import { useMyPlan, usePlans, useRestaurantAccess } from '../lib/queries'
import type { MyPlan, Payment } from '../lib/types'

const PAYMENT_COLUMNS: Column<Payment>[] = [
  { header: 'Fecha', cell: (payment) => formatDateTime(payment.fecha_pago) },
  {
    header: 'ID de pago',
    cell: (payment) => (
      <span title={payment.stripe_checkout_id} className="block max-w-56 truncate font-mono text-xs text-slate-900">
        {payment.stripe_checkout_id}
      </span>
    ),
  },
  {
    header: 'Monto',
    align: 'right',
    cell: (payment) => (
      <span className="font-semibold text-slate-900">{formatMoney(payment.monto, payment.moneda)}</span>
    ),
  },
]

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold break-all text-slate-900">{value}</dd>
    </div>
  )
}

function OpenRestaurantButton() {
  const access = useRestaurantAccess()
  const [error, setError] = useState<string | null>(null)

  function open() {
    // La pestaña se abre en el clic para que el navegador no la bloquee; el enlace llega después.
    const tab = window.open('', '_blank')
    setError(null)
    access.mutate(undefined, {
      onSuccess: (url) => {
        if (!tab) {
          window.location.assign(url)
          return
        }
        tab.opener = null
        tab.location.href = url
      },
      onError: (err) => {
        tab?.close()
        setError(errorMessage(err, 'No pudimos abrir el panel de tu pollería.'))
      },
    })
  }

  return (
    <div className="mt-5">
      <button type="button" onClick={open} disabled={access.isPending} className={`w-full ${primaryButtonClass}`}>
        <ExternalLinkIcon className="size-4" />
        {access.isPending ? 'Abriendo…' : 'Abrir panel de mi pollería'}
      </button>
      <p className="mt-2 text-xs text-slate-500">Entras directo como administrador, sin volver a iniciar sesión.</p>
      {error && (
        <p role="alert" className="mt-2 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function PlanContent({ data }: { data: MyPlan }) {
  const plans = usePlans()
  const { restaurante, licencia, pagos } = data
  const planId = licencia?.plan ?? restaurante.plan_id
  const plan = plans.data?.find((option) => option.id === planId)
  const annual = restaurante.billing_cycle === 'annual'

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className={`p-6 lg:col-span-2 ${cardClass}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Plan actual</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{plan?.nombre ?? planId}</h2>
          </div>
          {licencia ? <StatusBadge status={licencia.estado} /> : <StatusBadge status={restaurante.estado} />}
        </div>

        {plan && (
          <p className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900">
            {formatMoney(annual ? plan.precio_anual : plan.precio_mensual)}
            <span className="ml-1 font-sans text-sm font-normal text-slate-500">{annual ? '/ año' : '/ mes'}</span>
          </p>
        )}

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <Field label="Inicio" value={licencia ? formatDate(licencia.fecha_inicio) : '-'} />
          <Field label="Próxima renovación" value={licencia ? formatDate(licencia.fecha_vencimiento) : '-'} />
        </dl>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <button type="button" disabled className={secondaryButtonClass}>
            Gestionar suscripción
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Pronto podrás cambiar de plan y actualizar tu método de pago desde aquí.
          </p>
        </div>
      </section>

      <section className={`p-6 ${cardClass}`}>
        <h2 className="text-base font-bold text-slate-900">Tu restaurante</h2>
        <dl className="mt-4 space-y-3">
          <Field label="Nombre" value={restaurante.nombre} />
          <Field label="RUC" value={restaurante.ruc || '-'} />
          <Field label="Teléfono" value={restaurante.telefono || '-'} />
          <Field label="Correo" value={restaurante.email_admin || '-'} />
        </dl>
        <OpenRestaurantButton />
      </section>

      <section className={`min-w-0 lg:col-span-3 ${cardClass}`}>
        <h2 className="px-6 py-4 text-base font-bold text-slate-900">Historial de pagos</h2>
        <DataTable
          columns={PAYMENT_COLUMNS}
          rows={pagos}
          rowKey={(payment) => payment.id}
          emptyMessage="Aún no hay pagos registrados."
        />
      </section>
    </div>
  )
}

export function MyPlanPage() {
  const myPlan = useMyPlan()
  return (
    <>
      <PageHeader eyebrow="Tu suscripción" title="Mi Plan" subtitle="Tu plan, tu licencia y tus pagos de DeliSmart." />
      <QueryBoundary query={myPlan}>{(data) => <PlanContent data={data} />}</QueryBoundary>
    </>
  )
}
