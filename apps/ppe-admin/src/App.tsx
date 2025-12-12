import { Routes, Route, Navigate } from 'react-router-dom';
import { PPEAdminLayout } from './layouts/PPEAdminLayout';
import { DashboardPage } from './pages/Dashboard';
import { PropertiesPage } from './pages/Properties';
import { PropertyDetailPage } from './pages/PropertyDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PPEAdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:propertyId" element={<PropertyDetailPage />} />
      </Route>
    </Routes>
  );
}
