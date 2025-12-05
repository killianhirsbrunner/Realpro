import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, FileText } from 'lucide-react';
import { useSupplierOffers } from '../hooks/useSupplierOffers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { SupplierOffersTable } from '../components/modifications/SupplierOffersTable';

export function ProjectModificationsOffers() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { offers, loading, error } = useSupplierOffers(projectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des offres</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/overview`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au projet
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Offres fournisseurs & Modifications
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {offers.length} offre{offers.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Button onClick={() => navigate(`/projects/${projectId}/modifications/offers/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle offre
          </Button>
        </div>
      </div>

      <SupplierOffersTable offers={offers} projectId={projectId || ''} />
    </div>
  );
}
