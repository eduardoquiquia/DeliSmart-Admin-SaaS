import { NavLink } from 'react-router-dom'
import { CardIcon, ChartIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, KeyIcon, SettingsIcon, StoreIcon } from '../ui/Icons'
import { Logo, LogoMark } from '../ui/Logo'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: ChartIcon },
  { to: '/tenants', label: 'Restaurantes', Icon: StoreIcon },
  { to: '/licencias', label: 'Licencias y Suscripciones', Icon: KeyIcon },
  { to: '/pagos', label: 'Pagos / Stripe', Icon: CardIcon },
  { to: '/configuracion', label: 'Configuración', Icon: SettingsIcon },
]

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onToggle: () => void
  onCloseMobile: () => void
}

export function Sidebar({ collapsed, mobileOpen, onToggle, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-900/55 lg:hidden" onClick={onCloseMobile} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-svh lg:translate-x-0 lg:transition-[width] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className={`flex h-16 items-center border-b border-slate-200 px-5 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <span className={collapsed ? 'lg:hidden' : ''}>
            <Logo />
          </span>
          {collapsed && <LogoMark className="hidden size-9 lg:block" />}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Cerrar menú"
            className="ml-auto rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Principal" className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  collapsed ? 'lg:justify-center lg:px-0' : ''
                } ${isActive ? 'bg-red-50 text-brand' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`
              }
            >
              <Icon className="size-5 shrink-0" />
              <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-slate-200 p-3 lg:block">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expandir menú' : 'Replegar menú'}
            aria-expanded={!collapsed}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            {collapsed ? <ChevronRightIcon className="size-5" /> : <ChevronLeftIcon className="size-5" />}
            {!collapsed && 'Replegar menú'}
          </button>
        </div>
      </aside>
    </>
  )
}
