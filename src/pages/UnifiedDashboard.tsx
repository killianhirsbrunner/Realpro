/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RealPro – Tableau de Bord Unifié
 * Point d'entrée principal après connexion
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrganization } from '../hooks/useOrganization';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { usePromoterDashboard } from '../hooks/usePromoterDashboard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Building2,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  MessageSquare,
  ArrowRight,
  FolderPlus,
  Wallet,
  HardHat,
  Wrench,
  FileText,
  BarChart3,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Home,
  Briefcase,
  CalendarDays,
  Target,
  Activity,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
}

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
  stats?: { label: string; value: string | number };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function UnifiedDashboard() {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useOrganization();
  const { user, loading: userLoading } = useCurrentUser();
  const { stats, loading: statsLoading } = usePromoterDashboard();

  // Loading state
  if (projectsLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasProjects = projects && projects.length > 0;

  // Calcul des statistiques globales
  const globalStats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter(p => p.status === 'ACTIVE').length || 0,
    totalLots: stats?.projects?.reduce((sum, p) => sum + (p.sales?.totalLots || 0), 0) || 0,
    soldLots: stats?.projects?.reduce((sum, p) => sum + (p.sales?.soldLots || 0), 0) || 0,
    totalRevenue: stats?.totalRevenuePotential || 0,
    openTickets: stats?.totalSavTickets?.open || 0,
  };

  const salesRate = globalStats.totalLots > 0
    ? Math.round((globalStats.soldLots / globalStats.totalLots) * 100)
    : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Actions rapides
  // ─────────────────────────────────────────────────────────────────────────
  const quickActions: QuickAction[] = [
    {
      id: 'new-project',
      title: 'Nouveau projet',
      description: 'Créer un projet immobilier',
      icon: FolderPlus,
      href: '/projects/wizard',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      id: 'add-prospect',
      title: 'Ajouter un prospect',
      description: 'Nouveau contact CRM',
      icon: Users,
      href: '/crm',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      id: 'new-task',
      title: 'Créer une tâche',
      description: 'Planifier une action',
      icon: CheckCircle2,
      href: '/tasks',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      id: 'view-analytics',
      title: 'Voir les analytics',
      description: 'Tableau de bord BI',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Modules principaux
  // ─────────────────────────────────────────────────────────────────────────
  const mainModules: ModuleCard[] = [
    {
      id: 'projects',
      title: 'Projets',
      description: 'Gestion des projets immobiliers',
      icon: Building2,
      href: '/projects',
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-100 dark:bg-brand-900/30',
      stats: { label: 'Projets actifs', value: globalStats.activeProjects },
    },
    {
      id: 'commercial',
      title: 'Commercial',
      description: 'CRM, ventes et courtiers',
      icon: Briefcase,
      href: '/crm',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      stats: { label: 'Taux de vente', value: `${salesRate}%` },
    },
    {
      id: 'chantier',
      title: 'Chantier',
      description: 'Construction et planning',
      icon: HardHat,
      href: '/chantier',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      stats: { label: 'Lots', value: globalStats.totalLots },
    },
    {
      id: 'finances',
      title: 'Finances',
      description: 'Budget, CFC et facturation',
      icon: Wallet,
      href: '/finance',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      stats: { label: 'CA potentiel', value: formatCurrency(globalStats.totalRevenue) },
    },
    {
      id: 'sav',
      title: 'SAV',
      description: 'Service après-vente',
      icon: Wrench,
      href: '/sav',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      stats: { label: 'Tickets ouverts', value: globalStats.openTickets },
    },
    {
      id: 'reporting',
      title: 'Reporting',
      description: 'Rapports et analyses',
      icon: BarChart3,
      href: '/reporting',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER - Bienvenue + Actions rapides
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* En-tête avec salutation */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Bienvenue'}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Voici un aperçu de votre activité sur RealPro
            </p>
          </div>
          <button
            onClick={() => navigate('/projects/wizard')}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-600/20"
          >
            <Plus className="w-4 h-4" />
            Nouveau projet
          </button>
        </motion.div>

        {/* Actions rapides */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  to={action.href}
                  className="group p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all"
                >
                  <div className={clsx('p-2.5 rounded-lg w-fit mb-3', action.bgColor)}>
                    <Icon className={clsx('w-5 h-5', action.color)} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════════
            KPIs GLOBAUX
            ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              title="Projets actifs"
              value={globalStats.activeProjects}
              total={globalStats.totalProjects}
              icon={Building2}
              color="brand"
              href="/projects"
            />
            <KPICard
              title="Lots vendus"
              value={globalStats.soldLots}
              total={globalStats.totalLots}
              icon={Home}
              color="emerald"
              href="/promoter"
            />
            <KPICard
              title="Taux de vente"
              value={`${salesRate}%`}
              icon={Target}
              color="blue"
              trend={salesRate > 50 ? 'up' : 'stable'}
              href="/analytics"
            />
            <KPICard
              title="Tickets SAV"
              value={globalStats.openTickets}
              icon={Wrench}
              color={globalStats.openTickets > 5 ? 'red' : 'amber'}
              href="/sav"
            />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════════
            MODULES PRINCIPAUX
            ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Accès rapide aux modules
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.href}
                  className="group p-5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all text-center"
                >
                  <div className={clsx('p-3 rounded-xl w-fit mx-auto mb-3', module.bgColor)}>
                    <Icon className={clsx('w-6 h-6', module.color)} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {module.title}
                  </h3>
                  {module.stats && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {module.stats.label}: <span className="font-medium text-gray-700 dark:text-gray-300">{module.stats.value}</span>
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════════
            PROJETS RÉCENTS
            ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              Vos projets récents
            </h2>
            <Link
              to="/projects"
              className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
            >
              Voir tous
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {hasProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project: any) => (
                <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
              ))}

              {/* Carte "Nouveau projet" */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group bg-gradient-to-br from-brand-50 to-emerald-50 dark:from-brand-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 p-6 cursor-pointer hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center min-h-[200px]"
                onClick={() => navigate('/projects/wizard')}
              >
                <div className="p-4 bg-brand-100 dark:bg-brand-900/50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <FolderPlus className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 mb-2">
                  Nouveau projet
                </h3>
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  Créez un nouveau projet immobilier
                </p>
              </motion.div>
            </div>
          ) : (
            <EmptyProjectsState onCreateProject={() => navigate('/projects/wizard')} />
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════════
            ACTIVITÉ RÉCENTE + NOTIFICATIONS
            ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité récente */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-600" />
                Activité récente
              </h3>
              <Link to="/notifications" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              <ActivityItem
                icon={CheckCircle2}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                title="Lot vendu"
                description="Lot A-12 vendu sur le projet Les Terrasses"
                time="Il y a 2h"
              />
              <ActivityItem
                icon={Users}
                iconColor="text-blue-600"
                iconBg="bg-blue-100 dark:bg-blue-900/30"
                title="Nouveau prospect"
                description="Jean Dupont ajouté au pipeline CRM"
                time="Il y a 4h"
              />
              <ActivityItem
                icon={AlertCircle}
                iconColor="text-amber-600"
                iconBg="bg-amber-100 dark:bg-amber-900/30"
                title="Ticket SAV créé"
                description="Problème de plomberie signalé"
                time="Hier"
              />
            </div>
          </Card>

          {/* Calendrier / Rendez-vous */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-brand-600" />
                Prochains rendez-vous
              </h3>
              <Link to="/tasks" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                Gérer
              </Link>
            </div>
            <div className="space-y-4">
              <AppointmentItem
                title="Visite chantier - Les Terrasses"
                date="Demain"
                time="10:00"
              />
              <AppointmentItem
                title="Réunion équipe commerciale"
                date="Mercredi"
                time="14:30"
              />
              <AppointmentItem
                title="Signature notaire - Lot B-05"
                date="Vendredi"
                time="16:00"
              />
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function KPICard({
  title,
  value,
  total,
  icon: Icon,
  color,
  trend,
  href,
}: {
  title: string;
  value: string | number;
  total?: number;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  href?: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    brand: {
      bg: 'bg-brand-100 dark:bg-brand-900/30',
      text: 'text-brand-600 dark:text-brand-400',
      icon: 'text-brand-600 dark:text-brand-400',
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-600 dark:text-red-400',
    },
  };

  const classes = colorClasses[color] || colorClasses.brand;

  const content = (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={clsx('p-2.5 rounded-lg', classes.bg)}>
          <Icon className={clsx('w-5 h-5', classes.icon)} />
        </div>
        {trend && (
          <TrendingUp className={clsx('w-4 h-4', {
            'text-emerald-500': trend === 'up',
            'text-red-500 rotate-180': trend === 'down',
            'text-gray-400': trend === 'stable',
          })} />
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        {total !== undefined && (
          <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
            /{total}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</p>
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}

function ProjectCard({ project, onClick }: { project: any; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 cursor-pointer hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-brand-500 to-emerald-500 rounded-xl">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <Badge variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}>
          {project.status === 'ACTIVE' ? 'Actif' : project.status}
        </Badge>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
        {project.name}
      </h3>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p className="line-clamp-1">{project.city}, {project.canton}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Home className="w-4 h-4" />
            {project.total_lots || 0} lots
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}

function EmptyProjectsState({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-100 to-emerald-100 dark:from-brand-900/50 dark:to-emerald-900/50 mb-6">
          <Building2 className="w-10 h-10 text-brand-600 dark:text-brand-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Aucun projet pour le moment
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Créez votre premier projet pour commencer à utiliser RealPro
        </p>
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-600/20"
        >
          <FolderPlus className="w-5 h-5" />
          Créer mon premier projet
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  time,
}: {
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
      <div className={clsx('p-2 rounded-lg', iconBg)}>
        <Icon className={clsx('w-4 h-4', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
          {description}
        </p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap">
        {time}
      </span>
    </div>
  );
}

function AppointmentItem({
  title,
  date,
  time,
}: {
  title: string;
  date: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
        <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {date} à {time}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M CHF`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K CHF`;
  }
  return `${amount} CHF`;
}

export default UnifiedDashboard;
