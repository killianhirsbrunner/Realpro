import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, MessageSquare, Upload, CheckCircle, XCircle, User, Phone, Mail } from 'lucide-react';
import { RealProTopbar } from '@/components/realpro/RealProTopbar';
import { RealProCard } from '@/components/realpro/RealProCard';
import { RealProButton } from '@/components/realpro/RealProButton';
import { RealProTabs } from '@/components/realpro/RealProTabs';
import NotaryStatusTag from '@/components/notary/NotaryStatusTag';
import NotaryActVersionItem from '@/components/notary/NotaryActVersionItem';
import { useNotaryActs } from '@/hooks/useNotaryActs';
import { useNotaryMessages } from '@/hooks/useNotaryMessages';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ProjectNotaryDetail() {
  const { projectId, dossierId } = useParams();
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const { acts, uploadAct } = useNotaryActs(dossierId!);
  const { messages, sendMessage } = useNotaryMessages(dossierId!);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchDossier();
  }, [dossierId]);

  async function fetchDossier() {
    try {
      const { data, error } = await supabase
        .from('buyer_dossiers')
        .select(`
          *,
          buyer:buyers(*),
          notary:users(*)
        `)
        .eq('id', dossierId)
        .single();

      if (error) throw error;
      setDossier(data);
    } catch (err) {
      console.error('Error fetching dossier:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!messageText.trim() || !dossier) return;

    try {
      await sendMessage(dossier.buyer_id, messageText);
      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }

  if (loading || !dossier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'acts', label: `Projets d'acte (${acts.length})` },
    { id: 'messages', label: `Messages (${messages.length})` }
  ];

  return (
    <div className="px-10 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/projects/${projectId}/notary`}
          className="p-2 rounded-lg hover:bg-neutral-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-neutral-900">
            Dossier: {dossier.buyer?.first_name} {dossier.buyer?.last_name}
          </h1>
          <p className="text-neutral-500">Suivi juridique et documents notariés</p>
        </div>
        <NotaryStatusTag status={dossier.status} />
      </div>

      {/* Buyer Info Card */}
      <RealProCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Acheteur</p>
              <p className="font-medium text-neutral-900">
                {dossier.buyer?.first_name} {dossier.buyer?.last_name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Email</p>
              <p className="font-medium text-neutral-900">{dossier.buyer?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Téléphone</p>
              <p className="font-medium text-neutral-900">{dossier.buyer?.phone || 'Non renseigné'}</p>
            </div>
          </div>
        </div>
      </RealProCard>

      {/* Tabs */}
      <RealProTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RealProCard title="Données de vente">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Lot</span>
                  <span className="font-medium">{dossier.buyer?.lot_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Prix</span>
                  <span className="font-medium">CHF {(dossier.buyer?.sale_price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Type</span>
                  <span className="font-medium">{dossier.buyer?.sale_type || 'PPE'}</span>
                </div>
              </div>
            </RealProCard>

            <RealProCard title="Documents requis">
              <div className="space-y-3">
                {['Pièce d\'identité', 'Justificatif de revenus', 'Accord de financement', 'Procuration'].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-neutral-700">{doc}</span>
                    {Math.random() > 0.3 ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </RealProCard>
          </div>
        )}

        {activeTab === 'acts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Versions des projets d'acte</h2>
              <RealProButton variant="primary">
                <Upload className="w-4 h-4" />
                Ajouter une version
              </RealProButton>
            </div>

            {acts.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                Aucun projet d'acte déposé pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {acts.map((act) => (
                  <NotaryActVersionItem key={act.id} version={act} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <RealProCard>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                {messages.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">
                    Aucun message pour le moment
                  </p>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-brand-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-neutral-900">
                            {message.sender?.first_name} {message.sender?.last_name}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {new Date(message.created_at).toLocaleString('fr-CH')}
                          </span>
                        </div>
                        <p className="text-neutral-700">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <RealProButton
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <MessageSquare className="w-4 h-4" />
                  Envoyer
                </RealProButton>
              </div>
            </RealProCard>
          </div>
        )}
      </div>
    </div>
  );
}
