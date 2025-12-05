import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface LotCRMCardProps {
  lot: any;
  projectId: string;
}

export function LotCRMCard({ lot, projectId }: LotCRMCardProps) {
  const [crmData, setCrmData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lot.id) return;

    async function fetchCRMData() {
      try {
        const { data: buyer } = await supabase
          .from('buyers')
          .select('*, reservations(*)')
          .eq('lot_id', lot.id)
          .maybeSingle();

        if (buyer) {
          setCrmData({
            type: 'buyer',
            buyer,
            reservation: buyer.reservations?.[0]
          });
        } else {
          const { data: reservation } = await supabase
            .from('reservations')
            .select('*, prospects(*)')
            .eq('lot_id', lot.id)
            .eq('status', 'CONFIRMED')
            .maybeSingle();

          if (reservation) {
            setCrmData({
              type: 'reservation',
              reservation,
              prospect: reservation.prospects?.[0]
            });
          } else {
            const { data: prospects } = await supabase
              .from('prospects')
              .select('*')
              .eq('project_id', projectId)
              .contains('interested_lots', [lot.id])
              .limit(5);

            setCrmData({
              type: 'prospects',
              prospects: prospects || []
            });
          }
        }
      } catch (err) {
        console.error('Error fetching CRM data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCRMData();
  }, [lot.id, projectId]);

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

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                CRM & Commercial
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Statut du lot
              </p>
            </div>
          </div>
          <Link
            to={`/projects/${projectId}/crm/prospects`}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Voir pipeline →
          </Link>
        </div>

        {crmData?.type === 'buyer' && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="success">Vendu</Badge>
                <Link
                  to={`/projects/${projectId}/crm/buyers/${crmData.buyer.id}`}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  Voir dossier <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {crmData.buyer.first_name} {crmData.buyer.last_name}
                </p>
                {crmData.buyer.email && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-4 h-4" />
                    {crmData.buyer.email}
                  </div>
                )}
                {crmData.buyer.phone && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Phone className="w-4 h-4" />
                    {crmData.buyer.phone}
                  </div>
                )}
              </div>
            </div>
            {crmData.reservation && (
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Réservé le {new Date(crmData.reservation.reserved_at).toLocaleDateString('fr-CH')}
                </div>
              </div>
            )}
          </div>
        )}

        {crmData?.type === 'reservation' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="warning">Réservé</Badge>
                {crmData.prospect && (
                  <Link
                    to={`/projects/${projectId}/crm/prospects/${crmData.prospect.id}`}
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    Voir prospect <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {crmData.reservation.buyer_first_name} {crmData.reservation.buyer_last_name}
                </p>
                {crmData.reservation.buyer_email && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-4 h-4" />
                    {crmData.reservation.buyer_email}
                  </div>
                )}
                {crmData.reservation.expires_at && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                    <Calendar className="w-3 h-3" />
                    Expire le {new Date(crmData.reservation.expires_at).toLocaleDateString('fr-CH')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {crmData?.type === 'prospects' && (
          <div className="space-y-4">
            {crmData.prospects.length > 0 ? (
              <>
                <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-4">
                  <Badge variant="default" className="mb-3">Disponible</Badge>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    {crmData.prospects.length} prospect{crmData.prospects.length > 1 ? 's' : ''} intéressé{crmData.prospects.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {crmData.prospects.slice(0, 3).map((prospect: any) => (
                      <Link
                        key={prospect.id}
                        to={`/projects/${projectId}/crm/prospects/${prospect.id}`}
                        className="block p-2 rounded bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {prospect.first_name} {prospect.last_name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                          {prospect.email}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
                <Link to={`/projects/${projectId}/crm/prospects`}>
                  <Button variant="outline" className="w-full">
                    Voir tous les prospects
                  </Button>
                </Link>
              </>
            ) : (
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 text-center">
                <Badge variant="default" className="mb-3">Disponible</Badge>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  Aucun prospect intéressé pour le moment
                </p>
                <Link to={`/projects/${projectId}/crm/prospects`}>
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter un prospect
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
