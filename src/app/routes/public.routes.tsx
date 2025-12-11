/**
 * RealPro | Public Routes (No Auth Required)
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageSkeleton } from '@shared/ui';

// Lazy load public pages
const Landing = lazy(() => import('@/pages/public/Landing').then((m) => ({ default: m.Landing })));
const Pricing = lazy(() => import('@/pages/public/Pricing').then((m) => ({ default: m.Pricing })));
const Features = lazy(() => import('@/pages/public/Features').then((m) => ({ default: m.Features })));
const Contact = lazy(() => import('@/pages/public/Contact').then((m) => ({ default: m.Contact })));

// Legal pages
const CGU = lazy(() => import('@/pages/legal/CGU'));
const CGV = lazy(() => import('@/pages/legal/CGV'));
const MentionsLegales = lazy(() => import('@/pages/legal/MentionsLegales'));
const Privacy = lazy(() => import('@/pages/legal/Privacy'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const publicRoutes = (
  <>
    <Route path="/" element={withSuspense(Landing)} />
    <Route path="/pricing" element={withSuspense(Pricing)} />
    <Route path="/features" element={withSuspense(Features)} />
    <Route path="/contact" element={withSuspense(Contact)} />

    {/* Legal */}
    <Route path="/legal/cgu" element={withSuspense(CGU)} />
    <Route path="/legal/cgv" element={withSuspense(CGV)} />
    <Route path="/legal/mentions-legales" element={withSuspense(MentionsLegales)} />
    <Route path="/legal/privacy" element={withSuspense(Privacy)} />
  </>
);
