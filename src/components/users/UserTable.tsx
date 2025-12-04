import { Link } from 'react-router-dom';
import { User } from '../../hooks/useUsers';
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserTableProps {
  users: User[];
  onToggleStatus?: (userId: string, isActive: boolean) => void;
}

export function UserTable({ users, onToggleStatus }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Utilisateur
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Rôle
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Entreprise
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Dernière connexion
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Statut
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </p>
                  {user.phone && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {user.phone}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">
                {user.email}
              </td>
              <td className="py-3 px-4">
                {user.role_name && (
                  <Badge variant="secondary">{user.role_name}</Badge>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                {user.company_name || '-'}
              </td>
              <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                {user.last_login_at
                  ? formatDistanceToNow(new Date(user.last_login_at), {
                      addSuffix: true,
                      locale: fr,
                    })
                  : 'Jamais'}
              </td>
              <td className="py-3 px-4">
                <Badge variant={user.is_active ? 'success' : 'error'}>
                  {user.is_active ? 'Actif' : 'Désactivé'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    Voir
                  </Link>
                  {onToggleStatus && (
                    <button
                      onClick={() => onToggleStatus(user.id, !user.is_active)}
                      className={`text-sm ${
                        user.is_active
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      {user.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
