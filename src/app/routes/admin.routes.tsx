/**
 * RealPro | Admin Routes (Protected)
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageSkeleton } from '@shared/ui';

// Admin pages
const AdminOrganizationsPage = lazy(() => import('@/pages/AdminOrganizations'));
const SuperAdminDashboard = lazy(() => import('@/pages/admin/SuperAdminDashboard').then((m) => ({ default: m.SuperAdminDashboard })));
const RealProAdminDashboard = lazy(() => import('@/pages/admin/RealProAdminDashboard').then((m) => ({ default: m.RealProAdminDashboard })));
const AuditLogs = lazy(() => import('@/pages/admin/AuditLogs').then((m) => ({ default: m.AuditLogs })));
const FeatureFlags = lazy(() => import('@/pages/admin/FeatureFlags').then((m) => ({ default: m.FeatureFlags })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const adminRoutes = (
  <>
    <Route path="/admin/organizations" element={withSuspense(AdminOrganizationsPage)} />
    <Route path="/admin/super" element={withSuspense(SuperAdminDashboard)} />
    <Route path="/admin/realpro" element={withSuspense(RealProAdminDashboard)} />
    <Route path="/admin/audit-logs" element={withSuspense(AuditLogs)} />
    <Route path="/admin/feature-flags" element={withSuspense(FeatureFlags)} />
  </>
);
