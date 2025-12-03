# Spécifications Suisses - SaaS Immobilier

## 🇨🇭 Vue d'ensemble

Ce document décrit toutes les spécificités suisses implémentées dans le SaaS immobilier, incluant les formats, les processus métier, et les terminologies spécifiques au marché suisse.

---

## 📋 Table des matières

1. [Formats & Standards](#formats--standards)
2. [Terminologie métier](#terminologie-métier)
3. [Processus PPE/QPT](#processus-ppeqpt)
4. [CFC (Code des Frais de Construction)](#cfc-code-des-frais-de-construction)
5. [Plans d'acomptes](#plans-dacomptes)
6. [Acteurs du projet](#acteurs-du-projet)
7. [Workflow notaire](#workflow-notaire)
8. [UX par rôle](#ux-par-rôle)

---

## 1. Formats & Standards

### 1.1 Devise - CHF (Franc Suisse)

**Format**: `CHF 1'234'567.89`

```typescript
// Implementation
formatCHF(1234567.89) // => "CHF 1'234'567.89"

// Usage dans l'UI
<span>{formatCHF(lot.price_vat)}</span>
```

**Caractéristiques**:
- Séparateur de milliers: apostrophe (`'`)
- Séparateur décimal: point (`.`)
- 2 décimales obligatoires
- Symbole CHF avant le montant

### 1.2 Dates

**Format**: `DD.MM.YYYY`

```typescript
// Implementation
formatDateCH(new Date('2025-12-31')) // => "31.12.2025"

// Avec heure
formatDateTimeCH(new Date()) // => "31.12.2025 14:30"
```

**Exemples**:
- Date simple: `31.12.2025`
- Date et heure: `31.12.2025 14:30`
- Période: `Du 01.01.2025 au 31.12.2025`

### 1.3 Surface

**Format**: `m²` (mètres carrés)

```typescript
formatSurface(125.5) // => "125.5 m²"
```

### 1.4 TVA (Taxe sur la Valeur Ajoutée)

**Taux standards** (en vigueur depuis le 1er janvier 2024):
- Taux normal: **8.1%**
- Taux réduit: **2.6%** (pour locations)
- Taux spécial: **3.8%** (hébergement)

**Paramétrage par projet**:
```typescript
interface Project {
  vat_rate: number; // Ex: 8.1, 2.6, 3.8
  vat_included: boolean; // TVA incluse ou non
}
```

### 1.5 Cantons

**26 cantons suisses**:

| Code | Canton (FR) | Canton (DE) | Canton (IT) |
|------|-------------|-------------|-------------|
| AG | Argovie | Aargau | Argovia |
| BE | Berne | Bern | Berna |
| GE | Genève | Genf | Ginevra |
| VD | Vaud | Waadt | Vaud |
| VS | Valais | Wallis | Vallese |
| ZH | Zurich | Zürich | Zurigo |
| ... | ... | ... | ... |

**Importance**:
- Législation cantonale différente
- Registre foncier cantonal
- Impôts cantonaux

---

## 2. Terminologie métier

### 2.1 Types de vente

#### PPE (Propriété Par Étages)
- **Définition**: Copropriété d'un appartement + quote-part des parties communes
- **Caractéristiques**:
  - Acte notarié obligatoire
  - Inscription au registre foncier
  - Charges de copropriété
  - Assemblée des copropriétaires
  - Règlement de copropriété

#### QPT (Quota-Part de Terrain)
- **Définition**: Propriété d'une part du terrain + droit de construire/occuper
- **Caractéristiques**:
  - Moins courant que PPE
  - Souvent pour villas/maisons
  - Responsabilité collective sur le terrain

#### Locatif
- **Définition**: Biens destinés à la location
- **Caractéristiques**:
  - Pas de vente aux particuliers
  - Gestion locative
  - Rendement locatif

### 2.2 Acteurs

| Acteur | Terme FR | Rôle |
|--------|----------|------|
| **Promoteur** | Développeur | Maître d'ouvrage, propriétaire du projet |
| **EG** | Entreprise Générale | Constructeur principal, coordination |
| **Architecte** | Architecte | Conception, plans, suivi technique |
| **Ingénieur** | Bureau d'ingénieurs | Études techniques (structure, fluides, etc.) |
| **Notaire** | Notaire | Actes authentiques, inscription RF |
| **Courtier** | Agent immobilier | Commercialisation, vente |
| **Sous-traitant** | Entreprise spécialisée | Corps de métier (plomberie, électricité, etc.) |
| **Acheteur** | Acquéreur | Futur propriétaire |

### 2.3 Documents

| Document | Description |
|----------|-------------|
| **Acte de vente** | Acte notarié authentique |
| **Règlement de PPE** | Règles de la copropriété |
| **Plans** | Plans d'architecte (situation, étages, coupes) |
| **Descriptif technique** | Finitions, matériaux, équipements |
| **Certificat énergétique** | CECB (Certificat Énergétique Cantonal des Bâtiments) |
| **Garantie décennale** | Garantie 10 ans sur la construction |

---

## 3. Processus PPE/QPT

### 3.1 Workflow complet

```
1. PLANIFICATION
   ├─ Achat terrain
   ├─ Projet architectural
   ├─ Permis de construire
   └─ Financement promoteur

2. COMMERCIALISATION
   ├─ Programme de vente
   ├─ Prix par lot
   ├─ Prospection
   ├─ Réservations
   └─ Contrats préliminaires

3. NOTAIRE
   ├─ Constitution dossier acheteur
   │  ├─ Pièces identité
   │  ├─ Confirmation financement
   │  ├─ Extrait registre des poursuites
   │  └─ Documents famille (si applicable)
   ├─ Rédaction acte
   ├─ Lecture et signature
   └─ Inscription registre foncier

4. CONSTRUCTION
   ├─ Démarrage chantier
   ├─ Gros œuvre
   ├─ Second œuvre
   ├─ Finitions
   └─ Choix matériaux acheteurs

5. LIVRAISON
   ├─ Réception provisoire
   ├─ État des lieux
   ├─ Remise des clés
   └─ Garantie décennale
```

### 3.2 États des lots

```typescript
enum LotStatus {
  AVAILABLE = 'Disponible',      // Peut être vendu
  RESERVED = 'Réservé',          // Réservé par un prospect
  OPTION = 'En option',          // Option courte (quelques jours)
  SOLD = 'Vendu',                // Contrat signé chez le notaire
  DELIVERED = 'Livré',           // Clés remises
  BLOCKED = 'Bloqué'             // Non commercialisable (technique/autre)
}
```

### 3.3 Règles de transition

```
AVAILABLE → RESERVED : Courtier crée une réservation
RESERVED → OPTION : Période d'option courte (optionnel)
RESERVED → AVAILABLE : Expiration réservation
RESERVED → SOLD : Signature acte notarié
SOLD → DELIVERED : Remise des clés
ANY → BLOCKED : Action administrative
```

**Contraintes**:
- Un lot SOLD ne peut pas revenir en AVAILABLE
- Un lot DELIVERED ne peut pas changer de statut
- Seuls les courtiers peuvent changer les statuts

---

## 4. CFC (Code des Frais de Construction)

### 4.1 Structure standard CFC Suisse

Le CFC organise les coûts de construction en grandes catégories :

```
1XX - TERRAIN
  └─ 110 Achat terrain
  └─ 120 Équipement terrain
  └─ 130 Frais acquisition

2XX - PRÉPARATIFS
  └─ 210 Études préliminaires
  └─ 220 Travaux préparatoires
  └─ 230 Démolitions

3XX - BÂTIMENT
  └─ 310 Gros œuvre
  └─ 320 Façades
  └─ 330 Installations
  └─ 340 Second œuvre
  └─ 350 Finitions

4XX - ÉQUIPEMENTS
  └─ 410 Chauffage, ventilation
  └─ 420 Électricité
  └─ 430 Sanitaires
  └─ 440 Ascenseurs
  └─ 450 Cuisine

5XX - AMÉNAGEMENTS EXTÉRIEURS
  └─ 510 Voirie
  └─ 520 Espaces verts
  └─ 530 Équipements extérieurs

9XX - DIVERS
  └─ 910 Honoraires
  └─ 920 TVA
  └─ 930 Imprévus
```

### 4.2 Suivi budgétaire CFC

Pour chaque poste CFC, on suit **4 montants** :

```typescript
interface CfcBudget {
  cfc_code: string;           // Ex: "310"
  label: string;              // Ex: "Gros œuvre"

  budget_initial: number;     // Budget initial
  budget_revised: number;     // Budget révisé (après avenants)
  engagement_total: number;   // Engagé (contrats + adjudications)
  invoiced_total: number;     // Facturé (situations validées)
  paid_total: number;         // Payé (paiements effectués)
}
```

**Tableau de bord CFC**:
```
Poste CFC     Budget      Engagé      Facturé     Payé        Reste
-----------------------------------------------------------------------
310 Gros œuvre    CHF 2'500'000   CHF 2'450'000   CHF 1'800'000   CHF 1'650'000   CHF 50'000
320 Façades       CHF 850'000     CHF 820'000     CHF 650'000     CHF 600'000     CHF 30'000
...
```

**Alertes CFC**:
- 🟢 Reste > 10% : OK
- 🟡 Reste entre 5% et 10% : Attention
- 🔴 Reste < 5% : Alerte dépassement

---

## 5. Plans d'acomptes

### 5.1 Plan type Suisse (PPE)

```typescript
const SWISS_INSTALLMENT_PLAN = [
  { label: 'Signature acte notarié', percentage: 20, trigger: 'SIGNATURE' },
  { label: 'Achèvement gros œuvre', percentage: 30, trigger: 'PHASE_COMPLETE' },
  { label: 'Mise hors d\'eau / hors d\'air', percentage: 20, trigger: 'PHASE_COMPLETE' },
  { label: 'Achèvement second œuvre', percentage: 20, trigger: 'PHASE_COMPLETE' },
  { label: 'Remise des clés', percentage: 10, trigger: 'DELIVERY' },
];
```

### 5.2 Exemple de calcul

```
Prix de vente: CHF 950'000 (TVA incluse)

Acompte 1 (20%): CHF 190'000  → À la signature
Acompte 2 (30%): CHF 285'000  → Gros œuvre terminé
Acompte 3 (20%): CHF 190'000  → Hors d'eau/air
Acompte 4 (20%): CHF 190'000  → Second œuvre terminé
Acompte 5 (10%): CHF 95'000   → Remise des clés
                 ─────────────
        TOTAL:   CHF 950'000
```

### 5.3 Paramétrage

Chaque projet peut avoir son propre plan d'acomptes :

```typescript
interface InstallmentPlanTemplate {
  project_id: string;
  name: string; // Ex: "Plan standard PPE"
  lines: InstallmentPlanTemplateLine[];
}

interface InstallmentPlanTemplateLine {
  order: number;
  label: string;
  percentage: number;      // 0-100
  trigger_type: 'SIGNATURE' | 'PHASE_COMPLETE' | 'DATE' | 'MANUAL';
  trigger_value?: string;  // Phase ID ou date
}
```

---

## 6. Acteurs du projet

### 6.1 Participants par projet

```typescript
interface ProjectParticipant {
  project_id: string;
  company_id: string;
  contact_id?: string;
  role: ProjectRole;
  status: 'ACTIVE' | 'INACTIVE';
  start_date: Date;
  end_date?: Date;
}

enum ProjectRole {
  EG = 'Entreprise Générale',
  ARCHITECT = 'Architecte',
  ENGINEER = 'Ingénieur',
  NOTARY = 'Notaire',
  BROKER = 'Courtier',
  SUBCONTRACTOR = 'Sous-traitant',
  SUPPLIER = 'Fournisseur',
  OTHER = 'Autre'
}
```

### 6.2 Permissions par rôle

| Rôle | Permissions clés |
|------|------------------|
| **Promoteur** | Tout voir, tout modifier |
| **EG** | Soumissions, contrats, situations, planning |
| **Architecte** | Plans, choix matériaux, suivi technique |
| **Notaire** | Dossiers acheteurs, actes, signatures |
| **Courtier** | Lots, prospects, réservations, contrats de vente |
| **Sous-traitant** | Soumettre des offres, voir ses contrats |
| **Acheteur** | Voir son lot, ses documents, faire ses choix |

---

## 7. Workflow notaire

### 7.1 Processus complet

```
1. OUVERTURE DOSSIER
   ├─ Création automatique lors de la signature du contrat de vente
   ├─ Informations acheteur(s)
   ├─ Informations lot
   └─ Lien au contrat de vente

2. CONSTITUTION DOSSIER
   ├─ Documents acheteur
   │  ├─ Pièce d'identité (passeport, CI)
   │  ├─ Confirmation financement (banque)
   │  ├─ Extrait RC (registre des poursuites)
   │  ├─ État civil (livret de famille si applicable)
   │  └─ Procuration (si applicable)
   ├─ Documents projet
   │  ├─ Plans
   │  ├─ Règlement PPE
   │  ├─ Descriptif technique
   │  └─ Garanties
   └─ Validation complétude → Statut "READY_FOR_NOTARY"

3. RÉDACTION ACTE
   ├─ Rédaction projet d'acte
   ├─ Envoi à l'acheteur pour relecture
   ├─ Modifications éventuelles
   └─ Acte définitif

4. SIGNATURE
   ├─ Fixation rendez-vous
   ├─ Lecture acte chez le notaire
   ├─ Signature des parties
   ├─ Upload acte signé
   └─ Statut "SIGNED"

5. INSCRIPTION REGISTRE FONCIER
   ├─ Envoi au registre foncier cantonal
   ├─ Inscription définitive (6-12 semaines)
   └─ Réception extrait RF → Statut "COMPLETED"
```

### 7.2 États du dossier notaire

```typescript
enum NotaryFileStatus {
  OPEN = 'Ouvert',                    // Dossier créé
  IN_PROGRESS = 'En cours',           // Constitution en cours
  AWAITING_APPOINTMENT = 'Attente RDV', // Prêt, attente date signature
  READY = 'Prêt à signer',            // RDV fixé
  SIGNED = 'Signé',                   // Acte signé
  COMPLETED = 'Complété',             // Inscrit au RF
  CANCELLED = 'Annulé'                // Annulation
}
```

### 7.3 Checklist documents

```typescript
const NOTARY_DOCUMENTS_CHECKLIST = [
  // Acheteur personne physique
  { code: 'ID', label: 'Pièce d\'identité', required: true },
  { code: 'FINANCING', label: 'Confirmation financement', required: true },
  { code: 'RC', label: 'Extrait registre poursuites', required: true },
  { code: 'CIVIL_STATUS', label: 'État civil', required_if: 'married' },
  { code: 'PROXY', label: 'Procuration', required_if: 'proxy' },

  // Acheteur personne morale
  { code: 'RC_EXTRACT', label: 'Extrait registre commerce', required: true },
  { code: 'STATUTES', label: 'Statuts société', required: true },
  { code: 'BOARD_RESOLUTION', label: 'Décision organe compétent', required: true },

  // Projet
  { code: 'PLANS', label: 'Plans', required: true },
  { code: 'PPE_RULES', label: 'Règlement PPE', required: true },
  { code: 'TECH_DESC', label: 'Descriptif technique', required: true },
  { code: 'GUARANTEES', label: 'Garanties', required: true },
];
```

---

## 8. UX par rôle

### 8.1 Promoteur - Cockpit projet

**Layout principal** :

```
┌─────────────────────────────────────────────┐
│ Breadcrumbs: Projets > Résidence du Lac    │
│ Titre + Badge statut                        │
└─────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ Ventes   │ Notaire  │ CFC      │ Chantier │
│ 45/60    │ 8 prêts  │ 87%      │ 67%      │
└──────────┴──────────┴──────────┴──────────┘

┌───────────────────────┬───────────────────────┐
│ 📊 Pipeline ventes    │ 💰 Santé financière   │
│                       │                       │
│ [Graphique funnel]    │ [Graphique CFC]       │
└───────────────────────┴───────────────────────┘

┌───────────────────────┬───────────────────────┐
│ 📋 Activité récente   │ ⚠️ Alertes & Tâches   │
│                       │                       │
│ • Contrat signé       │ • 3 validations       │
│ • Offre reçue         │ • Signature demain    │
└───────────────────────┴───────────────────────┘
```

**Navigation** :
- Cockpit (dashboard)
- Lots & Ventes
- CRM & Acheteurs
- Notaire
- Contrats & CFC
- Soumissions
- Chantier & Planning
- Choix matériaux
- Documents
- Communication

### 8.2 Courtier - Dashboard performance

```
┌─────────────────────────────────────────────┐
│ Bienvenue, Jean-Pierre                      │
│ Voici vos performances ce mois-ci           │
└─────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ Pipeline │ Réservés │ Vendus   │ CA       │
│ 12       │ 8        │ 5        │ 320K CHF │
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────────┐
│ Actions rapides                             │
│                                             │
│ [Nouvelle réservation] [Nouveau contrat]   │
│ [Voir les lots]        [Mes prospects]     │
└─────────────────────────────────────────────┘

┌───────────────────────┬───────────────────────┐
│ Mes prospects         │ Tâches à venir        │
│                       │                       │
│ [Liste avec statut]   │ • Appeler M. Dupont   │
│                       │ • Signature mer. 14h  │
└───────────────────────┴───────────────────────┘
```

**Actions principales** :
- Créer une réservation
- Créer un contrat de vente
- Changer le statut d'un lot
- Mettre à jour date de signature
- Attacher l'acte signé

### 8.3 Notaire - Dashboard dossiers

```
┌─────────────────────────────────────────────┐
│ Tableau de bord notaire                     │
└─────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ Dossiers │ Prêts    │ RDV      │ Signés   │
│ ouverts  │ à signer │ semaine  │ ce mois  │
│ 8        │ 3        │ 5        │ 12       │
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────────┐
│ Dossiers nécessitant votre attention        │
│                                             │
│ 🔴 3 dossiers incomplets                    │
│ 🟡 2 en attente documents                   │
│ 🟢 5 prêts pour signature                   │
└─────────────────────────────────────────────┘

┌───────────────────────┬───────────────────────┐
│ Cette semaine         │ Semaine prochaine     │
│                       │                       │
│ Lun: 2 signatures     │ Lun: 1 signature      │
│ Mer: 3 signatures     │ Jeu: 2 signatures     │
│ Ven: 1 signature      │                       │
└───────────────────────┴───────────────────────┘
```

**Vue dossier** :
- Informations acheteur(s)
- Informations lot
- Checklist documents
- Versions d'acte
- Rendez-vous signature
- Ligne de temps

### 8.4 EG / Architecte - Vue Exécution

**Onglets** :
1. **Soumissions**
   - Créer soumission
   - Inviter entreprises
   - Comparer les offres
   - Adjuger

2. **Contrats & Avenants**
   - Liste contrats actifs
   - Créer avenant
   - Suivre allocations CFC

3. **Situations & Facturation**
   - Encoder une situation
   - Approuver techniquement
   - Approuver financièrement (génère facture)
   - Valider paiements

4. **Chantier & Planning**
   - Timeline phases
   - Avancement par phase
   - Jalons (milestones)
   - Retards / alertes

### 8.5 Acheteur - Mon espace

Interface ultra-simple :

```
┌─────────────────────────────────────────────┐
│ Mon appartement - Bâtiment A, Lot 305       │
│ [Badge: Réservé]                            │
└─────────────────────────────────────────────┘

Navigation :
• Mon lot (détails, plans)
• Mes documents (contrat, fiches techniques)
• Mes choix (sélection matériaux)
• Mes paiements (acomptes, factures)
• Messages (équipe projet)
• Aide & Contact
```

**Choix matériaux** :
- Catégories (Sol, Cuisine, Salle de bain, Peinture)
- Sélection visuelle avec photos
- Indication prix (standard / +/- CHF)
- Deadline clairement affichée
- Verrouillage après deadline

---

## 9. Microcopie & Messages

### 9.1 Principes

✅ **BON** : Langage clair, actionnable, en français
❌ **MAUVAIS** : Jargon technique, anglais, messages génériques

### 9.2 Exemples de messages

**Boutons d'action** :
- ✅ "Enregistrer la situation"
- ✅ "Envoyer au notaire"
- ✅ "Marquer comme signé"
- ❌ "Submit"
- ❌ "Update status"

**Messages d'erreur** :
- ✅ "Impossible de passer le lot en 'Vendu' : aucun contrat de vente signé n'est lié à ce lot."
- ❌ "422 Unprocessable Entity"
- ❌ "Validation failed"

**Messages de succès** :
- ✅ "Le contrat de vente a été créé avec succès. Un dossier notaire a été ouvert automatiquement."
- ❌ "Success"
- ❌ "Record created"

**États vides** :
- ✅ "Aucune soumission pour ce projet. Créez une première soumission pour un lot CFC afin d'inviter des entreprises."
- ❌ "No data"
- ❌ "Empty list"

---

## 10. Import / Export

### 10.1 Import CSV - Lots

**Format attendu** :
```csv
numero_lot,batiment,etage,type,surface_hab,surface_ppe,prix_ht,prix_tva,type_vente,statut
101,A,1,APARTMENT,85.5,95.2,750000,810750,PPE,AVAILABLE
102,A,1,APARTMENT,72.0,80.5,680000,735160,PPE,AVAILABLE
...
```

**Endpoint** :
```
POST /api/projects/:projectId/import/lots
Content-Type: multipart/form-data

Response:
{
  "imported": 25,
  "errors": [],
  "warnings": ["Lot 305 existe déjà, ignoré"]
}
```

### 10.2 Import CSV - Budgets CFC

**Format attendu** :
```csv
code_cfc,libelle,budget_initial
110,Achat terrain,2500000
210,Études préliminaires,85000
310,Gros œuvre,4200000
...
```

### 10.3 Export Excel - Programme de vente

**Colonnes** :
- Numéro lot
- Bâtiment
- Étage
- Type
- Surface habitable
- Surface PPE
- Prix HT
- Prix TTC
- Statut
- Acheteur (si vendu)

---

## 11. Alertes & Notifications

### 11.1 Types d'alertes

| Type | Déclencheur | Destinataire |
|------|-------------|--------------|
| **🔴 Critique** | Dépassement CFC > 10% | Promoteur, EG |
| **🟡 Attention** | Réservation expire demain | Courtier |
| **🟢 Info** | Nouveau message | Tous participants |
| **📅 Rappel** | Signature dans 2 jours | Notaire, Acheteur |
| **✅ Succès** | Dossier notaire complet | Promoteur, Notaire |

### 11.2 Canaux de notification

1. **In-app** : Badge + panneau notifications
2. **Email** : Résumé quotidien / hebdomadaire
3. **SMS** (optionnel) : Événements critiques

---

## 12. Checklist mise en production

### 12.1 Données de test

- [ ] Au moins 1 projet complet avec :
  - [ ] Structure (bâtiments, étages, lots)
  - [ ] Participants (EG, architecte, notaire, courtiers)
  - [ ] Prospects et acheteurs
  - [ ] Contrats EG
  - [ ] Budget CFC
  - [ ] Dossiers notaire
  - [ ] Soumissions

### 12.2 Validations métier

- [ ] Calcul TVA correct (8.1%, 2.6%)
- [ ] Formats CHF partout
- [ ] Dates au format suisse
- [ ] Cantons dans les listes déroulantes
- [ ] Plans d'acomptes standards disponibles
- [ ] Structure CFC standard présente
- [ ] Workflow notaire complet
- [ ] Transitions de statut lots OK

### 12.3 UX

- [ ] Tous les labels en français
- [ ] Messages d'erreur clairs
- [ ] États vides avec actions
- [ ] Recherche globale fonctionnelle
- [ ] Breadcrumbs sur toutes les pages
- [ ] Filtres sur toutes les tables
- [ ] Responsive mobile

### 12.4 Performance

- [ ] Pagination sur toutes les listes
- [ ] Indexes sur les colonnes fréquentes
- [ ] Requêtes optimisées (pas de N+1)
- [ ] Chargement < 1s pour les dashboards

---

## Conclusion

Ce document décrit toutes les spécificités suisses implémentées ou à implémenter dans le SaaS. Les formats (CHF, dates), les processus (PPE, notaire, CFC), et la terminologie métier sont tous alignés sur les pratiques du marché immobilier suisse.

**Status actuel** :
- ✅ Formats et utilitaires : complets
- ✅ Structure de données : complète
- ✅ Terminologie : labels français en place
- 🟡 UX par rôle : partiellement implémentée
- ⏳ Import/Export : structure prête, implémentation à faire

**Prochaines étapes** :
1. Compléter les pages dashboard par rôle
2. Implémenter les imports CSV
3. Ajouter les exports Excel
4. Tester avec des données réelles suisses
5. Valider avec des utilisateurs romands
