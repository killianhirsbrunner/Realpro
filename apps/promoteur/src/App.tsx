import { Routes, Route, Navigate } from 'react-router-dom';
import { PromoteurLayout } from './layouts/PromoteurLayout';
import { DashboardPage } from './pages/Dashboard';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/ProjectDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PromoteurLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
      </Route>
    </Routes>
  );
}
