import { useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Lock,
  Shield,
  Key,
  Smartphone,
  Clock,
  FileText,
  AlertTriangle,
  Check,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function SecuritySettings() {
  const { user, loading } = useCurrentUser();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const recentLogins = [
    {
      id: '1',
      device: 'Chrome sur Windows',
      location: 'Lausanne, Suisse',
      ip: '192.168.1.1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      current: true
    },
    {
      id: '2',
      device: 'Safari sur iPhone',
      location: 'Genève, Suisse',
      ip: '192.168.1.2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      current: false
    },
    {
      id: '3',
      device: 'Firefox sur macOS',
      location: 'Zurich, Suisse',
      ip: '192.168.1.3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      current: false
    }
  ];

  const auditLogs = [
    {
      id: '1',
      action: 'Modification de projet',
      details: 'Projet "Résidence Lac Léman" mis à jour',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      user: user?.first_name + ' ' + user?.last_name
    },
    {
      id: '2',
      action: 'Création d\'utilisateur',
      details: 'Nouvel utilisateur invité: jean.dupont@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      user: user?.first_name + ' ' + user?.last_name
    },
    {
      id: '3',
      action: 'Export de données',
      details: 'Export CFC vers Excel',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      user: user?.first_name + ' ' + user?.last_name
    }
  ];

  const handleToggle2FA = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(!twoFactorEnabled);
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportAuditLog = () => {
    console.log('Exporting audit log...');
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
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <Lock className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            Sécurité
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Authentification, accès et audit
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Smartphone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Authentification à deux facteurs (2FA)
          </h2>
        </div>

        <div className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium text-neutral-900 dark:text-white">
                Protection renforcée du compte
              </p>
              {twoFactorEnabled && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  Activé
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Ajoutez une couche de sécurité supplémentaire en demandant un code de vérification
              lors de chaque connexion.
            </p>
            {twoFactorEnabled && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                Configuré via application mobile
              </p>
            )}
          </div>
          <Button
            onClick={handleToggle2FA}
            disabled={saving}
            variant={twoFactorEnabled ? 'outline' : 'default'}
            className="ml-4"
          >
            {saving ? (
              <LoadingSpinner size="sm" />
            ) : twoFactorEnabled ? (
              'Désactiver'
            ) : (
              'Activer'
            )}
          </Button>
        </div>

        {!twoFactorEnabled && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Recommandation de sécurité
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Nous vous recommandons fortement d'activer l'authentification à deux facteurs
                  pour protéger votre compte contre les accès non autorisés.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Key className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Mot de passe
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <div>
              <p className="font-medium text-neutral-900 dark:text-white mb-1">
                Changer le mot de passe
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Dernière modification il y a 3 mois
              </p>
            </div>
            <Button variant="outline">
              Modifier
            </Button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/30">
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
              Exigences de mot de passe
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Au moins 12 caractères
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Majuscules et minuscules
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Au moins un chiffre
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Au moins un caractère spécial
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Connexions récentes
            </h2>
          </div>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Dernières 30 jours
          </span>
        </div>

        <div className="space-y-3">
          {recentLogins.map((login) => (
            <div
              key={login.id}
              className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
            >
              <div className="flex gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${login.current
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                  }
                `}>
                  <Shield className={`
                    w-5 h-5
                    ${login.current
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-neutral-600 dark:text-neutral-400'
                    }
                  `} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {login.device}
                    </p>
                    {login.current && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                        Session actuelle
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {login.location} • {login.ip}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    {format(login.timestamp, "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
              {!login.current && (
                <Button variant="outline" size="sm">
                  Révoquer
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Journal d'audit
            </h2>
          </div>
          <Button variant="outline" onClick={handleExportAuditLog} className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium text-neutral-900 dark:text-white truncate">
                    {log.action}
                  </p>
                  <span className="text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap">
                    {format(log.timestamp, "dd MMM HH:mm", { locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {log.details}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  Par {log.user}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Voir l'historique complet
          </button>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900/30 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
              Conformité GDPR et LPD suisse
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              RealPro est conforme aux réglementations suisses et européennes sur la protection
              des données. Tous les journaux d'audit sont conservés de manière sécurisée et
              chiffrée selon les standards ISO 27001.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
