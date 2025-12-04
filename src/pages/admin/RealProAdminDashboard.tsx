import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Building2,
  Users,
  CreditCard,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrganizationStats {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  is_active: boolean;
  subscription_status: string;
  plan_name: string;
  projects_count: number;
  users_count: number;
  last_activity: string | null;
}

interface SystemStats {
  total_organizations: number;
  active_organizations: number;
  total_users: number;
  total_projects: number;
  active_subscriptions: number;
  revenue_current_month: number;
}

export function RealProAdminDashboard() {
  const [organizations, setOrganizations] = useState<OrganizationStats[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          slug,
          created_at,
          is_active,
          subscriptions (
            status,
            plan:subscription_plans (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (orgsError) throw orgsError;

      const enrichedOrgs = await Promise.all(
        orgsData.map(async (org) => {
          const { count: projectsCount } = await supabase
            .from('projects')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', org.id);

          const { count: usersCount } = await supabase
            .from('user_organizations')
            .select('user_id', { count: 'exact', head: true })
            .eq('organization_id', org.id);

          const { data: lastActivity } = await supabase
            .from('audit_logs')
            .select('created_at')
            .eq('organization_id', org.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            created_at: org.created_at,
            is_active: org.is_active,
            subscription_status: org.subscriptions?.[0]?.status || 'none',
            plan_name: org.subscriptions?.[0]?.plan?.name || 'Aucun',
            projects_count: projectsCount || 0,
            users_count: usersCount || 0,
            last_activity: lastActivity?.created_at || null
          };
        })
      );

      setOrganizations(enrichedOrgs);

      const stats: SystemStats = {
        total_organizations: enrichedOrgs.length,
        active_organizations: enrichedOrgs.filter(o => o.is_active).length,
        total_users: enrichedOrgs.reduce((sum, o) => sum + o.users_count, 0),
        total_projects: enrichedOrgs.reduce((sum, o) => sum + o.projects_count, 0),
        active_subscriptions: enrichedOrgs.filter(o => o.subscription_status === 'active').length,
        revenue_current_month: 0
      };

      setSystemStats(stats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string; icon: any }> = {
      active: {
        label: 'Actif',
        className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        icon: CheckCircle
      },
      pending: {
        label: 'En attente',
        className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        icon: Clock
      },
      cancelled: {
        label: 'Annulé',
        className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        icon: XCircle
      },
      none: {
        label: 'Aucun',
        className: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
        icon: AlertCircle
      }
    };

    const badge = badges[status] || badges.none;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${badge.className}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && org.is_active) ||
                         (statusFilter === 'inactive' && !org.is_active);

    return matchesSearch && matchesStatus;
  });

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
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            Administration RealPro
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Supervision des organisations et abonnements
          </p>
        </div>
      </div>

      {systemStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              {systemStats.total_organizations}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Organisations totales
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              {systemStats.active_organizations} actives
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              {systemStats.total_users}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Utilisateurs totaux
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              {systemStats.total_projects}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Projets créés
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              {systemStats.active_subscriptions}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Abonnements actifs
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher une organisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          >
            <option value="all">Toutes</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Organisation
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Abonnement
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Plan
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Projets
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Utilisateurs
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Dernière activité
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Créé le
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrganizations.map((org) => (
                <tr
                  key={org.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {org.name}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        @{org.slug}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(org.subscription_status)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {org.plan_name}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {org.projects_count}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {org.users_count}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {org.last_activity ? (
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {format(new Date(org.last_activity), "dd MMM HH:mm", { locale: fr })}
                      </span>
                    ) : (
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">
                        Jamais
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {format(new Date(org.created_at), "dd MMM yyyy", { locale: fr })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Aucune organisation trouvée
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/30 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Administration système
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Ce dashboard permet de superviser les organisations sans accéder à leurs données internes.
              La confidentialité et l'isolation des données sont garanties par RLS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
