import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Upload,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  Building2,
  FileText,
  Shield,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useKYC, KYC_DOCUMENT_LABELS, KYC_STATUS_LABELS, KYC_STATUS_COLORS } from '../../hooks/useKYC';
import type { KYCDocumentType, VerificationType, KYCDocument } from '../../types/stakeholder';

interface KYCVerificationFormProps {
  userId: string;
  organizationId: string;
  projectId?: string;
  verificationType?: VerificationType;
  onComplete?: () => void;
}

export function KYCVerificationForm({
  userId,
  organizationId,
  projectId,
  verificationType = 'IDENTITY',
  onComplete,
}: KYCVerificationFormProps) {
  const { t } = useTranslation();
  const {
    verification,
    loading,
    startVerification,
    uploadDocument,
    submitForReview,
    deleteDocument,
    getStatus,
  } = useKYC(userId);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<KYCDocumentType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const status = getStatus();

  const requiredDocuments = getRequiredDocumentsForType(verificationType);
  const uploadedTypes = verification?.documents?.map((d) => d.document_type) || [];
  const missingDocuments = requiredDocuments.filter((d) => !uploadedTypes.includes(d));

  const handleStartVerification = async () => {
    try {
      await startVerification(organizationId, projectId, verificationType);
    } catch (error) {
      console.error('Failed to start verification:', error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !verification || !selectedType) return;

    try {
      setUploading(true);
      await uploadDocument(verification.id, selectedType, file);
      setSelectedType(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleSubmitForReview = async () => {
    if (!verification) return;

    try {
      setSubmitting(true);
      await submitForReview(verification.id);
      onComplete?.();
    } catch (error) {
      console.error('Failed to submit for review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = missingDocuments.length === 0 && verification?.status === 'PENDING';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Show status if already submitted
  if (verification && ['SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED'].includes(verification.status)) {
    return (
      <KYCStatusDisplay
        status={verification.status}
        reviewNotes={verification.review_notes}
        rejectionReason={verification.rejection_reason}
        onRetry={verification.status === 'REJECTED' ? handleStartVerification : undefined}
      />
    );
  }

  // Start verification if not exists
  if (!verification) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-indigo-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Vérification d'identité requise
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Pour des raisons de sécurité, nous devons vérifier votre identité avant de continuer.
          </p>
          <button
            onClick={handleStartVerification}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Commencer la vérification
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vérification KYC
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getVerificationTypeLabel(verificationType)}
            </p>
          </div>
          <StatusBadge status={verification.status} />
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Documents téléchargés: {uploadedTypes.length}/{requiredDocuments.length}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {Math.round((uploadedTypes.length / requiredDocuments.length) * 100)}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${(uploadedTypes.length / requiredDocuments.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Document list */}
      <div className="p-6 space-y-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Documents requis
        </h4>

        {requiredDocuments.map((docType) => {
          const uploadedDoc = verification.documents?.find((d) => d.document_type === docType);
          const isUploaded = !!uploadedDoc;

          return (
            <DocumentRow
              key={docType}
              documentType={docType}
              isUploaded={isUploaded}
              document={uploadedDoc}
              onUpload={() => {
                setSelectedType(docType);
                fileInputRef.current?.click();
              }}
              onDelete={uploadedDoc ? () => handleDeleteDocument(uploadedDoc.id) : undefined}
              uploading={uploading && selectedType === docType}
            />
          );
        })}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {missingDocuments.length > 0
              ? `${missingDocuments.length} document(s) manquant(s)`
              : 'Tous les documents sont téléchargés'}
          </p>
          <button
            onClick={handleSubmitForReview}
            disabled={!canSubmit || submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Soumettre pour vérification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-components

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    IN_REVIEW: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.PENDING}`}>
      {KYC_STATUS_LABELS[status as keyof typeof KYC_STATUS_LABELS] || status}
    </span>
  );
}

interface DocumentRowProps {
  documentType: KYCDocumentType;
  isUploaded: boolean;
  document?: KYCDocument;
  onUpload: () => void;
  onDelete?: () => void;
  uploading: boolean;
}

function DocumentRow({
  documentType,
  isUploaded,
  document,
  onUpload,
  onDelete,
  uploading,
}: DocumentRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${isUploaded ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
          {isUploaded ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <FileText className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {KYC_DOCUMENT_LABELS[documentType]}
          </p>
          {document && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {document.file_name} • {formatFileSize(document.file_size || 0)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isUploaded && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onUpload}
          disabled={uploading}
          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isUploaded
              ? 'text-gray-600 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              : 'text-white bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4 mr-1" />
              {isUploaded ? 'Remplacer' : 'Télécharger'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface KYCStatusDisplayProps {
  status: string;
  reviewNotes?: string | null;
  rejectionReason?: string | null;
  onRetry?: () => void;
}

function KYCStatusDisplay({ status, reviewNotes, rejectionReason, onRetry }: KYCStatusDisplayProps) {
  const config = {
    SUBMITTED: {
      icon: Clock,
      title: 'Documents en cours de traitement',
      description: 'Votre dossier a été soumis et sera examiné sous 24-48h.',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    IN_REVIEW: {
      icon: Clock,
      title: 'Vérification en cours',
      description: 'Un membre de notre équipe examine actuellement vos documents.',
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    APPROVED: {
      icon: CheckCircle,
      title: 'Vérification approuvée',
      description: 'Votre identité a été vérifiée avec succès.',
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    REJECTED: {
      icon: AlertCircle,
      title: 'Vérification rejetée',
      description: rejectionReason || 'Veuillez soumettre de nouveaux documents.',
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
  };

  const current = config[status as keyof typeof config];
  if (!current) return null;

  const Icon = current.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full ${current.bg} flex items-center justify-center`}>
          <Icon className={`h-8 w-8 ${current.color}`} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          {current.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {current.description}
        </p>
        {reviewNotes && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-left">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Notes du vérificateur
            </p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{reviewNotes}</p>
          </div>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Recommencer la vérification
          </button>
        )}
      </div>
    </div>
  );
}

// Helper functions

function getRequiredDocumentsForType(type: VerificationType): KYCDocumentType[] {
  switch (type) {
    case 'IDENTITY':
      return ['ID_CARD', 'UTILITY_BILL'];
    case 'COMPANY':
      return ['COMPANY_REGISTRATION', 'VAT_CERTIFICATE', 'INSURANCE_CERTIFICATE', 'BENEFICIAL_OWNERS'];
    case 'PROFESSIONAL':
      return ['ID_CARD', 'PROFESSIONAL_LICENSE', 'INSURANCE_CERTIFICATE'];
    case 'ADDRESS':
      return ['UTILITY_BILL'];
    default:
      return ['ID_CARD'];
  }
}

function getVerificationTypeLabel(type: VerificationType): string {
  const labels: Record<VerificationType, string> = {
    IDENTITY: "Vérification d'identité personnelle",
    COMPANY: "Vérification d'entreprise",
    PROFESSIONAL: 'Vérification professionnelle',
    ADDRESS: "Vérification d'adresse",
  };
  return labels[type];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
