import { useParams, Link } from 'react-router-dom';
import { FileSignature, Plus, Calendar, DollarSign, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useAvenants } from '../hooks/useAvenants';
import { formatDate } from '../lib/utils/format';

export function ProjectAvenants() {
  const { projectId } = useParams<{ projectId: string }>();
  const { avenants, loading, error } = useAvenants(projectId);

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
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des avenants</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
            <FileSignature className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Avenants</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {avenants.length} avenant{avenants.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/projects/${projectId}/modifications/offers`}>
            <Plus className="h-4 w-4 mr-2" />
            Voir les offres fournisseurs
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total avenants</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{avenants.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">En attente</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {avenants.filter((a) => a.status === 'pending_signature').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Signés</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {avenants.filter((a) => a.status === 'signed').length}
          </p>
        </Card>
      </div>

      {avenants.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="Aucun avenant"
          description="Les avenants seront générés automatiquement lorsque les offres fournisseurs seront validées."
        />
      ) : (
        <div className="grid gap-4">
          {avenants.map((avenant) => (
            <Card key={avenant.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {avenant.title}
                    </h3>
                    <AvenantStatusBadge status={avenant.status} />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Référence: {avenant.reference}
                  </p>
                  {avenant.description && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-2">
                      {avenant.description}
                    </p>
                  )}
                </div>
                <AvenantTypeBadge type={avenant.type} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Montant</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      CHF {avenant.total_with_vat.toLocaleString('fr-CH', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Date</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatDate(avenant.generated_at || avenant.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileSignature className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Type</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white capitalize">
                      {avenant.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Signature</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {avenant.requires_qualified_signature ? 'Qualifiée' : 'Électronique'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" asChild>
                  <Link to={`/projects/${projectId}/modifications/avenants/${avenant.id}`}>
                    Voir l'avenant
                  </Link>
                </Button>
                {avenant.status === 'pending_signature' && (
                  <Button asChild>
                    <Link to={`/projects/${projectId}/modifications/avenants/${avenant.id}/sign`}>
                      <FileSignature className="h-4 w-4 mr-2" />
                      Signer
                    </Link>
                  </Button>
                )}
                {avenant.pdf_signed_url && (
                  <Button variant="outline" asChild>
                    <a
                      href={avenant.pdf_signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Télécharger PDF signé
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AvenantStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    draft: { label: 'Brouillon', className: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' },
    pending_signature: { label: 'En attente', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
    signed: { label: 'Signé', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    rejected: { label: 'Refusé', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    cancelled: { label: 'Annulé', className: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' },
  };

  const { label, className } = config[status] || config.draft;
  return <Badge className={className}>{label}</Badge>;
}

function AvenantTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    simple: { label: 'Simple', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    detailed: { label: 'Détaillé', className: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
    legal: { label: 'Juridique', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  };

  const { label, className } = config[type] || config.simple;
  return <Badge className={className}>{label}</Badge>;
}
