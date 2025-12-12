import { Routes, Route, Navigate } from 'react-router-dom';
import { PromoteurLayout } from './layouts/PromoteurLayout';
import { DashboardPage } from './pages/Dashboard';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/ProjectDetail';
import { ProjectBuyersPage } from './pages/ProjectBuyers';
import { ProjectCRMPage } from './pages/ProjectCRM';
import { ProjectFinancePage } from './pages/ProjectFinance';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PromoteurLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="projects/:projectId/buyers" element={<ProjectBuyersPage />} />
        <Route path="projects/:projectId/crm" element={<ProjectCRMPage />} />
        <Route path="projects/:projectId/finance" element={<ProjectFinancePage />} />
      </Route>
    </Routes>
  );
}
