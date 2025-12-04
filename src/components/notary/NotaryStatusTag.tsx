interface NotaryStatusTagProps {
  status: 'incomplete' | 'waiting_notary' | 'act_v1' | 'act_v2' | 'final' | 'signed';
  className?: string;
}

const statusConfig = {
  incomplete: {
    label: 'Dossier incomplet',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  waiting_notary: {
    label: 'En attente notaire',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  act_v1: {
    label: 'Projet d\'acte V1',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  act_v2: {
    label: 'Projet d\'acte V2',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  final: {
    label: 'Acte final',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  signed: {
    label: 'Signé',
    color: 'bg-green-100 text-green-700 border-green-200'
  }
};

export default function NotaryStatusTag({ status, className = '' }: NotaryStatusTagProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}
