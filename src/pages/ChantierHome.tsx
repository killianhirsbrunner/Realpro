import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Hammer, AlertCircle, Camera, MessageSquare, Wifi, WifiOff, Building2, ClipboardList, FileText, Settings } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  name: string;
  city: string;
  status: string;
}

export function ChantierHome() {
  const { user, organization } = useCurrentUser();
  const { isOnline, queueLength, syncing, syncQueue } = useOfflineQueue();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [organization?.id]);

  async function fetchProjects() {
    if (!organization?.id) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, city, status')
        .eq('organization_id', organization.id)
        .in('status', ['IN_PROGRESS', 'PLANNED'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mode Chantier</h1>
            <p className="text-sm text-gray-400 mt-1">
              {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isOnline ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded-lg">
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">En ligne</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm font-medium">Hors ligne</span>
              </div>
            )}
          </div>
        </div>

        {queueLength > 0 && (
          <Card className="bg-yellow-900 border-yellow-700">
            <Card.Content className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-100">
                      {queueLength} action{queueLength > 1 ? 's' : ''} en attente
                    </p>
                    <p className="text-sm text-yellow-300">
                      {isOnline ? 'Synchronisation en cours...' : 'Sera synchronisé une fois en ligne'}
                    </p>
                  </div>
                </div>
                {isOnline && (
                  <button
                    onClick={syncQueue}
                    disabled={syncing}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {syncing ? 'Sync...' : 'Synchroniser'}
                  </button>
                )}
              </div>
            </Card.Content>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/chantier/journal"
            className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors"
          >
            <Camera className="h-10 w-10 text-brand-400" />
            <span className="text-sm font-medium text-center">Journal de chantier</span>
          </Link>

          <Link
            to="/chantier/sav"
            className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors"
          >
            <Hammer className="h-10 w-10 text-brand-400" />
            <span className="text-sm font-medium text-center">Tickets SAV</span>
          </Link>

          <Link
            to="/chantier/messages"
            className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors"
          >
            <MessageSquare className="h-10 w-10 text-green-400" />
            <span className="text-sm font-medium text-center">Messages</span>
          </Link>

          <Link
            to="/"
            className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors"
          >
            <Home className="h-10 w-10 text-gray-400" />
            <span className="text-sm font-medium text-center">Mode bureau</span>
          </Link>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Projets en cours</h2>

          {projects.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <Card.Content className="py-12 text-center">
                <Home className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucun projet en cours</p>
              </Card.Content>
            </Card>
          ) : (
            projects.map(project => (
              <Link key={project.id} to={`/chantier/projects/${project.id}`}>
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                  <Card.Content className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-400">{project.city}</p>
                      </div>
                      <Badge variant="info">{project.status}</Badge>
                    </div>
                  </Card.Content>
                </Card>
              </Link>
            ))
          )}
        </div>

        <div className="pt-6 text-center text-xs text-gray-500">
          <p>Mode PWA - Fonctionne hors ligne</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
