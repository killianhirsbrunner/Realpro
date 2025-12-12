# REALPRO SUITE - Architecture Technique & Produit

> **Version:** 1.0
> **Date:** 2025-12-12
> **Auteur:** Architecture Team
> **Statut:** Proposition validée

---

## Table des matières

1. [Diagnostic du repo actuel](#1-diagnostic-du-repo-actuel)
2. [Architecture cible recommandée](#2-architecture-cible-recommandée)
3. [Arborescence CODE/PACKAGES](#3-arborescence-codepackages)
4. [Règles de frontières](#4-règles-de-frontières)
5. [Arborescence MENUS/MODULES UI](#5-arborescence-menusmodules-ui)
6. [Routing & Déploiement](#6-routing--déploiement)
7. [Plan de migration & Risques](#7-plan-de-migration--risques)

---

## 1. Diagnostic du repo actuel

### 1.1 Stack technique identifiée

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Framework** | React + TypeScript | 18.2 / 5.3+ |
| **Build** | Vite | 5.4.2 |
| **Monorepo** | Turborepo + pnpm | 2.0 / 8.15+ |
| **Routing** | React Router DOM | 6.20+ |
| **State** | Zustand + TanStack Query | 4.4 / 5.17 |
| **Forms** | React Hook Form | 7.68+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **Auth/DB** | Supabase (PostgreSQL) | 2.39+ |
| **i18n** | i18next | 4 langues (FR/DE/EN/IT) |

### 1.2 Structure existante

```
/home/user/Realpro/
├── apps/
│   ├── promoteur/       # ✅ Skeleton fonctionnel (3 pages)
│   ├── regie/           # ⚠️ Skeleton vide
│   └── ppe-admin/       # ⚠️ Skeleton vide
├── packages/
│   ├── auth/            # ✅ Supabase auth complet
│   ├── core/            # ✅ Providers (Theme, Organization)
│   ├── entities/        # ⚠️ Types orientés Promoteur
│   ├── ui/              # ✅ Design system (18+ composants)
│   ├── shared-utils/    # ✅ Utilitaires techniques
│   ├── i18n/            # ✅ Config i18next
│   └── config/          # ✅ ESLint, TS, Tailwind
├── supabase/
│   └── migrations/      # ✅ 50+ tables, RLS complet
└── [configs root]       # turbo.json, vite, tailwind...
```

### 1.3 État de maturité par application

#### App Promoteur (apps/promoteur)

| Module | État | Commentaire |
|--------|------|-------------|
| Dashboard | ✅ UI Ready | Mock data, 4 KPIs |
| Liste Projets | ✅ UI Ready | Filtres, recherche, cartes |
| Détail Projet | ⚠️ Skeleton | Tabs placeholder (Unités, Docs, Planning, Prospects) |
| Layout/Navigation | ✅ Complet | Sidebar 5 items, responsive |
| Connexion Supabase | ⚠️ Prêt | Client initialisé, pas de queries |

**Modules DB existants (migrations) non implémentés UI:**
- CRM/Prospects (tables: `prospects`, `reservations`)
- Ventes/Buyers (tables: `buyers`, `buyer_files`, `sales_contracts`)
- Budget CFC (tables: `cfc_budgets`, `cfc_lines`)
- Contrats (tables: `contracts`, `invoices`, `payments`)
- Soumissions (tables: `submissions`, `submission_offers`)
- Construction (tables: `project_phases`, `phase_milestones`)
- Documents (tables: `documents`, `document_versions`)
- Notaire (tables: `buyer_dossiers`, `notary_files`, `act_versions`)
- Choix matériaux (tables: `material_categories`, `buyer_choices`)

#### App Régie (apps/regie)

| Élément | État |
|---------|------|
| Structure | ✅ Skeleton identique |
| Pages | ❌ Aucune page métier |
| Layout | ✅ RegieLayout (copie) |
| Connexion | ✅ Providers prêts |

#### App PPE Admin (apps/ppe-admin)

| Élément | État |
|---------|------|
| Structure | ✅ Skeleton identique |
| Pages | ❌ Aucune page métier |
| Layout | ✅ PPEAdminLayout (copie) |
| Connexion | ✅ Providers prêts |

### 1.4 Couplages identifiés

#### ✅ Points positifs (pas de couplage problématique)

- **Aucun import croisé** entre apps (vérifié)
- **Packages bien isolés** (aucun @realpro/ui n'importe @realpro/core, etc.)
- **RLS Supabase** déjà en place pour multi-tenant

#### ⚠️ Points d'attention

| Problème | Localisation | Risque | Action |
|----------|--------------|--------|--------|
| Types `Project/Lot` orientés Promoteur | `packages/entities` | Moyen | Séparer en entities par app |
| Base de données unifiée | `supabase/migrations` | Faible | Segmentation logique OK |
| OrganizationProvider universel | `packages/core` | Faible | Acceptable (technique) |
| Enums métier partagés | `packages/entities/database` | Moyen | Évaluer séparation future |

### 1.5 Modules Promoteur existants (détail)

**Pages implémentées:**

1. **Dashboard** (`src/pages/Dashboard.tsx`)
   - StatCards: Projets actifs, Lots vendus, Prospects, Visites
   - Liste projets avec progress bars
   - Mock data (3 projets exemple)

2. **Projects** (`src/pages/Projects.tsx`)
   - Recherche par nom/localisation
   - Filtres par statut (Planification, Construction, Commercialisation, Livré)
   - Grid responsive avec cartes projet
   - Navigation vers détail

3. **ProjectDetail** (`src/pages/ProjectDetail.tsx`)
   - Breadcrumb navigation
   - Header avec image, status, description
   - 4 info boxes (Localisation, Livraison, Lots total, Lots vendus)
   - Tabs (placeholders): Unités, Documents, Planning, Prospects

**Layout** (`src/layouts/PromoteurLayout.tsx`)
- Sidebar: Logo, 5 nav items, User section
- Header: Mobile toggle, Notifications, User dropdown
- Navigation prévue:
  1. Tableau de bord ✅
  2. Projets ✅
  3. Prospects ⬜ (route non implémentée)
  4. Documents ⬜ (route non implémentée)
  5. Paramètres ⬜ (route non implémentée)

---

## 2. Architecture cible recommandée

### 2.1 Décision: Option A - Monorepo avec Turborepo

**Choix:** Conserver et améliorer l'architecture monorepo existante.

#### Justification

| Critère | Monorepo (A) | Multi-repo (B) |
|---------|--------------|----------------|
| **Coût migration** | ✅ Faible (structure existe) | ❌ Élevé (tout recréer) |
| **Time-to-value** | ✅ Rapide | ❌ Lent |
| **Shared packages** | ✅ workspace:* natif | ⚠️ NPM privé requis |
| **CI/CD** | ✅ Turborepo cache | ⚠️ 3 pipelines séparés |
| **Releases séparées** | ✅ Possible (turbo --filter) | ✅ Natif |
| **Refactoring global** | ✅ Atomique | ❌ 3 PRs coordonnées |
| **DX (Developer Experience)** | ✅ Excellente | ⚠️ Context switching |

#### Risques mitigés

| Risque | Mitigation |
|--------|------------|
| Couplage involontaire | ESLint rule no-restricted-imports |
| Build time croissant | Turborepo remote caching |
| Tentation de tout partager | Règles strictes documentées |
| Déploiement couplé | Vercel/Netlify project per app |

### 2.2 Principes architecturaux

```
┌─────────────────────────────────────────────────────────────────┐
│                     REALPRO SUITE (Monorepo)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  PPE-ADMIN   │  │  PROMOTEUR   │  │    RÉGIE     │           │
│  │   (App 1)    │  │   (App 2)    │  │   (App 3)    │           │
│  │              │  │              │  │              │           │
│  │ - Entities   │  │ - Entities   │  │ - Entities   │           │
│  │ - Features   │  │ - Features   │  │ - Features   │           │
│  │ - Pages      │  │ - Pages      │  │ - Pages      │           │
│  │ - Services   │  │ - Services   │  │ - Services   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         └────────────┬────┴────┬────────────┘                    │
│                      │         │                                 │
│  ┌───────────────────▼─────────▼───────────────────┐            │
│  │              PACKAGES TECHNIQUES                 │            │
│  │                                                  │            │
│  │  @realpro/ui          Design system, composants │            │
│  │  @realpro/auth        Supabase auth, guards     │            │
│  │  @realpro/core        Theme, hooks techniques   │            │
│  │  @realpro/shared-utils Formatters, validators   │            │
│  │  @realpro/i18n        Configuration i18next     │            │
│  │  @realpro/config      ESLint, TS, Tailwind      │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
│  ══════════════════════════════════════════════════             │
│  FRONTIÈRE STRICTE: Pas de logique métier partagée              │
│  ══════════════════════════════════════════════════             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Stratégie de données

**Base de données Supabase (unique, multi-tenant):**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SHARED TECHNICAL (tous les apps)                               │
│  ├── organizations                                               │
│  ├── users / user_organizations / user_roles                    │
│  ├── roles / permissions / role_permissions                     │
│  ├── plans / subscriptions (billing SaaS)                       │
│  └── audit_logs / notifications                                 │
│                                                                  │
│  DOMAINE PPE-ADMIN                                              │
│  ├── ppe_coproprietes (immeubles PPE)                           │
│  ├── ppe_lots (propriétés par étages)                           │
│  ├── ppe_coproprietaires                                        │
│  ├── ppe_assemblees_generales                                   │
│  ├── ppe_decomptes_charges                                      │
│  ├── ppe_fonds_renovation                                       │
│  └── ppe_* (tables préfixées)                                   │
│                                                                  │
│  DOMAINE PROMOTEUR (existant)                                   │
│  ├── projects / buildings / floors / lots                       │
│  ├── prospects / reservations / buyers                          │
│  ├── cfc_budgets / contracts / invoices                         │
│  ├── submissions / project_phases                               │
│  └── documents / material_options                               │
│                                                                  │
│  DOMAINE RÉGIE                                                  │
│  ├── reg_immeubles                                              │
│  ├── reg_objets_locatifs (appartements, parkings...)            │
│  ├── reg_locataires / reg_baux                                  │
│  ├── reg_decomptes_charges                                      │
│  ├── reg_contentieux                                            │
│  └── reg_* (tables préfixées)                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Règle de nommage:**
- Tables PPE: préfixe `ppe_`
- Tables Régie: préfixe `reg_`
- Tables Promoteur: pas de préfixe (existant)
- Tables partagées techniques: pas de préfixe

---

## 3. Arborescence CODE/PACKAGES

### 3.1 Structure complète

```
Realpro/
│
├── apps/
│   │
│   ├── ppe-admin/                          # APP 1 - Administration PPE
│   │   ├── src/
│   │   │   ├── main.tsx                    # Entry point + providers
│   │   │   ├── App.tsx                     # Router configuration
│   │   │   ├── index.css                   # Styles globaux
│   │   │   │
│   │   │   ├── entities/                   # Entités MÉTIER PPE uniquement
│   │   │   │   ├── copropriete/
│   │   │   │   │   ├── types.ts            # PPECopropriete, PPELot
│   │   │   │   │   ├── api.ts              # Queries Supabase
│   │   │   │   │   └── hooks.ts            # useCoproprietes, useLots
│   │   │   │   ├── coproprietaire/
│   │   │   │   │   ├── types.ts
│   │   │   │   │   ├── api.ts
│   │   │   │   │   └── hooks.ts
│   │   │   │   ├── assemblee/
│   │   │   │   ├── charge/
│   │   │   │   ├── fonds-renovation/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── features/                   # Features métier PPE
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── components/
│   │   │   │   │   └── hooks/
│   │   │   │   ├── coproprietes/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── CoproprieteCard.tsx
│   │   │   │   │   │   ├── CoproprieteForm.tsx
│   │   │   │   │   │   └── LotsList.tsx
│   │   │   │   │   └── hooks/
│   │   │   │   ├── assemblees/
│   │   │   │   ├── charges/
│   │   │   │   ├── coproprietaires/
│   │   │   │   └── documents/
│   │   │   │
│   │   │   ├── pages/                      # Pages/Routes
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Coproprietes.tsx
│   │   │   │   ├── CoproprieteDetail.tsx
│   │   │   │   ├── Assemblees.tsx
│   │   │   │   ├── Charges.tsx
│   │   │   │   ├── Coproprietaires.tsx
│   │   │   │   └── Settings.tsx
│   │   │   │
│   │   │   ├── layouts/
│   │   │   │   └── PPEAdminLayout.tsx      # Layout spécifique PPE
│   │   │   │
│   │   │   └── lib/                        # Utilitaires spécifiques PPE
│   │   │       ├── calculs-charges.ts      # Calculs de charges PPE
│   │   │       ├── quorum.ts               # Calculs de quorum AG
│   │   │       └── milliemes.ts            # Gestion des millièmes
│   │   │
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind.config.js
│   │
│   ├── promoteur/                          # APP 2 - Promotion immobilière
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   │
│   │   │   ├── entities/                   # Entités MÉTIER Promoteur
│   │   │   │   ├── project/
│   │   │   │   │   ├── types.ts            # Project, Building, Floor
│   │   │   │   │   ├── api.ts
│   │   │   │   │   └── hooks.ts
│   │   │   │   ├── lot/
│   │   │   │   │   ├── types.ts            # Lot (vente neuf)
│   │   │   │   │   ├── api.ts
│   │   │   │   │   └── hooks.ts
│   │   │   │   ├── prospect/
│   │   │   │   ├── buyer/
│   │   │   │   ├── budget/
│   │   │   │   ├── contract/
│   │   │   │   ├── submission/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ProjectCard.tsx
│   │   │   │   │   │   ├── ProjectForm.tsx
│   │   │   │   │   │   ├── BuildingManager.tsx
│   │   │   │   │   │   └── LotGrid.tsx
│   │   │   │   │   └── hooks/
│   │   │   │   ├── crm/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ProspectList.tsx
│   │   │   │   │   │   ├── ProspectDetail.tsx
│   │   │   │   │   │   └── ReservationFlow.tsx
│   │   │   │   │   └── hooks/
│   │   │   │   ├── sales/
│   │   │   │   ├── budget/
│   │   │   │   ├── submissions/
│   │   │   │   ├── construction/
│   │   │   │   ├── notary/
│   │   │   │   └── documents/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx           # ✅ Existant
│   │   │   │   ├── Projects.tsx            # ✅ Existant
│   │   │   │   ├── ProjectDetail.tsx       # ✅ Existant (à enrichir)
│   │   │   │   ├── Prospects.tsx           # ⬜ À créer
│   │   │   │   ├── Sales.tsx               # ⬜ À créer
│   │   │   │   ├── Budget.tsx              # ⬜ À créer
│   │   │   │   ├── Submissions.tsx         # ⬜ À créer
│   │   │   │   ├── Documents.tsx           # ⬜ À créer
│   │   │   │   └── Settings.tsx            # ⬜ À créer
│   │   │   │
│   │   │   ├── layouts/
│   │   │   │   └── PromoteurLayout.tsx     # ✅ Existant
│   │   │   │
│   │   │   └── lib/
│   │   │       ├── cfc-calculator.ts       # Calculs budget CFC
│   │   │       ├── sales-pipeline.ts       # Logique pipeline ventes
│   │   │       └── progress-tracker.ts     # Suivi avancement
│   │   │
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind.config.js
│   │
│   └── regie/                              # APP 3 - Régie immobilière
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── index.css
│       │   │
│       │   ├── entities/                   # Entités MÉTIER Régie
│       │   │   ├── immeuble/
│       │   │   │   ├── types.ts            # Immeuble, ObjetLocatif
│       │   │   │   ├── api.ts
│       │   │   │   └── hooks.ts
│       │   │   ├── locataire/
│       │   │   │   ├── types.ts            # Locataire, Bail
│       │   │   │   ├── api.ts
│       │   │   │   └── hooks.ts
│       │   │   ├── bail/
│       │   │   ├── charge/
│       │   │   ├── contentieux/
│       │   │   └── index.ts
│       │   │
│       │   ├── features/
│       │   │   ├── dashboard/
│       │   │   ├── immeubles/
│       │   │   │   ├── components/
│       │   │   │   │   ├── ImmeubleCard.tsx
│       │   │   │   │   ├── ImmeubleForm.tsx
│       │   │   │   │   └── ObjetsLocatifsList.tsx
│       │   │   │   └── hooks/
│       │   │   ├── locataires/
│       │   │   ├── baux/
│       │   │   ├── charges/
│       │   │   ├── contentieux/
│       │   │   ├── comptabilite/
│       │   │   └── documents/
│       │   │
│       │   ├── pages/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Immeubles.tsx
│       │   │   ├── ImmeubleDetail.tsx
│       │   │   ├── Locataires.tsx
│       │   │   ├── Baux.tsx
│       │   │   ├── Charges.tsx
│       │   │   ├── Contentieux.tsx
│       │   │   ├── Comptabilite.tsx
│       │   │   └── Settings.tsx
│       │   │
│       │   ├── layouts/
│       │   │   └── RegieLayout.tsx
│       │   │
│       │   └── lib/
│       │       ├── loyer-calculator.ts     # Calculs de loyers
│       │       ├── charges-repartition.ts  # Répartition charges
│       │       └── contentieux-workflow.ts # Workflow contentieux
│       │
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── tailwind.config.js
│
├── packages/
│   │
│   ├── ui/                                 # Design System (TECHNIQUE)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── form/                   # Button, Input, Select...
│   │   │   │   ├── display/               # Badge, Card, Avatar...
│   │   │   │   ├── data/                  # Table, DataGrid...
│   │   │   │   ├── feedback/              # Toast, Skeleton, Spinner...
│   │   │   │   ├── overlay/               # Modal, SidePanel, Dropdown...
│   │   │   │   └── navigation/            # Tabs, Breadcrumb...
│   │   │   ├── layouts/
│   │   │   │   └── PageShell.tsx
│   │   │   ├── tokens/
│   │   │   │   └── colors.ts              # Design tokens
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── auth/                               # Auth Supabase (TECHNIQUE)
│   │   ├── src/
│   │   │   ├── client.ts                  # createSupabaseClient
│   │   │   ├── guards/
│   │   │   │   └── AuthGuard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useSession.ts
│   │   │   │   └── useUser.ts
│   │   │   ├── providers/
│   │   │   │   └── AuthProvider.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── core/                               # Providers techniques
│   │   ├── src/
│   │   │   ├── contexts/
│   │   │   │   ├── ThemeProvider.tsx
│   │   │   │   └── OrganizationProvider.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDebounce.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   ├── useMediaQuery.ts
│   │   │   │   └── useClickOutside.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared-utils/                       # Utilitaires techniques
│   │   ├── src/
│   │   │   ├── format/
│   │   │   │   ├── date.ts
│   │   │   │   ├── currency.ts
│   │   │   │   └── number.ts
│   │   │   ├── validation/
│   │   │   │   ├── email.ts
│   │   │   │   ├── phone.ts
│   │   │   │   └── swiss.ts
│   │   │   ├── storage/
│   │   │   │   └── local-storage.ts
│   │   │   ├── http/
│   │   │   │   └── fetch-api.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── i18n/                               # Internationalisation
│   │   ├── src/
│   │   │   ├── config.ts
│   │   │   ├── locales/
│   │   │   │   ├── fr/
│   │   │   │   ├── de/
│   │   │   │   ├── en/
│   │   │   │   └── it/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                             # Configurations partagées
│       ├── eslint/
│       │   └── index.js
│       ├── typescript/
│       │   └── base.json
│       ├── tailwind/
│       │   └── preset.js
│       └── package.json
│
├── supabase/
│   ├── migrations/                         # Migrations DB
│   │   ├── 001_identity_core.sql          # Shared: users, orgs, roles
│   │   ├── 002_promoteur_projects.sql     # Domaine Promoteur
│   │   ├── 003_promoteur_crm.sql
│   │   ├── 004_promoteur_finance.sql
│   │   ├── 100_ppe_coproprietes.sql       # Domaine PPE (100-199)
│   │   ├── 101_ppe_assemblees.sql
│   │   ├── 102_ppe_charges.sql
│   │   ├── 200_regie_immeubles.sql        # Domaine Régie (200-299)
│   │   ├── 201_regie_baux.sql
│   │   └── 202_regie_charges.sql
│   ├── seed/
│   │   ├── demo-promoteur.sql
│   │   ├── demo-ppe.sql
│   │   └── demo-regie.sql
│   └── config.toml
│
├── docs/
│   ├── ARCHITECTURE.md                     # Ce document
│   ├── CONTRIBUTING.md
│   ├── apps/
│   │   ├── ppe-admin.md
│   │   ├── promoteur.md
│   │   └── regie.md
│   └── packages/
│       └── ui.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Lint, typecheck, test
│       ├── deploy-ppe-admin.yml            # Deploy app PPE
│       ├── deploy-promoteur.yml            # Deploy app Promoteur
│       └── deploy-regie.yml                # Deploy app Régie
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

### 3.2 Rôle de chaque dossier

| Dossier | Rôle | Contenu |
|---------|------|---------|
| `apps/ppe-admin` | Application PPE Admin | Gestion copropriétés, AG, charges PPE |
| `apps/promoteur` | Application Promoteur | Projets immobiliers neufs, ventes, CRM |
| `apps/regie` | Application Régie | Gestion locative, baux, contentieux |
| `apps/*/entities` | Entités métier par app | Types, API, hooks spécifiques au domaine |
| `apps/*/features` | Features par app | Composants, hooks de chaque module |
| `apps/*/pages` | Pages/Routes par app | Pages React Router |
| `apps/*/lib` | Utilitaires métier | Calculs spécifiques au domaine |
| `packages/ui` | Design system | Composants UI génériques |
| `packages/auth` | Authentification | Supabase auth, guards, hooks |
| `packages/core` | Core technique | Theme, providers techniques |
| `packages/shared-utils` | Utilitaires | Formatters, validators génériques |
| `packages/i18n` | Traductions | Config i18next, locales |
| `packages/config` | Configurations | ESLint, TypeScript, Tailwind |
| `supabase/migrations` | Schémas DB | Migrations SQL par domaine |
| `docs` | Documentation | Architecture, guides |

### 3.3 Règle d'imports (ESLint)

```javascript
// .eslintrc.js (à ajouter dans chaque app)
module.exports = {
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        // INTERDIT: import depuis une autre app
        {
          group: ['@realpro/promoteur/*', '../../../promoteur/*'],
          message: 'Import interdit depuis app promoteur. Utiliser un package partagé.'
        },
        {
          group: ['@realpro/regie/*', '../../../regie/*'],
          message: 'Import interdit depuis app régie. Utiliser un package partagé.'
        },
        {
          group: ['@realpro/ppe-admin/*', '../../../ppe-admin/*'],
          message: 'Import interdit depuis app ppe-admin. Utiliser un package partagé.'
        }
      ]
    }]
  }
}
```

---

## 4. Règles de frontières

### 4.1 Shared AUTORISÉ (technique uniquement)

| Package | Contenu autorisé | Exemple |
|---------|------------------|---------|
| `@realpro/ui` | Composants UI génériques | Button, Modal, Table, Card |
| `@realpro/auth` | Auth Supabase | useAuth, AuthGuard, AuthProvider |
| `@realpro/core` | Providers techniques | ThemeProvider, useDebounce |
| `@realpro/shared-utils` | Formatters, validators | formatCurrency, isValidEmail |
| `@realpro/i18n` | Config i18next | useTranslation, locales |
| `@realpro/config` | Configs dev tools | ESLint, TypeScript, Tailwind |

### 4.2 Shared INTERDIT (métier)

| Type | Exemple interdit | Raison |
|------|------------------|--------|
| Règles métier PPE | Calcul quotes-parts millièmes | Spécifique PPE |
| Règles métier Régie | Calcul augmentation loyer | Spécifique Régie |
| Règles métier Promo | Pipeline vente, CFC | Spécifique Promoteur |
| Entités métier communes | `SharedProperty` commun | Chaque app a ses propres entités |
| Services domaine | `PropertyService` universel | Pas de service métier partagé |
| Hooks métier | `useRentCalculation` partagé | Doit rester dans l'app |

### 4.3 Matrice de dépendances

```
                    ┌─────────┬─────────┬─────────┬────────┬──────┬───────────────┬──────┬────────┐
                    │ppe-admin│promoteur│  regie  │   ui   │ auth │shared-utils   │ core │  i18n  │
┌───────────────────┼─────────┼─────────┼─────────┼────────┼──────┼───────────────┼──────┼────────┤
│ apps/ppe-admin    │    -    │    ❌   │    ❌   │   ✅   │  ✅  │      ✅       │  ✅  │   ✅   │
│ apps/promoteur    │    ❌   │    -    │    ❌   │   ✅   │  ✅  │      ✅       │  ✅  │   ✅   │
│ apps/regie        │    ❌   │    ❌   │    -    │   ✅   │  ✅  │      ✅       │  ✅  │   ✅   │
│ packages/ui       │    ❌   │    ❌   │    ❌   │   -    │  ❌  │      ❌       │  ❌  │   ❌   │
│ packages/auth     │    ❌   │    ❌   │    ❌   │   ❌   │  -   │      ✅       │  ❌  │   ❌   │
│ packages/core     │    ❌   │    ❌   │    ❌   │   ❌   │  ❌  │      ✅       │  -   │   ❌   │
└───────────────────┴─────────┴─────────┴─────────┴────────┴──────┴───────────────┴──────┴────────┘

✅ = Import autorisé
❌ = Import INTERDIT
```

### 4.4 Convention de nommage des tables DB

| Domaine | Préfixe | Exemple |
|---------|---------|---------|
| Shared (technique) | aucun | `users`, `organizations`, `audit_logs` |
| PPE Admin | `ppe_` | `ppe_coproprietes`, `ppe_lots`, `ppe_ag` |
| Promoteur | aucun (legacy) | `projects`, `lots`, `prospects` |
| Régie | `reg_` | `reg_immeubles`, `reg_baux`, `reg_locataires` |

---

## 5. Arborescence MENUS/MODULES UI

### 5.1 PPE-ADMIN - Administrateur de PPE

> Inspiré des best practices des logiciels suisses de gestion de copropriété

```
PPE-01  TABLEAU DE BORD
        ├─ Objectif: Vue d'ensemble de toutes les copropriétés gérées
        ├─ Écrans:
        │   ├─ PPE-01-A: Dashboard KPIs (nb copropriétés, AG à venir, charges impayées)
        │   ├─ PPE-01-B: Alertes et notifications
        │   └─ PPE-01-C: Calendrier des AG
        ├─ Actions: Accès rapide copropriété, créer rappel, exporter rapport
        └─ Objets: Copropriété, AG, Alerte

PPE-02  COPROPRIÉTÉS
        ├─ Objectif: Gérer le portefeuille d'immeubles en PPE
        ├─ Écrans:
        │   ├─ PPE-02-A: Liste des copropriétés (grid/table)
        │   ├─ PPE-02-B: Fiche copropriété (info, lots, documents)
        │   ├─ PPE-02-C: Création/édition copropriété
        │   ├─ PPE-02-D: Liste des lots (appartements, parkings, caves)
        │   └─ PPE-02-E: Fiche lot détaillée
        ├─ Actions: Créer, modifier, archiver copropriété; ajouter lot
        └─ Objets: Copropriété, Lot PPE, Immeuble

PPE-03  COPROPRIÉTAIRES
        ├─ Objectif: Gérer les propriétaires et leurs quotes-parts
        ├─ Écrans:
        │   ├─ PPE-03-A: Liste des copropriétaires (par immeuble)
        │   ├─ PPE-03-B: Fiche copropriétaire
        │   ├─ PPE-03-C: Historique des paiements
        │   └─ PPE-03-D: Mutations (ventes, successions)
        ├─ Actions: Ajouter copropriétaire, enregistrer mutation, envoyer courrier
        └─ Objets: Copropriétaire, Quote-part, Lot, Mutation

PPE-04  ASSEMBLÉES GÉNÉRALES
        ├─ Objectif: Planifier, préparer et documenter les AG
        ├─ Écrans:
        │   ├─ PPE-04-A: Calendrier des AG
        │   ├─ PPE-04-B: Planification AG (date, lieu, ordre du jour)
        │   ├─ PPE-04-C: Ordre du jour détaillé
        │   ├─ PPE-04-D: Gestion des présences/procurations
        │   ├─ PPE-04-E: Votes et résultats
        │   └─ PPE-04-F: Procès-verbal
        ├─ Actions: Créer AG, envoyer convocations, enregistrer votes, générer PV
        └─ Objets: AG, Point ordre du jour, Vote, Procuration, PV

PPE-05  DÉCOMPTES DE CHARGES
        ├─ Objectif: Établir et répartir les charges annuelles
        ├─ Écrans:
        │   ├─ PPE-05-A: Liste des décomptes (par année/copropriété)
        │   ├─ PPE-05-B: Création décompte annuel
        │   ├─ PPE-05-C: Saisie des charges (catégories, montants)
        │   ├─ PPE-05-D: Répartition par millièmes
        │   ├─ PPE-05-E: Aperçu par copropriétaire
        │   └─ PPE-05-F: Envoi et suivi des décomptes
        ├─ Actions: Créer décompte, répartir, valider, envoyer, relancer
        └─ Objets: Décompte, Charge, Millième, Facture

PPE-06  FONDS DE RÉNOVATION
        ├─ Objectif: Gérer les fonds de réserve pour travaux
        ├─ Écrans:
        │   ├─ PPE-06-A: Situation des fonds par copropriété
        │   ├─ PPE-06-B: Historique des mouvements
        │   ├─ PPE-06-C: Planification des travaux
        │   └─ PPE-06-D: Simulation de cotisations
        ├─ Actions: Enregistrer versement, planifier travaux, ajuster cotisations
        └─ Objets: Fonds, Versement, Travaux planifiés

PPE-07  COMPTABILITÉ PPE
        ├─ Objectif: Suivi comptable de la copropriété
        ├─ Écrans:
        │   ├─ PPE-07-A: Journal des écritures
        │   ├─ PPE-07-B: Bilan et compte de résultat
        │   ├─ PPE-07-C: Suivi des paiements copropriétaires
        │   ├─ PPE-07-D: Rappels et contentieux
        │   └─ PPE-07-E: Rapprochement bancaire
        ├─ Actions: Saisir écriture, générer rappel, exporter comptabilité
        └─ Objets: Écriture, Compte, Paiement, Rappel

PPE-08  DOCUMENTS
        ├─ Objectif: Gestion documentaire centralisée
        ├─ Écrans:
        │   ├─ PPE-08-A: Arborescence documents par copropriété
        │   ├─ PPE-08-B: Upload et classement
        │   ├─ PPE-08-C: Recherche full-text
        │   └─ PPE-08-D: Partage avec copropriétaires
        ├─ Actions: Upload, classer, partager, archiver
        └─ Objets: Document, Dossier, Version

PPE-09  PARAMÈTRES
        ├─ Objectif: Configuration de l'application
        ├─ Écrans:
        │   ├─ PPE-09-A: Profil utilisateur
        │   ├─ PPE-09-B: Paramètres organisation
        │   ├─ PPE-09-C: Modèles de documents
        │   └─ PPE-09-D: Gestion des accès
        ├─ Actions: Modifier profil, gérer templates, inviter utilisateurs
        └─ Objets: Utilisateur, Organisation, Template
```

### 5.2 PROMOTEUR - Promotion immobilière

> Basé sur l'existant + améliorations progressives

```
PRO-01  TABLEAU DE BORD
        ├─ Objectif: Vue d'ensemble des projets et KPIs ventes
        ├─ Écrans:
        │   ├─ PRO-01-A: Dashboard KPIs (projets actifs, lots vendus, CA) ✅ EXISTANT
        │   ├─ PRO-01-B: Pipeline commercial (prospects, réservations)
        │   ├─ PRO-01-C: Alertes (délais, paiements en retard)
        │   └─ PRO-01-D: Avancement construction
        ├─ Actions: Accès rapide projet, créer prospect, voir pipeline
        └─ Objets: Projet, Lot, Prospect, Réservation

PRO-02  PROJETS
        ├─ Objectif: Gestion complète des projets immobiliers neufs
        ├─ Écrans:
        │   ├─ PRO-02-A: Liste projets avec filtres ✅ EXISTANT
        │   ├─ PRO-02-B: Fiche projet détaillée ✅ EXISTANT (à enrichir)
        │   ├─ PRO-02-C: Création/édition projet
        │   ├─ PRO-02-D: Configuration bâtiments/entrées/étages
        │   ├─ PRO-02-E: Grille des lots (vue matricielle)
        │   └─ PRO-02-F: Configurateur de lots
        ├─ Actions: Créer projet, ajouter bâtiment, configurer lots, dupliquer
        └─ Objets: Projet, Bâtiment, Entrée, Étage, Lot

PRO-03  LOTS / UNITÉS
        ├─ Objectif: Gestion détaillée des lots à vendre
        ├─ Écrans:
        │   ├─ PRO-03-A: Liste lots (par projet, filtrable)
        │   ├─ PRO-03-B: Fiche lot (surfaces, prix, statut)
        │   ├─ PRO-03-C: Plans et documents du lot
        │   ├─ PRO-03-D: Historique du lot (visites, offres)
        │   └─ PRO-03-E: Comparateur de lots
        ├─ Actions: Modifier lot, changer statut, attacher documents
        └─ Objets: Lot, Surface, Document, Historique

PRO-04  CRM / PROSPECTS
        ├─ Objectif: Suivi commercial des prospects
        ├─ Écrans:
        │   ├─ PRO-04-A: Liste prospects (kanban ou table)
        │   ├─ PRO-04-B: Fiche prospect détaillée
        │   ├─ PRO-04-C: Historique interactions
        │   ├─ PRO-04-D: Planification visites
        │   └─ PRO-04-E: Conversion en réservation
        ├─ Actions: Créer prospect, planifier visite, qualifier, convertir
        └─ Objets: Prospect, Visite, Interaction, Source

PRO-05  RÉSERVATIONS / VENTES
        ├─ Objectif: Gérer le processus de vente
        ├─ Écrans:
        │   ├─ PRO-05-A: Pipeline réservations
        │   ├─ PRO-05-B: Fiche réservation
        │   ├─ PRO-05-C: Dossier acheteur (documents requis)
        │   ├─ PRO-05-D: Suivi financement
        │   ├─ PRO-05-E: Échéancier paiements
        │   └─ PRO-05-F: Signature acte notarié
        ├─ Actions: Créer réservation, collecter documents, valider financement
        └─ Objets: Réservation, Acheteur, Dossier, Paiement

PRO-06  BUDGET / CFC
        ├─ Objectif: Gestion budgétaire selon code CFC
        ├─ Écrans:
        │   ├─ PRO-06-A: Vue budget par projet
        │   ├─ PRO-06-B: Détail postes CFC
        │   ├─ PRO-06-C: Suivi engagé vs réalisé
        │   ├─ PRO-06-D: Analyse des écarts
        │   └─ PRO-06-E: Prévisions et simulations
        ├─ Actions: Créer budget, ajouter poste, enregistrer engagement
        └─ Objets: Budget, Poste CFC, Engagement, Prévision

PRO-07  CONTRATS / FOURNISSEURS
        ├─ Objectif: Gestion des contrats entreprises
        ├─ Écrans:
        │   ├─ PRO-07-A: Liste contrats par projet
        │   ├─ PRO-07-B: Fiche contrat
        │   ├─ PRO-07-C: Annuaire fournisseurs
        │   ├─ PRO-07-D: Suivi factures
        │   └─ PRO-07-E: Situations de travaux
        ├─ Actions: Créer contrat, enregistrer facture, valider situation
        └─ Objets: Contrat, Fournisseur, Facture, Situation

PRO-08  SOUMISSIONS / APPELS D'OFFRES
        ├─ Objectif: Gérer les appels d'offres entreprises
        ├─ Écrans:
        │   ├─ PRO-08-A: Liste soumissions
        │   ├─ PRO-08-B: Création appel d'offres
        │   ├─ PRO-08-C: Invitations entreprises
        │   ├─ PRO-08-D: Comparatif offres
        │   └─ PRO-08-E: Adjudication
        ├─ Actions: Créer soumission, inviter, comparer, adjuger
        └─ Objets: Soumission, Offre, Invitation, Adjudication

PRO-09  CONSTRUCTION / AVANCEMENT
        ├─ Objectif: Suivi de l'avancement chantier
        ├─ Écrans:
        │   ├─ PRO-09-A: Timeline des phases
        │   ├─ PRO-09-B: Détail phase (milestones)
        │   ├─ PRO-09-C: Journal de chantier
        │   ├─ PRO-09-D: Photos et rapports
        │   └─ PRO-09-E: Planification livraisons
        ├─ Actions: Mettre à jour avancement, ajouter photo, signaler retard
        └─ Objets: Phase, Milestone, Journal, Photo

PRO-10  CHOIX ACQUÉREURS
        ├─ Objectif: Gestion des options de personnalisation
        ├─ Écrans:
        │   ├─ PRO-10-A: Catalogue matériaux par projet
        │   ├─ PRO-10-B: Choix par acquéreur
        │   ├─ PRO-10-C: Récapitulatif plus-values
        │   └─ PRO-10-D: Demandes de modifications
        ├─ Actions: Configurer catalogue, enregistrer choix, valider modification
        └─ Objets: Catégorie, Option matériau, Choix, Modification

PRO-11  NOTAIRE / ACTES
        ├─ Objectif: Coordination avec le notaire
        ├─ Écrans:
        │   ├─ PRO-11-A: Dossiers notaire en cours
        │   ├─ PRO-11-B: Checklist documents
        │   ├─ PRO-11-C: Versions des actes
        │   ├─ PRO-11-D: Planning signatures
        │   └─ PRO-11-E: Communication notaire
        ├─ Actions: Transmettre dossier, valider acte, planifier signature
        └─ Objets: Dossier notaire, Acte, Document, RDV

PRO-12  DOCUMENTS
        ├─ Objectif: GED du projet
        ├─ Écrans:
        │   ├─ PRO-12-A: Arborescence par projet
        │   ├─ PRO-12-B: Upload et versioning
        │   ├─ PRO-12-C: Partage avec intervenants
        │   └─ PRO-12-D: Recherche
        ├─ Actions: Upload, versionner, partager, archiver
        └─ Objets: Document, Version, Dossier, Partage

PRO-13  PARAMÈTRES
        ├─ Objectif: Configuration
        ├─ Écrans:
        │   ├─ PRO-13-A: Profil
        │   ├─ PRO-13-B: Équipe projet
        │   ├─ PRO-13-C: Templates
        │   └─ PRO-13-D: Intégrations
        ├─ Actions: Gérer équipe, configurer templates
        └─ Objets: Utilisateur, Rôle, Template
```

### 5.3 RÉGIE - Gestion locative

> Inspiré des best practices des logiciels suisses de régie immobilière

```
REG-01  TABLEAU DE BORD
        ├─ Objectif: Vue d'ensemble du portefeuille locatif
        ├─ Écrans:
        │   ├─ REG-01-A: KPIs (taux occupation, loyers encaissés, impayés)
        │   ├─ REG-01-B: Alertes (fins de bail, retards, contentieux)
        │   ├─ REG-01-C: Échéances du mois
        │   └─ REG-01-D: Objets vacants
        ├─ Actions: Accès rapide immeuble, créer rappel, voir vacances
        └─ Objets: Immeuble, Objet locatif, Alerte, Bail

REG-02  IMMEUBLES
        ├─ Objectif: Gérer le patrimoine immobilier
        ├─ Écrans:
        │   ├─ REG-02-A: Liste des immeubles
        │   ├─ REG-02-B: Fiche immeuble (info, photo, propriétaire)
        │   ├─ REG-02-C: Liste des objets locatifs
        │   ├─ REG-02-D: Plan de situation
        │   └─ REG-02-E: Historique travaux
        ├─ Actions: Créer immeuble, ajouter objet, planifier travaux
        └─ Objets: Immeuble, Objet locatif, Propriétaire, Travaux

REG-03  OBJETS LOCATIFS
        ├─ Objectif: Gestion détaillée des objets à louer
        ├─ Écrans:
        │   ├─ REG-03-A: Liste objets (appartements, parkings, commerces)
        │   ├─ REG-03-B: Fiche objet (surfaces, équipements, loyer)
        │   ├─ REG-03-C: Historique des baux
        │   ├─ REG-03-D: État des lieux
        │   └─ REG-03-E: Documents de l'objet
        ├─ Actions: Créer objet, modifier loyer, état des lieux
        └─ Objets: Objet locatif, Équipement, État des lieux

REG-04  LOCATAIRES
        ├─ Objectif: Gestion des locataires
        ├─ Écrans:
        │   ├─ REG-04-A: Liste des locataires
        │   ├─ REG-04-B: Fiche locataire
        │   ├─ REG-04-C: Historique des locations
        │   ├─ REG-04-D: Compte locataire (solde)
        │   └─ REG-04-E: Correspondances
        ├─ Actions: Créer locataire, envoyer courrier, consulter solde
        └─ Objets: Locataire, Compte, Correspondance

REG-05  BAUX
        ├─ Objectif: Gestion des contrats de bail
        ├─ Écrans:
        │   ├─ REG-05-A: Liste des baux actifs
        │   ├─ REG-05-B: Création de bail
        │   ├─ REG-05-C: Fiche bail (conditions, durée, loyer)
        │   ├─ REG-05-D: Avenants et modifications
        │   ├─ REG-05-E: Renouvellement / résiliation
        │   └─ REG-05-F: Génération contrat PDF
        ├─ Actions: Créer bail, renouveler, résilier, générer contrat
        └─ Objets: Bail, Avenant, Résiliation, Contrat

REG-06  LOYERS ET ENCAISSEMENTS
        ├─ Objectif: Facturation et suivi des paiements
        ├─ Écrans:
        │   ├─ REG-06-A: Génération des avis de loyer
        │   ├─ REG-06-B: Suivi des encaissements
        │   ├─ REG-06-C: Rappels automatiques
        │   ├─ REG-06-D: Historique paiements par locataire
        │   └─ REG-06-E: Export comptable
        ├─ Actions: Générer loyers, enregistrer paiement, envoyer rappel
        └─ Objets: Avis de loyer, Paiement, Rappel

REG-07  DÉCOMPTES DE CHARGES
        ├─ Objectif: Répartition des charges locatives
        ├─ Écrans:
        │   ├─ REG-07-A: Décomptes par immeuble/année
        │   ├─ REG-07-B: Saisie des charges (eau, chauffage, etc.)
        │   ├─ REG-07-C: Clés de répartition
        │   ├─ REG-07-D: Calcul acomptes vs réel
        │   ├─ REG-07-E: Décompte individuel par locataire
        │   └─ REG-07-F: Envoi des décomptes
        ├─ Actions: Créer décompte, saisir charges, répartir, envoyer
        └─ Objets: Décompte, Charge, Clé répartition, Acompte

REG-08  CONTENTIEUX
        ├─ Objectif: Gestion des impayés et procédures
        ├─ Écrans:
        │   ├─ REG-08-A: Liste des dossiers contentieux
        │   ├─ REG-08-B: Fiche dossier (historique, montant dû)
        │   ├─ REG-08-C: Workflow procédure (rappels → mise en demeure → poursuites)
        │   ├─ REG-08-D: Génération des courriers types
        │   └─ REG-08-E: Suivi des audiences/jugements
        ├─ Actions: Ouvrir dossier, envoyer mise en demeure, suivre procédure
        └─ Objets: Dossier contentieux, Courrier, Procédure, Audience

REG-09  MAINTENANCE / TRAVAUX
        ├─ Objectif: Gestion des travaux et interventions
        ├─ Écrans:
        │   ├─ REG-09-A: Liste des tickets/demandes
        │   ├─ REG-09-B: Création demande intervention
        │   ├─ REG-09-C: Suivi des artisans
        │   ├─ REG-09-D: Planning interventions
        │   └─ REG-09-E: Historique par objet
        ├─ Actions: Créer ticket, assigner artisan, clôturer intervention
        └─ Objets: Ticket, Intervention, Artisan, Devis

REG-10  COMPTABILITÉ IMMEUBLE
        ├─ Objectif: Comptabilité par immeuble
        ├─ Écrans:
        │   ├─ REG-10-A: Journal des opérations
        │   ├─ REG-10-B: Compte de gérance
        │   ├─ REG-10-C: Rapport au propriétaire
        │   ├─ REG-10-D: Rapprochement bancaire
        │   └─ REG-10-E: TVA et déclarations
        ├─ Actions: Saisir opération, générer rapport, exporter
        └─ Objets: Opération, Compte, Rapport

REG-11  DOCUMENTS
        ├─ Objectif: GED de la régie
        ├─ Écrans:
        │   ├─ REG-11-A: Arborescence par immeuble
        │   ├─ REG-11-B: Upload et classement
        │   ├─ REG-11-C: Templates de documents
        │   └─ REG-11-D: Recherche
        ├─ Actions: Upload, générer depuis template, archiver
        └─ Objets: Document, Template, Dossier

REG-12  PARAMÈTRES
        ├─ Objectif: Configuration régie
        ├─ Écrans:
        │   ├─ REG-12-A: Profil utilisateur
        │   ├─ REG-12-B: Paramètres organisation
        │   ├─ REG-12-C: Modèles de courriers
        │   ├─ REG-12-D: Clés de répartition types
        │   └─ REG-12-E: Gestion des accès
        ├─ Actions: Configurer modèles, gérer équipe
        └─ Objets: Utilisateur, Organisation, Modèle
```

---

## 6. Routing & Déploiement

### 6.1 Options de routing

#### Option A: Routes par préfixe (même domaine) ⭐ RECOMMANDÉE

```
https://app.realpro.ch/ppe/*        → PPE Admin
https://app.realpro.ch/promoteur/*  → Promoteur
https://app.realpro.ch/regie/*      → Régie
https://app.realpro.ch/            → Landing/Login
```

**Avantages:**
- Un seul certificat SSL
- Cookies partagés naturellement (même domaine)
- SSO simplifié (même origine)
- Un seul projet Vercel/Netlify

**Inconvénients:**
- Routing plus complexe (reverse proxy ou framework)
- Builds potentiellement couplés

#### Option B: Sous-domaines

```
https://ppe.realpro.ch/*       → PPE Admin
https://promoteur.realpro.ch/* → Promoteur
https://regie.realpro.ch/*     → Régie
https://realpro.ch/            → Landing/Login
```

**Avantages:**
- Isolation totale des apps
- Déploiements 100% indépendants
- Scaling indépendant

**Inconvénients:**
- Certificat wildcard ou 3 certificats
- CORS à configurer
- Cookies: `domain=.realpro.ch` requis

### 6.2 Choix recommandé: Option A (préfixes)

**Justification:**
- Plus simple pour le SSO Supabase
- Pas de configuration CORS
- Déploiement simplifié
- Releases séparées possibles avec Turbo `--filter`

### 6.3 Configuration Vercel (recommandée)

```json
// vercel.json (root)
{
  "rewrites": [
    { "source": "/ppe/:path*", "destination": "/apps/ppe-admin/:path*" },
    { "source": "/promoteur/:path*", "destination": "/apps/promoteur/:path*" },
    { "source": "/regie/:path*", "destination": "/apps/regie/:path*" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### 6.4 Configuration pour releases séparées

```yaml
# .github/workflows/deploy-promoteur.yml
name: Deploy Promoteur
on:
  push:
    paths:
      - 'apps/promoteur/**'
      - 'packages/**'
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run build --filter=@realpro/promoteur...
      - run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 6.5 Impact Auth/Cookies

| Aspect | Configuration |
|--------|---------------|
| Supabase URL | `https://xxx.supabase.co` (unique) |
| Cookie domain | Automatique (même origine) |
| Session | Partagée entre les 3 apps |
| Logout | Déconnexion globale |
| CORS | Non requis |

---

## 7. Plan de migration & Risques

### 7.1 Plan de migration en 8 étapes

#### Étape 1: Restructuration packages/entities (1 jour)

**Objectif:** Séparer les types métier par domaine

**Fichiers à modifier:**
```
packages/entities/src/
├── shared/                 # Types vraiment partagés
│   ├── user.ts            # User, UserWithRole
│   └── organization.ts    # Organization
├── promoteur/             # À GARDER (existant)
│   ├── project.ts
│   ├── lot.ts
│   └── index.ts
└── index.ts               # Export sélectif
```

**Actions:**
1. Créer `packages/entities/src/shared/`
2. Déplacer User, Organization vers shared
3. Renommer exports dans index.ts
4. Mettre à jour imports dans apps/promoteur

#### Étape 2: Créer entities internes par app (1-2 jours)

**Objectif:** Chaque app a ses propres types métier

**Créer:**
```
apps/ppe-admin/src/entities/
apps/regie/src/entities/
```

**Template entity:**
```typescript
// apps/ppe-admin/src/entities/copropriete/types.ts
export interface PPECopropriete {
  id: string;
  organization_id: string;
  nom: string;
  adresse: string;
  nb_lots: number;
  // ... spécifique PPE
}
```

#### Étape 3: Créer migrations DB par domaine (2-3 jours)

**Objectif:** Tables préfixées par domaine

**Créer:**
```sql
-- supabase/migrations/100_ppe_coproprietes.sql
CREATE TABLE ppe_coproprietes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  nom VARCHAR(255) NOT NULL,
  adresse TEXT,
  code_postal VARCHAR(10),
  ville VARCHAR(100),
  canton VARCHAR(2),
  nb_lots_total INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE ppe_coproprietes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_access" ON ppe_coproprietes
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid()
  ));
```

#### Étape 4: Implémenter pages PPE-Admin (5-7 jours)

**Priorité V1:**
1. Dashboard (PPE-01)
2. Copropriétés liste + détail (PPE-02)
3. Copropriétaires (PPE-03)
4. Assemblées générales (PPE-04)
5. Décomptes de charges (PPE-05)

**Structure:**
```
apps/ppe-admin/src/
├── pages/
│   ├── Dashboard.tsx
│   ├── Coproprietes.tsx
│   ├── CoproprieteDetail.tsx
│   ├── Coproprietaires.tsx
│   └── Assemblees.tsx
├── features/
│   └── [par module]
└── entities/
    └── [par domaine]
```

#### Étape 5: Implémenter pages Régie (5-7 jours)

**Priorité V1:**
1. Dashboard (REG-01)
2. Immeubles liste + détail (REG-02)
3. Objets locatifs (REG-03)
4. Locataires (REG-04)
5. Baux (REG-05)
6. Loyers/encaissements (REG-06)

#### Étape 6: Enrichir Promoteur (3-5 jours)

**Priorité:**
1. Connecter Dashboard à Supabase (remplacer mock data)
2. Implémenter tabs ProjectDetail (Unités, Documents)
3. Ajouter page Prospects (PRO-04)
4. Ajouter page Budget/CFC (PRO-06)

#### Étape 7: Ajouter règles ESLint (1 jour)

**Fichier:** `eslint-rules/no-cross-app-imports.js`

```javascript
module.exports = {
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        '@realpro/promoteur/*',
        '@realpro/regie/*',
        '@realpro/ppe-admin/*'
      ]
    }]
  }
};
```

#### Étape 8: CI/CD séparé (1 jour)

**Créer:**
- `.github/workflows/deploy-ppe-admin.yml`
- `.github/workflows/deploy-promoteur.yml`
- `.github/workflows/deploy-regie.yml`

### 7.2 Risques et mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Régression lors restructuration entities | Moyenne | Élevé | Tests TypeScript stricts, CI/typecheck |
| Imports croisés involontaires | Moyenne | Moyen | ESLint rules, PR review |
| Schéma DB trop rigide | Faible | Moyen | Préfixes flexibles, migrations séparées |
| Temps de build croissant | Moyenne | Faible | Turborepo remote caching |
| Déploiement couplé | Faible | Moyen | Workflows GH Actions par app |
| Complexité SSO entre apps | Faible | Faible | Même domaine, cookies partagés |

### 7.3 Garde-fous recommandés

#### TypeScript strict

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### ESLint boundaries

```javascript
// apps/*/eslint.config.js
import boundaries from 'eslint-plugin-boundaries';

export default [
  {
    plugins: { boundaries },
    rules: {
      'boundaries/element-types': ['error', {
        default: 'disallow',
        rules: [
          { from: 'app', allow: ['package'] },
          { from: 'package', allow: ['package'] }
        ]
      }]
    }
  }
];
```

#### Tests minimaux par app

```typescript
// apps/promoteur/src/__tests__/smoke.test.tsx
import { render } from '@testing-library/react';
import App from '../App';

describe('Promoteur App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
```

### 7.4 Checklist de validation

- [ ] Aucun import `@realpro/promoteur` dans apps/regie
- [ ] Aucun import `@realpro/regie` dans apps/ppe-admin
- [ ] Aucun import `@realpro/ppe-admin` dans apps/promoteur
- [ ] Tables PPE préfixées `ppe_`
- [ ] Tables Régie préfixées `reg_`
- [ ] RLS activé sur toutes les tables
- [ ] Chaque app build indépendamment (`turbo build --filter=@realpro/[app]`)
- [ ] TypeScript strict sans erreurs
- [ ] ESLint sans warnings
- [ ] Smoke tests passent

---

## Annexes

### A. Glossaire

| Terme | Définition |
|-------|------------|
| PPE | Propriété par étages (copropriété suisse) |
| CFC | Code des frais de construction (budget) |
| Millièmes | Quote-part de propriété en PPE |
| AG | Assemblée générale des copropriétaires |
| Régie | Société de gestion immobilière |
| Bail | Contrat de location |
| EG | Entreprise générale (construction) |

### B. Ressources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

*Document généré le 2025-12-12 - Realpro Suite Architecture v1.0*
