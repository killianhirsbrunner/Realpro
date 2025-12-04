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
      website: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      phone: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      email: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      referral: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200',
      broker: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };

    return colors[source] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (prospects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Aucun prospect pour le moment</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Ajoutez votre premier prospect pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden bg-white dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Nom
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Contact
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Intérêt
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Source
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Ajouté le
              </th>
              <th className="p-4 text-right font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {prospects.map((prospect) => (
              <tr
                key={prospect.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {prospect.name}
                  </div>
                  {prospect.notes && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                      {prospect.notes}
                    </div>
                  )}
                </td>

                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs">{prospect.email}</span>
                    </div>
                    {prospect.phone && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{prospect.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  {prospect.targetLot ? (
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900 dark:text-white">
                        Lot {prospect.targetLot}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
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

                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {formatDate(prospect.createdAt)}
                </td>

                <td className="p-4 text-right">
                  <Link
                    to={`/projects/${projectId}/crm/prospects/${prospect.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
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
