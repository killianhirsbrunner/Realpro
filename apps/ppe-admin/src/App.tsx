import { Routes, Route, Navigate } from 'react-router-dom';
import { PPEAdminLayout } from './layouts/PPEAdminLayout';
import { DashboardPage } from './pages/Dashboard';
import { PropertiesPage } from './pages/Properties';
import { PropertyDetailPage } from './pages/PropertyDetail';
import { OwnersPage } from './pages/Owners';
import { AccountingPage } from './pages/Accounting';
import { FundsPage } from './pages/Funds';
import { DocumentsPage } from './pages/Documents';
import { WorksPage } from './pages/Works';
import { MeetingsPage } from './pages/Meetings';
import { SettingsPage } from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PPEAdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:propertyId" element={<PropertyDetailPage />} />
        <Route path="owners" element={<OwnersPage />} />
        <Route path="accounting" element={<AccountingPage />} />
        <Route path="funds" element={<FundsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="works" element={<WorksPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
