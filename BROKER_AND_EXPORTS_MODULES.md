# 📦 Modules Courtiers & Exports - Documentation Complète

## Vue d'ensemble

Ce document décrit deux modules essentiels pour la gestion immobilière:

1. **Module Courtiers (Broker)** - Gestion des lots et contrats de vente
2. **Module Exports** - Export de données (CSV, JSON) pour reporting

---

## 🏢 Module Courtiers (Broker)

### Edge Function `/broker`

**Fichier**: `supabase/functions/broker/index.ts`

Cette Edge Function gère toutes les opérations liées aux courtiers:
- Liste des lots d'un projet
- Mise à jour du statut des lots
- Gestion des dates de signature
- Attachement de contrats de vente
- Liste des contrats de vente

### Routes Disponibles

#### 1. Liste des lots (GET)

```typescript
GET /broker/projects/:projectId/lots
```

**Body**:
```json
{
  "userId": "20000000-0000-0000-0000-000000000001"
}
```

**Response**:
```json
[
  {
    "id": "uuid",
    "lotNumber": "A101",
    "roomsLabel": "3.5 pièces",
    "surfaceHabitable": 85.5,
    "status": "FREE",
    "priceVat": 450000,
    "priceQpt": 430000,
    "building": {
      "id": "uuid",
      "name": "Bâtiment A"
    },
    "floor": {
      "id": "uuid",
      "label": "1er étage"
    },
    "buyer": null
  }
]
```

**Statuts de lot possibles**:
- `FREE` - Disponible
- `RESERVED` - Réservé
- `SOLD` - Vendu
- `BLOCKED` - Bloqué

#### 2. Mettre à jour le statut d'un lot (PATCH)

```typescript
PATCH /broker/projects/:projectId/lots/:lotId/status
```

**Body**:
```json
{
  "userId": "20000000-0000-0000-0000-000000000001",
  "status": "RESERVED"
}
```

**Response**:
```json
{
  "id": "uuid",
  "lot_number": "A101",
  "status": "RESERVED",
  ...
}
```

**Logs d'audit**:
Crée automatiquement un log avec l'action `BROKER_LOT_STATUS_UPDATED`.

#### 3. Mettre à jour les dates de signature (PATCH)

```typescript
PATCH /broker/projects/:projectId/lots/:lotId/signatures
```

**Body**:
```json
{
  "userId": "20000000-0000-0000-0000-000000000001",
  "reservationSignedAt": "2024-12-01T10:00:00Z",
  "actSignedAt": "2024-12-15T14:30:00Z"
}
```

**Response**:
```json
{
  "id": "uuid",
  "signed_at": "2024-12-15T14:30:00Z",
  "effective_at": "2024-12-01T10:00:00Z",
  ...
}
```

#### 4. Attacher un contrat de vente (POST)

```typescript
POST /broker/projects/:projectId/lots/:lotId/sales-contract
```

**Body**:
```json
{
  "userId": "20000000-0000-0000-0000-000000000001",
  "buyerId": "uuid",
  "salesDocumentId": "uuid",
  "actSignedAt": "2024-12-15T14:30:00Z"
}
```

**Comportement**:
- Crée un `sales_contract`
- Crée un `buyer_file` si inexistant (status: `READY_FOR_NOTARY`)
- Change automatiquement le statut du lot en `SOLD`
- Associe l'acheteur au lot
- Crée un log d'audit `BROKER_SALES_CONTRACT_ATTACHED`

**Response**:
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "lot_id": "uuid",
  "buyer_id": "uuid",
  "buyer_file_id": "uuid",
  "document_id": "uuid",
  "signed_at": "2024-12-15T14:30:00Z",
  "effective_at": null,
  "created_by_id": "uuid"
}
```

#### 5. Liste des contrats de vente (GET)

```typescript
GET /broker/projects/:projectId/sales-contracts
```

**Body**:
```json
{
  "userId": "20000000-0000-0000-0000-000000000001"
}
```

**Response**:
```json
[
  {
    "id": "uuid",
    "signedAt": "2024-12-15T14:30:00Z",
    "effectiveAt": "2024-12-01T10:00:00Z",
    "createdAt": "2024-11-20T09:00:00Z",
    "lot": {
      "id": "uuid",
      "lotNumber": "A101",
      "roomsLabel": "3.5 pièces"
    },
    "buyer": {
      "id": "uuid",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com"
    },
    "buyerFileStatus": "READY_FOR_NOTARY"
  }
]
```

#### 6. Détail d'un contrat de vente (GET)

```typescript
GET /broker/sales-contracts/:contractId
```

**Response**:
```json
{
  "id": "uuid",
  "signedAt": "2024-12-15T14:30:00Z",
  "effectiveAt": "2024-12-01T10:00:00Z",
  "createdAt": "2024-11-20T09:00:00Z",
  "project": {
    "id": "uuid",
    "name": "Les Jardins du Lac"
  },
  "lot": {
    "id": "uuid",
    "lotNumber": "A101",
    "roomsLabel": "3.5 pièces",
    "surfaceHabitable": 85.5,
    "priceVat": 450000,
    "priceQpt": 430000,
    "building": {
      "name": "Bâtiment A"
    }
  },
  "buyer": {
    "id": "uuid",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+41 79 123 45 67",
    "addressStreet": "Route de Lausanne 12",
    "addressCity": "Genève",
    "addressPostalCode": "1201"
  },
  "buyerFile": {
    "id": "uuid",
    "status": "READY_FOR_NOTARY",
    "notaryName": "Étude Dupuis & Associés",
    "notaryContact": "notaire@dupuis.ch"
  },
  "document": {
    "id": "uuid",
    "filename": "contrat_vente_A101.pdf",
    "file_path": "documents/...",
    "file_size": 245678,
    "mime_type": "application/pdf"
  }
}
```

### Sécurité

Toutes les routes vérifient:
1. Le `userId` est fourni
2. L'utilisateur a le rôle `BROKER` dans l'organisation du projet
3. Le projet existe et appartient à l'organisation

**Fonction de vérification**:
```typescript
async function ensureBrokerAccess(supabase, userId, projectId) {
  // 1. Vérifie que le projet existe
  // 2. Récupère l'organization_id du projet
  // 3. Vérifie que l'utilisateur a le rôle BROKER dans cette org
  // 4. Lance une exception si les droits sont insuffisants
}
```

---

## 📊 Module Exports

### Edge Function `/exports`

**Fichier**: `supabase/functions/exports/index.ts`

Cette Edge Function permet d'exporter différentes données au format CSV ou JSON.

### Routes Disponibles

#### 1. Export Programme de Vente (CSV)

```typescript
GET /exports/projects/:projectId/lots.csv
```

**Description**: Exporte tous les lots d'un projet au format CSV

**Format CSV**:
```csv
Bâtiment;Lot;Étage;Type;Surface habitable;Prix (CHF);Statut;Acheteur
Bâtiment A;A101;1er étage;3.5 pièces;85.5;450000;SOLD;Jean Dupont
Bâtiment A;A102;1er étage;4.5 pièces;105.2;580000;FREE;
```

**Headers HTTP**:
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="programme_vente_<projectId>.csv"
```

**Utilisation**:
```typescript
const response = await fetch(
  `${supabaseUrl}/functions/v1/exports/projects/${projectId}/lots.csv`,
  {
    headers: {
      'Authorization': `Bearer ${ANON_KEY}`,
    }
  }
);

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'programme_vente.csv';
a.click();
```

#### 2. Export Programme de Vente (JSON)

```typescript
GET /exports/projects/:projectId/lots.json
```

**Description**: Exporte tous les lots d'un projet au format JSON structuré

**Format JSON**:
```json
{
  "project": {
    "id": "uuid",
    "name": "Les Jardins du Lac",
    "code": "JDL001",
    "address": {
      "street": "Route de Lausanne",
      "city": "Genève",
      "postalCode": "1201"
    }
  },
  "lots": [
    {
      "id": "uuid",
      "lotNumber": "A101",
      "roomsLabel": "3.5 pièces",
      "surfaceHabitable": 85.5,
      "status": "SOLD",
      "priceVat": 450000,
      "priceQpt": 430000,
      "building": {
        "id": "uuid",
        "name": "Bâtiment A"
      },
      "floor": {
        "id": "uuid",
        "label": "1er étage"
      },
      "buyer": {
        "id": "uuid",
        "first_name": "Jean",
        "last_name": "Dupont",
        "email": "jean.dupont@example.com"
      }
    }
  ],
  "exportedAt": "2024-12-03T10:30:00Z"
}
```

**Headers HTTP**:
```
Content-Type: application/json
Content-Disposition: attachment; filename="programme_vente_<projectId>.json"
```

#### 3. Export Comparatif Soumissions (CSV)

```typescript
GET /exports/submissions/:submissionId/comparison.csv
```

**Description**: Exporte un comparatif des offres d'une soumission

**Format CSV**:
```csv
Comparatif Soumission: Gros Œuvre - Bâtiment A
Projet: Les Jardins du Lac

Entreprise;Montant HT (CHF);Montant TTC (CHF);Statut
Entreprise Générale SA;850000;918000;ACCEPTED
Constructions Modernes Sàrl;920000;994400;DECLINED
```

**Headers HTTP**:
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="comparatif_soumission_<submissionId>.csv"
```

#### 4. Export Synthèse CFC (CSV)

```typescript
GET /exports/projects/:projectId/cfc.csv
```

**Description**: Exporte la synthèse budgétaire CFC d'un projet

**Format CSV**:
```csv
Synthèse CFC - Les Jardins du Lac

CFC;Libellé;Budget initial (CHF);Budget révisé (CHF);Engagements (CHF);Facturé (CHF);Payé (CHF)
110;Travaux préparatoires;150000;145000;140000;138000;135000
120;Fondations et génie civil;850000;870000;865000;850000;820000
130;Gros œuvre;2500000;2550000;2540000;2400000;2300000
```

**Headers HTTP**:
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="cfc_<projectId>.csv"
```

### Fonction d'Échappement CSV

```typescript
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);

  // Échappe les caractères spéciaux CSV
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}
```

---

## 🖥️ Pages React (Frontend)

### Page Liste des Lots

**Fichier**: `src/pages/BrokerLots.tsx`

**Fonctionnalités**:
- Affiche tous les lots d'un projet
- Filtrage par statut (Disponible, Réservé, Vendu, Bloqué)
- Changement de statut en 1 clic (dropdown)
- Affichage des informations acheteur
- Design responsive avec tableau

**Screenshot conceptuel**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Espace courtiers                                                │
│ Programme de vente – Gestion des lots                           │
│ Mettez à jour les statuts des lots, visualisez les acheteurs   │
├─────────────────────────────────────────────────────────────────┤
│ [Filtrer par statut ▼] [Tous les statuts]    [Actualiser]      │
├─────────────────────────────────────────────────────────────────┤
│ Lot  │ Bâtiment/Étage │ Type      │ Surface │ Prix       │ Statut    │ Acheteur       │
│──────┼────────────────┼───────────┼─────────┼────────────┼───────────┼────────────────│
│ A101 │ Bâtiment A     │ 3.5 pièces│ 85.5 m²│ CHF 450'000│ [Vendu ▼] │ Jean Dupont    │
│      │ 1er étage      │           │         │            │           │ jean@example   │
│──────┼────────────────┼───────────┼─────────┼────────────┼───────────┼────────────────│
│ A102 │ Bâtiment A     │ 4.5 pièces│ 105 m²  │ CHF 580'000│ [Libre ▼] │ Aucun acheteur │
│      │ 1er étage      │           │         │            │           │                │
└─────────────────────────────────────────────────────────────────┘
Total: 42 lots
```

**Code d'intégration**:
```typescript
// Chargement des lots
const loadLots = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const apiUrl = `${supabaseUrl}/functions/v1/broker`;

  const response = await fetch(`${apiUrl}/projects/${projectId}/lots`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  const data = await response.json();
  setLots(data);
};

// Changement de statut
const handleStatusChange = async (lotId: string, newStatus: string) => {
  const response = await fetch(
    `${apiUrl}/projects/${projectId}/lots/${lotId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus, userId }),
    }
  );

  await loadLots(); // Recharge la liste
};
```

### Page Liste des Contrats de Vente

**Fichier**: `src/pages/BrokerSalesContracts.tsx`

**Fonctionnalités**:
- Liste tous les contrats de vente d'un projet
- Affiche lot, acheteur, dates de signature
- Badge de statut du dossier notaire
- Bouton pour voir les détails

**Screenshot conceptuel**:
```
┌──────────────────────────────────────────────────────────────────┐
│ Espace courtiers                                                 │
│ Contrats de vente                                                │
│ Gérez les contrats de vente et suivez leur avancement           │
├──────────────────────────────────────────────────────────────────┤
│ 8 contrats de vente                              [Actualiser]    │
├──────────────────────────────────────────────────────────────────┤
│ 📄 Lot A101 · 3.5 pièces                         [Détails →]    │
│    Créé le 20.11.2024                                            │
│                                                                  │
│    Acheteur          Signature acte      Dossier notaire        │
│    Jean Dupont       ● 15.12.2024       [Prêt pour notaire]     │
│    jean@example.com                                              │
├──────────────────────────────────────────────────────────────────┤
│ 📄 Lot A103 · 4.5 pièces                         [Détails →]    │
│    Créé le 22.11.2024                                            │
│                                                                  │
│    Acheteur          Signature acte      Dossier notaire        │
│    Marie Martin      En attente          [Envoyé au notaire]    │
│    marie@example.ch                                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflows Complets

### Workflow 1: Réservation → Vente

```
1. LOT EST DISPONIBLE
   Status: FREE
   Buyer: null

   ↓ [Courtier reçoit une réservation]

2. COURTIER CHANGE LE STATUT
   PATCH /broker/projects/{projectId}/lots/{lotId}/status
   Body: { status: "RESERVED", userId: "..." }

   ↓

3. LOT EST RÉSERVÉ
   Status: RESERVED
   Buyer: null (ou lié si réservation créée)

   ↓ [Acheteur signe le contrat de vente]

4. COURTIER ATTACHE LE CONTRAT
   POST /broker/projects/{projectId}/lots/{lotId}/sales-contract
   Body: {
     buyerId: "uuid",
     salesDocumentId: "uuid",
     actSignedAt: "2024-12-15T14:30:00Z",
     userId: "..."
   }

   ↓

5. LOT EST VENDU
   Status: SOLD (automatique)
   Buyer: Jean Dupont
   SalesContract créé
   BuyerFile créé (status: READY_FOR_NOTARY)

   ↓

6. SUIVI NOTAIRE
   Le dossier apparaît dans la liste des contrats
   Courtier peut suivre l'avancement
```

### Workflow 2: Export Programme de Vente

```
1. UTILISATEUR CLIQUE "EXPORTER"

   ↓

2. FRONTEND APPELLE L'API
   GET /exports/projects/{projectId}/lots.csv

   ↓

3. EDGE FUNCTION GÉNÈRE LE CSV
   - Récupère tous les lots
   - Formate en CSV
   - Échappe les caractères spéciaux

   ↓

4. NAVIGATEUR TÉLÉCHARGE LE FICHIER
   const blob = await response.blob();
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'programme_vente.csv';
   a.click();

   ↓

5. FICHIER TÉLÉCHARGÉ
   programme_vente_<projectId>.csv
```

---

## 🛡️ Sécurité & Permissions

### Rôles Requis

**Module Broker**:
- Rôle: `BROKER` dans `user_organizations`
- Vérifié sur chaque requête
- Accès uniquement aux projets de son organisation

**Module Exports**:
- Pas de vérification de rôle actuellement
- À sécuriser si besoin (ajouter check auth)

### Logs d'Audit

Toutes les actions importantes sont loggées dans `audit_logs`:

```sql
INSERT INTO audit_logs (
  organization_id,
  project_id,
  user_id,
  action,
  entity_type,
  entity_id,
  metadata
) VALUES (
  'org-uuid',
  'project-uuid',
  'user-uuid',
  'BROKER_LOT_STATUS_UPDATED',
  'LOT',
  'lot-uuid',
  '{"status": "SOLD"}'::jsonb
);
```

**Actions loggées**:
- `BROKER_LOT_STATUS_UPDATED` - Changement statut lot
- `BROKER_LOT_SIGNATURES_UPDATED` - Mise à jour dates signature
- `BROKER_SALES_CONTRACT_ATTACHED` - Création contrat vente

---

## 📝 Configuration & Déploiement

### Variables d'Environnement

Pas besoin de configuration supplémentaire, les Edge Functions utilisent:
- `SUPABASE_URL` (auto)
- `SUPABASE_SERVICE_ROLE_KEY` (auto)

### Déploiement des Edge Functions

Les Edge Functions sont déployées dans:
```
supabase/functions/
├── broker/
│   └── index.ts
└── exports/
    └── index.ts
```

### Accès aux Edge Functions

```typescript
// Base URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Module Broker
const brokerUrl = `${supabaseUrl}/functions/v1/broker`;

// Module Exports
const exportsUrl = `${supabaseUrl}/functions/v1/exports`;
```

---

## 🧪 Tests & Exemples

### Test Module Broker

```bash
# Liste des lots
curl -X GET \
  "${SUPABASE_URL}/functions/v1/broker/projects/${PROJECT_ID}/lots" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"userId":"'${USER_ID}'"}'

# Changement statut
curl -X PATCH \
  "${SUPABASE_URL}/functions/v1/broker/projects/${PROJECT_ID}/lots/${LOT_ID}/status" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"userId":"'${USER_ID}'","status":"RESERVED"}'

# Attacher contrat
curl -X POST \
  "${SUPABASE_URL}/functions/v1/broker/projects/${PROJECT_ID}/lots/${LOT_ID}/sales-contract" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"'${USER_ID}'",
    "buyerId":"'${BUYER_ID}'",
    "salesDocumentId":"'${DOC_ID}'",
    "actSignedAt":"2024-12-15T14:30:00Z"
  }'
```

### Test Module Exports

```bash
# Export CSV
curl -X GET \
  "${SUPABASE_URL}/functions/v1/exports/projects/${PROJECT_ID}/lots.csv" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -o programme_vente.csv

# Export JSON
curl -X GET \
  "${SUPABASE_URL}/functions/v1/exports/projects/${PROJECT_ID}/lots.json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -o programme_vente.json

# Export comparatif soumissions
curl -X GET \
  "${SUPABASE_URL}/functions/v1/exports/submissions/${SUBMISSION_ID}/comparison.csv" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -o comparatif.csv
```

---

## 🚀 Évolutions Futures

### Module Broker

1. **Upload de documents**
   ```typescript
   POST /broker/projects/:projectId/lots/:lotId/documents
   ```

2. **Notifications automatiques**
   - Email à l'acheteur lors du changement de statut
   - Email au notaire lors de la création du dossier

3. **Historique des modifications**
   ```typescript
   GET /broker/lots/:lotId/history
   ```

4. **Gestion des acomptes**
   ```typescript
   POST /broker/sales-contracts/:contractId/payments
   ```

### Module Exports

1. **Format Excel (.xlsx)**
   - Utiliser une lib comme `exceljs` (attention: npm package)
   - Tableaux formatés avec couleurs et formules

2. **Format PDF**
   - Utiliser `pdfkit` ou équivalent Deno
   - Templates personnalisables

3. **Exports planifiés**
   - Cron jobs Supabase
   - Envoi automatique par email

4. **Export multi-projets**
   ```typescript
   GET /exports/organizations/:orgId/all-lots.csv
   ```

---

## 📚 Ressources

### Schéma de Base de Données

**Tables impliquées**:
- `lots` - Lots commercialisables
- `buyers` - Acheteurs
- `sales_contracts` - Contrats de vente
- `buyer_files` - Dossiers notaire
- `documents` - Documents PDF/fichiers
- `buildings` - Bâtiments
- `floors` - Étages
- `projects` - Projets
- `user_organizations` - Permissions utilisateurs
- `audit_logs` - Logs d'audit

### Relations Clés

```sql
lots
  ├── buyer_id → buyers
  ├── building_id → buildings
  ├── floor_id → floors
  └── project_id → projects

sales_contracts
  ├── lot_id → lots
  ├── buyer_id → buyers
  ├── buyer_file_id → buyer_files
  ├── document_id → documents
  └── project_id → projects

buyer_files
  ├── buyer_id → buyers
  └── project_id → projects
```

---

## 🎯 Résumé

### Module Broker ✅

- **Edge Function** `broker` créée et déployable
- **6 routes** API disponibles
- **Page React** `BrokerLots.tsx` fonctionnelle
- **Sécurité** via rôle BROKER
- **Audit logs** complets

### Module Exports ✅

- **Edge Function** `exports` créée et déployable
- **4 formats** d'export (CSV, JSON)
- **Échappement CSV** sécurisé
- **Téléchargement** direct depuis le navigateur

### À Faire

1. Déployer les Edge Functions sur Supabase
2. Tester avec des données réelles
3. Ajouter authentification utilisateur réelle
4. Créer la page détail contrat de vente
5. Ajouter boutons d'export dans les pages
6. Tests end-to-end

---

**Vos modules Courtiers & Exports sont prêts! 🎉🇨🇭**
