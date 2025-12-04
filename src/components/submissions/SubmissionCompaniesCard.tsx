import { Card } from '../ui/Card';
import { Building2, Mail, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface Company {
  id: string;
  name: string;
  email?: string;
  status?: string;
}

interface SubmissionCompaniesCardProps {
  companies: Company[];
  onInvite?: () => void;
}

export function SubmissionCompaniesCard({ companies = [], onInvite }: SubmissionCompaniesCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Entreprises invitées
          </h3>
          {onInvite && (
            <Button size="sm" onClick={onInvite}>
              Inviter
            </Button>
          )}
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Aucune entreprise invitée
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {companies.map((company) => (
              <li
                key={company.id}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                    <Building2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {company.name}
                    </p>
                    {company.email && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {company.email}
                      </p>
                    )}
                  </div>
                </div>
                {company.status === 'invited' && (
                  <Mail className="h-4 w-4 text-brand-600" title="Invitation envoyée" />
                )}
                {company.status === 'submitted' && (
                  <CheckCircle className="h-4 w-4 text-green-600" title="Offre reçue" />
                )}
                {company.status === 'pending' && (
                  <Clock className="h-4 w-4 text-orange-600" title="En attente" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
