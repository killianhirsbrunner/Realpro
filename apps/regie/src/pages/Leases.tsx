import { useState } from 'react';
import { Card, CardContent, Button, Input, Badge } from '@realpro/ui';
import { Search, Plus, FileText, Calendar, User, Home } from 'lucide-react';

const mockLeases = [
  {
    id: '1',
    tenant: 'Martin Dupont',
    property: 'Résidence du Lac',
    unit: 'Apt 3.2',
    rent: 1850,
    charges: 180,
    startDate: '01.04.2023',
    endDate: null,
    status: 'active',
  },
  {
    id: '2',
    tenant: 'Sophie Weber',
    property: 'Immeuble Central',
    unit: 'Apt 1.1',
    rent: 1450,
    charges: 150,
    startDate: '01.09.2022',
    endDate: '31.08.2025',
    status: 'active',
  },
  {
    id: '3',
    tenant: 'Pierre Favre',
    property: 'Résidence du Lac',
    unit: 'Apt 2.1',
    rent: 2100,
    charges: 200,
    startDate: '01.01.2024',
    endDate: null,
    status: 'notice_given',
    noticeDate: '31.03.2025',
  },
  {
    id: '4',
    tenant: 'Marie Rochat',
    property: 'Commerce Place Neuve',
    unit: 'Local A',
    rent: 3500,
    charges: 450,
    startDate: '01.06.2020',
    endDate: '31.05.2030',
    status: 'active',
  },
  {
    id: '5',
    tenant: 'Jean Müller',
    property: 'Immeuble Central',
    unit: 'Apt 2.3',
    rent: 1650,
    charges: 160,
    startDate: '01.03.2021',
    endDate: '28.02.2025',
    status: 'expiring_soon',
  },
];

const statusConfig = {
  active: { label: 'Actif', variant: 'success' as const },
  notice_given: { label: 'Congé donné', variant: 'warning' as const },
  expiring_soon: { label: 'Expire bientôt', variant: 'info' as const },
  terminated: { label: 'Résilié', variant: 'error' as const },
  draft: { label: 'Brouillon', variant: 'default' as const },
};

export function LeasesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeases = mockLeases.filter(
    (lease) =>
      lease.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Baux
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            {mockLeases.length} baux actifs
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau bail
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {mockLeases.filter((l) => l.status === 'active').length}
                </p>
                <p className="text-sm text-neutral-500">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {mockLeases.filter((l) => l.status === 'notice_given').length}
                </p>
                <p className="text-sm text-neutral-500">Congés donnés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {mockLeases.filter((l) => l.status === 'expiring_soon').length}
                </p>
                <p className="text-sm text-neutral-500">Expirent bientôt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  CHF {mockLeases.reduce((sum, l) => sum + l.rent, 0).toLocaleString('fr-CH')}
                </p>
                <p className="text-sm text-neutral-500">Loyers mensuels</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 max-w-md">
        <Input
          placeholder="Rechercher un bail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="text-left p-4 font-medium text-neutral-500">Locataire</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Bien</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Loyer + Charges</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Période</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Statut</th>
                  <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredLeases.map((lease) => (
                  <tr key={lease.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {lease.tenant}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-neutral-900 dark:text-white">{lease.property}</p>
                      <p className="text-sm text-neutral-500">{lease.unit}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        CHF {lease.rent.toLocaleString('fr-CH')}
                      </p>
                      <p className="text-sm text-neutral-500">
                        + CHF {lease.charges} charges
                      </p>
                    </td>
                    <td className="p-4 text-neutral-500">
                      <p>{lease.startDate}</p>
                      <p className="text-sm">{lease.endDate || 'Durée indéterminée'}</p>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={statusConfig[lease.status as keyof typeof statusConfig].variant}
                        size="sm"
                      >
                        {statusConfig[lease.status as keyof typeof statusConfig].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
