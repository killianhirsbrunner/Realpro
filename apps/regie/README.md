# @realpro/regie

**Application Régie** - Gestion locative et administration de biens

## Statut

🚧 **Squelette créé** - Prêt pour migration du code métier

## Démarrage

```bash
# Depuis la racine du monorepo
pnpm install
pnpm --filter @realpro/regie dev
```

L'application sera accessible sur http://localhost:3003

## Structure

```
src/
├── layouts/           # Layout principal avec sidebar
│   └── RegieLayout.tsx
├── pages/             # Pages de l'application
│   ├── Dashboard.tsx  # Vue d'ensemble parc locatif
│   ├── Properties.tsx # Liste des biens
│   └── Tenants.tsx    # Liste des locataires
├── components/        # Composants spécifiques à Régie
├── App.tsx            # Router principal
├── main.tsx           # Point d'entrée
└── index.css          # Styles Tailwind
```

## Modules prévus

- [x] Dashboard Régie (squelette)
- [x] Biens gérés (squelette)
- [x] Locataires (squelette)
- [ ] Mandats de gestion
- [ ] Baux (contrats de location)
- [ ] Encaissements (loyers, quittances)
- [ ] Relances (impayés, contentieux)
- [ ] États des lieux (entrées/sorties)
- [ ] Technique (maintenance, travaux)
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
