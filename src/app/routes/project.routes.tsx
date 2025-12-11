/**
 * RealPro | Project Routes (Protected)
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageSkeleton } from '@shared/ui';

// Lazy load project pages
const ProjectsListEnhanced = lazy(() => import('@/pages/ProjectsListEnhanced').then((m) => ({ default: m.ProjectsListEnhanced })));
const ProjectCreationWizard = lazy(() => import('@/pages/ProjectCreationWizard'));
const ProjectCockpit = lazy(() => import('@/pages/ProjectCockpit').then((m) => ({ default: m.ProjectCockpit })));
const ProjectOverview = lazy(() => import('@/pages/ProjectOverview').then((m) => ({ default: m.ProjectOverview })));
const ProjectCockpitDashboardIntegrated = lazy(() => import('@/pages/ProjectCockpitDashboardIntegrated'));

// Project sub-pages
const ProjectPlanningPage = lazy(() => import('@/pages/ProjectPlanningPage'));
const ProjectPlanningPhotos = lazy(() => import('@/pages/ProjectPlanningPhotos'));
const ProjectPlanningReports = lazy(() => import('@/pages/ProjectPlanningReports'));
const ProjectPlanningBuyersProgress = lazy(() => import('@/pages/ProjectPlanningBuyersProgress'));
const ProjectConstructionPage = lazy(() => import('@/pages/ProjectConstructionPage').then((m) => ({ default: m.ProjectConstructionPage })));
const ProjectCommunicationPage = lazy(() => import('@/pages/ProjectCommunicationPage').then((m) => ({ default: m.ProjectCommunicationPage })));
const ProjectReportingPage = lazy(() => import('@/pages/ProjectReportingPage').then((m) => ({ default: m.ProjectReportingPage })));
const ProjectModificationsPage = lazy(() => import('@/pages/ProjectModificationsPage').then((m) => ({ default: m.ProjectModificationsPage })));

// Lots & Buyers
const ProjectLots = lazy(() => import('@/pages/ProjectLots').then((m) => ({ default: m.ProjectLots })));
const ProjectLotDetail = lazy(() => import('@/pages/ProjectLotDetail').then((m) => ({ default: m.ProjectLotDetail })));
const ProjectBuyers = lazy(() => import('@/pages/ProjectBuyers').then((m) => ({ default: m.ProjectBuyers })));
const BuyerDetail = lazy(() => import('@/pages/BuyerDetail').then((m) => ({ default: m.BuyerDetail })));

// Documents
const ProjectDocuments = lazy(() => import('@/pages/ProjectDocuments').then((m) => ({ default: m.ProjectDocuments })));
const DocumentViewer = lazy(() => import('@/pages/DocumentViewer').then((m) => ({ default: m.DocumentViewer })));

// Submissions
const ProjectSubmissions = lazy(() => import('@/pages/ProjectSubmissions').then((m) => ({ default: m.ProjectSubmissions })));
const NewSubmission = lazy(() => import('@/pages/NewSubmission').then((m) => ({ default: m.NewSubmission })));
const SubmissionDetail = lazy(() => import('@/pages/SubmissionDetail').then((m) => ({ default: m.SubmissionDetail })));
const SubmissionComparison = lazy(() => import('@/pages/SubmissionComparison').then((m) => ({ default: m.SubmissionComparison })));

// Finance
const ProjectFinancesDashboard = lazy(() => import('@/pages/ProjectFinancesDashboard').then((m) => ({ default: m.ProjectFinancesDashboard })));
const ProjectCFC = lazy(() => import('@/pages/ProjectCFC').then((m) => ({ default: m.ProjectCFC })));
const CfcDetail = lazy(() => import('@/pages/CfcDetail').then((m) => ({ default: m.CfcDetail })));

// Materials
const ProjectMaterialsSelections = lazy(() => import('@/pages/ProjectMaterialsSelections'));
const ProjectMaterialsCatalogManager = lazy(() => import('@/pages/ProjectMaterialsCatalogManager'));
const ProjectMaterialsLotChoices = lazy(() => import('@/pages/ProjectMaterialsLotChoices'));

// CRM
const ProjectCRMPipeline = lazy(() => import('@/pages/ProjectCRMPipeline'));
const ProjectCRMProspects = lazy(() => import('@/pages/ProjectCRMProspects'));
const ProjectCRMProspectDetail = lazy(() => import('@/pages/ProjectCRMProspectDetail'));

// SAV, Notary, Brokers
const ProjectSAV = lazy(() => import('@/pages/ProjectSAV').then((m) => ({ default: m.ProjectSAV })));
const ProjectNotary = lazy(() => import('@/pages/ProjectNotary'));
const ProjectBrokers = lazy(() => import('@/pages/ProjectBrokers').then((m) => ({ default: m.ProjectBrokers })));

// Settings & Structure
const ProjectSettingsComplete = lazy(() => import('@/pages/ProjectSettingsComplete').then((m) => ({ default: m.ProjectSettingsComplete })));
const ProjectStructurePage = lazy(() => import('@/pages/ProjectStructurePage'));
const ProjectTeamPage = lazy(() => import('@/pages/ProjectTeamPage'));
const ProjectMessages = lazy(() => import('@/pages/ProjectMessages'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const projectRoutes = (
  <>
    <Route path="/projects" element={withSuspense(ProjectsListEnhanced)} />
    <Route path="/projects/wizard" element={withSuspense(ProjectCreationWizard)} />
    <Route path="/projects/new" element={withSuspense(ProjectCreationWizard)} />

    {/* Project cockpit */}
    <Route path="/projects/:projectId" element={withSuspense(ProjectCockpit)} />
    <Route path="/projects/:projectId/overview" element={withSuspense(ProjectOverview)} />
    <Route path="/projects/:projectId/dashboard" element={withSuspense(ProjectCockpitDashboardIntegrated)} />

    {/* Planning */}
    <Route path="/projects/:projectId/planning" element={withSuspense(ProjectPlanningPage)} />
    <Route path="/projects/:projectId/planning/photos" element={withSuspense(ProjectPlanningPhotos)} />
    <Route path="/projects/:projectId/planning/reports" element={withSuspense(ProjectPlanningReports)} />
    <Route path="/projects/:projectId/planning/buyers" element={withSuspense(ProjectPlanningBuyersProgress)} />
    <Route path="/projects/:projectId/construction" element={withSuspense(ProjectConstructionPage)} />
    <Route path="/projects/:projectId/communication" element={withSuspense(ProjectCommunicationPage)} />
    <Route path="/projects/:projectId/reporting" element={withSuspense(ProjectReportingPage)} />
    <Route path="/projects/:projectId/modifications" element={withSuspense(ProjectModificationsPage)} />

    {/* Lots */}
    <Route path="/projects/:projectId/lots" element={withSuspense(ProjectLots)} />
    <Route path="/projects/:projectId/lots/:lotId" element={withSuspense(ProjectLotDetail)} />

    {/* Buyers */}
    <Route path="/projects/:projectId/buyers" element={withSuspense(ProjectBuyers)} />
    <Route path="/projects/:projectId/buyers/:buyerId" element={withSuspense(BuyerDetail)} />

    {/* Documents */}
    <Route path="/projects/:projectId/documents" element={withSuspense(ProjectDocuments)} />
    <Route path="/projects/:projectId/documents/:documentId" element={withSuspense(DocumentViewer)} />

    {/* Submissions */}
    <Route path="/projects/:projectId/submissions" element={withSuspense(ProjectSubmissions)} />
    <Route path="/projects/:projectId/submissions/new" element={withSuspense(NewSubmission)} />
    <Route path="/projects/:projectId/submissions/:submissionId" element={withSuspense(SubmissionDetail)} />
    <Route path="/projects/:projectId/submissions/:submissionId/compare" element={withSuspense(SubmissionComparison)} />

    {/* Finance */}
    <Route path="/projects/:projectId/finance" element={withSuspense(ProjectFinancesDashboard)} />
    <Route path="/projects/:projectId/finances" element={withSuspense(ProjectFinancesDashboard)} />
    <Route path="/projects/:projectId/cfc" element={withSuspense(ProjectCFC)} />
    <Route path="/projects/:projectId/cfc/:cfcId" element={withSuspense(CfcDetail)} />

    {/* Materials */}
    <Route path="/projects/:projectId/materials" element={withSuspense(ProjectMaterialsSelections)} />
    <Route path="/projects/:projectId/materials/catalogue" element={withSuspense(ProjectMaterialsCatalogManager)} />
    <Route path="/projects/:projectId/materials/lots/:lotId" element={withSuspense(ProjectMaterialsLotChoices)} />

    {/* CRM */}
    <Route path="/projects/:projectId/crm/pipeline" element={withSuspense(ProjectCRMPipeline)} />
    <Route path="/projects/:projectId/crm/prospects" element={withSuspense(ProjectCRMProspects)} />
    <Route path="/projects/:projectId/crm/prospects/:prospectId" element={withSuspense(ProjectCRMProspectDetail)} />

    {/* SAV, Notary, Brokers */}
    <Route path="/projects/:projectId/sav" element={withSuspense(ProjectSAV)} />
    <Route path="/projects/:projectId/notary" element={withSuspense(ProjectNotary)} />
    <Route path="/projects/:projectId/brokers" element={withSuspense(ProjectBrokers)} />

    {/* Settings & Structure */}
    <Route path="/projects/:projectId/settings" element={withSuspense(ProjectSettingsComplete)} />
    <Route path="/projects/:projectId/structure" element={withSuspense(ProjectStructurePage)} />
    <Route path="/projects/:projectId/team" element={withSuspense(ProjectTeamPage)} />
    <Route path="/projects/:projectId/messages" element={withSuspense(ProjectMessages)} />
  </>
);
