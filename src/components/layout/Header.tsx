import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { initials } from '../../lib/format'
import { useHealth } from '../../lib/queries'
import { LogoutIcon, MenuIcon, SearchIcon } from '../ui/Icons'
import { Badge } from '../ui/StatusBadge'

function ServerBadge() {
  const health = useHealth()
  if (health.isPending) return <Badge tone="gray">Conectando</Badge>
  if (health.isError) return <Badge tone="red">Servidor caído</Badge>
  return <Badge tone="green">Servidor activo</Badge>
}

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const name = profile?.nombre ?? 'Administrador'

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    const query = search.trim()
    if (query) navigate(`/tenants?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menú"
        className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <MenuIcon />
      </button>

      <form role="search" onSubmit={handleSearch} className="relative hidden max-w-sm flex-1 sm:block">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar restaurantes"
          placeholder="Buscar restaurante o subdominio"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-900 outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <ServerBadge />
        <span className="hidden h-8 w-px bg-slate-200 sm:block" />
        <span className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-brand">
            {initials(name)}
          </span>
          <span className="hidden leading-tight md:block">
            <span className="block text-sm font-semibold text-slate-900">{name}</span>
            <span className="block text-xs text-slate-500">Superusuario</span>
          </span>
        </span>
        <button
          type="button"
          onClick={logout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  )
}
