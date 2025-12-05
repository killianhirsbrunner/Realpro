import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, CheckCircle, XCircle, MessageSquare, Send, Download, FileSignature } from 'lucide-react';
import { useSupplierOfferDetail } from '../hooks/useSupplierOffers';
import { useGenerateAvenant } from '../hooks/useAvenants';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';
import { supabase } from '../lib/supabase';
import { formatDate } from '../lib/utils/format';

export function ProjectModificationsOfferDetail() {
  const { projectId, offerId } = useParams<{ projectId: string; offerId: string }>();
  const navigate = useNavigate();
  const { offer, loading, error, refetch } = useSupplierOfferDetail(offerId);
  const { generateAvenant, generating } = useGenerateAvenant();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleAddComment() {
    if (!offerId || !comment.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from('supplier_offer_comments').insert({
        offer_id: offerId,
        comment: comment.trim(),
        author_role: 'promoter',
      });

      if (error) throw error;

      setComment('');
      await refetch();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClientApproval() {
    if (!offerId) return;

    try {
      const { error } = await supabase
        .from('supplier_offers')
        .update({
          status: 'client_approved',
          client_approved_at: new Date().toISOString(),
        })
        .eq('id', offerId);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Error approving offer:', error);
    }
  }

  async function handleArchitectApproval() {
    if (!offerId) return;

    try {
      const { error } = await supabase
        .from('supplier_offers')
        .update({
          status: 'architect_approved',
          architect_approved_at: new Date().toISOString(),
        })
        .eq('id', offerId);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Error approving offer:', error);
    }
  }

  async function handleReject(reason: string) {
    if (!offerId) return;

    try {
      const { error } = await supabase
        .from('supplier_offers')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', offerId);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Error rejecting offer:', error);
    }
  }

  async function handleGenerateAvenant() {
    if (!offerId || !projectId) return;

    try {
      const avenant = await generateAvenant(projectId, offerId, {
        title: `Modification technique - Lot ${offer?.lot_number}`,
        description: offer?.description || '',
        amount: offer?.total_amount || 0,
        lotId: offer?.lot_id,
      });

      await supabase
        .from('supplier_offers')
        .update({ status: 'final', finalized_at: new Date().toISOString() })
        .eq('id', offerId);

      navigate(`/projects/${projectId}/modifications/avenants/${avenant.id}/sign`);
    } catch (error) {
      console.error('Error generating avenant:', error);
    }
  }

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

  if (error || !offer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Offre non trouvée'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/modifications/offers`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux offres
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Offre fournisseur - Lot {offer.lot_number}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {offer.supplier_name} • Version {offer.version}
              </p>
            </div>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Détails de l'offre
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Fournisseur</p>
                <p className="font-medium text-neutral-900 dark:text-white">{offer.supplier_name}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Lot</p>
                <p className="font-medium text-neutral-900 dark:text-white">{offer.lot_number}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Prix total</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  CHF {offer.price?.toLocaleString() || '-'}
                </p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Version</p>
                <p className="font-medium text-neutral-900 dark:text-white">v{offer.version}</p>
              </div>
            </div>

            {offer.description && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">Description</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{offer.description}</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Commentaires
            </h3>

            <div className="space-y-3 mb-4">
              {(!offer.comments || offer.comments.length === 0) && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                  Aucun commentaire pour le moment
                </p>
              )}
              {offer.comments?.map((c: any) => (
                <div key={c.id} className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-neutral-900 dark:text-white">{c.author_role}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDate(c.created_at)}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{c.comment}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                rows={3}
              />
              <Button
                onClick={handleAddComment}
                disabled={!comment.trim() || submitting}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Workflow de validation
            </h3>

            <div className="space-y-4">
              <ValidationStep
                label="Validation client"
                completed={offer.status !== 'draft' && offer.status !== 'pending_client'}
                date={offer.client_approved_at}
              />
              <ValidationStep
                label="Validation architecte"
                completed={offer.status === 'architect_approved' || offer.status === 'final'}
                date={offer.architect_approved_at}
              />
              <ValidationStep
                label="Avenant final"
                completed={offer.status === 'final'}
                date={offer.finalized_at}
              />
            </div>
          </Card>

          {offer.status === 'pending_client' && (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-brand-200 dark:border-brand-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                Action requise : Validation client
              </h3>
              <div className="space-y-2">
                <Button onClick={handleClientApproval} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accepter l'offre
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject('Demande de corrections client')}
                  className="w-full"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Demander corrections
                </Button>
              </div>
            </Card>
          )}

          {offer.status === 'client_approved' && (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                Action requise : Validation technique
              </h3>
              <div className="space-y-2">
                <Button onClick={handleArchitectApproval} className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider techniquement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject('Non conforme techniquement')}
                  className="w-full"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Non conforme
                </Button>
              </div>
            </Card>
          )}

          {offer.status === 'architect_approved' && (
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                Prêt pour génération d'avenant
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                L'offre a été validée par le client et l'architecte. Vous pouvez maintenant générer l'avenant
                pour signature électronique.
              </p>
              <Button
                onClick={handleGenerateAvenant}
                disabled={generating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <FileSignature className="h-4 w-4 mr-2" />
                {generating ? 'Génération en cours...' : 'Générer l\'avenant'}
              </Button>
            </Card>
          )}

          {offer.status === 'architect_approved' && (
            <Card className="p-6 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-brand-200 dark:border-brand-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                Prêt pour avenant
              </h3>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Générer l'avenant PDF
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function OfferStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    draft: { label: 'Brouillon', className: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' },
    pending_client: { label: 'En attente client', className: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
    client_approved: { label: 'Validée client', className: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
    architect_approved: { label: 'Validée architecte', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    final: { label: 'Finalisée', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    rejected: { label: 'Refusée', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  };

  const { label, className } = config[status] || config.draft;
  return <Badge className={className}>{label}</Badge>;
}

function ValidationStep({ label, completed, date }: { label: string; completed: boolean; date?: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        completed
          ? 'bg-green-100 dark:bg-green-900'
          : 'bg-neutral-100 dark:bg-neutral-800'
      }`}>
        {completed ? (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-neutral-400 dark:bg-neutral-600" />
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          completed
            ? 'text-neutral-900 dark:text-white'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}>
          {label}
        </p>
        {date && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatDate(date)}
          </p>
        )}
      </div>
    </div>
  );
}
