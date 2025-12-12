import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  EmptyState,
} from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import {
  Plus,
  MoreHorizontal,
  Building,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  FileText,
  Users,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockOwners = [
  {
    id: '1',
    name: 'Immobilière SA',
    type: 'company',
    contact: {
      name: 'Marc Dubois',
      email: 'marc.dubois@immobiliere-sa.ch',
      phone: '+41 22 123 45 67',
    },
    properties: 3,
    units: 24,
    mandateType: 'full',
    monthlyRent: 42500,
    status: 'active',
  },
  {
    id: '2',
    name: 'Famille Müller',
    type: 'private',
    contact: {
      name: 'Hans Müller',
      email: 'hans.muller@email.ch',
      phone: '+41 79 234 56 78',
    },
    properties: 1,
    units: 6,
    mandateType: 'technical',
    monthlyRent: 8400,
    status: 'active',
  },
  {
    id: '3',
    name: 'Investment Corp',
    type: 'company',
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@investment.com',
      phone: '+41 22 987 65 43',
    },
    properties: 2,
    units: 15,
    mandateType: 'full',
    monthlyRent: 32800,
    status: 'active',
  },
  {
    id: '4',
    name: 'Pierre Dupont',
    type: 'private',
    contact: {
      name: 'Pierre Dupont',
      email: 'pierre.dupont@email.ch',
      phone: '+41 79 345 67 89',
    },
    properties: 1,
    units: 2,
    mandateType: 'admin',
    monthlyRent: 3600,
    status: 'inactive',
  },
];

const mandateConfig = {
  full: { label: 'Gérance complète', variant: 'success' as const },
  technical: { label: 'Gérance technique', variant: 'info' as const },
  admin: { label: 'Gérance administrative', variant: 'warning' as const },
};

export function OwnersPage() {
  const [search, setSearch] = useState('');

  const filteredOwners = mockOwners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(search.toLowerCase()) ||
      owner.contact.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnits = mockOwners.reduce((sum, o) => sum + o.units, 0);

  return (
    <PageShell
      title="Propriétaires & Mandats"
      subtitle={`${mockOwners.length} propriétaires · ${totalUnits} unités gérées`}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Nouveau propriétaire
          </Button>
        </div>
      }
      filters={
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput
            placeholder="Rechercher par nom, email..."
            onSearch={setSearch}
            className="w-full sm:w-80"
          />
          <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
            Filtres
          </Button>
        </div>
      }
    >
      {filteredOwners.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="Aucun propriétaire trouvé"
          description={
            search
              ? "Aucun résultat ne correspond à votre recherche"
              : "Ajoutez votre premier propriétaire"
          }
          action={
            !search
              ? {
                  label: "Ajouter un propriétaire",
                  onClick: () => {},
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOwners.map((owner) => {
            const mandate = mandateConfig[owner.mandateType as keyof typeof mandateConfig];
            return (
              <ContentCard key={owner.id} className="hover:border-brand-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={owner.name}
                      size="lg"
                      className={owner.type === 'company' ? 'bg-brand-100' : undefined}
                    />
                    <div>
                      <Link
                        to={`/owners/${owner.id}`}
                        className="font-semibold text-neutral-900 dark:text-white hover:text-brand-500 transition-colors"
                      >
                        {owner.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={mandate.variant} size="sm">
                          {mandate.label}
                        </Badge>
                        {owner.status === 'inactive' && (
                          <Badge variant="neutral" size="sm">
                            Inactif
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Dropdown
                    align="right"
                    trigger={
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownItem icon={<Eye className="h-4 w-4" />}>
                      Voir le détail
                    </DropdownItem>
                    <DropdownItem icon={<Edit className="h-4 w-4" />}>
                      Modifier
                    </DropdownItem>
                    <DropdownItem icon={<FileText className="h-4 w-4" />}>
                      Voir le mandat
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem icon={<Trash2 className="h-4 w-4" />} destructive>
                      Supprimer
                    </DropdownItem>
                  </Dropdown>
                </div>

                {/* Contact info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Mail className="h-4 w-4" />
                    <span>{owner.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Phone className="h-4 w-4" />
                    <span>{owner.contact.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <div className="flex items-center gap-1 text-neutral-500 text-xs mb-1">
                      <Building className="h-3 w-3" />
                      Immeubles
                    </div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {owner.properties}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-neutral-500 text-xs mb-1">
                      <Users className="h-3 w-3" />
                      Unités
                    </div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {owner.units}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-neutral-500 text-xs mb-1">
                      <Wallet className="h-3 w-3" />
                      Loyers/mois
                    </div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      CHF {owner.monthlyRent.toLocaleString('fr-CH')}
                    </p>
                  </div>
                </div>
              </ContentCard>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
