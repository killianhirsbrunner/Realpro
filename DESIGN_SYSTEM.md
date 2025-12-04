# RealPro Design System

Le Design System RealPro est une bibliothèque complète de composants UI premium inspirée d'Apple, Linear et Notion, conçue spécifiquement pour créer une expérience utilisateur haut de gamme et cohérente.

## 🎨 Identité Visuelle

### Couleurs

Le système de couleurs RealPro utilise une palette neutre et élégante avec des accents subtils :

**Mode Clair**
- Background: `#eeede9` (warm white)
- Foreground: `#1b1b1b` (deep black)
- Primary: `#1b1b1b`
- Secondary: `#c9c8c3`
- Border: `#d7d6d2`

**Mode Sombre**
- Background: `#1b1b1b`
- Foreground: `#eeede9`
- Primary: `#eeede9`
- Secondary: `#2a2a2a`
- Border: `#2e2e2e`

**Accents**
- Green: `#3BB273` (success, validation)
- Orange: `#F5A623` (warnings, highlights)

### Typographie

**Font Family**: Inter, SF Pro Display, system-ui, sans-serif

**Weights**:
- Normal: 400
- Medium: 500
- Semibold: 600 (titres)
- Bold: 700

**Tracking**: `-0.02em` (tracking-tight) pour un style Apple premium

### Arrondis

- `rounded-xl` (1rem): Composants standards
- `rounded-2xl` (1.5rem): Cards et panels
- `rounded-3xl` (2rem): Modales et éléments hero

### Ombres Premium

```css
shadow-soft: 0 4px 12px rgba(0,0,0,0.08)    /* Cartes légères */
shadow-card: 0 8px 18px rgba(0,0,0,0.12)    /* Cartes hover */
shadow-panel: 0 12px 35px rgba(0,0,0,0.18)  /* Panels et modales */
shadow-glow: 0 0 20px rgba(59,178,115,0.3)  /* Highlights */
```

## 📦 Composants

### 1. RealProCard

Carte premium avec ombres douces et arrondis généreux.

```tsx
import { RealProCard } from '@/components/realpro';

<RealProCard padding="md" hover>
  <h3>Titre de la carte</h3>
  <p>Contenu de la carte</p>
</RealProCard>
```

**Props**:
- `padding`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `hover`: `boolean` (default: `false`) - Active l'effet hover
- `className`: `string` - Classes CSS additionnelles

### 2. RealProButton

Boutons premium avec variants multiples.

```tsx
import { RealProButton } from '@/components/realpro';

<RealProButton variant="primary" size="md">
  Action principale
</RealProButton>

<RealProButton variant="outline" size="sm">
  Action secondaire
</RealProButton>
```

**Variants**:
- `primary`: Bouton principal (dark bg)
- `secondary`: Bouton secondaire (neutral)
- `outline`: Bordure uniquement
- `ghost`: Transparent avec hover
- `danger`: Rouge pour actions destructives

**Sizes**: `'sm' | 'md' | 'lg'`

### 3. RealProBadge

Badges colorés pour statuts et labels.

```tsx
import { RealProBadge } from '@/components/realpro';

<RealProBadge type="success">Vendu</RealProBadge>
<RealProBadge type="warning">En attente</RealProBadge>
<RealProBadge type="danger">Annulé</RealProBadge>
```

**Types**: `'success' | 'warning' | 'danger' | 'info' | 'neutral'`

### 4. RealProPanel

Panel latéral coulissant (style Linear).

```tsx
import { RealProPanel } from '@/components/realpro';

<RealProPanel
  title="Détails du lot"
  isOpen={isPanelOpen}
  onClose={() => setIsPanelOpen(false)}
  width="md"
>
  <p>Contenu du panel</p>
</RealProPanel>
```

**Width**: `'sm' | 'md' | 'lg'`

### 5. RealProTopbar

En-tête de page avec titre et actions.

```tsx
import { RealProTopbar, RealProButton } from '@/components/realpro';

<RealProTopbar
  title="Gestion des lots"
  subtitle="Vue d'ensemble de tous les lots du projet"
  actions={
    <>
      <RealProButton variant="outline">Exporter</RealProButton>
      <RealProButton variant="primary">Nouveau lot</RealProButton>
    </>
  }
/>
```

### 6. RealProTabs

Navigation par onglets.

```tsx
import { RealProTabs } from '@/components/realpro';

<RealProTabs
  tabs={[
    { key: 'overview', label: 'Vue d\'ensemble', href: '/project/overview' },
    { key: 'lots', label: 'Lots', href: '/project/lots' },
    { key: 'finance', label: 'Finance', href: '/project/finance' },
  ]}
  active="overview"
/>
```

### 7. RealProTable

Table intelligente avec hover et spacing premium.

```tsx
import { RealProTable } from '@/components/realpro';

<RealProTable
  columns={[
    { key: 'name', label: 'Nom' },
    { key: 'status', label: 'Statut', render: (row) => <RealProBadge type="success">{row.status}</RealProBadge> },
    { key: 'price', label: 'Prix', render: (row) => `CHF ${row.price.toLocaleString()}` },
  ]}
  data={lots}
  onRowClick={(lot) => navigate(`/lots/${lot.id}`)}
/>
```

### 8. RealProSearchBar

Barre de recherche premium avec icône.

```tsx
import { RealProSearchBar } from '@/components/realpro';

<RealProSearchBar
  placeholder="Rechercher un lot..."
  onSearch={(value) => setSearchQuery(value)}
/>
```

### 9. RealProChartCard

Carte pour afficher des graphiques.

```tsx
import { RealProChartCard } from '@/components/realpro';
import { LineChart } from '@/components/reporting/LineChart';

<RealProChartCard
  title="Évolution des ventes"
  subtitle="Derniers 12 mois"
  chart={<LineChart data={salesData} />}
/>
```

### 10. RealProField

Champ de formulaire avec label et gestion d'erreurs.

```tsx
import { RealProField, RealProInput } from '@/components/realpro';

<RealProField
  label="Nom du lot"
  required
  error={errors.name}
  hint="Le nom doit être unique dans le projet"
>
  <RealProInput
    placeholder="Ex: A1.01"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
</RealProField>
```

### 11. RealProModal

Modale centrée avec backdrop blur.

```tsx
import { RealProModal, RealProButton } from '@/components/realpro';

<RealProModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Créer un nouveau lot"
  size="md"
>
  <form onSubmit={handleSubmit}>
    {/* Formulaire */}
    <div className="flex gap-3 mt-6">
      <RealProButton variant="outline" onClick={() => setIsModalOpen(false)}>
        Annuler
      </RealProButton>
      <RealProButton type="submit" variant="primary">
        Créer
      </RealProButton>
    </div>
  </form>
</RealProModal>
```

### 12. RealProInput & RealProTextarea

Inputs et textarea stylisés.

```tsx
import { RealProInput, RealProTextarea } from '@/components/realpro';

<RealProInput
  type="text"
  placeholder="Entrez votre texte..."
  error={!!errors.field}
/>

<RealProTextarea
  rows={4}
  placeholder="Description détaillée..."
  error={!!errors.description}
/>
```

## 🎯 Utilisation dans les pages

### Exemple : Page de liste de lots

```tsx
import {
  RealProTopbar,
  RealProButton,
  RealProSearchBar,
  RealProTable,
  RealProBadge,
  RealProPanel,
} from '@/components/realpro';

export function ProjectLots() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  return (
    <div className="p-8">
      <RealProTopbar
        title="Lots du projet"
        subtitle="Résidence Les Érables - Genève"
        actions={
          <RealProButton variant="primary">
            Nouveau lot
          </RealProButton>
        }
      />

      <div className="mb-6">
        <RealProSearchBar placeholder="Rechercher un lot..." />
      </div>

      <RealProTable
        columns={[
          { key: 'name', label: 'Lot' },
          { key: 'type', label: 'Type' },
          {
            key: 'status',
            label: 'Statut',
            render: (row) => (
              <RealProBadge type={row.status === 'sold' ? 'success' : 'neutral'}>
                {row.status === 'sold' ? 'Vendu' : 'Disponible'}
              </RealProBadge>
            )
          },
          { key: 'price', label: 'Prix', render: (row) => `CHF ${row.price.toLocaleString()}` },
        ]}
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
      >
        {/* Détails du lot */}
      </RealProPanel>
    </div>
  );
}
```

## 🌙 Mode Sombre

Tous les composants supportent automatiquement le mode sombre via Tailwind's `dark:` classes. Le mode sombre s'active avec la class `dark` sur l'élément root.

```tsx
import { ThemeContext } from '@/contexts/ThemeContext';

const { theme, toggleTheme } = useContext(ThemeContext);
```

## ✨ Animations

Le Design System inclut des animations fluides :

- `animate-slideLeft`: Panel entrant depuis la droite
- `animate-slideRight`: Panel entrant depuis la gauche
- `animate-fadeIn`: Fade in doux
- `animate-scaleIn`: Scale in avec fade

## 🎨 Design Tokens

Tous les tokens de design sont centralisés dans `/src/lib/design-system/tokens.ts` pour une maintenance facile.

```tsx
import { designTokens } from '@/lib/design-system/tokens';

const spacing = designTokens.spacing.md; // '1rem'
const shadow = designTokens.shadows.card;
```

## 📝 Best Practices

1. **Utilisez toujours RealPro components** pour les nouvelles features
2. **Respectez la hiérarchie visuelle** : `font-semibold` pour les titres, `tracking-tight` pour les grands textes
3. **Préférez `shadow-soft`** pour les éléments standards, `shadow-card` au hover
4. **Utilisez `rounded-2xl`** par défaut pour les cartes
5. **Mode sombre first** : Testez toujours en mode clair ET sombre
6. **Spacing cohérent** : Utilisez les multiples de 4px (spacing scale Tailwind)

## 🚀 Migration

Pour migrer une page existante vers RealPro Design System :

1. Remplacer `<Card>` par `<RealProCard>`
2. Remplacer `<Button>` par `<RealProButton>`
3. Utiliser `<RealProTopbar>` au lieu de headers manuels
4. Utiliser `<RealProTable>` pour toutes les tables de données
5. Standardiser les formulaires avec `<RealProField>` + `<RealProInput>`

## 💎 Résultat

Avec le RealPro Design System, votre SaaS obtient :

✅ Cohérence visuelle totale sur toutes les pages
✅ Expérience utilisateur premium (niveau Apple/Linear)
✅ Maintenance simplifiée (un seul endroit pour les styles)
✅ Mode sombre parfait
✅ Performance optimale (composants légers)
✅ Accessibilité améliorée
✅ Design moderne et intemporel

---

**Version**: 1.0.0
**Dernière mise à jour**: 2024
**License**: Proprietary - Realpro SA
