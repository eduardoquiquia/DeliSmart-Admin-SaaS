import { useState } from 'react'
import { LicenseModal } from '../components/tenants/LicenseModal'
import { SuspendModal } from '../components/tenants/SuspendModal'
import { TenantModal } from '../components/tenants/TenantModal'
import { DataTable, type Column } from '../components/ui/DataTable'
import { BanIcon, ExternalLinkIcon, EyeIcon, PlayIcon, SwapIcon } from '../components/ui/Icons'
import { FilterTabs, Pagination, SearchInput } from '../components/ui/ListControls'
import { PageHeader } from '../components/ui/PageHeader'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { StatusBadge } from '../components/ui/StatusBadge'
import { cardClass } from '../components/ui/styles'
import { formatDate, tenantUrl } from '../lib/format'
import { useTenants } from '../lib/queries'
import type { Tenant } from '../lib/types'
import { useListParams } from '../lib/useListParams'

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'suspendido', label: 'Suspendidos' },
  { value: 'pendiente', label: 'Pendientes' },
]

const actionClass =
  'rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30'

type Dialog = { kind: 'details' | 'license' | 'suspend'; tenant: Tenant }

export function TenantsPage() {
  const list = useListParams()
  const tenants = useTenants(list.query)
  const [dialog, setDialog] = useState<Dialog | null>(null)

  const columns: Column<Tenant>[] = [
    {
      header: 'Restaurante',
      cell: (tenant) => (
        <>
          <span className="block font-semibold text-slate-900">{tenant.nombre}</span>
          <span className="text-xs text-slate-500">{tenant.subdominio}</span>
        </>
      ),
    },
    { header: 'Plan', cell: (tenant) => <span className="capitalize">{tenant.licencia?.plan ?? tenant.plan_id}</span> },
    { header: 'Estado', cell: (tenant) => <StatusBadge status={tenant.estado} /> },
    {
      header: 'Vencimiento',
      cell: (tenant) => (tenant.licencia ? formatDate(tenant.licencia.fecha_vencimiento) : 'Sin licencia'),
    },
    {
      header: 'Acciones',
      align: 'right',
      cell: (tenant) => (
        <span className="inline-flex items-center gap-0.5">
          <button
            type="button"
            title="Ver detalles"
            aria-label={`Ver detalles de ${tenant.nombre}`}
            onClick={() => setDialog({ kind: 'details', tenant })}
            className={actionClass}
          >
            <EyeIcon />
          </button>
          <button
            type="button"
            title={tenant.licencia ? 'Cambiar plan' : 'Sin licencia para cambiar'}
            aria-label={`Cambiar plan de ${tenant.nombre}`}
            disabled={!tenant.licencia}
            onClick={() => setDialog({ kind: 'license', tenant })}
            className={actionClass}
          >
            <SwapIcon />
          </button>
          <button
            type="button"
            title={tenant.estado === 'activo' ? 'Suspender acceso' : 'Reactivar acceso'}
            aria-label={`${tenant.estado === 'activo' ? 'Suspender' : 'Reactivar'} ${tenant.nombre}`}
            disabled={tenant.estado === 'pendiente'}
            onClick={() => setDialog({ kind: 'suspend', tenant })}
            className={actionClass}
          >
            {tenant.estado === 'suspendido' ? <PlayIcon /> : <BanIcon />}
          </button>
          <a
            href={tenantUrl(tenant.subdominio)}
            target="_blank"
            rel="noreferrer"
            title="Abrir subdominio"
            aria-label={`Abrir subdominio de ${tenant.nombre}`}
            className={actionClass}
          >
            <ExternalLinkIcon />
          </a>
        </span>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Restaurantes / Tenants"
        title="Gestión de restaurantes"
        subtitle="Busca, edita y controla el acceso de cada restaurante."
      />

      <div className={cardClass}>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={list.search}
            onChange={list.setSearch}
            label="Buscar por nombre o subdominio"
            placeholder="Buscar por nombre o subdominio"
          />
          <FilterTabs options={STATUS_FILTERS} value={list.estado} onChange={list.setEstado} />
        </div>
        <QueryBoundary query={tenants}>
          {(data) => (
            <>
              <DataTable
                columns={columns}
                rows={data.results}
                rowKey={(tenant) => tenant.id}
                emptyMessage="No encontramos restaurantes con esos criterios."
                dimmed={tenants.isPlaceholderData}
              />
              <Pagination page={list.page} count={data.count} onChange={list.setPage} />
            </>
          )}
        </QueryBoundary>
      </div>

      {dialog?.kind === 'details' && <TenantModal tenant={dialog.tenant} onClose={() => setDialog(null)} />}
      {dialog?.kind === 'suspend' && <SuspendModal tenant={dialog.tenant} onClose={() => setDialog(null)} />}
      {dialog?.kind === 'license' && dialog.tenant.licencia && (
        <LicenseModal
          license={dialog.tenant.licencia}
          restaurant={dialog.tenant.nombre}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  )
}
