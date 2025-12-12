import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { Building2, Home, Briefcase, ExternalLink, ArrowRight, Loader2, AlertCircle, Play } from 'lucide-react';

const appConfig = {
  'ppe-admin': {
    name: 'PPE Admin',
    tagline: 'Administration de copropriétés',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    port: 5173,
    devCommand: 'pnpm --filter ppe-admin dev',
  },
  'regie': {
    name: 'Régie',
    tagline: 'Gestion locative immobilière',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    port: 5174,
    devCommand: 'pnpm --filter regie dev',
  },
  'promoteur': {
    name: 'Promoteur',
    tagline: 'Promotion immobilière',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-600',
    port: 5175,
    devCommand: 'pnpm --filter promoteur dev',
  },
};

export function AppLauncher() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const app = appConfig[appId as keyof typeof appConfig];
  const [isChecking, setIsChecking] = useState(true);
  const [isAppRunning, setIsAppRunning] = useState(false);

  useEffect(() => {
    if (!app) return;

    // Check if the app is running by trying to fetch it
    const checkApp = async () => {
      setIsChecking(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        await fetch(`http://localhost:${app.port}`, {
          mode: 'no-cors',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        setIsAppRunning(true);

        // Auto-redirect if app is running
        setTimeout(() => {
          window.location.href = `http://localhost:${app.port}`;
        }, 1000);
      } catch {
        setIsAppRunning(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkApp();
  }, [app]);

  if (!app) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Application non trouvée
            </h1>
            <p className="text-neutral-500 mb-8">
              L'application demandée n'existe pas.
            </p>
            <Link to="/apps">
              <Button>
                Voir toutes les applications
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Icon = app.icon;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${app.color} flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {app.name}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            {app.tagline}
          </p>

          {isChecking ? (
            <div className="flex items-center justify-center gap-2 text-neutral-500 mb-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Vérification de l'application...</span>
            </div>
          ) : isAppRunning ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirection en cours...</span>
            </div>
          ) : (
            <div className="mb-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Application non démarrée
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                    L'application {app.name} n'est pas encore lancée. Pour la démarrer, exécutez la commande suivante dans votre terminal :
                  </p>
                  <div className="bg-neutral-900 dark:bg-neutral-950 rounded-lg p-3 font-mono text-sm text-emerald-400 mb-4">
                    {app.devCommand}
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Une fois démarrée, elle sera accessible sur le port {app.port}.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {isAppRunning && (
              <a href={`http://localhost:${app.port}`} className="block">
                <Button size="lg" className={`w-full ${app.bgColor} hover:opacity-90 text-white border-0`}>
                  Ouvrir {app.name}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            )}

            {!isAppRunning && !isChecking && (
              <a href={`http://localhost:${app.port}`} target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" className={`w-full ${app.bgColor} hover:opacity-90 text-white border-0`}>
                  <Play className="w-4 h-4 mr-2" />
                  Essayer d'ouvrir {app.name}
                </Button>
              </a>
            )}

            <Link to="/apps" className="block">
              <Button size="lg" variant="outline" className="w-full">
                Voir toutes les applications
              </Button>
            </Link>

            <Link to="/dashboard" className="block">
              <Button size="lg" variant="ghost" className="w-full text-neutral-600 dark:text-neutral-400">
                Aller au Dashboard principal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
