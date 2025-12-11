import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import ProjectTeamList from '../components/project/ProjectTeamList';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Plus, Users, UserCheck, Briefcase, Building2 } from 'lucide-react';
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

      <RealProTopbar
        title="Équipe du Projet"
        subtitle="Gérez les membres de l'équipe et leurs rôles"
        actions={
          <RealProButton variant="primary">
            <Plus className="w-4 h-4" />
            Ajouter un membre
          </RealProButton>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total membres</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {team.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Actifs</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {team.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Rôles différents</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {roles.length - 1}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Entreprises</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {new Set(team.filter(m => m.company).map(m => m.company)).size}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Liste de l'équipe */}
      <RealProCard padding="lg">
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
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
          >
            <option value="all">Tous les rôles</option>
            {roles.filter(r => r !== 'all').map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {filteredTeam.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Aucun membre trouvé
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Modifiez vos filtres ou ajoutez de nouveaux membres
            </p>
          </div>
        ) : (
          <ProjectTeamList
            team={filteredTeam}
            onEditMember={(id) => console.log('Edit member:', id)}
            onRemoveMember={(id) => console.log('Remove member:', id)}
          />
        )}
      </RealProCard>
    </div>
  );
}
