# RealPro Design System - Exemples d'Utilisation

Ce document contient des exemples concrets d'utilisation des composants RealPro dans différents contextes.

## 📋 Exemple 1 : Page Dashboard

```tsx
import { useState } from 'react';
import {
  RealProTopbar,
  RealProCard,
  RealProButton,
  RealProBadge,
  RealProChartCard,
} from '@/components/realpro';
import { BarChart, LineChart } from 'recharts';

export function Dashboard() {
  return (
    <div className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <RealProTopbar
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre activité"
        actions={
          <RealProButton variant="primary">
            Nouveau projet
          </RealProButton>
        }
      />

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <RealProCard padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Projets actifs
              </p>
              <p className="text-3xl font-semibold mt-2">12</p>
            </div>
            <RealProBadge type="success">+2 ce mois</RealProBadge>
          </div>
        </RealProCard>

        <RealProCard padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Lots vendus
              </p>
              <p className="text-3xl font-semibold mt-2">87</p>
            </div>
            <RealProBadge type="info">65% taux</RealProBadge>
          </div>
        </RealProCard>

        <RealProCard padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                CA total
              </p>
              <p className="text-3xl font-semibold mt-2">CHF 45.2M</p>
            </div>
            <RealProBadge type="success">+12%</RealProBadge>
          </div>
        </RealProCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealProChartCard
          title="Évolution des ventes"
          subtitle="12 derniers mois"
          chart={<LineChart data={salesData} />}
        />

        <RealProChartCard
          title="Répartition par type"
          subtitle="Appartements vendus"
          chart={<BarChart data={typeData} />}
        />
      </div>
    </div>
  );
}
```

## 🏢 Exemple 2 : Page de Liste avec Filtres

```tsx
import { useState } from 'react';
import {
  RealProTopbar,
  RealProSearchBar,
  RealProButton,
  RealProTable,
  RealProBadge,
  RealProPanel,
  RealProField,
  RealProInput,
} from '@/components/realpro';
import { Filter } from 'lucide-react';

export function ProjectLots() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const columns = [
    { key: 'name', label: 'Lot' },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Statut',
      render: (row) => {
        const statusConfig = {
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
      render: (row) => (
        <span className="font-semibold">
          CHF {row.price.toLocaleString()}
        </span>
      )
    },
  ];

  return (
    <div className="p-8">
      <RealProTopbar
        title="Lots du projet"
        subtitle="Résidence Les Érables"
        actions={
          <>
            <RealProButton variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </RealProButton>
            <RealProButton variant="primary">
              Nouveau lot
            </RealProButton>
          </>
        }
      />

      <div className="mb-6">
        <RealProSearchBar
          placeholder="Rechercher par nom, type..."
          onSearch={setSearchQuery}
        />
      </div>

      <RealProTable
        columns={columns}
        data={lots}
        onRowClick={(lot) => {
          setSelectedLot(lot);
          setIsPanelOpen(true);
        }}
      />

      <RealProPanel
        title={`Lot ${selectedLot?.name}`}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        width="md"
      >
        {selectedLot && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Type
              </p>
              <p className="font-semibold">{selectedLot.type}</p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Surface
              </p>
              <p className="font-semibold">{selectedLot.surface} m²</p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Prix
              </p>
              <p className="text-2xl font-semibold">
                CHF {selectedLot.price.toLocaleString()}
              </p>
            </div>

            <div className="pt-4 border-t">
              <RealProButton variant="primary" className="w-full">
                Éditer le lot
              </RealProButton>
            </div>
          </div>
        )}
      </RealProPanel>
    </div>
  );
}
```

## 📝 Exemple 3 : Formulaire Complexe avec Modal

```tsx
import { useState } from 'react';
import {
  RealProModal,
  RealProField,
  RealProInput,
  RealProTextarea,
  RealProButton,
} from '@/components/realpro';

export function CreateProjectModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    budget: '',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation et soumission
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <RealProModal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un nouveau projet"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <RealProField
          label="Nom du projet"
          required
          error={errors.name}
        >
          <RealProInput
            placeholder="Ex: Résidence Les Érables"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={!!errors.name}
          />
        </RealProField>

        <RealProField
          label="Adresse"
          required
          error={errors.address}
        >
          <RealProInput
            placeholder="Ex: Rue du Commerce 12, 1200 Genève"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            error={!!errors.address}
          />
        </RealProField>

        <RealProField
          label="Budget total"
          required
          error={errors.budget}
          hint="En CHF"
        >
          <RealProInput
            type="number"
            placeholder="Ex: 5000000"
            value={formData.budget}
            onChange={(e) => updateField('budget', e.target.value)}
            error={!!errors.budget}
          />
        </RealProField>

        <RealProField
          label="Description"
          hint="Décrivez brièvement le projet"
        >
          <RealProTextarea
            rows={4}
            placeholder="Description détaillée du projet..."
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </RealProField>

        <div className="flex gap-3 pt-4">
          <RealProButton
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </RealProButton>
          <RealProButton
            type="submit"
            variant="primary"
            className="flex-1"
          >
            Créer le projet
          </RealProButton>
        </div>
      </form>
    </RealProModal>
  );
}
```

## 🎯 Exemple 4 : Page avec Tabs

```tsx
import { useState } from 'react';
import {
  RealProTopbar,
  RealProTabs,
  RealProCard,
  RealProButton,
} from '@/components/realpro';

export function ProjectSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { key: 'general', label: 'Général', href: '#general' },
    { key: 'team', label: 'Équipe', href: '#team' },
    { key: 'billing', label: 'Facturation', href: '#billing' },
    { key: 'advanced', label: 'Avancé', href: '#advanced' },
  ];

  return (
    <div className="p-8">
      <RealProTopbar
        title="Paramètres du projet"
        subtitle="Résidence Les Érables"
      />

      <RealProTabs tabs={tabs} active={activeTab} />

      {activeTab === 'general' && (
        <div className="space-y-6">
          <RealProCard>
            <h3 className="text-lg font-semibold mb-4">
              Informations générales
            </h3>
            {/* Formulaire général */}
          </RealProCard>

          <RealProCard>
            <h3 className="text-lg font-semibold mb-4">
              Localisation
            </h3>
            {/* Formulaire localisation */}
          </RealProCard>
        </div>
      )}

      {activeTab === 'team' && (
        <RealProCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              Membres de l'équipe
            </h3>
            <RealProButton variant="primary" size="sm">
              Inviter un membre
            </RealProButton>
          </div>
          {/* Liste des membres */}
        </RealProCard>
      )}
    </div>
  );
}
```

## 🎨 Exemple 5 : Cards avec différents layouts

```tsx
import {
  RealProCard,
  RealProBadge,
  RealProButton,
} from '@/components/realpro';

export function ProjectCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card simple avec image */}
      <RealProCard hover className="overflow-hidden p-0">
        <img
          src="/project-image.jpg"
          alt="Project"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Résidence Les Érables</h3>
            <RealProBadge type="success">Actif</RealProBadge>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            45 lots - 65% vendus
          </p>
          <RealProButton variant="outline" size="sm" className="w-full">
            Voir le projet
          </RealProButton>
        </div>
      </RealProCard>

      {/* Card avec stats */}
      <RealProCard padding="lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Chiffre d'affaires
            </p>
            <p className="text-3xl font-semibold mt-1">
              CHF 12.4M
            </p>
          </div>
          <RealProBadge type="success">+18%</RealProBadge>
        </div>
        <div className="h-24 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-xl" />
      </RealProCard>

      {/* Card avec actions */}
      <RealProCard>
        <h3 className="font-semibold mb-4">Actions rapides</h3>
        <div className="space-y-3">
          <RealProButton variant="outline" size="sm" className="w-full justify-start">
            Nouveau lot
          </RealProButton>
          <RealProButton variant="outline" size="sm" className="w-full justify-start">
            Ajouter un acheteur
          </RealProButton>
          <RealProButton variant="outline" size="sm" className="w-full justify-start">
            Créer un document
          </RealProButton>
        </div>
      </RealProCard>
    </div>
  );
}
```

## 💡 Tips & Best Practices

### 1. Spacing cohérent

Utilisez toujours les classes de spacing Tailwind :
- `space-y-6` pour espacer verticalement
- `gap-6` dans les grids
- `mb-8` entre sections principales

### 2. Hiérarchie des titres

```tsx
<h1 className="text-3xl font-semibold tracking-tight">Titre principal</h1>
<h2 className="text-2xl font-semibold">Sous-titre</h2>
<h3 className="text-lg font-semibold">Titre de section</h3>
<p className="text-sm text-neutral-600 dark:text-neutral-400">Texte descriptif</p>
```

### 3. Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

### 4. Loading States

```tsx
{isLoading ? (
  <RealProCard className="animate-pulse">
    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded mb-4" />
    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
  </RealProCard>
) : (
  <RealProCard>
    {/* Contenu réel */}
  </RealProCard>
)}
```

### 5. Empty States

```tsx
<RealProCard className="text-center py-12">
  <div className="text-neutral-400 mb-4">
    <FileText className="w-12 h-12 mx-auto mb-3" />
    <p className="text-lg font-medium">Aucun lot disponible</p>
    <p className="text-sm mt-2">Commencez par créer votre premier lot</p>
  </div>
  <RealProButton variant="primary" className="mt-6">
    Créer un lot
  </RealProButton>
</RealProCard>
```

---

Ces exemples couvrent les cas d'usage les plus courants. N'hésitez pas à les adapter selon vos besoins spécifiques.
