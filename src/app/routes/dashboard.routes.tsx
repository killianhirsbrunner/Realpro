/**
 * RealPro | Dashboard Routes (Protected)
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { lazy, Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { PageSkeleton } from '@shared/ui';

// Lazy load dashboard pages
const PromoterDashboard = lazy(() => import('@/pages/PromoterDashboard').then((m) => ({ default: m.PromoterDashboard })));
const DashboardHome = lazy(() => import('@/pages/DashboardHome').then((m) => ({ default: m.DashboardHome })));
const DashboardGlobal = lazy(() => import('@/pages/DashboardGlobal').then((m) => ({ default: m.DashboardGlobal })));
const OrganizationDashboard = lazy(() => import('@/pages/OrganizationDashboard').then((m) => ({ default: m.OrganizationDashboard })));
const DashboardAnalytics = lazy(() => import('@/pages/DashboardAnalytics').then((m) => ({ default: m.DashboardAnalytics })));
const Notifications = lazy(() => import('@/pages/Notifications').then((m) => ({ default: m.Notifications })));
const ModulesHub = lazy(() => import('@/pages/ModulesHub').then((m) => ({ default: m.ModulesHub })));

// Hub pages
const CRMDashboard = lazy(() => import('@/pages/CRMDashboard').then((m) => ({ default: m.CRMDashboard })));
const FinanceHub = lazy(() => import('@/pages/FinanceHub').then((m) => ({ default: m.FinanceHub })));
const PlanningHub = lazy(() => import('@/pages/PlanningHub').then((m) => ({ default: m.PlanningHub })));
const SAVHub = lazy(() => import('@/pages/SAVHub').then((m) => ({ default: m.SAVHub })));
const ReportingHub = lazy(() => import('@/pages/ReportingHub').then((m) => ({ default: m.ReportingHub })));

// Global pages
const MessagesGlobal = lazy(() => import('@/pages/MessagesGlobal'));
const SAVGlobal = lazy(() => import('@/pages/SAVGlobal'));
const TasksManager = lazy(() => import('@/pages/TasksManager').then((m) => ({ default: m.TasksManager })));
const TemplatesManager = lazy(() => import('@/pages/TemplatesManager').then((m) => ({ default: m.TemplatesManager })));

// Contacts
const ContactsList = lazy(() => import('@/pages/ContactsList'));
const ContactDetail = lazy(() => import('@/pages/ContactDetail'));
const CompaniesList = lazy(() => import('@/pages/CompaniesList'));
const CompanyDetail = lazy(() => import('@/pages/CompanyDetail'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const dashboardRoutes = (
  <>
    <Route path="/" element={<Navigate to="/promoter" replace />} />
    <Route path="/promoter" element={withSuspense(PromoterDashboard)} />
    <Route path="/dashboard" element={withSuspense(DashboardHome)} />
    <Route path="/dashboard-org" element={withSuspense(OrganizationDashboard)} />
    <Route path="/dashboard-global" element={withSuspense(DashboardGlobal)} />
    <Route path="/dashboard/analytics" element={withSuspense(DashboardAnalytics)} />
    <Route path="/notifications" element={withSuspense(Notifications)} />
    <Route path="/modules" element={withSuspense(ModulesHub)} />

    {/* Hubs */}
    <Route path="/crm" element={withSuspense(CRMDashboard)} />
    <Route path="/crm/dashboard" element={withSuspense(CRMDashboard)} />
    <Route path="/finance" element={withSuspense(FinanceHub)} />
    <Route path="/planning" element={withSuspense(PlanningHub)} />
    <Route path="/sav" element={withSuspense(SAVHub)} />
    <Route path="/reporting" element={withSuspense(ReportingHub)} />

    {/* Global */}
    <Route path="/messages" element={withSuspense(MessagesGlobal)} />
    <Route path="/tasks" element={withSuspense(TasksManager)} />
    <Route path="/templates" element={withSuspense(TemplatesManager)} />

    {/* Contacts */}
    <Route path="/contacts" element={withSuspense(ContactsList)} />
    <Route path="/contacts/:contactId" element={withSuspense(ContactDetail)} />
    <Route path="/companies" element={withSuspense(CompaniesList)} />
    <Route path="/companies/:companyId" element={withSuspense(CompanyDetail)} />
  </>
);
