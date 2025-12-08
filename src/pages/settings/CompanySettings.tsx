import { useState, useEffect } from 'react';
import { useOrganization } from '../../hooks/useOrganization';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Building2, Save, RefreshCw, MapPin, Phone, Mail, Globe, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyInfo {
  name: string;
  legal_name: string;
  ide_number: string;
  vat_number: string;
  address: string;
  address_line2: string;
  postal_code: string;
  city: string;
  canton: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  founded_year: string;
  employees_count: string;
}

const defaultCompanyInfo: CompanyInfo = {
  name: '',
  legal_name: '',
  ide_number: '',
  vat_number: '',
  address: '',
  address_line2: '',
  postal_code: '',
  city: '',
  canton: '',
  country: 'CH',
  phone: '',
  email: '',
  website: '',
  description: '',
  founded_year: '',
  employees_count: ''
};

const cantons = [
  'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE',
  'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
];

export function CompanySettings() {
  const { organization, loading: orgLoading } = useOrganization();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (organization) {
      fetchCompanyInfo();
    }
  }, [organization?.id]);

  const fetchCompanyInfo = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organization.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const metadata = data.metadata || {};
        setCompanyInfo({
          name: data.name || '',
          legal_name: metadata.legal_name || data.name || '',
          ide_number: metadata.ide_number || '',
          vat_number: metadata.vat_number || '',
          address: metadata.address || '',
          address_line2: metadata.address_line2 || '',
          postal_code: metadata.postal_code || '',
          city: metadata.city || '',
          canton: metadata.canton || '',
          country: metadata.country || 'CH',
          phone: metadata.phone || '',
          email: metadata.email || '',
          website: metadata.website || '',
          description: metadata.description || '',
          founded_year: metadata.founded_year || '',
          employees_count: metadata.employees_count || ''
        });
      }
    } catch (err) {
      console.error('Error fetching company info:', err);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!organization?.id) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('organizations')
        .update({
          name: companyInfo.name,
          metadata: {
            legal_name: companyInfo.legal_name,
            ide_number: companyInfo.ide_number,
            vat_number: companyInfo.vat_number,
            address: companyInfo.address,
            address_line2: companyInfo.address_line2,
            postal_code: companyInfo.postal_code,
            city: companyInfo.city,
            canton: companyInfo.canton,
            country: companyInfo.country,
            phone: companyInfo.phone,
            email: companyInfo.email,
            website: companyInfo.website,
            description: companyInfo.description,
            founded_year: companyInfo.founded_year,
            employees_count: companyInfo.employees_count
          }
        })
        .eq('id', organization.id);

      if (error) throw error;

      toast.success('Informations enregistrees');
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving company info:', err);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading || orgLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
            <Building2 className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
              Entreprise
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Informations legales et coordonnees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchCompanyInfo} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChanges} className="gap-2">
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Informations legales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Nom commercial
            </label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Nom de l'entreprise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Raison sociale
            </label>
            <input
              type="text"
              value={companyInfo.legal_name}
              onChange={(e) => handleChange('legal_name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Raison sociale complete"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Numero IDE
            </label>
            <input
              type="text"
              value={companyInfo.ide_number}
              onChange={(e) => handleChange('ide_number', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="CHE-123.456.789"
            />
            <p className="text-xs text-neutral-500 mt-1">Identifiant des entreprises suisses</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Numero TVA
            </label>
            <input
              type="text"
              value={companyInfo.vat_number}
              onChange={(e) => handleChange('vat_number', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="CHE-123.456.789 TVA"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Adresse
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={companyInfo.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Rue et numero"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Complement d'adresse
            </label>
            <input
              type="text"
              value={companyInfo.address_line2}
              onChange={(e) => handleChange('address_line2', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Batiment, etage, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              NPA
            </label>
            <input
              type="text"
              value={companyInfo.postal_code}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Localite
            </label>
            <input
              type="text"
              value={companyInfo.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Lausanne"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Canton
            </label>
            <select
              value={companyInfo.canton}
              onChange={(e) => handleChange('canton', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">Selectionner</option>
              {cantons.map(canton => (
                <option key={canton} value={canton}>{canton}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Pays
            </label>
            <select
              value={companyInfo.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="CH">Suisse</option>
              <option value="FR">France</option>
              <option value="DE">Allemagne</option>
              <option value="IT">Italie</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Telephone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="tel"
                value={companyInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="+41 21 123 45 67"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="contact@entreprise.ch"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Site web
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="url"
                value={companyInfo.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="https://www.entreprise.ch"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Informations complementaires
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Annee de creation
            </label>
            <input
              type="text"
              value={companyInfo.founded_year}
              onChange={(e) => handleChange('founded_year', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="2020"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Nombre d'employes
            </label>
            <select
              value={companyInfo.employees_count}
              onChange={(e) => handleChange('employees_count', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">Selectionner</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-25">11-25</option>
              <option value="26-50">26-50</option>
              <option value="51-100">51-100</option>
              <option value="100+">Plus de 100</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Description de l'entreprise
            </label>
            <textarea
              value={companyInfo.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              placeholder="Description de votre activite..."
            />
          </div>
        </div>
      </div>

      <div className="bg-brand-50 dark:bg-blue-950/20 rounded-xl border border-brand-200 dark:border-brand-900/30 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-brand-900 dark:text-brand-100 mb-1">
              Informations legales suisses
            </h4>
            <p className="text-sm text-brand-700 dark:text-brand-300">
              Ces informations seront utilisees sur vos documents officiels, contrats et factures QR.
              Assurez-vous qu'elles correspondent a votre inscription au Registre du Commerce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
