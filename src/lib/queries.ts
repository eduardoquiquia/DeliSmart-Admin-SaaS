import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { License, Metrics, MyPlan, Page, Payment, Plan, Profile, Tenant } from './types'

export type ListParams = { page: number; search: string; estado?: string }

function listParams({ page, search, estado }: ListParams) {
  return { page, search: search || undefined, estado: estado || undefined }
}

async function fetchList<T>(path: string, params: ListParams) {
  const { data } = await api.get<Page<T>>(path, { params: listParams(params) })
  return data
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health/'),
    refetchInterval: 30_000,
    retry: false,
  })
}

export function useProfile(enabled: boolean) {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get<Profile>('/auth/me/')).data,
    enabled,
    staleTime: Infinity,
  })
}

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: async () => (await api.get<Metrics>('/metrics/')).data,
  })
}

export function useMyPlan() {
  return useQuery({
    queryKey: ['my-plan'],
    queryFn: async () => (await api.get<MyPlan>('/my-plan/')).data,
  })
}

/** Enlace de un solo uso al panel de la pollería, con la sesión ya iniciada. */
export function useRestaurantAccess() {
  return useMutation({
    mutationFn: async () => (await api.post<{ url: string }>('/my-plan/restaurant-access/')).data.url,
  })
}

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => (await api.get<Plan[]>('/plans/')).data,
    staleTime: Infinity,
  })
}

export function useTenants(params: ListParams) {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => fetchList<Tenant>('/tenants/', params),
    placeholderData: keepPreviousData,
  })
}

export function useLicenses(params: ListParams) {
  return useQuery({
    queryKey: ['licenses', params],
    queryFn: () => fetchList<License>('/licenses/', params),
    placeholderData: keepPreviousData,
  })
}

export function usePayments(params: ListParams) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => fetchList<Payment>('/payments/', params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all(
      ['tenants', 'licenses', 'payments', 'metrics'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
    )
}

/** Trae los pagos cuyo webhook no llegó, para que aparezcan sin recargar el panel. */
export function useStripeSync(enabled: boolean) {
  const invalidate = useInvalidate()
  return useQuery({
    queryKey: ['stripe-sync'],
    enabled,
    queryFn: async () => {
      const { data } = await api.post<{ activados: number }>('/stripe/sync/')
      if (data.activados > 0) await invalidate()
      return data
    },
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: false,
  })
}

export function useUpdateTenant() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, ...changes }: Partial<Tenant> & { id: number }) => api.patch(`/tenants/${id}/`, changes),
    onSuccess: invalidate,
  })
}

export function useUpdateLicense() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, ...changes }: Partial<License> & { id: number }) => api.patch(`/licenses/${id}/`, changes),
    onSuccess: invalidate,
  })
}
