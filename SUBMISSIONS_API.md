# 📋 API Module Soumissions (Appels d'Offres) - Documentation Complète

## Vue d'ensemble

Cette API gère le **cycle complet des appels d'offres** (soumissions) pour les projets immobiliers suisses:
- Création et gestion d'appels d'offres par poste CFC
- Invitation d'entreprises sélectionnées
- Dépôt d'offres par les entreprises
- Clarifications et questions
- Comparatif des offres reçues
- Adjudication et création automatique du contrat

**URL Base**: `https://[PROJET].supabase.co/functions/v1/submissions`

---

## 📋 Endpoints Disponibles

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/project/:projectId` | Liste soumissions d'un projet |
| GET | `/:id` | Détail soumission complète |
| POST | `/project/:projectId` | Créer soumission |
| POST | `/:id/invite` | Inviter des entreprises |
| POST | `/:id/offers` | Déposer une offre (entreprise) |
| POST | `/:id/status` | Mettre à jour statut |
| POST | `/:id/adjudicate` | Adjudiquer l'offre gagnante |
| POST | `/:id/clarifications` | Ajouter clarification |
| GET | `/:id/comparison` | Comparatif des offres |

---

## 📜 1. GET /project/:projectId - Liste Soumissions

Liste toutes les soumissions d'un projet.

### Request

```bash
GET https://[PROJET].supabase.co/functions/v1/submissions/project/30000000-0000-0000-0000-000000000001
```

### Response

```json
[
  {
    "id": "70000000-0000-0000-0000-000000000001",
    "title": "Appel d'offres plomberie sanitaire",
    "cfc_code": "350",
    "description": "Installation complète plomberie appartements",
    "question_deadline": "2024-12-10T23:59:59Z",
    "offer_deadline": "2024-12-20T23:59:59Z",
    "status": "IN_PROGRESS",
    "clarifications_open": 2,
    "created_at": "2024-12-01T10:00:00Z",
    "offers": [
      {
        "id": "71000000-0000-0000-0000-000000000001",
        "company": {
          "id": "...",
          "name": "Hydro Plomberie Sàrl",
          "type": "SUBCONTRACTOR"
        }
      },
      {
        "id": "71000000-0000-0000-0000-000000000002",
        "company": {
          "id": "...",
          "name": "Swiss Sanitaire SA",
          "type": "SUBCONTRACTOR"
        }
      }
    ]
  },
  {
    "id": "70000000-0000-0000-0000-000000000002",
    "title": "Menuiserie extérieure aluminium",
    "cfc_code": "325",
    "description": null,
    "question_deadline": "2024-12-15T23:59:59Z",
    "offer_deadline": "2025-01-05T23:59:59Z",
    "status": "INVITED",
    "clarifications_open": 0,
    "created_at": "2024-12-02T14:30:00Z",
    "offers": []
  }
]
```

### Cas d'usage

```typescript
// Dashboard soumissions
const projectId = '30000000-0000-0000-0000-000000000001';
const response = await fetch(`${apiUrl}/project/${projectId}`);
const submissions = await response.json();

// Filtrer par statut
const activeSubmissions = submissions.filter(s =>
  s.status === 'INVITED' || s.status === 'IN_PROGRESS'
);

// Compter offres reçues
submissions.forEach(sub => {
  console.log(`${sub.title}: ${sub.offers.length} offre(s) reçue(s)`);
});
```

---

## 🔍 2. GET /:id - Détail Soumission

Récupère une soumission complète avec entreprises invitées et offres détaillées.

### Request

```bash
GET https://[PROJET].supabase.co/functions/v1/submissions/70000000-0000-0000-0000-000000000001
```

### Response

```json
{
  "id": "70000000-0000-0000-0000-000000000001",
  "project_id": "30000000-0000-0000-0000-000000000001",
  "title": "Appel d'offres plomberie sanitaire",
  "cfc_code": "350",
  "description": "Installation complète plomberie appartements",
  "question_deadline": "2024-12-10T23:59:59Z",
  "offer_deadline": "2024-12-20T23:59:59Z",
  "status": "IN_PROGRESS",
  "clarifications_open": 2,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-03T09:15:00Z",

  "project": {
    "id": "30000000-0000-0000-0000-000000000001",
    "name": "Résidence Les Amandiers",
    "city": "Lausanne"
  },

  "invites": [
    {
      "id": "...",
      "company": {
        "id": "20000000-0000-0000-0000-000000000005",
        "name": "Hydro Plomberie Sàrl",
        "type": "SUBCONTRACTOR",
        "email": "contact@hydro-plomberie.ch",
        "phone": "+41 21 555 0101",
        "city": "Lausanne"
      }
    },
    {
      "id": "...",
      "company": {
        "id": "20000000-0000-0000-0000-000000000006",
        "name": "Swiss Sanitaire SA",
        "type": "SUBCONTRACTOR",
        "email": "info@swiss-sanitaire.ch",
        "phone": "+41 21 555 0202",
        "city": "Renens"
      }
    }
  ],

  "offers": [
    {
      "id": "71000000-0000-0000-0000-000000000001",
      "total_excl_vat": 245000,
      "total_incl_vat": 263865,
      "delay_proposal": "12 semaines",
      "status": "SUBMITTED",
      "created_at": "2024-12-05T16:30:00Z",
      "company": {
        "id": "20000000-0000-0000-0000-000000000005",
        "name": "Hydro Plomberie Sàrl",
        "type": "SUBCONTRACTOR",
        "city": "Lausanne"
      },
      "items": [
        {
          "id": "...",
          "label": "Distribution eau chaude/froide",
          "quantity": 45,
          "unit_price": 2800
        },
        {
          "id": "...",
          "label": "Sanitaires complets (WC, lavabo, douche)",
          "quantity": 8,
          "unit_price": 6500
        }
      ]
    },
    {
      "id": "71000000-0000-0000-0000-000000000002",
      "total_excl_vat": 238000,
      "total_incl_vat": 256326,
      "delay_proposal": "10 semaines",
      "status": "SUBMITTED",
      "created_at": "2024-12-06T11:00:00Z",
      "company": {
        "id": "20000000-0000-0000-0000-000000000006",
        "name": "Swiss Sanitaire SA",
        "type": "SUBCONTRACTOR",
        "city": "Renens"
      },
      "items": [
        {
          "id": "...",
          "label": "Distribution eau chaude/froide",
          "quantity": 45,
          "unit_price": 2650
        },
        {
          "id": "...",
          "label": "Sanitaires complets (WC, lavabo, douche)",
          "quantity": 8,
          "unit_price": 6400
        }
      ]
    }
  ]
}
```

---

## ➕ 3. POST /project/:projectId - Créer Soumission

Crée un nouvel appel d'offres, optionnellement avec invitation immédiate d'entreprises.

### Request

```json
{
  "title": "Appel d'offres plomberie sanitaire",
  "cfcCode": "350",
  "description": "Installation complète plomberie appartements",
  "questionDeadline": "2024-12-10T23:59:59Z",
  "offerDeadline": "2024-12-20T23:59:59Z",
  "invitedCompanyIds": [
    "20000000-0000-0000-0000-000000000005",
    "20000000-0000-0000-0000-000000000006",
    "20000000-0000-0000-0000-000000000007"
  ],
  "userId": "10000000-0000-0000-0000-000000000001"
}
```

### Response

```json
{
  "id": "70000000-0000-0000-0000-000000000001",
  "project_id": "30000000-0000-0000-0000-000000000001",
  "title": "Appel d'offres plomberie sanitaire",
  "cfc_code": "350",
  "description": "Installation complète plomberie appartements",
  "question_deadline": "2024-12-10T23:59:59Z",
  "offer_deadline": "2024-12-20T23:59:59Z",
  "status": "INVITED",
  "clarifications_open": 0,
  "created_at": "2024-12-01T10:00:00Z"
}
```

### Comportement

- Si `invitedCompanyIds` fourni → `status: "INVITED"`
- Sinon → `status: "DRAFT"`
- Audit log automatique créé

### Cas d'usage

```typescript
// Créer soumission avec invitation immédiate
const newSubmission = {
  title: 'Appel d\'offres plomberie sanitaire',
  cfcCode: '350',
  description: 'Installation complète plomberie 8 appartements',
  questionDeadline: '2024-12-10T23:59:59Z',
  offerDeadline: '2024-12-20T23:59:59Z',
  invitedCompanyIds: selectedCompanies.map(c => c.id),
  userId: currentUser.id,
};

const response = await fetch(`${apiUrl}/project/${projectId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newSubmission),
});

const submission = await response.json();
console.log(`Soumission créée: ${submission.id}`);
```

---

## ✉️ 4. POST /:id/invite - Inviter Entreprises

Invite des entreprises supplémentaires à soumissionner.

### Request

```json
{
  "companyIds": [
    "20000000-0000-0000-0000-000000000008",
    "20000000-0000-0000-0000-000000000009"
  ],
  "userId": "10000000-0000-0000-0000-000000000001"
}
```

### Response

```json
{
  "id": "70000000-0000-0000-0000-000000000001",
  "invites": [
    { "company": { "name": "Hydro Plomberie Sàrl" } },
    { "company": { "name": "Swiss Sanitaire SA" } },
    { "company": { "name": "Plombex Genève SA" } },
    { "company": { "name": "Sanitech Vaud Sàrl" } }
  ]
}
```

### Comportement

- Évite les doublons (entreprises déjà invitées ignorées)
- Si statut `DRAFT` → passe à `INVITED`
- Audit log automatique

---

## 📤 5. POST /:id/offers - Déposer Offre (Entreprise)

Une entreprise dépose son offre avec bordereau détaillé.

### Request

```json
{
  "companyId": "20000000-0000-0000-0000-000000000005",
  "totalExclVat": 245000,
  "totalInclVat": 263865,
  "delayProposal": "12 semaines",
  "items": [
    {
      "label": "Distribution eau chaude/froide",
      "quantity": 45,
      "unitPrice": 2800
    },
    {
      "label": "Sanitaires complets (WC, lavabo, douche)",
      "quantity": 8,
      "unitPrice": 6500
    },
    {
      "label": "Évacuation eaux usées",
      "quantity": 1,
      "unitPrice": 92000
    }
  ]
}
```

### Response

```json
{
  "id": "71000000-0000-0000-0000-000000000001",
  "submission_id": "70000000-0000-0000-0000-000000000001",
  "company_id": "20000000-0000-0000-0000-000000000005",
  "total_excl_vat": 245000,
  "total_incl_vat": 263865,
  "delay_proposal": "12 semaines",
  "status": "SUBMITTED",
  "created_at": "2024-12-05T16:30:00Z"
}
```

### Comportement

- Vérifie que l'entreprise a été invitée
- Si statut `INVITED` ou `DRAFT` → passe à `IN_PROGRESS`
- Items optionnels (bordereau détaillé)

### Calcul TVA Suisse

```typescript
const totalExclVat = 245000;
const vatRate = 7.7; // %
const vatAmount = totalExclVat * (vatRate / 100); // 18'865 CHF
const totalInclVat = totalExclVat + vatAmount; // 263'865 CHF
```

---

## 🔄 6. POST /:id/status - Mettre à Jour Statut

Change le statut de la soumission.

### Request

```json
{
  "status": "CLOSED"
}
```

### Statuts Disponibles

- `DRAFT` - Brouillon
- `INVITED` - Entreprises invitées
- `IN_PROGRESS` - Offres en cours de réception
- `CLOSED` - Clôturée (plus d'offres acceptées)
- `ADJUDICATED` - Adjugée

### Response

```json
{
  "id": "70000000-0000-0000-0000-000000000001",
  "status": "CLOSED",
  "updated_at": "2024-12-20T23:59:59Z"
}
```

---

## 🏆 7. POST /:id/adjudicate - Adjudiquer Offre

Adjudique l'offre gagnante et crée automatiquement le contrat.

### Request

```json
{
  "offerId": "71000000-0000-0000-0000-000000000002",
  "userId": "10000000-0000-0000-0000-000000000001"
}
```

### Response

```json
{
  "id": "70000000-0000-0000-0000-000000000001",
  "status": "ADJUDICATED",
  "offers": [
    {
      "id": "71000000-0000-0000-0000-000000000001",
      "status": "REJECTED",
      "company": { "name": "Hydro Plomberie Sàrl" },
      "total_incl_vat": 263865
    },
    {
      "id": "71000000-0000-0000-0000-000000000002",
      "status": "WINNER",
      "company": { "name": "Swiss Sanitaire SA" },
      "total_incl_vat": 256326
    }
  ]
}
```

### Effets Automatiques

✅ **Offre gagnante** → `status: "WINNER"`
✅ **Autres offres** → `status: "REJECTED"`
✅ **Soumission** → `status: "ADJUDICATED"`
✅ **Contrat créé automatiquement**:
- Type: `SUBCONTRACTOR`
- Montant: `total_incl_vat` de l'offre
- Statut: `DRAFT`

✅ **Si CFC code défini**: Allocation CFC automatique créée
✅ **Audit log** enregistré

### Cas d'usage

```typescript
// Adjudiquer après analyse
const winningOfferId = '71000000-0000-0000-0000-000000000002';

const response = await fetch(`${apiUrl}/${submissionId}/adjudicate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    offerId: winningOfferId,
    userId: currentUser.id,
  }),
});

const result = await response.json();
console.log('Adjudication effectuée, contrat créé automatiquement');
```

---

## 💬 8. POST /:id/clarifications - Ajouter Clarification

Enregistre une question/réponse de clarification.

### Request

```json
{
  "companyId": "20000000-0000-0000-0000-000000000005",
  "message": "Quelle épaisseur pour l'isolation phonique des tuyauteries?",
  "userId": "10000000-0000-0000-0000-000000000001"
}
```

### Response

```json
{
  "id": "70000000-0000-0000-0000-000000000001",
  "clarifications_open": 3
}
```

### Comportement

- Incrémente `clarifications_open`
- Enregistre dans `audit_logs` pour traçabilité
- Peut être utilisé pour générer notifications

---

## 📊 9. GET /:id/comparison - Comparatif Offres

Génère un tableau comparatif des offres reçues.

### Request

```bash
GET https://[PROJET].supabase.co/functions/v1/submissions/70000000-0000-0000-0000-000000000001/comparison
```

### Response

```json
{
  "submissionId": "70000000-0000-0000-0000-000000000001",
  "offers": [
    {
      "offerId": "71000000-0000-0000-0000-000000000001",
      "companyName": "Hydro Plomberie Sàrl",
      "totalExclVat": 245000,
      "totalInclVat": 263865,
      "delayProposal": "12 semaines",
      "status": "SUBMITTED"
    },
    {
      "offerId": "71000000-0000-0000-0000-000000000002",
      "companyName": "Swiss Sanitaire SA",
      "totalExclVat": 238000,
      "totalInclVat": 256326,
      "delayProposal": "10 semaines",
      "status": "SUBMITTED"
    }
  ],
  "items": [
    {
      "label": "Distribution eau chaude/froide",
      "byOffer": [
        {
          "offerId": "71000000-0000-0000-0000-000000000001",
          "companyName": "Hydro Plomberie Sàrl",
          "unitPrice": 2800,
          "quantity": 45,
          "total": 126000
        },
        {
          "offerId": "71000000-0000-0000-0000-000000000002",
          "companyName": "Swiss Sanitaire SA",
          "unitPrice": 2650,
          "quantity": 45,
          "total": 119250
        }
      ]
    },
    {
      "label": "Sanitaires complets (WC, lavabo, douche)",
      "byOffer": [
        {
          "offerId": "71000000-0000-0000-0000-000000000001",
          "companyName": "Hydro Plomberie Sàrl",
          "unitPrice": 6500,
          "quantity": 8,
          "total": 52000
        },
        {
          "offerId": "71000000-0000-0000-0000-000000000002",
          "companyName": "Swiss Sanitaire SA",
          "unitPrice": 6400,
          "quantity": 8,
          "total": 51200
        }
      ]
    }
  ]
}
```

### Cas d'usage

```typescript
// Afficher tableau comparatif
const response = await fetch(`${apiUrl}/${submissionId}/comparison`);
const comparison = await response.json();

// Afficher totaux
comparison.offers.forEach(offer => {
  console.log(`${offer.companyName}: CHF ${offer.totalInclVat.toLocaleString()}`);
});

// Afficher comparaison poste par poste
comparison.items.forEach(item => {
  console.log(`\n${item.label}:`);
  item.byOffer.forEach(detail => {
    console.log(`  ${detail.companyName}: CHF ${detail.total?.toLocaleString() || 'N/A'}`);
  });
});

// Trouver offre la moins chère
const cheapest = comparison.offers.reduce((min, o) =>
  o.totalInclVat < min.totalInclVat ? o : min
);
console.log(`Offre la moins chère: ${cheapest.companyName} - CHF ${cheapest.totalInclVat.toLocaleString()}`);
```

---

## 🔄 Workflow Complet

### Scénario: Appel d'Offres Plomberie

```typescript
// 1. PROMOTEUR CRÉE LA SOUMISSION
const submission = await createSubmission(projectId, {
  title: 'Appel d\'offres plomberie sanitaire',
  cfcCode: '350',
  description: 'Installation complète plomberie 8 appartements',
  questionDeadline: '2024-12-10T23:59:59Z',
  offerDeadline: '2024-12-20T23:59:59Z',
  invitedCompanyIds: [
    'company-hydro-id',
    'company-swiss-sanitaire-id',
    'company-plombex-id',
  ],
  userId: promoterId,
});
// → status: INVITED

// 2. ENTREPRISE 1 POSE QUESTION
await addClarification(submission.id, {
  companyId: 'company-hydro-id',
  message: 'Quelle épaisseur isolation phonique tuyauteries?',
  userId: companyUserId,
});
// → clarifications_open: 1

// 3. ENTREPRISE 1 DÉPOSE OFFRE
await submitOffer(submission.id, {
  companyId: 'company-hydro-id',
  totalExclVat: 245000,
  totalInclVat: 263865,
  delayProposal: '12 semaines',
  items: [
    { label: 'Distribution eau chaude/froide', quantity: 45, unitPrice: 2800 },
    { label: 'Sanitaires complets', quantity: 8, unitPrice: 6500 },
    { label: 'Évacuation eaux usées', quantity: 1, unitPrice: 92000 },
  ],
});
// → status: IN_PROGRESS

// 4. ENTREPRISE 2 DÉPOSE OFFRE
await submitOffer(submission.id, {
  companyId: 'company-swiss-sanitaire-id',
  totalExclVat: 238000,
  totalInclVat: 256326,
  delayProposal: '10 semaines',
  items: [
    { label: 'Distribution eau chaude/froide', quantity: 45, unitPrice: 2650 },
    { label: 'Sanitaires complets', quantity: 8, unitPrice: 6400 },
    { label: 'Évacuation eaux usées', quantity: 1, unitPrice: 90200 },
  ],
});

// 5. PROMOTEUR CLÔTURE LA SOUMISSION
await updateStatus(submission.id, { status: 'CLOSED' });

// 6. PROMOTEUR ANALYSE LE COMPARATIF
const comparison = await getComparison(submission.id);
console.log('Offre 1: CHF 263\'865 (12 sem)');
console.log('Offre 2: CHF 256\'326 (10 sem) ← MOINS CHER + PLUS RAPIDE');

// 7. PROMOTEUR ADJUDIQUE
await adjudicateOffer(submission.id, {
  offerId: 'offer-swiss-sanitaire-id',
  userId: promoterId,
});
// → status: ADJUDICATED
// → Offre gagnante: WINNER
// → Autres offres: REJECTED
// → Contrat créé automatiquement: type SUBCONTRACTOR, montant 256'326 CHF
// → Allocation CFC 350 créée automatiquement
```

---

## 📈 Cas d'Usage Avancés

### Dashboard Soumissions en Cours

```typescript
const submissions = await listByProject(projectId);

const stats = {
  total: submissions.length,
  draft: submissions.filter(s => s.status === 'DRAFT').length,
  invited: submissions.filter(s => s.status === 'INVITED').length,
  inProgress: submissions.filter(s => s.status === 'IN_PROGRESS').length,
  closed: submissions.filter(s => s.status === 'CLOSED').length,
  adjudicated: submissions.filter(s => s.status === 'ADJUDICATED').length,
};

const totalOffers = submissions.reduce((sum, s) => sum + s.offers.length, 0);
const avgOffersPerSubmission = totalOffers / submissions.length;

console.log(`Soumissions actives: ${stats.inProgress}`);
console.log(`Moyenne offres/soumission: ${avgOffersPerSubmission.toFixed(1)}`);
```

### Notifications Deadline

```typescript
const submissions = await listByProject(projectId);
const now = new Date();

submissions.forEach(sub => {
  if (sub.offer_deadline) {
    const deadline = new Date(sub.offer_deadline);
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3 && daysLeft > 0) {
      console.warn(`⚠️ ${sub.title}: deadline dans ${daysLeft} jour(s)`);
    } else if (daysLeft <= 0) {
      console.error(`❌ ${sub.title}: deadline dépassée!`);
    }
  }
});
```

### Export Excel Comparatif

```typescript
const comparison = await getComparison(submissionId);

const excelData = comparison.items.map(item => {
  const row: any = { Poste: item.label };

  item.byOffer.forEach(detail => {
    row[detail.companyName] = detail.total || 'N/A';
  });

  return row;
});

// Ajouter ligne totaux
const totalsRow: any = { Poste: 'TOTAL' };
comparison.offers.forEach(offer => {
  totalsRow[offer.companyName] = offer.totalInclVat;
});
excelData.push(totalsRow);

// Export avec bibliothèque Excel (ex: xlsx)
exportToExcel(excelData, 'Comparatif_Offres_Plomberie.xlsx');
```

---

## 🇨🇭 Spécificités Suisses

### Normes SIA

En Suisse, les appels d'offres construction suivent les normes SIA:
- **SIA 118**: Conditions générales pour les travaux de construction
- **SIA 142**: Règles d'honoraires d'architecte
- **SIA 143**: Règles d'honoraires d'ingénieur

### Délais Typiques

```typescript
const typicalDeadlines = {
  questionDeadline: 7,    // jours après publication
  offerDeadline: 21,      // jours après publication
  analysisTime: 14,       // jours pour analyser offres
  adjudicationTime: 7,    // jours pour adjudication
};
```

### TVA Construction

```typescript
const vatRates = {
  newConstruction: 7.7,    // Construction neuve
  renovation: 7.7,         // Rénovation > 5 ans
  maintenance: 7.7,        // Entretien courant
};
```

### Format Bordereau Suisse

Les bordereaux d'offre suisses suivent typiquement:
- **Code CFC** (Code des frais de construction)
- **Quantité** (m², m³, pièce, forfait)
- **Prix unitaire HT**
- **Total poste HT**

---

## 🔒 Sécurité

### État Actuel (Dev)

```
✅ CORS configuré
✅ SERVICE_ROLE_KEY (bypass RLS)
⚠️ JWT verification désactivée
⚠️ Pas de vérification permissions
```

### Pour Production

1. **Activer JWT**: Redéployer avec `verify_jwt: true`

2. **RLS Policies**:

```sql
-- Soumissions: Visible par membres projet
CREATE POLICY "Users can view submissions in their projects"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = submissions.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Offres: Entreprise voit uniquement ses offres
CREATE POLICY "Companies can view their own offers"
  ON submission_offers FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid()
    )
  );
```

3. **Permissions par rôle**:

```sql
-- Seuls promoteur/architecte peuvent créer soumissions
CREATE POLICY "Only promoters can create submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.slug IN ('promoteur', 'architecte')
    )
  );
```

---

## 📊 Métriques & KPIs

### Taux de Réponse

```typescript
const submissions = await listByProject(projectId);

const responseRate = submissions.map(sub => {
  const invited = sub.invites?.length || 0;
  const received = sub.offers?.length || 0;
  return {
    title: sub.title,
    invited,
    received,
    rate: invited > 0 ? (received / invited * 100) : 0,
  };
});

responseRate.forEach(r => {
  console.log(`${r.title}: ${r.received}/${r.invited} (${r.rate.toFixed(0)}%)`);
});
```

### Économies Réalisées

```typescript
const comparison = await getComparison(submissionId);

if (comparison.offers.length >= 2) {
  const sorted = comparison.offers.sort((a, b) =>
    a.totalInclVat - b.totalInclVat
  );

  const cheapest = sorted[0].totalInclVat;
  const mostExpensive = sorted[sorted.length - 1].totalInclVat;
  const savings = mostExpensive - cheapest;
  const savingsPercent = (savings / mostExpensive) * 100;

  console.log(`Économie réalisée: CHF ${savings.toLocaleString()} (${savingsPercent.toFixed(1)}%)`);
}
```

### Délai Moyen Adjudication

```typescript
const submissions = await listByProject(projectId);

const adjudicatedSubmissions = submissions.filter(s => s.status === 'ADJUDICATED');

const avgTime = adjudicatedSubmissions.reduce((sum, sub) => {
  const created = new Date(sub.created_at);
  const updated = new Date(sub.updated_at);
  const days = (updated - created) / (1000 * 60 * 60 * 24);
  return sum + days;
}, 0) / adjudicatedSubmissions.length;

console.log(`Délai moyen adjudication: ${avgTime.toFixed(1)} jours`);
```

---

## ✅ Résumé

### API Déployée

✅ **9 endpoints** RESTful
✅ **Gestion complète** cycle appel d'offres
✅ **Invitation entreprises** avec gestion doublons
✅ **Dépôt offres** avec bordereau détaillé
✅ **Comparatif automatique** offres
✅ **Adjudication** avec création contrat automatique
✅ **Clarifications** tracées dans audit logs
✅ **Multi-projets** avec isolation

### Fichiers Créés

```
supabase/
└── functions/
    └── submissions/
        └── index.ts          ✅ 550+ lignes

SUBMISSIONS_API.md            ✅ Documentation complète
```

---

**L'API Soumissions est prête pour gérer vos appels d'offres! 📋🇨🇭**

URL: `https://[PROJET].supabase.co/functions/v1/submissions`
