import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChevronLeft, Download, Award, TrendingDown, TrendingUp, AlertCircle, FileText, BarChart3 } from 'lucide-react';

type OfferSummary = {
  offerId: string;
  companyName: string;
  totalExclVat: number;
  totalInclVat: number;
  delayProposal?: string | null;
  status: string;
};

type ItemComparison = {
  label: string;
  byOffer: {
    offerId: string;
    companyName: string;
    unitPrice?: number | null;
    quantity?: number | null;
    total?: number | null;
  }[];
};

type SubmissionComparisonResponse = {
  submissionId: string;
  offers: OfferSummary[];
  items: ItemComparison[];
};

export function SubmissionComparison() {
  const { projectId, submissionId } = useParams<{ projectId: string; submissionId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SubmissionComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComparison() {
      if (!submissionId) return;

      try {
        setLoading(true);
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const apiUrl = `${supabaseUrl}/functions/v1/submissions/${submissionId}/comparison`;

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement du comparatif");
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComparison();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <ErrorState message={error || "Impossible de charger le comparatif"} />
      </div>
    );
  }

  const { offers, items } = data;

  const sortedOffers = [...offers].sort((a, b) => a.totalInclVat - b.totalInclVat);
  const lowestOffer = sortedOffers[0];
  const highestOffer = sortedOffers[sortedOffers.length - 1];
  const avgPrice = offers.reduce((sum, o) => sum + o.totalInclVat, 0) / offers.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/submissions/${submissionId}`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour à la soumission
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Comparatif des offres
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Analyse détaillée des {offers.length} offre{offers.length > 1 ? 's' : ''} reçue{offers.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            {selectedOffer && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-full shadow-lg">
                <Award className="h-4 w-4 mr-2" />
                Adjuger
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-600 shadow-lg">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Offre la plus basse
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mb-1">
            {formatCurrency(lowestOffer?.totalInclVat || 0)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {lowestOffer?.companyName}
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Prix moyen
            </h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
            {formatCurrency(avgPrice)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {offers.length} offre{offers.length > 1 ? 's' : ''}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-600 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Offre la plus haute
            </h3>
          </div>
          <p className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-1">
            {formatCurrency(highestOffer?.totalInclVat || 0)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {highestOffer?.companyName}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="w-4 h-4 opacity-0"
                      disabled
                    />
                    Entreprise
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50">
                  Montant HT
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50">
                  Montant TTC
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50">
                  Délai
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50">
                  Écart
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOffers.map((offer, index) => {
                const isLowest = index === 0;
                const isHighest = index === sortedOffers.length - 1 && sortedOffers.length > 1;
                const percentDiff = lowestOffer?.totalInclVat
                  ? ((offer.totalInclVat - lowestOffer.totalInclVat) / lowestOffer.totalInclVat) * 100
                  : 0;

                return (
                  <tr
                    key={offer.offerId}
                    className={`border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                      selectedOffer === offer.offerId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } ${isLowest ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={selectedOffer === offer.offerId}
                          onChange={() => setSelectedOffer(offer.offerId)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {offer.companyName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {formatCurrency(offer.totalExclVat)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-lg font-semibold ${
                        isLowest ? 'text-green-700 dark:text-green-400' : 'text-neutral-900 dark:text-white'
                      }`}>
                        {formatCurrency(offer.totalInclVat)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {offer.delayProposal || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {percentDiff === 0 ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Meilleur
                        </Badge>
                      ) : (
                        <span className={`text-sm font-medium ${
                          percentDiff > 10 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          +{percentDiff.toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <OfferStatusPill status={offer.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedOffer && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-600 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                  Prêt à adjuger ?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Cette action va créer le contrat et notifier l'entreprise sélectionnée
                </p>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 rounded-full px-6 shadow-lg">
              <Award className="h-4 w-4 mr-2" />
              Adjuger à {sortedOffers.find(o => o.offerId === selectedOffer)?.companyName}
            </Button>
          </div>
        </Card>
      )}

      {items.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              Comparatif par poste
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Comparaison détaillée poste par poste lorsque le bordereau est structuré
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    {item.label}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <th className="px-4 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50">
                            Entreprise
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50">
                            Quantité
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50">
                            Prix unitaire
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.byOffer.map((row, rowIdx) => (
                          <tr key={rowIdx} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <td className="px-4 py-3 text-neutral-900 dark:text-white font-medium">
                              {row.companyName}
                            </td>
                            <td className="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">
                              {row.quantity != null ? formatNumber(row.quantity) : '—'}
                            </td>
                            <td className="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">
                              {row.unitPrice != null ? formatCurrency(row.unitPrice) : '—'}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-neutral-900 dark:text-white">
                              {row.total != null ? formatCurrency(row.total) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OfferStatusPill({ status }: { status: string }) {
  const s = status.toUpperCase();
  let label = status;
  let className = 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';

  if (s === 'SUBMITTED') {
    label = 'Reçue';
    className = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  } else if (s === 'WINNER') {
    label = 'Adjugée';
    className = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  } else if (s === 'REJECTED') {
    label = 'Refusée';
    className = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }

  return (
    <Badge className={className}>
      {label}
    </Badge>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-CH', {
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}
