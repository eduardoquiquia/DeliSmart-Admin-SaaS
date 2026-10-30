import { useState, type FormEvent } from 'react'
import { errorMessage } from '../../lib/api'
import { formatDate, tenantUrl } from '../../lib/format'
import { useUpdateTenant } from '../../lib/queries'
import type { Tenant } from '../../lib/types'
import { ExternalLinkIcon } from '../ui/Icons'
import { Modal } from '../ui/Modal'
import { StatusBadge } from '../ui/StatusBadge'
import { inputClass, primaryButtonClass } from '../ui/styles'

type TenantModalProps = {
  tenant: Tenant
  onClose: () => void
}

export function TenantModal({ tenant, onClose }: TenantModalProps) {
  const update = useUpdateTenant()
  const [nombre, setNombre] = useState(tenant.nombre)
  const [ruc, setRuc] = useState(tenant.ruc)
  const [telefono, setTelefono] = useState(tenant.telefono)
  const [email, setEmail] = useState(tenant.email_admin)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    update.mutate({ id: tenant.id, nombre, ruc, telefono, email_admin: email }, { onSuccess: onClose })
  }

  return (
    <Modal title={tenant.nombre} subtitle={`Registrado el ${formatDate(tenant.fecha_creacion)}`} onClose={onClose}>
      <dl className="grid grid-cols-2 gap-3 rounded-lg bg-slate-100 p-3 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Estado</dt>
          <dd className="mt-1">
            <StatusBadge status={tenant.estado} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Plan</dt>
          <dd className="mt-1 font-semibold text-slate-900 capitalize">{tenant.licencia?.plan ?? tenant.plan_id}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-slate-500">Dirección</dt>
          <dd className="mt-1">
            <a
              href={tenantUrl(tenant.subdominio)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold break-all text-brand hover:text-brand-dark"
            >
              {tenantUrl(tenant.subdominio)}
              <ExternalLinkIcon className="size-3.5 shrink-0" />
            </a>
          </dd>
        </div>
      </dl>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block text-sm font-medium text-slate-800">
          Nombre
          <input
            required
            maxLength={120}
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className={inputClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-800">
            RUC
            <input
              inputMode="numeric"
              pattern="\d{11}"
              title="El RUC tiene 11 dígitos"
              maxLength={11}
              value={ruc}
              onChange={(event) => setRuc(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Teléfono
            <input
              type="tel"
              maxLength={30}
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              className={inputClass}
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-800">
          Correo del administrador
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
        </label>

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
