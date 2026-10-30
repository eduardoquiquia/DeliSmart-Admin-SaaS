import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LicensesPage } from './pages/LicensesPage'
import { LoginPage } from './pages/LoginPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TenantsPage } from './pages/TenantsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/licencias" element={<LicensesPage />} />
          <Route path="/pagos" element={<PaymentsPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
