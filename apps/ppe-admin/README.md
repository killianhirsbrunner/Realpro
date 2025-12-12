# @realpro/ppe-admin

**Application PPE Admin** - Gestion d'immeubles en Propriété par Étages

## Statut

🚧 **Squelette créé** - Prêt pour migration du code métier

## Démarrage

```bash
# Depuis la racine du monorepo
pnpm install
pnpm --filter @realpro/ppe-admin dev
```

L'application sera accessible sur http://localhost:3002

## Structure

```
src/
├── layouts/           # Layout principal avec sidebar
│   └── PPEAdminLayout.tsx
├── pages/             # Pages de l'application
│   ├── Dashboard.tsx  # Vue d'ensemble copropriétés
│   ├── Properties.tsx # Liste des immeubles
│   └── PropertyDetail.tsx # Détail d'un immeuble
├── components/        # Composants spécifiques à PPE Admin
├── App.tsx            # Router principal
├── main.tsx           # Point d'entrée
└── index.css          # Styles Tailwind
```

## Modules prévus

- [x] Dashboard PPE (squelette)
- [x] Gestion des immeubles (squelette)
- [ ] Copropriétaires
- [ ] Assemblées générales (AG)
- [ ] Tantièmes et clés de répartition
- [ ] Charges et fonds de rénovation
- [ ] Contrats de maintenance
- [ ] Sinistres
- [ ] Documents
- [ ] Communication

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
