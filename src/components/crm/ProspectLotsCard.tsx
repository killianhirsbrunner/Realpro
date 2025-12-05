import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, ArrowRight, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProspectLotsCardProps {
  prospect: any;
  projectId: string;
}

export function ProspectLotsCard({ prospect, projectId }: ProspectLotsCardProps) {
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prospect.interested_lots || prospect.interested_lots.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchLots() {
      try {
        const { data } = await supabase
          .from('lots')
          .select('id, code, type, rooms_count, surface_total, price_total, status, floor_level, building_id')
          .in('id', prospect.interested_lots)
          .eq('project_id', projectId);

        setLots(data || []);
      } catch (err) {
        console.error('Error fetching interested lots:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLots();
  }, [prospect.interested_lots, projectId]);

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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      AVAILABLE: 'success',
      RESERVED: 'warning',
      SOLD: 'danger',
      BLOCKED: 'default',
    };
    const labels: Record<string, string> = {
      AVAILABLE: 'Libre',
      RESERVED: 'Réservé',
      SOLD: 'Vendu',
      BLOCKED: 'Bloqué',
    };
    return { variant: variants[status] || 'default', label: labels[status] || status };
  };

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Home className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Lots d'intérêt
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {lots.length} lot{lots.length !== 1 ? 's' : ''} sélectionné{lots.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link
            to={`/projects/${projectId}/lots`}
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            Voir tous les lots <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {lots.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 text-center">
            <Home className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Aucun lot sélectionné
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-4">
              Ajoutez les lots qui intéressent ce prospect
            </p>
            <Link to={`/projects/${projectId}/lots`}>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Sélectionner des lots
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lots.map((lot) => {
              const statusBadge = getStatusBadge(lot.status);
              return (
                <Link
                  key={lot.id}
                  to={`/projects/${projectId}/lots/${lot.id}`}
                  className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          Lot {lot.code}
                        </h4>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {lot.type} • {lot.rooms_count} pièces • {lot.surface_total} m²
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        CHF {lot.price_total?.toLocaleString('fr-CH')}
                      </p>
                      {lot.floor_level !== null && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          Étage {lot.floor_level}
                        </p>
                      )}
                    </div>
                  </div>
                  {lot.building_id && (
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500">
                      <MapPin className="w-3 h-3" />
                      Bâtiment {lot.building_id}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
