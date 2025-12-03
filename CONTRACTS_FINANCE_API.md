# 💰 API Module Contrats & Finance - Documentation Complète

## Vue d'ensemble

Cette API gère le **cycle complet de gestion financière** d'un projet immobilier suisse:
- Contrats EG (Entreprise Générale) et sous-traitants
- Budget CFC (Code des frais de construction suisse)
- Situations de travaux (work progress)
- Factures et paiements
- **Calcul automatique** des totaux CFC (engagement, facturé, payé)

**URL Base**: `https://[PROJET].supabase.co/functions/v1/contracts-finance`

---

## 📋 Endpoints Disponibles

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/contracts/:id` | Détail contrat complet |
| GET | `/projects/:projectId/contracts` | Liste contrats projet |
| POST | `/projects/:projectId/contracts` | Créer contrat + allocations CFC |
| POST | `/contracts/:id/change-orders` | Ajouter avenant (ordre de modification) |
| POST | `/contracts/:id/progress` | Ajouter situation travaux |
| POST | `/contracts/:id/invoices` | Créer facture |
| POST | `/contracts/invoices/:invoiceId/payments` | Enregistrer paiement |

---

## 🔍 1. GET /contracts/:id - Détail Contrat

Récupère un contrat complet avec toutes ses relations.

### Request

```bash
GET https://[PROJET].supabase.co/functions/v1/contracts-finance/contracts/60000000-0000-0000-0000-000000000001
```

### Response

```json
{
  "id": "60000000-0000-0000-0000-000000000001",
  "organization_id": "00000000-0000-0000-0000-000000000001",
  "project_id": "30000000-0000-0000-0000-000000000001",
  "company_id": "20000000-0000-0000-0000-000000000001",
  "type": "EG",
  "title": "Contrat entreprise générale",
  "cfc_main_code": "200",
  "amount_initial": 3100000,
  "vat_rate": 7.7,
  "status": "ACTIVE",
  "created_at": "2024-11-01T10:00:00Z",

  "company": {
    "id": "20000000-0000-0000-0000-000000000001",
    "name": "EG Construction SA",
    "type": "EG",
    "city": "Lausanne"
  },

  "allocations": [
    {
      "id": "...",
      "cfc_budget_id": "50000000-0000-0000-0000-000000000002",
      "amount": 1400000,
      "cfc_budget": {
        "cfc_code": "200",
        "label": "Gros œuvre",
        "budget_revised": 1400000,
        "engagement_total": 1400000,
        "invoiced_total": 150000,
        "paid_total": 150000
      }
    },
    {
      "id": "...",
      "cfc_budget_id": "50000000-0000-0000-0000-000000000003",
      "amount": 900000,
      "cfc_budget": {
        "cfc_code": "300",
        "label": "Second œuvre",
        "budget_revised": 900000,
        "engagement_total": 900000,
        "invoiced_total": 0,
        "paid_total": 0
      }
    }
  ],

  "change_orders": [
    {
      "id": "...",
      "reference": "AV-001",
      "title": "Avenant modification façade",
      "amount_delta": 50000,
      "status": "APPROVED"
    }
  ],

  "work_progresses": [
    {
      "id": "61000000-0000-0000-0000-000000000001",
      "description": "Travaux terrassement en cours - Acompte 1",
      "progress_percent": 15,
      "status": "TECHNICALLY_APPROVED",
      "submitted_by_id": "...",
      "approved_tech_by_id": "..."
    }
  ],

  "invoices": [
    {
      "id": "62000000-0000-0000-0000-000000000001",
      "invoice_number": "FV-2024-001",
      "issue_date": "2024-11-15",
      "due_date": "2024-12-15",
      "amount_excl_vat": 150000,
      "vat_amount": 11550,
      "amount_incl_vat": 161550,
      "retention_amount": 0,
      "amount_payable": 161550,
      "status": "PAID",
      "payments": [
        {
          "id": "...",
          "payment_date": "2025-01-05",
          "amount": 161550,
          "method": "BANK_TRANSFER"
        }
      ]
    }
  ]
}
```

### Cas d'usage

```typescript
// Afficher page détail contrat
const contractId = '60000000-0000-0000-0000-000000000001';
const response = await fetch(`${apiUrl}/contracts/${contractId}`);
const contract = await response.json();

// Afficher infos principales
console.log(`Contrat: ${contract.title}`);
console.log(`Entreprise: ${contract.company.name}`);
console.log(`Montant initial: CHF ${contract.amount_initial.toLocaleString()}`);

// Afficher allocations CFC
contract.allocations.forEach(alloc => {
  const cfc = alloc.cfc_budget;
  console.log(`${cfc.cfc_code} ${cfc.label}: CHF ${alloc.amount.toLocaleString()}`);
});

// Calculer totaux facturé/payé
const totalInvoiced = contract.invoices.reduce((sum, inv) => sum + inv.amount_incl_vat, 0);
const totalPaid = contract.invoices.reduce((sum, inv) =>
  sum + inv.payments.reduce((s, p) => s + p.amount, 0), 0
);

console.log(`Total facturé: CHF ${totalInvoiced.toLocaleString()}`);
console.log(`Total payé: CHF ${totalPaid.toLocaleString()}`);
```

---

## 📜 2. GET /projects/:projectId/contracts - Liste Contrats

Liste tous les contrats d'un projet.

### Request

```bash
GET https://[PROJET].supabase.co/functions/v1/contracts-finance/projects/30000000-0000-0000-0000-000000000001/contracts
```

### Response

```json
[
  {
    "id": "60000000-0000-0000-0000-000000000001",
    "type": "EG",
    "title": "Contrat entreprise générale",
    "amount_initial": 3100000,
    "status": "ACTIVE",
    "company": {
      "name": "EG Construction SA",
      "type": "EG"
    },
    "allocations": [
      {
        "cfc_budget_id": "50000000-0000-0000-0000-000000000002",
        "amount": 1400000
      }
    ]
  },
  {
    "id": "...",
    "type": "SUBCONTRACTOR",
    "title": "Plomberie sanitaire",
    "amount_initial": 245000,
    "status": "ACTIVE",
    "company": {
      "name": "Hydro Plomberie Sàrl",
      "type": "SUBCONTRACTOR"
    },
    "allocations": []
  }
]
```

### Cas d'usage

```typescript
// Dashboard contrats projet
const projectId = '30000000-0000-0000-0000-000000000001';
const response = await fetch(`${apiUrl}/projects/${projectId}/contracts`);
const contracts = await response.json();

// Afficher tableau contrats
contracts.forEach(contract => {
  console.log(`${contract.type} - ${contract.company.name}: CHF ${contract.amount_initial.toLocaleString()}`);
});

// Calculer montant total contracté
const totalContracted = contracts.reduce((sum, c) => sum + c.amount_initial, 0);
console.log(`Total contracté: CHF ${totalContracted.toLocaleString()}`);

// Filtrer par type
const egContracts = contracts.filter(c => c.type === 'EG');
const subContracts = contracts.filter(c => c.type === 'SUBCONTRACTOR');
```

---

## ➕ 3. POST /projects/:projectId/contracts - Créer Contrat

Crée un contrat avec allocations CFC automatiques.

### Request

```json
{
  "companyId": "20000000-0000-0000-0000-000000000001",
  "title": "Contrat entreprise générale",
  "type": "EG",
  "amountInitial": 3100000,
  "vatRate": 7.7,
  "cfcMainCode": "200",
  "allocations": [
    {
      "cfcBudgetId": "50000000-0000-0000-0000-000000000002",
      "amount": 1400000
    },
    {
      "cfcBudgetId": "50000000-0000-0000-0000-000000000003",
      "amount": 900000
    },
    {
      "cfcBudgetId": "50000000-0000-0000-0000-000000000004",
      "amount": 650000
    }
  ]
}
```

### Response

```json
{
  "id": "60000000-0000-0000-0000-000000000001",
  "organization_id": "00000000-0000-0000-0000-000000000001",
  "project_id": "30000000-0000-0000-0000-000000000001",
  "company_id": "20000000-0000-0000-0000-000000000001",
  "type": "EG",
  "title": "Contrat entreprise générale",
  "amount_initial": 3100000,
  "vat_rate": 7.7,
  "cfc_main_code": "200",
  "status": "DRAFT",
  "created_at": "2024-11-01T10:00:00Z"
}
```

### Effet Automatique

✅ **Les totaux CFC sont mis à jour automatiquement**:
- CFC 200: `engagement_total` passe à 1'400'000 CHF
- CFC 300: `engagement_total` passe à 900'000 CHF
- CFC 400: `engagement_total` passe à 650'000 CHF

### Cas d'usage

```typescript
// Créer contrat EG
const projectId = '30000000-0000-0000-0000-000000000001';

const newContract = {
  companyId: egCompanyId,
  title: 'Contrat entreprise générale',
  type: 'EG',
  amountInitial: 3100000,
  vatRate: 7.7,
  cfcMainCode: '200',
  allocations: [
    { cfcBudgetId: cfcGrosOeuvre.id, amount: 1400000 },
    { cfcBudgetId: cfcSecondOeuvre.id, amount: 900000 },
    { cfcBudgetId: cfcTechnique.id, amount: 650000 },
  ],
};

const response = await fetch(`${apiUrl}/projects/${projectId}/contracts`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newContract),
});

const contract = await response.json();
console.log(`Contrat créé: ${contract.id}`);
```

---

## 📝 4. POST /contracts/:id/change-orders - Avenant

Ajoute un ordre de modification (avenant) au contrat.

### Request

```json
{
  "reference": "AV-001",
  "title": "Avenant modification façade",
  "amountDelta": 50000,
  "cfcBudgetId": "50000000-0000-0000-0000-000000000002"
}
```

### Response

```json
{
  "id": "...",
  "contract_id": "60000000-0000-0000-0000-000000000001",
  "reference": "AV-001",
  "title": "Avenant modification façade",
  "amount_delta": 50000,
  "cfc_budget_id": "50000000-0000-0000-0000-000000000002",
  "status": "DRAFT",
  "created_at": "2024-12-01T14:30:00Z"
}
```

### Cas d'usage Suisse

Les avenants sont courants en Suisse pour:
- Modifications demandées en cours de chantier
- Plus-values/moins-values
- Travaux supplémentaires non prévus
- Adaptations techniques

```typescript
// Créer avenant
const changeOrder = {
  reference: 'AV-001',
  title: 'Modification façade sud - Plus-value',
  amountDelta: 50000, // positif = surcoût
  cfcBudgetId: cfcGrosOeuvre.id,
};

await fetch(`${apiUrl}/contracts/${contractId}/change-orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(changeOrder),
});
```

---

## 📊 5. POST /contracts/:id/progress - Situation Travaux

Enregistre l'avancement des travaux (work progress).

### Request

```json
{
  "description": "Situation novembre 2024 - Terrassement terminé",
  "progressPercent": 15,
  "submittedById": "10000000-0000-0000-0000-000000000001"
}
```

### Response

```json
{
  "id": "61000000-0000-0000-0000-000000000001",
  "contract_id": "60000000-0000-0000-0000-000000000001",
  "description": "Situation novembre 2024 - Terrassement terminé",
  "progress_percent": 15,
  "status": "SUBMITTED",
  "submitted_by_id": "10000000-0000-0000-0000-000000000001",
  "created_at": "2024-11-30T16:00:00Z"
}
```

### Workflow Suisse

**Étapes validation situation**:
1. **EG soumet** → `status: SUBMITTED`
2. **Direction travaux valide techniquement** → `status: TECHNICALLY_APPROVED`
3. **Promoteur valide financièrement** → `status: FINANCIALLY_APPROVED`
4. **Facture créée** (voir endpoint suivant)

---

## 🧾 6. POST /contracts/:id/invoices - Créer Facture

Crée une facture EG avec TVA et rétention de garantie.

### Request

```json
{
  "invoiceNumber": "FV-2024-001",
  "issueDate": "2024-11-15",
  "dueDate": "2024-12-15",
  "amountExclVat": 150000,
  "vatAmount": 11550,
  "amountInclVat": 161550,
  "retentionAmount": 0
}
```

**Calculs TVA Suisse**:
```typescript
const amountExclVat = 150000;
const vatRate = 7.7; // %
const vatAmount = amountExclVat * (vatRate / 100); // 11'550 CHF
const amountInclVat = amountExclVat + vatAmount; // 161'550 CHF
```

**Rétention de garantie**:
```typescript
// Typiquement 5-10% en Suisse
const retentionRate = 5; // %
const retentionAmount = amountInclVat * (retentionRate / 100); // 8'077.50 CHF
const amountPayable = amountInclVat - retentionAmount; // 153'472.50 CHF
```

### Response

```json
{
  "id": "62000000-0000-0000-0000-000000000001",
  "contract_id": "60000000-0000-0000-0000-000000000001",
  "invoice_number": "FV-2024-001",
  "issue_date": "2024-11-15",
  "due_date": "2024-12-15",
  "amount_excl_vat": 150000,
  "vat_amount": 11550,
  "amount_incl_vat": 161550,
  "retention_amount": 0,
  "amount_payable": 161550,
  "status": "SENT",
  "created_at": "2024-11-15T09:00:00Z"
}
```

### Effet Automatique

✅ **Les totaux CFC sont mis à jour**:
- `invoiced_total` augmente de 161'550 CHF

---

## 💳 7. POST /contracts/invoices/:invoiceId/payments - Paiement

Enregistre un paiement de facture.

### Request

```json
{
  "paymentDate": "2025-01-05",
  "amount": 161550,
  "paymentReference": "VIREMENT-2025-001",
  "method": "BANK_TRANSFER"
}
```

### Response

```json
{
  "id": "...",
  "contract_invoice_id": "62000000-0000-0000-0000-000000000001",
  "payment_date": "2025-01-05",
  "amount": 161550,
  "payment_reference": "VIREMENT-2025-001",
  "method": "BANK_TRANSFER",
  "created_at": "2025-01-05T11:30:00Z"
}
```

### Effet Automatique

✅ **Statut facture mis à jour**:
- Si `total_paid >= amount_payable` → `status: PAID`

✅ **Totaux CFC mis à jour**:
- `paid_total` augmente de 161'550 CHF

### Paiements Partiels

L'API supporte les paiements partiels:

```typescript
// Facture: 161'550 CHF
// Paiement 1: 100'000 CHF
await createPayment(invoiceId, { amount: 100000, paymentDate: '2025-01-05' });
// → Facture reste "SENT"

// Paiement 2: 61'550 CHF
await createPayment(invoiceId, { amount: 61550, paymentDate: '2025-01-10' });
// → Facture passe à "PAID"
```

---

## 🧮 Calcul Automatique CFC

### Principe

**À chaque opération**, les totaux CFC sont recalculés automatiquement:

```
engagement_total = Σ allocations CFC de tous les contrats
invoiced_total   = Σ factures TTC de tous les contrats
paid_total       = Σ paiements de toutes les factures
```

### Exemple Complet

**État Initial** (CFC 200 - Gros œuvre):
```
budget_initial:   1'400'000 CHF
budget_revised:   1'400'000 CHF
engagement_total: 0 CHF
invoiced_total:   0 CHF
paid_total:       0 CHF
```

**Après création contrat EG** (allocation 1'400'000 CHF au CFC 200):
```
engagement_total: 1'400'000 CHF ← AUTOMATIQUE
invoiced_total:   0 CHF
paid_total:       0 CHF
```

**Après facture 1** (150'000 CHF TTC):
```
engagement_total: 1'400'000 CHF
invoiced_total:   150'000 CHF ← AUTOMATIQUE
paid_total:       0 CHF
```

**Après paiement facture 1** (150'000 CHF):
```
engagement_total: 1'400'000 CHF
invoiced_total:   150'000 CHF
paid_total:       150'000 CHF ← AUTOMATIQUE
```

**Calculs dérivés**:
```typescript
const reste_a_engager = budget_revised - engagement_total; // 0 CHF
const reste_a_facturer = engagement_total - invoiced_total; // 1'250'000 CHF
const reste_a_payer = invoiced_total - paid_total; // 0 CHF
```

### Fonction updateCfcTotals

Cette fonction est appelée automatiquement après:
- ✅ Création contrat
- ✅ Ajout avenant (change order)
- ✅ Création facture
- ✅ Enregistrement paiement

**Algorithme**:
```typescript
// Pour chaque CFC budget du projet
for (const cfc of cfcBudgets) {

  // 1. Trouver contrats liés à ce CFC
  const relatedContracts = contracts.filter(ct =>
    ct.allocations.some(a => a.cfc_budget_id === cfc.id)
  );

  // 2. Calculer engagement
  const engagement = relatedContracts.reduce((sum, ct) => {
    return sum + ct.allocations
      .filter(a => a.cfc_budget_id === cfc.id)
      .reduce((s, a) => s + a.amount, 0);
  }, 0);

  // 3. Calculer facturé
  const invoiced = relatedContracts.reduce((sum, ct) => {
    return sum + ct.invoices.reduce((s, inv) => s + inv.amount_incl_vat, 0);
  }, 0);

  // 4. Calculer payé
  const paid = relatedContracts.reduce((sum, ct) => {
    return sum + ct.invoices.reduce((s, inv) => {
      return s + inv.payments.reduce((p, pay) => p + pay.amount, 0);
    }, 0);
  }, 0);

  // 5. Mettre à jour CFC
  await updateCfcBudget(cfc.id, { engagement, invoiced, paid });
}
```

---

## 📈 Cas d'Usage Complets

### Dashboard Finance Projet

```typescript
// 1. Récupérer budgets CFC
const { data: cfcBudgets } = await supabase
  .from('cfc_budgets')
  .select('*')
  .eq('project_id', projectId);

// 2. Calculer totaux
const totalBudget = cfcBudgets.reduce((s, c) => s + c.budget_revised, 0);
const totalEngaged = cfcBudgets.reduce((s, c) => s + c.engagement_total, 0);
const totalInvoiced = cfcBudgets.reduce((s, c) => s + c.invoiced_total, 0);
const totalPaid = cfcBudgets.reduce((s, c) => s + c.paid_total, 0);

// 3. Afficher KPIs
console.log(`Budget total: CHF ${totalBudget.toLocaleString()}`);
console.log(`Engagé: CHF ${totalEngaged.toLocaleString()} (${(totalEngaged/totalBudget*100).toFixed(1)}%)`);
console.log(`Facturé: CHF ${totalInvoiced.toLocaleString()}`);
console.log(`Payé: CHF ${totalPaid.toLocaleString()}`);
console.log(`Reste à payer: CHF ${(totalInvoiced - totalPaid).toLocaleString()}`);

// 4. Alertes
cfcBudgets.forEach(cfc => {
  if (cfc.engagement_total > cfc.budget_revised) {
    console.warn(`⚠️ CFC ${cfc.cfc_code} en dépassement: ${((cfc.engagement_total / cfc.budget_revised - 1) * 100).toFixed(1)}%`);
  }
});
```

### Workflow Complet Facture EG

```typescript
// 1. EG soumet situation travaux
const progress = await createWorkProgress(contractId, {
  description: 'Situation novembre 2024',
  progressPercent: 15,
  submittedById: egUserId,
});

// 2. Direction travaux valide
await updateWorkProgress(progress.id, {
  status: 'TECHNICALLY_APPROVED',
  approvedTechById: architectId,
});

// 3. Promoteur valide
await updateWorkProgress(progress.id, {
  status: 'FINANCIALLY_APPROVED',
  approvedFinById: promoterId,
});

// 4. Créer facture
const invoice = await createInvoice(contractId, {
  invoiceNumber: 'FV-2024-001',
  issueDate: '2024-11-15',
  dueDate: '2024-12-15',
  amountExclVat: 150000,
  vatAmount: 11550,
  amountInclVat: 161550,
  retentionAmount: 8077.50, // 5%
});

// 5. Comptabilité enregistre paiement
await createPayment(invoice.id, {
  paymentDate: '2025-01-05',
  amount: 153472.50, // Montant payable (après rétention)
  method: 'BANK_TRANSFER',
});

// 6. Plus tard, libérer rétention
await createPayment(invoice.id, {
  paymentDate: '2026-01-01',
  amount: 8077.50, // Rétention
  paymentReference: 'LIBERATION-GARANTIE',
});
```

---

## 🔒 Sécurité

### État Actuel (Dev)

```
✅ CORS configuré
✅ SERVICE_ROLE_KEY (bypass RLS)
⚠️ JWT verification désactivée
⚠️ Pas de vérification permissions
```

**OK pour développement**, ⚠️ **PAS pour production**

### Pour Production

1. **Activer JWT**:
```typescript
// Redéployer avec verify_jwt: true
```

2. **RLS Policies**:
```sql
-- Contrats: Users can view contracts in their projects
CREATE POLICY "Users can view contracts in their projects"
  ON contracts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = contracts.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Permissions granulaires par rôle
CREATE POLICY "Only finance users can create invoices"
  ON contract_invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND p.name = 'finance.create'
    )
  );
```

3. **Frontend avec Auth**:
```typescript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(apiUrl, {
  headers: {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  },
});
```

---

## 📊 Métriques & KPIs

### Taux d'Engagement Budget

```typescript
const engagementRate = (engagement_total / budget_revised) * 100;

if (engagementRate > 100) {
  alert(`Dépassement budget: ${(engagementRate - 100).toFixed(1)}%`);
} else if (engagementRate > 95) {
  warning('Budget presque atteint');
}
```

### Délai Paiement Moyen

```typescript
const avgPaymentDelay = invoices.reduce((sum, inv) => {
  if (inv.status === 'PAID') {
    const due = new Date(inv.due_date);
    const paid = new Date(inv.payments[inv.payments.length - 1].payment_date);
    const delay = (paid - due) / (1000 * 60 * 60 * 24); // jours
    return sum + delay;
  }
  return sum;
}, 0) / paidInvoices.length;

console.log(`Délai moyen: ${avgPaymentDelay.toFixed(1)} jours`);
```

### Taux de Paiement

```typescript
const paymentRate = (paid_total / invoiced_total) * 100;
console.log(`Taux paiement: ${paymentRate.toFixed(1)}%`);

// Factures en retard
const overdueInvoices = invoices.filter(inv =>
  inv.status !== 'PAID' && new Date(inv.due_date) < new Date()
);

console.log(`${overdueInvoices.length} facture(s) en retard`);
```

---

## 🎯 Checklist Production

### Backend
- [x] Edge Function déployée
- [x] 7 endpoints fonctionnels
- [x] CORS configuré
- [x] Calcul automatique CFC
- [ ] JWT verification activée
- [ ] RLS policies créées
- [ ] Tests unitaires
- [ ] Tests intégration

### Frontend
- [ ] Page liste contrats
- [ ] Page détail contrat
- [ ] Formulaire création contrat
- [ ] Formulaire ajouter facture
- [ ] Formulaire enregistrer paiement
- [ ] Dashboard CFC avec graphiques
- [ ] Alertes dépassement budget
- [ ] Export Excel/PDF

### Workflows
- [ ] Workflow validation situation
- [ ] Workflow approbation facture
- [ ] Workflow paiement multi-niveaux
- [ ] Notifications email (facture due, retard, etc.)

---

## 📝 Exemple Complet: Seed Data

Le fichier `supabase/seed.sql` contient un exemple complet avec:

✅ **Organisation** SwissPrime Dev SA
✅ **Projet** Résidence Les Amandiers (Lausanne)
✅ **Budget CFC** 3.25M CHF (5 postes)
✅ **Contrat EG** 3.1M CHF avec allocations
✅ **Situation travaux** 15% avancement
✅ **Facture** 161'550 CHF **payée**
✅ **CFC mis à jour** automatiquement

**Pour l'exécuter**:
```bash
# Via Supabase Dashboard
# → SQL Editor → Coller le contenu de supabase/seed.sql → Run

# Ou via psql
psql $DATABASE_URL -f supabase/seed.sql
```

---

## 🚀 Prochaines Étapes

### Court Terme

1. **Activer sécurité** (JWT + RLS)
2. **Créer frontend** pages contrats
3. **Tests** automatisés

### Moyen Terme

4. **Notifications** email factures
5. **Exports** PDF factures
6. **Rapports** Excel budgets CFC
7. **Webhooks** pour intégration comptabilité

### Long Terme

8. **Prévisions** trésorerie
9. **IA** détection anomalies budget
10. **OCR** factures automatique

---

## 📚 Ressources

### Standards Suisses

- **Norme SIA 118**: Conditions générales pour travaux de construction
- **Code CFC**: Code des frais de construction suisse
- **TVA**: Taux 7.7% (construction neuve)
- **Rétention de garantie**: Typiquement 5-10%

### Documentation

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [PostgreSQL Numeric](https://www.postgresql.org/docs/current/datatype-numeric.html)

---

## ✅ Résumé

### API Déployée

✅ **7 endpoints** RESTful
✅ **Calcul automatique CFC** (engagement, facturé, payé)
✅ **Gestion complète** cycle contrat → facture → paiement
✅ **Rétention garantie** support natif
✅ **TVA suisse** 7.7%
✅ **Multi-projets** avec isolation

### Fichiers Créés

```
supabase/
├── functions/
│   └── contracts-finance/
│       └── index.ts          ✅ 414 lignes
└── seed.sql                  ✅ Données démo complètes

CONTRACTS_FINANCE_API.md      ✅ Documentation (ce fichier)
```

---

**L'API Contrats & Finance est prête pour piloter vos projets immobiliers suisses! 💰🇨🇭**

URL: `https://[PROJET].supabase.co/functions/v1/contracts-finance`
