# 🗺️ ARCHITECTURE DES ROUTES - RealPro SA

## Table des routes complète

---

## 🌐 ROUTES PUBLIQUES

### Landing & Marketing
```
/                           → Landing page
/features                   → Page fonctionnalités
/pricing                    → Page tarifs
/contact                    → Page contact
/legal/cgu                  → CGU
/legal/cgv                  → CGV
/legal/privacy              → Politique confidentialité
/legal/mentions-legales     → Mentions légales
```

### Authentification
```
/auth/login                 → Connexion
/auth/register              → Inscription
/auth/forgot-password       → Mot de passe oublié
/auth/reset-password        → Réinitialisation
/auth/subscription          → Choix du forfait
/auth/checkout              → Paiement
/auth/success               → Confirmation paiement
```

---

## 🔐 ROUTES PRIVÉES (Authentifiées)

### Onboarding
```
/onboarding/organization    → Création organisation (si nouveau)
/select-organization        → Sélection organisation (multi-org)
```

### Dashboard Global
```
/dashboard                  → Dashboard global promoteur
/dashboard/global           → Vue analytics globale
```

### Gestion Organisation
```
/settings/organization      → Paramètres organisation
/settings/branding          → Personnalisation marque
/settings/billing           → Facturation & abonnement
/settings/users             → Gestion utilisateurs
/settings/permissions       → Matrice permissions
/settings/security          → Paramètres sécurité
/settings/localization      → Langues & formats
```

---

## 🏢 ROUTES PROJET

### Structure de base
```
/projects                              → Liste projets
/projects/new                          → Créer projet (wizard)
/projects/[projectId]/dashboard        → Dashboard du projet
/projects/[projectId]/settings         → Paramètres du projet
```

---

### 📦 MODULE LOTS

```
/projects/[projectId]/lots                    → Liste lots
/projects/[projectId]/lots/new                → Créer lot
/projects/[projectId]/lots/import             → Import Excel
/projects/[projectId]/lots/[lotId]            → Détail lot
/projects/[projectId]/lots/[lotId]/edit       → Éditer lot
/projects/[projectId]/lots/[lotId]/history    → Historique
/projects/[projectId]/lots/[lotId]/documents  → Documents du lot
```

---

### 👥 MODULE CRM

```
/projects/[projectId]/crm                              → Pipeline Kanban
/projects/[projectId]/crm/prospects                    → Liste prospects
/projects/[projectId]/crm/prospects/new                → Nouveau prospect
/projects/[projectId]/crm/prospects/[prospectId]       → Fiche prospect
/projects/[projectId]/crm/prospects/[prospectId]/edit  → Éditer prospect

/projects/[projectId]/crm/buyers                       → Liste acheteurs
/projects/[projectId]/crm/buyers/[buyerId]             → Fiche acheteur
/projects/[projectId]/crm/buyers/[buyerId]/documents   → Documents acheteur
/projects/[projectId]/crm/buyers/[buyerId]/finance     → Finances acheteur

/projects/[projectId]/crm/pipeline                     → Vue pipeline
/projects/[projectId]/crm/reservations                 → Réservations
```

---

### ⚖️ MODULE NOTAIRE

```
/projects/[projectId]/notary                           → Dashboard notaire
/projects/[projectId]/notary/dossiers                  → Liste dossiers
/projects/[projectId]/notary/dossiers/[dossierId]      → Détail dossier
/projects/[projectId]/notary/acts                      → Actes notariés
/projects/[projectId]/notary/acts/[actId]              → Détail acte
/projects/[projectId]/notary/acts/[actId]/versions     → Versions acte
/projects/[projectId]/notary/checklist                 → Checklist globale
/projects/[projectId]/notary/messages                  → Communication notaire
```

---

### 🏢 MODULE COURTIERS

```
/projects/[projectId]/brokers                          → Liste courtiers
/projects/[projectId]/brokers/new                      → Nouveau courtier
/projects/[projectId]/brokers/[brokerId]               → Fiche courtier
/projects/[projectId]/brokers/[brokerId]/lots          → Lots attribués
/projects/[projectId]/brokers/[brokerId]/sales         → Ventes réalisées
/projects/[projectId]/brokers/[brokerId]/contracts     → Contrats
/projects/[projectId]/brokers/[brokerId]/kpi           → KPI courtier
/projects/[projectId]/brokers/performance              → Performance globale
```

#### Routes Portail Courtier (externe)
```
/broker/[projectId]/dashboard                          → Dashboard courtier
/broker/[projectId]/lots                               → Ses lots
/broker/[projectId]/contracts                          → Ses contrats
/broker/[projectId]/documents                          → Documents commerciaux
```

---

### 📁 MODULE DOCUMENTS

```
/projects/[projectId]/documents                        → Explorateur documents
/projects/[projectId]/documents/[folderId]             → Dossier spécifique
/projects/[projectId]/documents/[documentId]           → Détail document
/projects/[projectId]/documents/[documentId]/versions  → Versions
/projects/[projectId]/documents/[documentId]/share     → Partage
/projects/[projectId]/documents/search                 → Recherche
```

---

### 💰 MODULE FINANCES

#### Dashboard
```
/projects/[projectId]/finances                         → Dashboard finances
/projects/[projectId]/finances/overview                → Vue d'ensemble
```

#### CFC
```
/projects/[projectId]/finances/cfc                     → Budget CFC
/projects/[projectId]/finances/cfc/import              → Import Excel
/projects/[projectId]/finances/cfc/[cfcId]             → Détail CFC
/projects/[projectId]/finances/cfc/[cfcId]/invoices    → Factures du CFC
```

#### Factures
```
/projects/[projectId]/finances/invoices                → Liste factures
/projects/[projectId]/finances/invoices/new            → Nouvelle facture
/projects/[projectId]/finances/invoices/[invoiceId]    → Détail facture
/projects/[projectId]/finances/invoices/[invoiceId]/validate → Validation
```

#### Paiements
```
/projects/[projectId]/finances/payments                → Paiements acheteurs
/projects/[projectId]/finances/payments/[buyerId]      → Plan paiement acheteur
/projects/[projectId]/finances/payments/overdue        → Retards
```

#### Contrats
```
/projects/[projectId]/finances/contracts               → Contrats fournisseurs
/projects/[projectId]/finances/contracts/[contractId]  → Détail contrat
```

---

### 🛠️ MODULE SOUMISSIONS

```
/projects/[projectId]/tenders                          → Liste soumissions
/projects/[projectId]/tenders/new                      → Nouvelle soumission
/projects/[projectId]/tenders/[tenderId]               → Détail soumission
/projects/[projectId]/tenders/[tenderId]/edit          → Éditer
/projects/[projectId]/tenders/[tenderId]/companies     → Entreprises invitées
/projects/[projectId]/tenders/[tenderId]/offers        → Offres reçues
/projects/[projectId]/tenders/[tenderId]/comparison    → Comparaison
/projects/[projectId]/tenders/[tenderId]/clarifications → Clarifications
/projects/[projectId]/tenders/[tenderId]/award         → Adjudication
```

#### Portail Soumission Entreprise (externe)
```
/tenders/[tenderId]/view                               → Consultation
/tenders/[tenderId]/submit                             → Dépôt offre
/tenders/[tenderId]/clarifications                     → Questions
```

---

### 🎨 MODULE MODIFICATIONS TECHNIQUES

#### Demandes
```
/projects/[projectId]/modifications                              → Liste modifications
/projects/[projectId]/modifications/new                          → Nouvelle demande
/projects/[projectId]/modifications/[modificationId]             → Détail modification
/projects/[projectId]/modifications/[modificationId]/appointment → RDV fournisseur
```

#### Offres Fournisseurs
```
/projects/[projectId]/modifications/offers                       → Liste offres
/projects/[projectId]/modifications/offers/[offerId]             → Détail offre
/projects/[projectId]/modifications/offers/[offerId]/validate    → Validation client
/projects/[projectId]/modifications/offers/[offerId]/architect   → Validation architecte
```

#### Avenants
```
/projects/[projectId]/modifications/avenants                     → Liste avenants
/projects/[projectId]/modifications/avenants/[avenantId]         → Détail avenant
/projects/[projectId]/modifications/avenants/[avenantId]/sign    → Signature
/projects/[projectId]/modifications/avenants/[avenantId]/pdf     → Télécharger PDF
```

#### Portail Fournisseur (externe)
```
/supplier/appointments/[appointmentId]                           → RDV fournisseur
/supplier/appointments/[appointmentId]/offer                     → Déposer offre
/supplier/appointments/[appointmentId]/edit                      → Modifier offre
```

---

### 🚧 MODULE CHANTIER

#### Planning
```
/projects/[projectId]/construction                               → Dashboard chantier
/projects/[projectId]/construction/planning                      → Planning Gantt
/projects/[projectId]/construction/planning/phases               → Phases
/projects/[projectId]/construction/planning/tasks                → Tâches
/projects/[projectId]/construction/planning/milestones           → Jalons
```

#### Photos
```
/projects/[projectId]/construction/photos                        → Galerie photos
/projects/[projectId]/construction/photos/upload                 → Upload
/projects/[projectId]/construction/photos/timeline               → Timeline
/projects/[projectId]/construction/photos/zones                  → Par zone
```

#### Journal
```
/projects/[projectId]/construction/diary                         → Journal chantier
/projects/[projectId]/construction/diary/new                     → Nouvelle entrée
/projects/[projectId]/construction/diary/[entryId]               → Détail entrée
```

#### Avancement Acheteurs
```
/projects/[projectId]/construction/buyers-progress               → Avancement par lot
/projects/[projectId]/construction/buyers-progress/[lotId]       → Détail lot
```

#### Rapports
```
/projects/[projectId]/construction/reports                       → Rapports chantier
/projects/[projectId]/construction/reports/weekly                → Hebdomadaires
/projects/[projectId]/construction/reports/monthly               → Mensuels
```

---

### 💬 MODULE COMMUNICATION

```
/projects/[projectId]/communication                              → Hub communication
/projects/[projectId]/communication/general                      → Fil général
/projects/[projectId]/communication/construction                 → Fil chantier
/projects/[projectId]/communication/finance                      → Fil finances
/projects/[projectId]/communication/lots/[lotId]                 → Fil par lot
/projects/[projectId]/communication/buyers/[buyerId]             → Fil acheteur
/projects/[projectId]/communication/threads/[threadId]           → Fil spécifique
```

---

### 📊 MODULE REPORTING

```
/projects/[projectId]/reporting                                  → Dashboard reporting
/projects/[projectId]/reporting/overview                         → Vue d'ensemble
/projects/[projectId]/reporting/sales                            → Rapport ventes
/projects/[projectId]/reporting/finance                          → Rapport finances
/projects/[projectId]/reporting/cfc                              → Rapport CFC
/projects/[projectId]/reporting/construction                     → Rapport chantier
/projects/[projectId]/reporting/custom                           → Rapports personnalisés
/projects/[projectId]/reporting/export                           → Exports
```

---

### 📤 MODULE EXPORTS

```
/projects/[projectId]/exports                                    → Centre exports
/projects/[projectId]/exports/new                                → Nouvel export
/projects/[projectId]/exports/templates                          → Templates
/projects/[projectId]/exports/history                            → Historique
```

---

## 👤 ROUTES ESPACE ACHETEUR

### Portail Acheteur (externe)
```
/buyer/login                                                     → Connexion acheteur
/buyer/dashboard                                                 → Dashboard acheteur
/buyer/my-lot                                                    → Mon lot
/buyer/documents                                                 → Mes documents
/buyer/payments                                                  → Mes paiements
/buyer/payments/invoices                                         → Mes QR-factures
/buyer/modifications                                             → Mes modifications
/buyer/modifications/new                                         → Nouvelle demande
/buyer/modifications/[modificationId]                            → Détail modification
/buyer/choices                                                   → Mes choix matériaux
/buyer/choices/appointments                                      → Mes RDV fournisseurs
/buyer/progress                                                  → Avancement chantier
/buyer/progress/photos                                           → Photos
/buyer/messages                                                  → Mes messages
/buyer/handover                                                  → Remise clés
/buyer/after-sales                                               → SAV
/buyer/after-sales/new                                           → Nouveau ticket SAV
```

---

## 🔧 ROUTES ADMIN

### Admin Global (Super Admin)
```
/admin                                                           → Dashboard admin
/admin/organizations                                             → Toutes organisations
/admin/organizations/[orgId]                                     → Détail organisation
/admin/users                                                     → Tous utilisateurs
/admin/subscriptions                                             → Abonnements
/admin/billing                                                   → Facturation globale
/admin/feature-flags                                             → Feature flags
/admin/audit-logs                                                → Logs audit
/admin/system                                                    → Système
```

### Admin Organisation
```
/admin/org/users                                                 → Utilisateurs org
/admin/org/users/invite                                          → Inviter utilisateur
/admin/org/users/[userId]                                        → Profil utilisateur
/admin/org/permissions                                           → Permissions
/admin/org/audit                                                 → Audit org
```

---

## 🎨 ROUTES DESIGN SYSTEM

```
/design-system                                                   → Showcase design system
/design-system/colors                                            → Palette couleurs
/design-system/typography                                        → Typographie
/design-system/components                                        → Composants
/design-system/layouts                                           → Layouts
```

---

## 📱 API ROUTES (Edge Functions)

### Authentification
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/reset-password
```

### Projets
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/[projectId]
PUT    /api/projects/[projectId]
DELETE /api/projects/[projectId]
```

### Lots
```
GET    /api/projects/[projectId]/lots
POST   /api/projects/[projectId]/lots
POST   /api/projects/[projectId]/lots/import
GET    /api/projects/[projectId]/lots/[lotId]
PUT    /api/projects/[projectId]/lots/[lotId]
```

### CRM
```
GET    /api/projects/[projectId]/prospects
POST   /api/projects/[projectId]/prospects
PUT    /api/projects/[projectId]/prospects/[prospectId]
POST   /api/projects/[projectId]/prospects/[prospectId]/convert
```

### Finances
```
GET    /api/projects/[projectId]/finances/cfc
POST   /api/projects/[projectId]/finances/cfc/import
GET    /api/projects/[projectId]/finances/invoices
POST   /api/projects/[projectId]/finances/invoices
POST   /api/projects/[projectId]/finances/payments/qr-invoice
```

### Modifications
```
POST   /api/projects/[projectId]/modifications
POST   /api/projects/[projectId]/modifications/offers/[offerId]/validate
POST   /api/projects/[projectId]/modifications/avenants/generate
POST   /api/projects/[projectId]/modifications/avenants/sign
POST   /api/projects/[projectId]/modifications/avenants/inject
```

### Soumissions
```
GET    /api/projects/[projectId]/tenders
POST   /api/projects/[projectId]/tenders
POST   /api/projects/[projectId]/tenders/[tenderId]/invite
POST   /api/tenders/[tenderId]/submit-offer
```

### Documents
```
POST   /api/projects/[projectId]/documents/upload
GET    /api/projects/[projectId]/documents/[documentId]/download
POST   /api/projects/[projectId]/documents/[documentId]/share
```

### Exports
```
POST   /api/projects/[projectId]/exports/generate
GET    /api/projects/[projectId]/exports/[exportId]/download
```

### Notifications
```
GET    /api/notifications
POST   /api/notifications/mark-read
POST   /api/notifications/mark-all-read
```

### Billing
```
POST   /api/billing/create-checkout
POST   /api/billing/create-portal-session
GET    /api/billing/invoices
POST   /api/billing/upgrade
POST   /api/billing/downgrade
```

---

## 🗺️ STRUCTURE HIÉRARCHIQUE

```
/
├── auth/                    [Public]
│   ├── login
│   ├── register
│   └── subscription
│
├── dashboard                [Private - Promoteur]
│
├── projects/                [Private - Par rôle]
│   ├── [projectId]/
│   │   ├── dashboard
│   │   ├── lots/
│   │   ├── crm/
│   │   ├── notary/
│   │   ├── brokers/
│   │   ├── documents/
│   │   ├── finances/
│   │   ├── tenders/
│   │   ├── modifications/
│   │   ├── construction/
│   │   ├── communication/
│   │   └── reporting/
│   │
│   └── new
│
├── buyer/                   [External - Acheteur]
│   ├── dashboard
│   ├── my-lot
│   ├── documents
│   ├── payments
│   ├── modifications/
│   ├── choices/
│   ├── progress
│   └── messages
│
├── broker/                  [External - Courtier]
│   └── [projectId]/
│       ├── dashboard
│       ├── lots
│       └── contracts
│
├── supplier/                [External - Fournisseur]
│   └── appointments/
│       └── [appointmentId]/
│           └── offer
│
├── tenders/                 [External - Entreprise]
│   └── [tenderId]/
│       ├── view
│       └── submit
│
├── admin/                   [Private - Admin]
│   ├── organizations/
│   ├── users/
│   ├── subscriptions/
│   └── audit-logs/
│
└── settings/                [Private - Organisation]
    ├── organization
    ├── billing
    ├── users
    └── permissions
```

---

## 🔐 PROTECTION DES ROUTES

### Middleware de protection

```typescript
// Niveaux de protection
enum RouteProtection {
  PUBLIC,           // Accessible à tous
  AUTHENTICATED,    // Nécessite connexion
  ORGANIZATION,     // Nécessite organisation
  PROJECT_MEMBER,   // Nécessite être membre du projet
  ROLE_SPECIFIC,    // Nécessite un rôle spécifique
  ADMIN,           // Admin uniquement
  SUPER_ADMIN      // Super admin uniquement
}

// Exemple
Route: /projects/[projectId]/finances
Protection: [AUTHENTICATED, PROJECT_MEMBER, ROLE: 'promoter']

Route: /buyer/dashboard
Protection: [AUTHENTICATED, ROLE: 'buyer']

Route: /admin
Protection: [AUTHENTICATED, SUPER_ADMIN]
```

---

## 📊 STATISTIQUES

```
Total routes: ~200+
Routes publiques: ~15
Routes privées promoteur: ~120
Routes externes (buyer/broker/supplier): ~40
Routes admin: ~20
API endpoints: ~80

Modules principaux: 10
Sous-modules: ~35
Niveaux hiérarchiques: 5
```

---

## ✅ VALIDATION

Cette architecture de routes:
- ✅ Suit les conventions REST
- ✅ Hiérarchie claire et logique
- ✅ Isolation par projet garantie
- ✅ Permissions granulaires
- ✅ Portails externes sécurisés
- ✅ URLs lisibles et SEO-friendly
- ✅ Évolutive et maintenable

**Prête pour implémentation complète! 🚀**
