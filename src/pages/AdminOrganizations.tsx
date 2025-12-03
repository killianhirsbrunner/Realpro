import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Building2, Users, FolderKanban, TrendingUp } from 'lucide-react';

type Organization = {
  id: string;
  name: string;
  defaultLanguage: string;
  plan: string;
  planSlug: string | null;
  subscriptionStatus: string | null;
  billingCycle: string | null;
  currentPeriodEnd: string | null;
  projectsCount: number;
  usersCount: number;
  createdAt: string;
};

type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
};

type Stats = {
  organizations: number;
  projects: number;
  users: number;
  activeSubscriptions: number;
};

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Non authentifié');
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      const [orgsRes, plansRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/functions/v1/admin/organizations`, { headers }),
        fetch(`${apiUrl}/functions/v1/admin/plans`, { headers }),
        fetch(`${apiUrl}/functions/v1/admin/stats`, { headers }),
      ]);

      if (orgsRes.ok) {
        const orgsData = await orgsRes.json();
        setOrganizations(orgsData);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const changePlan = async (orgId: string, planSlug: string, billingCycle: string = 'MONTHLY') => {
    setChanging(orgId);
    try {
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch(`${apiUrl}/functions/v1/admin/organizations/${orgId}/plan`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planSlug, billingCycle }),
      });

      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Erreur changement plan:', error);
    } finally {
      setChanging(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Administration SaaS
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestion des organisations et abonnements
        </p>
      </header>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Organisations</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                  {stats.organizations}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                <FolderKanban className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Projets</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                  {stats.projects}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Utilisateurs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                  {stats.users}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Abonnements actifs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                  {stats.activeSubscriptions}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Organisation</th>
                <th className="px-4 py-3">Plan actuel</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Projets</th>
                <th className="px-4 py-3">Utilisateurs</th>
                <th className="px-4 py-3">Langue</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr
                  key={org.id}
                  className="border-b last:border-b-0 dark:border-gray-800"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-50">
                        {org.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(org.createdAt).toLocaleDateString('fr-CH')}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {org.plan}
                      </p>
                      {org.billingCycle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {org.billingCycle === 'MONTHLY' ? 'Mensuel' : 'Annuel'}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {org.subscriptionStatus && (
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          org.subscriptionStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                            : org.subscriptionStatus === 'TRIAL'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {org.subscriptionStatus}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {org.projectsCount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {org.usersCount}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    {org.defaultLanguage}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-lg border px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                      value={org.planSlug || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          changePlan(org.id, e.target.value);
                        }
                      }}
                      disabled={changing === org.id}
                    >
                      <option value="">Changer de plan...</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
