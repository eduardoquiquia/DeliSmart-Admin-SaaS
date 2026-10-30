import { useState } from 'react'
import { LicenseModal } from '../components/tenants/LicenseModal'
import { DataTable, type Column } from '../components/ui/DataTable'
import { FilterTabs, Pagination, SearchInput } from '../components/ui/ListControls'
import { PageHeader } from '../components/ui/PageHeader'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { StatusBadge } from '../components/ui/StatusBadge'
import { cardClass } from '../components/ui/styles'
import { formatDate, formatMoney } from '../lib/format'
import { useLicenses } from '../lib/queries'
import type { License } from '../lib/types'
import { useListParams } from '../lib/useListParams'

const STATUS_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'activa', label: 'Activas' },
  { value: 'vencida', label: 'Vencidas' },
  { value: 'cancelada', label: 'Canceladas' },
]

function ExpiryCell({ license }: { license: License }) {
  const days = license.dias_restantes
  const urgent = license.estado === 'activa' && days <= 7
  return (
    <>
      <span className="block text-slate-900">{formatDate(license.fecha_vencimiento)}</span>
      {license.estado === 'activa' && (
        <span className={`text-xs font-medium ${urgent ? (days <= 3 ? 'text-brand-dark' : 'text-amber-600') : 'text-slate-500'}`}>
          {days === 0 ? 'Vence hoy' : `Quedan ${days} días`}
        </span>
      )}
    </>
  )
}

export function LicensesPage() {
  const list = useListParams()
  const licenses = useLicenses(list.query)
  const [editing, setEditing] = useState<License | null>(null)

  const columns: Column<License>[] = [
    {
      header: 'Restaurante',
      cell: (license) => (
        <>
          <span className="block font-semibold text-slate-900">{license.restaurante_nombre}</span>
          <span className="text-xs text-slate-500">{license.restaurante_subdominio}</span>
        </>
      ),
    },
    { header: 'Plan', cell: (license) => <span className="capitalize">{license.plan}</span> },
    { header: 'Inicio', cell: (license) => formatDate(license.fecha_inicio) },
    { header: 'Vencimiento', cell: (license) => <ExpiryCell license={license} /> },
    { header: 'Pagado', cell: (license) => formatMoney(license.monto_pagado) },
    { header: 'Estado', cell: (license) => <StatusBadge status={license.estado} /> },
    {
      header: 'Acciones',
      align: 'right',
      cell: (license) => (
        <button
          type="button"
          onClick={() => setEditing(license)}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand hover:bg-red-50"
        >
          Gestionar
        </button>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Licencias y suscripciones"
        title="Licencias"
        subtitle="Controla la vigencia y el plan de cada restaurante."
      />

      <div className={cardClass}>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={list.search}
            onChange={list.setSearch}
            label="Buscar por restaurante"
            placeholder="Buscar por restaurante"
          />
          <FilterTabs options={STATUS_FILTERS} value={list.estado} onChange={list.setEstado} />
        </div>
        <QueryBoundary query={licenses}>
          {(data) => (
            <>
              <DataTable
                columns={columns}
                rows={data.results}
                rowKey={(license) => license.id}
                emptyMessage="No hay licencias con esos criterios."
                dimmed={licenses.isPlaceholderData}
              />
              <Pagination page={list.page} count={data.count} onChange={list.setPage} />
            </>
          )}
        </QueryBoundary>
      </div>

      {editing && (
        <LicenseModal license={editing} restaurant={editing.restaurante_nombre} onClose={() => setEditing(null)} />
      )}
    </>
  )
}
