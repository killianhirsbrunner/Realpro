import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Calendar, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SignatureArea } from '../components/signature/SignatureArea';
import { useAvenantDetail } from '../hooks/useAvenants';
import { formatDate } from '../lib/utils/format';

export function AvenantSignature() {
  const { projectId, avenantId } = useParams<{ projectId: string; avenantId: string }>();
  const navigate = useNavigate();
  const { avenant, signatures, loading, error } = useAvenantDetail(avenantId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement de l'avenant...</p>
        </div>
      </div>
    );
  }

  if (error || !avenant) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement de l'avenant</p>
        </div>
      </div>
    );
  }

  const isAlreadySigned = signatures.length > 0;

  function handleSignatureComplete() {
    navigate(`/projects/${projectId}/modifications/avenants/${avenantId}`);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/modifications/avenants/${avenantId}`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour à l'avenant
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {avenant.title}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Référence: {avenant.reference}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-semibold text-neutral-900 dark:text-white">Montant</h3>
          </div>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            CHF {avenant.total_with_vat.toLocaleString('fr-CH', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            TVA {avenant.vat_rate}% incluse
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-semibold text-neutral-900 dark:text-white">Date</h3>
          </div>
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            {formatDate(avenant.generated_at || avenant.created_at)}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Généré automatiquement
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-semibold text-neutral-900 dark:text-white">Type</h3>
          </div>
          <AvenantTypeBadge type={avenant.type} />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            {avenant.type === 'simple' && 'Modification simple'}
            {avenant.type === 'detailed' && 'Modification détaillée'}
            {avenant.type === 'legal' && 'Modification avec clauses juridiques'}
          </p>
        </Card>
      </div>

      {avenant.description && (
        <Card className="p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Description</h3>
          <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
            {avenant.description}
          </p>
        </Card>
      )}

      {avenant.pdf_url && (
        <Card className="p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
            Aperçu du document
          </h3>
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
            <iframe
              src={avenant.pdf_url}
              className="w-full h-[600px] border-0"
              title="Aperçu de l'avenant"
            />
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <a href={avenant.pdf_url} target="_blank" rel="noopener noreferrer">
                Télécharger le PDF
              </a>
            </Button>
          </div>
        </Card>
      )}

      {isAlreadySigned ? (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Avenant déjà signé
              </h3>
              <div className="space-y-2">
                {signatures.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {sig.signer_name}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {sig.signer_email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-900 dark:text-white">
                          {formatDate(sig.signed_at)}
                        </p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Signé
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : avenant.status === 'pending_signature' ? (
        <SignatureArea
          avenantId={avenant.id}
          avenantAmount={avenant.total_with_vat}
          requiresQualifiedSignature={avenant.requires_qualified_signature}
          onSignatureComplete={handleSignatureComplete}
        />
      ) : (
        <Card className="p-6 bg-neutral-50 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-neutral-500" />
            <p className="text-neutral-700 dark:text-neutral-300">
              Cet avenant n'est pas encore disponible pour signature.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

function AvenantTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    simple: { label: 'Simple', className: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
    detailed: { label: 'Détaillé', className: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
    legal: { label: 'Juridique', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  };

  const { label, className } = config[type] || config.simple;
  return <Badge className={className}>{label}</Badge>;
}
