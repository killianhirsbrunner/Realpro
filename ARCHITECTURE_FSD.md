# RealPro - Architecture Feature-Sliced Design (FSD)

## Vue d'ensemble

Cette architecture suit le pattern **Feature-Sliced Design** adapté pour un SaaS B2B immobilier.
Elle garantit : scalabilité, maintenabilité, testabilité et performance.

## Structure des Layers

```
src/
├── app/                    # Layer 1: Configuration globale
│   ├── providers/          # Context providers
│   ├── routes/             # Configuration des routes (lazy-loaded)
│   └── styles/             # Styles globaux
│
├── shared/                 # Layer 2: Code partagé réutilisable
│   ├── ui/                 # Design System (Button, Card, Badge, etc.)
│   ├── lib/                # Utilitaires (supabase, format, cn)
│   ├── hooks/              # Hooks génériques (useDebounce, useLocalStorage)
│   ├── config/             # Constants, environnement
│   └── types/              # Types partagés
│
├── entities/               # Layer 3: Entités métier
│   ├── user/               # Utilisateur (types, API, UI, permissions)
│   ├── organization/       # Organisation
│   ├── project/            # Projet immobilier
│   ├── lot/                # Lot (appartement)
│   ├── buyer/              # Acheteur
│   └── document/           # Document
│
├── features/               # Layer 4: Fonctionnalités utilisateur
│   ├── auth/               # Authentification
│   ├── project-management/ # Gestion de projets
│   ├── crm/                # Pipeline commercial
│   ├── finance/            # Gestion financière
│   ├── construction/       # Suivi chantier
│   ├── materials/          # Choix matériaux
│   ├── submissions/        # Soumissions fournisseurs
│   ├── documents/          # Gestion documentaire
│   ├── sav/                # Service après-vente
│   └── ...
│
├── widgets/                # Layer 5: Compositions intelligentes
│   ├── layout/             # AppShell, Sidebar, Header
│   ├── dashboard/          # KPIs, Activity Feed
│   └── search/             # Global Search
│
└── pages/                  # Layer 6: Pages (assemblage final)
    ├── public/             # Landing, Pricing
    ├── auth/               # Login, Register
    ├── dashboard/          # Tableaux de bord
    └── projects/           # Pages projet
```

## Règles d'import

```
pages → widgets → features → entities → shared → app
  ↓        ↓         ↓          ↓          ↓
  └────────┴─────────┴──────────┴──────────┘
           Un layer ne peut importer QUE des layers inférieurs
```

## Path Aliases

```typescript
// tsconfig.app.json
{
  "paths": {
    "@/*": ["./src/*"],
    "@app/*": ["./src/app/*"],
    "@shared/*": ["./src/shared/*"],
    "@entities/*": ["./src/entities/*"],
    "@features/*": ["./src/features/*"],
    "@widgets/*": ["./src/widgets/*"],
    "@pages/*": ["./src/pages/*"]
  }
}
```

## Exemples d'utilisation

### Import depuis shared/ui
```typescript
import { Button, Card, Badge } from '@shared/ui';
import { cn, formatCHF } from '@shared/lib/utils';
import { supabase } from '@shared/lib/supabase';
```

### Import depuis entities
```typescript
import { UserAvatar, UserBadge, hasPermission } from '@entities/user';
import { ProjectCard, projectApi } from '@entities/project';
import { LotCard, lotApi } from '@entities/lot';
```

### Import depuis features
```typescript
import { LoginForm, AuthGuard } from '@features/auth';
import { CRMKanban } from '@features/crm';
```

## Structure d'une Entity

```
entities/user/
├── api/
│   ├── user.api.ts        # CRUD operations
│   └── index.ts
├── model/
│   ├── user.types.ts      # Types TypeScript
│   └── index.ts
├── ui/
│   ├── UserAvatar.tsx     # Composants UI
│   ├── UserBadge.tsx
│   └── index.ts
├── lib/
│   ├── permissions.ts     # Helpers spécifiques
│   └── index.ts
└── index.ts               # Public API (exports contrôlés)
```

## Lazy Loading

Toutes les routes sont chargées dynamiquement :

```typescript
// app/routes/project.routes.tsx
const ProjectLots = lazy(() => import('@/pages/ProjectLots'));

<Route path="/projects/:id/lots" element={
  <Suspense fallback={<PageSkeleton />}>
    <ProjectLots />
  </Suspense>
} />
```

## Avantages

| Avantage | Description |
|----------|-------------|
| **Scalabilité** | Ajout de features sans impact sur le reste |
| **Maintenabilité** | Chaque feature est isolée et autonome |
| **Testabilité** | Tests unitaires faciles par module |
| **Performance** | Lazy loading natif par route |
| **Onboarding** | Structure prévisible |
| **Team scaling** | Équipes peuvent travailler en parallèle |

## Migration depuis l'ancienne architecture

Les fichiers existants dans `src/components/`, `src/hooks/`, `src/lib/` restent fonctionnels.
La migration se fait progressivement en créant les nouveaux modules dans la nouvelle structure.

Pour migrer un composant :
1. Créer la structure dans le bon layer (entities, features, etc.)
2. Copier le code en adaptant les imports
3. Mettre à jour les imports dans les fichiers qui l'utilisent
4. Supprimer l'ancien fichier quand tous les imports sont migrés

---

**Dernière mise à jour** : Décembre 2024
