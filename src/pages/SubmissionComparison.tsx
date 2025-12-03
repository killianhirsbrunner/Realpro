import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ErrorState message={error || "Impossible de charger le comparatif"} />
      </div>
    );
  }

  const { offers, items } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Soumission · Comparatif d'offres
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Comparatif des offres reçues
        </h1>
        <p className="text-sm text-gray-500">
          Analyse globale et détaillée des montants proposés par chaque entreprise
        </p>
      </header>

      <section className="space-y-3">
        <SectionHeader
          title="Vue globale par entreprise"
          description="Synthèse des montants proposés par entreprise, toutes positions confondues"
        />
        {offers.length === 0 ? (
          <EmptyState text="Aucune offre reçue pour cette soumission" />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs">
                  <tr>
                    <Th>Entreprise</Th>
                    <Th className="text-right">Montant HT</Th>
                    <Th className="text-right">Montant TTC</Th>
                    <Th>Délai proposé</Th>
                    <Th>Statut</Th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {offers.map((offer) => (
                    <tr key={offer.offerId} className="hover:bg-gray-50">
                      <Td>{offer.companyName}</Td>
                      <Td className="text-right tabular-nums font-medium">
                        {formatCurrency(offer.totalExclVat)}
                      </Td>
                      <Td className="text-right tabular-nums font-semibold">
                        {formatCurrency(offer.totalInclVat)}
                      </Td>
                      <Td className="text-gray-600">
                        {offer.delayProposal || 'Non indiqué'}
                      </Td>
                      <Td>
                        <OfferStatusPill status={offer.status} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <SectionHeader
          title="Comparatif par poste"
          description="Comparaison détaillée poste par poste lorsque le bordereau est structuré"
        />

        {items.length === 0 ? (
          <EmptyState text="Le détail par poste n'est pas disponible. Les offres ne comportent pas de bordereau structuré" />
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <Card key={idx}>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <Th>Entreprise</Th>
                          <Th className="text-right">Quantité</Th>
                          <Th className="text-right">Prix unitaire</Th>
                          <Th className="text-right">Total poste</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {item.byOffer.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-gray-50">
                            <Td className="text-gray-900">{row.companyName}</Td>
                            <Td className="text-right tabular-nums text-gray-600">
                              {row.quantity != null ? formatNumber(row.quantity) : '—'}
                            </Td>
                            <Td className="text-right tabular-nums text-gray-600">
                              {row.unitPrice != null ? formatCurrency(row.unitPrice) : '—'}
                            </Td>
                            <Td className="text-right tabular-nums font-medium text-gray-900">
                              {row.total != null ? formatCurrency(row.total) : '—'}
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${projectId}/submissions/${submissionId}`)}
        >
          Retour à la soumission
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            alert('Export Excel à implémenter');
          }}
        >
          Exporter le comparatif
        </Button>
      </section>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left font-semibold uppercase tracking-wide text-gray-500 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card>
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </Card>
  );
}

function OfferStatusPill({ status }: { status: string }) {
  const s = status.toUpperCase();
  let label = status;
  let styles = 'bg-gray-100 text-gray-700';

  if (s === 'SUBMITTED') {
    label = 'Soumise';
    styles = 'bg-blue-50 text-blue-700';
  } else if (s === 'WINNER') {
    label = 'Adjugée';
    styles = 'bg-green-50 text-green-700';
  } else if (s === 'REJECTED') {
    label = 'Refusée';
    styles = 'bg-red-50 text-red-700';
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
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
