import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Download,
  FileArchive,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  Archive,
  FileText,
} from 'lucide-react';
import { useProjectExports, ProjectExport } from '@/hooks/useProjectExports';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProjectExportPanelProps {
  projectId: string;
}

export default function ProjectExportPanel({ projectId }: ProjectExportPanelProps) {
  const { t } = useTranslation();
  const {
    loading,
    error,
    listExports,
    createExport,
    deleteExport,
    getDownloadUrl,
    formatFileSize,
    getStatusLabel,
    getStatusColor,
  } = useProjectExports();

  const [exports, setExports] = useState<ProjectExport[]>([]);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadExports = async () => {
    const data = await listExports(projectId);
    setExports(data);

    const hasProcessing = data.some(exp => exp.status === 'PROCESSING' || exp.status === 'PENDING');
    setAutoRefresh(hasProcessing);
  };

  useEffect(() => {
    loadExports();
  }, [projectId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadExports();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, projectId]);

  const handleCreateExport = async () => {
    if (!confirm('Générer un export complet du projet ? Cette opération peut prendre quelques minutes.')) {
      return;
    }

    setCreating(true);
    const result = await createExport(projectId);
    setCreating(false);

    if (result) {
      await loadExports();
    } else {
      alert('Erreur lors de la création de l\'export. Veuillez réessayer.');
    }
  };

  const handleDownload = async (exp: ProjectExport) => {
    if (exp.status !== 'SUCCESS') return;

    setDownloading(exp.id);

    try {
      const signedUrl = await getDownloadUrl(exp.id);
      if (signedUrl) {
        window.open(signedUrl, '_blank');
      } else {
        alert('Erreur lors de la récupération du lien de téléchargement.');
      }
    } catch (err) {
      alert('Erreur lors du téléchargement.');
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (exp: ProjectExport) => {
    if (!confirm('Supprimer cet export ? Cette action est irréversible.')) {
      return;
    }

    setDeleting(exp.id);
    const success = await deleteExport(exp.id);
    setDeleting(null);

    if (success) {
      await loadExports();
    } else {
      alert('Erreur lors de la suppression de l\'export.');
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return CheckCircle;
      case 'FAILED':
        return AlertCircle;
      case 'PROCESSING':
        return RefreshCw;
      default:
        return Clock;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
            <Archive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Export légal du projet
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Génère un fichier ZIP contenant tous les documents, données structurées, tickets SAV et historiques du projet.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Documents juridiques
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileArchive className="h-3 w-3" />
                Données JSON
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Tickets SAV
              </span>
              <span>•</span>
              <span>Audit & Journal</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleCreateExport}
          disabled={creating || loading}
          className="shrink-0"
        >
          {creating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <FileArchive className="mr-2 h-4 w-4" />
              Nouveau export
            </>
          )}
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-50">
          Historique des exports
        </h3>

        {loading && exports.length === 0 ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : exports.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
            <FileArchive className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Aucun export généré pour l'instant
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Cliquez sur "Nouveau export" pour créer votre premier export
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {exports.map((exp) => {
              const StatusIcon = getStatusIcon(exp.status);
              const isProcessing = exp.status === 'PROCESSING' || exp.status === 'PENDING';

              return (
                <div
                  key={exp.id}
                  className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''} ${
                            exp.status === 'SUCCESS'
                              ? 'text-green-600 dark:text-green-400'
                              : exp.status === 'FAILED'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        />
                        <p className="font-medium text-gray-900 dark:text-gray-50">
                          Export du {formatDate(exp.created_at)}
                        </p>
                        <Badge
                          variant={
                            exp.status === 'SUCCESS'
                              ? 'success'
                              : exp.status === 'FAILED'
                              ? 'error'
                              : exp.status === 'PROCESSING'
                              ? 'info'
                              : 'secondary'
                          }
                          size="sm"
                        >
                          {getStatusLabel(exp.status)}
                        </Badge>
                      </div>

                      {exp.status === 'SUCCESS' && (
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>{formatFileSize(exp.file_size)}</span>
                          {exp.total_lots > 0 && <span>• {exp.total_lots} lots</span>}
                          {exp.total_buyers > 0 && <span>• {exp.total_buyers} acheteurs</span>}
                          {exp.total_sav_tickets > 0 && <span>• {exp.total_sav_tickets} tickets SAV</span>}
                        </div>
                      )}

                      {exp.status === 'PROCESSING' && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                          Génération en cours... Veuillez patienter.
                        </p>
                      )}

                      {exp.status === 'FAILED' && exp.error_message && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          Erreur: {exp.error_message}
                        </p>
                      )}

                      {exp.completed_at && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                          Complété le {formatDate(exp.completed_at)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {exp.status === 'SUCCESS' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDownload(exp)}
                          disabled={downloading === exp.id}
                        >
                          {downloading === exp.id ? (
                            <>
                              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                              Préparation...
                            </>
                          ) : (
                            <>
                              <Download className="mr-1 h-3 w-3" />
                              Télécharger
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDelete(exp)}
                        disabled={deleting === exp.id}
                      >
                        {deleting === exp.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="mr-1 inline h-4 w-4" />
            {error}
          </p>
        </div>
      )}

      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h4 className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-100">
          <FileArchive className="h-4 w-4" />
          Contenu de l'export
        </h4>
        <ul className="mt-2 space-y-1 text-xs text-blue-800 dark:text-blue-200">
          <li>• Documents juridiques (contrats, actes notariaux)</li>
          <li>• Plans et documents techniques</li>
          <li>• Données projet (lots, acheteurs, budgets CFC)</li>
          <li>• Contrats de vente et factures</li>
          <li>• Tickets SAV complets avec historiques</li>
          <li>• Audit log et journal de chantier</li>
          <li>• Résumé exécutif et statistiques</li>
        </ul>
        <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
          <strong>Conformité légale:</strong> Archive prête pour dépôt chez notaire, transmission
          à un nouveau propriétaire, ou archivage légal (10 ans minimum selon normes SIA).
        </p>
      </div>
    </Card>
  );
}
