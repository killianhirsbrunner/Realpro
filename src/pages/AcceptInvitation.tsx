import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Calendar,
  MapPin,
  ChevronRight,
  UserPlus,
  Clock,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAcceptInvitation, PARTICIPANT_ROLE_LABELS } from '../hooks/useProjectInvitations';
import type { ParticipantRole } from '../types/stakeholder';

export default function AcceptInvitation() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { invitation, loading, error, fetchInvitationByToken, acceptInvitation } = useAcceptInvitation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    checkAuth();
    if (token) {
      fetchInvitationByToken(token);
    }
  }, [token]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    setIsAuthenticated(!!data.user);
  };

  const handleAccept = async () => {
    if (!token) return;

    setAcceptError(null);
    setIsAccepting(true);

    try {
      await acceptInvitation(token);
      setAccepted(true);

      // Redirect to onboarding after 2 seconds
      setTimeout(() => {
        navigate(`/onboarding/${invitation?.project_id}`);
      }, 2000);
    } catch (err) {
      setAcceptError(err instanceof Error ? err.message : 'Erreur lors de l\'acceptation');
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Chargement de l'invitation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Invitation invalide
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {error.message}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Invitation acceptée !
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Redirection vers la configuration de votre compte...
          </p>
          <div className="mt-4">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Invitation card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header with organization branding */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center text-white">
            {invitation.organization?.logo_url ? (
              <img
                src={invitation.organization.logo_url}
                alt={invitation.organization.name}
                className="mx-auto h-12 w-auto mb-4"
              />
            ) : (
              <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8" />
              </div>
            )}
            <h1 className="text-2xl font-bold">
              {invitation.organization?.name}
            </h1>
            <p className="mt-1 text-white/80">
              vous invite à rejoindre un projet
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Project info */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Projet
              </h3>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {invitation.project?.name}
              </p>
              {invitation.project?.address && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {invitation.project.address}
                </p>
              )}
            </div>

            {/* Invitation details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Rôle attribué</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {PARTICIPANT_ROLE_LABELS[invitation.role as ParticipantRole]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Invité par</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {invitation.inviter?.first_name} {invitation.inviter?.last_name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Expire le</span>
                <span className="text-sm text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(invitation.expires_at)}
                </span>
              </div>
            </div>

            {/* Message from inviter */}
            {invitation.message && (
              <div className="border-l-4 border-indigo-500 pl-4 py-2">
                <p className="text-sm italic text-gray-600 dark:text-gray-300">
                  "{invitation.message}"
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  — {invitation.inviter?.first_name}
                </p>
              </div>
            )}

            {/* Accept error */}
            {acceptError && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{acceptError}</span>
              </div>
            )}

            {/* Actions */}
            {isAuthenticated ? (
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Acceptation en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Accepter l'invitation
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Connectez-vous ou créez un compte pour accepter cette invitation
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/login?redirect=/invitation/${token}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Se connecter
                  </Link>
                  <Link
                    to={`/register?redirect=/invitation/${token}&email=${encodeURIComponent(invitation.email)}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Créer un compte
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          En acceptant cette invitation, vous acceptez les{' '}
          <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
            conditions d'utilisation
          </Link>{' '}
          de la plateforme.
        </p>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-CH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
