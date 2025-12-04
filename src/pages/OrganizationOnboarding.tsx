import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Building2,
  MapPin,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { RealProLogo } from '../components/branding/RealProLogo';

interface OnboardingData {
  organizationName: string;
  slug: string;
  address: string;
  city: string;
  canton: string;
  postalCode: string;
  ideNumber: string;
  language: 'FR' | 'DE' | 'IT' | 'EN';
}

export function OrganizationOnboarding() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    organizationName: '',
    slug: '',
    address: '',
    city: '',
    canton: '',
    postalCode: '',
    ideNumber: '',
    language: 'FR'
  });

  const cantons = [
    'Zürich', 'Bern', 'Luzern', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden',
    'Glarus', 'Zug', 'Fribourg', 'Solothurn', 'Basel-Stadt', 'Basel-Landschaft',
    'Schaffhausen', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
    'St. Gallen', 'Graubünden', 'Aargau', 'Thurgau', 'Ticino', 'Vaud',
    'Valais', 'Neuchâtel', 'Genève', 'Jura'
  ];

  const languages = [
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'EN', name: 'English', flag: '🇬🇧' }
  ];

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setData({
      ...data,
      organizationName: name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.organizationName,
          slug: data.slug,
          default_language: data.language,
          settings: {
            address: data.address,
            city: data.city,
            canton: data.canton,
            postal_code: data.postalCode,
            ide_number: data.ideNumber
          }
        })
        .select()
        .single();

      if (orgError) throw orgError;

      await supabase
        .from('user_organizations')
        .insert({
          user_id: user!.id,
          organization_id: orgData.id,
          is_default: true
        });

      const { data: adminRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'admin')
        .single();

      if (adminRole) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: user!.id,
            organization_id: orgData.id,
            role_id: adminRole.id
          });
      }

      localStorage.setItem('currentOrganizationId', orgData.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating organization:', error);
      alert('Erreur lors de la création de l\'organisation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return data.organizationName && data.slug;
    }
    if (step === 2) {
      return data.city && data.canton;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-brand-950/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <RealProLogo className="h-12" />
            </div>
            <h1 className="text-4xl font-semibold text-neutral-900 dark:text-white mb-3">
              Créez votre organisation
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Quelques informations pour démarrer
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                    ${s === step
                      ? 'bg-brand-600 text-white'
                      : s < step
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }
                  `}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`
                      w-16 h-1 mx-2 transition-all
                      ${s < step
                        ? 'bg-green-600'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      Informations de base
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Nom et identifiant de votre organisation
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nom de l'organisation *
                  </label>
                  <input
                    type="text"
                    value={data.organizationName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Immobilis SA"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Identifiant (slug) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      realpro.ch/
                    </span>
                    <input
                      type="text"
                      value={data.slug}
                      onChange={(e) => setData({ ...data, slug: e.target.value })}
                      placeholder="immobilis-sa"
                      className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Utilisé dans les URLs et doit être unique
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Numéro IDE (optionnel)
                  </label>
                  <input
                    type="text"
                    value={data.ideNumber}
                    onChange={(e) => setData({ ...data, ideNumber: e.target.value })}
                    placeholder="CHE-123.456.789"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      Localisation
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Adresse de votre organisation
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData({ ...data, address: e.target.value })}
                    placeholder="Ex: Rue du Lac 25"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={data.postalCode}
                      onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                      placeholder="1000"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData({ ...data, city: e.target.value })}
                      placeholder="Lausanne"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Canton *
                  </label>
                  <select
                    value={data.canton}
                    onChange={(e) => setData({ ...data, canton: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  >
                    <option value="">Sélectionner un canton</option>
                    {cantons.map((canton) => (
                      <option key={canton} value={canton}>
                        {canton}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      Préférences
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Langue et configuration initiale
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Langue par défaut
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setData({ ...data, language: lang.code as any })}
                        className={`
                          p-4 rounded-xl border-2 transition-all text-left
                          ${data.language === lang.code
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{lang.flag}</span>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {lang.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {lang.code}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-50 dark:bg-brand-950/20 rounded-xl border border-brand-200 dark:border-brand-900/30 p-4">
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-brand-900 dark:text-brand-100 mb-1">
                        Tout est prêt !
                      </h4>
                      <p className="text-sm text-brand-700 dark:text-brand-300">
                        Vous pourrez modifier ces paramètres à tout moment depuis les réglages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Créer l'organisation
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
