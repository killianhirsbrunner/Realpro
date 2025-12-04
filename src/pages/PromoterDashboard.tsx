import { Home, Hammer, AlertCircle, DollarSign } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { formatCHF, formatPercent } from '../lib/utils/format';
import { usePromoterDashboard } from '../hooks/usePromoterDashboard';
import { Link } from 'react-router-dom';

export function PromoterDashboard() {
  const { stats, loading, error, refetch } = usePromoterDashboard();

  if (loading) return <LoadingState message="Chargement du tableau de bord..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!stats) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord promoteur
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de vos projets immobiliers
        </p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Projets"
          value={stats.totalProjects}
          icon={Home}
          variant="default"
        />
        <StatCard
          label="Revenus potentiels"
          value={formatCHF(stats.totalRevenuePotential / 100)}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          label="Factures en retard"
          value={formatCHF(stats.totalInvoices.overdue / 100)}
          icon={AlertCircle}
          variant={stats.totalInvoices.overdue > 0 ? 'warning' : 'success'}
        />
        <StatCard
          label="Tickets SAV ouverts"
          value={stats.totalSavTickets.open}
          icon={Hammer}
          variant={stats.totalSavTickets.open > 5 ? 'warning' : 'default'}
        />
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Vos projets</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.projects.map(project => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <Card.Header>
                  <div className="flex items-start justify-between">
                    <div>
                      <Card.Title>{project.name}</Card.Title>
                      <Card.Description>
                        {project.city} • {project.sales.totalLots} lots
                      </Card.Description>
                    </div>
                    <Badge variant="info">{project.status}</Badge>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">Commercialisation</span>
                        <span className="text-gray-500">
                          {formatPercent(project.sales.salesPercentage)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.sales.salesPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{project.sales.availableLots} disponibles</span>
                        <span>{project.sales.reservedLots} réservés</span>
                        <span>{project.sales.soldLots} vendus</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">CA Réalisé</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCHF(project.sales.revenueRealized / 100)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Budget CFC</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCHF(project.finance.budget / 100)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Avancement: </span>
                        <span className="font-medium">{formatPercent(project.construction.progress)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">SAV: </span>
                        <span className="font-medium">{project.sav.open} ouverts</span>
                      </div>
                    </div>

                    {project.sav.open > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700">
                          {project.sav.open} ticket{project.sav.open > 1 ? 's' : ''} SAV ouvert{project.sav.open > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Link>
          ))}
        </div>

        {stats.projects.length === 0 && (
          <Card>
            <Card.Content>
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun projet
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Commencez par créer votre premier projet immobilier
                </p>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                  Créer un projet
                </button>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

    </div>
  );
}
