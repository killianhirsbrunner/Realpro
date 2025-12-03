import { useEffect, useState } from 'react';
import { Home, Download, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { supabase } from '../../lib/supabase';
import { formatCHF, formatDateCH, formatSurface } from '../../lib/utils/format';
import { getStatusLabel } from '../../lib/constants/status-labels';

interface BuyerLotData {
  buyer: {
    id: string;
    first_name: string;
    last_name: string;
  };
  project: {
    name: string;
    city: string;
    expected_delivery: string;
  };
  lot: {
    lot_number: string;
    type: string;
    floor: number;
    rooms: number;
    surface_habitable: number;
    surface_ppe: number;
    price_vat: number;
    status: string;
  };
  buyer_file: {
    status: string;
    signature_date: string | null;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export function BuyerMyLot() {
  const [data, setData] = useState<BuyerLotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuyerData();
  }, []);

  async function fetchBuyerData() {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Fetch buyer info with project and lot
      const { data: buyer, error: buyerError } = await supabase
        .from('buyers')
        .select(`
          id,
          first_name,
          last_name,
          projects (
            name,
            city,
            expected_delivery
          ),
          lots (
            lot_number,
            type,
            floor,
            rooms,
            surface_habitable,
            surface_ppe,
            price_vat,
            status
          ),
          buyer_files (
            status,
            signature_date
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (buyerError) throw buyerError;

      // TODO: Fetch documents
      const documents: any[] = [];

      setData({
        buyer: {
          id: buyer.id,
          first_name: buyer.first_name,
          last_name: buyer.last_name,
        },
        project: buyer.projects,
        lot: buyer.lots,
        buyer_file: buyer.buyer_files?.[0] || { status: 'INCOMPLETE', signature_date: null },
        documents,
      });
    } catch (err: any) {
      console.error('Error fetching buyer data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement..." />;
  if (error) return <ErrorState message={error} retry={fetchBuyerData} />;
  if (!data) return <ErrorState message="Aucune donnée disponible" />;

  const { buyer, project, lot, buyer_file, documents } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Votre appartement</h1>
        <p className="mt-1 text-sm text-gray-500">
          Toutes les informations sur votre futur logement
        </p>
      </div>

      {/* Main Info Card */}
      <Card>
        <Card.Content>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 p-4 bg-blue-50 rounded-xl">
              <Home className="h-12 w-12 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {project.name} – {project.city}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Lot</p>
                  <p className="text-lg font-semibold text-gray-900">{lot.lot_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pièces</p>
                  <p className="text-lg font-semibold text-gray-900">{lot.rooms}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Surface</p>
                  <p className="text-lg font-semibold text-gray-900">{formatSurface(lot.surface_habitable)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Étage</p>
                  <p className="text-lg font-semibold text-gray-900">{lot.floor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={lot.status === 'SOLD' ? 'success' : 'warning'}>
                  {getStatusLabel('lot', lot.status)}
                </Badge>
                <span className="text-sm text-gray-500">
                  Prix: <span className="font-semibold text-gray-900">{formatCHF(lot.price_vat)}</span>
                </span>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Status Card */}
      {buyer_file.signature_date && (
        <Card className="bg-green-50 border-green-200">
          <Card.Content>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Félicitations !</h3>
                <p className="text-sm text-green-800">
                  Votre acte de vente a été signé le {formatDateCH(buyer_file.signature_date)}.
                  <br />
                  Nous vous tiendrons informé des prochaines étapes.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Delivery Info */}
      <Card>
        <Card.Header>
          <Card.Title>Remise des clés</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Date de remise prévue</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatDateCH(project.expected_delivery)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Card.Content>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Plan de votre lot</h3>
                <p className="text-sm text-gray-500">Télécharger le plan détaillé</p>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </div>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Card.Content>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Contrat de vente</h3>
                <p className="text-sm text-gray-500">Télécharger votre contrat</p>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Property Details */}
      <Card>
        <Card.Header>
          <Card.Title>Détails du bien</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Surfaces</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Surface habitable</span>
                  <span className="text-sm font-medium text-gray-900">{formatSurface(lot.surface_habitable)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Surface PPE</span>
                  <span className="text-sm font-medium text-gray-900">{formatSurface(lot.surface_ppe)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informations</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium text-gray-900">{lot.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Étage</span>
                  <span className="text-sm font-medium text-gray-900">{lot.floor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nombre de pièces</span>
                  <span className="text-sm font-medium text-gray-900">{lot.rooms}</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
