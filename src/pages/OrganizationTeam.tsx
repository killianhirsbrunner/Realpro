import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Building2,
  Briefcase,
  Home,
  Search,
  MoreVertical,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Shield,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { useTeamManagement, TeamMember, PendingInvitation } from '../hooks/useTeamManagement';
import {
  SystemRole,
  UserType,
  getRoleDisplayName,
  getRoleColor,
  getInvitableRoles,
  INTERNAL_ROLES,
  EXTERNAL_ROLES,
  BUYER_ROLES,
} from '../lib/permissions';

type TabType = 'all' | 'internal' | 'external' | 'buyers' | 'invitations';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Tous', icon: <Users className="w-4 h-4" /> },
  { id: 'internal', label: 'Internes', icon: <Building2 className="w-4 h-4" /> },
  { id: 'external', label: 'Externes', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'buyers', label: 'Acheteurs', icon: <Home className="w-4 h-4" /> },
  { id: 'invitations', label: 'Invitations', icon: <Mail className="w-4 h-4" /> },
];

export default function OrganizationTeam() {
  const {
    members,
    invitations,
    stats,
    loading,
    error,
    changeUserRole,
    removeMember,
    toggleMemberStatus,
    cancelInvitation,
    resendInvitation,
    refresh,
  } = useTeamManagement();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (loading) {
    return <LoadingState message="Chargement de l'equipe..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={refresh}>Reessayer</Button>
        </div>
      </div>
    );
  }

  // Filtrer les membres
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchQuery === '' ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeTab) {
      case 'internal':
        return member.user_type === 'INTERNAL';
      case 'external':
        return member.user_type === 'EXTERNAL';
      case 'buyers':
        return member.user_type === 'BUYER';
      default:
        return true;
    }
  });

  const handleChangeRole = async (userId: string, newRole: SystemRole) => {
    setActionLoading(`role-${userId}`);
    try {
      await changeUserRole(userId, newRole);
    } catch {
      // Error handled in hook
    } finally {
      setActionLoading(null);
      setSelectedMember(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Etes-vous sur de vouloir retirer ce membre de l\'organisation ?')) {
      return;
    }

    setActionLoading(`remove-${userId}`);
    try {
      await removeMember(userId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(`status-${userId}`);
    try {
      await toggleMemberStatus(userId, !currentStatus);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    setActionLoading(`cancel-${invitationId}`);
    try {
      await cancelInvitation(invitationId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    setActionLoading(`resend-${invitationId}`);
    try {
      await resendInvitation(invitationId);
    } finally {
      setActionLoading(null);
    }
  };

  const getUserTypeLabel = (type: UserType): string => {
    switch (type) {
      case 'INTERNAL':
        return 'Interne';
      case 'EXTERNAL':
        return 'Externe';
      case 'BUYER':
        return 'Acheteur';
    }
  };

  const getUserTypeColor = (type: UserType): string => {
    switch (type) {
      case 'INTERNAL':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'EXTERNAL':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'BUYER':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    }
  };

  const MemberCard = ({ member }: { member: TeamMember }) => (
    <RealProCard className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              member.first_name?.[0]?.toUpperCase() || member.email?.[0]?.toUpperCase() || '?'
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
                {member.first_name && member.last_name
                  ? `${member.first_name} ${member.last_name}`
                  : member.email}
              </h3>
              {!member.is_active && (
                <Badge variant="danger" className="text-xs">
                  Inactif
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="truncate">{member.email}</span>
              {member.last_login && (
                <span className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  {new Date(member.last_login).toLocaleDateString('fr-CH')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badges et actions */}
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(member.user_type)}`}>
            {getUserTypeLabel(member.user_type)}
          </span>
          {member.role && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
              {getRoleDisplayName(member.role)}
            </span>
          )}

          {/* Menu actions */}
          <div className="relative">
            <button
              onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>

            {selectedMember === member.id && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-10">
                <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                    Changer le role
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {getInvitableRoles().map((role) => (
                      <button
                        key={role}
                        onClick={() => handleChangeRole(member.id, role)}
                        disabled={actionLoading === `role-${member.id}`}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                          member.role === role
                            ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {getRoleDisplayName(role)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleToggleStatus(member.id, member.is_active)}
                    disabled={actionLoading === `status-${member.id}`}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                  >
                    {member.is_active ? 'Desactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={actionLoading === `remove-${member.id}`}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    Retirer de l'organisation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RealProCard>
  );

  const InvitationCard = ({ invitation }: { invitation: PendingInvitation }) => {
    const isExpired = new Date(invitation.expires_at) < new Date();

    return (
      <RealProCard className={isExpired ? 'opacity-60' : ''}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <Mail className="w-5 h-5 text-neutral-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
                  {invitation.email}
                </h3>
                {isExpired && (
                  <Badge variant="danger" className="text-xs">
                    Expiree
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <span>Invite par {invitation.invited_by_name}</span>
                <span className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  Expire le {new Date(invitation.expires_at).toLocaleDateString('fr-CH')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(invitation.role)}`}>
              {getRoleDisplayName(invitation.role)}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResendInvitation(invitation.id)}
                disabled={actionLoading === `resend-${invitation.id}`}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Renvoyer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleCancelInvitation(invitation.id)}
                disabled={actionLoading === `cancel-${invitation.id}`}
              >
                <XCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </RealProCard>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
              Gestion de l'equipe
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Gerez les membres de votre organisation et leurs acces
            </p>
          </div>
          <Link to="/admin/users/invite">
            <RealProButton>
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter un membre
            </RealProButton>
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <RealProCard className="text-center py-4">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats.total_members}
              </p>
              <p className="text-sm text-neutral-500">Total</p>
            </RealProCard>
            <RealProCard className="text-center py-4">
              <p className="text-2xl font-bold text-blue-600">{stats.internal_count}</p>
              <p className="text-sm text-neutral-500">Internes</p>
            </RealProCard>
            <RealProCard className="text-center py-4">
              <p className="text-2xl font-bold text-orange-600">{stats.external_count}</p>
              <p className="text-sm text-neutral-500">Externes</p>
            </RealProCard>
            <RealProCard className="text-center py-4">
              <p className="text-2xl font-bold text-green-600">{stats.buyer_count}</p>
              <p className="text-sm text-neutral-500">Acheteurs</p>
            </RealProCard>
            <RealProCard className="text-center py-4">
              <p className="text-2xl font-bold text-amber-600">{stats.pending_invitations}</p>
              <p className="text-sm text-neutral-500">En attente</p>
            </RealProCard>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'invitations' && invitations.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-amber-500 text-white">
                  {invitations.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'invitations' && (
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Rechercher un membre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        )}

        {/* Content */}
        {activeTab === 'invitations' ? (
          <div className="space-y-3">
            {invitations.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Aucune invitation en attente
                  </p>
                  <Link to="/admin/users/invite">
                    <Button variant="primary">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Inviter un membre
                    </Button>
                  </Link>
                </div>
              </RealProCard>
            ) : (
              invitations.map((invitation) => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {searchQuery ? 'Aucun membre trouve' : 'Aucun membre dans cette categorie'}
                  </p>
                </div>
              </RealProCard>
            ) : (
              filteredMembers.map((member) => <MemberCard key={member.id} member={member} />)
            )}
          </div>
        )}

        {/* Info box */}
        <RealProCard className="mt-8 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100 mb-1">
                Types de membres
              </h4>
              <ul className="text-sm text-cyan-700 dark:text-cyan-300 space-y-1">
                <li>
                  <strong>Internes :</strong> Administrateurs, Promoteurs - Acces complet a
                  l'organisation
                </li>
                <li>
                  <strong>Externes :</strong> EG, Architectes, Ingenieurs, Notaires, Courtiers,
                  Fournisseurs - Acces limite aux projets assignes
                </li>
                <li>
                  <strong>Acheteurs :</strong> Acces au portail acheteur uniquement
                </li>
              </ul>
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Overlay pour fermer le menu */}
      {selectedMember && (
        <div className="fixed inset-0 z-0" onClick={() => setSelectedMember(null)} />
      )}
    </motion.div>
  );
}
