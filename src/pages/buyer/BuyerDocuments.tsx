import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { supabase } from '../../lib/supabase';
import { formatDateCH } from '../../lib/utils/format';

interface BuyerDocument {
  id: string;
  name: string;
  category: string;
  created_at: string;
  file_url: string;
}

interface BuyerDocumentsData {
  buyer: {
    first_name: string;
    last_name: string;
  };
  documents: BuyerDocument[];
}

export function BuyerDocuments() {
  const { buyerId } = useParams<{ buyerId: string }>();
  const [data, setData] = useState<BuyerDocumentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (buyerId) {
      fetchDocuments(buyerId);
    }
  }, [buyerId]);

  async function fetchDocuments(id: string) {
    try {
      setLoading(true);
      setError(null);

      // Fetch buyer info
      const { data: buyer, error: buyerError } = await supabase
        .from('buyers')
        .select('first_name, last_name')
        .eq('id', id)
        .single();

      if (buyerError) throw buyerError;

      // Fetch documents
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('id, name, category, created_at, file_url')
        .eq('buyer_id', id)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      setData({
        buyer: {
          first_name: buyer.first_name,
          last_name: buyer.last_name,
        },
        documents: documents || [],
      });
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement..." />;
  if (error) return <ErrorState message={error} retry={() => fetchDocuments(buyerId!)} />;
  if (!data) return <ErrorState message="Aucune donnée disponible" />;

  const { buyer, documents } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-neutral-900">Mes documents</h1>
        <p className="text-sm text-neutral-500">
          Documents officiels liés à votre achat, {buyer.first_name}{' '}
          {buyer.last_name}.
        </p>
      </header>

      {documents.length === 0 ? (
        <div className="rounded-2xl border bg-white px-4 py-12 text-center">
          <p className="text-sm text-neutral-500">
            Aucun document n'est disponible pour l'instant. Vous serez informé
            dès qu'un contrat, un plan ou un avenant sera déposé.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-xs">
              <tr>
                <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-neutral-500">
                  Nom
                </th>
                <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-neutral-500">
                  Type
                </th>
                <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-neutral-500">
                  Date
                </th>
                <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-neutral-50">
                  <td className="px-3 py-3 align-middle">{doc.name}</td>
                  <td className="px-3 py-3 align-middle">
                    {renderCategory(doc.category)}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    {formatDateCH(doc.created_at)}
                  </td>
                  <td className="px-3 py-3 align-middle text-right">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      Télécharger
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function renderCategory(cat: string): string {
  const c = cat.toUpperCase();
  if (c === 'CONTRACT') return 'Contrat';
  if (c === 'PLAN') return 'Plan';
  if (c === 'ADDENDUM') return 'Avenant';
  if (c === 'TECHNICAL') return 'Descriptif technique';
  return 'Autre';
}
