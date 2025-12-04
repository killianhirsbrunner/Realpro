/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RealPro – Plateforme SaaS de Gestion de Projets Immobiliers
 * © 2024-2025 Realpro SA. Tous droits réservés.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthGuard } from './components/AuthGuard';
import { ThemeProvider } from './contexts/ThemeContext';
import { OrganizationProvider } from './contexts/OrganizationContext';

import { Landing } from './pages/public/Landing';
import { Pricing } from './pages/public/Pricing';
import { Features } from './pages/public/Features';
import { Contact } from './pages/public/Contact';

import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Register } from './pages/auth/Register';
import { ChoosePlan } from './pages/auth/ChoosePlan';
import { Checkout } from './pages/auth/Checkout';
import { Success } from './pages/auth/Success';

import { DashboardGlobal } from './pages/DashboardGlobal';
import { Dashboard } from './pages/Dashboard';
import { ProjectsList } from './pages/ProjectsList';
import { ProjectOverview } from './pages/ProjectOverview';
import { ProjectCockpit } from './pages/ProjectCockpit';
import { ProjectCockpitDashboard } from './pages/ProjectCockpitDashboard';
import ProjectPlanningPage from './pages/ProjectPlanningPage';
import ProjectPlanningPhotos from './pages/ProjectPlanningPhotos';
import ProjectPlanningReports from './pages/ProjectPlanningReports';
import ProjectPlanningBuyersProgress from './pages/ProjectPlanningBuyersProgress';
import ProjectSetupWizard from './pages/ProjectSetupWizard';
import ProjectMaterialsPage from './pages/ProjectMaterialsPage';
import ProjectMaterialsCatalog from './pages/ProjectMaterialsCatalog';
import ProjectMaterialsSuppliers from './pages/ProjectMaterialsSuppliers';
import ProjectMaterialsSupplierAgenda from './pages/ProjectMaterialsSupplierAgenda';
import ProjectMaterialsSelections from './pages/ProjectMaterialsSelections';
import ProjectMaterialsCatalogManager from './pages/ProjectMaterialsCatalogManager';
import ProjectMaterialsLotChoices from './pages/ProjectMaterialsLotChoices';
import ProjectMaterialsAppointments from './pages/ProjectMaterialsAppointments';
import ProjectMessages from './pages/ProjectMessages';
import ProjectNotary from './pages/ProjectNotary';
import ProjectNotaryDetail from './pages/ProjectNotaryDetail';
import { PromoterDashboard } from './pages/PromoterDashboard';
import { ChantierHome } from './pages/ChantierHome';

import { BrokerDashboard } from './pages/BrokerDashboard';
import { BrokerLots } from './pages/BrokerLots';
import { BrokerLotDetail } from './pages/BrokerLotDetail';
import { BrokerSalesContracts } from './pages/BrokerSalesContracts';
import { BrokerSalesContractDetail } from './pages/BrokerSalesContractDetail';
import { BrokerNewSalesContract } from './pages/BrokerNewSalesContract';
import { ProjectBrokers } from './pages/ProjectBrokers';

import { BuyerMyLot } from './pages/buyer/BuyerMyLot';
import { BuyerMaterialChoices } from './pages/buyer/BuyerMaterialChoices';
import { BuyerAppointments } from './pages/buyer/BuyerAppointments';
import { BuyerProgress } from './pages/buyer/BuyerProgress';
import { BuyerDocuments } from './pages/buyer/BuyerDocuments';
import { BuyerMessages } from './pages/buyer/BuyerMessages';
import { BuyerPayments } from './pages/buyer/BuyerPayments';
import { BuyerChoices } from './pages/buyer/BuyerChoices';

import { ProjectLots } from './pages/ProjectLots';
import { ProjectLotDetail } from './pages/ProjectLotDetail';
import { ProjectBuyers } from './pages/ProjectBuyers';
import { BuyerDetail } from './pages/BuyerDetail';
import { ProjectDocuments } from './pages/ProjectDocuments';
import { DocumentViewer } from './pages/DocumentViewer';
import { ProjectSubmissions } from './pages/ProjectSubmissions';
import { NewSubmission } from './pages/NewSubmission';
import { SubmissionDetail } from './pages/SubmissionDetail';
import { SubmissionComparison } from './pages/SubmissionComparison';
import { ProjectCFC } from './pages/ProjectCFC';
import { CfcDetail } from './pages/CfcDetail';
import { ProjectFinance } from './pages/ProjectFinance';
import { BuyerFinance } from './pages/BuyerFinance';
import { ProjectSAV } from './pages/ProjectSAV';
import { ProjectSettings } from './pages/ProjectSettings';

import SupplierShowrooms from './pages/SupplierShowrooms';
import SupplierShowroomForm from './pages/SupplierShowroomForm';
import SupplierTimeSlots from './pages/SupplierTimeSlots';
import SupplierAppointments from './pages/SupplierAppointments';

import { BillingPage } from './pages/BillingPage';
import { ReportingOverview } from './pages/ReportingOverview';
import { TasksManager } from './pages/TasksManager';
import { TemplatesManager } from './pages/TemplatesManager';
import AdminOrganizationsPage from './pages/AdminOrganizations';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import { OrganizationSettings } from './pages/OrganizationSettings';

import { Settings } from './pages/Settings';
import { LocalizationSettings } from './pages/settings/LocalizationSettings';
import { BrandingSettings } from './pages/settings/BrandingSettings';
import { SecuritySettings } from './pages/settings/SecuritySettings';
import { SuppliersSettings } from './pages/settings/SuppliersSettings';

import { SelectOrganization } from './pages/SelectOrganization';
import { OrganizationOnboarding } from './pages/OrganizationOnboarding';
import { RealProAdminDashboard } from './pages/admin/RealProAdminDashboard';

import CGU from './pages/legal/CGU';
import CGV from './pages/legal/CGV';
import MentionsLegales from './pages/legal/MentionsLegales';
import Privacy from './pages/legal/Privacy';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/choose-plan" element={<ChoosePlan />} />
          <Route path="/auth/checkout" element={<Checkout />} />
          <Route path="/auth/success" element={<Success />} />
          <Route path="/auth/onboarding" element={<OrganizationOnboarding />} />
          <Route path="/auth/select-organization" element={<SelectOrganization />} />

          <Route path="/legal/cgu" element={<CGU />} />
          <Route path="/legal/cgv" element={<CGV />} />
          <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
          <Route path="/legal/privacy" element={<Privacy />} />

          <Route
            path="/*"
            element={
              <AuthGuard>
                <OrganizationProvider>
                  <AppShell>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardGlobal />} />
                    <Route path="/dashboard-old" element={<Dashboard />} />

                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/projects/:projectId" element={<ProjectCockpit />} />
                    <Route path="/projects/:projectId/overview" element={<ProjectOverview />} />
                    <Route path="/projects/:projectId/dashboard" element={<ProjectCockpitDashboard />} />
                    <Route path="/projects/:projectId/planning" element={<ProjectPlanningPage />} />
                    <Route path="/projects/:projectId/planning/photos" element={<ProjectPlanningPhotos />} />
                    <Route path="/projects/:projectId/planning/reports" element={<ProjectPlanningReports />} />
                    <Route path="/projects/:projectId/planning/buyers" element={<ProjectPlanningBuyersProgress />} />
                    <Route path="/projects/:projectId/materials" element={<ProjectMaterialsSelections />} />
                    <Route path="/projects/:projectId/materials/catalogue" element={<ProjectMaterialsCatalogManager />} />
                    <Route path="/projects/:projectId/materials/lots/:lotId" element={<ProjectMaterialsLotChoices />} />
                    <Route path="/projects/:projectId/materials/lots/:lotId/appointments" element={<ProjectMaterialsAppointments />} />
                    <Route path="/projects/:projectId/materials/catalog" element={<ProjectMaterialsCatalog />} />
                    <Route path="/projects/:projectId/materials/suppliers" element={<ProjectMaterialsSuppliers />} />
                    <Route path="/projects/:projectId/materials/suppliers/:supplierId" element={<ProjectMaterialsSupplierAgenda />} />
                    <Route path="/projects/:projectId/messages" element={<ProjectMessages />} />
                    <Route path="/projects/:projectId/setup" element={<ProjectSetupWizard />} />
                    <Route path="/projects/:projectId/lots" element={<ProjectLots />} />
                    <Route path="/projects/:projectId/lots/:lotId" element={<ProjectLotDetail />} />
                    <Route path="/projects/:projectId/buyers" element={<ProjectBuyers />} />
                    <Route path="/projects/:projectId/buyers/:buyerId" element={<BuyerDetail />} />
                    <Route path="/projects/:projectId/documents" element={<ProjectDocuments />} />
                    <Route path="/projects/:projectId/documents/:documentId" element={<DocumentViewer />} />
                    <Route path="/projects/:projectId/submissions" element={<ProjectSubmissions />} />
                    <Route path="/projects/:projectId/submissions/new" element={<NewSubmission />} />
                    <Route path="/projects/:projectId/submissions/:submissionId" element={<SubmissionDetail />} />
                    <Route path="/projects/:projectId/submissions/:submissionId/compare" element={<SubmissionComparison />} />
                    <Route path="/projects/:projectId/cfc" element={<ProjectCFC />} />
                    <Route path="/projects/:projectId/cfc/:cfcId" element={<CfcDetail />} />
                    <Route path="/projects/:projectId/finance" element={<ProjectFinance />} />
                    <Route path="/projects/:projectId/finance/buyers/:buyerId" element={<BuyerFinance />} />
                    <Route path="/projects/:projectId/sav" element={<ProjectSAV />} />
                    <Route path="/projects/:projectId/brokers" element={<ProjectBrokers />} />
                    <Route path="/projects/:projectId/notary" element={<ProjectNotary />} />
                    <Route path="/projects/:projectId/notary/:dossierId" element={<ProjectNotaryDetail />} />
                    <Route path="/projects/:projectId/settings" element={<ProjectSettings />} />

                    <Route path="/promoter" element={<PromoterDashboard />} />

                    <Route path="/broker" element={<BrokerDashboard />} />
                    <Route path="/broker/lots" element={<BrokerLots />} />
                    <Route path="/broker/lots/:lotId" element={<BrokerLotDetail />} />
                    <Route path="/broker/contracts" element={<BrokerSalesContracts />} />
                    <Route path="/broker/contracts/:contractId" element={<BrokerSalesContractDetail />} />
                    <Route path="/broker/contracts/new" element={<BrokerNewSalesContract />} />

                    <Route path="/buyer/my-lot" element={<BuyerMyLot />} />
                    <Route path="/buyer/materials" element={<BuyerMaterialChoices />} />
                    <Route path="/buyer/appointments" element={<BuyerAppointments />} />
                    <Route path="/buyer/progress" element={<BuyerProgress />} />
                    <Route path="/buyer/documents" element={<BuyerDocuments />} />
                    <Route path="/buyer/messages" element={<BuyerMessages />} />
                    <Route path="/buyer/payments" element={<BuyerPayments />} />
                    <Route path="/buyer/choices" element={<BuyerChoices />} />

                    <Route path="/supplier/showrooms" element={<SupplierShowrooms />} />
                    <Route path="/supplier/showrooms/new" element={<SupplierShowroomForm />} />
                    <Route path="/supplier/showrooms/:showroomId/edit" element={<SupplierShowroomForm />} />
                    <Route path="/supplier/showrooms/:showroomId/time-slots" element={<SupplierTimeSlots />} />
                    <Route path="/supplier/appointments" element={<SupplierAppointments />} />

                    <Route path="/billing" element={<BillingPage />} />
                    <Route path="/reporting" element={<ReportingOverview />} />
                    <Route path="/submissions" element={<SubmissionComparison />} />
                    <Route path="/tasks" element={<TasksManager />} />
                    <Route path="/templates" element={<TemplatesManager />} />

                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/localization" element={<LocalizationSettings />} />
                    <Route path="/settings/branding" element={<BrandingSettings />} />
                    <Route path="/settings/security" element={<SecuritySettings />} />
                    <Route path="/settings/suppliers" element={<SuppliersSettings />} />

                    <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
                    <Route path="/admin/super" element={<SuperAdminDashboard />} />
                    <Route path="/admin/realpro" element={<RealProAdminDashboard />} />

                    <Route path="/organization/settings" element={<OrganizationSettings />} />

                    <Route path="/chantier" element={<ChantierHome />} />
                  </Routes>
                </AppShell>
                </OrganizationProvider>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
