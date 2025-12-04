import { Card } from '../ui/Card';
import { FileText, Calendar, Building2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { CFCContract } from '../../hooks/useCFC';

interface CfcContractsCardProps {
  contracts: CFCContract[];
}

export function CfcContractsCard({ contracts }: CfcContractsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'signed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'draft':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'signed':
        return 'Signé';
      case 'pending':
        return 'En attente';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const totalContracted = contracts.reduce((sum, contract) => sum + contract.amount, 0);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Contrats & Engagements
          </h3>
          <div className="text-right">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total engagé</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              CHF {totalContracted.toLocaleString()}
            </p>
          </div>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Aucun contrat pour ce poste CFC
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {contracts.map((contract) => (
              <li
                key={contract.id}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-600 dark:hover:border-primary-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                      <Building2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {contract.company_name}
                      </p>
                      {contract.date_signed && (
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(contract.date_signed).toLocaleDateString('fr-CH')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(contract.status) as any}>
                    {getStatusLabel(contract.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">Montant</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    CHF {contract.amount.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
