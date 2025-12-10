// Hooks - Barrel Export
// Centralized exports for all custom React hooks

// User & Auth
export { useCurrentUser } from './useCurrentUser';
export { useUsers } from './useUsers';
export { useUserManagement } from './useUserManagement';
export { useAdmin } from './useAdmin';

// Organization
export { useOrganization } from './useOrganization';
export { useOrganizationData } from './useOrganizationData';
export { useOrganizationProjects } from './useOrganizationProjects';
export { useQuotas } from './useQuotas';

// Projects
export { useProjects, useProject } from './useProjects';
export { useProjectDashboard } from './useProjectDashboard';
export { useProjectCreation } from './useProjectCreation';
export { useProjectStructure } from './useProjectStructure';
export { useProjectHealth } from './useProjectHealth';
export { useProjectActivity } from './useProjectActivity';
export { useProjectTimeline } from './useProjectTimeline';
export { useProjectTeam } from './useProjectTeam';
export { useProjectMilestones } from './useProjectMilestones';
export { useProjectFinanceSummary } from './useProjectFinanceSummary';
export { useProjectLotsSummary } from './useProjectLotsSummary';
export { useProjectModificationsSummary } from './useProjectModificationsSummary';
export { useProjectSubmissionsSummary } from './useProjectSubmissionsSummary';
export { useProjectCRMSummary } from './useProjectCRMSummary';
export { useProjectBrokers } from './useProjectBrokers';
export { useProjectExports } from './useProjectExports';

// Dashboard
export { useDashboard } from './useDashboard';
export { useEnhancedDashboard } from './useEnhancedDashboard';
export { useGlobalDashboard } from './useGlobalDashboard';
export { usePromoterDashboard } from './usePromoterDashboard';

// Lots & Properties
export { useLots } from './useLots';
export { useLotDetails } from './useLotDetails';
export { useReservations } from './useReservations';

// Buyers
export { useBuyers } from './useBuyers';
export { useBuyerDetails } from './useBuyerDetails';
export { useBuyerProgress } from './useBuyerProgress';
export { useBuyerInvoices } from './useBuyerInvoices';
export { useBuyerDossiers } from './useBuyerDossiers';

// Finance
export { useFinance } from './useFinance';
export { useFinanceDashboard } from './useFinanceDashboard';
export { useFinancialScenarios } from './useFinancialScenarios';
export { useCFC } from './useCFC';
export { useCfcTable } from './useCfcTable';
export { useContracts } from './useContracts';
export { useContractProgress } from './useContractProgress';
export { useBilling } from './useBilling';

// CRM & Sales
export { useCRMPipeline } from './useCRMPipeline';
export { useCRMActivities } from './useCRMActivities';
export { useCRMSegments } from './useCRMSegments';
export { useProspects } from './useProspects';
export { useProspectDetail } from './useProspectDetail';
export { useContactsCRM } from './useContactsCRM';
export { useCompanies } from './useCompanies';
export { useCampaigns } from './useCampaigns';
export { useEmailMarketing } from './useEmailMarketing';
export { useLeadScoring } from './useLeadScoring';
export { useBrokers } from './useBrokers';

// Materials & Choices
export { useMaterialCategories } from './useMaterialCategories';
export { useMaterialOptions } from './useMaterialOptions';
export { useMaterialChoices } from './useMaterialChoices';
export { useMaterialSelections } from './useMaterialSelections';
export { useSupplierAppointments } from './useSupplierAppointments';
export { useSupplierOffers } from './useSupplierOffers';

// Planning & Construction
export { usePlanning } from './usePlanning';
export { useConstructionPhotos } from './useConstructionPhotos';
export { useSiteDiary } from './useSiteDiary';
export { useSiteDiaryEntries } from './useSiteDiaryEntries';
export { useHandover } from './useHandover';

// Communication
export { useMessages } from './useMessages';
export { useThreads } from './useThreads';
export { useNotifications } from './useNotifications';
export { useChat } from './useChat';
export { useNotaryMessages } from './useNotaryMessages';
export { useSAVMessages } from './useSAVMessages';
export { useAvenants } from './useAvenants';

// Admin & Settings
export { useSettings } from './useSettings';
export { usePermissions } from './usePermissions';
export { useRoleGuard } from './useRoleGuard';
export { useFeatureFlags } from './useFeatureFlags';
export { useBranding } from './useBranding';
export { useNotaryDossiers } from './useNotaryDossiers';
export { useNotaryActs } from './useNotaryActs';
export { useWorkflow } from './useWorkflow';

// After-Sales
export { useSAV } from './useSAV';
export { useAfterSales } from './useAfterSales';
export { useAnnotations } from './useAnnotations';

// Reporting
export { useReporting } from './useReporting';
export { usePdfExports } from './usePdfExports';

// Utilities
export { useGlobalSearch } from './useGlobalSearch';
export { useRealtime } from './useRealtime';
export { useOfflineQueue } from './useOfflineQueue';
