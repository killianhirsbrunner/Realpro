import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Download, RefreshCw } from 'lucide-react';
import { useCfcTable } from '../hooks/useCfcTable';
import { CfcTable } from '../components/finance/CfcTable';

export default function ProjectFinancesCfc() {
  const { projectId } = useParams<{ projectId: string }>();
  const { lines, totals, loading, error, updateLine, refresh } = useCfcTable(projectId!);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Chargement des données CFC...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 lg:px-10 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium">
            Erreur lors du chargement des données
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/projects/${projectId}/finances`}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Budgets & CFC
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Gestion des codes de frais de construction suisses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            <Download className="w-4 h-4" />
            Exporter Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle ligne CFC
          </button>
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Aucune ligne CFC
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Commencez par créer votre première ligne de budget CFC pour ce projet
            </p>
            <button className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
              Créer la première ligne
            </button>
          </div>
        </div>
      ) : (
        <CfcTable
          lines={lines}
          totals={totals}
          onUpdateLine={updateLine}
        />
      )}

      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-2">
          À propos des codes CFC
        </h3>
        <p className="text-sm text-brand-800 dark:text-brand-200">
          Les codes CFC (Codes de Frais de Construction) sont standardisés en Suisse pour la gestion des budgets de construction.
          Cliquez sur une cellule pour modifier les montants. Les totaux sont calculés automatiquement.
        </p>
      </div>
    </div>
  );
}
