import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  User,
  Building2,
  CreditCard,
  FileCheck,
  Shield,
  FileText,
  Award,
  Settings,
  Loader2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useStakeholderOnboarding, ONBOARDING_STATUS_LABELS } from '../../hooks/useStakeholderOnboarding';
import { KYCVerificationForm } from './KYCVerificationForm';
import { TwoFactorSetup } from './TwoFactorSetup';
import type { OnboardingStep, ParticipantRole } from '../../types/stakeholder';

interface OnboardingWizardProps {
  projectId: string;
  userId: string;
  organizationId: string;
  role: ParticipantRole;
  onComplete?: () => void;
}

export function OnboardingWizard({
  projectId,
  userId,
  organizationId,
  role,
  onComplete,
}: OnboardingWizardProps) {
  const { t } = useTranslation();
  const {
    onboarding,
    steps,
    loading,
    startOnboarding,
    completeStep,
    goToStep,
    getStatus,
  } = useStakeholderOnboarding(projectId);

  const [currentStepData, setCurrentStepData] = useState<Record<string, any>>({});

  const status = getStatus();
  const currentStep = steps.find((s) => s.isCurrent);
  const currentStepIndex = steps.findIndex((s) => s.isCurrent);

  useEffect(() => {
    if (onboarding?.status === 'NOT_STARTED') {
      startOnboarding();
    }
  }, [onboarding?.status]);

  useEffect(() => {
    if (status.status === 'COMPLETED') {
      onComplete?.();
    }
  }, [status.status]);

  const handleStepComplete = async () => {
    if (currentStep) {
      await completeStep(currentStep.id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      goToStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      goToStep(steps[currentStepIndex + 1].id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status.status === 'BLOCKED') {
    return (
      <BlockedState reason={status.blockedReason || 'Accès bloqué'} />
    );
  }

  if (status.status === 'COMPLETED') {
    return (
      <CompletedState onContinue={onComplete} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configuration de votre compte
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {getRoleWelcomeMessage(role)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-indigo-600">{status.progress}%</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">Complété</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>

      {/* Steps sidebar + content */}
      <div className="flex gap-8">
        {/* Steps navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-2">
            {steps.map((step, index) => (
              <StepNavItem
                key={step.id}
                step={step}
                index={index}
                isActive={step.isCurrent}
                isCompleted={step.isCompleted}
                onClick={() => {
                  if (step.isCompleted || index <= currentStepIndex) {
                    goToStep(step.id);
                  }
                }}
              />
            ))}
          </nav>
        </div>

        {/* Step content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {currentStep && (
              <StepContent
                step={currentStep}
                userId={userId}
                organizationId={organizationId}
                projectId={projectId}
                role={role}
                onComplete={handleStepComplete}
                data={currentStepData}
                setData={setCurrentStepData}
              />
            )}

            {/* Navigation buttons */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Précédent
              </button>

              {!['kyc_identity', 'kyc_company', 'kyc_professional', '2fa'].includes(currentStep?.id || '') && (
                <button
                  onClick={handleStepComplete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {currentStepIndex === steps.length - 1 ? (
                    <>
                      Terminer
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step navigation item
interface StepNavItemProps {
  step: OnboardingStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

function StepNavItem({ step, index, isActive, isCompleted, onClick }: StepNavItemProps) {
  const Icon = getStepIcon(step.id);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800'
          : isCompleted
          ? 'hover:bg-gray-50 dark:hover:bg-gray-800'
          : 'opacity-50 cursor-not-allowed'
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}
      >
        {isCompleted ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </div>
      <div className="ml-3 flex-1">
        <p
          className={`text-sm font-medium ${
            isActive
              ? 'text-indigo-600 dark:text-indigo-400'
              : isCompleted
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {step.label}
        </p>
      </div>
    </button>
  );
}

// Step content renderer
interface StepContentProps {
  step: OnboardingStep;
  userId: string;
  organizationId: string;
  projectId: string;
  role: ParticipantRole;
  onComplete: () => void;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}

function StepContent({
  step,
  userId,
  organizationId,
  projectId,
  role,
  onComplete,
  data,
  setData,
}: StepContentProps) {
  switch (step.id) {
    case 'profile':
      return <ProfileStep data={data} setData={setData} onComplete={onComplete} />;
    case 'company':
      return <CompanyStep data={data} setData={setData} onComplete={onComplete} />;
    case 'kyc_identity':
      return (
        <div className="p-6">
          <KYCVerificationForm
            userId={userId}
            organizationId={organizationId}
            projectId={projectId}
            verificationType="IDENTITY"
            onComplete={onComplete}
          />
        </div>
      );
    case 'kyc_company':
      return (
        <div className="p-6">
          <KYCVerificationForm
            userId={userId}
            organizationId={organizationId}
            projectId={projectId}
            verificationType="COMPANY"
            onComplete={onComplete}
          />
        </div>
      );
    case 'kyc_professional':
      return (
        <div className="p-6">
          <KYCVerificationForm
            userId={userId}
            organizationId={organizationId}
            projectId={projectId}
            verificationType="PROFESSIONAL"
            onComplete={onComplete}
          />
        </div>
      );
    case '2fa':
      return (
        <div className="p-6">
          <TwoFactorSetup onComplete={onComplete} required />
        </div>
      );
    case 'documents':
      return <DocumentsStep role={role} onComplete={onComplete} />;
    case 'preferences':
      return <PreferencesStep data={data} setData={setData} onComplete={onComplete} />;
    default:
      return (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          Étape non configurée: {step.id}
        </div>
      );
  }
}

// Profile step component
function ProfileStep({
  data,
  setData,
  onComplete,
}: {
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
  onComplete: () => void;
}) {
  const [formData, setFormData] = useState({
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    phone: data.phone || '',
    title: data.title || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Informations personnelles
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complétez vos informations de profil
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prénom
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fonction
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Directeur, Agent immobilier..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

// Company step component
function CompanyStep({
  data,
  setData,
  onComplete,
}: {
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
  onComplete: () => void;
}) {
  const [formData, setFormData] = useState({
    company_name: data.company_name || '',
    company_address: data.company_address || '',
    company_city: data.company_city || '',
    company_postal_code: data.company_postal_code || '',
    company_phone: data.company_phone || '',
    company_website: data.company_website || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Informations de l'entreprise
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Renseignez les informations de votre société ou bureau
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom de l'entreprise
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adresse
          </label>
          <input
            type="text"
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              NPA
            </label>
            <input
              type="text"
              name="company_postal_code"
              value={formData.company_postal_code}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ville
            </label>
            <input
              type="text"
              name="company_city"
              value={formData.company_city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="company_phone"
              value={formData.company_phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site web
            </label>
            <input
              type="url"
              name="company_website"
              value={formData.company_website}
              onChange={handleChange}
              placeholder="https://"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Documents step component
function DocumentsStep({ role, onComplete }: { role: ParticipantRole; onComplete: () => void }) {
  const requiredDocs = getRequiredDocumentsForRole(role);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Documents requis
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Téléchargez les documents nécessaires pour votre rôle
        </p>
      </div>

      <div className="space-y-3">
        {requiredDocs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.description}</p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Télécharger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Preferences step component
function PreferencesStep({
  data,
  setData,
  onComplete,
}: {
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
  onComplete: () => void;
}) {
  const [notifications, setNotifications] = useState({
    email_new_lot: true,
    email_reservation: true,
    email_document: true,
    sms_urgent: false,
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Préférences de notification
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configurez comment vous souhaitez être notifié
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries({
          email_new_lot: 'Nouveau lot disponible',
          email_reservation: 'Nouvelle réservation',
          email_document: 'Nouveau document',
          sms_urgent: 'Alertes urgentes par SMS',
        }).map(([key, label]) => (
          <label key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            <input
              type="checkbox"
              checked={notifications[key as keyof typeof notifications]}
              onChange={(e) =>
                setNotifications({ ...notifications, [key]: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

// Blocked state component
function BlockedState({ reason }: { reason: string }) {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <Lock className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        Accès bloqué
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{reason}</p>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Veuillez contacter l'administrateur du projet pour plus d'informations.
      </p>
    </div>
  );
}

// Completed state component
function CompletedState({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        Configuration terminée !
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Votre compte est maintenant configuré et prêt à utiliser.
      </p>
      {onContinue && (
        <button
          onClick={onContinue}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Accéder au tableau de bord
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Helper functions

function getStepIcon(stepId: string) {
  const icons: Record<string, any> = {
    profile: User,
    company: Building2,
    kyc_identity: CreditCard,
    kyc_company: FileCheck,
    kyc_professional: Award,
    '2fa': Shield,
    documents: FileText,
    preferences: Settings,
  };
  return icons[stepId] || Circle;
}

function getRoleWelcomeMessage(role: ParticipantRole): string {
  const messages: Record<ParticipantRole, string> = {
    PROMOTER: 'Configurez votre compte promoteur',
    BROKER: 'Bienvenue ! Configurez votre compte courtier pour accéder au projet.',
    ARCHITECT: 'Bienvenue ! Configurez votre compte architecte.',
    ENGINEER: 'Bienvenue ! Configurez votre compte ingénieur.',
    NOTARY: 'Bienvenue ! Configurez votre compte notaire.',
    GENERAL_CONTRACTOR: 'Bienvenue ! Configurez votre compte entreprise générale.',
    SUPPLIER: 'Bienvenue ! Configurez votre compte fournisseur.',
    BUYER: 'Bienvenue ! Finalisez la configuration de votre espace acquéreur.',
  };
  return messages[role] || 'Complétez les étapes ci-dessous pour activer votre compte.';
}

function getRequiredDocumentsForRole(role: ParticipantRole) {
  const docs: Record<ParticipantRole, { id: string; label: string; description: string }[]> = {
    BROKER: [
      { id: 'license', label: 'Licence de courtage', description: 'Copie de votre licence professionnelle' },
      { id: 'insurance', label: 'Attestation RC', description: 'Assurance responsabilité civile professionnelle' },
    ],
    NOTARY: [
      { id: 'license', label: 'Brevet de notaire', description: 'Copie de votre brevet' },
      { id: 'oath', label: 'Attestation de prestation de serment', description: 'Document officiel' },
    ],
    ARCHITECT: [
      { id: 'diploma', label: 'Diplôme', description: 'Copie de votre diplôme d\'architecte' },
      { id: 'sia', label: 'Membre SIA/FSA', description: 'Attestation d\'adhésion (optionnel)' },
    ],
    ENGINEER: [
      { id: 'diploma', label: 'Diplôme', description: 'Copie de votre diplôme d\'ingénieur' },
    ],
    GENERAL_CONTRACTOR: [
      { id: 'insurance', label: 'Attestation RC', description: 'Assurance responsabilité civile' },
      { id: 'rc', label: 'Extrait RC', description: 'Extrait du registre du commerce' },
    ],
    SUPPLIER: [
      { id: 'rc', label: 'Extrait RC', description: 'Extrait du registre du commerce' },
    ],
    BUYER: [],
    PROMOTER: [],
  };
  return docs[role] || [];
}
