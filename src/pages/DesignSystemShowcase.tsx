import { useState } from 'react';
import {
  RealProTopbar,
  RealProCard,
  RealProButton,
  RealProBadge,
  RealProSearchBar,
  RealProTable,
  RealProPanel,
  RealProModal,
  RealProField,
  RealProInput,
  RealProTextarea,
  RealProTabs,
  RealProChartCard,
} from '../components/realpro';
import { Plus, Download, Settings } from 'lucide-react';

export function DesignSystemShowcase() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('components');

  const sampleData = [
    { id: '1', name: 'Lot A1.01', type: '3.5 pièces', status: 'available', price: 850000 },
    { id: '2', name: 'Lot A1.02', type: '4.5 pièces', status: 'reserved', price: 1200000 },
    { id: '3', name: 'Lot A1.03', type: '2.5 pièces', status: 'sold', price: 650000 },
  ];

  const columns = [
    { key: 'name', label: 'Lot' },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Statut',
      render: (row: any) => {
        const statusConfig: any = {
          available: { type: 'neutral', label: 'Disponible' },
          reserved: { type: 'warning', label: 'Réservé' },
          sold: { type: 'success', label: 'Vendu' },
        };
        const config = statusConfig[row.status];
        return <RealProBadge type={config.type}>{config.label}</RealProBadge>;
      }
    },
    {
      key: 'price',
      label: 'Prix',
      render: (row: any) => (
        <span className="font-semibold">CHF {row.price.toLocaleString()}</span>
      )
    },
  ];

  const tabs = [
    { key: 'components', label: 'Composants', href: '#components' },
    { key: 'colors', label: 'Couleurs', href: '#colors' },
    { key: 'typography', label: 'Typographie', href: '#typography' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="p-8">
        <RealProTopbar
          title="RealPro Design System"
          subtitle="Bibliothèque de composants premium"
          actions={
            <>
              <RealProButton variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Documentation
              </RealProButton>
              <RealProButton variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau composant
              </RealProButton>
            </>
          }
        />

        <RealProTabs tabs={tabs} active={activeTab} />

        {activeTab === 'components' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <RealProButton variant="primary">Primary</RealProButton>
                <RealProButton variant="secondary">Secondary</RealProButton>
                <RealProButton variant="outline">Outline</RealProButton>
                <RealProButton variant="ghost">Ghost</RealProButton>
                <RealProButton variant="danger">Danger</RealProButton>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <RealProButton variant="primary" size="sm">Small</RealProButton>
                <RealProButton variant="primary" size="md">Medium</RealProButton>
                <RealProButton variant="primary" size="lg">Large</RealProButton>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Badges</h2>
              <div className="flex flex-wrap gap-4">
                <RealProBadge type="success">Success</RealProBadge>
                <RealProBadge type="warning">Warning</RealProBadge>
                <RealProBadge type="danger">Danger</RealProBadge>
                <RealProBadge type="info">Info</RealProBadge>
                <RealProBadge type="neutral">Neutral</RealProBadge>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RealProCard padding="sm">
                  <h3 className="font-semibold mb-2">Small Padding</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Card avec padding réduit
                  </p>
                </RealProCard>

                <RealProCard padding="md">
                  <h3 className="font-semibold mb-2">Medium Padding</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Card avec padding standard
                  </p>
                </RealProCard>

                <RealProCard padding="lg" hover>
                  <h3 className="font-semibold mb-2">Large Padding + Hover</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Card avec effet hover
                  </p>
                </RealProCard>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Search Bar</h2>
              <RealProSearchBar placeholder="Rechercher dans la documentation..." />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Table</h2>
              <RealProTable
                columns={columns}
                data={sampleData}
                onRowClick={(row) => {
                  console.log('Row clicked:', row);
                  setIsPanelOpen(true);
                }}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Form Components</h2>
              <RealProCard>
                <div className="space-y-6">
                  <RealProField
                    label="Nom du projet"
                    required
                    hint="Le nom doit être unique"
                  >
                    <RealProInput placeholder="Ex: Résidence Les Érables" />
                  </RealProField>

                  <RealProField label="Description">
                    <RealProTextarea
                      rows={4}
                      placeholder="Décrivez le projet..."
                    />
                  </RealProField>

                  <RealProField
                    label="Email"
                    error="Cet email est déjà utilisé"
                  >
                    <RealProInput
                      type="email"
                      placeholder="exemple@realpro.ch"
                      error
                    />
                  </RealProField>

                  <div className="flex gap-3">
                    <RealProButton variant="outline" className="flex-1">
                      Annuler
                    </RealProButton>
                    <RealProButton variant="primary" className="flex-1">
                      Enregistrer
                    </RealProButton>
                  </div>
                </div>
              </RealProCard>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Modals & Panels</h2>
              <div className="flex gap-4">
                <RealProButton
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Ouvrir Modal
                </RealProButton>
                <RealProButton
                  variant="outline"
                  onClick={() => setIsPanelOpen(true)}
                >
                  Ouvrir Panel
                </RealProButton>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Chart Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RealProChartCard
                  title="Ventes mensuelles"
                  subtitle="Derniers 6 mois"
                  chart={
                    <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl flex items-center justify-center text-neutral-500">
                      Chart placeholder
                    </div>
                  }
                />

                <RealProChartCard
                  title="Répartition des lots"
                  subtitle="Par statut"
                  chart={
                    <div className="h-48 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-xl flex items-center justify-center text-neutral-500">
                      Chart placeholder
                    </div>
                  }
                  actions={
                    <RealProButton variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </RealProButton>
                  }
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Palette Principale</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <RealProCard>
                  <div className="w-full h-24 rounded-xl bg-primary-900 dark:bg-primary-100 mb-4" />
                  <p className="font-semibold">Primary</p>
                  <p className="text-sm text-neutral-500">#1b1b1b / #eeede9</p>
                </RealProCard>

                <RealProCard>
                  <div className="w-full h-24 rounded-xl bg-accent-green mb-4" />
                  <p className="font-semibold">Success</p>
                  <p className="text-sm text-neutral-500">#3BB273</p>
                </RealProCard>

                <RealProCard>
                  <div className="w-full h-24 rounded-xl bg-accent-orange mb-4" />
                  <p className="font-semibold">Warning</p>
                  <p className="text-sm text-neutral-500">#F5A623</p>
                </RealProCard>

                <RealProCard>
                  <div className="w-full h-24 rounded-xl bg-red-600 mb-4" />
                  <p className="font-semibold">Danger</p>
                  <p className="text-sm text-neutral-500">#dc2626</p>
                </RealProCard>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Neutral Scale</h2>
              <div className="grid grid-cols-5 gap-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <RealProCard key={shade} padding="sm">
                    <div className={`w-full h-16 rounded-lg bg-neutral-${shade} mb-2`} />
                    <p className="text-xs font-medium">{shade}</p>
                  </RealProCard>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-8">
            <RealProCard>
              <h1 className="text-5xl font-semibold tracking-tight mb-4">
                Heading 1
              </h1>
              <h2 className="text-4xl font-semibold tracking-tight mb-4">
                Heading 2
              </h2>
              <h3 className="text-3xl font-semibold tracking-tight mb-4">
                Heading 3
              </h3>
              <h4 className="text-2xl font-semibold mb-4">
                Heading 4
              </h4>
              <h5 className="text-xl font-semibold mb-4">
                Heading 5
              </h5>
              <p className="text-base text-neutral-700 dark:text-neutral-300 mb-4">
                Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Small text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Extra small text - Lorem ipsum dolor sit amet.
              </p>
            </RealProCard>
          </div>
        )}

        <RealProPanel
          title="Détails"
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Lot
              </p>
              <p className="text-lg font-semibold">A1.01</p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Type
              </p>
              <p className="text-lg font-semibold">3.5 pièces</p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Prix
              </p>
              <p className="text-2xl font-semibold">CHF 850'000</p>
            </div>

            <RealProButton variant="primary" className="w-full">
              Modifier
            </RealProButton>
          </div>
        </RealProPanel>

        <RealProModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Exemple de Modal"
        >
          <div className="space-y-6">
            <p className="text-neutral-600 dark:text-neutral-400">
              Ceci est un exemple de modal avec le Design System RealPro.
              Les modales sont parfaites pour les formulaires et les confirmations.
            </p>

            <RealProField label="Nom du lot" required>
              <RealProInput placeholder="Ex: A1.01" />
            </RealProField>

            <div className="flex gap-3 pt-4">
              <RealProButton
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Annuler
              </RealProButton>
              <RealProButton variant="primary" className="flex-1">
                Confirmer
              </RealProButton>
            </div>
          </div>
        </RealProModal>
      </div>
    </div>
  );
}
