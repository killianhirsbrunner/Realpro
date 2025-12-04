import { Link } from 'react-router-dom';
import { FileText, Calendar, AlertCircle } from 'lucide-react';
import NotaryStatusTag from './NotaryStatusTag';

interface NotaryBuyerCardProps {
  dossier: any;
  projectId: string;
}

export default function NotaryBuyerCard({ dossier, projectId }: NotaryBuyerCardProps) {
  const { buyer, status, missing_fields, created_at } = dossier;

  return (
    <Link
      to={`/dashboard/projects/${projectId}/notary/${dossier.id}`}
      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft hover:shadow-card transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {buyer?.first_name} {buyer?.last_name}
          </h3>
          <p className="text-sm text-neutral-500">{buyer?.email}</p>
        </div>
        <FileText className="w-5 h-5 text-neutral-400" />
      </div>

      <NotaryStatusTag status={status} className="mb-4" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-neutral-600">
          <Calendar className="w-4 h-4" />
          <span>Créé le {new Date(created_at).toLocaleDateString('fr-CH')}</span>
        </div>

        {missing_fields && missing_fields.length > 0 && (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span>{missing_fields.length} document(s) manquant(s)</span>
          </div>
        )}
      </div>

      {buyer?.lot_number && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <span className="text-sm text-neutral-500">
            Lot: <span className="font-medium text-neutral-900">{buyer.lot_number}</span>
          </span>
        </div>
      )}
    </Link>
  );
}
