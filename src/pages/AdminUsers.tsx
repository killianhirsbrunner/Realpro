import { Link } from 'react-router-dom';
import { Users, UserPlus, Search } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/users/UserTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useState } from 'react';

export function AdminUsers() {
  const { users, loading, error, updateUserStatus } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.company_name?.toLowerCase().includes(query)
    );
  });

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatus(userId, isActive);
    } catch (err) {
      alert('Erreur lors de la modification du statut');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des utilisateurs</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Gestion des utilisateurs
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>

        <Link to="/admin/users/invite">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Inviter un utilisateur
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Rechercher par nom, email, entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
        <UserTable users={filteredUsers} onToggleStatus={handleToggleStatus} />
      </div>

      {filteredUsers.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">
            Aucun utilisateur ne correspond à votre recherche
          </p>
        </div>
      )}
    </div>
  );
}
