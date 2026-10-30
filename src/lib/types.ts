export type Page<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type TenantStatus = 'activo' | 'suspendido' | 'pendiente'
export type LicenseStatus = 'activa' | 'vencida' | 'cancelada'
export type PlanId = 'expreso' | 'pro' | 'cadenas'

export type Tenant = {
  id: number
  nombre: string
  subdominio: string
  ruc: string
  telefono: string
  email_admin: string
  fecha_creacion: string
  estado: TenantStatus
  plan_id: PlanId
  billing_cycle: 'monthly' | 'annual'
  licencia: {
    id: number
    plan: PlanId
    estado: LicenseStatus
    fecha_vencimiento: string
  } | null
}

export type License = {
  id: number
  restaurante: number
  restaurante_nombre: string
  restaurante_subdominio: string
  plan: PlanId
  fecha_inicio: string
  fecha_vencimiento: string
  dias_restantes: number
  monto_pagado: string
  estado: LicenseStatus
  fecha_cancelacion: string | null
  stripe_subscription_id: string
}

export type Payment = {
  id: number
  restaurante: number
  restaurante_nombre: string
  restaurante_subdominio: string
  stripe_checkout_id: string
  monto: string
  moneda: string
  fecha_pago: string
}

export type Metrics = {
  restaurantes_activos: number
  mrr: string
  nuevas_suscripciones_mes: number
  ratio_cancelacion: number
  ingresos_totales: string
  pedidos_globales: number | null
  licencias_por_vencer: License[]
  ultimos_restaurantes: Tenant[]
  ultimos_pagos: Payment[]
}

export type Plan = {
  id: PlanId
  nombre: string
  precio_mensual: string
  precio_anual: string
}

export type Profile = {
  id: number
  username: string
  email: string
  nombre: string
}
