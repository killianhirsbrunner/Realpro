# Architecture Realpro Suite - 3 Applications Indépendantes

> Document d'architecture pour la transformation de Realpro en suite de 3 applications distinctes.

---

## 1. DIAGNOSTIC DU REPO ACTUEL

### Stack Technique Identifiée

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Framework** | React + TypeScript | 18.3.1 / 5.5.3 |
| **Build Tool** | Vite | 5.4.2 |
| **Routing** | React Router DOM | 6.20.1 |
| **State Management** | Zustand | 4.5.7 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Backend/Auth** | Supabase (PostgreSQL + Auth + RLS) | 2.57.4 |
| **i18n** | i18next + react-i18next | 23.7.6 |
| **Forms** | react-hook-form | 7.68.0 |
| **Tables** | @tanstack/react-table | 8.21.3 |
| **Charts** | Recharts | 2.15.4 |
| **Icons** | lucide-react | 0.344.0 |

### Structure Actuelle (Diagnostic)

```
/src
├── App.tsx                    # Point d'entrée MONOLITHIQUE (400+ lignes, toutes routes)
├── main.tsx                   # Bootstrap React
├── index.css                  # Styles globaux
├── vite-env.d.ts
├── app/
│   └── routes/                # Tentative FSD, pas exploitée
├── components/                # 32 sous-dossiers, 150+ composants mélangés
│   ├── layout/                # AppShell, Sidebar, Topbar (partagés tous métiers)
│   ├── ui/                    # Design system (buttons, cards, modals...)
│   ├── crm/                   # Composants CRM
│   ├── finance/               # Composants Finance
│   ├── brokers/               # Composants Courtiers
│   ├── buyers/                # Composants Acheteurs
│   ├── ...
├── contexts/                  # ThemeContext, OrganizationContext (partagés)
├── entities/                  # Tentative FSD (lot, project, user)
├── hooks/                     # 40+ hooks métier (tous mélangés)
├── lib/
│   ├── auth.ts                # Auth Supabase
│   ├── permissions.ts         # RBAC (700+ lignes, tous rôles mélangés)
│   ├── supabase.ts            # Client Supabase
│   ├── modules/config.ts      # Config modules (navigation)
│   ├── i18n/                  # Traductions 8 locales
│   └── ...
├── pages/                     # 150+ pages, toutes dans un seul dossier
│   ├── admin/
│   ├── auth/
│   ├── buyer/
│   ├── legal/
│   ├── public/
│   ├── settings/
│   └── [150+ fichiers .tsx]   # Tout mélangé
└── shared/                    # FSD shared (ui, lib, config)
/supabase
├── migrations/                # 67 migrations SQL (DB unique partagée)
├── functions/                 # Edge functions
└── seed.sql                   # Données de test
```

### Points de Couplage Critiques (Bullets)

1. **App.tsx monolithique** : 150+ routes définies dans un seul fichier, aucune séparation métier
2. **Sidebar unique** : Navigation identique pour tous les utilisateurs/métiers
3. **RBAC centralisé** : `permissions.ts` mélange 10 rôles (promoter, broker, buyer, notary...) avec logique métier
4. **Base de données unifiée** : 67 migrations, schéma unique avec RLS multi-tenant par `organization_id`
5. **Hooks métier couplés** : 40+ hooks dans `/hooks/` sans séparation de domaine
6. **Pages non organisées** : 150+ fichiers dans `/pages/` sans structure métier
7. **Composants partagés par défaut** : Pas de frontière entre code technique et métier
8. **Context global** : `OrganizationContext` utilisé partout, couple toutes les features
9. **Routing plat** : `/projects`, `/broker`, `/buyer` dans le même router
10. **Aucun workspace/monorepo** : Package unique, impossible de déployer séparément
11. **Types partagés implicitement** : Pas de contrats d'interface entre domaines
12. **CSS global** : `index.css` et `tailwind.config.js` partagés sans scope

### Ce qui existe déjà (et peut être conservé)

| Catégorie | Éléments | Statut |
|-----------|----------|--------|
| **Auth/SSO** | Supabase Auth, AuthGuard, authHelpers | ✅ Réutilisable (à abstraire) |
| **Design System** | `/shared/ui/`, `/components/ui/` | ✅ À extraire en package |
| **i18n** | 8 locales (fr, de, en, it + CH variants) | ✅ À partager |
| **Theming** | ThemeContext, dark mode | ✅ À partager |
| **Utils techniques** | format.ts, date-fns, clsx | ✅ À partager |

### Ce qui est spécifique mais mélangé

| Métier | Éléments identifiés | Routes actuelles |
|--------|---------------------|------------------|
| **Promoteur** | PromoterDashboard, Projects*, CRM*, Finance*, Planning* | `/promoter`, `/projects/*` |
| **Courtier/Broker** | BrokerDashboard, BrokerLots, BrokerContracts | `/broker/*` |
| **Acheteur/Buyer** | BuyerMyLot, BuyerMaterials, BuyerPayments | `/buyer/*` |
| **Fournisseur** | SupplierShowrooms, SupplierAppointments | `/supplier/*` |
| **Admin** | SuperAdmin, Organizations, FeatureFlags | `/admin/*` |

---

## 2. ARCHITECTURE CIBLE RECOMMANDÉE

### Comparaison Options A vs B

| Critère | Option A: Monorepo (Workspaces) | Option B: Multi-repos |
|---------|--------------------------------|----------------------|
| **Partage de code** | ✅ Natif via packages internes | ⚠️ Via npm/registry privé |
| **CI/CD** | ✅ Pipeline unique, builds conditionnels | ⚠️ N pipelines à maintenir |
| **Refactoring** | ✅ Progressif, atomic commits | ❌ Synchronisation complexe |
| **Versioning** | ✅ Optionnel par app | ✅ Natif par repo |
| **Déploiement indépendant** | ✅ Oui avec config Vercel/build | ✅ Oui nativement |
| **Complexité migration** | ✅ Faible (restructuration) | ❌ Élevée (split complet) |
| **Onboarding dev** | ✅ Un seul clone | ⚠️ Multiple repos |
| **Cohérence Design System** | ✅ Garantie | ⚠️ Drift possible |

### RECOMMANDATION : Option A - Monorepo avec Workspaces

**Justification :**
1. **Migration progressive** : Permet de déplacer fichier par fichier sans casser l'existant
2. **Partage garanti** : Design system, auth, i18n toujours synchronisés
3. **CI/CD simplifié** : Un pipeline avec builds conditionnels par app
4. **DX optimale** : Un seul `git clone`, IDE workspace, cross-refs facilités
5. **Pragmatisme** : L'existant est déjà dans un repo, minimise le risque

**Outil recommandé** : pnpm workspaces (ou npm workspaces / turborepo)

---

## 3. ARBORESCENCE FINALE

```
/realpro-suite                          # Root du monorepo
│
├── package.json                        # Workspace root config
├── pnpm-workspace.yaml                 # pnpm workspaces definition
├── turbo.json                          # Turborepo config (optionnel)
├── tsconfig.base.json                  # Config TS partagée
├── .eslintrc.base.js                   # ESLint partagé
├── .prettierrc                         # Prettier partagé
│
├── /apps                               # ═══ APPLICATIONS INDÉPENDANTES ═══
│   │
│   ├── /ppe-admin                      # APP 1: Administrateur PPE
│   │   ├── package.json                # name: "@realpro/ppe-admin"
│   │   ├── vite.config.ts              # Build config spécifique
│   │   ├── tsconfig.json               # Extends base + paths
│   │   ├── index.html
│   │   └── /src
│   │       ├── main.tsx                # Bootstrap app
│   │       ├── App.tsx                 # Routes PPE uniquement
│   │       ├── /pages                  # Pages PPE
│   │       │   ├── /dashboard
│   │       │   ├── /immeubles          # Gestion immeubles
│   │       │   ├── /coproprietaires    # Gestion copropriétaires
│   │       │   ├── /assemblees         # AG, PV, résolutions
│   │       │   ├── /tantiemes          # Clés de répartition
│   │       │   ├── /charges            # Appels de fonds, décomptes
│   │       │   ├── /contrats           # Contrats maintenance
│   │       │   ├── /sinistres          # Gestion sinistres
│   │       │   ├── /documents          # GED PPE
│   │       │   ├── /communication      # Comm copropriétaires
│   │       │   └── /settings
│   │       ├── /features               # Feature modules PPE
│   │       │   ├── /ag-management
│   │       │   ├── /tantiemes-engine
│   │       │   ├── /charges-computation
│   │       │   └── /sinistres-workflow
│   │       ├── /hooks                  # Hooks spécifiques PPE
│   │       ├── /lib                    # Logique métier PPE
│   │       │   ├── /tantiemes          # Calculs tantièmes
│   │       │   ├── /charges            # Moteur charges
│   │       │   └── /ag                 # Logique AG
│   │       └── /types                  # Types PPE
│   │
│   ├── /promoteur                      # APP 2: Promoteur Immobilier
│   │   ├── package.json                # name: "@realpro/promoteur"
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   └── /src
│   │       ├── main.tsx
│   │       ├── App.tsx                 # Routes Promoteur uniquement
│   │       ├── /pages
│   │       │   ├── /dashboard
│   │       │   ├── /projets            # Projets immobiliers
│   │       │   ├── /lots               # Gestion lots
│   │       │   ├── /ventes             # CRM, pipeline, réservations
│   │       │   ├── /chantier           # Suivi construction
│   │       │   ├── /budget-cfc         # Budget, CFC, contrats EG
│   │       │   ├── /soumissions        # Appels d'offres
│   │       │   ├── /livraison          # Remise des clés
│   │       │   ├── /garanties          # SAV, garanties
│   │       │   ├── /documents          # GED projets
│   │       │   ├── /courtiers          # Gestion courtiers
│   │       │   └── /settings
│   │       ├── /features
│   │       │   ├── /project-cockpit
│   │       │   ├── /crm-pipeline
│   │       │   ├── /cfc-budget
│   │       │   ├── /submissions-engine
│   │       │   ├── /construction-progress
│   │       │   └── /sav-management
│   │       ├── /hooks                  # Hooks spécifiques Promoteur
│   │       ├── /lib                    # Logique métier Promoteur
│   │       │   ├── /cfc                # Calculs CFC
│   │       │   ├── /sales              # Logique ventes
│   │       │   └── /construction       # Logique chantier
│   │       └── /types
│   │
│   └── /regie                          # APP 3: Régie Immobilière
│       ├── package.json                # name: "@realpro/regie"
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── index.html
│       └── /src
│           ├── main.tsx
│           ├── App.tsx                 # Routes Régie uniquement
│           ├── /pages
│           │   ├── /dashboard
│           │   ├── /mandats            # Mandats de gestion
│           │   ├── /biens              # Biens gérés
│           │   ├── /locataires         # Gestion locataires
│           │   ├── /baux               # Contrats de bail
│           │   ├── /encaissements      # Loyers, quittances
│           │   ├── /relances           # Impayés, contentieux
│           │   ├── /entrees-sorties    # États des lieux
│           │   ├── /technique          # Maintenance, travaux
│           │   ├── /documents          # GED régie
│           │   ├── /communication      # Comm locataires/proprio
│           │   └── /settings
│           ├── /features
│           │   ├── /bail-management
│           │   ├── /rent-collection
│           │   ├── /dunning-workflow
│           │   ├── /inventory-module
│           │   └── /maintenance-mgmt
│           ├── /hooks
│           ├── /lib
│           │   ├── /rent               # Calculs loyers
│           │   ├── /bail               # Logique baux
│           │   └── /dunning            # Moteur relances
│           └── /types
│
├── /packages                           # ═══ PACKAGES PARTAGÉS (TECHNIQUE ONLY) ═══
│   │
│   ├── /ui                             # Design System
│   │   ├── package.json                # name: "@realpro/ui"
│   │   ├── /src
│   │   │   ├── /components             # Button, Card, Modal, Table, Form...
│   │   │   │   ├── /button
│   │   │   │   ├── /card
│   │   │   │   ├── /modal
│   │   │   │   ├── /table
│   │   │   │   ├── /form
│   │   │   │   ├── /toast
│   │   │   │   └── /index.ts
│   │   │   ├── /tokens                 # Design tokens (colors, spacing, typography)
│   │   │   ├── /icons                  # Wrapper lucide + custom icons
│   │   │   ├── /layouts                # AppShell, PageShell, Sidebar base
│   │   │   └── /index.ts               # Export public
│   │   └── tailwind.preset.js          # Preset Tailwind partagé
│   │
│   ├── /auth                           # Auth/IAM Package
│   │   ├── package.json                # name: "@realpro/auth"
│   │   └── /src
│   │       ├── /client                 # Supabase client factory
│   │       ├── /guards                 # AuthGuard, RoleGuard (générique)
│   │       ├── /hooks                  # useAuth, useSession, useUser
│   │       ├── /providers              # AuthProvider
│   │       ├── /types                  # Auth types (Session, User base)
│   │       └── /index.ts
│   │
│   ├── /i18n                           # Internationalisation
│   │   ├── package.json                # name: "@realpro/i18n"
│   │   └── /src
│   │       ├── /locales                # Traductions communes uniquement
│   │       │   ├── /common             # Labels génériques (Enregistrer, Annuler...)
│   │       │   ├── /errors             # Messages d'erreur
│   │       │   └── /validation         # Messages validation
│   │       ├── /config                 # i18next config
│   │       ├── /hooks                  # useI18n
│   │       └── /index.ts
│   │
│   ├── /config                         # Configs partagées
│   │   ├── package.json                # name: "@realpro/config"
│   │   └── /src
│   │       ├── eslint.config.js
│   │       ├── tsconfig.base.json
│   │       ├── prettier.config.js
│   │       └── tailwind.base.config.js
│   │
│   ├── /shared-utils                   # Utils techniques
│   │   ├── package.json                # name: "@realpro/shared-utils"
│   │   └── /src
│   │       ├── /format                 # Formatters (date, currency, number)
│   │       ├── /validation             # Validators génériques
│   │       ├── /storage                # LocalStorage, SessionStorage utils
│   │       ├── /http                   # Fetch wrapper, error handling
│   │       └── /index.ts
│   │
│   ├── /notifications                  # Service notifications
│   │   ├── package.json                # name: "@realpro/notifications"
│   │   └── /src
│   │       ├── /email                  # Email service (moteur)
│   │       ├── /push                   # Push notifications
│   │       ├── /in-app                 # Notifications in-app
│   │       └── /templates              # Template engine (pas les templates métier!)
│   │
│   └── /documents                      # Service documents
│       ├── package.json                # name: "@realpro/documents"
│       └── /src
│           ├── /storage                # Supabase Storage wrapper
│           ├── /viewer                 # Document viewer component
│           ├── /upload                 # Upload component
│           └── /index.ts
│
├── /infra                              # ═══ INFRASTRUCTURE ═══
│   │
│   ├── /supabase                       # Configuration Supabase
│   │   ├── /migrations                 # Migrations partagées (auth, users)
│   │   │   ├── 001_identity_core.sql   # Tables identity communes
│   │   │   └── 002_shared_enums.sql    # Enums partagés
│   │   ├── /functions                  # Edge functions communes
│   │   └── config.toml
│   │
│   ├── /supabase-ppe                   # DB spécifique PPE Admin
│   │   ├── /migrations
│   │   │   ├── 001_ppe_buildings.sql
│   │   │   ├── 002_ppe_owners.sql
│   │   │   ├── 003_ppe_tantiemes.sql
│   │   │   ├── 004_ppe_charges.sql
│   │   │   ├── 005_ppe_assemblies.sql
│   │   │   └── 006_ppe_incidents.sql
│   │   └── seed-ppe.sql
│   │
│   ├── /supabase-promoteur             # DB spécifique Promoteur
│   │   ├── /migrations
│   │   │   ├── 001_pro_projects.sql
│   │   │   ├── 002_pro_lots.sql
│   │   │   ├── 003_pro_crm.sql
│   │   │   ├── 004_pro_cfc.sql
│   │   │   ├── 005_pro_submissions.sql
│   │   │   ├── 006_pro_construction.sql
│   │   │   └── 007_pro_sav.sql
│   │   └── seed-promoteur.sql
│   │
│   └── /supabase-regie                 # DB spécifique Régie
│       ├── /migrations
│       │   ├── 001_reg_mandates.sql
│       │   ├── 002_reg_properties.sql
│       │   ├── 003_reg_tenants.sql
│       │   ├── 004_reg_leases.sql
│       │   ├── 005_reg_payments.sql
│       │   ├── 006_reg_dunning.sql
│       │   └── 007_reg_maintenance.sql
│       └── seed-regie.sql
│
├── /docs                               # ═══ DOCUMENTATION ═══
│   ├── architecture/
│   │   ├── ADR/                        # Architecture Decision Records
│   │   ├── diagrams/
│   │   └── conventions.md
│   ├── runbooks/
│   │   ├── deployment.md
│   │   ├── database.md
│   │   └── troubleshooting.md
│   └── api/
│       └── contracts/                  # Contrats d'interface entre apps
│
└── /scripts                            # ═══ SCRIPTS BUILD/CI ═══
    ├── build-all.sh
    ├── build-ppe.sh
    ├── build-promoteur.sh
    ├── build-regie.sh
    └── deploy.sh
```

---

## 4. FRONTIÈRES & RÈGLES

### Shared Autorisé (TECHNIQUE uniquement)

| Package | Contenu | Interdit |
|---------|---------|----------|
| **@realpro/ui** | Composants génériques (Button, Card, Table, Modal), Design tokens, Layouts de base | Composants avec logique métier spécifique |
| **@realpro/auth** | Client Supabase, AuthGuard générique, useAuth, Session types | Règles de permissions métier, rôles spécifiques |
| **@realpro/i18n** | Labels génériques, messages d'erreur, validation | Traductions métier (tantièmes, baux, CFC...) |
| **@realpro/shared-utils** | Formatters, validators, http utils | Calculs métier |
| **@realpro/notifications** | Moteur email/push, template engine | Templates métier (convocation AG, rappel loyer...) |
| **@realpro/documents** | Upload, viewer, storage wrapper | Arborescence métier, types de documents |

### Interdit de Mutualiser (LOGIQUE MÉTIER)

| Domaine | Exemples | Pourquoi |
|---------|----------|----------|
| **Calculs PPE** | Répartition charges, tantièmes, fonds de rénovation | Règles spécifiques PPE Suisse, pas de sens en Régie |
| **Calculs Régie** | Indexation loyers, charges locatives, décompte | Logique bail, pas applicable aux copropriétaires |
| **Calculs Promoteur** | Marge promotion, CFC, prix de vente | Spécifique construction neuve |
| **Workflows** | AG PPE, Relances Régie, Pipeline Promoteur | Processus métier distincts |
| **Types/Entités** | Copropriétaire vs Locataire vs Acheteur | Concepts différents, pas de type commun |
| **Permissions métier** | Admin PPE vs Chef de projet Promoteur | Rôles et droits spécifiques |

### Conventions de Nommage

```typescript
// Packages
"@realpro/ui"           // Package shared
"@realpro/ppe-admin"    // App PPE
"@realpro/promoteur"    // App Promoteur
"@realpro/regie"        // App Régie

// Imports cross-package (autorisé)
import { Button, Card } from '@realpro/ui';
import { useAuth } from '@realpro/auth';
import { formatCurrency } from '@realpro/shared-utils';

// Imports cross-app (INTERDIT)
import { useTantiemes } from '@realpro/ppe-admin';     // ❌ INTERDIT
import { calculateCFC } from '@realpro/promoteur';    // ❌ INTERDIT
import { LeaseContract } from '@realpro/regie';       // ❌ INTERDIT

// Fichiers
/apps/ppe-admin/src/features/tantiemes/...            // ✅ Feature PPE
/apps/promoteur/src/features/cfc-budget/...           // ✅ Feature Promoteur
/apps/regie/src/features/bail-management/...          // ✅ Feature Régie

// Types
type PPE_Building = { ... }     // Type PPE (dans @realpro/ppe-admin)
type PRO_Project = { ... }      // Type Promoteur (dans @realpro/promoteur)
type REG_Property = { ... }     // Type Régie (dans @realpro/regie)
```

### Règle d'Import Stricte (ESLint)

```javascript
// .eslintrc.js dans apps/ppe-admin
{
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        '@realpro/promoteur/*',  // Interdit import depuis Promoteur
        '@realpro/regie/*',      // Interdit import depuis Régie
      ]
    }]
  }
}
```

---

## 5. MENUS/MODULES PAR APPLICATION

### APP 1: PPE Admin (Administrateur de PPE)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PPE ADMIN - Gestion de Propriétés par Étages                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📊 TABLEAU DE BORD                                                 │
│     ├── Vue globale PPE                                             │
│     ├── KPIs (encaissements, impayés, sinistres)                    │
│     └── Calendrier AG                                               │
│                                                                     │
│  🏢 IMMEUBLES (PPE-IMM)                                             │
│     ├── Liste des PPE gérées                                        │
│     ├── Fiche immeuble                                              │
│     ├── Parties communes                                            │
│     └── Équipements                                                 │
│                                                                     │
│  👥 COPROPRIÉTAIRES (PPE-COP)                                       │
│     ├── Annuaire copropriétaires                                    │
│     ├── Fiche copropriétaire                                        │
│     ├── Lots détenus                                                │
│     └── Historique paiements                                        │
│                                                                     │
│  📋 ASSEMBLÉES GÉNÉRALES (PPE-AG)                                   │
│     ├── Convocations                                                │
│     ├── Ordre du jour                                               │
│     ├── Procès-verbaux                                              │
│     ├── Résolutions                                                 │
│     └── Votes (historique)                                          │
│                                                                     │
│  📐 TANTIÈMES (PPE-TAN)                                             │
│     ├── Clés de répartition                                         │
│     ├── Tableau des tantièmes                                       │
│     ├── Simulation répartition                                      │
│     └── Historique modifications                                    │
│                                                                     │
│  💰 CHARGES & FONDS (PPE-CHG)                                       │
│     ├── Appels de fonds                                             │
│     ├── Décomptes annuels                                           │
│     ├── Fonds de rénovation                                         │
│     ├── Budget prévisionnel                                         │
│     └── Suivi encaissements                                         │
│                                                                     │
│  📄 CONTRATS (PPE-CTR)                                              │
│     ├── Contrats maintenance                                        │
│     ├── Assurances                                                  │
│     ├── Fournisseurs                                                │
│     └── Échéancier                                                  │
│                                                                     │
│  ⚠️ SINISTRES (PPE-SIN)                                             │
│     ├── Déclarations                                                │
│     ├── Suivi dossiers                                              │
│     ├── Expertises                                                  │
│     └── Indemnisations                                              │
│                                                                     │
│  📁 DOCUMENTS (PPE-DOC)                                             │
│     ├── GED PPE                                                     │
│     ├── Règlement PPE                                               │
│     ├── PV assemblées                                               │
│     └── Correspondances                                             │
│                                                                     │
│  📬 COMMUNICATION (PPE-COM)                                         │
│     ├── Envois groupés                                              │
│     ├── Historique messages                                         │
│     └── Notifications                                               │
│                                                                     │
│  ⚙️ PARAMÈTRES                                                      │
│     ├── Configuration PPE                                           │
│     ├── Utilisateurs                                                │
│     └── Intégrations                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### APP 2: Promoteur Immobilier

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROMOTEUR - Gestion de Projets de Promotion Immobilière            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📊 TABLEAU DE BORD                                                 │
│     ├── Portfolio projets                                           │
│     ├── KPIs (ventes, marge, avancement)                            │
│     └── Alertes projets                                             │
│                                                                     │
│  🏗️ PROJETS (PRO-PRJ)                                               │
│     ├── Liste projets                                               │
│     ├── Cockpit projet                                              │
│     ├── Structure (bâtiments, étages)                               │
│     ├── Timeline / Jalons                                           │
│     └── Équipe projet                                               │
│                                                                     │
│  🏠 LOTS (PRO-LOT)                                                  │
│     ├── Inventaire lots                                             │
│     ├── Fiche lot détaillée                                         │
│     ├── Plans / 3D                                                  │
│     ├── Grille de prix                                              │
│     └── Statuts (dispo, réservé, vendu)                             │
│                                                                     │
│  💼 VENTES / CRM (PRO-CRM)                                          │
│     ├── Pipeline commercial                                         │
│     ├── Prospects                                                   │
│     ├── Réservations                                                │
│     ├── Acheteurs                                                   │
│     ├── Contrats de vente                                           │
│     └── Actes notariés                                              │
│                                                                     │
│  🏗️ CHANTIER (PRO-CHN)                                              │
│     ├── Planning travaux                                            │
│     ├── Avancement                                                  │
│     ├── Photos chantier                                             │
│     ├── Journal de chantier                                         │
│     └── Intervenants                                                │
│                                                                     │
│  💰 BUDGET / CFC (PRO-CFC)                                          │
│     ├── Budget global (CFC)                                         │
│     ├── Engagements                                                 │
│     ├── Factures                                                    │
│     ├── Paiements                                                   │
│     └── Analyse écarts                                              │
│                                                                     │
│  📝 SOUMISSIONS (PRO-SOU)                                           │
│     ├── Appels d'offres                                             │
│     ├── Comparatif offres                                           │
│     ├── Adjudications                                               │
│     └── Contrats entreprises                                        │
│                                                                     │
│  🎨 CHOIX MATÉRIAUX (PRO-MAT)                                       │
│     ├── Catalogue                                                   │
│     ├── Choix par lot                                               │
│     ├── RDV fournisseurs                                            │
│     └── Avenants plus-values                                        │
│                                                                     │
│  🔑 LIVRAISON (PRO-LIV)                                             │
│     ├── Planning livraisons                                         │
│     ├── Réceptions                                                  │
│     ├── Remise des clés                                             │
│     └── PV de livraison                                             │
│                                                                     │
│  🔧 GARANTIES / SAV (PRO-SAV)                                       │
│     ├── Tickets SAV                                                 │
│     ├── Suivi interventions                                         │
│     ├── Garanties constructeur                                      │
│     └── Reporting qualité                                           │
│                                                                     │
│  📁 DOCUMENTS (PRO-DOC)                                             │
│     ├── GED projet                                                  │
│     ├── Plans                                                       │
│     ├── Autorisations                                               │
│     └── Correspondances                                             │
│                                                                     │
│  🤝 COURTIERS (PRO-COU)                                             │
│     ├── Réseau courtiers                                            │
│     ├── Mandats                                                     │
│     ├── Commissions                                                 │
│     └── Reporting ventes                                            │
│                                                                     │
│  ⚙️ PARAMÈTRES                                                      │
│     ├── Configuration projet                                        │
│     ├── Utilisateurs                                                │
│     └── Templates                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### APP 3: Régie Immobilière

```
┌─────────────────────────────────────────────────────────────────────┐
│  RÉGIE - Gestion Locative et Administration de Biens                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📊 TABLEAU DE BORD                                                 │
│     ├── Portfolio mandats                                           │
│     ├── KPIs (encaissements, vacance, impayés)                      │
│     └── Alertes (baux, échéances)                                   │
│                                                                     │
│  📋 MANDATS (REG-MAN)                                               │
│     ├── Liste mandats                                               │
│     ├── Fiche mandat                                                │
│     ├── Conditions                                                  │
│     ├── Propriétaires                                               │
│     └── Reporting propriétaire                                      │
│                                                                     │
│  🏢 BIENS (REG-BIE)                                                 │
│     ├── Inventaire biens                                            │
│     ├── Fiche bien                                                  │
│     ├── Caractéristiques                                            │
│     ├── Photos / Plans                                              │
│     └── Historique location                                         │
│                                                                     │
│  👤 LOCATAIRES (REG-LOC)                                            │
│     ├── Annuaire locataires                                         │
│     ├── Fiche locataire                                             │
│     ├── Dossier candidature                                         │
│     └── Historique paiements                                        │
│                                                                     │
│  📄 BAUX (REG-BAU)                                                  │
│     ├── Contrats de bail                                            │
│     ├── Avenants                                                    │
│     ├── Renouvellements                                             │
│     ├── Indexation loyers                                           │
│     └── Résiliations                                                │
│                                                                     │
│  💵 ENCAISSEMENTS (REG-ENC)                                         │
│     ├── Appels de loyers                                            │
│     ├── Quittances                                                  │
│     ├── Suivi paiements                                             │
│     ├── Rapprochement bancaire                                      │
│     └── Décomptes charges                                           │
│                                                                     │
│  ⚠️ RELANCES (REG-REL)                                              │
│     ├── Impayés                                                     │
│     ├── Workflow relances                                           │
│     ├── Mise en demeure                                             │
│     ├── Contentieux                                                 │
│     └── Plans d'apurement                                           │
│                                                                     │
│  🚪 ENTRÉES / SORTIES (REG-EDL)                                     │
│     ├── États des lieux entrée                                      │
│     ├── États des lieux sortie                                      │
│     ├── Comparatif                                                  │
│     ├── Retenues caution                                            │
│     └── Restitutions                                                │
│                                                                     │
│  🔧 TECHNIQUE (REG-TEC)                                             │
│     ├── Demandes intervention                                       │
│     ├── Ordres de travaux                                           │
│     ├── Prestataires                                                │
│     ├── Suivi interventions                                         │
│     └── Maintenance préventive                                      │
│                                                                     │
│  📁 DOCUMENTS (REG-DOC)                                             │
│     ├── GED bien/locataire                                          │
│     ├── Baux signés                                                 │
│     ├── EDL                                                         │
│     └── Correspondances                                             │
│                                                                     │
│  📬 COMMUNICATION (REG-COM)                                         │
│     ├── Envois locataires                                           │
│     ├── Envois propriétaires                                        │
│     ├── Historique                                                  │
│     └── Templates                                                   │
│                                                                     │
│  ⚙️ PARAMÈTRES                                                      │
│     ├── Configuration régie                                         │
│     ├── Utilisateurs                                                │
│     └── Intégrations comptables                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. PLAN DE MIGRATION

### Phase 0 : Préparation (Semaine 1-2)

```
ÉTAPE 0.1 - Setup monorepo
├── Installer pnpm (si pas présent)
├── Créer pnpm-workspace.yaml
├── Créer structure /apps et /packages vides
├── Configurer turborepo (optionnel)
└── Tester build monorepo vide

ÉTAPE 0.2 - Créer packages shared
├── /packages/config (eslint, tsconfig, prettier)
├── /packages/shared-utils (extraire src/lib/utils)
├── Configurer exports package.json
└── Tester imports depuis app existante

Fichiers à créer :
- /pnpm-workspace.yaml
- /turbo.json
- /packages/config/package.json
- /packages/config/src/tsconfig.base.json
- /packages/shared-utils/package.json
- /packages/shared-utils/src/index.ts
```

### Phase 1 : Extraction du Design System (Semaine 3-4)

```
ÉTAPE 1.1 - Créer @realpro/ui
├── /packages/ui/package.json
├── /packages/ui/src/components/ (déplacer depuis src/shared/ui + src/components/ui)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   ├── Toast.tsx
│   └── ... (30+ composants)
├── /packages/ui/src/tokens/ (extraire de tailwind.config.js)
├── /packages/ui/tailwind.preset.js
└── Export public via index.ts

ÉTAPE 1.2 - Migrer imports dans app existante
├── Remplacer "../../components/ui/Button" par "@realpro/ui"
├── Script de migration automatique (codemod)
├── Tester non-régression
└── Commit

Fichiers à déplacer :
- src/shared/ui/* → packages/ui/src/components/
- src/components/ui/* → packages/ui/src/components/
- tailwind.config.js tokens → packages/ui/src/tokens/

Commande migration :
$ npx jscodeshift -t ./scripts/codemods/ui-imports.ts src/**/*.tsx
```

### Phase 2 : Extraction Auth (Semaine 5)

```
ÉTAPE 2.1 - Créer @realpro/auth
├── /packages/auth/package.json
├── /packages/auth/src/
│   ├── client.ts (extraire src/lib/supabase.ts)
│   ├── guards/AuthGuard.tsx (extraire src/components/AuthGuard.tsx)
│   ├── hooks/useAuth.ts
│   ├── hooks/useSession.ts
│   ├── providers/AuthProvider.tsx
│   └── types/index.ts

ÉTAPE 2.2 - Migrer permissions (SÉPARER TECHNIQUE / MÉTIER)
├── Garder dans @realpro/auth : Session, User base, AuthGuard générique
├── NE PAS inclure : permissions.ts (contient logique métier, reste dans apps)
└── Chaque app aura son propre /lib/permissions.ts

Fichiers à déplacer :
- src/lib/supabase.ts → packages/auth/src/client.ts
- src/lib/auth.ts → packages/auth/src/auth.ts
- src/components/AuthGuard.tsx → packages/auth/src/guards/
- src/lib/authHelpers.ts → packages/auth/src/helpers.ts
```

### Phase 3 : Extraction i18n (Semaine 6)

```
ÉTAPE 3.1 - Créer @realpro/i18n
├── /packages/i18n/package.json
├── /packages/i18n/src/
│   ├── config.ts
│   ├── hooks/useI18n.ts
│   └── locales/common/ (labels génériques uniquement)

ÉTAPE 3.2 - Séparer traductions métier
├── Traductions PPE → apps/ppe-admin/src/locales/
├── Traductions Promoteur → apps/promoteur/src/locales/
├── Traductions Régie → apps/regie/src/locales/
└── Common reste dans packages/i18n

Fichiers à déplacer :
- src/lib/i18n/config.ts → packages/i18n/src/
- src/lib/i18n/locales/* → Split entre packages/i18n et apps/*/src/locales/
```

### Phase 4 : Création App Promoteur (Semaine 7-10)

```
ÉTAPE 4.1 - Setup app promoteur
├── /apps/promoteur/package.json
├── /apps/promoteur/vite.config.ts
├── /apps/promoteur/tsconfig.json
├── /apps/promoteur/index.html
└── /apps/promoteur/src/main.tsx

ÉTAPE 4.2 - Migrer pages Promoteur
├── Identifier pages : Projects*, Lots*, CRM*, Finance*, Planning*, SAV*
├── Déplacer vers apps/promoteur/src/pages/
├── Adapter imports (@realpro/ui, @realpro/auth)
└── Créer App.tsx avec routes promoteur uniquement

ÉTAPE 4.3 - Migrer features Promoteur
├── Components spécifiques → apps/promoteur/src/components/
├── Hooks spécifiques → apps/promoteur/src/hooks/
├── Lib métier (CFC, sales logic) → apps/promoteur/src/lib/
└── Permissions promoteur → apps/promoteur/src/lib/permissions.ts

Pages à migrer :
- src/pages/ProjectsList*.tsx → apps/promoteur/src/pages/projets/
- src/pages/ProjectCockpit*.tsx → apps/promoteur/src/pages/projets/
- src/pages/ProjectLot*.tsx → apps/promoteur/src/pages/lots/
- src/pages/ProjectCRM*.tsx → apps/promoteur/src/pages/ventes/
- src/pages/ProjectFinance*.tsx → apps/promoteur/src/pages/budget/
- src/pages/ProjectSubmission*.tsx → apps/promoteur/src/pages/soumissions/
- src/pages/ProjectSAV*.tsx → apps/promoteur/src/pages/garanties/
- src/pages/Broker*.tsx → apps/promoteur/src/pages/courtiers/
- etc.

ÉTAPE 4.4 - Setup DB Promoteur
├── /infra/supabase-promoteur/migrations/
├── Extraire tables projets, lots, crm, cfc, soumissions
└── Adapter RLS policies
```

### Phase 5 : Création App PPE Admin (Semaine 11-13)

```
ÉTAPE 5.1 - Setup app PPE
├── /apps/ppe-admin/package.json
├── Structure similaire à promoteur
└── Routes PPE

ÉTAPE 5.2 - CRÉER nouvelles pages PPE (peu d'existant)
├── Dashboard PPE
├── Immeubles
├── Copropriétaires
├── AG
├── Tantièmes
├── Charges
├── Contrats maintenance
├── Sinistres
└── Documents/Communication

ÉTAPE 5.3 - Créer logique métier PPE
├── Moteur tantièmes
├── Moteur charges
├── Workflow AG
└── Types PPE

ÉTAPE 5.4 - Setup DB PPE
├── /infra/supabase-ppe/migrations/
├── Tables : ppe_buildings, ppe_owners, ppe_tantiemes, ppe_charges, ppe_assemblies
└── RLS policies PPE
```

### Phase 6 : Création App Régie (Semaine 14-16)

```
ÉTAPE 6.1 - Setup app Régie
├── /apps/regie/package.json
├── Structure similaire
└── Routes Régie

ÉTAPE 6.2 - CRÉER nouvelles pages Régie (peu d'existant)
├── Dashboard Régie
├── Mandats
├── Biens
├── Locataires
├── Baux
├── Encaissements
├── Relances
├── États des lieux
├── Technique
└── Documents/Communication

ÉTAPE 6.3 - Créer logique métier Régie
├── Moteur loyers / indexation
├── Workflow relances
├── Module EDL
└── Types Régie

ÉTAPE 6.4 - Setup DB Régie
├── /infra/supabase-regie/migrations/
├── Tables : reg_mandates, reg_properties, reg_tenants, reg_leases, reg_payments
└── RLS policies Régie
```

### Phase 7 : Cleanup et Go-Live (Semaine 17-18)

```
ÉTAPE 7.1 - Supprimer code legacy
├── Supprimer src/ original (backup d'abord)
├── Nettoyer package.json root
└── Vérifier aucune référence cassée

ÉTAPE 7.2 - Configuration déploiement
├── Vercel : 3 projets distincts (ppe.realpro.ch, promoteur.realpro.ch, regie.realpro.ch)
├── OU : Un seul domaine avec routing (/ppe, /promoteur, /regie)
├── CI/CD : GitHub Actions avec builds conditionnels
└── Variables d'environnement par app

ÉTAPE 7.3 - Tests et validation
├── Tests E2E par app
├── Tests de non-régression
├── Performance check
└── Security audit

ÉTAPE 7.4 - Migration données (si nécessaire)
├── Script migration DB partagée → DBs séparées
├── Validation intégrité
└── Rollback plan
```

### Stratégie de Routing

**Option recommandée : Sous-domaines**

```
https://ppe.realpro.ch        → App PPE Admin
https://promoteur.realpro.ch  → App Promoteur
https://regie.realpro.ch      → App Régie
https://realpro.ch            → Landing page (choix d'app)
```

**Alternative : Paths**

```
https://app.realpro.ch/ppe/*        → App PPE Admin
https://app.realpro.ch/promoteur/*  → App Promoteur
https://app.realpro.ch/regie/*      → App Régie
```

### Stratégie Auth

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE AUTH                            │
│                    (instance partagée)                          │
│                                                                 │
│    users table (id, email, first_name, last_name)               │
│    ↓                                                            │
│    JWT avec custom claims:                                      │
│    {                                                            │
│      sub: "user-uuid",                                          │
│      app_access: ["ppe", "promoteur", "regie"],                 │
│      org_id: "org-uuid"                                         │
│    }                                                            │
└─────────────────────────────────────────────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │ PPE App  │       │Promoteur │       │ Régie    │
    │          │       │   App    │       │   App    │
    │ Roles:   │       │ Roles:   │       │ Roles:   │
    │ -admin   │       │ -promoter│       │ -admin   │
    │ -gerant  │       │ -chef_pj │       │ -gerant  │
    │ -compta  │       │ -comml   │       │ -compta  │
    │          │       │ -eg      │       │ -tech    │
    └──────────┘       └──────────┘       └──────────┘
         │                  │                  │
         ▼                  ▼                  ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │  DB PPE  │       │DB Promot.│       │DB Régie  │
    │(séparée) │       │(séparée) │       │(séparée) │
    └──────────┘       └──────────┘       └──────────┘
```

---

## 7. RISQUES & MITIGATIONS

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Régression fonctionnelle** | Élevé | Moyen | Tests E2E avant/après chaque phase, feature flags |
| **Perte de données** | Critique | Faible | Backup DB avant migration, scripts rollback |
| **Délai dépassé** | Moyen | Moyen | Phases indépendantes, MVP Promoteur d'abord |
| **Résistance équipe** | Moyen | Faible | Documentation, formation, quick wins early |
| **Complexité monorepo** | Moyen | Moyen | Tooling (turborepo), conventions strictes |
| **Drift design system** | Faible | Moyen | Package @realpro/ui versionné, PR reviews |

---

## 8. PROCHAINES ÉTAPES IMMÉDIATES

1. **Valider cette architecture** avec les stakeholders
2. **Setup monorepo** (Phase 0) - 2-3 jours
3. **Extraire @realpro/ui** (Phase 1) - 1 semaine
4. **POC App Promoteur** (structure + 3 pages) - 1 semaine
5. **Décision DB** : DB séparées ou DB partagée avec schemas?
6. **Choix hébergement** : Vercel multi-projets ou autre?

---

*Document généré le 2025-12-12 - Version 1.0*
