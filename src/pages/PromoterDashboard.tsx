import { Plus } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { usePromoterDashboard } from '../hooks/usePromoterDashboard';
import { useOrganization } from '../hooks/useOrganization';
import { WelcomeDashboard } from './WelcomeDashboard';
import { Link } from 'react-router-dom';
import {
  OverviewCards,
  ProjectProgressCard,
  SalesOverviewCard,
  IssuesOverviewCard,
} from '../components/promoter';

export function PromoterDashboard() {
  const { stats, loading, error, refetch } = usePromoterDashboard();
  const { projects, loading: orgLoading } = useOrganization();

  if (loading || orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'a pas encore de projets, afficher l'écran d'accueil
  if (!projects || projects.length === 0) {
    return <WelcomeDashboard />;
  }

  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!stats) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  // Transform data for new components
  const overviewStats = {
    activeProjects: stats.totalProjects || 0,
    totalLots: stats.projects?.reduce((sum, p) => sum + p.sales.totalLots, 0) || 0,
    soldLots: stats.projects?.reduce((sum, p) => sum + p.sales.soldLots, 0) || 0,
    salesRate: stats.projects && stats.projects.length > 0
      ? Math.round(
          stats.projects.reduce((sum, p) => sum + p.sales.salesPercentage, 0) /
            stats.projects.length
        )
      : 0,
    pendingDocuments: 0,
    pendingModifications: 0,
    totalRevenue: stats.totalRevenuePotential || 0,
    alerts: stats.totalSavTickets?.open || 0,
  };

  const projectsData = (stats.projects || []).map((project) => ({
    id: project.id,
    name: project.name,
    location: project.city || 'Non défini',
    progress: project.construction?.progress || 0,
    status: project.status,
    lotsTotal: project.sales?.totalLots || 0,
    lotsSold: project.sales?.soldLots || 0,
  }));

  const salesData = (stats.projects || []).map((project) => ({
    projectId: project.id,
    projectName: project.name,
    lotsTotal: project.sales?.totalLots || 0,
    lotsSold: project.sales?.soldLots || 0,
    lotsReserved: project.sales?.reservedLots || 0,
    percentage: project.sales?.salesPercentage || 0,
    revenue: project.sales?.revenueRealized || 0,
    trend: (project.sales?.soldLots || 0) > (project.sales?.reservedLots || 0) ? 'up' : 'stable' as 'up' | 'down' | 'stable',
  }));

  const issuesData = (stats.projects || [])
    .filter((project) => (project.sav?.open || 0) > 0)
    .map((project) => ({
      id: project.id,
      type: 'alert' as 'delay' | 'alert' | 'warning',
      title: 'Tickets SAV ouverts',
      description: `${project.sav?.open || 0} ticket${(project.sav?.open || 0) > 1 ? 's' : ''} nécessitent votre attention`,
      projectId: project.id,
      projectName: project.name,
      severity: (project.sav?.open || 0) > 5 ? 'high' : (project.sav?.open || 0) > 2 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Espace Promoteur
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Vue d'ensemble de vos projets immobiliers
          </p>
        </div>
        <Link
          to="/projects/wizard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Link>
      </div>

      {/* Global KPIs */}
      <OverviewCards stats={overviewStats} />

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProjectProgressCard projects={projectsData} />
        <SalesOverviewCard sales={salesData} />
        <IssuesOverviewCard issues={issuesData} />
      </div>
    </div>
  );
}
