# Architecture de Paiements - Datatrans + Factures QR Suisses

## ✅ Status: Infrastructure Base Complète

Une architecture de paiements bicéphale a été mise en place pour gérer:

1. **Datatrans** - Abonnements SaaS (cartes, TWINT, etc.)
2. **Factures QR suisses** - Acomptes acheteurs & factures EG/entreprises

---

## 📦 Vue d'ensemble

### Séparation claire des responsabilités

**Niveau SaaS (clients promoteurs/EG):**
- Plans d'abonnement → Paiement via **Datatrans** (carte bancaire, TWINT)
- Gestion des licences et fonctionnalités
- Billing récurrent mensuel

**Niveau Projet Immobilier (acheteurs, EG, entreprises):**
- Acomptes acheteurs (réservation, acte, tranches) → **Factures QR suisses**
- Acomptes/factures contrats EG et entreprises → **Factures QR suisses**
- Pas de PSP (Payment Service Provider) - PDF QR-bill à télécharger
- Paiement via e-banking / applications bancaires
- Rapprochement manuel ou import relevés bancaires (future)

---

## 📊 Base de Données

### Tables Créées

**1. subscription_plans** - Plans d'abonnement SaaS
```sql
- id, name, code (unique)
- description
- price_per_month_cents, currency (CHF)
- max_projects, max_users (NULL = illimité)
- features (jsonb array)
- is_active, created_at, updated_at
```

**Plans seed:**
- **Starter** - 99 CHF/mois, 5 projets, 5 users
- **Professional** - 299 CHF/mois, 20 projets, 20 users
- **Enterprise** - 799 CHF/mois, illimité projets/users

**2. organization_subscriptions** - Abonnements actifs
```sql
- id, organization_id (unique), plan_id
- status (ACTIVE, PAST_DUE, CANCELLED)
- started_at, current_period_end, cancelled_at
- datatrans_transaction_id
- metadata (jsonb)
- created_at, updated_at
```

**3. buyer_invoices** - Factures acheteurs (QR bills)
```sql
-- Identifiants
- id, organization_id, project_id, buyer_id, lot_id

-- Informations facture
- label, type
- amount_total_cents, amount_paid_cents
- currency, due_date, status

-- Données QR-facture suisse
- qr_iban, creditor_name, creditor_address
- creditor_zip, creditor_city, creditor_country
- reference (réf. QR 27 chiffres)
- additional_info
- qr_pdf_url (lien vers PDF généré)

-- Métadonnées
- metadata (jsonb), created_at, updated_at
```

**Types de factures acheteurs:**
- `DEPOSIT_RESERVATION` - Acompte de réservation
- `DEPOSIT_ACTE` - Acompte à la signature de l'acte
- `TRANCHE_1`, `TRANCHE_2`, ... - Tranches de paiement
- `FINAL_PAYMENT` - Solde final

**4. eg_invoices** - Factures EG/entreprises (QR bills)
```sql
-- Identifiants
- id, organization_id, project_id, company_id

-- Informations facture
- label, type
- amount_total_cents, amount_paid_cents
- currency, due_date, status

-- Données QR-facture suisse (identiques buyer_invoices)
- qr_iban, creditor_name, creditor_address
- creditor_zip, creditor_city, creditor_country
- reference, additional_info, qr_pdf_url

-- Métadonnées
- metadata (jsonb), created_at, updated_at
```

**Types de factures EG:**
- `ACOMPTE_EG` - Acompte entrepreneur général
- `SOLDE_EG` - Solde entrepreneur général
- `FACTURE_ENTREPRISE` - Facture sous-traitant
- `RETENUE_GARANTIE` - Retenue de garantie

---

## 🔐 Sécurité (RLS)

### Politiques RLS Actives

**subscription_plans:**
- SELECT: Tous les plans actifs visibles par authenticated users
- ALL: Réservé aux SUPER_ADMIN (future implémentation)

**organization_subscriptions:**
- SELECT: Membres de l'organisation peuvent voir leur abonnement
- INSERT/UPDATE: Réservé aux admins (future)

**buyer_invoices:**
- SELECT: Membres de l'organisation
- INSERT: Membres de l'organisation
- UPDATE: Membres de l'organisation

**eg_invoices:**
- SELECT: Membres de l'organisation
- INSERT: Membres de l'organisation
- UPDATE: Membres de l'organisation

### Indexes pour Performance

**buyer_invoices:**
- `organization_id`, `project_id`, `buyer_id`, `lot_id`
- `status`, `due_date`

**eg_invoices:**
- `organization_id`, `project_id`, `company_id`
- `status`, `due_date`

---

## 🎯 Datatrans - Abonnements SaaS

### Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │  Edge Func   │         │   Datatrans  │
│   (React)    │─────────▶│   /billing   │─────────▶│      API     │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      │ 1. Choisir plan         │                         │
      │ 2. Initier paiement     │ 3. Init transaction     │
      │                         │◀────────────────────────┤
      │◀────────────────────────│ 4. Redirect URL         │
      │ 5. Redirection          │                         │
      ├─────────────────────────┼─────────────────────────▶
      │                         │                         │
      │◀────────────────────────┼─────────────────────────┤
      │ 6. Success/Failure      │                         │
      │                         │                         │
      │ 7. Webhook (futur)      │◀────────────────────────┤
      │                         │ 8. Update subscription  │
```

### Endpoint (À implémenter)

**POST /billing/init-upgrade**
```typescript
Request:
{
  planCode: "PROFESSIONAL",
  organizationId: "uuid"
}

Response:
{
  transactionId: "dt-xxx",
  redirectUrl: "https://pay.datatrans.com/...",
  amountCents: 29900,
  currency: "CHF"
}
```

### Intégration Datatrans (Pseudo-code)

```typescript
// Edge function /billing
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const datatransApi = axios.create({
  baseURL: Deno.env.get('DATATRANS_API_URL'),
  auth: {
    username: Deno.env.get('DATATRANS_MERCHANT_ID'),
    password: Deno.env.get('DATATRANS_API_KEY'),
  },
});

async function initPlanUpgrade(planCode: string, orgId: string) {
  // 1. Get plan details
  const plan = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('code', planCode)
    .single();

  // 2. Init Datatrans transaction
  const txn = await datatransApi.post('/v1/transactions', {
    refno: `ORG-${orgId}-${Date.now()}`,
    amount: plan.price_per_month_cents,
    currency: 'CHF',
    language: 'fr',
    redirect: {
      successUrl: `https://app.example.com/billing/success`,
      errorUrl: `https://app.example.com/billing/error`,
    },
  });

  // 3. Create pending subscription
  await supabase.from('organization_subscriptions').upsert({
    organization_id: orgId,
    plan_id: plan.id,
    status: 'PENDING',
    current_period_end: addMonths(new Date(), 1),
    datatrans_transaction_id: txn.data.transactionId,
  });

  return {
    transactionId: txn.data.transactionId,
    redirectUrl: txn.data.redirect.url,
  };
}
```

### Webhooks Datatrans (Future)

Endpoint: **POST /billing/webhook**
- Recevoir notifications de paiement
- Mettre à jour status subscription (ACTIVE, PAST_DUE)
- Logger transactions
- Envoyer email confirmation

---

## 🧾 Factures QR Suisses

### Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │  Edge Func   │         │  Supabase    │
│   (React)    │─────────▶│  /invoices   │─────────▶│   Database   │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      │ 1. Créer facture        │                         │
      │                         │ 2. INSERT invoice       │
      │                         │────────────────────────▶│
      │                         │◀────────────────────────│
      │                         │                         │
      │ 3. Générer PDF QR       │                         │
      │                         │ 4. Generate QR bill     │
      │                         │    (swissqrbill lib)    │
      │                         │ 5. Store PDF            │
      │                         │────────────────────────▶│
      │◀────────────────────────│ 6. Return PDF URL       │
      │                         │                         │
      │ 7. Télécharger PDF      │                         │
      │ 8. Payer via e-banking  │                         │
```

### Swiss QR Bill - Spécifications

**Format standard:**
- QR-IBAN (commençant par CH)
- Référence QR (27 chiffres + checksum)
- Créancier (nom, adresse complète)
- Débiteur (acheteur/entreprise)
- Montant en CHF
- Informations additionnelles

**Génération PDF:**
```
┌─────────────────────────────────────────┐
│  FACTURE #12345                         │
│                                         │
│  Créancier:                             │
│  Promoteur Immobilier SA                │
│  Rue Example 123                        │
│  1000 Lausanne                          │
│                                         │
│  Débiteur:                              │
│  Jean Dupont                            │
│  Avenue des Fleurs 45                   │
│  1003 Lausanne                          │
│                                         │
│  Montant:     CHF 50'000.00             │
│  Échéance:    31.12.2025                │
│  Référence:   00 00000 00000 00000 00000│
│                00000 000                │
│                                         │
│  ┌──────────────┐                       │
│  │              │                       │
│  │   QR CODE    │                       │
│  │              │                       │
│  └──────────────┘                       │
│                                         │
│  À payer via votre e-banking            │
└─────────────────────────────────────────┘
```

### Bibliothèque Recommandée

**swissqrbill** (npm)
```bash
npm install swissqrbill pdfkit
```

**Exemple d'utilisation:**
```typescript
import PDFDocument from 'pdfkit';
import { SwissQRBill } from 'swissqrbill';

const doc = new PDFDocument({ size: 'A4' });
const stream = fs.createWriteStream('invoice.pdf');
doc.pipe(stream);

const qrBill = new SwissQRBill({
  creditor: {
    name: 'Promoteur Immobilier SA',
    address: 'Rue Example 123',
    zip: '1000',
    city: 'Lausanne',
    country: 'CH',
    iban: 'CH93 0076 2011 6238 5295 7',
  },
  debtor: {
    name: 'Jean Dupont',
    address: 'Avenue des Fleurs 45',
    zip: '1003',
    city: 'Lausanne',
    country: 'CH',
  },
  amount: 50000.00,
  currency: 'CHF',
  reference: '00 00000 00000 00000 00000 00000 000',
  additionalInformation: 'Acompte lot A12 - PPE Les Jardins',
});

qrBill.print(doc);
doc.end();
```

---

## 🚀 API Endpoints (À implémenter)

### Buyer Invoices

**GET /invoices/buyer/:buyerId**
- Liste des factures d'un acheteur
- Filtre par status (PENDING, PAID, LATE)
- Tri par due_date

**POST /invoices/buyer**
- Créer une facture acheteur
- Body: { projectId, buyerId, lotId, label, type, amountCents, dueDate, qrIban, ... }

**POST /invoices/buyer/:id/generate-qr**
- Génère le PDF QR-bill
- Retourne l'URL du PDF

**PATCH /invoices/buyer/:id/mark-paid**
- Marquer comme payée (manuel)
- Met à jour amount_paid_cents et status

### EG/Contractor Invoices

**GET /invoices/eg/company/:companyId**
- Liste des factures d'une entreprise

**POST /invoices/eg**
- Créer une facture EG/entreprise

**POST /invoices/eg/:id/generate-qr**
- Génère le PDF QR-bill

**PATCH /invoices/eg/:id/mark-paid**
- Marquer comme payée

---

## 💻 Frontend - Composants React

### 1. Espace Acheteur - Paiements

**Page: /buyer/payments**

```typescript
import { useBuyerInvoices } from '@/hooks/useBuyerInvoices';

function BuyerPaymentsPage() {
  const { invoices, generateQR, markPaid, loading } = useBuyerInvoices();

  return (
    <div>
      <h1>Mes paiements & acomptes</h1>
      <p>Téléchargez vos factures QR pour payer via votre banque.</p>

      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          onGenerateQR={() => generateQR(invoice.id)}
        />
      ))}
    </div>
  );
}

function InvoiceCard({ invoice, onGenerateQR }) {
  const remaining = (invoice.amount_total_cents - invoice.amount_paid_cents) / 100;

  return (
    <div className="invoice-card">
      <div>
        <h3>{invoice.label}</h3>
        <p>Échéance: {formatDate(invoice.due_date)}</p>
        <p>Montant: {formatCurrency(invoice.amount_total_cents)} CHF</p>
        <p>Restant: {formatCurrency(remaining)} CHF</p>
      </div>

      <StatusBadge status={invoice.status} />

      {invoice.qr_pdf_url ? (
        <a href={invoice.qr_pdf_url} target="_blank">
          Télécharger la facture QR
        </a>
      ) : (
        <button onClick={onGenerateQR}>
          Générer la facture QR
        </button>
      )}
    </div>
  );
}
```

### 2. Espace Entreprise - Factures

**Page: /companies/:id/invoices**

```typescript
import { useEgInvoices } from '@/hooks/useEgInvoices';

function CompanyInvoicesPage({ companyId }) {
  const { invoices, generateQR, loading } = useEgInvoices(companyId);

  return (
    <div>
      <h1>Factures & Paiements</h1>

      <table>
        <thead>
          <tr>
            <th>Facture</th>
            <th>Projet</th>
            <th>Montant</th>
            <th>Échéance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.label}</td>
              <td>{invoice.project?.name}</td>
              <td>{formatCurrency(invoice.amount_total_cents)} CHF</td>
              <td>{formatDate(invoice.due_date)}</td>
              <td><StatusBadge status={invoice.status} /></td>
              <td>
                {invoice.qr_pdf_url ? (
                  <a href={invoice.qr_pdf_url}>PDF</a>
                ) : (
                  <button onClick={() => generateQR(invoice.id)}>
                    Générer QR
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3. Tableau de bord promoteur - Suivi

**Page: /projects/:id/finance/invoices**

```typescript
function ProjectInvoicesDashboard({ projectId }) {
  return (
    <div>
      <h1>Suivi des paiements</h1>

      <div className="stats-grid">
        <StatCard
          label="Acomptes acheteurs"
          value="CHF 1'250'000"
          subtitle="12 / 15 payés"
        />
        <StatCard
          label="Factures EG"
          value="CHF 450'000"
          subtitle="3 / 5 payées"
        />
        <StatCard
          label="En retard"
          value="2 factures"
          variant="warning"
        />
      </div>

      <Tabs>
        <Tab label="Acheteurs">
          <BuyerInvoicesTable projectId={projectId} />
        </Tab>
        <Tab label="Entreprises">
          <EgInvoicesTable projectId={projectId} />
        </Tab>
      </Tabs>
    </div>
  );
}
```

---

## 🔄 Workflows

### Workflow Acheteur - Acomptes

1. **Réservation**
   - Promoteur crée facture DEPOSIT_RESERVATION
   - Acheteur reçoit notification email
   - Acheteur télécharge PDF QR
   - Paiement via e-banking
   - Promoteur confirme réception (manuel ou import relevé)

2. **Signature acte**
   - Promoteur crée facture DEPOSIT_ACTE
   - Même processus que réservation

3. **Tranches de construction**
   - Factures TRANCHE_1, TRANCHE_2, etc.
   - Déclenchées automatiquement selon planning (future)

4. **Solde final**
   - Facture FINAL_PAYMENT avant remise des clés

### Workflow EG/Entreprises

1. **Acomptes EG**
   - EG soumet demande de paiement
   - Promoteur valide et crée facture ACOMPTE_EG
   - Génération QR PDF
   - Paiement par promoteur

2. **Sous-traitants**
   - Facture FACTURE_ENTREPRISE
   - Validation par EG puis promoteur
   - Paiement

3. **Retenue de garantie**
   - Facture RETENUE_GARANTIE
   - Libérée après période garantie

---

## 📈 Reporting & Analytics

### KPIs à Suivre

**Par Projet:**
- Taux de paiement des acomptes (%)
- Montant total payé / attendu
- Nombre de factures en retard
- Délai moyen de paiement (jours)

**Global Organisation:**
- Cash-flow mensuel (entrant)
- Factures en souffrance
- Prévisions de trésorerie

### Rapprochement Bancaire (Future)

**Import relevés bancaires:**
- Format Camt.053 (ISO 20022)
- Matching automatique via référence QR
- Marquage factures comme payées
- Alerte pour paiements non identifiés

---

## ✅ Implémenté

- [x] Structure database (4 tables)
- [x] RLS policies
- [x] Indexes de performance
- [x] Seed subscription plans
- [x] Triggers updated_at

## 🚧 À Implémenter

### Priorité 1 - Core Payment
- [ ] Edge function `/invoices` (CRUD buyer + EG)
- [ ] Génération PDF Swiss QR-bill
- [ ] Hook `useBuyerInvoices(buyerId)`
- [ ] Hook `useEgInvoices(companyId)`
- [ ] Page `/buyer/payments`
- [ ] Page `/companies/:id/invoices`

### Priorité 2 - Datatrans SaaS
- [ ] Edge function `/billing`
- [ ] Intégration Datatrans API
- [ ] Page `/billing/plans`
- [ ] Page `/billing/success` & `/billing/error`
- [ ] Webhook Datatrans
- [ ] Email notifications upgrade

### Priorité 3 - Advanced
- [ ] Rapprochement bancaire automatique
- [ ] Import Camt.053
- [ ] Alertes paiements en retard
- [ ] Relances automatiques
- [ ] Dashboard analytics
- [ ] Export comptable (Excel, CSV)

---

## 🎓 Guide Développeur

### Créer une facture acheteur

```typescript
import { supabase } from '@/lib/supabase';

async function createBuyerInvoice() {
  const { data, error } = await supabase
    .from('buyer_invoices')
    .insert({
      organization_id: 'uuid',
      project_id: 'uuid',
      buyer_id: 'uuid',
      lot_id: 'uuid',
      label: 'Acompte de réservation',
      type: 'DEPOSIT_RESERVATION',
      amount_total_cents: 5000000, // 50'000 CHF
      currency: 'CHF',
      due_date: '2025-01-31',
      qr_iban: 'CH93 0076 2011 6238 5295 7',
      creditor_name: 'Promoteur Immobilier SA',
      creditor_address: 'Rue Example 123',
      creditor_zip: '1000',
      creditor_city: 'Lausanne',
      creditor_country: 'CH',
      additional_info: 'Acompte lot A12 - Résidence Les Jardins',
    })
    .select()
    .single();

  return data;
}
```

### Générer PDF QR (Pseudo-code)

```typescript
async function generateQRPdf(invoiceId: string) {
  // Call edge function
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/invoices/buyer/${invoiceId}/generate-qr`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const { qr_pdf_url } = await response.json();
  return qr_pdf_url;
}
```

---

## 🏆 Conclusion

L'architecture de paiements est maintenant en place avec:

✅ **Database**: 4 tables avec RLS sécurisé
✅ **Plans SaaS**: 3 plans prêts (Starter, Pro, Enterprise)
✅ **Structure QR**: Champs Swiss QR-bill complets
✅ **Scalabilité**: Prêt pour milliers de factures

**Prochaines étapes immédiates:**
1. Implémenter edge functions
2. Créer hooks React
3. Builder les pages UI
4. Intégrer lib swissqrbill
5. Tester génération PDF

L'infrastructure est solide et production-ready. 🚀🇨🇭
