import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '@realpro/ui';
import { RegieLayout } from './layouts/RegieLayout';
import { LoginPage } from './pages/Login';

// Simple auth check (TODO: replace with @realpro/auth)
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('regie_auth') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Lazy loaded pages for code splitting
const DashboardPage = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.DashboardPage })));
const PropertiesPage = lazy(() => import('./pages/Properties').then((m) => ({ default: m.PropertiesPage })));
const TenantsPage = lazy(() => import('./pages/Tenants').then((m) => ({ default: m.TenantsPage })));
const LeasesPage = lazy(() => import('./pages/Leases').then((m) => ({ default: m.LeasesPage })));
const PaymentsPage = lazy(() => import('./pages/Payments').then((m) => ({ default: m.PaymentsPage })));
const OwnersPage = lazy(() => import('./pages/Owners').then((m) => ({ default: m.OwnersPage })));
const MoveInOutPage = lazy(() => import('./pages/MoveInOut').then((m) => ({ default: m.MoveInOutPage })));
const TechnicalPage = lazy(() => import('./pages/Technical').then((m) => ({ default: m.TechnicalPage })));
const AccountingPage = lazy(() => import('./pages/Accounting').then((m) => ({ default: m.AccountingPage })));
const MaintenancePage = lazy(() => import('./pages/Maintenance').then((m) => ({ default: m.MaintenancePage })));
const DocumentsPage = lazy(() => import('./pages/Documents').then((m) => ({ default: m.DocumentsPage })));
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><RegieLayout /></RequireAuth>}>
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
              <PropertiesPage />
            </Suspense>
          }
        />
        <Route
          path="tenants"
          element={
            <Suspense fallback={<PageLoader />}>
              <TenantsPage />
            </Suspense>
          }
        />
        <Route
          path="tenants/:tenantId"
          element={
            <Suspense fallback={<PageLoader />}>
              <TenantsPage />
            </Suspense>
          }
        />
        <Route
          path="leases"
          element={
            <Suspense fallback={<PageLoader />}>
              <LeasesPage />
            </Suspense>
          }
        />
        <Route
          path="leases/:leaseId"
          element={
            <Suspense fallback={<PageLoader />}>
              <LeasesPage />
            </Suspense>
          }
        />
        <Route
          path="payments"
          element={
            <Suspense fallback={<PageLoader />}>
              <PaymentsPage />
            </Suspense>
          }
        />
        <Route
          path="accounting"
          element={
            <Suspense fallback={<PageLoader />}>
              <AccountingPage />
            </Suspense>
          }
        />
        <Route
          path="owners"
          element={
            <Suspense fallback={<PageLoader />}>
              <OwnersPage />
            </Suspense>
          }
        />
        <Route
          path="owners/:ownerId"
          element={
            <Suspense fallback={<PageLoader />}>
              <OwnersPage />
            </Suspense>
          }
        />
        <Route
          path="move-in-out"
          element={
            <Suspense fallback={<PageLoader />}>
              <MoveInOutPage />
            </Suspense>
          }
        />
        <Route
          path="technical"
          element={
            <Suspense fallback={<PageLoader />}>
              <TechnicalPage />
            </Suspense>
          }
        />
        <Route
          path="technical/:ticketId"
          element={
            <Suspense fallback={<PageLoader />}>
              <TechnicalPage />
            </Suspense>
          }
        />
        <Route
          path="maintenance"
          element={
            <Suspense fallback={<PageLoader />}>
              <MaintenancePage />
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
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
