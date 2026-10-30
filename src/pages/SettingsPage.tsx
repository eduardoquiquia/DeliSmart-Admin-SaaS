import { useAuth } from '../auth/AuthContext'
import { PageHeader } from '../components/ui/PageHeader'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { cardClass } from '../components/ui/styles'
import { API_URL, ROOT_DOMAIN } from '../lib/api'
import { formatMoney } from '../lib/format'
import { usePlans } from '../lib/queries'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold break-all text-slate-900">{value}</dd>
    </div>
  )
}

export function SettingsPage() {
  const { profile } = useAuth()
  const plans = usePlans()

  return (
    <>
      <PageHeader eyebrow="Configuración" title="Configuración" subtitle="Tu cuenta y los datos de la plataforma." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`p-6 ${cardClass}`}>
          <h2 className="text-base font-bold text-slate-900">Cuenta</h2>
          <dl className="mt-4 space-y-3">
            <Field label="Nombre" value={profile?.nombre ?? '-'} />
            <Field label="Usuario" value={profile?.username ?? '-'} />
            <Field label="Correo" value={profile?.email || '-'} />
            <Field label="Rol" value="Superusuario" />
          </dl>
        </section>

        <section className={`p-6 ${cardClass}`}>
          <h2 className="text-base font-bold text-slate-900">Plataforma</h2>
          <dl className="mt-4 space-y-3">
            <Field label="API" value={API_URL} />
            <Field label="Dominio de restaurantes" value={`*.${ROOT_DOMAIN}`} />
          </dl>
        </section>

        <section className={`lg:col-span-2 ${cardClass}`}>
          <h2 className="px-6 pt-6 text-base font-bold text-slate-900">Catálogo de planes</h2>
          <QueryBoundary query={plans}>
            {(data) => (
              <div className="grid gap-4 p-6 md:grid-cols-3">
                {data.map((plan) => (
                  <article key={plan.id} className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-900">{plan.nombre}</h3>
                    <p className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-slate-900">
                      {formatMoney(plan.precio_mensual)}
                      <span className="ml-1 font-sans text-sm font-normal text-slate-500">/ mes</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Anual: {formatMoney(plan.precio_anual)}</p>
                  </article>
                ))}
              </div>
            )}
          </QueryBoundary>
        </section>
      </div>
    </>
  )
}
