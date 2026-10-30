import { DataTable, type Column } from '../components/ui/DataTable'
import { Pagination, SearchInput } from '../components/ui/ListControls'
import { PageHeader } from '../components/ui/PageHeader'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { cardClass } from '../components/ui/styles'
import { formatDateTime, formatMoney } from '../lib/format'
import { usePayments } from '../lib/queries'
import type { Payment } from '../lib/types'
import { useListParams } from '../lib/useListParams'

const COLUMNS: Column<Payment>[] = [
  {
    header: 'ID de pago',
    cell: (payment) => (
      <span title={payment.stripe_checkout_id} className="block max-w-56 truncate font-mono text-xs text-slate-900">
        {payment.stripe_checkout_id}
      </span>
    ),
  },
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

export function PaymentsPage() {
  const list = useListParams()
  const payments = usePayments(list.query)

  return (
    <>
      <PageHeader
        eyebrow="Pagos / Stripe"
        title="Historial de pagos"
        subtitle="Cobros confirmados por el webhook de Stripe."
      />

      <div className={cardClass}>
        <div className="border-b border-slate-200 p-4">
          <SearchInput
            value={list.search}
            onChange={list.setSearch}
            label="Buscar por restaurante o ID de pago"
            placeholder="Buscar por restaurante o ID de pago"
          />
        </div>
        <QueryBoundary query={payments}>
          {(data) => (
            <>
              <DataTable
                columns={COLUMNS}
                rows={data.results}
                rowKey={(payment) => payment.id}
                emptyMessage="Aún no hay pagos registrados."
                dimmed={payments.isPlaceholderData}
              />
              <Pagination page={list.page} count={data.count} onChange={list.setPage} />
            </>
          )}
        </QueryBoundary>
      </div>
    </>
  )
}
