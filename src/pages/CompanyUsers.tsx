import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  ArrowRight,
  Mail,
  Shield,
  MoreVertical,
  Search,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RoleBadge } from '../components/RoleBadge';
import { useOrganizationUsers } from '../hooks/useOrganizationData';
import { useState } from 'react';

const COMPANY_ROLES = [
  {
    id: 'admin',
    name: 'Admin entreprise',
    description: 'Accès total aux projets et modules',
    color: 'red',
  },
  {
    id: 'member',
    name: 'Membre interne',
    description: 'Accès projets assignés uniquement',
    color: 'blue',
  },
  {
    id: 'finance',
    name: 'Responsable financier',
    description: 'Accès finances CFC + acomptes',
    color: 'green',
  },
  {
    id: 'commercial',
    name: 'Responsable commercial',
    description: 'Accès lots, acheteurs, courtiers',
    color: 'purple',
  },
  {
    id: 'technical',
    name: 'Responsable technique',
    description: 'Accès soumissions, EG, planning',
    color: 'orange',
  },
];

export default function CompanyUsers() {
  const { users, loading } = useOrganizationUsers();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <header className="space-y-3">
          <Link
            to="/company"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour à l'entreprise
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Utilisateurs
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Gérez les membres de votre équipe et leurs accès
              </p>
            </div>
            <Link to="/admin/users/invite">
              <Button variant="primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Inviter un utilisateur
              </Button>
            </Link>
          </div>
        </header>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {filteredUsers.length} utilisateur(s)
          </span>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Rôles disponibles
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {COMPANY_ROLES.map((role) => (
              <Card key={role.id}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {role.name}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {role.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Membres de l'équipe
          </h2>

          {filteredUsers.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur pour le moment'}
                </p>
                {!searchQuery && (
                  <Link to="/admin/users/invite">
                    <Button variant="primary">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Inviter le premier utilisateur
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                            {user.first_name} {user.last_name}
                          </h3>
                          {!user.is_active && <Badge variant="danger">Inactif</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          {user.language && (
                            <Badge variant="default" className="text-xs">
                              {user.language.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to={`/admin/users/${user.id}`}>
                        <Button variant="secondary" size="sm">
                          Gérer
                        </Button>
                      </Link>
                      <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Card className="bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-1">
                Gestion des accès
              </h4>
              <p className="text-sm text-brand-700 dark:text-brand-300">
                Les utilisateurs peuvent avoir différents rôles selon leurs responsabilités.
                Un administrateur peut gérer tous les aspects de l'entreprise, tandis qu'un membre
                standard n'a accès qu'aux projets qui lui sont assignés.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
