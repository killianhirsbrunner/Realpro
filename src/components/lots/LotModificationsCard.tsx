import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface LotModificationsCardProps {
  lot: any;
  projectId: string;
}

export function LotModificationsCard({ lot, projectId }: LotModificationsCardProps) {
  const [modificationsData, setModificationsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lot.id) return;

    async function fetchModificationsData() {
      try {
        const { data: buyer } = await supabase
          .from('buyers')
          .select('id')
          .eq('lot_id', lot.id)
          .maybeSingle();

        if (!buyer) {
          setModificationsData(null);
          setLoading(false);
          return;
        }

        const [choicesResult, requestsResult] = await Promise.all([
          supabase
            .from('buyer_choices')
            .select('*, material_options!inner(*, material_categories!inner(*))')
            .eq('buyer_id', buyer.id)
            .eq('lot_id', lot.id),
          supabase
            .from('buyer_change_requests')
            .select('*')
            .eq('buyer_id', buyer.id)
            .eq('lot_id', lot.id)
        ]);

        const choices = choicesResult.data || [];
        const requests = requestsResult.data || [];

        const choicesByCategory = choices.reduce((acc: any, choice: any) => {
          const category = choice.material_options?.material_categories?.name || 'Autre';
          if (!acc[category]) acc[category] = [];
          acc[category].push(choice);
          return acc;
        }, {});

        const requestsByStatus = {
          pending: requests.filter((r: any) => r.status === 'PENDING').length,
          underReview: requests.filter((r: any) => r.status === 'UNDER_REVIEW').length,
          approved: requests.filter((r: any) => r.status === 'APPROVED').length,
          rejected: requests.filter((r: any) => r.status === 'REJECTED').length,
          completed: requests.filter((r: any) => r.status === 'COMPLETED').length
        };

        const totalEstimatedCost = requests
          .filter((r: any) => r.status === 'APPROVED' || r.status === 'COMPLETED')
          .reduce((sum: number, r: any) => sum + (r.estimated_cost || 0), 0);

        setModificationsData({
          hasChoices: choices.length > 0,
          choicesCount: choices.length,
          choicesByCategory,
          requestsCount: requests.length,
          requestsByStatus,
          totalEstimatedCost,
          recentRequests: requests.slice(0, 3)
        });
      } catch (err) {
        console.error('Error fetching modifications data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchModificationsData();
  }, [lot.id]);

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!modificationsData) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Choix & Modifications
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Aucune donnée disponible. Le lot n'est pas encore vendu.
          </p>
        </div>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">En attente</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="default">En revue</Badge>;
      case 'APPROVED':
        return <Badge variant="success">Approuvée</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Refusée</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Complétée</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Choix & Modifications
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Personnalisation du lot
              </p>
            </div>
          </div>
          <Link
            to={`/projects/${projectId}/materials/lots/${lot.id}`}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Gérer →
          </Link>
        </div>

        <div className="space-y-4">
          {modificationsData.hasChoices && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
                Choix matériaux
              </h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                {modificationsData.choicesCount} choix effectué{modificationsData.choicesCount > 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {Object.entries(modificationsData.choicesByCategory).slice(0, 4).map(([category, choices]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700 dark:text-neutral-300">{category}</span>
                    <span className="text-neutral-500 dark:text-neutral-500">
                      {choices.length} choix
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {modificationsData.requestsCount > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Demandes de modification
              </h4>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {modificationsData.requestsByStatus.pending > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {modificationsData.requestsByStatus.pending} en attente
                    </span>
                  </div>
                )}
                {modificationsData.requestsByStatus.approved > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {modificationsData.requestsByStatus.approved} approuvées
                    </span>
                  </div>
                )}
                {modificationsData.requestsByStatus.rejected > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {modificationsData.requestsByStatus.rejected} refusées
                    </span>
                  </div>
                )}
              </div>

              {modificationsData.totalEstimatedCost > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Coût additionnel</span>
                  </div>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    CHF {modificationsData.totalEstimatedCost.toLocaleString('fr-CH')}
                  </span>
                </div>
              )}

              {modificationsData.recentRequests.length > 0 && (
                <div className="mt-3 space-y-2">
                  {modificationsData.recentRequests.map((request: any) => (
                    <div
                      key={request.id}
                      className="p-2 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {request.title}
                          </p>
                          {request.estimated_cost && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                              CHF {request.estimated_cost.toLocaleString('fr-CH')}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!modificationsData.hasChoices && modificationsData.requestsCount === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Aucune personnalisation pour le moment
              </p>
              <Link to={`/projects/${projectId}/materials/lots/${lot.id}`}>
                <Button variant="outline" size="sm">
                  <Palette className="w-4 h-4 mr-2" />
                  Gérer les choix
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
