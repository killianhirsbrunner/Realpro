import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, User, Shield, Activity, Building } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUserPermissions, useUserActivity } from '../hooks/useUsers';
import { PermissionMatrix } from '../components/users/PermissionMatrix';
import { AuditLog } from '../components/users/AuditLog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export function AdminUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'permissions' | 'activity' | 'projects'>('permissions');

  const {
    permissions,
    loading: permissionsLoading,
    grantPermission,
    revokePermission,
  } = useUserPermissions(userId!);

  const { activity, loading: activityLoading } = useUserActivity(userId!);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          company:companies(name),
          role:user_roles(role:roles(name))
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Utilisateur non trouvé</p>
      </div>
    );
  }

  const tabs = [
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'activity', label: 'Activité', icon: Activity },
    { id: 'projects', label: 'Projets', icon: Building },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux utilisateurs
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </h1>
                <Badge variant={user.is_active ? 'success' : 'error'}>
                  {user.is_active ? 'Actif' : 'Désactivé'}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Rôle</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            {user.role?.[0]?.role?.name || 'Aucun rôle'}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Entreprise</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            {user.company?.name || 'Aucune entreprise'}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Téléphone</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            {user.phone || '-'}
          </p>
        </Card>
      </div>

      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        {activeTab === 'permissions' && (
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
            {permissionsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <PermissionMatrix
                permissions={permissions}
                onGrant={grantPermission}
                onRevoke={revokePermission}
              />
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
            {activityLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <AuditLog activities={activity} />
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
            <p className="text-neutral-600 dark:text-neutral-400">
              Liste des projets assignés à cet utilisateur (à implémenter)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
