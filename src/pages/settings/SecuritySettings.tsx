import { useState, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useSecuritySettings, useUserSessions, useAuditLogs } from '../../hooks/useSettings';
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
  Download,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export function SecuritySettings() {
  const { user, loading: userLoading } = useCurrentUser();
  const { settings, loading: settingsLoading, saving, saveSettings, refetch: refetchSettings } = useSecuritySettings();
  const { sessions, loading: sessionsLoading, revokeSession, refetch: refetchSessions } = useUserSessions();
  const { logs: auditLogs, loading: logsLoading, refetch: refetchLogs } = useAuditLogs();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const loading = userLoading || settingsLoading;

  useEffect(() => {
    if (settings) {
      setTwoFactorEnabled(settings.enforce_2fa);
    }
  }, [settings]);

  const displaySessions = sessions.length > 0 ? sessions.map(s => ({
    id: s.id,
    device: s.device_info || 'Appareil inconnu',
    location: s.location || 'Localisation inconnue',
    ip: s.ip_address || '',
    timestamp: new Date(s.last_activity_at || s.created_at),
    current: s.is_current
  })) : [
    {
      id: '1',
      device: 'Session actuelle',
      location: 'Suisse',
      ip: '',
      timestamp: new Date(),
      current: true
    }
  ];

  const handleToggle2FA = async () => {
    const newValue = !twoFactorEnabled;
    const success = await saveSettings({ enforce_2fa: newValue });
    if (success) {
      setTwoFactorEnabled(newValue);
      toast.success(newValue ? '2FA active' : '2FA desactive');
    } else {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    const success = await revokeSession(sessionId);
    if (success) {
      toast.success('Session revoquee');
    } else {
      toast.error('Erreur lors de la revocation');
    }
  };

  const handleExportAuditLog = () => {
    if (auditLogs.length === 0) {
      toast.error('Aucun log a exporter');
      return;
    }
    const csvContent = auditLogs.map(log =>
      `"${format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}","${log.action}","${log.description || ''}","${log.entity_type || ''}"`
    ).join('\n');

    const header = '"Date","Action","Description","Type"\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('Journal exporte');
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

          <div className="p-4 bg-brand-50 dark:bg-blue-950/20 rounded-xl border border-brand-200 dark:border-brand-900/30">
            <p className="text-sm text-brand-900 dark:text-brand-100 font-medium mb-2">
              Exigences de mot de passe
            </p>
            <ul className="text-sm text-brand-700 dark:text-brand-300 space-y-1">
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

        {sessionsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="space-y-3">
            {displaySessions.map((login) => (
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
                      {login.location}{login.ip && ` - ${login.ip}`}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      {format(login.timestamp, "dd MMM yyyy 'a' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
                {!login.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeSession(login.id)}
                    className="gap-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Revoquer
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
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

        {logsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            Aucun evenement enregistre
          </div>
        ) : (
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
                      {format(new Date(log.created_at), "dd MMM HH:mm", { locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    {log.description}
                  </p>
                  {log.entity_type && (
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded">
                      {log.entity_type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => refetchLogs(100)}
            className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            Charger plus
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
