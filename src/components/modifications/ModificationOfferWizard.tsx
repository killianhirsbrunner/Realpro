import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, Upload, FileText,
  User, Building, DollarSign, Calendar, AlertCircle,
  CheckCircle, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface WizardStep {
  id: number;
  title: string;
  icon: any;
  description: string;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Informations générales',
    icon: FileText,
    description: 'Détails de base de l\'offre'
  },
  {
    id: 2,
    title: 'Client et Lot',
    icon: User,
    description: 'Sélection du client et du lot'
  },
  {
    id: 3,
    title: 'Fournisseur',
    icon: Building,
    description: 'Informations fournisseur'
  },
  {
    id: 4,
    title: 'Montants',
    icon: DollarSign,
    description: 'Détails financiers'
  },
  {
    id: 5,
    title: 'Documents',
    icon: Upload,
    description: 'Pièces jointes'
  },
  {
    id: 6,
    title: 'Révision',
    icon: CheckCircle,
    description: 'Vérification finale'
  }
];

interface FormData {
  // Step 1
  title: string;
  description: string;
  category: string;
  priority: string;

  // Step 2
  buyerId: string;
  lotId: string;

  // Step 3
  supplierId: string;
  supplierContact: string;
  supplierEmail: string;
  supplierPhone: string;

  // Step 4
  amountHT: number;
  vatRate: number;
  amountVAT: number;
  amountTotal: number;
  deadline: string;
  paymentTerms: string;

  // Step 5
  documents: File[];

  // Metadata
  notes: string;
}

interface ModificationOfferWizardProps {
  projectId: string;
  buyers?: any[];
  lots?: any[];
  suppliers?: any[];
  onComplete: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function ModificationOfferWizard({
  projectId,
  buyers = [],
  lots = [],
  suppliers = [],
  onComplete,
  onCancel
}: ModificationOfferWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'finitions',
    priority: 'medium',
    buyerId: '',
    lotId: '',
    supplierId: '',
    supplierContact: '',
    supplierEmail: '',
    supplierPhone: '',
    amountHT: 0,
    vatRate: 8.1,
    amountVAT: 0,
    amountTotal: 0,
    deadline: '',
    paymentTerms: '30_days',
    documents: [],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };

      // Auto-calculate VAT
      if ('amountHT' in updates || 'vatRate' in updates) {
        const ht = newData.amountHT || 0;
        const rate = newData.vatRate || 0;
        newData.amountVAT = (ht * rate) / 100;
        newData.amountTotal = ht + newData.amountVAT;
      }

      return newData;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Titre requis';
        if (!formData.description.trim()) newErrors.description = 'Description requise';
        break;
      case 2:
        if (!formData.buyerId) newErrors.buyerId = 'Client requis';
        if (!formData.lotId) newErrors.lotId = 'Lot requis';
        break;
      case 3:
        if (!formData.supplierId) newErrors.supplierId = 'Fournisseur requis';
        break;
      case 4:
        if (formData.amountHT <= 0) newErrors.amountHT = 'Montant invalide';
        if (!formData.deadline) newErrors.deadline = 'Échéance requise';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length));
    } else {
      toast.error('Veuillez remplir tous les champs requis');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Veuillez vérifier les informations');
      return;
    }

    setLoading(true);
    try {
      await onComplete(formData);
      toast.success('Offre créée avec succès !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? 'bg-realpro-turquoise border-realpro-turquoise text-white scale-110'
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-neutral-300 text-neutral-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-realpro-turquoise'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-neutral-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 hidden md:block">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-neutral-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-neutral-900">Informations générales</h3>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Titre de l'offre *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="Ex: Modification cuisine - Remplacement plan de travail"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description détaillée *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="Décrivez en détail la modification demandée..."
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Catégorie
          </label>
          <select
            value={formData.category}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
          >
            <option value="finitions">Finitions</option>
            <option value="equipements">Équipements</option>
            <option value="menuiserie">Menuiserie</option>
            <option value="sanitaire">Sanitaire</option>
            <option value="electricite">Électricité</option>
            <option value="plomberie">Plomberie</option>
            <option value="carrelage">Carrelage</option>
            <option value="peinture">Peinture</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Priorité
          </label>
          <select
            value={formData.priority}
            onChange={(e) => updateFormData({ priority: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-neutral-900">Client et Lot</h3>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Client *
        </label>
        <select
          value={formData.buyerId}
          onChange={(e) => updateFormData({ buyerId: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent ${
            errors.buyerId ? 'border-red-500' : 'border-neutral-300'
          }`}
        >
          <option value="">Sélectionnez un client</option>
          {buyers.map((buyer) => (
            <option key={buyer.id} value={buyer.id}>
              {buyer.first_name} {buyer.last_name} - {buyer.email}
            </option>
          ))}
        </select>
        {errors.buyerId && (
          <p className="text-red-600 text-sm mt-1">{errors.buyerId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Lot concerné *
        </label>
        <select
          value={formData.lotId}
          onChange={(e) => updateFormData({ lotId: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent ${
            errors.lotId ? 'border-red-500' : 'border-neutral-300'
          }`}
        >
          <option value="">Sélectionnez un lot</option>
          {lots.map((lot) => (
            <option key={lot.id} value={lot.id}>
              {lot.reference} - {lot.name} ({lot.type})
            </option>
          ))}
        </select>
        {errors.lotId && (
          <p className="text-red-600 text-sm mt-1">{errors.lotId}</p>
        )}
      </div>

      {formData.buyerId && formData.lotId && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Sélection validée
              </p>
              <p className="text-sm text-blue-700 mt-1">
                L'offre sera liée à ce client et ce lot
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-neutral-900">Fournisseur</h3>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Fournisseur *
        </label>
        <select
          value={formData.supplierId}
          onChange={(e) => updateFormData({ supplierId: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent ${
            errors.supplierId ? 'border-red-500' : 'border-neutral-300'
          }`}
        >
          <option value="">Sélectionnez un fournisseur</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {errors.supplierId && (
          <p className="text-red-600 text-sm mt-1">{errors.supplierId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contact
          </label>
          <input
            type="text"
            value={formData.supplierContact}
            onChange={(e) => updateFormData({ supplierContact: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
            placeholder="Nom du contact"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.supplierEmail}
            onChange={(e) => updateFormData({ supplierEmail: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
            placeholder="contact@fournisseur.ch"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          value={formData.supplierPhone}
          onChange={(e) => updateFormData({ supplierPhone: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
          placeholder="+41 XX XXX XX XX"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-neutral-900">Montants</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Montant HT (CHF) *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amountHT}
            onChange={(e) => updateFormData({ amountHT: parseFloat(e.target.value) || 0 })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent ${
              errors.amountHT ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="0.00"
          />
          {errors.amountHT && (
            <p className="text-red-600 text-sm mt-1">{errors.amountHT}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Taux TVA (%)
          </label>
          <select
            value={formData.vatRate}
            onChange={(e) => updateFormData({ vatRate: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
          >
            <option value="8.1">8.1% (taux normal)</option>
            <option value="3.8">3.8% (taux réduit)</option>
            <option value="2.6">2.6% (taux spécial)</option>
            <option value="0">0% (exonéré)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Montant TVA (CHF)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amountVAT.toFixed(2)}
            readOnly
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50"
          />
        </div>
      </div>

      <div className="p-4 bg-realpro-turquoise bg-opacity-10 border-2 border-realpro-turquoise rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-neutral-900">
            Montant Total TTC
          </span>
          <span className="text-2xl font-bold text-realpro-turquoise">
            {formData.amountTotal.toFixed(2)} CHF
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Échéance *
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => updateFormData({ deadline: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent ${
              errors.deadline ? 'border-red-500' : 'border-neutral-300'
            }`}
          />
          {errors.deadline && (
            <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Conditions de paiement
          </label>
          <select
            value={formData.paymentTerms}
            onChange={(e) => updateFormData({ paymentTerms: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
          >
            <option value="immediate">Immédiat</option>
            <option value="15_days">15 jours</option>
            <option value="30_days">30 jours</option>
            <option value="45_days">45 jours</option>
            <option value="60_days">60 jours</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-neutral-900">Documents</h3>

      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <p className="text-sm text-neutral-600 mb-4">
          Glissez-déposez vos fichiers ici ou cliquez pour parcourir
        </p>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              updateFormData({ documents: Array.from(e.target.files) });
            }
          }}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-realpro-turquoise text-white rounded-lg hover:bg-opacity-90 cursor-pointer transition-colors"
        >
          <Upload className="w-5 h-5" />
          Choisir des fichiers
        </label>
        <p className="text-xs text-neutral-500 mt-4">
          Formats acceptés: PDF, JPG, PNG, Excel, Word (max 10 MB par fichier)
        </p>
      </div>

      {formData.documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-700">
            Fichiers sélectionnés ({formData.documents.length})
          </h4>
          {formData.documents.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{file.name}</p>
                  <p className="text-xs text-neutral-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const newDocs = formData.documents.filter((_, i) => i !== index);
                  updateFormData({ documents: newDocs });
                }}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Notes complémentaires
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
          placeholder="Ajoutez des notes ou commentaires..."
        />
      </div>
    </div>
  );

  const renderStep6 = () => {
    const selectedBuyer = buyers.find(b => b.id === formData.buyerId);
    const selectedLot = lots.find(l => l.id === formData.lotId);
    const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-neutral-900">Révision et Confirmation</h3>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Informations complètes
              </p>
              <p className="text-sm text-green-700 mt-1">
                Vérifiez les informations ci-dessous avant de soumettre l'offre
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg divide-y">
          {/* General Info */}
          <div className="p-4">
            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-realpro-turquoise" />
              Informations générales
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Titre:</span>
                <span className="font-medium">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Catégorie:</span>
                <span className="font-medium capitalize">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Priorité:</span>
                <span className="font-medium capitalize">{formData.priority}</span>
              </div>
            </div>
          </div>

          {/* Client & Lot */}
          <div className="p-4">
            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-realpro-turquoise" />
              Client et Lot
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Client:</span>
                <span className="font-medium">
                  {selectedBuyer ? `${selectedBuyer.first_name} ${selectedBuyer.last_name}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Lot:</span>
                <span className="font-medium">
                  {selectedLot ? `${selectedLot.reference} - ${selectedLot.name}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier */}
          <div className="p-4">
            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-realpro-turquoise" />
              Fournisseur
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Nom:</span>
                <span className="font-medium">{selectedSupplier?.name || 'N/A'}</span>
              </div>
              {formData.supplierContact && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Contact:</span>
                  <span className="font-medium">{formData.supplierContact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amounts */}
          <div className="p-4">
            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-realpro-turquoise" />
              Montants
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Montant HT:</span>
                <span className="font-medium">{formData.amountHT.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">TVA ({formData.vatRate}%):</span>
                <span className="font-medium">{formData.amountVAT.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-neutral-900 font-semibold">Total TTC:</span>
                <span className="font-bold text-realpro-turquoise text-lg">
                  {formData.amountTotal.toFixed(2)} CHF
                </span>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-neutral-600">Échéance:</span>
                <span className="font-medium">
                  {new Date(formData.deadline).toLocaleDateString('fr-CH')}
                </span>
              </div>
            </div>
          </div>

          {/* Documents */}
          {formData.documents.length > 0 && (
            <div className="p-4">
              <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <Upload className="w-5 h-5 text-realpro-turquoise" />
                Documents ({formData.documents.length})
              </h4>
              <div className="space-y-1 text-sm">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                Action après soumission
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Un workflow d'approbation sera automatiquement démarré. Le client recevra une notification pour valider cette offre.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">
            Nouvelle Offre de Modification
          </h2>
          <p className="text-neutral-600 mt-2">
            Suivez les étapes pour créer une offre complète
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Annuler
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Précédent
              </button>
            )}

            {currentStep < WIZARD_STEPS.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-realpro-turquoise text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Créer l'offre
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
