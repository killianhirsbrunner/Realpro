import { Routes, Route, Navigate } from 'react-router-dom';
import { RegieLayout } from './layouts/RegieLayout';
import { DashboardPage } from './pages/Dashboard';
import { PropertiesPage } from './pages/Properties';
import { TenantsPage } from './pages/Tenants';
import { LeasesPage } from './pages/Leases';
import { AccountingPage } from './pages/Accounting';
import { MaintenancePage } from './pages/Maintenance';
import { DocumentsPage } from './pages/Documents';
import { SettingsPage } from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegieLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="leases" element={<LeasesPage />} />
        <Route path="accounting" element={<AccountingPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
