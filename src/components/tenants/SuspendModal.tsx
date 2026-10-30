import { errorMessage } from '../../lib/api'
import { useUpdateTenant } from '../../lib/queries'
import type { Tenant } from '../../lib/types'
import { Modal } from '../ui/Modal'
import { primaryButtonClass, secondaryButtonClass } from '../ui/styles'

type SuspendModalProps = {
  tenant: Tenant
  onClose: () => void
}

export function SuspendModal({ tenant, onClose }: SuspendModalProps) {
  const update = useUpdateTenant()
  const suspending = tenant.estado === 'activo'

  function confirm() {
    update.mutate({ id: tenant.id, estado: suspending ? 'suspendido' : 'activo' }, { onSuccess: onClose })
  }

  return (
    <Modal title={suspending ? 'Suspender acceso' : 'Reactivar acceso'} subtitle={tenant.nombre} onClose={onClose}>
      <p className="text-sm text-slate-600">
        {suspending
          ? `${tenant.subdominio} dejará de estar disponible. La suscripción en Stripe sigue activa y se seguirá cobrando.`
          : `${tenant.subdominio} volverá a estar disponible de inmediato.`}
      </p>

      {update.isError && (
        <p role="alert" className="mt-4 text-sm font-medium text-brand-dark">
          {errorMessage(update.error)}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Volver
        </button>
        <button type="button" onClick={confirm} disabled={update.isPending} className={primaryButtonClass}>
          {update.isPending ? 'Guardando...' : suspending ? 'Suspender' : 'Reactivar'}
        </button>
      </div>
    </Modal>
  )
}
