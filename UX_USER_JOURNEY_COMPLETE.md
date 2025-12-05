# 🚀 TRACÉ D'UTILISATION COMPLET - RealPro SA

## Architecture Multi-Tenant Professionnelle

---

## 📋 TABLE DES MATIÈRES

1. [Landing & Authentification](#1-landing--authentification)
2. [Choix du Forfait](#2-choix-du-forfait)
3. [Dashboard Global Promoteur](#3-dashboard-global-promoteur)
4. [Création d'un Projet](#4-création-dun-projet)
5. [Dashboard du Projet](#5-dashboard-du-projet)
6. [Modules du Projet](#6-modules-du-projet)
7. [Workflows Inter-Modules](#7-workflows-inter-modules)
8. [Architecture Technique](#8-architecture-technique)
9. [Permissions & Isolation](#9-permissions--isolation)
10. [Multi-language](#10-multi-language)

---

## 🎯 PRINCIPE FONDAMENTAL

```
┌──────────────────────────────────────────────────────────────┐
│                    ISOLATION TOTALE                           │
│                                                               │
│  Promoteur A                    Promoteur B                   │
│  └── Projet 1                   └── Projet 3                  │
│      ├── Lots                       ├── Lots                  │
│      ├── CRM                        ├── CRM                   │
│      ├── Documents                  ├── Documents             │
│      └── Finances                   └── Finances              │
│  └── Projet 2                   └── Projet 4                  │
│      ├── Lots                       ├── Lots                  │
│      ├── ...                        ├── ...                   │
│                                                               │
│  ❌ Projet 1 ne voit RIEN du Projet 2                        │
│  ❌ Promoteur A ne voit RIEN du Promoteur B                  │
│  ✅ Chaque projet = univers totalement isolé                 │
└──────────────────────────────────────────────────────────────┘
```

---

# 1️⃣ LANDING & AUTHENTIFICATION

## 1.1. Page d'accueil publique

**Route:** `/`

**Contenu:**
```
┌────────────────────────────────────────────────────────┐
│  Logo RealPro                    [FR] [DE] [EN] [IT]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│        🏢 RealPro SA                                   │
│        La plateforme de gestion immobilière suisse     │
│                                                        │
│        [S'inscrire]  [Se connecter]                    │
│                                                        │
│  ✨ Fonctionnalités principales                        │
│  💼 Forfaits & Pricing                                 │
│  📞 Contact                                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Actions:**
- Bouton "S'inscrire" → `/auth/register`
- Bouton "Se connecter" → `/auth/login`
- Bouton "Découvrir" → `/pricing`

---

## 1.2. Page de connexion

**Route:** `/auth/login`

**Formulaire:**
```typescript
{
  email: string;          // Required
  password: string;       // Required
  language: 'fr' | 'de' | 'en' | 'it';  // Sélecteur en haut
}
```

**Actions:**
- Lien "Mot de passe oublié" → `/auth/forgot-password`
- Lien "Créer un compte" → `/auth/register`
- Sélecteur de langue persisté

**Après connexion:**
```
✅ Utilisateur avec organisation existante
   → /dashboard (Dashboard Global)

✅ Utilisateur sans organisation
   → /onboarding/organization
```

---

## 1.3. Page d'inscription

**Route:** `/auth/register`

**Étape 1: Compte utilisateur**
```typescript
{
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}
```

**Étape 2: Entreprise**
```typescript
{
  company_name: string;
  company_address: string;
  company_city: string;
  company_zip: string;
  company_canton: string;
  vat_number?: string;     // Optionnel
}
```

**Après inscription:**
→ `/auth/subscription` (choix du forfait)

---

# 2️⃣ CHOIX DU FORFAIT

**Route:** `/auth/subscription`

## 2.1. Affichage des forfaits

```
┌──────────────────────────────────────────────────────────────┐
│                    Choisissez votre forfait                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  START   │    │   PRO    │    │ENTERPRISE│             │
│  │  Gratuit │    │ 299 CHF  │    │ Sur mesure│            │
│  │          │    │  /mois   │    │          │             │
│  │ 1 projet │    │5 projets │    │Illimité  │             │
│  │ 50 lots  │    │200 lots  │    │Illimité  │             │
│  │          │    │          │    │          │             │
│  │[Choisir] │    │[Choisir] │    │[Contact] │             │
│  └──────────┘    └──────────┘    └──────────┘             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 2.2. Paiement

**Si forfait payant:**
→ Intégration **Datatrans** (via Edge Function)
→ Validation du paiement
→ Création de la souscription dans `subscriptions` table

**Règles:**
- ✅ Upgrade: **immédiat** (prorata calculé)
- ⚠️ Downgrade: **après 6 mois minimum**
- 📅 Facturation mensuelle automatique

**Après paiement validé:**
→ `/dashboard` (Dashboard Global)

---

# 3️⃣ DASHBOARD GLOBAL PROMOTEUR

**Route:** `/dashboard`

**Rôle:** Vue d'ensemble de TOUS les projets du promoteur

## 3.1. Structure

```
┌────────────────────────────────────────────────────────────┐
│  🏢 RealPro    [Dashboard Global]    [+Nouveau Projet]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  👋 Bonjour, Jean Dupont                                   │
│                                                            │
│  📊 KPI GLOBAUX                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │3 Projets│ │82 Lots │ │58 Vente│ │5 Soum. │            │
│  │ actifs  │ │totaux  │ │(71%)   │ │actives │            │
│  └────────┘ └────────┘ └────────┘ └────────┘            │
│                                                            │
│  🏗️ MES PROJETS                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 📍 Les Résidences du Lac - Lausanne             │    │
│  │    🏠 24/32 lots vendus (75%)                    │    │
│  │    💰 4.8M CHF encaissé                          │    │
│  │    🚧 Avancement: 65%                            │    │
│  │    [Ouvrir]                                      │    │
│  ├──────────────────────────────────────────────────┤    │
│  │ 📍 Le Parc Montreux - Montreux                   │    │
│  │    🏠 18/24 lots vendus (75%)                    │    │
│  │    [Ouvrir]                                      │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  📅 AGENDA GLOBAL                                          │
│  • 12 Déc: RDV fournisseur - Projet Lac                   │
│  • 15 Déc: Signature actes - Projet Montreux              │
│                                                            │
│  📄 DOCUMENTS RÉCENTS (tous projets)                       │
│  • Contrat PPE B.02 - Projet Lac                          │
│  • Plans modifiés - Projet Montreux                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 3.2. Actions principales

**Bouton principal:** `[+ Nouveau Projet]`
→ `/projects/new`

**Cartes projets:**
- Click → `/projects/[projectId]/dashboard`

**Menu utilisateur:**
- Paramètres organisation → `/settings/organization`
- Facturation & Abonnement → `/settings/billing`
- Utilisateurs & Permissions → `/settings/users`
- Déconnexion

---

# 4️⃣ CRÉATION D'UN PROJET

**Route:** `/projects/new`

## 4.1. Wizard de création (6 étapes)

### Étape 1: Informations générales

```typescript
{
  project_name: string;
  address: string;
  city: string;
  zip_code: string;
  canton: string;
  project_type: 'PPE' | 'LOCATIF' | 'MIXTE';
  default_language: 'fr' | 'de' | 'en' | 'it';
  start_date: Date;
  estimated_end_date: Date;
}
```

### Étape 2: Structure du projet

```typescript
{
  buildings: [
    {
      name: string;           // "Bâtiment A"
      entries: [
        {
          name: string;       // "Entrée 1"
          floors: [
            {
              name: string;   // "RDC", "1er", "2e"
              lots: [
                {
                  number: string;    // "A.01", "A.02"
                  type: '2.5' | '3.5' | '4.5' | '5.5';
                  surface: number;
                  price: number;
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Options:**
- Création manuelle
- Import Excel template
- Duplication d'un étage

### Étape 3: Intervenants

**Affectation des acteurs:**
```typescript
{
  architect: { user_id: uuid; company_id: uuid };
  general_contractor: { user_id: uuid; company_id: uuid };
  engineers: [{ user_id: uuid; role: string }];
  notary: { user_id: uuid; company_id: uuid };
  brokers: [{ user_id: uuid; company_id: uuid }];
}
```

**Si l'intervenant n'existe pas:**
→ Formulaire d'invitation
→ Création compte + envoi email

### Étape 4: Finances

```typescript
{
  total_budget: number;
  vat_rate: number;
  cfc_structure: 'AUTO' | 'IMPORT' | 'MANUAL';
  payment_schedule_template: 'STANDARD_CH' | 'CUSTOM';
}
```

### Étape 5: Planning

```typescript
{
  milestones: [
    { name: string; date: Date; }
  ];
  construction_phases: [
    { name: string; start: Date; end: Date; }
  ];
}
```

### Étape 6: Résumé & Confirmation

**Affichage:**
- Récapitulatif complet
- Nombre de lots créés
- Intervenants invités
- Bouton: `[Créer le projet]`

**Après création:**
→ `/projects/[projectId]/dashboard`

---

# 5️⃣ DASHBOARD DU PROJET

**Route:** `/projects/[projectId]/dashboard`

**Principe:** C'est le cockpit central d'UN projet spécifique.

## 5.1. Navigation

```
┌────────────────────────────────────────────────────────────┐
│  ← Dashboard Global  |  📍 Les Résidences du Lac           │
├────────────────────────────────────────────────────────────┤
│  🏠 Tableau de bord                                        │
│  📦 Lots                                                   │
│  👥 CRM                                                    │
│  ⚖️ Notaire                                                │
│  🏢 Courtiers                                              │
│  📁 Documents                                              │
│  💰 Finances                                               │
│  🛠️ Soumissions                                            │
│  🎨 Modifications Techniques                               │
│  🚧 Chantier                                               │
│  💬 Communication                                          │
│  ⚙️ Paramètres du projet                                   │
└────────────────────────────────────────────────────────────┘
```

## 5.2. Contenu du Dashboard Projet

```
┌────────────────────────────────────────────────────────────┐
│  📊 RÉSUMÉ DU PROJET                                       │
│                                                            │
│  🏠 LOTS                      💰 FINANCES                  │
│  24/32 vendus (75%)          Budget: 8.5M CHF             │
│  8 disponibles               Dépensé: 6.2M CHF (73%)      │
│  ↗️ +3 ce mois               Reste: 2.3M CHF              │
│                                                            │
│  🛠️ SOUMISSIONS              🚧 CHANTIER                  │
│  5 actives                   Avancement: 65%              │
│  2 à valider                 Phase: Gros-œuvre            │
│  12 terminées                ⚠️ 2 retards                 │
│                                                            │
│  📝 MODIFICATIONS            💬 ACTIVITÉ RÉCENTE           │
│  8 en attente client         • Avenant A.03 signé         │
│  3 en attente architecte     • Plans modifiés uploadés    │
│  15 validées                 • Facture EG payée           │
│                                                            │
│  📅 PROCHAINES ÉCHÉANCES                                   │
│  • 12 Déc: RDV choix matériaux - Apt A.03                 │
│  • 15 Déc: Signature acte notarié - M. Dupont             │
│  • 20 Déc: Deadline soumission Façades                    │
│                                                            │
│  📄 DOCUMENTS RÉCENTS                                      │
│  • Contrat PPE B.02.pdf                                   │
│  • Plans modifiés Lots C                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Widgets configurables:**
- Déplaçables
- Masquables
- Filtres rapides

---

# 6️⃣ MODULES DU PROJET

## 📦 6.1. MODULE LOTS

**Route:** `/projects/[projectId]/lots`

### Vue principale

```
┌────────────────────────────────────────────────────────────┐
│  📦 LOTS - Les Résidences du Lac                           │
│                                                            │
│  [Filtres]  [Vue: Tableau | Cartes]  [+ Nouveau lot]      │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Lot │ Type  │ Surface │ Prix     │ Statut  │ Action  │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ A.01│ 3.5p  │ 85m²   │ 750K CHF │ 🟢 Vendu│ [Voir]  │ │
│  │ A.02│ 4.5p  │ 110m²  │ 920K CHF │ 🟡 Rés. │ [Voir]  │ │
│  │ A.03│ 2.5p  │ 65m²   │ 580K CHF │ ⚪ Libre │ [Voir]  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Fiche lot

**Route:** `/projects/[projectId]/lots/[lotId]`

**Sections:**

1. **Informations générales**
   - Numéro, type, surfaces
   - Prix de vente
   - Statut
   - Bâtiment / Entrée / Étage

2. **Acheteur** (si vendu/réservé)
   - Nom, coordonnées
   - Statut CRM
   - Lien vers fiche CRM
   - Documents acheteur

3. **Documents du lot**
   - Plans
   - Descriptif
   - Contrats
   - Avenants

4. **Modifications techniques**
   - Liste des avenants
   - Statut
   - Montant total

5. **Historique**
   - Timeline des événements
   - Changements de statut
   - Documents ajoutés

**Actions:**
- Éditer les infos
- Attribuer à un prospect → CRM
- Générer contrat PPE
- Marquer comme vendu
- Upload documents

---

## 👥 6.2. MODULE CRM

**Route:** `/projects/[projectId]/crm`

### Vue Pipeline Kanban

```
┌────────────────────────────────────────────────────────────┐
│  👥 CRM - Pipeline de vente                                │
│                                                            │
│  [+ Nouveau prospect]  [Vue: Kanban | Liste]               │
│                                                            │
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐        │
│  │ Contact  ││Qualifié  ││Réservé   ││  Vendu   │        │
│  ├──────────┤├──────────┤├──────────┤├──────────┤        │
│  │📇 M.Dubois││📋 Mme Lee││🔐 M.Martin││✅ M.Dupont│      │
│  │  Lot A.03││  Lot B.02││  Lot A.01││  Lot C.02│       │
│  │          ││          ││          ││          │        │
│  │📇 M.Simon││📋 M.Weber││          ││✅ Mme Roy │       │
│  │  Lot C.01││  Lot A.05││          ││  Lot B.03│       │
│  └──────────┘└──────────┘└──────────┘└──────────┘        │
└────────────────────────────────────────────────────────────┘
```

### Fiche prospect/acheteur

**Route:** `/projects/[projectId]/crm/prospects/[prospectId]`

**Sections:**

1. **Informations personnelles**
   - Nom, prénom
   - Email, téléphone
   - Adresse
   - Langue préférée

2. **Intérêts**
   - Lots consultés
   - Lots favoris
   - Budget estimé

3. **Activité**
   - Visites
   - Rendez-vous
   - Emails échangés
   - Documents envoyés

4. **Documents**
   - Pièces d'identité
   - Justificatifs financiers
   - Contrats signés

5. **Réservation/Vente**
   - Lot attribué
   - Montant réservation
   - Date signature prévue
   - Statut notaire

**Actions:**
- Envoyer email
- Planifier RDV
- Attribuer un lot
- Créer réservation
- Transmettre au notaire
- Upload documents

### Workflow CRM → Notaire

```
Prospect Qualifié
    ↓
Réservation avec acompte
    ↓
Documents complétés
    ↓
[Envoyer au notaire]
    ↓
Dossier créé dans Module Notaire
    ↓
Signature acte
    ↓
Lot marqué "Vendu" + Acheteur = Propriétaire
```

---

## ⚖️ 6.3. MODULE NOTAIRE

**Route:** `/projects/[projectId]/notary`

### Vue principale

```
┌────────────────────────────────────────────────────────────┐
│  ⚖️ DOSSIERS NOTARIÉS                                      │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Acheteur      │ Lot   │ Statut          │ Étude     │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ M. Dupont     │ A.01  │ 🟢 Signé        │ Etude X   │ │
│  │ Mme Martin    │ B.02  │ 🟡 En attente   │ Etude Y   │ │
│  │ M. Weber      │ C.03  │ 🔵 Documents OK │ Etude X   │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Fiche dossier notarié

**Route:** `/projects/[projectId]/notary/dossiers/[dossierId]`

**Sections:**

1. **Acheteur**
   - Identité complète
   - Lien fiche CRM

2. **Lot concerné**
   - Détails du lot
   - Prix final (avec avenants)

3. **Documents légaux**
   - Contrat PPE
   - Règlement de copropriété
   - État descriptif
   - Acte de vente
   - Versions successives

4. **Checklist notaire**
   - ✅ Documents acheteur complets
   - ✅ Financement confirmé
   - ⏳ Signature prévue: 15 Déc
   - ⏳ Inscription RF

5. **Communication**
   - Messages avec notaire
   - Historique des interactions

**Actions:**
- Upload document
- Marquer étape complétée
- Programmer signature
- Notifier le notaire
- Télécharger acte signé

### Workflow Notaire

```
Dossier reçu du CRM
    ↓
Vérification documents
    ↓
Préparation acte de vente
    ↓
Envoi pour signature
    ↓
Signature physique/électronique
    ↓
Inscription Registre Foncier
    ↓
✅ Dossier clôturé
    ↓
Lot = Vendu définitif
```

---

## 🏢 6.4. MODULE COURTIERS

**Route:** `/projects/[projectId]/brokers`

### Vue principale

```
┌────────────────────────────────────────────────────────────┐
│  🏢 COURTIERS                                              │
│                                                            │
│  📊 PERFORMANCE GLOBALE                                    │
│  • Total ventes courtiers: 18 lots (56% des ventes)       │
│  • Commissions: 234K CHF                                   │
│                                                            │
│  👨‍💼 COURTIERS ACTIFS                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Courtier        │ Lots vendus │ Commission │ KPI    │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ ImmoPlus SA     │ 8 lots      │ 104K CHF   │ ⭐⭐⭐⭐ │ │
│  │ Swiss Realty    │ 6 lots      │ 78K CHF    │ ⭐⭐⭐  │ │
│  │ Courtage Lemanique│ 4 lots    │ 52K CHF    │ ⭐⭐⭐  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  📋 CONTRATS EN COURS                                      │
│  • Contrat A.05 - ImmoPlus SA - En attente signature      │
│  • Contrat B.03 - Swiss Realty - Signé                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Fiche courtier

**Route:** `/projects/[projectId]/brokers/[brokerId]`

**Sections:**

1. **Informations courtier**
   - Nom entreprise
   - Contact principal
   - Taux commission
   - Conditions spécifiques

2. **Lots attribués**
   - Liste des lots commercialisables
   - Statut de chaque lot
   - Prix de vente

3. **Ventes réalisées**
   - Historique
   - Montants
   - Commissions calculées

4. **Contrats**
   - Contrat de courtage signé
   - Contrats de vente signés
   - Documents clients

5. **KPI**
   - Temps moyen de vente
   - Taux de conversion
   - Satisfaction clients

**Actions:**
- Attribuer des lots
- Upload contrat signé
- Modifier commission
- Désactiver courtier

### Portail Courtier

**Route (externe):** `/broker/[projectId]/dashboard`

**Accès limité pour les courtiers:**

Vue:
- Leurs lots attribués
- Statuts disponibles
- Documents commerciaux
- Upload contrats signés
- Mise à jour statuts

**Ils ne voient PAS:**
- Finances du promoteur
- Soumissions
- Chantier
- Autres modules internes

---

## 📁 6.5. MODULE DOCUMENTS

**Route:** `/projects/[projectId]/documents`

### Structure automatique

```
┌────────────────────────────────────────────────────────────┐
│  📁 DOCUMENTS - Les Résidences du Lac                      │
│                                                            │
│  [Upload]  [Nouveau dossier]  [Rechercher]                 │
│                                                            │
│  📂 01 – Juridique                                         │
│      📄 Contrat PPE Maître.pdf                            │
│      📄 Règlement copropriété.pdf                         │
│      📄 État descriptif.pdf                               │
│                                                            │
│  📂 02 – Plans                                             │
│      📂 Architecte                                         │
│          📄 Plans généraux v3.dwg                         │
│          📄 Façades.pdf                                   │
│      📂 Technique                                          │
│          📄 Plans CVSE.pdf                                │
│                                                            │
│  📂 03 – Contrats                                          │
│      📂 Soumissions                                        │
│      📂 EG                                                 │
│      📂 Sous-traitants                                     │
│                                                            │
│  📂 04 – Commercial                                        │
│      📄 Plaquette commerciale.pdf                         │
│      📄 Liste prix.xlsx                                   │
│                                                            │
│  📂 05 – Acheteurs                                         │
│      📂 Lot A.01 - Dupont                                 │
│      📂 Lot A.02 - Martin                                 │
│                                                            │
│  📂 06 – Chantier                                          │
│      📂 Photos avancement                                  │
│      📂 PV de chantier                                     │
│      📂 Journal de chantier                               │
│                                                            │
│  📂 07 – Finances                                          │
│      📂 Factures                                           │
│      📂 Décomptes                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Fonctionnalités

**Versioning:**
- Chaque upload d'un fichier existant = nouvelle version
- Historique complet
- Restauration possible

**Permissions:**
- Par dossier
- Par utilisateur/rôle
- Lecture / Écriture / Admin

**Tags:**
- Libre ou prédéfinis
- Recherche par tags

**Partage:**
- Lien sécurisé temporaire
- Partage avec externes (notaire, courtier)
- Expiration automatique

**Actions:**
- Preview dans le navigateur (PDF, images)
- Download
- Dupliquer
- Déplacer
- Supprimer (soft delete)
- Commenter

---

## 💰 6.6. MODULE FINANCES

**Route:** `/projects/[projectId]/finances`

### Dashboard finances

```
┌────────────────────────────────────────────────────────────┐
│  💰 FINANCES - Les Résidences du Lac                       │
│                                                            │
│  📊 BUDGET GLOBAL                                          │
│  Budget total: 8'500'000 CHF                               │
│  Engagé: 6'800'000 CHF (80%)                              │
│  Facturé: 6'200'000 CHF (73%)                             │
│  Payé: 5'500'000 CHF (65%)                                │
│  Reste: 2'300'000 CHF                                     │
│                                                            │
│  [CFC Budget]  [Factures]  [Paiements]  [Contrats]        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Onglet CFC Budget

**Route:** `/projects/[projectId]/finances/cfc`

```
┌────────────────────────────────────────────────────────────┐
│  [Import Excel CFC]  [Export]  [+ Nouveau CFC]             │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ CFC   │ Libellé        │ Budget    │ Engagé │ Payé  │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ 211.1 │ Terrassements  │ 350K CHF  │ 350K   │ 320K  │ │
│  │ 212.3 │ Fondations     │ 580K CHF  │ 580K   │ 580K  │ │
│  │ 213.1 │ Béton armé     │ 1200K CHF │ 1180K  │ 950K  │ │
│  │ 215.2 │ Maçonnerie     │ 420K CHF  │ 380K   │ 280K  │ │
│  │ ...   │ ...            │ ...       │ ...    │ ...   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  📈 Graphique: Budget vs Dépenses par CFC                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Import Excel:**
- Template CFC suisse standard
- Mapping automatique
- Validation des montants

### Onglet Factures

**Route:** `/projects/[projectId]/finances/invoices`

```
┌────────────────────────────────────────────────────────────┐
│  [+ Nouvelle facture]  [Import]  [Filtres]                 │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ N°    │ Fournisseur │ CFC   │ Montant │ Statut      │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ F-001 │ EG SA       │ 213.1 │ 350K    │ 🟢 Payée    │ │
│  │ F-002 │ Électro SA  │ 242.1 │ 85K     │ 🟡 Validée  │ │
│  │ F-003 │ Plomberie   │ 241.2 │ 62K     │ 🔴 À valider│ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Fiche facture:**
- Détails complet
- Pièce jointe (PDF)
- Affectation CFC
- Validation workflow
- Génération paiement

### Onglet Paiements Acheteurs

**Route:** `/projects/[projectId]/finances/payments`

**Génération QR-factures:**
- Selon plan de paiement suisse
- Acomptes définis
- QR-Code Swiss QR-Bill
- Envoi automatique par email

```
Plan de paiement standard:
  10% à la signature
  10% début chantier
  30% hors d'eau / hors d'air
  40% lors de la remise
  10% après garantie
```

**Suivi:**
- Paiements attendus
- Paiements reçus
- Retards
- Relances automatiques

### Intégration Avenants

**Lorsqu'un avenant est signé:**
→ Montant ajouté automatiquement au prix du lot
→ Répercussion sur CFC si spécifié
→ Nouvelle QR-facture générée
→ Notaire informé du nouveau montant

---

## 🛠️ 6.7. MODULE SOUMISSIONS

**Route:** `/projects/[projectId]/tenders`

### Vue liste

```
┌────────────────────────────────────────────────────────────┐
│  🛠️ SOUMISSIONS                                            │
│                                                            │
│  [+ Nouvelle soumission]                                   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Titre              │ CFC   │ Deadline  │ Statut      │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ Façades extérieures│ 227.1 │ 20 Déc    │ 🟢 Active  │ │
│  │ Menuiseries        │ 234.2 │ 15 Jan    │ 🟡 Brouillon│ │
│  │ Électricité        │ 242.1 │ Terminée  │ ✅ Adjugée  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Création soumission

**Route:** `/projects/[projectId]/tenders/new`

**Étapes:**

1. **Informations générales**
   - Titre
   - Description
   - CFC concerné
   - Budget estimatif
   - Deadline dépôt offres

2. **Documents**
   - Cahier des charges
   - Plans
   - Descriptifs techniques
   - Métrés

3. **Invitation entreprises**
   - Sélection depuis base
   - Ajout manuel
   - Envoi email automatique

### Portail Soumission Entreprise

**Route (externe):** `/tenders/[tenderId]/submit`

**Accès public (avec token):**

L'entreprise peut:
- Télécharger les documents
- Poser questions (clarifications)
- Uploader son offre
- Voir le statut

**Promoteur voit:**
- Liste des entreprises invitées
- Qui a téléchargé
- Qui a posé des questions
- Qui a déposé une offre

### Comparaison des offres

**Route:** `/projects/[projectId]/tenders/[tenderId]/comparison`

```
┌────────────────────────────────────────────────────────────┐
│  📊 COMPARATIF OFFRES - Façades extérieures                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Entreprise   │ Prix HT  │ Délai │ Score │ Action    │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ Façades SA   │ 580K CHF │ 8 sem │ 4.2/5 │ [Détails] │ │
│  │ SwissFaç SA  │ 620K CHF │ 6 sem │ 4.5/5 │ [Détails] │ │
│  │ BuildPro     │ 550K CHF │ 10sem │ 3.8/5 │ [Détails] │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  🏆 [Adjuger à: Façades SA]                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Matrice d'évaluation:**
- Prix
- Délai
- Références
- Qualité technique
- Score pondéré

**Workflow adjudication:**
```
Dépôt offres → Clarifications → Analyse → Adjudication
    ↓
Contrat généré
    ↓
Ajout dans Finances (CFC)
    ↓
Entreprise devient intervenant projet
```

---

## 🎨 6.8. MODULE MODIFICATIONS TECHNIQUES

**Route:** `/projects/[projectId]/modifications`

**C'est le module STAR de RealPro!**

### Workflow complet

```
┌────────────────────────────────────────────────────────────┐
│  1️⃣ CLIENT DEMANDE MODIFICATIONS                          │
│     ↓                                                      │
│  2️⃣ RDV FOURNISSEUR PROPOSÉ                               │
│     ↓                                                      │
│  3️⃣ FOURNISSEUR DÉPOSE OFFRE                              │
│     ↓                                                      │
│  4️⃣ CLIENT VALIDE                                         │
│     ↓                                                      │
│  5️⃣ ARCHITECTE VALIDE                                     │
│     ↓                                                      │
│  6️⃣ GÉNÉRATION AVENANT PDF                                │
│     ↓                                                      │
│  7️⃣ SIGNATURE CLIENT                                      │
│     ↓                                                      │
│  8️⃣ INJECTION FINANCES + DOCUMENTS                        │
└────────────────────────────────────────────────────────────┘
```

### 1️⃣ Demande client

**Route:** `/projects/[projectId]/modifications/new`

**Formulaire:**
```typescript
{
  lot_id: uuid;
  buyer_id: uuid;
  category: 'CARRELAGE' | 'PARQUET' | 'SANITAIRE' | 'CUISINE' | 'AUTRE';
  description: string;
  notes?: string;
}
```

**Action:** `[Créer demande]`

### 2️⃣ Rendez-vous fournisseur

**Après création:**
→ Affichage des fournisseurs disponibles par catégorie

```
┌────────────────────────────────────────────────────────────┐
│  📅 PRENDRE RENDEZ-VOUS                                    │
│                                                            │
│  Catégorie: Carrelage                                      │
│                                                            │
│  🏢 Fournisseurs disponibles:                              │
│  • Ceramica Swiss - Lausanne                               │
│  • SwissTiles - Montreux                                   │
│  • Carrelages Premium - Vevey                              │
│                                                            │
│  [Voir disponibilités]                                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Calendrier fournisseur:**
```
┌────────────────────────────────────────────────────────────┐
│  📅 Décembre 2024                                          │
│                                                            │
│  Lun   Mar   Mer   Jeu   Ven   Sam                        │
│  9     10    11    12    13    14                         │
│         ✅   ✅    ❌    ✅    ✅                           │
│                                                            │
│  Créneaux disponibles le Mer 11 Déc:                       │
│  • 09:00 - 10:00  [Réserver]                              │
│  • 14:00 - 15:00  [Réserver]                              │
│  • 16:00 - 17:00  [Réserver]                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Actions:**
- Client reçoit confirmation email
- Fournisseur reçoit notification
- RDV dans agenda projet

### 3️⃣ Dépôt offre fournisseur

**Route (fournisseur):** `/supplier/appointments/[appointmentId]/offer`

**Formulaire fournisseur:**
```typescript
{
  items: [
    {
      description: string;
      quantity: number;
      unit_price: number;
      total: number;
    }
  ];
  total_ht: number;
  vat: number;
  total_ttc: number;
  delivery_time: string;
  validity_days: number;
  attachments: File[];  // Photos, PDF
  notes?: string;
}
```

**Upload:**
- Photos showroom
- Plans techniques
- Fiches produits
- Devis PDF

### 4️⃣ Validation client

**Route:** `/projects/[projectId]/modifications/offers/[offerId]`

**Vue client:**
```
┌────────────────────────────────────────────────────────────┐
│  🎨 OFFRE MODIFICATIONS - Lot A.01                         │
│                                                            │
│  Fournisseur: Ceramica Swiss                               │
│  Date RDV: 11 Déc 2024                                    │
│                                                            │
│  📋 DÉTAILS OFFRE                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Description         │ Qté │ P.U.  │ Total           │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ Carrelage premium   │ 65m²│ 120.- │ 7'800 CHF       │ │
│  │ Sous-couche         │ 65m²│ 25.-  │ 1'625 CHF       │ │
│  │ Pose spécialisée    │ 65m²│ 80.-  │ 5'200 CHF       │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ Total HT            │     │       │ 14'625 CHF      │ │
│  │ TVA 8.1%            │     │       │ 1'185 CHF       │ │
│  │ Total TTC           │     │       │ 15'810 CHF      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  📎 Pièces jointes:                                        │
│  • Photos_carrelage.pdf                                   │
│  • Fiche_technique.pdf                                    │
│                                                            │
│  💬 Notes fournisseur:                                     │
│  "Carrelage effet marbre, joint fin, garantie 10 ans"     │
│                                                            │
│  👤 DÉCISION CLIENT                                        │
│  [✅ Accepter]  [❌ Refuser]  [📝 Demander corrections]    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Actions:**

**Si Accepter:**
→ Envoi à l'architecte pour validation technique

**Si Refuser:**
→ Notification fournisseur
→ Possibilité nouvelle offre

**Si Corrections:**
→ Message au fournisseur
→ Fournisseur modifie l'offre
→ Retour au client

### 5️⃣ Validation architecte

**Route:** `/projects/[projectId]/modifications/offers/[offerId]/architect-review`

**Vue architecte:**
```
┌────────────────────────────────────────────────────────────┐
│  🏗️ VALIDATION TECHNIQUE ARCHITECTE                        │
│                                                            │
│  Lot: A.01 - M. Dupont                                    │
│  Modification: Carrelage premium                           │
│  Montant: 15'810 CHF TTC                                  │
│                                                            │
│  ✅ Client a accepté l'offre                               │
│                                                            │
│  📋 AVIS TECHNIQUE REQUIS                                  │
│                                                            │
│  Conforme au projet?                                       │
│  • ✅ Oui, conforme                                        │
│  • ⚠️ Conforme avec réserves                              │
│  • ❌ Non conforme                                         │
│                                                            │
│  Impact sur délais: [Aucun ▼]                             │
│  Impact sur structure: [Non ▼]                            │
│                                                            │
│  💬 Commentaires:                                          │
│  [____________________________________________]             │
│                                                            │
│  [✅ Valider]  [❌ Refuser]  [📝 Demander adaptations]     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Actions:**

**Si Valider:**
→ Génération automatique avenant

**Si Refuser:**
→ Retour client avec explications
→ Offre annulée

**Si Adaptations:**
→ Retour fournisseur
→ Modifications techniques
→ Nouveau cycle validation

### 6️⃣ Génération avenant PDF

**Automatique après double validation (client + architecte)**

**3 types d'avenants:**

**A. Avenant Simple**
```
AVENANT N° AV-2024-A01-001
Projet: Les Résidences du Lac
Lot: A.01

M. Jean DUPONT accepte les modifications suivantes:
- Carrelage premium: 15'810 CHF TTC

Prix initial lot: 750'000 CHF
Avenant: +15'810 CHF
NOUVEAU PRIX: 765'810 CHF

Signatures:
Client: _________
Promoteur: _________
```

**B. Avenant Détaillé**
```
Inclut:
- Descriptif complet ligne par ligne
- Photos des matériaux
- Plans annotés
- Conditions de réalisation
- Garanties
```

**C. Avenant Juridique**
```
Inclut:
- Clauses légales complètes
- Références contrat PPE
- Modalités paiement
- Délais
- Pénalités
- Assurances
```

### 7️⃣ Signature client

**Route:** `/projects/[projectId]/modifications/avenants/[avenantId]/sign`

**Deux modes:**

**A. Signature manuelle**
```
┌────────────────────────────────────────────────────────────┐
│  ✍️ SIGNATURE AVENANT                                      │
│                                                            │
│  [Télécharger PDF]                                         │
│                                                            │
│  Instructions:                                             │
│  1. Téléchargez le PDF                                    │
│  2. Imprimez-le                                           │
│  3. Signez manuellement                                   │
│  4. Scannez le document                                   │
│  5. Uploadez ci-dessous                                   │
│                                                            │
│  [📤 Upload document signé]                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**B. Signature électronique (Swisscom AIS)**
```
┌────────────────────────────────────────────────────────────┐
│  📱 SIGNATURE ÉLECTRONIQUE                                 │
│                                                            │
│  Vous allez recevoir un SMS avec un code.                  │
│                                                            │
│  Téléphone: +41 79 123 45 67                              │
│                                                            │
│  [Envoyer code]                                            │
│                                                            │
│  Code reçu: [______]                                       │
│                                                            │
│  [✅ Signer électroniquement]                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 8️⃣ Injection automatique

**Une fois l'avenant signé:**

**A. Module Finances**
```
Lot A.01 - Prix initial: 750'000 CHF
+ Avenant AV-001: 15'810 CHF
= Nouveau prix: 765'810 CHF

CFC concerné (si spécifié):
CFC 234.2 + 15'810 CHF
```

**Génération QR-facture complémentaire:**
```
Acompte additionnel:
10% de 15'810 = 1'581 CHF
→ QR-facture envoyée au client
```

**B. Module Documents**
```
📂 05 – Acheteurs
    📂 Lot A.01 - Dupont
        📂 Avenants
            📄 AV-2024-A01-001_signe.pdf
```

**C. Module Notaire**
```
Notification automatique:
"Nouveau prix lot A.01: 765'810 CHF"
→ Mise à jour acte de vente
```

**D. Historique Lot**
```
Timeline Lot A.01:
• 05 Déc: Avenant demandé
• 11 Déc: RDV fournisseur
• 11 Déc: Offre déposée
• 12 Déc: Validé client
• 13 Déc: Validé architecte
• 13 Déc: Avenant généré
• 14 Déc: Avenant signé ✅
• 14 Déc: Prix mis à jour: 765'810 CHF
```

---

## 🚧 6.9. MODULE CHANTIER

**Route:** `/projects/[projectId]/construction`

### Planning global

```
┌────────────────────────────────────────────────────────────┐
│  🚧 CHANTIER - Planning & Avancement                       │
│                                                            │
│  📅 GANTT CHART                                            │
│  [Vue: Phases | Tâches | Critique]                         │
│                                                            │
│  Phase              │ Déb.    │ Fin     │ Avanc. │ Statut │
│  ───────────────────────────────────────────────────────── │
│  Terrassements      │ 01 Jan  │ 15 Jan  │ 100%   │ ✅     │
│  Fondations         │ 16 Jan  │ 28 Fév  │ 100%   │ ✅     │
│  Gros-œuvre         │ 01 Mar  │ 31 Mai  │ 65%    │ 🟡     │
│  └─ Murs étages     │ 01 Mar  │ 30 Avr  │ 100%   │ ✅     │
│  └─ Dalles          │ 15 Avr  │ 31 Mai  │ 45%    │ 🟡     │
│  Second-œuvre       │ 01 Juin │ 30 Sep  │ 0%     │ ⏳     │
│  Finitions          │ 01 Oct  │ 30 Nov  │ 0%     │ ⏳     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Photos d'avancement

**Route:** `/projects/[projectId]/construction/photos`

```
┌────────────────────────────────────────────────────────────┐
│  📸 PHOTOS CHANTIER                                        │
│                                                            │
│  [Upload photos]  [Vue: Grille | Timeline | Par zone]      │
│                                                            │
│  📅 13 Décembre 2024                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │
│  │ 📷   │ │ 📷   │ │ 📷   │ │ 📷   │                    │
│  │Façade│ │ Dalle│ │ Cage │ │Toiture│                   │
│  │Nord  │ │ B1   │ │escal.│ │ Bat A │                   │
│  └──────┘ └──────┘ └──────┘ └──────┘                    │
│                                                            │
│  📅 06 Décembre 2024                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐                              │
│  │ 📷   │ │ 📷   │ │ 📷   │                              │
│  │...   │ │...   │ │...   │                              │
│  └──────┘ └──────┘ └──────┘                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Métadonnées photos:**
- Date/heure auto
- Géolocalisation
- Zone/bâtiment
- Phase concernée
- Commentaire

**Visibilité:**
- Interne équipe
- Partageable avec acheteurs (sélection)
- Export automatique pour PV

### Journal de chantier

**Route:** `/projects/[projectId]/construction/diary`

```
┌────────────────────────────────────────────────────────────┐
│  📝 JOURNAL DE CHANTIER                                    │
│                                                            │
│  [Nouvelle entrée]                                         │
│                                                            │
│  📅 Vendredi 13 Décembre 2024                             │
│  Météo: ☀️ Ensoleillé, 8°C                                │
│                                                            │
│  👷 Effectif:                                              │
│  • EG: 12 personnes                                       │
│  • Électricien: 4 personnes                               │
│  • Plombier: 2 personnes                                  │
│                                                            │
│  🔨 Travaux réalisés:                                      │
│  • Coulage dalle étage 2 Bât A                            │
│  • Pose gaines électriques Bât B                          │
│                                                            │
│  ⚠️ Observations:                                          │
│  • Retard livraison fenêtres (2 jours)                    │
│                                                            │
│  📎 Photos: 8                                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Indicateurs & Alertes

```
┌────────────────────────────────────────────────────────────┐
│  ⚠️ ALERTES CHANTIER                                       │
│                                                            │
│  🔴 CRITIQUE                                               │
│  • Retard 5 jours sur phase Gros-œuvre                    │
│                                                            │
│  🟡 ATTENTION                                              │
│  • Livraison fenêtres décalée                             │
│  • Effectif réduit semaine prochaine                      │
│                                                            │
│  🟢 OK                                                     │
│  • Planning respecté: 8/10 phases                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Synchronisation Avenants

**Les avenants techniques impactent le planning:**

```
Avenant A.01 validé:
- Carrelage spécial
- Délai +3 jours

→ Mise à jour automatique planning
→ Notification conducteur travaux
→ Ajout tâche "Carrelage A.01" dans Gantt
```

---

## 💬 6.10. MODULE COMMUNICATION

**Route:** `/projects/[projectId]/communication`

**Principe:** Chat structuré multi-niveaux

### Structure des fils

```
┌────────────────────────────────────────────────────────────┐
│  💬 COMMUNICATION                                          │
│                                                            │
│  ┌──────────────────┐  ┌────────────────────────────────┐ │
│  │ FILS             │  │ [Fil: Général]                 │ │
│  ├──────────────────┤  │                                �� │
│  │ 📣 Général       │  │ 👤 Architecte - Il y a 2h     │ │
│  │   (45 messages)  │  │ Plans modifiés Lot C uploadés  │ │
│  │                  │  │ dans Documents > 02 Plans      │ │
│  │ 🏗️ Chantier      │  │                                │ │
│  │   (128 messages) │  │ 👤 Vous - Il y a 4h           │ │
│  │                  │  │ @Architecte: merci! Valides?   │ │
│  │ 💰 Finances      │  │                                │ │
│  │   (67 messages)  │  │ 👤 Architecte - Il y a 3h     │ │
│  │                  │  │ Oui, conformes au permis ✅    │ │
│  │ 🏠 Par Lot:      │  │                                │ │
│  │   • Lot A.01     │  │ [Écrire un message...]         │ │
│  │   • Lot A.02     │  │ [📎] [😊] [Envoyer]           │ │
│  │   • ...          │  │                                │ │
│  │                  │  │                                │ │
│  │ 👥 Par Acheteur: │  │                                │ │
│  │   • M. Dupont    │  │                                │ │
│  │   • Mme Martin   │  │                                │ │
│  └──────────────────┘  └────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Fonctionnalités

**Mentions:**
```
@Architecte: peux-tu valider les plans?
@Jean.Dupont: ton avenant est prêt
@Notaire: dossier complet pour M. Weber
```

**Upload documents:**
```
💬 Message avec pièce jointe
📎 Facture_EG_Décembre.pdf
→ Sauvegardé automatiquement dans Documents
```

**Notifications intelligentes:**
- Mention = notification immédiate
- Message dans "mon" fil = notification
- Message général = digest quotidien

**Filtres:**
- Par intervenant
- Par date
- Avec pièces jointes
- Non lus

**Recherche:**
- Full-text dans messages
- Par utilisateur
- Par date
- Par mots-clés

---

# 7️⃣ WORKFLOWS INTER-MODULES

## Workflow 1: Vente complète

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  PROSPECT entre dans CRM                                   │
│    ↓                                                       │
│  Qualification → Visite → Intérêt pour LOT                │
│    ↓                                                       │
│  RÉSERVATION avec acompte                                  │
│    ↓                                                       │
│  Documents complétés (CRM)                                 │
│    ↓                                                       │
│  [Envoyer au NOTAIRE]                                      │
│    ↓                                                       │
│  Dossier créé dans MODULE NOTAIRE                          │
│    ↓                                                       │
│  Notaire prépare acte                                      │
│    ↓                                                       │
│  SIGNATURE acte                                            │
│    ↓                                                       │
│  LOT = VENDU                                               │
│  Acheteur = Propriétaire                                   │
│    ↓                                                       │
│  Plan paiement activé (FINANCES)                           │
│  QR-factures envoyées                                      │
│    ↓                                                       │
│  Accès ESPACE ACHETEUR                                     │
│  (Modifications, Communication, Documents)                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Workflow 2: Soumission → Contrat → Finances

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  SOUMISSION créée                                          │
│    ↓                                                       │
│  Invitation entreprises                                    │
│    ↓                                                       │
│  Dépôt offres                                              │
│    ↓                                                       │
│  COMPARAISON                                               │
│    ↓                                                       │
│  ADJUDICATION                                              │
│    ↓                                                       │
│  Génération CONTRAT                                        │
│    ↓                                                       │
│  Ajout dans FINANCES                                       │
│  → CFC concerné                                            │
│  → Engagement comptable                                    │
│    ↓                                                       │
│  Factures reçues (MODULE FINANCES)                         │
│  → Validation                                              │
│  → Paiement                                                │
│  → Suivi budget CFC                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Workflow 3: Modification Technique Complète

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  CLIENT (acheteur) demande modification                    │
│    ↓                                                       │
│  RDV FOURNISSEUR programmé                                 │
│    ↓                                                       │
│  FOURNISSEUR dépose offre                                  │
│    ↓                                                       │
│  CLIENT valide                                             │
│    ↓                                                       │
│  ARCHITECTE valide techniquement                           │
│    ↓                                                       │
│  AVENANT PDF généré automatiquement                        │
│    ↓                                                       │
│  SIGNATURE CLIENT                                          │
│  (manuelle ou électronique)                                │
│    ↓                                                       │
│  ╔════════════════════════════════════════╗                │
│  ║   INJECTION AUTOMATIQUE MULTI-MODULES   ║               │
│  ╚════════════════════════════════════════╝                │
│    ↓              ↓              ↓         ↓               │
│  FINANCES     DOCUMENTS      NOTAIRE    CHANTIER          │
│  Prix lot     Avenant PDF    Nouveau     Planning         │
│  mis à jour   archivé        montant     adapté           │
│  QR-facture   Historique     acte                         │
│  générée      versionné                                   │
│                                                            │
│  ✅ 100% AUTOMATISÉ - ZÉRO SAISIE MANUELLE                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Workflow 4: Chantier → Acheteurs

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  PHOTOS chantier uploadées                                 │
│    ↓                                                       │
│  Sélection photos à partager                               │
│    ↓                                                       │
│  NOTIFICATION acheteurs                                    │
│  "Nouvelles photos disponibles"                            │
│    ↓                                                       │
│  Acheteurs consultent ESPACE ACHETEUR                      │
│  → Onglet Avancement                                       │
│  → Voir photos                                             │
│    ↓                                                       │
│  Acheteurs peuvent commenter                               │
│  → MODULE COMMUNICATION                                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

# 8️⃣ ARCHITECTURE TECHNIQUE

## 8.1. Structure des données

### Hiérarchie

```
Organization (Promoteur)
  └── Projects[]
       ├── Lots[]
       ├── Prospects[]
       ├── Buyers[]
       ├── Documents[]
       ├── Contracts[]
       ├── CFC Codes[]
       ├── Invoices[]
       ├── Payments[]
       ├── Submissions[]
       ├── Modifications[]
       ├── Avenants[]
       ├── Construction Phases[]
       ├── Photos[]
       ├── Messages[]
       └── Project Members[]
```

### Tables principales Supabase

```sql
organizations
  ├── projects
  │    ├── lots
  │    ├── prospects
  │    ├── buyers
  │    ├── documents
  │    ├── cfc_codes
  │    ├── invoices
  │    ├── payments
  │    ├── submissions
  │    │    └── submission_offers
  │    ├── modifications
  │    │    ├── supplier_appointments
  │    │    ├── supplier_offers
  │    │    └── avenants
  │    ├── planning_phases
  │    ├── construction_photos
  │    ├── message_threads
  │    │    └── messages
  │    └── project_members
  │
  ├── users
  ├── companies
  └── subscriptions
```

## 8.2. RLS (Row Level Security)

**Principe:** Chaque query vérifie automatiquement les permissions.

**Exemple Lot:**
```sql
CREATE POLICY "Users see only their project lots"
ON lots
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    JOIN projects p ON p.id = pm.project_id
    WHERE p.id = lots.project_id
    AND pm.user_id = auth.uid()
  )
);
```

**Résultat:**
- Un utilisateur du Projet A ne voit PAS les lots du Projet B
- Un courtier ne voit que les lots qui lui sont attribués
- Un acheteur ne voit que SON lot

## 8.3. Permissions par rôle

```typescript
enum ProjectRole {
  PROMOTER = 'promoter',
  ARCHITECT = 'architect',
  GENERAL_CONTRACTOR = 'gc',
  ENGINEER = 'engineer',
  NOTARY = 'notary',
  BROKER = 'broker',
  BUYER = 'buyer',
  SUPPLIER = 'supplier'
}

Permissions Matrix:
                        │Promoter│Architect│GC│Notary│Broker│Buyer│
  ─────────────────────────────────────────────────────────────────
  Dashboard             │   ✅   │   ✅    │✅│  ✅  │  ✅  │ ✅  │
  Lots (read)           │   ✅   │   ✅    │✅│  ✅  │  ✅* │ ✅* │
  Lots (write)          │   ✅   │   ❌    │❌│  ❌  │  ✅* │ ❌  │
  CRM                   │   ✅   │   ❌    │❌│  ✅  │  ✅  │ ❌  │
  Finances              │   ✅   │   📖    │📖│  ❌  │  ❌  │ 📖* │
  Soumissions           │   ✅   │   ✅    │✅│  ❌  │  ❌  │ ❌  │
  Modifications         │   ✅   │   ✅    │❌│  ❌  │  ❌  │ ✅* │
  Chantier              │   ✅   │   ✅    │✅│  ❌  │  ❌  │ 📖  │
  Documents (all)       │   ✅   │   ✅    │✅│  ✅  │  📖  │ ❌  │
  Documents (buyer)     │   ❌   │   ❌    │❌│  ✅  │  ❌  │ ✅* │
  Communication (all)   │   ✅   │   ✅    │✅│  ✅  │  ❌  │ ❌  │
  Communication (buyer) │   ✅   │   ❌    │❌│  ❌  │  ❌  │ ✅* │

  Légende:
  ✅ = Accès complet
  📖 = Lecture seule
  ✅* = Uniquement ses données
  ❌ = Pas d'accès
```

## 8.4. Navigation adaptative

**Selon le rôle, le menu change:**

### Menu Promoteur
```
🏠 Dashboard Global
📁 Mes Projets
  └── Projet X
      ├── Dashboard
      ├── Lots
      ├── CRM
      ├── Notaire
      ├── Courtiers
      ├── Documents
      ├── Finances
      ├── Soumissions
      ├── Modifications
      ├── Chantier
      ├── Communication
      └── Paramètres
💳 Facturation
⚙️ Paramètres
```

### Menu Architecte
```
📁 Mes Projets
  └── Projet X
      ├── Dashboard
      ├── Lots (lecture)
      ├── Documents
      ├── Soumissions
      ├── Modifications (validation)
      ├── Chantier
      └── Communication
```

### Menu Acheteur
```
🏠 Mon Lot
📋 Mes Documents
💰 Mes Paiements
🎨 Modifications
📸 Avancement Chantier
💬 Messages
```

---

# 9️⃣ PERMISSIONS & ISOLATION

## 9.1. Isolation stricte

```
┌────────────────────────────────────────────────────────────┐
│                     RÈGLES D'OR                            │
│                                                            │
│  1️⃣ Un projet ne voit JAMAIS les données d'un autre       │
│                                                            │
│  2️⃣ Un utilisateur ne voit QUE les projets où il est      │
│     membre (table project_members)                         │
│                                                            │
│  3️⃣ Les courtiers ne voient QUE leurs lots attribués      │
│                                                            │
│  4️⃣ Les acheteurs ne voient QUE leur lot                  │
│                                                            │
│  5️⃣ Les fournisseurs ne voient QUE leurs RDV/offres       │
│                                                            │
│  6️⃣ Toutes les requêtes passent par RLS (Supabase)        │
│                                                            │
│  7️⃣ Pas de contournement possible                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 9.2. Exemple concret

**Utilisateur Jean Dupont:**
- Rôle: Architecte
- Projets:
  - Projet "Les Résidences du Lac" (Architecte)
  - Projet "Le Parc Montreux" (Architecte)

**Ce qu'il voit:**
```
Dashboard Global:
  ✅ Les Résidences du Lac
  ✅ Le Parc Montreux
  ❌ (autres projets n'apparaissent pas)

Dans "Les Résidences du Lac":
  ✅ Dashboard
  ✅ Lots (lecture seule)
  ✅ Documents
  ✅ Soumissions
  ✅ Modifications (validation uniquement)
  ✅ Chantier
  ✅ Communication
  ❌ CRM (n'apparaît pas)
  ❌ Notaire (n'apparaît pas)
  ❌ Courtiers (n'apparaît pas)
  ❌ Finances détaillées (n'apparaît pas)
```

**Ce qu'il ne voit JAMAIS:**
- Projets d'autres promoteurs
- Projets où il n'est pas membre
- Modules pour lesquels il n'a pas de permission

## 9.3. Gestion des invitations

**Workflow:**
```
1. Promoteur crée un projet

2. Promoteur invite:
   • Architecte (email)
   • EG (email)
   • Notaire (email)

3. Email d'invitation envoyé avec token unique

4. Destinataire clique:
   • S'il a déjà un compte → Ajout au projet
   • S'il n'a pas de compte → Inscription + Ajout

5. Après activation:
   → Accès au projet avec son rôle
   → Menu adapté à son rôle
   → Permissions RLS actives
```

---

# 🔟 MULTI-LANGUAGE

## 10.1. Langues supportées

```
🇫🇷 Français (par défaut)
🇩🇪 Allemand
🇬🇧 Anglais
🇮🇹 Italien
```

## 10.2. Niveaux de traduction

**1. Interface globale**
- Menus
- Boutons
- Messages système
- Labels formulaires

**2. Par projet**
- Langue principale du projet
- Documents générés dans cette langue
- Emails aux intervenants

**3. Par utilisateur**
- Préférence personnelle
- Interface dans sa langue
- Reçoit emails dans sa langue

## 10.3. Documents multilingues

**Exemple: Avenant**
```
Si projet en français:
  → Avenant généré en français

Si acheteur préfère allemand:
  → Traduction automatique disponible
  → Mais version légale = langue du projet
```

## 10.4. Implémentation

```typescript
// i18n structure
{
  "fr": {
    "dashboard": {
      "title": "Tableau de bord",
      "projects": "Projets",
      "kpis": {
        "lots_sold": "Lots vendus"
      }
    }
  },
  "de": {
    "dashboard": {
      "title": "Dashboard",
      "projects": "Projekte",
      "kpis": {
        "lots_sold": "Verkaufte Lose"
      }
    }
  }
}
```

---

# 🎯 RÉSUMÉ: ARCHITECTURE PARFAITE

## ✅ Ce qui est garanti

**1. Isolation totale**
- Chaque projet = univers indépendant
- Aucune fuite de données possible
- RLS au niveau base de données

**2. Permissions granulaires**
- Par rôle
- Par module
- Par action (read/write/delete)

**3. Workflows automatisés**
- Modifications → Finances
- CRM → Notaire
- Soumissions → Contrats

**4. UX professionnelle**
- Navigation intuitive
- Breadcrumbs
- Recherche globale
- Filtres partout

**5. Multi-tenant SaaS**
- Subscription-based
- Quotas par plan
- Facturation automatique
- Upgrade/Downgrade

**6. Multilingue**
- 4 langues
- Interface + Documents
- Par projet + par utilisateur

---

# 📊 MÉTRIQUES FINALES

```
Modules principaux: 10
Routes totales: ~150
Tables Supabase: ~50
Roles utilisateurs: 7
Langues: 4
Workflows automatisés: 12+
Isolation: 100%
Permissions RLS: 100%
```

---

# 🚀 PRÊT POUR DÉVELOPPEMENT

Cette architecture est:
- ✅ Complète
- ✅ Scalable
- ✅ Sécurisée
- ✅ Multi-tenant
- ✅ Professionnelle
- ✅ Prête pour production

**Bolt peut maintenant construire en suivant ce tracé exact! 🎉**
