# Guide de Migration - Promoteur

## Vue d'ensemble

Ce guide décrit la stratégie de migration progressive du code Promoteur depuis `/src/` vers `/apps/promoteur/`.

**Principe clé**: Migration incrémentale sans interruption de service.

## Architecture actuelle

```
/src/                          # Code legacy Promoteur (191 pages, 258 composants)
├── App.tsx                    # Router principal (31KB)
├── components/                # 258 composants UI
├── pages/                     # 191 pages
├── hooks/                     # Hooks custom
├── contexts/                  # Providers React
├── lib/                       # Utilitaires
└── shared/                    # Code partagé

/apps/promoteur/               # Nouvelle structure modulaire
├── src/
│   ├── App.tsx               # Router simplifié
│   ├── features/             # Modules métier (DDD)
│   ├── entities/             # Types locaux
│   └── pages/                # Pages migrées
```

## Stratégie d'alias

Le `vite.config.ts` et `tsconfig.json` sont configurés avec des alias pour permettre l'import du code legacy:

```typescript
// Import depuis le nouveau code local
import { Dashboard } from '@/pages/Dashboard';
import { ProjectTypes } from '@entities/types';

// Import depuis le code legacy (migration progressive)
import { ProjectCockpit } from '@legacy/pages/ProjectCockpit';
import { AppShell } from '@legacy/components/layout/AppShell';
import { useAuth } from '@legacy/hooks/useAuth';
```

## Plan de migration par phases

### Phase 1: Infrastructure (Terminé)
- [x] Alias `@legacy/*` configurés
- [x] tsconfig.json avec chemins
- [x] Build indépendant fonctionnel

### Phase 2: Pages critiques
Migrer les pages les plus utilisées en premier:

| Page | Priorité | Complexité | Status |
|------|----------|------------|--------|
| Dashboard | Haute | Moyenne | En place |
| ProjectsList | Haute | Haute | À migrer |
| ProjectDetail | Haute | Haute | À migrer |
| ProjectCockpit | Haute | Très haute | À migrer |

### Phase 3: Composants partagés
Identifier les composants utilisés par plusieurs pages:

```bash
# Trouver les composants les plus importés
grep -r "from.*components" src/pages --include="*.tsx" | \
  sed 's/.*from.*components\///' | sort | uniq -c | sort -rn | head -20
```

### Phase 4: Hooks et Contexts
Migrer vers `@realpro/core`:

- `useAuth` → `@realpro/auth`
- `useSupabase` → `@realpro/core`
- `useOrganization` → `@realpro/core`

### Phase 5: Cleanup
- Supprimer code dupliqué
- Mettre à jour les imports
- Retirer les alias `@legacy`

## Procédure de migration d'une page

### 1. Copier la page

```bash
# Exemple: migrer ProjectsList
cp src/pages/ProjectsListEnhanced.tsx apps/promoteur/src/features/projects/pages/ProjectsList.tsx
```

### 2. Mettre à jour les imports

```typescript
// AVANT (legacy)
import { Button } from '@/components/ui/Button';
import { useProjects } from '@/hooks/useProjects';

// APRÈS (nouveau)
import { Button } from '@realpro/ui';
import { useProjects } from '@features/projects/hooks/useProjects';
```

### 3. Ajouter la route

```typescript
// apps/promoteur/src/App.tsx
const ProjectsList = lazy(() =>
  import('@features/projects/pages/ProjectsList')
);

<Route path="projects" element={<ProjectsList />} />
```

### 4. Tester

```bash
pnpm dev:promoteur
# Vérifier la page http://localhost:3001/projects
```

### 5. Supprimer le legacy (après validation)

```bash
rm src/pages/ProjectsListEnhanced.tsx
```

## Modules à créer

Structure recommandée pour `/apps/promoteur/src/features/`:

```
features/
├── dashboard/
│   ├── components/
│   ├── hooks/
│   └── pages/
├── projects/
│   ├── components/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectFilters.tsx
│   │   └── ProjectTable.tsx
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   └── useProjectStats.ts
│   ├── pages/
│   │   ├── ProjectsList.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── ProjectCockpit.tsx
│   └── index.ts
├── crm/
├── sales/
├── finance/
├── construction/
├── documents/
├── sav/
└── settings/
```

## Commandes utiles

```bash
# Développement local Promoteur uniquement
pnpm dev:promoteur

# Build de test
pnpm build:promoteur

# Type check
pnpm --filter @realpro/promoteur typecheck

# Voir les dépendances d'un fichier
npx madge src/pages/ProjectCockpit.tsx --image deps.png
```

## Règles de migration

1. **Une page à la fois** - Ne pas migrer plusieurs pages en parallèle
2. **Tests manuels obligatoires** - Vérifier chaque page migrée
3. **Pas de régression** - Le comportement doit être identique
4. **Commits atomiques** - Un commit par page migrée
5. **Documentation** - Mettre à jour ce guide après chaque migration

## Estimation

| Phase | Effort | Durée estimée |
|-------|--------|---------------|
| Pages critiques (10) | Moyen | - |
| Pages secondaires (50) | Élevé | - |
| Composants (100+) | Très élevé | - |
| Cleanup | Moyen | - |

*Note: Les durées dépendent des ressources allouées*

## Support

Pour toute question sur la migration:
1. Consulter `/docs/ARCHITECTURE.md`
2. Vérifier les exemples dans `/apps/promoteur/src/features/`
3. Contacter l'équipe technique
