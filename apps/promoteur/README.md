# @realpro/promoteur

**Application Promoteur** - Gestion de projets de promotion immobilière

## Statut

🚧 **Squelette créé** - Prêt pour migration du code métier

## Démarrage

```bash
# Depuis la racine du monorepo
pnpm install
pnpm --filter @realpro/promoteur dev
```

L'application sera accessible sur http://localhost:3001

## Structure

```
src/
├── layouts/           # Layout principal avec sidebar
│   └── PromoteurLayout.tsx
├── pages/             # Pages de l'application
│   ├── Dashboard.tsx  # Vue d'ensemble
│   ├── Projects.tsx   # Liste des projets
│   └── ProjectDetail.tsx # Détail d'un projet
├── components/        # Composants spécifiques à Promoteur
├── App.tsx            # Router principal
├── main.tsx           # Point d'entrée
└── index.css          # Styles Tailwind
```

## Modules prévus

- [x] Dashboard Promoteur (squelette)
- [x] Gestion des projets (squelette)
- [ ] Lots (appartements, commerces, parkings)
- [ ] Ventes / CRM (pipeline, prospects, réservations)
- [ ] Suivi de chantier
- [ ] Budget / CFC
- [ ] Soumissions (appels d'offres)
- [ ] Choix matériaux
- [ ] Livraison
- [ ] SAV / Garanties
- [ ] Documents
- [ ] Courtiers

## Stack

- React 18 + TypeScript + Vite
- @realpro/ui (Design System partagé)
- @realpro/auth (Authentification partagée)
- @realpro/i18n (Internationalisation)
- @realpro/shared-utils (Utilitaires communs)
- React Router 6
- TanStack Query (React Query)
- Zustand (state management)
- Supabase (Backend)

## Dépendances internes

Ce package dépend des packages partagés:
- `@realpro/ui` - Composants UI
- `@realpro/auth` - Authentification Supabase
- `@realpro/i18n` - Traductions
- `@realpro/shared-utils` - Formatters, validators, etc.
- `@realpro/config` - Configuration ESLint, Tailwind
