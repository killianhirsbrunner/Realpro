# 📊 Modules Détail Lot Courtier & Reporting Multi-Projets

## Vue d'ensemble

Ce document décrit deux modules avancés pour votre plateforme immobilière:

1. **Détail Lot Courtier** - Vue 360° complète d'un lot (dossier, signatures, notaire)
2. **Reporting Multi-Projets** - Dashboard direction avec KPIs et performance courtiers

---

## 🔍 Module Détail Lot Courtier

### Objectif

Fournir aux courtiers une **vue complète** de tout le cycle de vie d'un lot:
- Informations du lot (surface, prix, bâtiment, étage)
- Acheteur associé
- Réservation (dates, signature)
- Contrat de vente (acte, dates de signature)
- Dossier notaire (statut, documents, rendez-vous)
- Dossier acheteur

### Route API

**Edge Function**: `broker` (route ajoutée)

```typescript
GET /broker/projects/:projectId/lots/:lotId/deal
```

**Headers**:
```
Authorization: Bearer <ANON_KEY>
Content-Type: application/json
```

**Body**:
```json
{
  "userId": "20000000-0000-0000-0000-000000000001"
}
```

**Response complète**:
```json
{
  "lot": {
    "id": "uuid",
    "lotNumber": "A101",
    "roomsLabel": "3.5 pièces",
    "surfaceHabitable": 85.5,
    "status": "SOLD",
    "building": "Bâtiment A",
    "floor": "1er étage",
    "priceVat": 450000,
    "priceQpt": 430000
  },
  "buyer": {
    "id": "uuid",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+41 79 123 45 67"
  },
  "reservation": {
    "id": "uuid",
    "startDate": "2024-11-01T00:00:00Z",
    "endDate": "2024-11-30T23:59:59Z",
    "signedAt": "2024-11-05T14:30:00Z",
    "status": "SIGNED"
  },
  "salesContract": {
    "id": "uuid",
    "signedAt": "2024-12-15T14:30:00Z",
    "effectiveAt": "2024-11-05T14:30:00Z",
    "document": {
      "id": "uuid",
      "name": "contrat_vente_A101.pdf",
      "downloadUrl": "/documents/uuid/download"
    },
    "notary": {
      "status": "READY_FOR_SIGNATURE",
      "notaryName": "Étude Dupuis & Associés",
      "notaryContact": "notaire@dupuis.ch",
      "lastAct": {
        "id": "uuid",
        "name": "acte_notarie_v3.pdf",
        "downloadUrl": "/documents/uuid/download"
      },
      "lastAppointment": {
        "id": "uuid",
        "date": "2024-12-20T10:00:00Z",
        "location": "Étude notariale, Rue du Rhône 45, Genève",
        "notes": "Apporter pièces d'identité et confirmation bancaire"
      }
    }
  },
  "buyerFile": {
    "id": "uuid",
    "status": "READY_FOR_NOTARY",
    "notaryName": "Étude Dupuis & Associés",
    "notaryContact": "notaire@dupuis.ch"
  }
}
```

### Données Récupérées

La fonction `getLotDealDetails` fait **5 requêtes en parallèle**:

1. **Lot complet** avec bâtiment, étage, acheteur
2. **Réservation** la plus récente
3. **Contrat de vente** avec document
4. **Dossier acheteur** (buyer_file)
5. **Dossier notaire** avec:
   - Dernier acte notarié
   - Dernier rendez-vous de signature

### Page React

**Fichier**: `src/pages/BrokerLotDetail.tsx`

**Features**:
- Vue en cartes organisées (lot, acheteur, réservation, acte)
- Changement de statut du lot
- Modification des dates de signature (réservation + acte)
- Liens de téléchargement des documents
- Informations notaire complètes
- Design responsive Swiss-style

**Screenshot conceptuel**:
```
┌────────────────────────────────────────────────────────────────┐
│ [← Retour]                                                     │
│                                                                 │
│ Espace courtiers · Dossier lot                                 │
│ Lot A101 (3.5 pièces)                                          │
│ Suivi complet du dossier : acheteur, réservation, acte...     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─── Informations lot ───┐  ┌─── Acheteur ───────────────┐   │
│ │ 🏠                      │  │ 👤                         │   │
│ │ Bâtiment: Bâtiment A   │  │ Jean Dupont                │   │
│ │ Étage: 1er étage       │  │ Email: jean@example.com    │   │
│ │ Surface: 85.5 m²       │  │ Tél: +41 79 123 45 67      │   │
│ │ Prix: CHF 450'000      │  └────────────────────────────┘   │
│ │                        │                                    │
│ │ Statut: [Vendu ▼]      │                                    │
│ └────────────────────────┘                                    │
│                                                                 │
│ ┌─── Réservation ────────┐  ┌─── Acte de vente ──────────┐   │
│ │ 📅                      │  │ 📄                         │   │
│ │ Période:               │  │ Signature acte:            │   │
│ │ 01.11.2024 – 30.11.24  │  │ 15.12.2024                 │   │
│ │                        │  │                            │   │
│ │ Signature: 05.11.2024  │  │ Entrée en vigueur:         │   │
│ │ Statut: SIGNED         │  │ 05.11.2024                 │   │
│ └────────────────────────┘  └────────────────────────────┘   │
│                                                                 │
│ ┌─── Mettre à jour les dates ────────────────────────────────┐│
│ │ [Date résa: 05.11.2024] [Date acte: 15.12.2024]           ││
│ │ [Enregistrer les dates]                                    ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── Notaire & Documents ─────────────────────────────────────┐│
│ │ Contrat signé: contrat_vente_A101.pdf [↓]                  ││
│ │ Statut notaire: READY_FOR_SIGNATURE                        ││
│ │ Notaire: Étude Dupuis & Associés (notaire@dupuis.ch)      ││
│ │ Dernière version acte: acte_notarie_v3.pdf [↓]             ││
│ │ Dernier RDV: 20.12.2024 · Étude notariale, Rue du Rhône...││
│ │ Dossier acheteur: READY_FOR_NOTARY                         ││
│ └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### Workflow d'Utilisation

```
1. COURTIER DANS LISTE LOTS
   Liste des lots avec statuts

   ↓ [Clic sur un lot]

2. PAGE DÉTAIL LOT
   Vue 360° complète du dossier

   ↓ [Courtier voit que l'acte est prêt]

3. MODIFICATION DES DATES
   Met à jour date signature réservation: 05.11.2024
   Met à jour date signature acte: 15.12.2024

   ↓ [Enregistrer]

4. APPEL API PATCH /signatures
   Mise à jour du sales_contract

   ↓

5. LOG D'AUDIT CRÉÉ
   Action: BROKER_LOT_SIGNATURES_UPDATED

   ↓

6. RECHARGEMENT DES DONNÉES
   Dates mises à jour visibles

   ↓

7. TÉLÉCHARGEMENT DOCUMENTS
   Courtier peut télécharger:
   - Contrat de vente signé
   - Dernier acte notarié
```

---

## 📈 Module Reporting Multi-Projets

### Objectif

Offrir à la **direction** une vue d'ensemble de tous les projets de l'organisation:
- KPIs globaux (projets, ventes, dossiers, soumissions)
- Liste détaillée des projets avec lots et CFC
- Performance des courtiers (à venir)

### Edge Function `/reporting`

**Fichier**: `supabase/functions/reporting/index.ts`

Deux routes principales:

#### 1. Overview Organisation

```typescript
GET /reporting/organization/overview
```

**Body**:
```json
{
  "organizationId": "00000000-0000-0000-0000-000000000001"
}
```

**Response**:
```json
{
  "projectsSummary": {
    "totalProjects": 8,
    "byStatus": {
      "planning": 1,
      "sales": 3,
      "construction": 3,
      "delivered": 1
    }
  },
  "salesSummary": {
    "totalLots": 156,
    "totalSalesChf": 78500000
  },
  "buyerFilesSummary": {
    "total": 89,
    "readyForNotary": 12,
    "signed": 67
  },
  "submissionsSummary": {
    "total": 45,
    "inProgress": 8,
    "adjudicated": 32
  },
  "projects": [
    {
      "id": "uuid",
      "name": "Les Jardins du Lac",
      "city": "Genève",
      "status": "SALES",
      "type": "RESIDENTIAL",
      "lots": {
        "total": 42,
        "sold": 28,
        "reserved": 8,
        "free": 6
      },
      "cfc": {
        "budget": 12500000,
        "engagement": 11800000,
        "invoiced": 9200000,
        "paid": 8500000
      },
      "soldRatio": 0.67
    }
  ]
}
```

**Agrégations calculées**:

1. **Projets par statut** - COUNT groupé par status
2. **Total ventes** - SUM des price_vat des lots SOLD
3. **Dossiers notaire** - COUNT par status
4. **Soumissions** - COUNT par status
5. **Lots par projet** - GROUP BY project_id
6. **CFC par projet** - SUM des budgets/engagements/payé

#### 2. Performance Courtiers

```typescript
GET /reporting/organization/brokers
```

**Body**:
```json
{
  "organizationId": "00000000-0000-0000-0000-000000000001"
}
```

**Response**:
```json
{
  "brokers": [
    {
      "brokerId": "uuid",
      "firstName": "Pierre",
      "lastName": "Martin",
      "email": "pierre.martin@example.com",
      "reservedLots": 15,
      "soldLots": 12,
      "conversionRate": 0.80
    },
    {
      "brokerId": "uuid",
      "firstName": "Sophie",
      "lastName": "Dubois",
      "email": "sophie.dubois@example.com",
      "reservedLots": 22,
      "soldLots": 18,
      "conversionRate": 0.82
    }
  ]
}
```

**Métriques calculées**:
- `reservedLots` - Nombre de réservations attribuées
- `soldLots` - Nombre de lots vendus
- `conversionRate` - soldLots / reservedLots

### Page React

**Fichier**: `src/pages/ReportingOverview.tsx`

**Features**:
- 4 KPIs en cartes (projets, ventes, dossiers, soumissions)
- Tableau récapitulatif des projets
- Ratios de vente (vendus/total)
- Budgets CFC avec détails (engagé, facturé, payé)
- Badges de statut colorés
- Design responsive

**Screenshot conceptuel**:
```
┌─────────────────────────────────────────────────────────────────────┐
│ Direction · Vue multi-projets                        [Actualiser]   │
│ Reporting multi-projets                                             │
│ Synthèse de votre portefeuille : ventes, CFC, dossiers...          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ┌─ Projets actifs ─┐ ┌─ Lots vendus ──┐ ┌─ Dossiers ──┐ ┌─ Soumis─┐│
│ │ 🏢               │ │ 📈             │ │ 📄          │ │ 👥     ││
│ │ 8                │ │ 156            │ │ 67/89       │ │ 8      ││
│ │ 3 en vente      │ │ ≈ CHF 78.5M    │ │ 12 prêts    │ │ 32 adj ││
│ │ 3 en chantier   │ │                │ │             │ │        ││
│ └─────────────────┘ └────────────────┘ └─────────────┘ └────────┘│
│                                                                      │
│ Projets de l'organisation                                           │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ Projet           │ Statut │ Lots     │ Budget CFC │ Engagé    │  │
│ ├─────────────────────────────────────────────────────────────────│  │
│ │ Jardins du Lac   │ [Vente]│ 28/42    │ CHF 12.5M  │ CHF 11.8M │  │
│ │ Genève · En vente│        │ 67% vdus │            │           │  │
│ ├─────────────────────────────────────────────────────────────────│  │
│ │ Résidence Parc   │[Chanti]│ 18/24    │ CHF 8.2M   │ CHF 7.9M  │  │
│ │ Lausanne · Chant.│        │ 75% vdus │            │           │  │
│ ├─────────────────────────────────────────────────────────────────│  │
│ │ Villa Bellevue   │ [Vente]│ 12/18    │ CHF 15.8M  │ CHF 14.2M │  │
│ │ Montreux · Vente │        │ 67% vdus │            │           │  │
│ └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Logique d'Agrégation

**Étapes du calcul**:

```typescript
1. RÉCUPÉRER TOUS LES PROJETS de l'org
   SELECT * FROM projects WHERE organization_id = ?

2. RÉCUPÉRER TOUS LES LOTS des projets
   SELECT * FROM lots WHERE project_id IN (...)

3. AGRÉGER LOTS PAR PROJET
   Map<projectId, { total, sold, reserved, free }>

4. CALCULER TOTAL VENTES CHF
   SUM(price_vat) WHERE status = 'SOLD'

5. RÉCUPÉRER BUDGETS CFC
   SELECT * FROM cfc_budgets WHERE project_id IN (...)

6. AGRÉGER CFC PAR PROJET
   Map<projectId, { budget, engagement, invoiced, paid }>

7. RÉCUPÉRER DOSSIERS ACHETEURS
   SELECT * FROM buyer_files WHERE project_id IN (...)
   COUNT par status

8. RÉCUPÉRER SOUMISSIONS
   SELECT * FROM submissions WHERE project_id IN (...)
   COUNT par status

9. CONSTRUIRE LA RÉPONSE
   Combiner toutes les agrégations
```

---

## 🔄 Workflows Complets

### Workflow 1: Courtier Suit un Dossier Lot

```
1. COURTIER CLIQUE SUR LOT A101
   Depuis la liste des lots

   ↓

2. API APPEL GET /deal
   Récupère:
   - Lot + bâtiment + étage
   - Acheteur Jean Dupont
   - Réservation signée 05.11.2024
   - Contrat vente signé 15.12.2024
   - Dossier notaire READY_FOR_SIGNATURE
   - Dernier acte v3
   - RDV notaire 20.12.2024

   ↓

3. AFFICHAGE PAGE DÉTAIL
   Toutes les infos affichées en cartes

   ↓

4. COURTIER TÉLÉCHARGE ACTE
   Clic sur lien → download PDF

   ↓

5. COURTIER VOIT RDV NOTAIRE
   Date: 20.12.2024 à 10h
   Lieu: Étude notariale, Rue du Rhône 45

   ↓

6. COURTIER MET À JOUR DATES
   Modifie date signature réservation
   Modifie date signature acte
   Clic "Enregistrer"

   ↓

7. API APPEL PATCH /signatures
   Mise à jour sales_contract

   ↓

8. LOG D'AUDIT CRÉÉ

   ↓

9. RECHARGEMENT DONNÉES
   Dates mises à jour visibles
```

### Workflow 2: Direction Consulte le Reporting

```
1. DIRECTION OUVRE PAGE REPORTING
   URL: /reporting/overview

   ↓

2. API APPEL GET /organization/overview
   organizationId: current org

   ↓

3. BACKEND AGRÈGE LES DONNÉES
   - Récupère tous les projets (8)
   - Compte lots par projet
   - Calcule total ventes (CHF 78.5M)
   - Agrège budgets CFC
   - Compte dossiers notaire (67/89 signés)
   - Compte soumissions (8 en cours)

   ↓

4. AFFICHAGE DASHBOARD
   ┌─ KPIs ──────────────────────┐
   │ 8 projets | 156 lots vendus │
   │ 67/89 dossiers | 8 soumis   │
   └─────────────────────────────┘

   ┌─ Tableau projets ──────────────────────────┐
   │ Jardins du Lac | 28/42 | CHF 12.5M | ...   │
   │ Résidence Parc | 18/24 | CHF 8.2M  | ...   │
   │ Villa Bellevue | 12/18 | CHF 15.8M | ...   │
   └────────────────────────────────────────────┘

   ↓

5. DIRECTION VOIT PERFORMANCE
   Projet "Jardins du Lac":
   - 67% vendus (28/42)
   - Budget CFC CHF 12.5M
   - Engagé CHF 11.8M (94%)
   - Facturé CHF 9.2M
   - Payé CHF 8.5M

   ↓

6. DIRECTION PREND DÉCISIONS
   - Identifier projets sous-performants
   - Voir taux d'engagement CFC
   - Suivre taux de vente
   - Identifier blocages notaire
```

---

## 🔒 Sécurité

### Module Détail Lot Courtier

**Vérifications**:
1. `userId` fourni dans le body
2. Rôle `BROKER` dans `user_organizations`
3. Projet existe et appartient à l'organisation
4. Lot appartient au projet

**Logs d'audit**:
- `BROKER_LOT_SIGNATURES_UPDATED` lors mise à jour dates

### Module Reporting

**Vérifications actuelles**:
- `organizationId` fourni dans le body

**⚠️ À améliorer**:
- Vérifier que l'utilisateur a le droit d'accéder aux données de l'org
- Ajouter rôle `DIRECTION` ou `ADMIN`
- Logger les consultations de reporting

---

## 📊 Tables Impliquées

### Module Détail Lot

```
lots
  ├── buyer_id → buyers
  ├── building_id → buildings
  ├── floor_id → floors
  └── project_id → projects

reservations
  └── lot_id → lots

sales_contracts
  ├── lot_id → lots
  ├── buyer_id → buyers
  └── document_id → documents

buyer_files
  ├── buyer_id → buyers
  └── project_id → projects

notary_files
  └── sales_contract_id → sales_contracts

notary_acts
  ├── notary_file_id → notary_files
  └── document_id → documents

notary_appointments
  └── notary_file_id → notary_files
```

### Module Reporting

```
projects
  └── organization_id → organizations

lots
  ├── project_id → projects
  └── buyer_id → buyers

cfc_budgets
  └── project_id → projects

buyer_files
  ├── project_id → projects
  └── buyer_id → buyers

submissions
  └── project_id → projects

user_organizations
  ├── user_id → users
  └── organization_id → organizations
```

---

## 🧪 Tests

### Test Détail Lot Courtier

```bash
# Get lot deal details
curl -X GET \
  "${SUPABASE_URL}/functions/v1/broker/projects/${PROJECT_ID}/lots/${LOT_ID}/deal" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"userId":"'${USER_ID}'"}'

# Update signatures
curl -X PATCH \
  "${SUPABASE_URL}/functions/v1/broker/projects/${PROJECT_ID}/lots/${LOT_ID}/signatures" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"'${USER_ID}'",
    "reservationSignedAt":"2024-11-05T14:30:00Z",
    "actSignedAt":"2024-12-15T14:30:00Z"
  }'
```

### Test Reporting

```bash
# Organization overview
curl -X GET \
  "${SUPABASE_URL}/functions/v1/reporting/organization/overview" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"organizationId":"'${ORG_ID}'"}'

# Broker performance
curl -X GET \
  "${SUPABASE_URL}/functions/v1/reporting/organization/brokers" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"organizationId":"'${ORG_ID}'"}'
```

---

## 🚀 Évolutions Futures

### Module Détail Lot

1. **Upload de documents**
   - Permettre au courtier d'uploader des pièces
   - Gérer versions de documents

2. **Timeline du lot**
   - Historique chronologique de tous les événements
   - Qui a fait quoi et quand

3. **Notifications automatiques**
   - Email lors changement statut
   - Alerte RDV notaire approchant

4. **Chat intégré**
   - Échange courtier ↔ acheteur
   - Échange courtier ↔ notaire

### Module Reporting

1. **Filtres avancés**
   - Par période (mois, trimestre, année)
   - Par type de projet (résidentiel, commercial)
   - Par statut

2. **Graphiques**
   - Évolution ventes dans le temps
   - Répartition géographique
   - Pipeline de vente (funnel)

3. **Export Excel avancé**
   - Rapport complet multi-feuilles
   - Graphiques intégrés
   - Tableaux croisés dynamiques

4. **Dashboard courtiers**
   - Performance individuelle
   - Comparaison entre courtiers
   - Objectifs et réalisations

5. **Alertes intelligentes**
   - Projet en retard sur objectifs
   - Dépassement budget CFC
   - Taux de conversion faible

---

## 📚 Résumé

### Module Détail Lot Courtier ✅

- **Route API** ajoutée dans Edge Function `broker`
- **Page React** `BrokerLotDetail.tsx` créée
- **Vue 360°** complète d'un lot
- **Modification dates** signature (réservation + acte)
- **Documents** téléchargeables
- **Informations notaire** complètes

### Module Reporting Multi-Projets ✅

- **Edge Function** `reporting` créée
- **2 routes** (overview + brokers)
- **Page React** `ReportingOverview.tsx` créée
- **4 KPIs** globaux
- **Tableau projets** avec lots et CFC
- **Agrégations** automatiques

### À Faire

1. ✅ Déployer les Edge Functions
2. ⏳ Tester avec données réelles
3. ⏳ Ajouter authentification complète
4. ⏳ Créer liens navigation entre pages
5. ⏳ Ajouter graphiques dans reporting
6. ⏳ Tests end-to-end

---

**Vos modules avancés sont prêts! 🎯🇨🇭**
