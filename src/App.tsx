/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Realpro Suite – Plateforme SaaS de Gestion de Projets Immobiliers
 * © 2024-2025 Realpro SA. Tous droits réservés.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthGuard } from './components/AuthGuard';
import { ThemeProvider } from './contexts/ThemeContext';

import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { ProjectsList } from './pages/ProjectsList';
import { ProjectOverview } from './pages/ProjectOverview';
import { ProjectCockpit } from './pages/ProjectCockpit';
import { ProjectCockpitDashboard } from './pages/ProjectCockpitDashboard';
import { ProjectPlanning } from './pages/ProjectPlanning';
import ProjectSetupWizard from './pages/ProjectSetupWizard';
import { PromoterDashboard } from './pages/PromoterDashboard';
import { ChantierHome } from './pages/ChantierHome';

import { BrokerDashboard } from './pages/BrokerDashboard';
import { BrokerLots } from './pages/BrokerLots';
import { BrokerLotDetail } from './pages/BrokerLotDetail';
import { BrokerSalesContracts } from './pages/BrokerSalesContracts';
import { BrokerSalesContractDetail } from './pages/BrokerSalesContractDetail';
import { BrokerNewSalesContract } from './pages/BrokerNewSalesContract';

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
import { ProjectDocuments } from './pages/ProjectDocuments';
import { ProjectSubmissions } from './pages/ProjectSubmissions';
import { ProjectCFC } from './pages/ProjectCFC';
import { ProjectFinance } from './pages/ProjectFinance';
import { ProjectSAV } from './pages/ProjectSAV';
import { ProjectSettings } from './pages/ProjectSettings';

import SupplierShowrooms from './pages/SupplierShowrooms';
import SupplierShowroomForm from './pages/SupplierShowroomForm';
import SupplierTimeSlots from './pages/SupplierTimeSlots';
import SupplierAppointments from './pages/SupplierAppointments';

import { BillingPage } from './pages/BillingPage';
import { ReportingOverview } from './pages/ReportingOverview';
import { SubmissionComparison } from './pages/SubmissionComparison';
import { TasksManager } from './pages/TasksManager';
import { TemplatesManager } from './pages/TemplatesManager';
import AdminOrganizationsPage from './pages/AdminOrganizations';

import CGU from './pages/legal/CGU';
import CGV from './pages/legal/CGV';
import MentionsLegales from './pages/legal/MentionsLegales';
import Privacy from './pages/legal/Privacy';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <AppShell>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/projects/:projectId" element={<ProjectCockpit />} />
                    <Route path="/projects/:projectId/overview" element={<ProjectOverview />} />
                    <Route path="/projects/:projectId/dashboard" element={<ProjectCockpitDashboard />} />
                    <Route path="/projects/:projectId/planning" element={<ProjectPlanning />} />
                    <Route path="/projects/:projectId/setup" element={<ProjectSetupWizard />} />
                    <Route path="/projects/:projectId/lots" element={<ProjectLots />} />
                    <Route path="/projects/:projectId/lots/:lotId" element={<ProjectLotDetail />} />
                    <Route path="/projects/:projectId/buyers" element={<ProjectBuyers />} />
                    <Route path="/projects/:projectId/documents" element={<ProjectDocuments />} />
                    <Route path="/projects/:projectId/submissions" element={<ProjectSubmissions />} />
                    <Route path="/projects/:projectId/cfc" element={<ProjectCFC />} />
                    <Route path="/projects/:projectId/finance" element={<ProjectFinance />} />
                    <Route path="/projects/:projectId/sav" element={<ProjectSAV />} />
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

                    <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />

                    <Route path="/chantier" element={<ChantierHome />} />

                    <Route path="/legal/cgu" element={<CGU />} />
                    <Route path="/legal/cgv" element={<CGV />} />
                    <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/legal/privacy" element={<Privacy />} />
                  </Routes>
                </AppShell>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
