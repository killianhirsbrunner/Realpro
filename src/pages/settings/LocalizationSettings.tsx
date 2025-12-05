import { useState } from 'react';
import { useOrganization } from '../../hooks/useOrganization';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Globe, Check, MapPin, DollarSign, FileText } from 'lucide-react';

export function LocalizationSettings() {
  const { organization, loading } = useOrganization();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    language: 'fr',
    country: 'CH',
    currency: 'CHF',
    dateFormat: 'DD.MM.YYYY',
    vatRate: '7.7',
    timeZone: 'Europe/Zurich',
    numberFormat: 'space'
  });

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const cantons = [
    'Zürich', 'Bern', 'Luzern', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden',
    'Glarus', 'Zug', 'Fribourg', 'Solothurn', 'Basel-Stadt', 'Basel-Landschaft',
    'Schaffhausen', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
    'St. Gallen', 'Graubünden', 'Aargau', 'Thurgau', 'Ticino', 'Vaud',
    'Valais', 'Neuchâtel', 'Genève', 'Jura'
  ];

  const vatRates = [
    { value: '7.7', label: '7.7% - Taux normal' },
    { value: '3.7', label: '3.7% - Taux réduit (hébergement)' },
    { value: '2.5', label: '2.5% - Taux spécial' },
    { value: '0', label: '0% - Exonéré' }
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Saving localization settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            <Globe className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
              Localisation
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Langue, formats et paramètres régionaux
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <LoadingSpinner size="sm" />
              Enregistrement...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Langue de l'interface
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSettings({ ...settings, language: lang.code })}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                ${settings.language === lang.code
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
                    {lang.code.toUpperCase()}
                  </p>
                </div>
              </div>
              {settings.language === lang.code && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Localisation géographique
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Pays
              </label>
              <select
                value={settings.country}
                onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              >
                <option value="CH">Suisse</option>
                <option value="FR">France</option>
                <option value="DE">Allemagne</option>
                <option value="IT">Italie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Canton principal
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all">
                <option value="">Sélectionner un canton</option>
                {cantons.map((canton) => (
                  <option key={canton} value={canton}>
                    {canton}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Fuseau horaire
              </label>
              <input
                type="text"
                value={settings.timeZone}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Formats financiers
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Devise
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              >
                <option value="CHF">CHF - Franc suisse</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dollar américain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Taux TVA par défaut
              </label>
              <select
                value={settings.vatRate}
                onChange={(e) => setSettings({ ...settings, vatRate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              >
                {vatRates.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Format des nombres
              </label>
              <select
                value={settings.numberFormat}
                onChange={(e) => setSettings({ ...settings, numberFormat: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              >
                <option value="space">1 000 000.00 (espace)</option>
                <option value="apostrophe">1'000'000.00 (apostrophe suisse)</option>
                <option value="comma">1,000,000.00 (virgule)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Formats de documents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Format de date
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            >
              <option value="DD.MM.YYYY">DD.MM.YYYY (suisse)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
            </select>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              Exemple: {new Date().toLocaleDateString('fr-CH')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Format de facture QR
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all">
              <option value="qr-bill">QR-facture suisse (standard)</option>
              <option value="sepa">SEPA (UE)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 dark:bg-blue-950/20 rounded-xl border border-brand-200 dark:border-brand-900/30 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-brand-900 dark:text-brand-100 mb-1">
              Paramètres régionaux suisses
            </h4>
            <p className="text-sm text-brand-700 dark:text-brand-300">
              RealPro est optimisé pour la Suisse avec support complet des formats locaux,
              TVA, QR-factures et conformité légale helvétique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
