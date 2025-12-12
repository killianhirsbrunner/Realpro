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
import { Search, Plus, Users, MapPin, Phone, Mail } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentStatus: 'paid' | 'pending' | 'overdue';
  leaseEnd: string;
}

const mockTenants: Tenant[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@email.ch', phone: '+41 79 123 45 67', property: 'Rue du Lac 12, apt 3B', rentStatus: 'paid', leaseEnd: '31.12.2025' },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@email.ch', phone: '+41 78 234 56 78', property: 'Avenue des Alpes 45', rentStatus: 'paid', leaseEnd: '30.06.2025' },
  { id: '3', name: 'Pierre Müller', email: 'pierre.muller@email.ch', phone: '+41 76 345 67 89', property: 'Chemin du Parc 8, apt 2A', rentStatus: 'pending', leaseEnd: '31.03.2026' },
  { id: '4', name: 'Sophie Bernard', email: 'sophie.bernard@email.ch', phone: '+41 79 456 78 90', property: 'Place du Marché 15', rentStatus: 'overdue', leaseEnd: '30.09.2025' },
  { id: '5', name: 'Boulangerie ABC Sàrl', email: 'contact@boulangerie-abc.ch', phone: '+41 21 123 45 67', property: 'Place du Marché 8', rentStatus: 'paid', leaseEnd: '31.12.2027' },
];

const rentStatusConfig = {
  paid: { label: 'Payé', variant: 'success' as const },
  pending: { label: 'En attente', variant: 'warning' as const },
  overdue: { label: 'Impayé', variant: 'error' as const },
};

export function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = mockTenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Locataires
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            {mockTenants.length} locataires actifs
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau locataire
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Rechercher un locataire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {filteredTenants.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="Aucun locataire trouvé"
          description="Modifiez vos critères de recherche ou ajoutez un nouveau locataire."
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Nouveau locataire
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar name={tenant.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {tenant.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                            {tenant.property}
                          </span>
                        </div>
                      </div>
                      <Badge variant={rentStatusConfig[tenant.rentStatus].variant} size="sm">
                        {rentStatusConfig[tenant.rentStatus].label}
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{tenant.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{tenant.phone}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-xs text-neutral-400">
                        Bail jusqu'au {tenant.leaseEnd}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
