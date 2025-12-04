import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, User, Mail, Phone, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SidePanel } from '../components/ui/SidePanel';
import { StatsGrid } from '../components/ui/StatsGrid';
import { KanbanBoard } from '../components/ui/KanbanBoard';
import { Badge } from '../components/ui/Badge';
import { useBuyers } from '../hooks/useBuyers';

export default function ProjectBuyersNew() {
  const { projectId } = useParams();
  const { buyers, loading } = useBuyers(projectId);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleCardClick = (buyer: any) => {
    setSelectedBuyer(buyer);
    setIsPanelOpen(true);
  };

  const prospectBuyers = buyers.filter((b: any) => b.status === 'PROSPECT');
  const reservedBuyers = buyers.filter((b: any) => b.status === 'RESERVED');
  const sellingBuyers = buyers.filter((b: any) => b.status === 'SELLING');
  const signedBuyers = buyers.filter((b: any) => b.status === 'SIGNED');

  const stats = [
    {
      label: 'Prospects',
      value: prospectBuyers.length,
      icon: User,
      color: 'neutral' as const,
    },
    {
      label: 'Réservations',
      value: reservedBuyers.length,
      icon: Calendar,
      color: 'warning' as const,
    },
    {
      label: 'Ventes en cours',
      value: sellingBuyers.length,
      icon: TrendingUp,
      color: 'primary' as const,
    },
    {
      label: 'Actes signés',
      value: signedBuyers.length,
      icon: FileText,
      color: 'success' as const,
    },
  ];

  const columns = [
    {
      id: 'PROSPECT',
      title: 'Prospects',
      items: prospectBuyers,
      color: 'neutral',
    },
    {
      id: 'RESERVED',
      title: 'Réservés',
      items: reservedBuyers,
      color: 'warning',
    },
    {
      id: 'SELLING',
      title: 'Vente en cours',
      items: sellingBuyers,
      color: 'primary',
    },
    {
      id: 'SIGNED',
      title: 'Acte signé',
      items: signedBuyers,
      color: 'success',
    },
  ];

  const renderBuyerCard = (buyer: any) => (
    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            {buyer.first_name} {buyer.last_name}
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Lot {buyer.lot_number || '-'}
          </p>
        </div>
        <Badge variant="primary" size="sm">
          {buyer.progress || 0}%
        </Badge>
      </div>

      <div className="space-y-1.5 text-xs">
        {buyer.email && (
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Mail className="w-3 h-3" />
            <span className="truncate">{buyer.email}</span>
          </div>
        )}
        {buyer.phone && (
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Phone className="w-3 h-3" />
            <span>{buyer.phone}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-400">Prix</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            CHF {buyer.price?.toLocaleString('fr-CH') || '0'}
          </span>
        </div>
      </div>

      {buyer.next_action && (
        <div className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded">
          {buyer.next_action}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              CRM Acheteurs
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Suivez vos prospects et acheteurs en temps réel
            </p>
          </div>

          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un acheteur
          </Button>
        </div>

        <StatsGrid stats={stats} columns={4} />

        <KanbanBoard
          columns={columns}
          renderCard={renderBuyerCard}
          onCardClick={handleCardClick}
        />
      </div>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={selectedBuyer ? `${selectedBuyer.first_name} ${selectedBuyer.last_name}` : 'Détail acheteur'}
        width="md"
      >
        {selectedBuyer && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedBuyer.first_name} {selectedBuyer.last_name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedBuyer.status === 'PROSPECT' && 'Prospect'}
                  {selectedBuyer.status === 'RESERVED' && 'Réservé'}
                  {selectedBuyer.status === 'SELLING' && 'Vente en cours'}
                  {selectedBuyer.status === 'SIGNED' && 'Acte signé'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Email</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedBuyer.email || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Téléphone</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedBuyer.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Lot</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedBuyer.lot_number || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Prix</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    CHF {selectedBuyer.price?.toLocaleString('fr-CH') || '0'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 block">
                  Avancement du dossier
                </label>
                <div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary-600 dark:bg-primary-400 transition-all"
                    style={{ width: `${selectedBuyer.progress || 0}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
                  {selectedBuyer.progress || 0}% complété
                </p>
              </div>

              {selectedBuyer.next_action && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Prochaine action
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {selectedBuyer.next_action}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6">
              <Button variant="primary" className="flex-1">
                Modifier
              </Button>
              <Button variant="secondary" className="flex-1">
                Documents
              </Button>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
