/**
 * RealPro | Auth Routes
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageSkeleton } from '@shared/ui';

// Lazy load auth pages
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const RegisterCompany = lazy(() => import('@/pages/auth/RegisterCompany').then((m) => ({ default: m.RegisterCompany })));
const ChoosePlan = lazy(() => import('@/pages/auth/ChoosePlan').then((m) => ({ default: m.ChoosePlan })));
const Checkout = lazy(() => import('@/pages/auth/Checkout').then((m) => ({ default: m.Checkout })));
const Success = lazy(() => import('@/pages/auth/Success').then((m) => ({ default: m.Success })));
const TrialExpired = lazy(() => import('@/pages/auth/TrialExpired').then((m) => ({ default: m.TrialExpired })));
const SelectOrganization = lazy(() => import('@/pages/SelectOrganization').then((m) => ({ default: m.SelectOrganization })));
const OrganizationOnboarding = lazy(() => import('@/pages/OrganizationOnboarding').then((m) => ({ default: m.OrganizationOnboarding })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const authRoutes = (
  <>
    <Route path="/login" element={withSuspense(Login)} />
    <Route path="/register" element={withSuspense(RegisterCompany)} />
    <Route path="/forgot-password" element={withSuspense(ForgotPassword)} />
    <Route path="/reset-password" element={withSuspense(ResetPassword)} />

    {/* Auth flow */}
    <Route path="/auth/register" element={withSuspense(RegisterCompany)} />
    <Route path="/auth/choose-plan" element={withSuspense(ChoosePlan)} />
    <Route path="/auth/checkout" element={withSuspense(Checkout)} />
    <Route path="/auth/success" element={withSuspense(Success)} />
    <Route path="/auth/trial-expired" element={withSuspense(TrialExpired)} />
    <Route path="/auth/onboarding" element={withSuspense(OrganizationOnboarding)} />
    <Route path="/auth/select-organization" element={withSuspense(SelectOrganization)} />
  </>
);
