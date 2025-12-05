# Guide de Migration vers RealPro Design System

Ce guide vous aide à migrer progressivement vos pages existantes vers le nouveau Design System RealPro.

## 📋 Checklist de Migration

### Phase 1 : Préparation
- [ ] Lire la documentation du Design System (`DESIGN_SYSTEM.md`)
- [ ] Explorer les exemples (`DESIGN_SYSTEM_EXAMPLES.md`)
- [ ] Tester la page de démonstration (`/design-system-showcase`)
- [ ] Identifier les pages prioritaires à migrer

### Phase 2 : Migration Progressive
- [ ] Commencer par les composants de base (Button, Badge, Card)
- [ ] Migrer les formulaires (Field, Input, Textarea)
- [ ] Migrer les layouts (Topbar, Tabs)
- [ ] Migrer les tables et listes de données
- [ ] Migrer les modales et panels

### Phase 3 : Raffinement
- [ ] Tester en mode clair et sombre
- [ ] Vérifier la cohérence visuelle
- [ ] Optimiser les espacements
- [ ] Valider l'accessibilité

## 🔄 Table de Correspondance

### Composants de Base

| Ancien Composant | Nouveau Composant | Changements |
|-----------------|-------------------|-------------|
| `<Card>` | `<RealProCard>` | Nouvelle prop `hover`, `padding` |
| `<Button>` | `<RealProButton>` | Nouveaux variants, sizes plus cohérents |
| `<Badge>` | `<RealProBadge>` | Types standardisés (success, warning, etc.) |
| `<Input>` | `<RealProInput>` | Styles premium, meilleure gestion d'erreurs |
| `<Textarea>` | `<RealProTextarea>` | Styles premium |
| `<SearchBar>` | `<RealProSearchBar>` | Icône intégrée, styles améliorés |

### Composants de Layout

| Ancien | Nouveau | Changements |
|--------|---------|-------------|
| Headers manuels | `<RealProTopbar>` | Props `title`, `subtitle`, `actions` |
| Tabs manuels | `<RealProTabs>` | Configuration simplifiée |
| Panels custom | `<RealProPanel>` | Animations, backdrop, gestion d'état |
| Modales custom | `<RealProModal>` | Tailles standardisées, animations |

### Composants de Données

| Ancien | Nouveau | Changements |
|--------|---------|-------------|
| `<Table>` | `<RealProTable>` | Render functions, hover effects |
| Charts custom | `<RealProChartCard>` | Wrapper standardisé pour charts |

## 🛠️ Exemples de Migration

### Exemple 1 : Migrer un Button

**Avant :**
```tsx
<Button className="bg-primary-600 text-white px-4 py-2 rounded">
  Créer
</Button>
```

**Après :**
```tsx
import { RealProButton } from '@/components/realpro';

<RealProButton variant="primary">
  Créer
</RealProButton>
```

### Exemple 2 : Migrer une Card

**Avant :**
```tsx
<div className="p-6 bg-white rounded-lg shadow border">
  <h3 className="font-bold mb-2">Titre</h3>
  <p>Contenu</p>
</div>
```

**Après :**
```tsx
import { RealProCard } from '@/components/realpro';

<RealProCard hover>
  <h3 className="font-semibold mb-2">Titre</h3>
  <p>Contenu</p>
</RealProCard>
```

### Exemple 3 : Migrer un Header de Page

**Avant :**
```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-3xl font-bold">Gestion des lots</h1>
    <p className="text-gray-600">Vue d'ensemble</p>
  </div>
  <div className="flex gap-2">
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </div>
</div>
```

**Après :**
```tsx
import { RealProTopbar, RealProButton } from '@/components/realpro';

<RealProTopbar
  title="Gestion des lots"
  subtitle="Vue d'ensemble"
  actions={
    <>
      <RealProButton variant="outline">Action 1</RealProButton>
      <RealProButton variant="primary">Action 2</RealProButton>
    </>
  }
/>
```

### Exemple 4 : Migrer un Formulaire

**Avant :**
```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm mb-1">Nom</label>
    <input
      className="w-full border rounded px-3 py-2"
      placeholder="Nom..."
    />
  </div>

  <div>
    <label className="block text-sm mb-1">Description</label>
    <textarea
      className="w-full border rounded px-3 py-2"
      placeholder="Description..."
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
</div>
```

**Après :**
```tsx
import { RealProField, RealProInput, RealProTextarea } from '@/components/realpro';

<div className="space-y-6">
  <RealProField label="Nom" required>
    <RealProInput placeholder="Nom..." />
  </RealProField>

  <RealProField label="Description" error={error}>
    <RealProTextarea placeholder="Description..." rows={4} />
  </RealProField>
</div>
```

### Exemple 5 : Migrer une Table

**Avant :**
```tsx
<table className="w-full">
  <thead>
    <tr>
      <th>Nom</th>
      <th>Statut</th>
      <th>Prix</th>
    </tr>
  </thead>
  <tbody>
    {lots.map(lot => (
      <tr key={lot.id} onClick={() => handleClick(lot)}>
        <td>{lot.name}</td>
        <td>
          <span className={`px-2 py-1 rounded ${getStatusColor(lot.status)}`}>
            {lot.status}
          </span>
        </td>
        <td>CHF {lot.price}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**Après :**
```tsx
import { RealProTable, RealProBadge } from '@/components/realpro';

<RealProTable
  columns={[
    { key: 'name', label: 'Nom' },
    {
      key: 'status',
      label: 'Statut',
      render: (row) => (
        <RealProBadge type={row.status === 'sold' ? 'success' : 'neutral'}>
          {row.status}
        </RealProBadge>
      )
    },
    {
      key: 'price',
      label: 'Prix',
      render: (row) => `CHF ${row.price.toLocaleString()}`
    },
  ]}
  data={lots}
  onRowClick={handleClick}
/>
```

## 🎨 Ajustements de Style

### Couleurs

**Avant :**
```tsx
className="bg-brand-600 text-white"
className="bg-gray-100"
```

**Après :**
```tsx
className="bg-primary-900 dark:bg-primary-100 text-white dark:text-neutral-900"
className="bg-neutral-100 dark:bg-neutral-800"
```

### Ombres

**Avant :**
```tsx
className="shadow-lg"
```

**Après :**
```tsx
className="shadow-soft hover:shadow-card"
```

### Arrondis

**Avant :**
```tsx
className="rounded-lg"
```

**Après :**
```tsx
className="rounded-2xl"
```

### Espacement

**Avant :**
```tsx
className="p-4 gap-4 mb-4"
```

**Après :**
```tsx
className="p-6 gap-6 mb-6"
```

## ⚠️ Points d'Attention

### 1. Mode Sombre

Tous les nouveaux composants supportent le mode sombre automatiquement. Assurez-vous de :
- Toujours utiliser les classes `dark:` pour les couleurs custom
- Tester en mode clair ET sombre
- Utiliser les couleurs du design system (primary, neutral, etc.)

### 2. Accessibilité

Les composants RealPro incluent :
- Focus states appropriés
- Gestion des états disabled
- Labels et hints pour les formulaires

### 3. Responsive Design

Tous les composants sont responsive. Utilisez les breakpoints Tailwind :
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### 4. Performance

Les composants sont optimisés mais :
- Utilisez `useMemo` pour les données de tables volumineuses
- Lazy load les modales et panels si nécessaire
- Évitez les re-renders inutiles

## 📊 Priorité de Migration

### Priorité Haute (Impact visuel maximum)
1. Dashboard principal
2. Pages de liste (Lots, Projets, CRM)
3. Formulaires principaux (Création projet, lot, acheteur)

### Priorité Moyenne
4. Pages de détails
5. Pages de paramètres
6. Modales et panels

### Priorité Basse
7. Pages admin
8. Pages secondaires
9. Composants rarement utilisés

## 🧪 Testing

Pour chaque page migrée :

1. **Test Visuel**
   - [ ] Mode clair
   - [ ] Mode sombre
   - [ ] Responsive (mobile, tablet, desktop)

2. **Test Fonctionnel**
   - [ ] Interactions (clicks, hovers)
   - [ ] Formulaires (validation, erreurs)
   - [ ] Navigation (tabs, modales)

3. **Test Performance**
   - [ ] Temps de chargement
   - [ ] Animations fluides
   - [ ] Pas de lag

## 🎯 Objectifs de la Migration

Après migration complète, vous obtiendrez :

✅ **Cohérence visuelle** : Toutes les pages suivent le même design
✅ **Maintenance simplifiée** : Un seul endroit pour gérer les styles
✅ **Mode sombre parfait** : Supporté nativement partout
✅ **Performance optimale** : Composants légers et optimisés
✅ **Expérience premium** : Design de classe mondiale
✅ **Accessibilité** : Standards WCAG respectés

## 📞 Support

En cas de question ou difficulté :
1. Consulter `DESIGN_SYSTEM.md` pour la documentation complète
2. Voir `DESIGN_SYSTEM_EXAMPLES.md` pour des exemples concrets
3. Tester sur `/design-system-showcase` pour voir tous les composants
4. Vérifier les design tokens dans `/src/lib/design-system/tokens.ts`

---

**Bonne migration ! 🚀**
