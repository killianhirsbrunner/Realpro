import { useI18n } from '../lib/i18n';
import { useDashboard } from '../hooks/useDashboard';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useOrganization } from '../hooks/useOrganization';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { DashboardKpis } from '../components/dashboard/DashboardKpis';
import { SalesChart } from '../components/dashboard/SalesChart';
import { CfcChart } from '../components/dashboard/CfcChart';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DocumentPreviewCard } from '../components/dashboard/DocumentPreviewCard';
import { MessagePreview } from '../components/dashboard/MessagePreview';
import { UpcomingTimeline } from '../components/dashboard/UpcomingTimeline';
import { WelcomeDashboard } from './WelcomeDashboard';
import { Sparkles, TrendingUp, ArrowUpRight, Building2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { t } = useI18n();
  const { data, loading, error } = useDashboard();
  const { user } = useCurrentUser();
  const { projects, loading: orgLoading } = useOrganization();

  if (loading || orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-primary-400 rounded-full blur-2xl opacity-20 animate-pulse" />
            <LoadingSpinner size="lg" />
          </div>
          <p className="mt-6 text-neutral-600 dark:text-neutral-400 font-medium">{t('common.loading')}</p>
        </motion.div>
      </div>
    );
  }

  // Si l'utilisateur n'a pas encore de projets, afficher l'écran d'accueil
  if (!projects || projects.length === 0) {
    return <WelcomeDashboard />;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500/5 via-white to-primary-500/5 dark:from-brand-900/10 dark:via-neutral-900 dark:to-primary-900/10 border border-brand-200/50 dark:border-brand-800/30 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-primary-400 rounded-xl blur-lg opacity-40 animate-pulse" />
                  <div className="relative bg-white dark:bg-neutral-800 p-2.5 rounded-xl shadow-lg border border-brand-200 dark:border-brand-700">
                    <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                  {getGreeting()}, {user?.first_name || 'Utilisateur'}
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl"
              >
                Pilotez vos projets immobiliers avec une vision complète et en temps réel
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-200 dark:border-green-800/30 p-4 transition-all hover:shadow-lg hover:shadow-green-500/10 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/5 group-hover:to-emerald-400/5 transition-all" />
                <div className="relative flex items-center gap-3">
                  <div className="bg-green-500/10 dark:bg-green-500/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Performance</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">+12.5%</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/10 to-primary-500/10 dark:from-brand-500/20 dark:to-primary-500/20 border border-brand-200 dark:border-brand-800/30 p-4 transition-all hover:shadow-lg hover:shadow-brand-500/10 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/0 to-primary-400/0 group-hover:from-brand-400/5 group-hover:to-primary-400/5 transition-all" />
                <div className="relative flex items-center gap-3">
                  <div className="bg-brand-500/10 dark:bg-brand-500/20 p-2 rounded-lg">
                    <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-700 dark:text-brand-300 uppercase tracking-wider">Projets</p>
                    <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{data.kpis.projects}</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 to-blue-500/10 dark:from-primary-500/20 dark:to-blue-500/20 border border-primary-200 dark:border-primary-800/30 p-4 transition-all hover:shadow-lg hover:shadow-primary-500/10 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/0 to-blue-400/0 group-hover:from-primary-400/5 group-hover:to-blue-400/5 transition-all" />
                <div className="relative flex items-center gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-500/20 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">Actif</p>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{data.kpis.activeSoumissions}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-300/20 via-primary-300/20 to-transparent dark:from-brand-600/10 dark:via-primary-600/10 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-300/20 via-brand-300/20 to-transparent dark:from-primary-600/10 dark:via-brand-600/10 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardKpis kpis={data.kpis} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SalesChart data={data.salesChart} />
        <CfcChart data={data.cfcChart} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <UpcomingTimeline items={timelineItems} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-primary-500 rounded-full" />
              Documents récents
            </h2>
            <a
              href="/documents"
              className="group flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-all"
            >
              Voir tout
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div className="space-y-3">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc: any) => (
                <DocumentPreviewCard key={doc.id} document={doc} />
              ))
            ) : (
              <div className="relative overflow-hidden p-12 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 text-center group hover:border-brand-300 dark:hover:border-brand-700 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-primary-500/0 group-hover:from-brand-500/5 group-hover:to-primary-500/5 transition-all" />
                <p className="relative text-sm text-neutral-500 dark:text-neutral-400">Aucun document récent</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-primary-500 to-brand-500 rounded-full" />
              Messages récents
            </h2>
            <a
              href="/messages"
              className="group flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-all"
            >
              Voir tout
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <MessagePreview key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>
    </motion.div>
  );
}
