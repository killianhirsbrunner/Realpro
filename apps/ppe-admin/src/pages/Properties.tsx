import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Progress,
  EmptyState,
} from '@realpro/ui';
import { Search, Plus, Building, MapPin, Users } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  units: number;
  owners: number;
  balance: number;
  healthScore: number;
  status: 'active' | 'pending' | 'archived';
}

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Résidence Les Alpes',
    address: 'Rue des Alpes 12',
    city: 'Lausanne',
    units: 24,
    owners: 22,
    balance: 45230,
    healthScore: 92,
    status: 'active',
  },
  {
    id: '2',
    name: 'Immeuble Lac-Léman',
    address: 'Quai du Lac 45',
    city: 'Morges',
    units: 16,
    owners: 14,
    balance: 28150,
    healthScore: 78,
    status: 'active',
  },
  {
    id: '3',
    name: 'Copropriété du Parc',
    address: 'Avenue du Parc 8',
    city: 'Nyon',
    units: 32,
    owners: 28,
    balance: 62480,
    healthScore: 95,
    status: 'active',
  },
  {
    id: '4',
    name: 'Résidence Bellevue',
    address: 'Chemin de Bellevue 3',
    city: 'Vevey',
    units: 12,
    owners: 10,
    balance: 18920,
    healthScore: 65,
    status: 'pending',
  },
];

const statusConfig = {
  active: { label: 'Actif', variant: 'success' as const },
  pending: { label: 'En attente', variant: 'warning' as const },
  archived: { label: 'Archivé', variant: 'default' as const },
};

export function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = mockProperties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Immeubles
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Gérez vos copropriétés et immeubles
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouvel immeuble
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Rechercher un immeuble..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {filteredProperties.length === 0 ? (
        <EmptyState
          icon={Building}
          title="Aucun immeuble trouvé"
          description="Modifiez vos critères de recherche ou ajoutez un nouvel immeuble."
          action={{
            label: 'Nouvel immeuble',
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Link key={property.id} to={`/properties/${property.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-t-xl flex items-center justify-center">
                  <Building className="w-16 h-16 text-emerald-300 dark:text-emerald-700" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {property.name}
                    </h3>
                    <Badge variant={statusConfig[property.status].variant} size="sm">
                      {statusConfig[property.status].label}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{property.address}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{property.units} lots · {property.owners} copropriétaires</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        Santé financière
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        CHF {property.balance.toLocaleString('fr-CH')}
                      </span>
                    </div>
                    <Progress
                      value={property.healthScore}
                      size="sm"
                      variant={property.healthScore >= 90 ? 'success' : property.healthScore >= 70 ? 'warning' : 'error'}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
