import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserPlus,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  RefreshCw,
  Trash2,
  Building2,
  Users,
  Loader2,
  Search,
  Filter,
  MoreVertical,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useProjectInvitations, PARTICIPANT_ROLE_LABELS, PARTICIPANT_ROLE_COLORS, PARTICIPANT_ROLE_ICONS } from '../../hooks/useProjectInvitations';
import type { ParticipantRole, ProjectInvitationWithRelations } from '../../types/stakeholder';

interface ProjectInvitationManagerProps {
  projectId: string;
  organizationId: string;
}

export function ProjectInvitationManager({ projectId, organizationId }: ProjectInvitationManagerProps) {
  const { t } = useTranslation();
  const {
    invitations,
    stats,
    loading,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    refresh,
  } = useProjectInvitations(projectId);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvitations = invitations.filter((inv) => {
    if (filter !== 'all' && inv.status.toLowerCase() !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        inv.email.toLowerCase().includes(query) ||
        inv.first_name?.toLowerCase().includes(query) ||
        inv.last_name?.toLowerCase().includes(query) ||
        inv.company?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Invitations des intervenants
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez les accès au projet pour les courtiers, architectes, notaires et autres intervenants
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un intervenant
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total"
          value={stats.total}
          icon={Users}
          color="gray"
        />
        <StatCard
          label="En attente"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          label="Acceptées"
          value={stats.accepted}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="Expirées"
          value={stats.expired}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            {['all', 'pending', 'accepted', 'expired'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  filter === f
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'accepted' ? 'Acceptées' : 'Expirées'}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={refresh}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Invitations list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredInvitations.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              Aucune invitation
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Commencez par inviter des intervenants au projet.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvitations.map((invitation) => (
                <InvitationRow
                  key={invitation.id}
                  invitation={invitation}
                  onResend={() => resendInvitation(invitation.id)}
                  onRevoke={() => revokeInvitation(invitation.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          projectId={projectId}
          onClose={() => setShowInviteModal(false)}
          onSend={async (data) => {
            await sendInvitation(data);
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

// Stat card component
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'gray' | 'yellow' | 'green' | 'red';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

// Invitation row component
interface InvitationRowProps {
  invitation: ProjectInvitationWithRelations;
  onResend: () => void;
  onRevoke: () => void;
}

function InvitationRow({ invitation, onResend, onRevoke }: InvitationRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = {
    PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    ACCEPTED: { label: 'Acceptée', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    EXPIRED: { label: 'Expirée', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
    REVOKED: { label: 'Révoquée', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: XCircle },
  };

  const status = statusConfig[invitation.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  const copyInviteLink = () => {
    const link = `${window.location.origin}/invitation/${invitation.token}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {(invitation.first_name?.[0] || invitation.email[0]).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {invitation.first_name && invitation.last_name
                ? `${invitation.first_name} ${invitation.last_name}`
                : invitation.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{invitation.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${PARTICIPANT_ROLE_COLORS[invitation.role as ParticipantRole]}-100 text-${PARTICIPANT_ROLE_COLORS[invitation.role as ParticipantRole]}-800 dark:bg-${PARTICIPANT_ROLE_COLORS[invitation.role as ParticipantRole]}-900/30 dark:text-${PARTICIPANT_ROLE_COLORS[invitation.role as ParticipantRole]}-400`}
        >
          {PARTICIPANT_ROLE_LABELS[invitation.role as ParticipantRole] || invitation.role}
        </span>
        {invitation.company && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Building2 className="h-3 w-3 mr-1" />
            {invitation.company.name}
          </p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <p>{formatDate(invitation.invited_at)}</p>
        <p className="text-xs">Expire: {formatDate(invitation.expires_at)}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-20">
                <div className="py-1">
                  {invitation.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => { copyInviteLink(); setShowMenu(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copier le lien
                      </button>
                      <button
                        onClick={() => { onResend(); setShowMenu(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Renvoyer
                      </button>
                      <button
                        onClick={() => { onRevoke(); setShowMenu(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Révoquer
                      </button>
                    </>
                  )}
                  {invitation.status === 'EXPIRED' && (
                    <button
                      onClick={() => { onResend(); setShowMenu(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Renvoyer l'invitation
                    </button>
                  )}
                  {invitation.status === 'ACCEPTED' && (
                    <button
                      onClick={() => { window.open(`/users/${invitation.accepted_by}`, '_blank'); setShowMenu(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir le profil
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// Invite modal component
interface InviteModalProps {
  projectId: string;
  onClose: () => void;
  onSend: (data: {
    email: string;
    role: ParticipantRole;
    firstName?: string;
    lastName?: string;
    companyId?: string;
    message?: string;
  }) => Promise<void>;
}

function InviteModal({ projectId, onClose, onSend }: InviteModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'BROKER' as ParticipantRole,
    firstName: '',
    lastName: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSend(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles: ParticipantRole[] = ['BROKER', 'ARCHITECT', 'ENGINEER', 'NOTARY', 'GENERAL_CONTRACTOR', 'SUPPLIER'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inviter un intervenant
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Envoyez une invitation pour rejoindre le projet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rôle *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as ParticipantRole })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {PARTICIPANT_ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message personnalisé
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                placeholder="Ajoutez un message à l'invitation..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.email}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer l'invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper functions

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-CH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
