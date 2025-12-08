import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileEdit,
  FileSignature,
  Plus,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Users,
  Calendar
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function ProjectModificationsPage() {
  const { projectId } = useParams();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'offers' | 'avenants'>('offers');

  const stats = {
    totalOffers: 24,
    pendingOffers: 8,
    totalAvenants: 12,
    pendingSignatures: 3,
    totalValue: 245000
  };

  const recentOffers = [
    {
      id: '1',
      lot: 'B.03',
      buyer: 'Famille Martin',
      description: 'Ajout d\'une terrasse couverte',
      amount: 15000,
      status: 'pending',
      date: '2024-12-06'
    },
    {
      id: '2',
      lot: 'A.05',
      buyer: 'M. & Mme Durant',
      description: 'Modification cuisine premium',
      amount: 22500,
      status: 'approved',
      date: '2024-12-05'
    },
    {
      id: '3',
      lot: 'C.02',
      buyer: 'Famille Schmidt',
      description: 'Ajout dressing sur mesure',
      amount: 8500,
      status: 'in_review',
      date: '2024-12-04'
    }
  ];

  const recentAvenants = [
    {
      id: '1',
      lot: 'B.03',
      buyer: 'Famille Martin',
      type: 'Modification',
      amount: 15000,
      status: 'pending_signature',
      signaturesRequired: 3,
      signaturesCompleted: 1,
      date: '2024-12-07'
    },
    {
      id: '2',
      lot: 'A.05',
      buyer: 'M. & Mme Durant',
      type: 'Avenant Prix',
      amount: 22500,
      status: 'signed',
      signaturesRequired: 3,
      signaturesCompleted: 3,
      date: '2024-12-05'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'signed':
        return 'success';
      case 'pending':
      case 'pending_signature':
        return 'warning';
      case 'in_review':
        return 'info';
      case 'rejected':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'in_review': return 'En révision';
      case 'rejected': return 'Refusé';
      case 'signed': return 'Signé';
      case 'pending_signature': return 'En signature';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <FileEdit className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            Modifications & Avenants
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Gestion des offres de modification et avenants contractuels
          </p>
        </div>

        <div className="flex gap-3">
          <Link to={`/projects/${projectId}/modifications/offers/wizard`}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle offre
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Offres Totales</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.totalOffers}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FileEdit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">En attente</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.pendingOffers}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Avenants</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.totalAvenants}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <FileSignature className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">À signer</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.pendingSignatures}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Valeur Totale</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                CHF {(stats.totalValue / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'offers'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileEdit className="w-5 h-5" />
            <span className="font-medium">Offres de Modification</span>
            <Badge variant="neutral">{stats.totalOffers}</Badge>
          </button>

          <button
            onClick={() => setActiveTab('avenants')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'avenants'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileSignature className="w-5 h-5" />
            <span className="font-medium">Avenants</span>
            <Badge variant="neutral">{stats.totalAvenants}</Badge>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'offers' && (
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Offres Récentes
              </h2>
              <Link to={`/projects/${projectId}/modifications/offers`}>
                <Button variant="outline" size="sm" className="gap-2">
                  Voir toutes les offres
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentOffers.map((offer) => (
                <Link
                  key={offer.id}
                  to={`/projects/${projectId}/modifications/offers/${offer.id}`}
                  className="block border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="neutral">{offer.lot}</Badge>
                        <Badge variant={getStatusColor(offer.status)}>
                          {getStatusLabel(offer.status)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-lg mb-1">
                        {offer.description}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {offer.buyer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        CHF {offer.amount.toLocaleString('fr-CH')}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(offer.date).toLocaleDateString('fr-CH')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Link to={`/projects/${projectId}/modifications/offers/wizard`}>
              <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Créer une offre
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Nouvelle offre de modification avec l'assistant
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to={`/projects/${projectId}/modifications/offers`}>
              <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <FileEdit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Gérer les offres
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Consulter et gérer toutes les offres
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'avenants' && (
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Avenants Récents
              </h2>
              <Link to={`/projects/${projectId}/modifications/avenants`}>
                <Button variant="outline" size="sm" className="gap-2">
                  Voir tous les avenants
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentAvenants.map((avenant) => (
                <Link
                  key={avenant.id}
                  to={`/projects/${projectId}/modifications/avenants/${avenant.id}`}
                  className="block border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="neutral">{avenant.lot}</Badge>
                        <Badge variant={getStatusColor(avenant.status)}>
                          {getStatusLabel(avenant.status)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-lg mb-1">
                        {avenant.type}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {avenant.buyer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        CHF {avenant.amount.toLocaleString('fr-CH')}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(avenant.date).toLocaleDateString('fr-CH')}
                      </p>
                    </div>
                  </div>

                  {/* Signature Progress */}
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Signatures
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {avenant.signaturesCompleted} / {avenant.signaturesRequired}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          avenant.status === 'signed' ? 'bg-green-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${(avenant.signaturesCompleted / avenant.signaturesRequired) * 100}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Link to={`/projects/${projectId}/modifications/avenants`}>
              <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      En attente de signature
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {stats.pendingSignatures} avenants à signer
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to={`/projects/${projectId}/modifications/avenants`}>
              <Card className="p-6 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Avenants signés
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Consulter les avenants validés
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
