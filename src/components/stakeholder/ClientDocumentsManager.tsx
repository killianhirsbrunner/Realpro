import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Loader2,
  MoreVertical,
  Trash2,
  FileSignature,
  User,
  Home,
  Calendar,
  Tag,
} from 'lucide-react';
import { useClientDocuments, CLIENT_DOCUMENT_TYPE_LABELS, CLIENT_DOCUMENT_ICONS } from '../../hooks/useClientDocuments';
import type { ClientDocumentType, ClientDocumentWithRelations, ClientDocumentUploadData } from '../../types/stakeholder';

interface ClientDocumentsManagerProps {
  projectId: string;
  prospectId?: string;
  buyerId?: string;
  lotId?: string;
  canValidate?: boolean;
}

export function ClientDocumentsManager({
  projectId,
  prospectId,
  buyerId,
  lotId,
  canValidate = false,
}: ClientDocumentsManagerProps) {
  const { t } = useTranslation();
  const {
    documents,
    stats,
    loading,
    uploadDocument,
    validateDocument,
    rejectDocument,
    deleteDocument,
    requestSignature,
    refresh,
  } = useClientDocuments(projectId, { prospectId, buyerId, lotId });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<ClientDocumentWithRelations | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    if (filter === 'pending' && doc.status !== 'UPLOADED') return false;
    if (filter === 'validated' && doc.status !== 'VALIDATED') return false;
    if (filter === 'rejected' && doc.status !== 'REJECTED') return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.file_name.toLowerCase().includes(query) ||
        CLIENT_DOCUMENT_TYPE_LABELS[doc.document_type].toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Documents clients
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez les documents des acquéreurs et prospects
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Upload className="mr-2 h-4 w-4" />
          Ajouter un document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} icon={FileText} color="gray" />
        <StatCard label="En attente" value={stats.uploaded} icon={Clock} color="yellow" />
        <StatCard label="Validés" value={stats.validated} icon={CheckCircle} color="green" />
        <StatCard label="Rejetés" value={stats.rejected} icon={XCircle} color="red" />
        <StatCard label="À signer" value={stats.pendingSignature} icon={FileSignature} color="purple" />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un document..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            {(['all', 'pending', 'validated', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  filter === f
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'validated' ? 'Validés' : 'Rejetés'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState onUpload={() => setShowUploadModal(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              canValidate={canValidate}
              onView={() => setSelectedDocument(doc)}
              onValidate={() => validateDocument(doc.id)}
              onReject={(reason) => rejectDocument(doc.id, reason)}
              onDelete={() => deleteDocument(doc.id)}
              onRequestSignature={() => requestSignature(doc.id)}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          projectId={projectId}
          prospectId={prospectId}
          buyerId={buyerId}
          lotId={lotId}
          onClose={() => setShowUploadModal(false)}
          onUpload={async (data) => {
            await uploadDocument(data);
            setShowUploadModal(false);
          }}
        />
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          canValidate={canValidate}
          onClose={() => setSelectedDocument(null)}
          onValidate={() => {
            validateDocument(selectedDocument.id);
            setSelectedDocument(null);
          }}
          onReject={(reason) => {
            rejectDocument(selectedDocument.id, reason);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}

// Stat card component
function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'gray' | 'yellow' | 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

// Document card component
interface DocumentCardProps {
  document: ClientDocumentWithRelations;
  canValidate: boolean;
  onView: () => void;
  onValidate: () => void;
  onReject: (reason: string) => void;
  onDelete: () => void;
  onRequestSignature: () => void;
}

function DocumentCard({
  document,
  canValidate,
  onView,
  onValidate,
  onReject,
  onDelete,
  onRequestSignature,
}: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const statusConfig = {
    UPLOADED: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    VALIDATED: { label: 'Validé', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
    EXPIRED: { label: 'Expiré', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: AlertCircle },
  };

  const status = statusConfig[document.status] || statusConfig.UPLOADED;
  const StatusIcon = status.icon;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
        {/* Preview area */}
        <div
          onClick={onView}
          className="h-32 bg-gray-100 dark:bg-gray-900 flex items-center justify-center cursor-pointer"
        >
          {document.file_type?.startsWith('image/') ? (
            <img
              src={document.file_url}
              alt={document.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <FileText className="h-12 w-12 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {document.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {CLIENT_DOCUMENT_TYPE_LABELS[document.document_type]}
              </p>
            </div>
            <div className="relative ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-20">
                    <div className="py-1">
                      <button
                        onClick={() => { onView(); setShowMenu(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </button>
                      <a
                        href={document.file_url}
                        download={document.file_name}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowMenu(false)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </a>
                      {!document.requires_signature && document.status === 'VALIDATED' && (
                        <button
                          onClick={() => { onRequestSignature(); setShowMenu(false); }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FileSignature className="mr-2 h-4 w-4" />
                          Demander signature
                        </button>
                      )}
                      <button
                        onClick={() => { onDelete(); setShowMenu(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {document.prospect && (
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {document.prospect.first_name} {document.prospect.last_name}
              </span>
            )}
            {document.lot && (
              <span className="flex items-center">
                <Home className="h-3 w-3 mr-1" />
                {document.lot.lot_number}
              </span>
            )}
          </div>

          {/* Status and actions */}
          <div className="mt-3 flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </span>

            {canValidate && document.status === 'UPLOADED' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onValidate}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                  title="Valider"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="Rejeter"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {document.requires_signature && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                document.signature_status === 'SIGNED'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                <FileSignature className="mr-1 h-3 w-3" />
                {document.signature_status === 'SIGNED' ? 'Signé' : 'Signature requise'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onReject={(reason) => {
            onReject(reason);
            setShowRejectModal(false);
          }}
        />
      )}
    </>
  );
}

// Empty state component
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
        Aucun document
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Commencez par ajouter les documents du client.
      </p>
      <button
        onClick={onUpload}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <Upload className="mr-2 h-4 w-4" />
        Ajouter un document
      </button>
    </div>
  );
}

// Upload modal component
interface UploadModalProps {
  projectId: string;
  prospectId?: string;
  buyerId?: string;
  lotId?: string;
  onClose: () => void;
  onUpload: (data: ClientDocumentUploadData) => Promise<void>;
}

function UploadModal({ projectId, prospectId, buyerId, lotId, onClose, onUpload }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    document_type: 'ID_COPY' as ClientDocumentType,
    title: '',
    description: '',
    requires_signature: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    try {
      await onUpload({
        ...formData,
        file,
        prospect_id: prospectId,
        buyer_id: buyerId,
        lot_id: lotId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentTypes: ClientDocumentType[] = [
    'ID_COPY',
    'RESERVATION_AGREEMENT',
    'EG_CONTRACT_SIGNED',
    'PROOF_OF_FUNDS',
    'BANK_GUARANTEE',
    'MORTGAGE_APPROVAL',
    'POWER_OF_ATTORNEY',
    'AMENDMENT_SIGNED',
    'DEPOSIT_RECEIPT',
    'OTHER',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ajouter un document
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* File upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fichier *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  file
                    ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PDF, JPG, PNG jusqu'à 10MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Document type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de document *
              </label>
              <select
                value={formData.document_type}
                onChange={(e) => setFormData({ ...formData, document_type: e.target.value as ClientDocumentType })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {CLIENT_DOCUMENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
              />
            </div>

            {/* Signature required */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.requires_signature}
                onChange={(e) => setFormData({ ...formData, requires_signature: e.target.checked })}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Ce document nécessite une signature
              </span>
            </label>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !file || !formData.title}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Ajouter
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reject modal component
function RejectModal({ onClose, onReject }: { onClose: () => void; onReject: (reason: string) => void }) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rejeter le document
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Indiquez la raison du rejet pour informer le courtier.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Raison du rejet..."
            className="mt-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Annuler
            </button>
            <button
              onClick={() => onReject(reason)}
              disabled={!reason.trim()}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Document preview modal
function DocumentPreviewModal({
  document,
  canValidate,
  onClose,
  onValidate,
  onReject,
}: {
  document: ClientDocumentWithRelations;
  canValidate: boolean;
  onClose: () => void;
  onValidate: () => void;
  onReject: (reason: string) => void;
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const isPDF = document.file_type === 'application/pdf';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {document.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {CLIENT_DOCUMENT_TYPE_LABELS[document.document_type]}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={document.file_url}
                  download={document.file_name}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Télécharger
                </a>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="h-[60vh] bg-gray-100 dark:bg-gray-900 overflow-auto">
              {isPDF ? (
                <iframe
                  src={`${document.file_url}#toolbar=0`}
                  className="w-full h-full"
                  title={document.title}
                />
              ) : document.file_type?.startsWith('image/') ? (
                <img
                  src={document.file_url}
                  alt={document.title}
                  className="max-w-full max-h-full mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Actions */}
            {canValidate && document.status === 'UPLOADED' && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-lg text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </button>
                <button
                  onClick={onValidate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Valider
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onReject={(reason) => {
            onReject(reason);
            setShowRejectModal(false);
          }}
        />
      )}
    </>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
