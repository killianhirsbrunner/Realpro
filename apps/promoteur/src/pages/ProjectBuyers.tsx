import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Skeleton,
  EmptyState,
  Avatar,
} from '@realpro/ui';
import {
  Search,
  Plus,
  Users,
  ArrowLeft,
  Mail,
  Phone,
  Home,
  AlertCircle,
  Filter,
} from 'lucide-react';
import {
  BUYER_STATUS_LABELS,
  LOT_TYPE_LABELS,
  type BuyerStatus,
  type LotType,
  getBuyerFullName,
  getBuyerInitials,
} from '@realpro/entities';
import { useProject } from '@/features/projects/hooks/useProjects';
import { useBuyers } from '@/features/buyers/hooks/useBuyers';

const STATUS_VARIANT: Record<BuyerStatus, 'info' | 'warning' | 'success' | 'default'> = {
  PROSPECT: 'info',
  RESERVED: 'warning',
  CONTRACT_PENDING: 'warning',
  CONTRACT_SIGNED: 'success',
  NOTARY_PENDING: 'info',
  SALE_COMPLETED: 'success',
  DELIVERED: 'default',
};

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProjectBuyersPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BuyerStatus | null>(null);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { buyers, stats, isLoading: buyersLoading, error } = useBuyers(projectId);

  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const matchesSearch =
        getBuyerFullName(buyer).toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.lot_code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || buyer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [buyers, searchQuery, statusFilter]);

  // Loading state
  if (projectLoading || buyersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          Erreur de chargement
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md">
          Impossible de charger les acheteurs. Veuillez réessayer ultérieurement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {project?.name || 'Retour au projet'}
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Acheteurs
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            {stats?.total || 0} acheteur{(stats?.total || 0) !== 1 ? 's' : ''} pour ce projet
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouvel acheteur
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {(Object.keys(BUYER_STATUS_LABELS) as BuyerStatus[]).map((status) => (
            <Card
              key={status}
              className={`cursor-pointer transition-all ${
                statusFilter === status
                  ? 'ring-2 ring-primary-500'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setStatusFilter(statusFilter === status ? null : status)}
            >
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.byStatus[status] || 0}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {BUYER_STATUS_LABELS[status]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Rechercher un acheteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        {statusFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter(null)}
            leftIcon={<Filter className="w-4 h-4" />}
          >
            {BUYER_STATUS_LABELS[statusFilter]} &times;
          </Button>
        )}
      </div>

      {/* Buyers Grid */}
      {filteredBuyers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={buyers.length === 0 ? 'Aucun acheteur' : 'Aucun acheteur trouvé'}
          description={
            buyers.length === 0
              ? 'Ajoutez votre premier acheteur pour ce projet.'
              : 'Modifiez vos critères de recherche.'
          }
          action={
            buyers.length === 0
              ? { label: 'Nouvel acheteur', onClick: () => {} }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuyers.map((buyer) => (
            <Link key={buyer.id} to={`/projects/${projectId}/buyers/${buyer.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      fallback={getBuyerInitials(buyer)}
                      alt={getBuyerFullName(buyer)}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                          {getBuyerFullName(buyer)}
                        </h3>
                        <Badge variant={STATUS_VARIANT[buyer.status]} size="sm">
                          {BUYER_STATUS_LABELS[buyer.status]}
                        </Badge>
                      </div>

                      {buyer.lot_code && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                          <Home className="w-3 h-3" />
                          <span>
                            {buyer.lot_code}
                            {buyer.lot_type && ` - ${LOT_TYPE_LABELS[buyer.lot_type as LotType]}`}
                          </span>
                        </div>
                      )}

                      <div className="mt-3 space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {buyer.email && (
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{buyer.email}</span>
                          </div>
                        )}
                        {buyer.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{buyer.phone}</span>
                          </div>
                        )}
                      </div>

                      {buyer.sale_price && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {formatCurrency(buyer.sale_price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
