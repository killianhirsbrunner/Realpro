import { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  EmptyState,
} from '@realpro/ui';
import { Search, Plus, Building2, MapPin, User } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'apartment' | 'commercial' | 'parking';
  rent: number;
  status: 'rented' | 'vacant' | 'reserved';
  tenant?: string;
}

const mockProperties: Property[] = [
  { id: '1', name: 'Appartement 3.5 pièces', address: 'Rue du Lac 12', city: 'Lausanne', type: 'apartment', rent: 1850, status: 'rented', tenant: 'M. Dupont' },
  { id: '2', name: 'Studio meublé', address: 'Avenue des Alpes 45', city: 'Montreux', type: 'apartment', rent: 1200, status: 'vacant' },
  { id: '3', name: 'Local commercial', address: 'Place du Marché 8', city: 'Vevey', type: 'commercial', rent: 2500, status: 'rented', tenant: 'Boulangerie ABC' },
  { id: '4', name: 'Appartement 4.5 pièces', address: 'Chemin du Parc 22', city: 'Nyon', type: 'apartment', rent: 2200, status: 'reserved', tenant: 'Mme Martin (dès 01.02)' },
  { id: '5', name: 'Place de parc', address: 'Rue du Lac 12', city: 'Lausanne', type: 'parking', rent: 150, status: 'rented', tenant: 'M. Dupont' },
  { id: '6', name: 'Appartement 2.5 pièces', address: 'Route de Berne 15', city: 'Lausanne', type: 'apartment', rent: 1450, status: 'vacant' },
];

const statusConfig = {
  rented: { label: 'Loué', variant: 'success' as const },
  vacant: { label: 'Vacant', variant: 'error' as const },
  reserved: { label: 'Réservé', variant: 'warning' as const },
};

const typeConfig = {
  apartment: { label: 'Appartement', icon: '🏠' },
  commercial: { label: 'Commercial', icon: '🏪' },
  parking: { label: 'Parking', icon: '🅿️' },
};

export function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockProperties.length,
    rented: mockProperties.filter(p => p.status === 'rented').length,
    vacant: mockProperties.filter(p => p.status === 'vacant').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Biens
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            {stats.total} biens · {stats.rented} loués · {stats.vacant} vacants
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau bien
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Rechercher un bien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === null ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            Tous
          </Button>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucun bien trouvé"
          description="Modifiez vos critères de recherche ou ajoutez un nouveau bien."
          action={{
            label: 'Nouveau bien',
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{typeConfig[property.type].icon}</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {property.name}
                      </h3>
                      <p className="text-xs text-neutral-500">{typeConfig[property.type].label}</p>
                    </div>
                  </div>
                  <Badge variant={statusConfig[property.status].variant} size="sm">
                    {statusConfig[property.status].label}
                  </Badge>
                </div>

                <div className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}, {property.city}</span>
                  </div>
                  {property.tenant && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{property.tenant}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Loyer mensuel</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">
                    CHF {property.rent.toLocaleString('fr-CH')}
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
