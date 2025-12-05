import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Building2, Plus, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useSubmissionCompanies } from '../hooks/useSubmissions';
import { supabase } from '../lib/supabase';
import { formatDate } from '../lib/utils/format';

export function SubmissionCompanies() {
  const { projectId, submissionId } = useParams<{ projectId: string; submissionId: string }>();
  const { companies, loading, error, refetch } = useSubmissionCompanies(submissionId);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
  });
  const [inviting, setInviting] = useState(false);

  async function handleInviteCompany() {
    if (!submissionId || !inviteData.company_name || !inviteData.contact_email) return;

    try {
      setInviting(true);
      const { error } = await supabase.from('submission_companies').insert({
        submission_id: submissionId,
        company_name: inviteData.company_name,
        contact_email: inviteData.contact_email,
        contact_phone: inviteData.contact_phone || null,
        status: 'invited',
      });

      if (error) throw error;

      setInviteData({ company_name: '', contact_email: '', contact_phone: '' });
      setShowInviteForm(false);
      await refetch();
    } catch (error) {
      console.error('Error inviting company:', error);
    } finally {
      setInviting(false);
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des entreprises</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/submissions/${submissionId}`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour à la soumission
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Entreprises invitées
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {companies.length} entreprise{companies.length > 1 ? 's' : ''} invitée{companies.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowInviteForm(!showInviteForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Inviter une entreprise
          </Button>
        </div>
      </div>

      {showInviteForm && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-brand-200 dark:border-brand-800">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
            Inviter une nouvelle entreprise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Nom de l'entreprise <span className="text-red-600">*</span>
              </label>
              <Input
                value={inviteData.company_name}
                onChange={(e) => setInviteData({ ...inviteData, company_name: e.target.value })}
                placeholder="Ex: Construction SA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Email de contact <span className="text-red-600">*</span>
              </label>
              <Input
                type="email"
                value={inviteData.contact_email}
                onChange={(e) => setInviteData({ ...inviteData, contact_email: e.target.value })}
                placeholder="contact@entreprise.ch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Téléphone
              </label>
              <Input
                value={inviteData.contact_phone}
                onChange={(e) => setInviteData({ ...inviteData, contact_phone: e.target.value })}
                placeholder="+41 XX XXX XX XX"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleInviteCompany}
              disabled={!inviteData.company_name || !inviteData.contact_email || inviting}
            >
              {inviting ? 'Envoi...' : 'Envoyer l\'invitation'}
            </Button>
            <Button variant="outline" onClick={() => setShowInviteForm(false)}>
              Annuler
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {companies.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Aucune entreprise invitée</p>
          </Card>
        ) : (
          companies.map((company: any) => (
            <Card key={company.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <Building2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {company.company_name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Invité le {formatDate(company.created_at)}
                    </p>
                  </div>
                </div>
                <CompanyStatusBadge status={company.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Mail className="h-4 w-4" />
                  <span>{company.contact_email}</span>
                </div>
                {company.contact_phone && (
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Phone className="h-4 w-4" />
                    <span>{company.contact_phone}</span>
                  </div>
                )}
                {company.offer_amount && (
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <FileText className="h-4 w-4" />
                    <span>CHF {company.offer_amount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {company.status === 'submitted' && (
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Offre déposée le {formatDate(company.submitted_at)}</span>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CompanyStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    invited: { label: 'Invité', className: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
    viewed: { label: 'Consulté', className: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
    submitted: { label: 'Offre déposée', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    declined: { label: 'Refusé', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  };

  const { label, className } = config[status] || config.invited;
  return <Badge className={className}>{label}</Badge>;
}
