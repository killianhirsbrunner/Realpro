# 🎨 SPÉCIFICATIONS UX - SaaS Immobilier Suisse

> Design system, patterns UX et spécifications détaillées par rôle utilisateur

---

## Table des matières

1. [Principes UX fondamentaux](#1-principes-ux-fondamentaux)
2. [Design system](#2-design-system)
3. [Navigation & Architecture information](#3-navigation--architecture-information)
4. [Expériences par rôle](#4-expériences-par-rôle)
5. [Patterns d'interaction](#5-patterns-dinteraction)
6. [États & feedback](#6-états--feedback)
7. [Responsive & Mobile](#7-responsive--mobile)
8. [Accessibilité](#8-accessibilité)

---

## 1. Principes UX fondamentaux

### 1.1 Vision UX

**Inspiration** : Stripe, Linear, Notion, Figma, Intercom

**Objectifs** :
- ✅ **Clarté** : Chaque écran a un objectif unique et clair
- ✅ **Efficacité** : Réduire les clics pour les actions fréquentes
- ✅ **Cohérence** : Mêmes patterns dans toute l'app
- ✅ **Feedback** : Toujours indiquer l'état du système
- ✅ **Performance** : <200ms pour les transitions, <1s pour les chargements

### 1.2 Principes de design

1. **Progressive disclosure** : Afficher l'essentiel, révéler les détails au besoin
2. **Context-aware** : Adapter l'interface au rôle et au contexte
3. **Action-oriented** : Boutons clairs avec verbes d'action
4. **Data-dense but readable** : Beaucoup d'info, mais bien structurée
5. **Zero state** : États vides avec appels à l'action clairs

---

## 2. Design system

### 2.1 Typographie

**Font family** :
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Échelle typographique** :
```css
--text-xs: 0.75rem;      /* 12px - Labels, badges */
--text-sm: 0.875rem;     /* 14px - Body text */
--text-base: 1rem;       /* 16px - Default */
--text-lg: 1.125rem;     /* 18px - Lead text */
--text-xl: 1.25rem;      /* 20px - H4 */
--text-2xl: 1.5rem;      /* 24px - H3 */
--text-3xl: 1.875rem;    /* 30px - H2 */
--text-4xl: 2.25rem;     /* 36px - H1 */
```

**Font weights** :
- Regular : 400 (body text)
- Medium : 500 (emphasis)
- Semibold : 600 (headings, buttons)

**Line heights** :
- Body text : 1.5 (150%)
- Headings : 1.2 (120%)
- Tight : 1.25 (data tables)

### 2.2 Couleurs

**Palette principale** :
```css
/* Neutral (Gray) */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Primary (Blue) */
--blue-50: #EFF6FF;
--blue-100: #DBEAFE;
--blue-500: #3B82F6;
--blue-600: #2563EB;
--blue-700: #1D4ED8;

/* Success (Green) */
--green-50: #F0FDF4;
--green-100: #DCFCE7;
--green-500: #22C55E;
--green-600: #16A34A;

/* Warning (Amber) */
--amber-50: #FFFBEB;
--amber-100: #FEF3C7;
--amber-500: #F59E0B;
--amber-600: #D97706;

/* Error (Red) */
--red-50: #FEF2F2;
--red-100: #FEE2E2;
--red-500: #EF4444;
--red-600: #DC2626;

/* Info (Sky) */
--sky-50: #F0F9FF;
--sky-100: #E0F2FE;
--sky-500: #0EA5E9;
```

**Usages sémantiques** :
```css
/* Backgrounds */
--bg-page: white;
--bg-subtle: var(--gray-50);
--bg-muted: var(--gray-100);
--bg-hover: var(--gray-100);

/* Borders */
--border-base: var(--gray-200);
--border-strong: var(--gray-300);

/* Text */
--text-primary: var(--gray-900);
--text-secondary: var(--gray-600);
--text-tertiary: var(--gray-500);
--text-disabled: var(--gray-400);

/* Interactive */
--interactive-primary: var(--blue-600);
--interactive-hover: var(--blue-700);
--interactive-active: var(--blue-800);
```

### 2.3 Espacements

**Échelle** (Système 4px) :
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

**Usages** :
- Padding interne composants : `space-4` (16px)
- Marges entre sections : `space-6` ou `space-8`
- Grilles : `gap-4` ou `gap-6`

### 2.4 Radius

```css
--radius-sm: 0.25rem;    /* 4px - Badges, tags */
--radius-base: 0.5rem;   /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Modals */
--radius-full: 9999px;   /* Cercles, pills */
```

### 2.5 Shadows

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

**Usages** :
- Cards : `shadow-sm`
- Dropdowns, popovers : `shadow-lg`
- Modals : `shadow-xl`

### 2.6 Composants de base

#### Button

**Variants** :
```tsx
// Primary
<Button variant="primary">
  Enregistrer
</Button>
// → bg-brand-600 text-white hover:bg-brand-700

// Secondary
<Button variant="secondary">
  Annuler
</Button>
// → bg-white text-gray-700 border border-gray-300 hover:bg-gray-50

// Ghost
<Button variant="ghost">
  Voir détails
</Button>
// → transparent hover:bg-gray-100

// Danger
<Button variant="danger">
  Supprimer
</Button>
// → bg-red-600 text-white hover:bg-red-700
```

**Sizes** :
```tsx
<Button size="sm">Small</Button>    // px-3 py-1.5 text-sm
<Button size="base">Base</Button>    // px-4 py-2 text-base (default)
<Button size="lg">Large</Button>     // px-6 py-3 text-lg
```

**States** :
```tsx
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

#### Input

```tsx
<Input
  label="Email"
  placeholder="john@example.com"
  type="email"
  error="Email invalide"
  helper="Utilisé pour les notifications"
/>
```

**Styles** :
```css
.input {
  border: 1px solid var(--border-base);
  border-radius: var(--radius-base);
  padding: 0.5rem 0.75rem;
  font-size: var(--text-sm);
}

.input:focus {
  outline: 2px solid var(--blue-500);
  outline-offset: -1px;
  border-color: var(--blue-500);
}

.input.error {
  border-color: var(--red-500);
}
```

#### Card

```tsx
<Card
  title="Titre"
  subtitle="Sous-titre"
  action={<Button>Action</Button>}
>
  Contenu
</Card>
```

**Styles** :
```css
.card {
  background: white;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.card-header {
  margin-bottom: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

#### Badge

```tsx
<Badge variant="success">Vendu</Badge>
<Badge variant="warning">Réservé</Badge>
<Badge variant="default">Libre</Badge>
```

**Variants** :
- `success` : bg-green-100 text-green-800
- `warning` : bg-amber-100 text-amber-800
- `error` : bg-red-100 text-red-800
- `info` : bg-brand-100 text-brand-800
- `default` : bg-gray-100 text-gray-800

#### Table

```tsx
<Table
  data={lots}
  columns={[
    { key: 'code', label: 'Lot', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'price', label: 'Prix', align: 'right', render: formatCurrency },
    { key: 'status', label: 'Statut', render: (lot) => <StatusBadge status={lot.status} /> }
  ]}
  onRowClick={handleRowClick}
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
/>
```

**Features** :
- ✅ Tri colonnes (clic header)
- ✅ Sélection lignes (checkboxes)
- ✅ Hover row
- ✅ Actions inline
- ✅ Pagination
- ✅ Sticky header

---

## 3. Navigation & Architecture information

### 3.1 Structure globale

```
┌─────────────────────────────────────────────────────────────┐
│  TOPBAR                                                      │
│  [Logo] [Projet selector ▼] [Search] [Notifs] [User ▼]    │
└─────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                   │
│ SIDEBAR  │  MAIN CONTENT                                    │
│          │                                                   │
│ 🏠 Accueil │  ┌────────────────────────────────────────┐   │
│ 📊 Projets │  │ PageHeader                              │   │
│ 🏢 Lots    │  │ [Title] [Breadcrumb] [Actions]         │   │
│ 👥 CRM     │  └────────────────────────────────────────┘   │
│ 📄 Docs    │                                                │
│ 💰 Finance │  ┌────────────────────────────────────────┐   │
│ 📬 Soumiss.│  │ Content                                 │   │
│ ⚙️ Settings│  │                                         │   │
│          │  │                                         │   │
│          │  └────────────────────────────────────────┘   │
│          │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

### 3.2 Topbar

**Éléments** :
1. **Logo + App name** (cliquable → Dashboard)
2. **Project selector** (dropdown)
   - Liste projets accessibles
   - Recherche rapide
   - "Créer projet" (si permission)
3. **Global search** (⌘K)
   - Recherche projets, lots, documents, acheteurs
4. **Notifications** (cloche)
   - Badge count
   - Dropdown avec liste
5. **Language switcher** (FR/DE/EN/IT)
6. **User menu**
   - Profil
   - Paramètres
   - Déconnexion

### 3.3 Sidebar

**Structure conditionnelle par rôle** :

#### Promoteur / Admin Organisation
```
🏠 Tableau de bord
📊 Projets
  ├─ Vue d'ensemble
  ├─ Lots
  ├─ CRM
  ├─ Notaires
  ├─ Courtiers
  ├─ Finance
  ├─ Soumissions
  ├─ Documents
  ├─ Chantier
  └─ Paramètres
🏢 Entreprises & Contacts
📄 Documents
💬 Messages
⚙️ Paramètres
  ├─ Organisation
  ├─ Utilisateurs
  ├─ Abonnement
  └─ Facturation
```

#### Courtier
```
🏠 Mon activité
📊 Projets
🏢 Lots commercialisables
👥 Mes prospects
📋 Mes réservations
📊 Mes statistiques
⚙️ Mon profil
```

#### Acheteur
```
🏠 Mon bien
📄 Mes documents
🎨 Mes choix matériaux
💰 Mes paiements
🏗️ Avancement chantier
💬 Messages
⚙️ Mon profil
```

#### Notaire
```
🏠 Mes dossiers
📋 En cours
✅ Prêts signature
✍️ Signés
📄 Documents
⚙️ Mon profil
```

### 3.4 Breadcrumb

**Pattern** :
```
Projets / Villa Lac Léman / Lots / A-3-01
```

**Règles** :
- Max 4 niveaux affichés
- Si > 4 : `Projets / ... / Lots / A-3-01`
- Chaque niveau cliquable (navigation)

---

## 4. Expériences par rôle

### 4.1 Promoteur

**Dashboard principal** :
```
┌─────────────────────────────────────────────────────────────┐
│ Tableau de bord                                   [+ Projet] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Projets  │  │ Lots     │  │ Ventes   │  │ Acomptes │   │
│  │ actifs   │  │ vendus   │  │ en cours │  │ encaissés│   │
│  │    12    │  │ 145/200  │  │    8     │  │ 2.5M CHF │   │
│  │   +2     │  │   73%    │  │          │  │   +15%   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Projets récents                         [Voir tous]  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 📍 Villa Lac Léman     • 45/60 lots vendus          │  │
│  │ 📍 Résidence Bellevue  • En construction            │  │
│  │ 📍 Les Terrasses       • Planification              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tâches & Échéances                      [Voir tous]  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ ⚠️ Acompte acheteur Dupont en retard (J+7)          │  │
│  │ 📅 Signature acte Martin - 15 déc 2025              │  │
│  │ 📬 Soumission électricité - Clôture 20 déc          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**KPIs mis en avant** :
- Nombre projets actifs
- Taux de vente global
- CA prévisionnel vs réalisé
- Alertes (retards paiement, échéances proches)

**Actions rapides** :
- Créer projet
- Ajouter prospect
- Voir dossiers en attente

### 4.2 Courtier

**Dashboard courtier** :
```
┌─────────────────────────────────────────────────────────────┐
│ Mon activité                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Prospects│  │ Réserv.  │  │ Ventes   │  │ Taux     │   │
│  │ actifs   │  │          │  │ signées  │  │ conversion│  │
│  │    24    │  │    3     │  │    8     │  │   33%    │   │
│  │   +5     │  │          │  │  +2 mois │  │   +8%    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pipeline                                             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  [Nouveau]  [Contacté]  [Qualifié]  [Réservé]      │  │
│  │     8          10          6           3            │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Lots commercialisables                  [Filtrer]    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 🏢 A-3-01 • 4.5p • 125m² • 890K CHF • Disponible    │  │
│  │ 🏢 B-2-05 • 3.5p • 95m² • 720K CHF • Disponible     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Focus** :
- Pipeline visuel (Kanban)
- Lots à vendre (vite accessible)
- Stats perso (gamification)

### 4.3 Acheteur

**Dashboard acheteur** :
```
┌─────────────────────────────────────────────────────────────┐
│ Mon bien                                                     │
│ Lot A-3-01 • Villa Lac Léman                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │ 🏗️ Avancement construction                             ││
│  │                                                         ││
│  │  ████████████████████░░░░░░░░░░░░░  65%                ││
│  │                                                         ││
│  │  ✅ Gros œuvre terminé                                  ││
│  │  🔄 Second œuvre en cours                               ││
│  │  ⏸️ Finitions (à venir)                                 ││
│  └────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Docs     │  │ Choix    │  │ Acomptes │                 │
│  │ à fournir│  │ matériaux│  │ payés    │                 │
│  │    2     │  │  8/12    │  │   2/5    │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Prochaines échéances                                 │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 💰 Acompte 3 (gros œuvre) - 15 jan 2026 - 270K CHF  │  │
│  │ 📄 Choix matériaux - Deadline 20 déc 2025           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Simplicité** :
- Vue unifiée
- Langage non-technique
- Indicateurs visuels (progress bars, checks)
- Appels à l'action clairs

### 4.4 Notaire

**Dashboard notaire** :
```
┌─────────────────────────────────────────────────────────────┐
│ Mes dossiers                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [En cours: 8] [Prêts signature: 3] [Signés: 12]           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Dossiers en cours                                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 👤 Martin Jean • Villa Lac • A-3-01                  │  │
│  │    📄 Acte V2 uploadé • En attente relecture          │  │
│  │                                                      │  │
│  │ 👤 Dupont Marie • Résidence Bellevue • B-2-05       │  │
│  │    ⏰ Reçu il y a 2 jours • Documents OK             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Signatures planifiées                                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 📅 15 déc • 10h00 • Martin Jean                      │  │
│  │ 📅 18 déc • 14h30 • Durand Sophie                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Focus** :
- Liste dossiers par statut
- Alertes (nouveaux dossiers, questions)
- Calendrier RDV

---

## 5. Patterns d'interaction

### 5.1 Filtres avancés

**Pattern Stripe-like** :
```tsx
<FiltersBar>
  <FilterGroup label="Bâtiment">
    <Select options={buildings} />
  </FilterGroup>

  <FilterGroup label="Type">
    <Select options={lotTypes} multiple />
  </FilterGroup>

  <FilterGroup label="Surface">
    <RangeInput min={0} max={500} unit="m²" />
  </FilterGroup>

  <FilterGroup label="Prix">
    <RangeInput min={0} max={2000000} unit="CHF" />
  </FilterGroup>

  <FilterGroup label="Statut">
    <CheckboxGroup options={lotStatuses} />
  </FilterGroup>
</FiltersBar>

<FilterChips>
  <Chip onRemove={() => removeFilter('building')}>
    Bâtiment A <XIcon />
  </Chip>
  <Chip onRemove={() => removeFilter('type')}>
    Appartement <XIcon />
  </Chip>
  <Button variant="ghost" onClick={clearAllFilters}>
    Effacer tous les filtres
  </Button>
</FilterChips>
```

**Features** :
- Filtres persistés dans URL (`?building=A&type=APARTMENT`)
- Preview du nombre de résultats
- "Effacer filtres" visible si > 0 filtre actif

### 5.2 Actions bulk

**Pattern** :
```tsx
{selectedItems.length > 0 && (
  <BulkActionsBar>
    <span>{selectedItems.length} élément(s) sélectionné(s)</span>
    <div className="flex gap-2">
      <Button variant="secondary" onClick={exportSelected}>
        <DownloadIcon /> Exporter
      </Button>
      <Button variant="secondary" onClick={bulkUpdateStatus}>
        <EditIcon /> Changer statut
      </Button>
      <Button variant="danger" onClick={bulkDelete}>
        <TrashIcon /> Supprimer
      </Button>
    </div>
  </BulkActionsBar>
)}
```

**UX** :
- Barre sticky en bas de l'écran
- Apparition avec animation slide-up
- Confirmation pour actions destructives

### 5.3 Modals & Drawers

**Modal** (actions rapides, formulaires courts) :
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Ajouter un lot"
  size="md"
>
  <form>
    {/* Form fields */}
  </form>

  <ModalFooter>
    <Button variant="secondary" onClick={onClose}>
      Annuler
    </Button>
    <Button variant="primary" type="submit">
      Enregistrer
    </Button>
  </ModalFooter>
</Modal>
```

**Drawer** (détails, contexte étendu) :
```tsx
<Drawer
  isOpen={isOpen}
  onClose={onClose}
  position="right"
  width="600px"
>
  <DrawerHeader>
    <h2>Détails lot A-3-01</h2>
    <Button variant="ghost" onClick={onClose}>
      <XIcon />
    </Button>
  </DrawerHeader>

  <DrawerContent>
    {/* Detailed content */}
  </DrawerContent>
</Drawer>
```

### 5.4 Search globale (⌘K)

**Pattern Notion/Linear** :
```tsx
<CommandPalette
  isOpen={isOpen}
  onClose={onClose}
  placeholder="Rechercher projets, lots, documents..."
>
  <CommandPaletteResults>
    <CommandGroup heading="Projets">
      <CommandItem icon={FolderIcon} onSelect={...}>
        Villa Lac Léman
      </CommandItem>
    </CommandGroup>

    <CommandGroup heading="Lots">
      <CommandItem icon={BuildingIcon} onSelect={...}>
        A-3-01 • 4.5p • 890K CHF
      </CommandItem>
    </CommandGroup>

    <CommandGroup heading="Actions">
      <CommandItem icon={PlusIcon} onSelect={...}>
        Créer un projet
      </CommandItem>
    </CommandGroup>
  </CommandPaletteResults>
</CommandPalette>
```

**Features** :
- ⌘K ou Ctrl+K pour ouvrir
- Recherche fuzzy
- Navigation clavier (↑↓ + Enter)
- Groupes de résultats

### 5.5 Notifications

**Types** :
```tsx
// Success
<Toast variant="success">
  <CheckCircleIcon />
  Projet créé avec succès
</Toast>

// Error
<Toast variant="error">
  <XCircleIcon />
  Erreur lors de la sauvegarde
</Toast>

// Info
<Toast variant="info">
  <InfoIcon />
  Nouveau message reçu
</Toast>
```

**Position** : Top-right, stack vertical

**Durée** :
- Success/Info : 3-5 secondes (auto-dismiss)
- Error : Manuel (reste jusqu'au dismiss)

---

## 6. États & feedback

### 6.1 Loading states

**Skeleton screens** (préféré aux spinners) :
```tsx
<Card>
  <Skeleton className="h-6 w-32 mb-4" /> {/* Title */}
  <Skeleton className="h-4 w-full mb-2" /> {/* Line 1 */}
  <Skeleton className="h-4 w-3/4" />       {/* Line 2 */}
</Card>
```

**Spinners** (actions courtes) :
```tsx
<Button loading>
  <Spinner size="sm" />
  Chargement...
</Button>
```

### 6.2 Empty states

**Pattern** :
```tsx
<EmptyState
  icon={<FolderIcon />}
  title="Aucun projet"
  description="Créez votre premier projet pour commencer"
  action={
    <Button onClick={createProject}>
      <PlusIcon /> Créer un projet
    </Button>
  }
/>
```

**Principes** :
- Toujours expliquer pourquoi c'est vide
- Toujours proposer action suivante
- Illustration/icône pour humaniser

### 6.3 Error states

**Pattern** :
```tsx
<ErrorState
  title="Impossible de charger les données"
  description="Une erreur s'est produite lors du chargement"
  action={
    <Button onClick={retry}>
      <RefreshIcon /> Réessayer
    </Button>
  }
/>
```

**Erreurs formulaires** :
```tsx
<Input
  label="Email"
  value={email}
  error="Format email invalide"
  onChange={...}
/>

<FormError>
  <AlertCircleIcon />
  Veuillez corriger les erreurs avant de continuer
</FormError>
```

---

## 7. Responsive & Mobile

### 7.1 Breakpoints

```css
/* Mobile */
@media (min-width: 640px) { /* sm */ }

/* Tablet */
@media (min-width: 768px) { /* md */ }

/* Desktop */
@media (min-width: 1024px) { /* lg */ }

/* Large desktop */
@media (min-width: 1280px) { /* xl */ }
```

### 7.2 Adaptations mobile

**Sidebar** → Drawer (hamburger menu)

**Tableau** → Cards stack
```tsx
{/* Desktop */}
<Table data={lots} /> {/* hidden on mobile */}

{/* Mobile */}
<div className="md:hidden">
  {lots.map(lot => (
    <LotCard lot={lot} onClick={...} />
  ))}
</div>
```

**Filtres** → Bottom sheet

**Actions** → Floating action button (FAB)

---

## 8. Accessibilité

### 8.1 Principes

- ✅ **Contraste** : Ratio min 4.5:1 (texte), 3:1 (UI)
- ✅ **Navigation clavier** : Tous les éléments accessibles
- ✅ **Focus visible** : Outline bleu sur focus
- ✅ **ARIA labels** : Boutons icônes, régions, états
- ✅ **Texte alternatif** : Images, icônes décoratives

### 8.2 Navigation clavier

**Shortcuts** :
- `⌘K` : Search
- `⌘S` : Save
- `Esc` : Close modal/drawer
- `Tab` : Navigation
- `↑↓` : Navigation listes
- `Enter` : Sélection

### 8.3 ARIA

```tsx
<Button
  aria-label="Supprimer le lot A-3-01"
  aria-describedby="delete-warning"
>
  <TrashIcon />
</Button>

<p id="delete-warning" className="sr-only">
  Cette action est irréversible
</p>
```

---

## 🎯 Checklist UX par page

| Page | Checklist |
|------|-----------|
| **Toutes** | ✅ Breadcrumb, ✅ Loading state, ✅ Empty state, ✅ Error state, ✅ Actions claires |
| **Listes** | ✅ Filtres, ✅ Tri, ✅ Pagination, ✅ Bulk actions, ✅ Export |
| **Formulaires** | ✅ Validation inline, ✅ Messages erreur, ✅ Confirm avant quitter, ✅ Autosave (optionnel) |
| **Détails** | ✅ Actions contextuelles, ✅ Tabs si > 1 section, ✅ Liens relations |

---

**Ce document complète l'architecture avec les spécifications UX détaillées.**
