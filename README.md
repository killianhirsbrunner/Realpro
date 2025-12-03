# 🏗️ Realpro Suite

> Plateforme SaaS de gestion de projets immobiliers suisses (PPE/QPT)

**© 2024-2025 Realpro SA. Tous droits réservés.**

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Ready-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## ⚠️ Propriété Intellectuelle

**Realpro Suite** est un logiciel propriétaire développé et édité par **Realpro SA**.

- ✓ Tous les droits sont réservés
- ✓ Le code source reste confidentiel
- ✓ Utilisation soumise à licence commerciale
- ✓ Voir fichiers `LICENSE` et `COPYRIGHT` pour détails

---

## ✨ Fonctionnalités principales

### 🎯 MVP - Prêt à l'emploi

- ✅ **Multi-tenant complet** avec isolation des données par organisation
- ✅ **RBAC avancé** : 10 rôles système avec matrice de permissions complète
- ✅ **Gestion de projets** : Projets → Bâtiments → Étages → Lots
- ✅ **CRM intégré** : Pipeline commercial, prospects, réservations, acheteurs
- ✅ **Facturation SaaS** : Abonnements, plans (Basic/Pro/Enterprise), Datatrans ready
- ✅ **GED** : Documents, versioning, tags, liens contextuels
- ✅ **Finance** : CFC, budgets, contrats, factures, acomptes
- ✅ **Communication** : Messages, notifications, mentions
- ✅ **i18n** : 4 langues (FR/DE/EN/IT) avec fallback intelligent
- ✅ **Design system** : Composants UI premium inspirés de Linear/Stripe
- ✅ **Row Level Security** : Sécurité maximale via Supabase RLS

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou pnpm
- Compte Supabase (gratuit)

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Les variables d'environnement sont déjà configurées
# Supabase est déjà initialisé avec :
# - Base de données complète (7 migrations appliquées)
# - Données de démonstration (organisation, projet, lots)
# - Plans d'abonnement (Basic, Pro, Enterprise)

# 3. Lancer l'application en mode développement
npm run dev
```

L'application est disponible sur `http://localhost:5173`

### Données de démonstration

Le système contient déjà :
- **Organisation** : "Demo Promoteur SA"
- **Utilisateur** : demo@example.com (admin)
- **Projet** : "Résidence du Lac" avec 4 lots d'exemple
- **Plans SaaS** : Basic (99 CHF/mois), Pro (249 CHF/mois), Enterprise (999 CHF/mois)
- **Budget CFC** : Exemple avec postes principaux

---

## 📁 Structure du projet

```
project/
├── src/
│   ├── components/
│   │   ├── ui/              # Design system (Button, Card, Badge, Input)
│   │   └── layout/          # Layout (AppShell, Sidebar, Topbar)
│   ├── pages/               # Pages principales
│   │   ├── Dashboard.tsx
│   │   ├── ProjectsList.tsx
│   │   └── BillingPage.tsx
│   ├── hooks/               # Custom hooks React
│   │   ├── useCurrentUser.ts
│   │   ├── useProjects.ts
│   │   ├── useLots.ts
│   │   └── useBilling.ts
│   ├── lib/
│   │   ├── supabase.ts      # Client Supabase + types
│   │   └── i18n/            # Système i18n (4 langues)
│   └── App.tsx
├── ARCHITECTURE.md          # 📖 Documentation complète (LIRE EN PRIORITÉ)
└── README.md               # Ce fichier
```

---

## 📖 Documentation

### 🎓 Pour démarrer

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentation complète à lire absolument :
   - Vue d'ensemble de l'architecture
   - Modèle de données détaillé
   - RBAC & matrice de permissions
   - Multi-tenant & RLS
   - i18n & internationalisation
   - Frontend & design system
   - Backend Supabase
   - Facturation Datatrans
   - Roadmap produit (MVP → V1 → V2)

### 📚 Ressources techniques

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Datatrans API](https://docs.datatrans.ch)

---

## 🏗️ Architecture technique

### Stack

- **Frontend** : React 18 + TypeScript + Vite + Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Auth + RLS + Edge Functions)
- **Base de données** : PostgreSQL avec Row Level Security
- **Paiements** : Datatrans (PSP Suisse pour CHF, cartes, TWINT)
- **i18n** : 4 langues (FR, DE, EN, IT)

### Domaines métier

| Domaine | Tables | État |
|---------|--------|------|
| Identity | users, organizations, roles, permissions | ✅ Complet |
| Projects | projects, buildings, floors, lots | ✅ Complet |
| CRM | prospects, reservations, buyers | ✅ Complet |
| Finance | cfc_budgets, contracts, invoices, payments | ✅ Complet |
| Documents | documents, document_versions | ✅ Complet |
| Communication | message_threads, messages, notifications | ✅ Complet |
| Billing | plans, subscriptions, datatrans_* | ✅ Complet |
| Submissions | submissions, offers, adjudications | 📋 Schéma prêt |
| Notary | notary_files, notary_acts | 📋 Schéma prêt |
| Construction | phases, tasks, progress | 📋 Schéma prêt |

---

## 🔐 Sécurité & RBAC

### Rôles système (10)

1. **saas_admin** - Administrateur plateforme
2. **org_admin** - Administrateur organisation
3. **promoter** - Promoteur / Développeur
4. **general_contractor** - Entreprise Générale
5. **architect** - Architecte
6. **engineer** - Bureau technique
7. **notary** - Notaire
8. **broker** - Courtier
9. **buyer** - Acheteur
10. **supplier** - Entreprise soumissionnaire

### Sécurité

- ✅ Row Level Security (RLS) activé sur toutes les tables
- ✅ Policies restrictives par défaut
- ✅ Isolation multi-tenant par `organization_id`
- ✅ Permissions granulaires par ressource et action
- ✅ JWT tokens sécurisés via Supabase Auth

---

## 🌍 Internationalisation (i18n)

### 4 langues supportées

- 🇫🇷 **Français** (par défaut)
- 🇩🇪 **Deutsch**
- 🇬🇧 **English**
- 🇮🇹 **Italiano**

### Système à 2 niveaux

1. **Langue par défaut de l'organisation** (`organization.default_language`)
2. **Préférence utilisateur** (`user.language`)

### Utilisation

```typescript
import { useI18n } from '@/lib/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useI18n();

  return (
    <>
      <h1>{t('projects.title')}</h1>
      <button onClick={() => setLanguage('DE')}>
        Deutsch
      </button>
    </>
  );
}
```

---

## 💳 Facturation SaaS (Datatrans)

### Plans disponibles

| Plan | Prix/mois | Prix/an | Projets | Users | Stockage |
|------|-----------|---------|---------|-------|----------|
| **Basic** | 99 CHF | 990 CHF | 1 | 5 | 10 GB |
| **Pro** | 249 CHF | 2490 CHF | 10 | 25 | 100 GB |
| **Enterprise** | 999 CHF | 9990 CHF | ∞ | ∞ | ∞ |

### Flow de paiement

1. Sélection du plan + cycle (mensuel/annuel)
2. Ajout moyen de paiement (carte, TWINT, PostFinance)
3. Redirection vers Datatrans (lightbox sécurisée)
4. Confirmation et activation de l'abonnement
5. Facturation récurrente automatique via webhooks

### Tables

- `plans` - Plans d'abonnement
- `subscriptions` - Abonnements actifs
- `subscription_invoices` - Factures
- `payment_methods` - Moyens de paiement (alias Datatrans)
- `datatrans_transactions` - Historique transactions
- `datatrans_webhook_events` - Log webhooks

---

## 🎨 Design System

### Composants UI

- **Button** : 5 variants (primary, secondary, outline, ghost, danger)
- **Card** : Container avec hover effects et padding configurable
- **Badge** : Status indicators avec 5 variants de couleur
- **Input** : Champs de formulaire avec label, error, helper text

### Principes UX

- Style sobre et professionnel (inspiré Linear/Stripe)
- Transitions douces (200ms)
- Focus states accessibles
- Espacement cohérent (système 8px)
- Typographie hiérarchique claire

### Palette de couleurs

- **Primary** : Blue (#2563EB)
- **Success** : Green (#10B981)
- **Warning** : Yellow (#F59E0B)
- **Danger** : Red (#EF4444)
- **Neutral** : Gray scales

---

## 🧪 Scripts disponibles

```bash
# Développement
npm run dev              # Lance Vite en mode dev (port 5173)

# Production
npm run build            # Build optimisé pour production
npm run preview          # Preview du build production

# Quality
npm run lint             # Lint avec ESLint
npm run typecheck        # Vérification TypeScript
```

---

## 📊 Base de données (Supabase)

### Migrations appliquées

✅ 7 migrations ont été appliquées avec succès :

1. **001_create_identity_core** - Users, organizations, roles, permissions
2. **002_seed_roles_and_permissions** - 10 rôles + 55+ permissions
3. **003_create_projects_structure** - Projects, buildings, floors, lots
4. **004_create_crm_and_participants** - CRM, companies, contacts
5. **005_create_billing_module** - Plans, subscriptions, Datatrans
6. **006_create_documents_finance_communication** - Documents, finance, messages
7. **007_seed_initial_data_v2** - Données de démonstration

### Accès à la base de données

- URL Supabase : Voir `.env` (VITE_SUPABASE_URL)
- Dashboard : https://supabase.com/dashboard
- SQL Editor disponible pour requêtes personnalisées

---

## 🛠️ Développement

### Ajout d'une nouvelle page

```typescript
// src/pages/MyNewPage.tsx
import { useI18n } from '@/lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function MyNewPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('myPage.title')}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your content */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Ajout d'une nouvelle table

1. Créer une nouvelle migration SQL dans Supabase
2. Activer RLS + créer les policies
3. Ajouter le type dans `src/lib/supabase.ts`
4. Créer un hook personnalisé dans `src/hooks/`

### Ajout d'une traduction

```json
// src/lib/i18n/locales/fr.json
{
  "myModule": {
    "title": "Mon module",
    "description": "Description de mon module"
  }
}
```

Répéter pour `de.json`, `en.json`, `it.json`.

---

## 🚦 Roadmap

### ✅ MVP (Complété)

- Architecture multi-tenant
- RBAC complet
- Gestion projets & lots
- CRM basique
- Facturation SaaS
- i18n 4 langues
- Design system
- Documentation

### 📋 V1 (6-9 mois)

- Module soumissions complet
- Finance CFC avancée
- Dossiers notaire
- Choix matériaux acquéreurs
- Reporting avancé
- Mobile app (PWA)

### 🔮 V2 (12+ mois)

- Analytics produit
- Intégrations tierces (compta, CRM)
- API publique
- IA prédictive (prix, conversion)
- SSO / SAML
- White-label

---

## 📄 Licence

**Licence Propriétaire** - © Realpro SA. Tous droits réservés.

Ce logiciel est protégé par le droit d'auteur et les lois internationales sur la propriété intellectuelle. Toute utilisation, reproduction, modification ou distribution non autorisée est strictement interdite.

Voir le fichier [LICENSE](./LICENSE) pour les conditions complètes.

---

## 📞 Contact & Support

**Realpro SA**
[Adresse à compléter]
[Code postal et ville]
Suisse

- 📧 Email: contact@realpro.ch
- 🌐 Web: https://www.realpro.ch
- 📖 Documentation: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🔒 Confidentialité & Sécurité

Ce dépôt contient un code source propriétaire et confidentiel appartenant à Realpro SA.

**Restrictions:**
- ❌ Accès limité aux employés et partenaires autorisés de Realpro SA
- ❌ Interdiction de copier, modifier ou redistribuer sans autorisation
- ❌ Interdiction de décompiler ou faire de l'ingénierie inverse
- ❌ Toute violation fera l'objet de poursuites judiciaires

---

**Développé avec ❤️ en Suisse par Realpro SA**

*Version: 1.0.0 | Dernière mise à jour : Décembre 2024*
