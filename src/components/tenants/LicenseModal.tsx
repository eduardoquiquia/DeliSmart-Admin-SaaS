import { useState, type FormEvent } from 'react'
import { errorMessage } from '../../lib/api'
import { formatMoney } from '../../lib/format'
import { usePlans, useUpdateLicense } from '../../lib/queries'
import type { LicenseStatus, PlanId } from '../../lib/types'
import { Modal } from '../ui/Modal'
import { inputClass, primaryButtonClass } from '../ui/styles'

export type LicenseDraft = {
  id: number
  plan: PlanId
  fecha_vencimiento: string
  estado: LicenseStatus
}

type LicenseModalProps = {
  license: LicenseDraft
  restaurant: string
  onClose: () => void
}

export function LicenseModal({ license, restaurant, onClose }: LicenseModalProps) {
  const plans = usePlans()
  const update = useUpdateLicense()
  const [plan, setPlan] = useState(license.plan)
  const [expiry, setExpiry] = useState(license.fecha_vencimiento)
  const [status, setStatus] = useState(license.estado)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    update.mutate({ id: license.id, plan, fecha_vencimiento: expiry, estado: status }, { onSuccess: onClose })
  }

  return (
    <Modal title="Gestionar licencia" subtitle={restaurant} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-800">
          Plan
          <select value={plan} onChange={(event) => setPlan(event.target.value as PlanId)} className={inputClass}>
            {(plans.data ?? [{ id: license.plan, nombre: license.plan, precio_mensual: '0' }]).map((option) => (
              <option key={option.id} value={option.id}>
                {option.nombre}
                {plans.data ? `: ${formatMoney(option.precio_mensual)} /mes` : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Fecha de vencimiento
          <input
            required
            type="date"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Estado
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LicenseStatus)}
            className={inputClass}
          >
            <option value="activa">Activa</option>
            <option value="vencida">Vencida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>

        <p className="rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-600">
          Estos cambios son internos: no modifican el cobro de la suscripción en Stripe.
        </p>

        {update.isError && (
          <p role="alert" className="text-sm font-medium text-brand-dark">
            {errorMessage(update.error)}
          </p>
        )}

        <button type="submit" disabled={update.isPending} className={`w-full ${primaryButtonClass}`}>
          {update.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </Modal>
  )
}
