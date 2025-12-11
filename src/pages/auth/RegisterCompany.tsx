import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { supabase } from '../../lib/supabase';
import { AlertCircle, ArrowRight, Check, Building2, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const SWISS_CANTONS = [
  { value: 'AG', label: 'Argovie (AG)' },
  { value: 'BE', label: 'Berne (BE)' },
  { value: 'FR', label: 'Fribourg (FR)' },
  { value: 'GE', label: 'Genève (GE)' },
  { value: 'JU', label: 'Jura (JU)' },
  { value: 'LU', label: 'Lucerne (LU)' },
  { value: 'NE', label: 'Neuchâtel (NE)' },
  { value: 'TI', label: 'Tessin (TI)' },
  { value: 'VD', label: 'Vaud (VD)' },
  { value: 'VS', label: 'Valais (VS)' },
  { value: 'ZH', label: 'Zurich (ZH)' },
];

const COMPANY_TYPES = [
  { value: 'SA', label: 'SA - Société Anonyme' },
  { value: 'SARL', label: 'Sàrl - Société à responsabilité limitée' },
  { value: 'EI', label: 'Entreprise individuelle' },
  { value: 'SC', label: 'Société en commandite' },
  { value: 'SNC', label: 'Société en nom collectif' },
  { value: 'COOP', label: 'Société coopérative' },
  { value: 'FOUNDATION', label: 'Fondation' },
  { value: 'ASSOCIATION', label: 'Association' },
];

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employés' },
  { value: '11-50', label: '11-50 employés' },
  { value: '51-200', label: '51-200 employés' },
  { value: '201-500', label: '201-500 employés' },
  { value: '500+', label: '500+ employés' },
];

const ACTIVITY_SECTORS = [
  { value: 'PROMOTION', label: 'Promotion immobilière' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'ENGINEERING', label: 'Ingénierie' },
  { value: 'REAL_ESTATE', label: 'Gestion immobilière' },
  { value: 'BROKERAGE', label: 'Courtage immobilier' },
  { value: 'NOTARY', label: 'Notariat' },
  { value: 'OTHER', label: 'Autre' },
];

export function RegisterCompany() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'SA',
    ideNumber: '',
    vatNumber: '',
    activitySector: 'PROMOTION',
    companySize: '1-10',
    address: '',
    postalCode: '',
    city: '',
    canton: 'VD',
    phone: '',
    website: '',
    description: '',
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    directPhone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.companyName.trim()) {
      setError('Le nom de l\'entreprise est requis');
      return false;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setError('L\'adresse complète est requise');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Le téléphone de l\'entreprise est requis');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Le nom et prénom sont requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!formData.position.trim()) {
      setError('La fonction est requise');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) return;

    setLoading(true);

    try {
      // 1. Créer le compte auth - le trigger handle_new_user() crée automatiquement
      // l'utilisateur, l'organisation par défaut et assigne le rôle org_admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.companyName,
            position: formData.position
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Récupérer l'organisation créée automatiquement par le trigger
        const { data: userOrg } = await supabase
          .from('user_organizations')
          .select('organization_id')
          .eq('user_id', authData.user.id)
          .single();

        if (userOrg?.organization_id) {
          // 3. Mettre à jour l'organisation avec les informations de l'entreprise
          const { error: updateOrgError } = await supabase
            .from('organizations')
            .update({
              name: formData.companyName,
              settings: {
                legal_form: formData.companyType,
                ide_number: formData.ideNumber || null,
                vat_number: formData.vatNumber || null,
                activity_sector: formData.activitySector,
                company_size: formData.companySize,
                address: formData.address,
                postal_code: formData.postalCode,
                city: formData.city,
                canton: formData.canton,
                phone: formData.phone,
                website: formData.website || null,
                description: formData.description || null
              }
            })
            .eq('id', userOrg.organization_id);

          if (updateOrgError) {
            console.error('Error updating organization:', updateOrgError);
          }
        }

        // 4. Mettre à jour le profil utilisateur avec le téléphone direct
        if (formData.directPhone) {
          await supabase
            .from('users')
            .update({ phone: formData.directPhone })
            .eq('id', authData.user.id);
        }

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-brand-100/20 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-900 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Créer votre compte entreprise
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Commencez votre essai gratuit de 14 jours
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'} font-semibold transition-colors`}>
              1
            </div>
            <div className={`h-1 w-24 ${step >= 2 ? 'bg-brand-600' : 'bg-neutral-200 dark:bg-neutral-800'} transition-colors`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'} font-semibold transition-colors`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 px-8">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Entreprise</span>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Contact principal</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <Building2 className="w-5 h-5 text-brand-600" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Informations de l'entreprise
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nom de l'entreprise <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="Promotions SA"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Forme juridique <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.companyType}
                    onChange={(e) => updateField('companyType', e.target.value)}
                    disabled={loading}
                    className="h-11 rounded-xl"
                  >
                    {COMPANY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Secteur d'activité <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.activitySector}
                    onChange={(e) => updateField('activitySector', e.target.value)}
                    disabled={loading}
                    className="h-11 rounded-xl"
                  >
                    {ACTIVITY_SECTORS.map(sector => (
                      <option key={sector.value} value={sector.value}>{sector.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Numéro IDE (optionnel)
                  </label>
                  <Input
                    value={formData.ideNumber}
                    onChange={(e) => updateField('ideNumber', e.target.value)}
                    placeholder="CHE-123.456.789"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Numéro TVA (optionnel)
                  </label>
                  <Input
                    value={formData.vatNumber}
                    onChange={(e) => updateField('vatNumber', e.target.value)}
                    placeholder="CHE-123.456.789 TVA"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Rue de la Gare 15"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    NPA <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    placeholder="1003"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Lausanne"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Canton <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.canton}
                    onChange={(e) => updateField('canton', e.target.value)}
                    disabled={loading}
                    className="h-11 rounded-xl"
                  >
                    {SWISS_CANTONS.map(canton => (
                      <option key={canton.value} value={canton.value}>{canton.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+41 21 123 45 67"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Site web (optionnel)
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://www.entreprise.ch"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Taille de l'entreprise
                </label>
                <Select
                  value={formData.companySize}
                  onChange={(e) => updateField('companySize', e.target.value)}
                  disabled={loading}
                  className="h-11 rounded-xl"
                >
                  {COMPANY_SIZES.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description (optionnel)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Décrivez brièvement votre activité..."
                  disabled={loading}
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-medium shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <User className="w-5 h-5 text-brand-600" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Contact principal
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Jean"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Dupont"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Fonction <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.position}
                  onChange={(e) => updateField('position', e.target.value)}
                  placeholder="Directeur, Gérant, Chef de projet..."
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email professionnel <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="jean.dupont@entreprise.ch"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Téléphone direct (optionnel)
                </label>
                <Input
                  type="tel"
                  value={formData.directPhone}
                  onChange={(e) => updateField('directPhone', e.target.value)}
                  placeholder="+41 79 123 45 67"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1.5">
                  Minimum 8 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1 h-12 px-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-medium shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Créer mon compte
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-6 text-xs text-neutral-500 dark:text-neutral-500 pt-2 justify-center flex-wrap">
                <span className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span>14 jours gratuits</span>
                </span>
                <span className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span>Sans carte bancaire</span>
                </span>
                <span className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span>Sans engagement</span>
                </span>
              </div>

              <p className="text-xs text-center text-neutral-600 dark:text-neutral-400 pt-2">
                En créant un compte, vous acceptez nos{' '}
                <Link to="/legal/cgu" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                  CGU
                </Link>{' '}
                et notre{' '}
                <Link to="/legal/privacy" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                  politique de confidentialité
                </Link>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
