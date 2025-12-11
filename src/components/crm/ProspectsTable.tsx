import { Link } from 'react-router-dom';
import { Mail, Phone, Home, ExternalLink, User } from 'lucide-react';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  targetLot?: string;
  targetLotId?: string;
  source: string;
  status?: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
}

interface ProspectsTableProps {
  prospects: Prospect[];
  projectId: string;
}

export function ProspectsTable({ prospects, projectId }: ProspectsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      website: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
      phone: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      email: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      referral: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      broker: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      walk_in: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      event: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      social_media: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      advertising: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    };

    return colors[source] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      website: 'Site web',
      phone: 'Téléphone',
      email: 'Email',
      referral: 'Recommandation',
      broker: 'Courtier',
      walk_in: 'Visite',
      event: 'Événement',
      social_media: 'Réseaux sociaux',
      advertising: 'Publicité',
      other: 'Autre',
    };
    return labels[source] || source;
  };

  const getStatusBadge = (status?: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      CONTACTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      QUALIFIED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      CONVERTED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      LOST: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[status || 'NEW'] || colors.NEW;
  };

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      NEW: 'Nouveau',
      CONTACTED: 'Contacté',
      QUALIFIED: 'Qualifié',
      CONVERTED: 'Converti',
      LOST: 'Perdu',
    };
    return labels[status || 'NEW'] || 'Nouveau';
  };

  if (prospects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 font-medium">Aucun prospect pour le moment</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Ajoutez votre premier prospect pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Nom
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Contact
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Intérêt
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Source
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Statut
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Ajouté le
              </th>
              <th className="p-4 text-right font-semibold text-neutral-900 dark:text-neutral-100">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {prospects.map((prospect) => (
              <tr
                key={prospect.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
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
                      <Mail className="w-3.5 h-3.5" />
                      <a
                        href={`mailto:${prospect.email}`}
                        className="text-xs hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        {prospect.email}
                      </a>
                    </div>
                    {prospect.phone && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Phone className="w-3.5 h-3.5" />
                        <a
                          href={`tel:${prospect.phone}`}
                          className="text-xs hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {prospect.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  {prospect.targetLot ? (
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        Lot {prospect.targetLot}
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs italic">
                      Non défini
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${getSourceBadge(
                      prospect.source
                    )}`}
                  >
                    {getSourceLabel(prospect.source)}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(
                      prospect.status
                    )}`}
                  >
                    {getStatusLabel(prospect.status)}
                  </span>
                </td>

                <td className="p-4 text-neutral-600 dark:text-neutral-400">
                  {formatDate(prospect.createdAt)}
                </td>

                <td className="p-4 text-right">
                  <Link
                    to={`/projects/${projectId}/crm/prospects/${prospect.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg font-medium transition-colors"
                  >
                    Voir
                    <ExternalLink className="w-3.5 h-3.5" />
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

export default ProspectsTable;
