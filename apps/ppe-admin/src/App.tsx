import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '@realpro/ui';
import { PPEAdminLayout } from './layouts/PPEAdminLayout';
import { LoginPage } from './pages/Login';

// Simple auth check (TODO: replace with @realpro/auth)
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('ppe_admin_auth') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Lazy loaded pages for code splitting
const DashboardPage = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.DashboardPage })));
const PropertiesPage = lazy(() => import('./pages/Properties').then((m) => ({ default: m.PropertiesPage })));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetail').then((m) => ({ default: m.PropertyDetailPage })));
const CoownersPage = lazy(() => import('./pages/Coowners').then((m) => ({ default: m.CoownersPage })));
const OwnersPage = lazy(() => import('./pages/Owners').then((m) => ({ default: m.OwnersPage })));
const AssembliesPage = lazy(() => import('./pages/Assemblies').then((m) => ({ default: m.AssembliesPage })));
const MeetingsPage = lazy(() => import('./pages/Meetings').then((m) => ({ default: m.MeetingsPage })));
const BudgetPage = lazy(() => import('./pages/Budget').then((m) => ({ default: m.BudgetPage })));
const AccountingPage = lazy(() => import('./pages/Accounting').then((m) => ({ default: m.AccountingPage })));
const FundsPage = lazy(() => import('./pages/Funds').then((m) => ({ default: m.FundsPage })));
const DocumentsPage = lazy(() => import('./pages/Documents').then((m) => ({ default: m.DocumentsPage })));
const TicketsPage = lazy(() => import('./pages/Tickets').then((m) => ({ default: m.TicketsPage })));
const WorksPage = lazy(() => import('./pages/Works').then((m) => ({ default: m.WorksPage })));
const SettingsPage = lazy(() => import('./pages/Settings').then((m) => ({ default: m.SettingsPage })));

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
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route path="/" element={<RequireAuth><PPEAdminLayout /></RequireAuth>}>
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
          path="properties"
          element={
            <Suspense fallback={<PageLoader />}>
              <PropertiesPage />
            </Suspense>
          }
        />
        <Route
          path="properties/:propertyId"
          element={
            <Suspense fallback={<PageLoader />}>
              <PropertyDetailPage />
            </Suspense>
          }
        />
        <Route
          path="owners"
          element={
            <Suspense fallback={<PageLoader />}>
              <CoownersPage />
            </Suspense>
          }
        />
        <Route
          path="owners/:ownerId"
          element={
            <Suspense fallback={<PageLoader />}>
              <CoownersPage />
            </Suspense>
          }
        />
        <Route
          path="meetings"
          element={
            <Suspense fallback={<PageLoader />}>
              <AssembliesPage />
            </Suspense>
          }
        />
        <Route
          path="meetings/:meetingId"
          element={
            <Suspense fallback={<PageLoader />}>
              <AssembliesPage />
            </Suspense>
          }
        />
        <Route
          path="accounting"
          element={
            <Suspense fallback={<PageLoader />}>
              <BudgetPage />
            </Suspense>
          }
        />
        <Route
          path="funds"
          element={
            <Suspense fallback={<PageLoader />}>
              <BudgetPage />
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
          path="works"
          element={
            <Suspense fallback={<PageLoader />}>
              <TicketsPage />
            </Suspense>
          }
        />
        <Route
          path="tickets"
          element={
            <Suspense fallback={<PageLoader />}>
              <TicketsPage />
            </Suspense>
          }
        />
        <Route
          path="tickets/:ticketId"
          element={
            <Suspense fallback={<PageLoader />}>
              <TicketsPage />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
