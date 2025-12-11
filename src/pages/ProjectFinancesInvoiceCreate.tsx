import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Save, User, Calendar, DollarSign, Receipt, Hash, FileCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../hooks/useToast';
import { useBuyers } from '../hooks/useBuyers';

interface InvoiceFormData {
  invoice_number: string;
  buyer_id: string;
  montant_total: string;
  date_emission: string;
  date_echeance: string;
  description: string;
  type: 'acompte' | 'appel_fonds' | 'solde' | 'travaux_supplementaires' | 'autre';
  status: 'draft' | 'sent';
  reference_qr: string;
  notes: string;
}

export function ProjectFinancesInvoiceCreate() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { buyers, loading: buyersLoading } = useBuyers(projectId!);

  const [formData, setFormData] = useState<InvoiceFormData>({
    invoice_number: '',
    buyer_id: '',
    montant_total: '',
    date_emission: new Date().toISOString().split('T')[0],
    date_echeance: '',
    description: '',
    type: 'appel_fonds',
    status: 'draft',
    reference_qr: '',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({});

  const invoiceTypes = [
    { value: 'acompte', label: 'Acompte' },
    { value: 'appel_fonds', label: 'Appel de fonds' },
    { value: 'solde', label: 'Solde' },
    { value: 'travaux_supplementaires', label: 'Travaux supplémentaires' },
    { value: 'autre', label: 'Autre' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InvoiceFormData, string>> = {};

    if (!formData.invoice_number.trim()) {
      newErrors.invoice_number = 'Le numéro de facture est requis';
    }

    if (!formData.buyer_id) {
      newErrors.buyer_id = 'Veuillez sélectionner un acheteur';
    }

    if (!formData.montant_total || parseFloat(formData.montant_total) <= 0) {
      newErrors.montant_total = 'Le montant doit être supérieur à 0';
    }

    if (!formData.date_echeance) {
      newErrors.date_echeance = 'La date d\'échéance est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('error', 'Veuillez corriger les erreurs du formulaire');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from('buyer_invoices').insert({
        project_id: projectId,
        buyer_id: formData.buyer_id,
        invoice_number: formData.invoice_number,
        montant_total: parseFloat(formData.montant_total),
        date_emission: formData.date_emission,
        date_echeance: formData.date_echeance,
        description: formData.description || null,
        type: formData.type,
        status: formData.status,
        reference_qr: formData.reference_qr || null,
        notes: formData.notes || null,
        paid: false,
        paid_date: null,
      });

      if (error) throw error;

      showToast('success', 'Facture créée avec succès');
      navigate(`/projects/${projectId}/finances/invoices`);
    } catch (err) {
      console.error('Error creating invoice:', err);
      showToast('error', 'Erreur lors de la création de la facture');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-8 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: 'Finances', href: `/projects/${projectId}/finances` },
          { label: 'Factures', href: `/projects/${projectId}/finances/invoices` },
          { label: 'Nouvelle facture' },
        ]}
      />

      <RealProTopbar
        title="Nouvelle Facture"
        subtitle="Créer une facture pour un acheteur"
        actions={
          <div className="flex items-center gap-3">
            <Link to={`/projects/${projectId}/finances/invoices`}>
              <RealProButton variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </RealProButton>
            </Link>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Informations principales */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Informations de la facture
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Numéro, type et dates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Numéro de facture *
              </label>
              <Input
                type="text"
                value={formData.invoice_number}
                onChange={(e) => handleChange('invoice_number', e.target.value)}
                placeholder="FAC-2024-001"
                className={errors.invoice_number ? 'border-red-500' : ''}
              />
              {errors.invoice_number && (
                <p className="text-sm text-red-500 mt-1">{errors.invoice_number}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Receipt className="w-4 h-4 inline mr-2" />
                Type de facture
              </label>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {invoiceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date d'émission
              </label>
              <Input
                type="date"
                value={formData.date_emission}
                onChange={(e) => handleChange('date_emission', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date d'échéance *
              </label>
              <Input
                type="date"
                value={formData.date_echeance}
                onChange={(e) => handleChange('date_echeance', e.target.value)}
                className={errors.date_echeance ? 'border-red-500' : ''}
              />
              {errors.date_echeance && (
                <p className="text-sm text-red-500 mt-1">{errors.date_echeance}</p>
              )}
            </div>
          </div>
        </RealProCard>

        {/* Acheteur */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Acheteur
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Sélectionner l'acheteur pour cette facture
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Acheteur *
            </label>
            {buyersLoading ? (
              <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                Chargement des acheteurs...
              </div>
            ) : (
              <Select
                value={formData.buyer_id}
                onChange={(e) => handleChange('buyer_id', e.target.value)}
                className={errors.buyer_id ? 'border-red-500' : ''}
              >
                <option value="">Sélectionner un acheteur</option>
                {buyers?.map((buyer) => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.prenom} {buyer.nom} - Lot {buyer.lot_number || 'N/A'}
                  </option>
                ))}
              </Select>
            )}
            {errors.buyer_id && (
              <p className="text-sm text-red-500 mt-1">{errors.buyer_id}</p>
            )}
          </div>
        </RealProCard>

        {/* Montant */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Montant
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Montant total de la facture
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Montant total (CHF) *
              </label>
              <Input
                type="number"
                value={formData.montant_total}
                onChange={(e) => handleChange('montant_total', e.target.value)}
                placeholder="0"
                min="0"
                step="100"
                className={errors.montant_total ? 'border-red-500' : ''}
              />
              {errors.montant_total && (
                <p className="text-sm text-red-500 mt-1">{errors.montant_total}</p>
              )}
            </div>

            <div className="flex items-end">
              {formData.montant_total && (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-6 py-4 w-full">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Montant formaté</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(formData.montant_total)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </RealProCard>

        {/* Description et Notes */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Détails supplémentaires
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Description et informations complémentaires
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description de la facture..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Référence QR (IBAN)
              </label>
              <Input
                type="text"
                value={formData.reference_qr}
                onChange={(e) => handleChange('reference_qr', e.target.value)}
                placeholder="CH93 0076 2011 6238 5295 7"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Référence pour le bulletin de versement QR suisse
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Notes internes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Notes internes (non visibles sur la facture)..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
              />
            </div>
          </div>
        </RealProCard>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link to={`/projects/${projectId}/finances/invoices`}>
            <RealProButton variant="outline" type="button">
              Annuler
            </RealProButton>
          </Link>
          <RealProButton
            variant="outline"
            type="submit"
            onClick={() => handleChange('status', 'draft')}
            disabled={saving}
          >
            <FileText className="w-4 h-4" />
            Enregistrer comme brouillon
          </RealProButton>
          <RealProButton
            variant="primary"
            type="submit"
            onClick={() => handleChange('status', 'sent')}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Création...' : 'Créer et envoyer'}
          </RealProButton>
        </div>
      </form>
    </div>
  );
}

export default ProjectFinancesInvoiceCreate;
