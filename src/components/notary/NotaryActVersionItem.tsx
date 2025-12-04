import { FileText, Download, User, Calendar } from 'lucide-react';

interface NotaryActVersionItemProps {
  version: any;
}

export default function NotaryActVersionItem({ version }: NotaryActVersionItemProps) {
  const roleLabels = {
    notary: 'Notaire',
    promoter: 'Promoteur',
    admin: 'Administrateur'
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Version {version.version_number}
            </h3>
            <p className="text-sm text-neutral-500">{version.file_name}</p>
          </div>
        </div>

        <a
          href={version.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </a>
      </div>

      <div className="flex items-center gap-6 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>
            Déposé par: <span className="font-medium">{roleLabels[version.uploaded_by_role as keyof typeof roleLabels]}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(version.created_at).toLocaleDateString('fr-CH')}</span>
        </div>
      </div>

      {version.notes && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Notes: </span>
            {version.notes}
          </p>
        </div>
      )}
    </div>
  );
}
