import { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Avatar,
  EmptyState,
} from '@realpro/ui';
import { Search, Plus, Users, Mail, Phone, Building } from 'lucide-react';

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'individual' | 'company';
  companyName?: string;
  units: number;
  milliemes: number;
  balance: number;
  isPresident: boolean;
  isCommittee: boolean;
}

const mockOwners: Owner[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.ch',
    phone: '+41 79 123 45 67',
    type: 'individual',
    units: 2,
    milliemes: 85,
    balance: -120,
    isPresident: true,
    isCommittee: true,
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@email.ch',
    phone: '+41 79 234 56 78',
    type: 'individual',
    units: 1,
    milliemes: 42,
    balance: 0,
    isPresident: false,
    isCommittee: true,
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Schmidt',
    email: 'contact@schmidt-immo.ch',
    phone: '+41 21 123 45 67',
    type: 'company',
    companyName: 'Schmidt Immobilier SA',
    units: 4,
    milliemes: 168,
    balance: 450,
    isPresident: false,
    isCommittee: false,
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Blanc',
    email: 'sophie.blanc@email.ch',
    phone: '+41 79 345 67 89',
    type: 'individual',
    units: 1,
    milliemes: 38,
    balance: 0,
    isPresident: false,
    isCommittee: false,
  },
];

export function OwnersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOwners = mockOwners.filter((owner) =>
    `${owner.firstName} ${owner.lastName} ${owner.companyName || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalMilliemes = mockOwners.reduce((sum, o) => sum + o.milliemes, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Copropriétaires
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            {mockOwners.length} copropriétaires · {totalMilliemes}‰ répartis
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau copropriétaire
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Rechercher un copropriétaire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {filteredOwners.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun copropriétaire trouvé"
          description="Modifiez vos critères de recherche."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOwners.map((owner) => (
            <Card key={owner.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar
                    fallback={owner.type === 'company' ? owner.companyName! : `${owner.firstName} ${owner.lastName}`}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {owner.type === 'company' ? owner.companyName : `${owner.firstName} ${owner.lastName}`}
                      </h3>
                      {owner.isPresident && (
                        <Badge variant="brand" size="sm">Président</Badge>
                      )}
                      {owner.isCommittee && !owner.isPresident && (
                        <Badge variant="info" size="sm">Comité</Badge>
                      )}
                    </div>
                    {owner.type === 'company' && (
                      <p className="text-sm text-neutral-500">
                        {owner.firstName} {owner.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{owner.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <Phone className="w-4 h-4" />
                    <span>{owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <Building className="w-4 h-4" />
                    <span>{owner.units} lot{owner.units > 1 ? 's' : ''} · {owner.milliemes}‰</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Solde</span>
                  <span className={`font-semibold ${
                    owner.balance > 0 ? 'text-error-600' : owner.balance < 0 ? 'text-success-600' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {owner.balance > 0 ? '+' : ''}{owner.balance === 0 ? '0' : `CHF ${owner.balance.toLocaleString('fr-CH')}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
