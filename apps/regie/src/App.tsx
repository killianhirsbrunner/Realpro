import { Routes, Route, Navigate } from 'react-router-dom';
import { RegieLayout } from './layouts/RegieLayout';
import { DashboardPage } from './pages/Dashboard';
import { PropertiesPage } from './pages/Properties';
import { TenantsPage } from './pages/Tenants';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegieLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="tenants" element={<TenantsPage />} />
      </Route>
    </Routes>
  );
}
