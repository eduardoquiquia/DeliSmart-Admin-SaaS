import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useStripeSync } from '../../lib/queries'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const COLLAPSED_KEY = 'delismart-admin-sidebar'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === 'collapsed'
  } catch {
    return false
  }
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  useStripeSync()

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(COLLAPSED_KEY, next ? 'collapsed' : 'expanded')
    } catch {
      // La preferencia es opcional: sin almacenamiento solo dura esta visita.
    }
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={toggleCollapsed}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
