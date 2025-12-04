import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Send } from 'lucide-react';
import { useUserInvitations } from '../hooks/useUsers';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function AdminUserInvite() {
  const navigate = useNavigate();
  const { invitations, loading, createInvitation, cancelInvitation } = useUserInvitations();

  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRolesAndProjects();
  }, []);

  const fetchRolesAndProjects = async () => {
    try {
      const [rolesResult, projectsResult] = await Promise.all([
        supabase.from('roles').select('id, name').order('name'),
        supabase.from('projects').select('id, name').order('name'),
      ]);

      if (rolesResult.data) setRoles(rolesResult.data);
      if (projectsResult.data) setProjects(projectsResult.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !roleId) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setSubmitting(true);
      await createInvitation(email, roleId, projectId || undefined);

      alert('Invitation envoyée avec succès!');
      setEmail('');
      setRoleId('');
      setProjectId('');
    } catch (err) {
      console.error('Error creating invitation:', err);
      alert('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (invitationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette invitation?')) {
      return;
    }

    try {
      await cancelInvitation(invitationId);
      alert('Invitation annulée');
    } catch (err) {
      console.error('Error cancelling invitation:', err);
      alert('Erreur lors de l\'annulation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'accepted':
        return <Badge variant="success">Acceptée</Badge>;
      case 'expired':
        return <Badge variant="error">Expirée</Badge>;
      case 'cancelled':
        return <Badge variant="error">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux utilisateurs
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900">
            <Mail className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Inviter un utilisateur
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Envoyer une invitation par email pour rejoindre la plateforme
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="utilisateur@exemple.ch"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Rôle <span className="text-red-500">*</span>
            </label>
            <Select value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
              <option value="">Sélectionner un rôle</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Projet (optionnel)
            </label>
            <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">Aucun projet spécifique</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Si sélectionné, l'utilisateur sera automatiquement assigné à ce projet
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/users')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                'Envoi en cours...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer l'invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Invitations récentes
        </h2>

        <div className="space-y-3">
          {loading ? (
            <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
              Chargement...
            </p>
          ) : invitations.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
              Aucune invitation pour le moment
            </p>
          ) : (
            invitations.map((invitation) => (
              <Card key={invitation.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {invitation.email}
                      </p>
                      {getStatusBadge(invitation.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <span>Rôle: {invitation.role?.name}</span>
                      {invitation.project && (
                        <span>Projet: {invitation.project.name}</span>
                      )}
                      <span>
                        Envoyée{' '}
                        {formatDistanceToNow(new Date(invitation.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                  {invitation.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(invitation.id)}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
