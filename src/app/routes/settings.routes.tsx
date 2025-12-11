/**
 * RealPro | Settings Routes (Protected)
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageSkeleton } from '@shared/ui';

// Settings pages
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })));
const LocalizationSettings = lazy(() => import('@/pages/settings/LocalizationSettings').then((m) => ({ default: m.LocalizationSettings })));
const BrandingSettings = lazy(() => import('@/pages/settings/BrandingSettings').then((m) => ({ default: m.BrandingSettings })));
const SecuritySettings = lazy(() => import('@/pages/settings/SecuritySettings').then((m) => ({ default: m.SecuritySettings })));
const SuppliersSettings = lazy(() => import('@/pages/settings/SuppliersSettings').then((m) => ({ default: m.SuppliersSettings })));
const CompanySettings = lazy(() => import('@/pages/settings/CompanySettings').then((m) => ({ default: m.CompanySettings })));
const OrganizationSettings = lazy(() => import('@/pages/OrganizationSettings').then((m) => ({ default: m.OrganizationSettings })));
const BillingPage = lazy(() => import('@/pages/BillingPage').then((m) => ({ default: m.BillingPage })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const settingsRoutes = (
  <>
    <Route path="/settings" element={withSuspense(Settings)} />
    <Route path="/settings/localization" element={withSuspense(LocalizationSettings)} />
    <Route path="/settings/branding" element={withSuspense(BrandingSettings)} />
    <Route path="/settings/security" element={withSuspense(SecuritySettings)} />
    <Route path="/settings/suppliers" element={withSuspense(SuppliersSettings)} />
    <Route path="/company" element={withSuspense(CompanySettings)} />
    <Route path="/organization/settings" element={withSuspense(OrganizationSettings)} />
    <Route path="/billing" element={withSuspense(BillingPage)} />
  </>
);
