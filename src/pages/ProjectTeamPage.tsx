import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import ProjectTeamList from '../components/project/ProjectTeamList';
import { Button } from '../components/ui/Button';
import { Plus, Users } from 'lucide-react';
import { useProjectTeam } from '../hooks/useProjectTeam';
import { SearchBar } from '../components/ui/SearchBar';

export default function ProjectTeamPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { team, project, loading, error, refetch } = useProjectTeam(projectId!);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  if (loading) return <LoadingState message="Chargement de l'équipe..." />;
  if (error) return <ErrorState message={error.message} retry={refetch} />;
  if (!team || !project) return <ErrorState message="Équipe introuvable" />;

  const filteredTeam = team.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roles = ['all', ...Array.from(new Set(team.map(m => m.role)))];

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name, href: `/projects/${projectId}` },
          { label: 'Équipe' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Équipe du Projet</h1>
          <p className="text-gray-600 mt-2">
            Gérez les membres de l'équipe et leurs rôles
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Ajouter un membre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Total membres</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{team.length}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Actifs</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{team.length}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-brand-600" />
            <p className="text-sm font-medium text-gray-600">Rôles différents</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{roles.length - 1}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-brand-600" />
            <p className="text-sm font-medium text-gray-600">Entreprises</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {new Set(team.filter(m => m.company).map(m => m.company)).size}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un membre..."
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les rôles</option>
            {roles.filter(r => r !== 'all').map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {filteredTeam.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Aucun membre trouvé</p>
          </div>
        ) : (
          <ProjectTeamList
            team={filteredTeam}
            onEditMember={(id) => console.log('Edit member:', id)}
            onRemoveMember={(id) => console.log('Remove member:', id)}
          />
        )}
      </div>
    </div>
  );
}
