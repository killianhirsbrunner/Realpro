import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import ProjectHealth from '../components/project/ProjectHealth';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useProjectHealth } from '../hooks/useProjectHealth';

export default function ProjectHealthPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { health, project, loading, error, refetch } = useProjectHealth(projectId!);

  if (loading) return <LoadingState message="Analyse de la santé du projet..." />;
  if (error) return <ErrorState message={error.message} retry={refetch} />;
  if (!health || !project) return <ErrorState message="Données introuvables" />;

  const totalIssues = health.risks.length + health.alerts.length;
  const criticalRisks = health.risks.filter(r => r.severity === 'high').length;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name, href: `/projects/${projectId}` },
          { label: 'Santé' },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Santé du Projet</h1>
        <p className="text-gray-600 mt-2">
          Surveillez les risques et alertes du projet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl border-2 ${
          totalIssues === 0
            ? 'bg-green-50 border-green-200'
            : criticalRisks > 0
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {totalIssues === 0 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className={`w-6 h-6 ${criticalRisks > 0 ? 'text-red-600' : 'text-yellow-600'}`} />
            )}
            <p className="text-sm font-medium text-gray-700">État global</p>
          </div>
          <p className={`text-2xl font-bold ${
            totalIssues === 0
              ? 'text-green-900'
              : criticalRisks > 0
              ? 'text-red-900'
              : 'text-yellow-900'
          }`}>
            {totalIssues === 0 ? 'Excellent' : criticalRisks > 0 ? 'Critique' : 'Attention'}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <p className="text-sm font-medium text-gray-600">Risques</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{health.risks.length}</p>
          {criticalRisks > 0 && (
            <p className="text-sm text-red-600 mt-1">{criticalRisks} critique(s)</p>
          )}
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-6 h-6 text-yellow-600" />
            <p className="text-sm font-medium text-gray-600">Alertes</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{health.alerts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProjectHealth health={health} />

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Recommandations</h3>

          {totalIssues === 0 ? (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-green-900 font-medium">Projet en bonne santé</p>
              <p className="text-sm text-green-700 mt-1">
                Aucun problème détecté. Continuez sur cette voie !
              </p>
            </div>
          ) : (
            <>
              {criticalRisks > 0 && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-red-900 font-medium">Action immédiate requise</p>
                  <p className="text-sm text-red-700 mt-1">
                    {criticalRisks} risque(s) critique(s) nécessitent une attention immédiate.
                  </p>
                </div>
              )}

              {health.alerts.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-yellow-900 font-medium">Points d'attention</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {health.alerts.length} alerte(s) à surveiller de près.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-6 space-y-3">
            <p className="font-medium text-gray-900">Actions suggérées:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-600">•</span>
                <span>Planifier une réunion de coordination hebdomadaire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600">•</span>
                <span>Mettre à jour les délais de livraison</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600">•</span>
                <span>Vérifier les budgets et engagements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600">•</span>
                <span>Communiquer avec les parties prenantes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
