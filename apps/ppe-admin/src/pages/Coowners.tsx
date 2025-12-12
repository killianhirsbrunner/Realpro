import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Modal,
  Skeleton,
  EmptyState,
} from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import {
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockCoowners = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.ch',
    phone: '+41 79 123 45 67',
    property: 'Résidence Les Alpes',
    lotNumber: 'A-101',
    quota: 125,
    status: 'active',
    balance: 0,
  },
  {
    id: '2',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@email.ch',
    phone: '+41 79 234 56 78',
    property: 'Résidence Les Alpes',
    lotNumber: 'A-202',
    quota: 98,
    status: 'active',
    balance: -450,
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@email.ch',
    phone: '+41 79 345 67 89',
    property: 'Immeuble Lac-Léman',
    lotNumber: 'B-301',
    quota: 156,
    status: 'inactive',
    balance: 125,
  },
  {
    id: '4',
    firstName: 'Jean',
    lastName: 'Müller',
    email: 'jean.muller@email.ch',
    phone: '+41 79 456 78 90',
    property: 'Copropriété du Parc',
    lotNumber: 'C-102',
    quota: 112,
    status: 'active',
    balance: 0,
  },
];

export function CoownersPage() {
  const [search, setSearch] = useState('');
  const [isLoading] = useState(false);
  const [selectedCoowner, setSelectedCoowner] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filteredCoowners = mockCoowners.filter(
    (coowner) =>
      coowner.firstName.toLowerCase().includes(search.toLowerCase()) ||
      coowner.lastName.toLowerCase().includes(search.toLowerCase()) ||
      coowner.email.toLowerCase().includes(search.toLowerCase()) ||
      coowner.property.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    // Handle delete logic
    setShowDeleteModal(false);
    setSelectedCoowner(null);
  };

  return (
    <PageShell
      title="Copropriétaires"
      subtitle={`${mockCoowners.length} copropriétaires enregistrés`}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Nouveau copropriétaire
          </Button>
        </div>
      }
      filters={
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput
            placeholder="Rechercher par nom, email, immeuble..."
            onSearch={setSearch}
            className="w-full sm:w-80"
          />
          <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
            Filtres
          </Button>
        </div>
      }
    >
      <ContentCard padding="none">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCoowners.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            title="Aucun copropriétaire trouvé"
            description={
              search
                ? "Aucun résultat ne correspond à votre recherche"
                : "Commencez par ajouter votre premier copropriétaire"
            }
            action={
              !search
                ? {
                    label: "Ajouter un copropriétaire",
                    onClick: () => {},
                  }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                    Copropriétaire
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                    Contact
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                    Immeuble / Lot
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                    Quota
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                    Solde
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                    Statut
                  </th>
                  <th className="px-6 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredCoowners.map((coowner) => (
                  <tr
                    key={coowner.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${coowner.firstName} ${coowner.lastName}`}
                          size="sm"
                        />
                        <div>
                          <Link
                            to={`/owners/${coowner.id}`}
                            className="font-medium text-neutral-900 dark:text-white hover:text-brand-500 transition-colors"
                          >
                            {coowner.firstName} {coowner.lastName}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{coowner.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{coowner.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-neutral-400" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {coowner.property}
                          </p>
                          <p className="text-xs text-neutral-500">Lot {coowner.lotNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {coowner.quota}/1000
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          coowner.balance < 0
                            ? 'text-error-600 dark:text-error-400'
                            : coowner.balance > 0
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-neutral-900 dark:text-white'
                        }`}
                      >
                        {coowner.balance >= 0 ? '+' : ''}
                        CHF {coowner.balance.toLocaleString('fr-CH')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={coowner.status === 'active' ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {coowner.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Dropdown
                        align="right"
                        trigger={
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownItem icon={<Eye className="h-4 w-4" />}>
                          <Link to={`/owners/${coowner.id}`}>Voir le détail</Link>
                        </DropdownItem>
                        <DropdownItem icon={<Edit className="h-4 w-4" />}>
                          Modifier
                        </DropdownItem>
                        <DropdownItem icon={<Mail className="h-4 w-4" />}>
                          Envoyer un email
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          icon={<Trash2 className="h-4 w-4" />}
                          destructive
                          onClick={() => {
                            setSelectedCoowner(coowner.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Supprimer
                        </DropdownItem>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ContentCard>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer le copropriétaire"
        description="Cette action est irréversible. Toutes les données associées seront supprimées."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Êtes-vous sûr de vouloir supprimer ce copropriétaire ?
        </p>
      </Modal>
    </PageShell>
  );
}
