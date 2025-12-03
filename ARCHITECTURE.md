# 🏗️ ARCHITECTURE SAAS B2B - PROPTECH

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture globale](#architecture-globale)
3. [Modèle de données](#modèle-de-données)
4. [RBAC & Sécurité](#rbac--sécurité)
5. [Multi-tenant](#multi-tenant)
6. [i18n - Internationalisation](#i18n---internationalisation)
7. [Frontend](#frontend)
8. [Backend (Supabase)](#backend-supabase)
9. [Facturation (Datatrans)](#facturation-datatrans)
10. [Roadmap produit](#roadmap-produit)

---

## 🎯 Vue d'ensemble

Plateforme SaaS B2B pour la gestion de projets immobiliers complexes (PPE/QPT) en Suisse.

### Stack technique

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Edge Functions)
- **Paiements**: Datatrans (PSP Suisse)
- **i18n**: 4 langues (FR, DE, EN, IT)
- **Architecture**: Multi-tenant avec Row Level Security

---

## 🏛️ Architecture globale

### Domaines métier

| Domaine | Responsabilité | Tables principales |
|---------|---------------|-------------------|
| **identity** | Utilisateurs, organisations, auth, RBAC | users, organizations, roles, permissions |
| **projects** | Projets, bâtiments, structure | projects, buildings, floors, lots |
| **participants** | Acteurs du projet | companies, contacts, project_participants |
| **crm** | Pipeline commercial | prospects, reservations, buyers, buyer_files |
| **notary** | Dossiers notaire | notary_files, notary_acts |
| **brokers** | Courtiers & commissions | broker_stats, commissions |
| **submissions** | Appels d'offres | submissions, offers, adjudications |
| **finance** | CFC, budgets, factures | cfc_budgets, contracts, invoices, payments |
| **documents** | GED, versioning | documents, document_versions |
| **choices** | Choix matériaux acquéreurs | material_catalog, buyer_choices |
| **construction** | Planning chantier | project_phases, tasks, progress_snapshots |
| **communication** | Messages, notifications | message_threads, messages, notifications |
| **settings** | Paramétrage projet | project_settings, templates |
| **reporting** | Dashboards, KPIs | dashboards, kpi_snapshots |
| **billing** | Abonnements SaaS | plans, subscriptions, invoices |

---

## 🗄️ Modèle de données

### Schéma multi-tenant

Toutes les données sont isolées par `organization_id` :

```
Organization (tenant)
  └─ Users (many-to-many via user_organizations)
      └─ Roles (via user_roles)
          └─ Permissions (via role_permissions)
  └─ Projects
      └─ Buildings
          └─ Floors
              └─ Lots
      └─ Documents
      └─ Prospects
      └─ CFC Budgets
```

### Migrations Supabase

Les migrations sont organisées par ordre chronologique :

1. **001_create_identity_core.sql** - Users, organizations, roles, permissions
2. **002_seed_roles_and_permissions.sql** - 10 rôles système + matrice permissions
3. **003_create_projects_structure.sql** - Projects, buildings, floors, lots
4. **004_create_crm_and_participants.sql** - CRM, companies, contacts
5. **005_create_billing_module.sql** - Plans, subscriptions, Datatrans
6. **006_create_documents_finance_communication.sql** - Documents, finance, messages
7. **007_seed_initial_data_v2.sql** - Données de démonstration

### Enums principaux

```typescript
// Langues
type LanguageCode = 'FR' | 'DE' | 'EN' | 'IT';

// Projets
type ProjectStatus = 'PLANNING' | 'CONSTRUCTION' | 'SELLING' | 'COMPLETED' | 'ARCHIVED';

// Lots
type LotType = 'APARTMENT' | 'COMMERCIAL' | 'PARKING' | 'STORAGE' | 'VILLA' | 'HOUSE';
type LotStatus = 'AVAILABLE' | 'RESERVED' | 'OPTION' | 'SOLD' | 'DELIVERED';

// CRM
type ProspectStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VISIT_SCHEDULED' |
                      'VISIT_DONE' | 'OFFER_SENT' | 'RESERVED' | 'LOST';
type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CONVERTED' | 'CANCELLED' | 'EXPIRED';

// Billing
type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
type BillingCycle = 'MONTHLY' | 'YEARLY';
```

---

## 🔐 RBAC & Sécurité

### Matrice des rôles et permissions

| Rôle | Projects | Lots | CRM | Finance | Documents | Billing |
|------|----------|------|-----|---------|-----------|---------|
| **saas_admin** | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ MANAGE |
| **org_admin** | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | 👁️ READ |
| **promoter** | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | 👁️ READ |
| **general_contractor** | 👁️ READ | 👁️ READ | ❌ | 👁️ READ | ✅ ALL | ❌ |
| **architect** | ✏️ UPDATE | ✏️ UPDATE | ❌ | ❌ | ✅ ALL | ❌ |
| **engineer** | 👁️ READ | 👁️ READ | ❌ | ❌ | ✅ ALL | ❌ |
| **notary** | 👁️ READ | 👁️ READ | 👁️ READ | ❌ | 👁️ READ | ❌ |
| **broker** | 👁️ READ | 👁️ READ | ✅ ALL | ❌ | 👁️ READ | ❌ |
| **buyer** | ❌ | 👁️ OWN | ❌ | 👁️ OWN | 👁️ OWN | ❌ |
| **supplier** | ❌ | ❌ | ❌ | ❌ | 👁️ READ | ❌ |

### Principes RLS (Row Level Security)

Toutes les tables ont RLS activé avec policies restrictives :

```sql
-- Exemple : Users voient uniquement leurs propres projets
CREATE POLICY "Users can view projects in their organizations"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );
```

**Règles clés** :
- Filtrage automatique par `organization_id`
- Vérification des permissions via `role_permissions`
- Les buyers accèdent uniquement à leurs données via `user_id`
- Policies séparées pour SELECT, INSERT, UPDATE, DELETE

---

## 🏢 Multi-tenant

### Isolation des données

1. **Organisation = Tenant**
   - Chaque promoteur/EG a sa propre organisation
   - Isolation complète des données

2. **User appartient à N organisations**
   - Table `user_organizations` (many-to-many)
   - Un utilisateur peut avoir des rôles différents par organisation

3. **Context switching**
   - L'utilisateur sélectionne son organisation active
   - Toutes les requêtes filtrent automatiquement par `organization_id`

4. **Middleware RLS**
   - Supabase RLS applique automatiquement le filtre
   - Aucune donnée d'une autre organisation n'est accessible

---

## 🌍 i18n - Internationalisation

### 4 langues supportées

- **FR** (Français) - Langue par défaut
- **DE** (Deutsch)
- **EN** (English)
- **IT** (Italiano)

### Système de traduction

1. **Niveau Organisation**
   ```typescript
   organization.default_language // 'FR' | 'DE' | 'EN' | 'IT'
   ```

2. **Niveau Utilisateur**
   ```typescript
   user.language // Override personnel
   ```

3. **Fallback intelligent**
   ```typescript
   user.language -> organization.default_language -> 'FR'
   ```

### Fichiers de traduction

```
src/lib/i18n/locales/
  ├── fr.json
  ├── de.json
  ├── en.json
  └── it.json
```

**Structure** :
```json
{
  "common": { "save": "Enregistrer", ... },
  "nav": { "dashboard": "Tableau de bord", ... },
  "projects": { "title": "Projets", ... },
  "lots": { ... },
  "crm": { ... },
  "billing": { ... }
}
```

### Hook d'utilisation

```typescript
import { useI18n } from '@/lib/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useI18n();

  return <h1>{t('projects.title')}</h1>;
}
```

---

## 💻 Frontend

### Structure des dossiers

```
src/
├── components/
│   ├── ui/              # Design system
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   └── layout/          # Layout components
│       ├── AppShell.tsx
│       ├── Sidebar.tsx
│       └── Topbar.tsx
├── pages/               # Pages principales
│   ├── Dashboard.tsx
│   ├── ProjectsList.tsx
│   ├── BillingPage.tsx
│   └── ...
├── hooks/               # Custom hooks
│   ├── useCurrentUser.ts
│   ├── useProjects.ts
│   ├── useLots.ts
│   └── useBilling.ts
├── lib/
│   ├── supabase.ts      # Client Supabase + types
│   └── i18n/            # Système i18n
└── App.tsx
```

### Design System

**Palette de couleurs** :
- Primary: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Neutral: Gray scales

**Composants** :
- `Button` : 5 variants (primary, secondary, outline, ghost, danger)
- `Card` : Container avec hover et padding configurables
- `Badge` : Status indicators avec variants de couleur
- `Input` : Champs de formulaire avec label, error, helper

**Principes UX** :
- Style sobre, clair, inspiré de Linear/Stripe
- Transitions douces (200ms)
- Focus states accessibles
- Espacement cohérent (système 8px)
- Typographie hiérarchique

---

## 🔧 Backend (Supabase)

### Services principaux

1. **PostgreSQL Database**
   - Schéma multi-tenant complet
   - Row Level Security (RLS)
   - Triggers, fonctions, index optimisés

2. **Auth**
   - Email/Password (par défaut)
   - JWT tokens (access + refresh)
   - Session management

3. **Realtime** (optionnel)
   - Subscriptions aux changements de données
   - Notifications en temps réel

4. **Storage** (à implémenter)
   - Documents, photos, plans
   - Organisation par projet/lot

5. **Edge Functions** (Deno)
   - Webhooks Datatrans
   - Logique métier complexe
   - Intégrations externes

### Exemple Edge Function (Datatrans Webhook)

```typescript
// supabase/functions/datatrans-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const { event_type, transaction_id, status } = await req.json();

  // Traiter le webhook Datatrans
  // Mettre à jour la transaction dans la DB
  // Activer/renouveler l'abonnement

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 💳 Facturation (Datatrans)

### Flow d'abonnement

1. **Sélection du plan**
   - User choisit Basic/Pro/Enterprise
   - Cycle mensuel ou annuel

2. **Ajout moyen de paiement**
   ```typescript
   // Initialiser une transaction Datatrans
   POST /billing/payment-methods/init
   {
     organization_id: "...",
     type: "CARD" | "TWINT"
   }

   // Redirection vers Datatrans lightbox
   // ou iframe pour saisie sécurisée
   ```

3. **Confirmation**
   ```typescript
   POST /billing/payment-methods/confirm
   {
     datatrans_alias: "...",
     card_last4: "1234",
     card_brand: "VISA"
   }
   ```

4. **Facturation récurrente**
   - Automatique via Datatrans
   - Webhook notifie le succès/échec
   - Mise à jour du statut de l'abonnement

### Tables Datatrans

- `datatrans_customers` : Client Datatrans par organisation
- `datatrans_transactions` : Historique des transactions
- `datatrans_webhook_events` : Log des webhooks reçus
- `payment_methods` : Moyens de paiement enregistrés (alias)

### Configuration

```env
DATATRANS_MERCHANT_ID=...
DATATRANS_SIGN_KEY=...
DATATRANS_API_USER=...
DATATRANS_API_PASSWORD=...
DATATRANS_ENV=sandbox|production
```

---

## 📅 Roadmap produit

### MVP (3-4 mois)

**Must-have** :
- ✅ Identity & RBAC complet
- ✅ Projets, bâtiments, lots
- ✅ CRM basique (prospects, réservations)
- ✅ Documents (upload, liste)
- ✅ Communication (messages)
- ✅ Billing SaaS (Datatrans)
- ✅ i18n FR/EN

**Nice-to-have** :
- Dashboard KPIs en temps réel
- Filtres avancés sur les lots
- Export Excel/PDF

**Risques** :
- Intégration Datatrans sandbox → tester en profondeur
- Performance RLS sur grandes datasets → index

---

### V1 (6-9 mois)

**Must-have** :
- Module soumissions complet (appels d'offres, comparatifs, adjudications)
- Finance CFC (budgets, contrats, factures, acomptes)
- Dossiers notaire (actes, versions, signatures)
- Choix matériaux acquéreurs (catalogue, modifications, avenants)
- Reporting avancé (dashboards, exports)
- i18n DE/IT

**Nice-to-have** :
- Planning construction avec Gantt
- Notifications push mobile
- Intégration calendrier (Outlook, Google)

**Risques** :
- Complexité du module finance → architecture solide dès le MVP
- Gestion des états (lots, réservations, actes) → machine à états

---

### V2 (12+ mois)

**Must-have** :
- Optimisations performance (caching, indexes, pagination)
- Intégrations tierces (comptabilité, CRM externes)
- Analytics produit (tracking comportement utilisateurs)
- App mobile (React Native ou PWA)

**Nice-to-have** :
- SSO / SAML pour Enterprise
- API publique pour partenaires
- White-label pour revendeurs
- IA prédictive (prix lots, taux de conversion)

---

## 🚀 Getting Started

### Prérequis

- Node.js 18+
- npm ou pnpm
- Compte Supabase
- (Optionnel) Compte Datatrans sandbox

### Installation

```bash
# Cloner le repo
git clone <repo-url>

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Lancer en dev
npm run dev
```

### Variables d'environnement

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit"
}
```

---

## 📝 Conventions de code

1. **TypeScript strict**
   - Pas de `any`
   - Types explicites pour les props/state

2. **Composants fonctionnels**
   - Hooks uniquement
   - Props destructurées

3. **Nommage**
   - PascalCase pour composants
   - camelCase pour fonctions/variables
   - SCREAMING_SNAKE_CASE pour constantes

4. **Imports**
   - Grouper par catégorie (React, libs, local)
   - Chemins absolus via `@/` (à configurer)

5. **CSS**
   - Tailwind classes uniquement
   - Pas de CSS modules / styled-components

---

## 🔒 Sécurité

### Checklist

- ✅ RLS activé sur toutes les tables
- ✅ Policies restrictives par défaut
- ✅ Validation côté serveur (via Supabase)
- ✅ Pas de secrets dans le frontend
- ✅ JWT tokens sécurisés (HttpOnly)
- ⏳ Rate limiting sur API (à implémenter)
- ⏳ Audit logs (à implémenter)
- ⏳ HTTPS obligatoire en production

---

## 📊 Performance

### Optimisations

1. **Database**
   - Index sur toutes les FK
   - Index composites pour filtres fréquents
   - Pagination systématique (limit 50 par défaut)

2. **Frontend**
   - Code splitting par route (React.lazy)
   - Images optimisées (WebP, lazy loading)
   - Debounce sur les recherches

3. **Caching**
   - React Query pour cache API (à implémenter)
   - Service Worker pour assets (PWA)

### Monitoring (à implémenter)

- Sentry pour error tracking
- Datadog/New Relic pour APM
- Supabase Analytics pour queries

---

## 🧪 Tests

### Stratégie

1. **Unitaires** (Jest + React Testing Library)
   - Composants UI
   - Hooks
   - Utilitaires

2. **Intégration**
   - Flows critiques (auth, paiement)
   - API calls avec mocks

3. **E2E** (Playwright)
   - Parcours utilisateur complets
   - Tests de non-régression

### À implémenter

```bash
npm test              # Run all tests
npm test:unit         # Unit tests
npm test:e2e          # E2E tests
npm test:coverage     # Coverage report
```

---

## 📚 Documentation complémentaire

- **Supabase Docs** : https://supabase.com/docs
- **Datatrans API** : https://docs.datatrans.ch
- **React** : https://react.dev
- **Tailwind CSS** : https://tailwindcss.com

---

## 👥 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Dernière mise à jour** : Décembre 2024
