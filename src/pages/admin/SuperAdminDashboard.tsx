import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { KpiCard } from '../../components/ui/KpiCard';
import {
  Building2,
  Users,
  FolderKanban,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      const [
        orgsResult,
        usersResult,
        projectsResult,
        lotsResult,
      ] = await Promise.all([
        supabase.from('organizations').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('id, is_active'),
        supabase.from('projects').select('id, status, organization_id'),
        supabase.from('lots').select('id, status, project_id'),
      ]);

      const totalOrganizations = orgsResult.data?.length || 0;
      const activeOrganizations = orgsResult.data?.filter(o => o.is_active).length || 0;
      const totalUsers = usersResult.data?.length || 0;
      const activeUsers = usersResult.data?.filter(u => u.is_active).length || 0;
      const totalProjects = projectsResult.data?.length || 0;
      const activeProjects = projectsResult.data?.filter(p => p.status !== 'ARCHIVED').length || 0;
      const totalLots = lotsResult.data?.length || 0;
      const soldLots = lotsResult.data?.filter(l => l.status === 'SOLD').length || 0;

      setStats({
        totalOrganizations,
        activeOrganizations,
        totalUsers,
        activeUsers,
        totalProjects,
        activeProjects,
        totalLots,
        soldLots,
      });

      const orgsWithDetails = await Promise.all(
        (orgsResult.data || []).map(async (org) => {
          const [projectsCount, usersCount] = await Promise.all([
            supabase.from('projects').select('id', { count: 'exact', head: true }).eq('organization_id', org.id),
            supabase.from('user_organizations').select('user_id', { count: 'exact', head: true }).eq('organization_id', org.id),
          ]);

          return {
            ...org,
            projectsCount: projectsCount.count || 0,
            usersCount: usersCount.count || 0,
          };
        })
      );

      setOrganizations(orgsWithDetails);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            RealPro SA - Administration
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gestion globale de toutes les organisations et abonnements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            icon={Building2}
            label="Organisations"
            value={stats.activeOrganizations}
            sublabel={`${stats.totalOrganizations} au total`}
            variant="primary"
          />
          <KpiCard
            icon={Users}
            label="Utilisateurs"
            value={stats.activeUsers}
            sublabel={`${stats.totalUsers} au total`}
            variant="success"
          />
          <KpiCard
            icon={FolderKanban}
            label="Projets"
            value={stats.activeProjects}
            sublabel={`${stats.totalProjects} au total`}
            variant="info"
          />
          <KpiCard
            icon={TrendingUp}
            label="Lots vendus"
            value={stats.soldLots}
            sublabel={`${stats.totalLots} au total`}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Organisations
                  </h2>
                  <Link
                    to="/admin/organizations/new"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Nouvelle organisation
                  </Link>
                </div>

                <div className="space-y-3">
                  {organizations.map((org) => (
                    <Link
                      key={org.id}
                      to={`/admin/organizations/${org.id}`}
                      className="block p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        {org.logo_url ? (
                          <img
                            src={org.logo_url}
                            alt={org.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {org.name}
                            </h3>
                            {org.is_active ? (
                              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="w-3 h-3" />
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <span>{org.projectsCount} projets</span>
                            <span>{org.usersCount} utilisateurs</span>
                            <span className="text-xs">
                              Créée le {new Date(org.created_at).toLocaleDateString('fr-CH')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {organizations.length === 0 && (
                    <div className="text-center py-12">
                      <Building2 className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Aucune organisation pour le moment
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Actions rapides
                </h2>
                <div className="space-y-2">
                  <Link
                    to="/admin/organizations"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Gérer les organisations</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Gérer les utilisateurs</span>
                  </Link>
                  <Link
                    to="/admin/subscriptions"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">Abonnements</span>
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Rapports</span>
                  </Link>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Statistiques système
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Taux d'adoption
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {stats.activeOrganizations > 0 ? Math.round((stats.activeUsers / stats.activeOrganizations) * 10) / 10 : 0} users/org
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Projets par org
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {stats.activeOrganizations > 0 ? Math.round((stats.totalProjects / stats.activeOrganizations) * 10) / 10 : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Taux de vente
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {stats.totalLots > 0 ? Math.round((stats.soldLots / stats.totalLots) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
