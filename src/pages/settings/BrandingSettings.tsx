import { useState, useEffect, useRef } from 'react';
import { useOrganization } from '../../hooks/useOrganization';
import { useBrandingSettings } from '../../hooks/useSettings';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Palette, Upload, Eye, Check, Sparkles, Save, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

export function BrandingSettings() {
  const { subscription, loading: orgLoading } = useOrganization();
  const { settings, loading, saving, error, saveSettings, uploadLogo, refetch } = useBrandingSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localSettings, setLocalSettings] = useState({
    logoUrl: '',
    primaryColor: '#0891b2',
    accentColor: '#0e7490',
    showLogoOnDocuments: true,
    documentHeaderColor: '#0891b2',
    emailSignature: true
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isPro = subscription?.plan.slug === 'enterprise' || subscription?.plan.slug === 'pro';

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        logoUrl: settings.logo_url || '',
        primaryColor: settings.primary_color,
        accentColor: settings.accent_color,
        showLogoOnDocuments: settings.show_logo_on_documents,
        documentHeaderColor: settings.document_header_color,
        emailSignature: settings.show_logo_in_emails
      });
    }
  }, [settings]);

  const handleChange = (key: string, value: string | boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez selectionner une image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas depasser 2 Mo');
      return;
    }

    setUploading(true);
    const url = await uploadLogo(file);
    setUploading(false);

    if (url) {
      handleChange('logoUrl', url);
      toast.success('Logo telecharge');
    } else {
      toast.error('Erreur lors du telechargement');
    }
  };

  const colorPresets = [
    { name: 'RealPro Turquoise', color: '#0891b2' },
    { name: 'Bleu Ocean', color: '#0ea5e9' },
    { name: 'Vert moderne', color: '#10b981' },
    { name: 'Orange dynamique', color: '#f59e0b' },
    { name: 'Rouge elegant', color: '#ef4444' },
    { name: 'Slate pro', color: '#475569' }
  ];

  const handleSave = async () => {
    const success = await saveSettings({
      logo_url: localSettings.logoUrl || null,
      primary_color: localSettings.primaryColor,
      accent_color: localSettings.accentColor,
      show_logo_on_documents: localSettings.showLogoOnDocuments,
      document_header_color: localSettings.documentHeaderColor,
      show_logo_in_emails: localSettings.emailSignature
    });

    if (success) {
      toast.success('Parametres de branding enregistres');
      setHasChanges(false);
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (loading || orgLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
            <Palette className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
              Branding
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Personnalisez l'apparence de votre espace
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-50 to-neutral-50 dark:from-brand-950/20 dark:to-neutral-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-12 text-center">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Fonctionnalité Premium
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            La personnalisation du branding est disponible avec les plans Pro et Enterprise.
            Ajoutez votre logo, personnalisez vos couleurs et renforcez votre image de marque.
          </p>
          <Button size="lg" className="gap-2">
            <Sparkles className="w-5 h-5" />
            Passer au plan Pro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
            <Palette className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
              Branding
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Personnalisez l'apparence de votre espace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={refetch} disabled={loading} className="gap-2">
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
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Logo de l'entreprise
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="aspect-video bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center relative">
              {localSettings.logoUrl ? (
                <>
                  <img src={localSettings.logoUrl} alt="Logo" className="max-h-32 object-contain" />
                  <button
                    onClick={() => handleChange('logoUrl', '')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Aucun logo telecharge
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Telechargement...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Telecharger un logo
                  </>
                )}
              </Button>
              <p className="text-xs text-neutral-500 mt-2">PNG, JPG ou SVG. Max 2 Mo.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Logo sur les documents PDF
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Afficher votre logo sur les exports et contrats
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showLogoOnDocuments}
                  onChange={(e) => handleChange('showLogoOnDocuments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-brand-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Signature email personnalisée
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Inclure votre logo dans les emails
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.emailSignature}
                  onChange={(e) => handleChange('emailSignature', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-brand-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Couleurs de marque
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Couleur principale
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleChange('primaryColor', preset.color)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all
                    ${localSettings.primaryColor === preset.color
                      ? 'border-neutral-900 dark:border-white'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                    }
                  `}
                >
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ backgroundColor: preset.color }}
                  ></div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                    {preset.name}
                  </p>
                  {localSettings.primaryColor === preset.color && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white dark:text-neutral-900" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Couleur personnalisée
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={localSettings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="h-12 w-24 rounded-xl cursor-pointer"
              />
              <input
                type="text"
                value={localSettings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="#0891b2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Aperçu
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Interface utilisateur
            </p>
            <div className="space-y-3">
              <div
                className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: localSettings.primaryColor }}
              >
                Bouton principal
              </div>
              <div
                className="h-10 rounded-lg flex items-center justify-center border-2 font-medium"
                style={{ borderColor: localSettings.primaryColor, color: localSettings.primaryColor }}
              >
                Bouton secondaire
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Documents PDF
            </p>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div
                className="h-2 rounded mb-3"
                style={{ backgroundColor: localSettings.documentHeaderColor }}
              ></div>
              {localSettings.logoUrl && (
                <div className="mb-3">
                  <img src={localSettings.logoUrl} alt="Logo preview" className="w-20 h-8 object-contain" />
                </div>
              )}
              <div className="space-y-2">
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5"></div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
              Cohérence de marque
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Vos paramètres de branding seront appliqués à l'interface, aux documents PDF,
              aux exports Excel et aux emails automatiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
