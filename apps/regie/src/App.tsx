import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Spinner } from '@realpro/ui';
import { RegieLayout } from './layouts/RegieLayout';
import { LoginPage } from './pages/Login';
import { checkAppAccess, type AccessCheckResult } from '../../../src/subscriptions';

// Check subscription access
function RequireSubscription({ children }: { children: React.ReactNode }) {
  const [accessResult, setAccessResult] = useState<AccessCheckResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const result = checkAppAccess('regie');
    setAccessResult(result);

    if (!result.hasAccess) {
      // Redirect to shell apps page with message
      window.location.href = '/apps?access_denied=regie';
    }
  }, [navigate]);

  if (accessResult === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!accessResult.hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès requis</h1>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas d'abonnement actif pour Régie.
          </p>
          <a
            href="/apps"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Voir les options d'abonnement
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Simple auth check (TODO: replace with @realpro/auth)
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('regie_auth') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Combined guard: subscription + auth
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <RequireSubscription>
      <RequireAuth>
        {children}
      </RequireAuth>
    </RequireSubscription>
  );
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
      {/* Public routes */}
      <Route path="/login" element={
        <RequireSubscription>
          <LoginPage />
        </RequireSubscription>
      } />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><RegieLayout /></ProtectedRoute>}>
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
