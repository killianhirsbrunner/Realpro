import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '@realpro/ui';
import { PromoteurLayout } from './layouts/PromoteurLayout';

// Lazy loaded pages for code splitting
const DashboardPage = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.DashboardPage })));
const ProjectsPage = lazy(() => import('./pages/Projects').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetail').then((m) => ({ default: m.ProjectDetailPage })));
const ProjectBuyersPage = lazy(() => import('./pages/ProjectBuyers').then((m) => ({ default: m.ProjectBuyersPage })));
const ProjectCRMPage = lazy(() => import('./pages/ProjectCRM').then((m) => ({ default: m.ProjectCRMPage })));
const ProjectFinancePage = lazy(() => import('./pages/ProjectFinance').then((m) => ({ default: m.ProjectFinancePage })));
const SalesPage = lazy(() => import('./pages/Sales').then((m) => ({ default: m.SalesPage })));
const DocumentsPage = lazy(() => import('./pages/Documents').then((m) => ({ default: m.DocumentsPage })));
const ConstructionPage = lazy(() => import('./pages/Construction').then((m) => ({ default: m.ConstructionPage })));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PromoteurLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectsPage />
            </Suspense>
          }
        />
        <Route
          path="projects/:projectId"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectDetailPage />
            </Suspense>
          }
        />
        <Route
          path="projects/:projectId/buyers"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectBuyersPage />
            </Suspense>
          }
        />
        <Route
          path="projects/:projectId/crm"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectCRMPage />
            </Suspense>
          }
        />
        <Route
          path="projects/:projectId/finance"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectFinancePage />
            </Suspense>
          }
        />
        <Route
          path="sales"
          element={
            <Suspense fallback={<PageLoader />}>
              <SalesPage />
            </Suspense>
          }
        />
        <Route
          path="construction"
          element={
            <Suspense fallback={<PageLoader />}>
              <ConstructionPage />
            </Suspense>
          }
        />
        <Route
          path="documents"
          element={
            <Suspense fallback={<PageLoader />}>
              <DocumentsPage />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
