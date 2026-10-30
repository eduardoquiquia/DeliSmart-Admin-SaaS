import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth, RequireRole, RoleHome } from './auth/RequireAuth'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LicensesPage } from './pages/LicensesPage'
import { MyPlanPage } from './pages/MyPlanPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TenantsPage } from './pages/TenantsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RoleHome />} />
          <Route element={<RequireRole role="superusuario" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/licencias" element={<LicensesPage />} />
            <Route path="/pagos" element={<PaymentsPage />} />
            <Route path="/configuracion" element={<SettingsPage />} />
          </Route>
          <Route element={<RequireRole role="cliente" />}>
            <Route path="/mi-plan" element={<MyPlanPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
