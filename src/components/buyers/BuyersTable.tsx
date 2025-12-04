import { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Search, Mail, Phone, FileText, CheckCircle, XCircle } from 'lucide-react';

interface Buyer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  lot_number?: string;
  status: string;
  documents_complete?: boolean;
}

interface BuyersTableProps {
  buyers: Buyer[];
}

export function BuyersTable({ buyers }: BuyersTableProps) {
  const [search, setSearch] = useState('');

  const filtered = buyers.filter((buyer) => {
    const fullName = `${buyer.first_name} ${buyer.last_name}`.toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      buyer.email?.toLowerCase().includes(searchLower) ||
      buyer.lot_number?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      prospect: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      reservation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      contract_signed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      financing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      notary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      prospect: 'Prospect',
      reservation: 'Réservation',
      contract_signed: 'Contrat signé',
      financing: 'Financement',
      notary: 'Notaire',
      completed: 'Complété',
    };
    return labels[status] || status;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Rechercher un acheteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Lot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Documents
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">
                  Aucun acheteur trouvé
                </td>
              </tr>
            ) : (
              filtered.map((buyer) => (
                <tr
                  key={buyer.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {buyer.first_name} {buyer.last_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {buyer.email && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{buyer.email}</span>
                        </div>
                      )}
                      {buyer.phone && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <Phone className="h-3 w-3" />
                          <span>{buyer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {buyer.lot_number || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(buyer.status)}>
                      {getStatusLabel(buyer.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {buyer.documents_complete ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Complet</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-orange-600">Manquant</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
