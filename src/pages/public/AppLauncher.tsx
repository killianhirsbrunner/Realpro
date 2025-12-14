import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { Building2, Home, Briefcase, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';

const appConfig = {
  'ppe-admin': {
    name: 'PPE Admin',
    tagline: 'Administration de copropriétés',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    url: 'http://localhost:3002',
  },
  'regie': {
    name: 'Régie',
    tagline: 'Gestion locative immobilière',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    url: 'http://localhost:3003',
  },
  'promoteur': {
    name: 'Promoteur',
    tagline: 'Promotion immobilière',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    url: 'http://localhost:3001',
  },
};

export function AppLauncher() {
  const { appId } = useParams<{ appId: string }>();
  const app = appConfig[appId as keyof typeof appConfig];

  useEffect(() => {
    // Auto-redirect after 2 seconds if app exists
    if (app) {
      const timer = setTimeout(() => {
        window.location.href = app.url;
      }, 2000);
      return () => clearTimeout(timer);
    }
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
        <div className="text-center max-w-md mx-auto px-6">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${app.color} flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {app.name}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            {app.tagline}
          </p>

          <div className="flex items-center justify-center gap-2 text-neutral-500 mb-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Redirection en cours...</span>
          </div>

          <div className="space-y-3">
            <a href={app.url} className="block">
              <Button size="lg" className={`w-full ${app.bgColor} hover:opacity-90 text-white border-0`}>
                Ouvrir {app.name}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>

            <Link to="/apps" className="block">
              <Button size="lg" variant="outline" className="w-full">
                Voir toutes les applications
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-xs text-neutral-400">
            Si vous n'êtes pas redirigé automatiquement, cliquez sur le bouton ci-dessus.
          </p>
        </div>
      </div>
    </div>
  );
}
