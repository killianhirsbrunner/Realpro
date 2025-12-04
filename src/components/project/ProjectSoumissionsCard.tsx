import { Hammer, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDateCH, formatCHF } from '../../lib/utils/format';

interface Soumission {
  id: string;
  title: string;
  cfc_code?: string;
  status: string;
  deadline?: string | null;
  offers_count: number;
  estimated_amount?: number;
}

interface ProjectSoumissionsCardProps {
  projectId: string;
  soumissions: Soumission[];
  stats?: {
    published: number;
    adjudicated: number;
    total_amount?: number;
  };
}

export function ProjectSoumissionsCard({ projectId, soumissions, stats }: ProjectSoumissionsCardProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; label: string; icon: React.ElementType }> = {
      DRAFT: { variant: 'default', label: 'Brouillon', icon: Clock },
      PUBLISHED: { variant: 'info', label: 'Publiée', icon: Clock },
      ADJUDICATED: { variant: 'success', label: 'Adjugée', icon: CheckCircle2 },
      CANCELLED: { variant: 'danger', label: 'Annulée', icon: AlertCircle },
    };
    return statusMap[status] || statusMap.DRAFT;
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hammer className="h-5 w-5 text-gray-600" />
            <Card.Title>Soumissions & Adjudications</Card.Title>
          </div>
          {stats && (
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">{stats.published} actives</Badge>
              <Badge variant="success" size="sm">{stats.adjudicated} adjugées</Badge>
            </div>
          )}
        </div>
      </Card.Header>

      <Card.Content className="space-y-4">
        {soumissions.length === 0 ? (
          <div className="text-center py-8">
            <Hammer className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">Aucune soumission en cours</p>
            <Link to={`/projects/${projectId}/submissions/new`}>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une soumission
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {soumissions.slice(0, 5).map((soumission) => {
                const statusInfo = getStatusBadge(soumission.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Link
                    key={soumission.id}
                    to={`/projects/${projectId}/submissions/${soumission.id}`}
                  >
                    <div className="group p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {soumission.title}
                          </h4>
                          {soumission.cfc_code && (
                            <p className="text-xs text-gray-500 mt-1">
                              CFC {soumission.cfc_code}
                            </p>
                          )}
                        </div>
                        <Badge variant={statusInfo.variant} size="sm" className="ml-2 gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {soumission.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Échéance: {formatDateCH(soumission.deadline)}
                          </span>
                        )}
                        <span>{soumission.offers_count} offre{soumission.offers_count > 1 ? 's' : ''}</span>
                        {soumission.estimated_amount && (
                          <span className="font-medium text-gray-700">
                            {formatCHF(soumission.estimated_amount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <Link to={`/projects/${projectId}/submissions`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Voir toutes les soumissions
                </Button>
              </Link>
              <Link to={`/projects/${projectId}/submissions/new`}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
