import { useI18n } from '../lib/i18n';
import { useDashboard } from '../hooks/useDashboard';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { DashboardKpis } from '../components/dashboard/DashboardKpis';
import { SalesChart } from '../components/dashboard/SalesChart';
import { CfcChart } from '../components/dashboard/CfcChart';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DocumentPreviewCard } from '../components/dashboard/DocumentPreviewCard';
import { MessagePreview } from '../components/dashboard/MessagePreview';
import { UpcomingTimeline } from '../components/dashboard/UpcomingTimeline';
import { Sparkles, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { t } = useI18n();
  const { data, loading, error } = useDashboard();
  const { user } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const timelineItems = [
    {
      id: '1',
      title: 'Signature acte notarié - Lot B.02',
      date: new Date().toISOString(),
      type: 'meeting' as const,
      status: 'today' as const,
      description: 'Rendez-vous chez Me Dubois avec les acheteurs Müller',
      project_name: 'Les Jardins du Lac',
    },
    {
      id: '2',
      title: 'Deadline soumissions électricité',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'deadline' as const,
      status: 'upcoming' as const,
      description: 'Réception des offres pour les travaux électriques',
      project_name: 'Résidence Panorama',
    },
    {
      id: '3',
      title: 'Visite showroom acheteurs',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'meeting' as const,
      status: 'upcoming' as const,
      description: 'Choix matériaux - Famille Schmidt',
      project_name: 'Les Jardins du Lac',
    },
  ];

  const recentDocuments = data.documentsRecent?.slice(0, 4) || [];
  const recentMessages = [
    {
      id: '1',
      content: "Les plans d'architecture pour le lot C.03 sont prêts. Veuillez les valider avant la réunion de jeudi.",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sender_name: 'Jean Dupont',
      sender_role: 'Architect',
      thread_title: 'Plans Lot C.03',
      unread: true,
    },
    {
      id: '2',
      content: "Le courtier a trouvé un financement à 1.2% pour les acheteurs du B.05. Excellent taux!",
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sender_name: 'Marie Laurent',
      sender_role: 'Courtier',
      thread_title: 'Financement B.05',
      unread: false,
    },
    {
      id: '3',
      content: "Rappel: La visite de chantier avec les acheteurs est prévue demain à 14h. Merci de confirmer votre présence.",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sender_name: 'Pierre Rossier',
      sender_role: 'EG',
      thread_title: 'Visite chantier',
      unread: false,
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-blue-900/20 border border-primary-100 dark:border-primary-900/30 p-8">
        <div className="relative z-10">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                {getGreeting()}, {user?.first_name || 'Utilisateur'}
              </h1>
            </div>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Voici un aperçu de vos projets et activités
            </p>
          </div>

          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                Performance ce mois: +12%
              </span>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-blue-200/20 dark:from-primary-900/10 dark:to-blue-900/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>

      <DashboardKpis kpis={data.kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SalesChart data={data.salesChart} />
        <CfcChart data={data.cfcChart} />
      </div>

      <UpcomingTimeline items={timelineItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Documents récents</h2>
            <a href="/documents" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Voir tout →
            </a>
          </div>
          <div className="space-y-3">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc: any) => (
                <DocumentPreviewCard key={doc.id} document={doc} />
              ))
            ) : (
              <div className="p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Aucun document récent</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Messages récents</h2>
            <a href="/messages" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Voir tout →
            </a>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <MessagePreview key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      </div>

      <QuickActions />
    </div>
  );
}
