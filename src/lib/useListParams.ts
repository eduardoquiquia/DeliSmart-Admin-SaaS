import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/** Búsqueda, filtro y página viven en la URL: se pueden compartir y el buscador global llega aquí. */
export function useListParams() {
  const [params, setParams] = useSearchParams()
  const search = params.get('q') ?? ''
  const estado = params.get('estado') ?? ''
  const page = Number(params.get('page')) || 1

  function update(changes: Record<string, string>) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (!('page' in changes)) next.delete('page')
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true },
    )
  }

  return {
    search,
    estado,
    page,
    query: { page, search: useDebounced(search.trim()), estado },
    setSearch: (value: string) => update({ q: value }),
    setEstado: (value: string) => update({ estado: value }),
    setPage: (value: number) => update({ page: value > 1 ? String(value) : '' }),
  }
}
