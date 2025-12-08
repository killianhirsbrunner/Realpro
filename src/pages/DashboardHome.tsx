import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrganization } from '../hooks/useOrganization';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
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
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RealProLogo } from '../components/branding/RealProLogo';

export function DashboardHome() {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useOrganization();
  const { user, loading: userLoading } = useCurrentUser();

  if (projectsLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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

  const hasProjects = projects && projects.length > 0;
  const globalStats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter(p => p.status === 'ACTIVE').length || 0,
    totalRevenue: 0,
    recentNotifications: 5,
    unreadMessages: 3,
    upcomingMeetings: 2
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <RealProLogo size="lg" variant="blue" />
            <button
              onClick={() => navigate('/projects/wizard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-600/20"
            >
              <Plus className="w-4 h-4" />
              Nouveau projet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
                  <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {globalStats.totalProjects}
                </span>
              </div>
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Projets totaux
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                {globalStats.activeProjects} actifs
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {globalStats.recentNotifications}
                </span>
              </div>
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Notifications
              </h3>
              <Link to="/notifications" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block">
                Voir tout
              </Link>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {globalStats.unreadMessages}
                </span>
              </div>
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Messages
              </h3>
              <Link to="/messages" className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1 inline-block">
                Ouvrir
              </Link>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {globalStats.upcomingMeetings}
                </span>
              </div>
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Rendez-vous
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                Cette semaine
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <LayoutGrid className="w-5 h-5" />
                Vos projets
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
                {projects.slice(0, 6).map((project: any) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    className="group bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 cursor-pointer hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-brand-500 to-primary-500 rounded-xl">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {project.status === 'ACTIVE' ? 'Actif' : project.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-1">
                      {project.name}
                    </h3>

                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      <p className="line-clamp-1">{project.address}</p>
                      <p>{project.city}, {project.canton}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.total_lots || 0}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group bg-gradient-to-br from-brand-50 to-primary-50 dark:from-brand-950/30 dark:to-primary-950/30 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 p-6 cursor-pointer hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center min-h-[240px]"
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
              <div className="bg-white dark:bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-100 to-primary-100 dark:from-brand-900/50 dark:to-primary-900/50 mb-6">
                    <Building2 className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                    Aucun projet pour le moment
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Créez votre premier projet pour commencer à utiliser RealPro
                  </p>
                  <button
                    onClick={() => navigate('/projects/wizard')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-600/20"
                  >
                    <FolderPlus className="w-5 h-5" />
                    Créer mon premier projet
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications récentes
                </h3>
                <Link to="/notifications" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Nouvelle notification {i}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        Il y a 2 heures
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Prochains rendez-vous
                </h3>
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Rendez-vous {i}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        Demain à 14h00
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
