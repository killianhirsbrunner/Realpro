import { Link } from 'react-router-dom';
import { Mail, Phone, Home, ExternalLink } from 'lucide-react';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  targetLot?: string;
  targetLotId?: string;
  source: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
}

interface ProspectsTableProps {
  prospects: Prospect[];
  projectId: string;
}

export default function ProspectsTable({ prospects, projectId }: ProspectsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      website: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      phone: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      email: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      referral: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      broker: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };

    return colors[source] || 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200';
  };

  if (prospects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <p className="text-neutral-500 dark:text-neutral-400">Aucun prospect pour le moment</p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
          Ajoutez votre premier prospect pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden bg-white dark:bg-neutral-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-white">
                Nom
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-white">
                Contact
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-white">
                Intérêt
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-white">
                Source
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-white">
                Ajouté le
              </th>
              <th className="p-4 text-right font-semibold text-neutral-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {prospects.map((prospect) => (
              <tr
                key={prospect.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium text-neutral-900 dark:text-white">
                    {prospect.name}
                  </div>
                  {prospect.notes && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate max-w-xs">
                      {prospect.notes}
                    </div>
                  )}
                </td>

                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs">{prospect.email}</span>
                    </div>
                    {prospect.phone && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{prospect.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  {prospect.targetLot ? (
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-900 dark:text-white">
                        Lot {prospect.targetLot}
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                      Non défini
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSourceBadge(
                      prospect.source
                    )}`}
                  >
                    {prospect.source}
                  </span>
                </td>

                <td className="p-4 text-neutral-600 dark:text-neutral-400">
                  {formatDate(prospect.createdAt)}
                </td>

                <td className="p-4 text-right">
                  <Link
                    to={`/projects/${projectId}/crm/prospects/${prospect.id}`}
                    className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                  >
                    Voir
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
