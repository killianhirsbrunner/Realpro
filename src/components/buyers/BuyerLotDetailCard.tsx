import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, MapPin, Ruler, DollarSign, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface BuyerLotDetailCardProps {
  buyer: any;
  projectId: string;
}

export function BuyerLotDetailCard({ buyer, projectId }: BuyerLotDetailCardProps) {
  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyer.lot_id) {
      setLoading(false);
      return;
    }

    async function fetchLot() {
      try {
        const { data } = await supabase
          .from('lots')
          .select('*')
          .eq('id', buyer.lot_id)
          .maybeSingle();

        setLot(data);
      } catch (err) {
        console.error('Error fetching lot details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLot();
  }, [buyer.lot_id]);

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

  if (!lot) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Lot acheté
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Aucun lot associé
          </p>
        </div>
      </Card>
    );
  }

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
      AVAILABLE: { label: 'Libre', variant: 'success' },
      RESERVED: { label: 'Réservé', variant: 'warning' },
      SOLD: { label: 'Vendu', variant: 'danger' },
      DELIVERED: { label: 'Livré', variant: 'default' },
      BLOCKED: { label: 'Bloqué', variant: 'default' },
    };
    return statusMap[lot.status] || { label: lot.status, variant: 'default' as const };
  };

  const statusBadge = getStatusBadge();

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Lot acheté
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Détails du bien immobilier
              </p>
            </div>
          </div>
          <Link
            to={`/projects/${projectId}/lots/${lot.id}`}
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            Voir détail <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Lot {lot.code}
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {lot.type}
              </p>
            </div>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">Pièces</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {lot.rooms_count} pièces
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">Surface</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {lot.surface_total} m²
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">Étage</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {lot.floor_level !== null ? `Étage ${lot.floor_level}` : 'Non spécifié'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">Prix</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  CHF {lot.price_total?.toLocaleString('fr-CH')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {lot.description && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {lot.description}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link to={`/projects/${projectId}/lots/${lot.id}`} className="flex-1">
            <button className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
              Voir la fiche du lot
            </button>
          </Link>
          <Link to={`/projects/${projectId}/materials/lots/${lot.id}/choices`} className="flex-1">
            <button className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
              Choix matériaux
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
