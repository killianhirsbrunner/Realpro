import { Plus } from 'lucide-react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { usePromoterDashboard } from '../hooks/usePromoterDashboard';
import { Link } from 'react-router-dom';
import {
  OverviewCards,
  ProjectProgressCard,
  SalesOverviewCard,
  IssuesOverviewCard,
} from '../components/promoter';

export function PromoterDashboard() {
  const { stats, loading, error, refetch } = usePromoterDashboard();

  if (loading) return <LoadingState message="Chargement du tableau de bord..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!stats) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  // Transform data for new components
  const overviewStats = {
    activeProjects: stats.totalProjects,
    totalLots: stats.projects.reduce((sum, p) => sum + p.sales.totalLots, 0),
    soldLots: stats.projects.reduce((sum, p) => sum + p.sales.soldLots, 0),
    salesRate: stats.projects.length > 0
      ? Math.round(
          stats.projects.reduce((sum, p) => sum + p.sales.salesPercentage, 0) /
            stats.projects.length
        )
      : 0,
    pendingDocuments: 0,
    pendingModifications: 0,
    totalRevenue: stats.totalRevenuePotential,
    alerts: stats.totalSavTickets.open,
  };

  const projectsData = stats.projects.map((project) => ({
    id: project.id,
    name: project.name,
    location: project.city || 'Non défini',
    progress: project.construction.progress,
    status: project.status,
    lotsTotal: project.sales.totalLots,
    lotsSold: project.sales.soldLots,
  }));

  const salesData = stats.projects.map((project) => ({
    projectId: project.id,
    projectName: project.name,
    lotsTotal: project.sales.totalLots,
    lotsSold: project.sales.soldLots,
    lotsReserved: project.sales.reservedLots,
    percentage: project.sales.salesPercentage,
    revenue: project.sales.revenueRealized,
    trend: project.sales.soldLots > project.sales.reservedLots ? 'up' : 'stable' as 'up' | 'down' | 'stable',
  }));

  const issuesData = stats.projects
    .filter((project) => project.sav.open > 0)
    .map((project) => ({
      id: project.id,
      type: 'alert' as 'delay' | 'alert' | 'warning',
      title: 'Tickets SAV ouverts',
      description: `${project.sav.open} ticket${project.sav.open > 1 ? 's' : ''} nécessitent votre attention`,
      projectId: project.id,
      projectName: project.name,
      severity: project.sav.open > 5 ? 'high' : project.sav.open > 2 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
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
