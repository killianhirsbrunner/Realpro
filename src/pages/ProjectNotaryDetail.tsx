import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Upload,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  ChevronRight,
  FileCheck,
  Send,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { RealProCard } from '@/components/realpro/RealProCard';
import { RealProButton } from '@/components/realpro/RealProButton';
import { RealProTabs } from '@/components/realpro/RealProTabs';
import NotaryStatusTag from '@/components/notary/NotaryStatusTag';
import NotaryActVersionItem from '@/components/notary/NotaryActVersionItem';
import { useNotaryActs } from '@/hooks/useNotaryActs';
import { useNotaryMessages } from '@/hooks/useNotaryMessages';
import { useNotaryDocuments, DOCUMENT_REQUIREMENTS, getDocumentStatusConfig } from '@/hooks/useNotaryDocuments';
import { useSignatureAppointments, getAppointmentStatusConfig } from '@/hooks/useSignatureAppointments';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';

type NotaryStatus = 'incomplete' | 'waiting_notary' | 'act_v1' | 'act_v2' | 'final' | 'signed';

const STATUS_FLOW: NotaryStatus[] = ['incomplete', 'waiting_notary', 'act_v1', 'act_v2', 'final', 'signed'];

const STATUS_LABELS: Record<NotaryStatus, string> = {
  incomplete: 'Dossier incomplet',
  waiting_notary: 'En attente notaire',
  act_v1: 'Projet acte V1',
  act_v2: 'Projet acte V2',
  final: 'Acte finalisé',
  signed: 'Acte signé',
};

export default function ProjectNotaryDetail() {
  const { projectId, dossierId } = useParams();
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  const { acts, uploadAct } = useNotaryActs(dossierId!);
  const { messages, sendMessage } = useNotaryMessages(dossierId!);
  const {
    documents,
    loading: docsLoading,
    completionPercentage,
    canProceedToNotary,
    uploadDocument,
    verifyDocument,
    requestDocument,
    refresh: refreshDocs,
  } = useNotaryDocuments(dossierId!);
  const {
    appointments,
    loading: appointmentsLoading,
    getNextAppointment,
    hasConfirmedAppointment,
    createAppointment,
    confirmAppointment,
    completeAppointment,
    cancelAppointment,
    refresh: refreshAppointments,
  } = useSignatureAppointments(dossierId!);

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

  async function handleStatusChange(newStatus: NotaryStatus) {
    try {
      const { error } = await supabase
        .from('buyer_dossiers')
        .update({ status: newStatus })
        .eq('id', dossierId);

      if (error) throw error;
      await fetchDossier();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  async function handleCreateAppointment() {
    if (!appointmentData.date || !appointmentData.time || !appointmentData.location || !dossier) return;

    try {
      const scheduledAt = new Date(`${appointmentData.date}T${appointmentData.time}`);
      await createAppointment({
        buyerId: dossier.buyer_id,
        notaryId: dossier.notary_id,
        scheduledAt,
        location: appointmentData.location,
        notes: appointmentData.notes || undefined,
      });
      setShowAppointmentForm(false);
      setAppointmentData({ date: '', time: '', location: '', notes: '' });
    } catch (err) {
      console.error('Error creating appointment:', err);
    }
  }

  if (loading || !dossier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const currentStatus = dossier.status as NotaryStatus;
  const currentStatusIndex = STATUS_FLOW.indexOf(currentStatus);
  const nextStatus = currentStatusIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentStatusIndex + 1] : null;
  const nextAppointment = getNextAppointment();

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'documents', label: `Documents (${completionPercentage}%)` },
    { id: 'acts', label: `Projets d'acte (${acts.length})` },
    { id: 'appointments', label: `Rendez-vous (${appointments.length})` },
    { id: 'messages', label: `Messages (${messages.length})` },
  ];

  return (
    <div className="px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/projects/${projectId}/notary`}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Dossier: {dossier.buyer?.first_name} {dossier.buyer?.last_name}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">Suivi juridique et documents notariés</p>
        </div>
        <NotaryStatusTag status={currentStatus} />
      </div>

      {/* Status Progress Bar */}
      <RealProCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Progression du dossier</h3>
          {nextStatus && canProceedToNotary && (
            <RealProButton variant="primary" size="sm" onClick={() => handleStatusChange(nextStatus)}>
              <ChevronRight className="w-4 h-4" />
              Passer à: {STATUS_LABELS[nextStatus]}
            </RealProButton>
          )}
        </div>
        <div className="flex items-center gap-2">
          {STATUS_FLOW.map((status, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            return (
              <div key={status} className="flex-1 flex items-center">
                <div
                  className={`flex-1 h-2 rounded-full ${
                    isCompleted
                      ? 'bg-green-500'
                      : isCurrent
                        ? 'bg-brand-500'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
                {idx < STATUS_FLOW.length - 1 && <div className="w-2" />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {STATUS_FLOW.map((status, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            return (
              <span
                key={status}
                className={`text-xs ${
                  isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : isCurrent
                      ? 'text-brand-600 dark:text-brand-400 font-medium'
                      : 'text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {STATUS_LABELS[status]}
              </span>
            );
          })}
        </div>
      </RealProCard>

      {/* Buyer Info Card */}
      <RealProCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Acheteur</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {dossier.buyer?.first_name} {dossier.buyer?.last_name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{dossier.buyer?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Téléphone</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {dossier.buyer?.phone || 'Non renseigné'}
              </p>
            </div>
          </div>
        </div>
      </RealProCard>

      {/* Next Appointment Alert */}
      {nextAppointment && (
        <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-brand-900 dark:text-brand-100">Prochain rendez-vous de signature</h4>
            <p className="text-sm text-brand-700 dark:text-brand-300">
              {new Date(nextAppointment.scheduled_at).toLocaleDateString('fr-CH', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              - {nextAppointment.location}
            </p>
          </div>
          <Badge
            variant={nextAppointment.status === 'confirmed' ? 'success' : 'warning'}
            className="capitalize"
          >
            {getAppointmentStatusConfig(nextAppointment.status).label}
          </Badge>
        </div>
      )}

      {/* Tabs */}
      <RealProTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RealProCard title="Données de vente">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Lot</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {dossier.buyer?.lot_number || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Prix</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    CHF {(dossier.buyer?.sale_price || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Type</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {dossier.buyer?.sale_type || 'PPE'}
                  </span>
                </div>
              </div>
            </RealProCard>

            <RealProCard
              title="Documents requis"
              action={
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {completionPercentage}% complété
                </span>
              }
            >
              {docsLoading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <div className="space-y-3">
                  {DOCUMENT_REQUIREMENTS.map((req) => {
                    const doc = documents.find((d) => d.document_type === req.type);
                    const statusConfig = doc
                      ? getDocumentStatusConfig(doc.status)
                      : { icon: 'Circle', color: 'text-neutral-400' };
                    const IconComponent =
                      doc?.status === 'verified'
                        ? CheckCircle
                        : doc?.status === 'rejected'
                          ? XCircle
                          : AlertCircle;

                    return (
                      <div key={req.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-700 dark:text-neutral-300">{req.label}</span>
                          {req.isMandatory && (
                            <span className="text-xs text-red-500">*</span>
                          )}
                        </div>
                        <IconComponent className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <RealProButton variant="secondary" size="sm" onClick={() => setActiveTab('documents')}>
                  <FileText className="w-4 h-4" />
                  Gérer les documents
                </RealProButton>
              </div>
            </RealProCard>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Checklist documentaire
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {completionPercentage}% des documents obligatoires sont validés
                </p>
              </div>
              <RealProButton variant="secondary" onClick={refreshDocs}>
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </RealProButton>
            </div>

            {/* Progress Bar */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full h-3">
              <div
                className="bg-brand-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            {!canProceedToNotary && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                    Documents manquants
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Tous les documents obligatoires doivent être vérifiés avant de pouvoir transmettre
                    le dossier au notaire.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {DOCUMENT_REQUIREMENTS.map((req) => {
                const doc = documents.find((d) => d.document_type === req.type);
                const statusConfig = doc ? getDocumentStatusConfig(doc.status) : null;

                return (
                  <RealProCard key={req.type} className="!p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc?.status === 'verified'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : doc?.status === 'rejected'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : doc?.status === 'pending'
                                  ? 'bg-amber-100 dark:bg-amber-900/30'
                                  : 'bg-neutral-100 dark:bg-neutral-800'
                          }`}
                        >
                          <FileCheck
                            className={`w-5 h-5 ${
                              doc?.status === 'verified'
                                ? 'text-green-600 dark:text-green-400'
                                : doc?.status === 'rejected'
                                  ? 'text-red-600 dark:text-red-400'
                                  : doc?.status === 'pending'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-neutral-400 dark:text-neutral-500'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {req.label}
                            </h4>
                            {req.isMandatory && (
                              <Badge variant="danger" className="text-xs">
                                Obligatoire
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {req.description}
                          </p>
                          {doc && statusConfig && (
                            <Badge variant="default" className={`mt-1 ${statusConfig.color}`}>
                              {statusConfig.label}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!doc && (
                          <>
                            <RealProButton
                              variant="secondary"
                              size="sm"
                              onClick={() => requestDocument(req.type)}
                            >
                              <Send className="w-4 h-4" />
                              Demander
                            </RealProButton>
                            <RealProButton
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                // TODO: Open file picker
                                const fakeFile = new File([''], 'document.pdf', {
                                  type: 'application/pdf',
                                });
                                uploadDocument(req.type, fakeFile);
                              }}
                            >
                              <Upload className="w-4 h-4" />
                              Uploader
                            </RealProButton>
                          </>
                        )}
                        {doc?.status === 'pending' && (
                          <>
                            <RealProButton
                              variant="secondary"
                              size="sm"
                              onClick={() => verifyDocument(doc.id, 'rejected', 'Document non conforme')}
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeter
                            </RealProButton>
                            <RealProButton
                              variant="primary"
                              size="sm"
                              onClick={() => verifyDocument(doc.id, 'verified')}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Valider
                            </RealProButton>
                          </>
                        )}
                        {doc?.status === 'rejected' && (
                          <RealProButton
                            variant="secondary"
                            size="sm"
                            onClick={() => requestDocument(req.type)}
                          >
                            <RefreshCw className="w-4 h-4" />
                            Redemander
                          </RealProButton>
                        )}
                        {doc?.status === 'verified' && (
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </div>
                  </RealProCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Acts Tab */}
        {activeTab === 'acts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Versions des projets d'acte
              </h2>
              <RealProButton variant="primary">
                <Upload className="w-4 h-4" />
                Ajouter une version
              </RealProButton>
            </div>

            {acts.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    Aucun projet d'acte déposé pour le moment
                  </p>
                  <RealProButton variant="secondary">
                    <Upload className="w-4 h-4" />
                    Déposer le premier projet
                  </RealProButton>
                </div>
              </RealProCard>
            ) : (
              <div className="space-y-4">
                {acts.map((act) => (
                  <NotaryActVersionItem key={act.id} version={act} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Rendez-vous de signature
              </h2>
              <RealProButton variant="primary" onClick={() => setShowAppointmentForm(true)}>
                <Plus className="w-4 h-4" />
                Planifier un rendez-vous
              </RealProButton>
            </div>

            {/* Create Appointment Form */}
            {showAppointmentForm && (
              <RealProCard title="Nouveau rendez-vous">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Lieu
                    </label>
                    <input
                      type="text"
                      value={appointmentData.location}
                      onChange={(e) => setAppointmentData({ ...appointmentData, location: e.target.value })}
                      placeholder="Adresse de l'étude notariale"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={appointmentData.notes}
                      onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                      placeholder="Instructions particulières..."
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <RealProButton variant="secondary" onClick={() => setShowAppointmentForm(false)}>
                    Annuler
                  </RealProButton>
                  <RealProButton
                    variant="primary"
                    onClick={handleCreateAppointment}
                    disabled={!appointmentData.date || !appointmentData.time || !appointmentData.location}
                  >
                    <Calendar className="w-4 h-4" />
                    Planifier
                  </RealProButton>
                </div>
              </RealProCard>
            )}

            {/* Appointments List */}
            {appointmentsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : appointments.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    Aucun rendez-vous planifié
                  </p>
                  <RealProButton variant="secondary" onClick={() => setShowAppointmentForm(true)}>
                    <Plus className="w-4 h-4" />
                    Planifier le premier rendez-vous
                  </RealProButton>
                </div>
              </RealProCard>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const statusConfig = getAppointmentStatusConfig(appointment.status);
                  const appointmentDate = new Date(appointment.scheduled_at);
                  const isPast = appointmentDate < new Date();

                  return (
                    <RealProCard key={appointment.id} className="!p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              appointment.status === 'completed'
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : appointment.status === 'cancelled'
                                  ? 'bg-red-100 dark:bg-red-900/30'
                                  : 'bg-brand-100 dark:bg-brand-900/30'
                            }`}
                          >
                            <Calendar
                              className={`w-6 h-6 ${
                                appointment.status === 'completed'
                                  ? 'text-green-600 dark:text-green-400'
                                  : appointment.status === 'cancelled'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-brand-600 dark:text-brand-400'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                {appointmentDate.toLocaleDateString('fr-CH', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </h4>
                              <Badge variant="default" className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointmentDate.toLocaleTimeString('fr-CH', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {appointment.location}
                              </div>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {appointment.status === 'scheduled' && !isPast && (
                            <>
                              <RealProButton
                                variant="secondary"
                                size="sm"
                                onClick={() => cancelAppointment(appointment.id)}
                              >
                                Annuler
                              </RealProButton>
                              <RealProButton
                                variant="primary"
                                size="sm"
                                onClick={() => confirmAppointment(appointment.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Confirmer
                              </RealProButton>
                            </>
                          )}
                          {appointment.status === 'confirmed' && !isPast && (
                            <>
                              <RealProButton
                                variant="secondary"
                                size="sm"
                                onClick={() => cancelAppointment(appointment.id)}
                              >
                                Annuler
                              </RealProButton>
                              <RealProButton
                                variant="primary"
                                size="sm"
                                onClick={() => completeAppointment(appointment.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Marquer signé
                              </RealProButton>
                            </>
                          )}
                          {appointment.status === 'completed' && (
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                      </div>
                    </RealProCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <RealProCard>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                {messages.length === 0 ? (
                  <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                    Aucun message pour le moment
                  </p>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {message.sender?.first_name} {message.sender?.last_name}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {new Date(message.created_at).toLocaleString('fr-CH')}
                          </span>
                        </div>
                        <p className="text-neutral-700 dark:text-neutral-300">{message.content}</p>
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
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <RealProButton variant="primary" onClick={handleSendMessage} disabled={!messageText.trim()}>
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
