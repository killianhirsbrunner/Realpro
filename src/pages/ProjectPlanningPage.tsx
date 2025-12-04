import { useParams, Link } from 'react-router-dom';
import { usePlanning } from '../hooks/usePlanning';
import { Gantt } from '../components/planning/Gantt';
import { ProgressSummaryCard } from '../components/planning/ProgressSummaryCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Camera, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function ProjectPlanningPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { tasks, alerts, summary, loading, error } = usePlanning(projectId!);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur : {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planning du chantier</h1>
          <p className="text-neutral-600 mt-1">
            Suivi en temps réel de l'avancement des travaux
          </p>
        </div>

        <div className="flex gap-2">
          <Link to={`/projects/${projectId}/planning/photos`}>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Photos
            </Button>
          </Link>
          <Link to={`/projects/${projectId}/planning/reports`}>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Rapports
            </Button>
          </Link>
          <Link to={`/projects/${projectId}/planning/buyers`}>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Avancement acheteurs
            </Button>
          </Link>
        </div>
      </div>

      {alerts.length > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">
                {alerts.length} alerte{alerts.length > 1 ? 's' : ''} active{alerts.length > 1 ? 's' : ''}
              </h3>
              <ul className="space-y-1">
                {alerts.slice(0, 3).map(alert => (
                  <li key={alert.id} className="text-sm text-orange-800">
                    • {alert.message}
                  </li>
                ))}
              </ul>
              {alerts.length > 3 && (
                <p className="text-sm text-orange-700 mt-2">
                  +{alerts.length - 3} autre{alerts.length > 4 ? 's' : ''} alerte{alerts.length > 4 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <ProgressSummaryCard summary={summary} />

      <Gantt tasks={tasks} />
    </div>
  );
}
