import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HardHat,
  Camera,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Users,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function ProjectConstructionPage() {
  const { projectId } = useParams();
  const { t } = useI18n();

  const constructionPhases = [
    {
      id: '1',
      name: 'Gros œuvre',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      responsible: 'Entreprise Martin SA',
      issues: 0
    },
    {
      id: '2',
      name: 'Second œuvre',
      status: 'in_progress',
      progress: 65,
      startDate: '2024-07-01',
      endDate: '2024-11-30',
      responsible: 'Entreprise Dupont SA',
      issues: 2
    },
    {
      id: '3',
      name: 'Finitions',
      status: 'planned',
      progress: 0,
      startDate: '2024-12-01',
      endDate: '2025-03-31',
      responsible: 'Entreprise Laurent SA',
      issues: 0
    }
  ];

  const recentPhotos = [
    { id: '1', date: '2024-12-07', count: 24, thumbnail: null },
    { id: '2', date: '2024-12-05', count: 18, thumbnail: null },
    { id: '3', date: '2024-12-01', count: 32, thumbnail: null }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'planned': return 'neutral';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'planned': return Calendar;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <HardHat className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            Suivi de Chantier
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Gestion et suivi de l'avancement des travaux
          </p>
        </div>

        <div className="flex gap-3">
          <Link to={`/projects/${projectId}/planning/photos`}>
            <Button variant="outline" className="gap-2">
              <Camera className="w-4 h-4" />
              Photos
            </Button>
          </Link>
          <Link to={`/projects/${projectId}/planning/reports`}>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Rapports
            </Button>
          </Link>
          <Link to={`/projects/${projectId}/planning`}>
            <Button className="gap-2">
              <Calendar className="w-4 h-4" />
              Planning
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Avancement Global</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">55%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '55%' }} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Phases Actives</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">1</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Problèmes Ouverts</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">2</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Entreprises</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">12</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Phases de Construction */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Phases de Construction
          </h2>
          <Link to={`/projects/${projectId}/planning`}>
            <Button variant="outline" size="sm" className="gap-2">
              Voir Planning
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {constructionPhases.map((phase) => {
            const StatusIcon = getStatusIcon(phase.status);

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      phase.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                      phase.status === 'in_progress' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-neutral-100 dark:bg-neutral-800'
                    }`}>
                      <StatusIcon className={`w-6 h-6 ${
                        phase.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                        phase.status === 'in_progress' ? 'text-orange-600 dark:text-orange-400' :
                        'text-neutral-600 dark:text-neutral-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-lg">
                        {phase.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {phase.responsible}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(phase.status)}>
                      {phase.status === 'completed' ? 'Terminé' :
                       phase.status === 'in_progress' ? 'En cours' : 'Planifié'}
                    </Badge>
                    {phase.issues > 0 && (
                      <Badge variant="error">
                        {phase.issues} problème{phase.issues > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Début:</span>
                    <span className="ml-2 text-neutral-900 dark:text-white font-medium">
                      {new Date(phase.startDate).toLocaleDateString('fr-CH')}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Fin prévue:</span>
                    <span className="ml-2 text-neutral-900 dark:text-white font-medium">
                      {new Date(phase.endDate).toLocaleDateString('fr-CH')}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Avancement
                    </span>
                    <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                      {phase.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        phase.status === 'completed' ? 'bg-green-600' :
                        phase.status === 'in_progress' ? 'bg-orange-600' :
                        'bg-neutral-400'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Photos Récentes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Photos Récentes
          </h2>
          <Link to={`/projects/${projectId}/planning/photos`}>
            <Button variant="outline" size="sm" className="gap-2">
              Voir toutes les photos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentPhotos.map((photo) => (
            <Link
              key={photo.id}
              to={`/projects/${projectId}/planning/photos`}
              className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
            >
              <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-3 flex items-center justify-center">
                <Camera className="w-12 h-12 text-neutral-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {new Date(photo.date).toLocaleDateString('fr-CH')}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {photo.count} photos
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Rapports de Chantier */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Rapports de Chantier
          </h2>
          <Link to={`/projects/${projectId}/planning/reports`}>
            <Button variant="outline" size="sm" className="gap-2">
              Tous les rapports
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucun rapport récent</p>
          <Link to={`/projects/${projectId}/planning/reports`}>
            <Button variant="outline" size="sm" className="mt-4">
              Créer un rapport
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
