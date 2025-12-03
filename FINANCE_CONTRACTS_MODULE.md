# 💰 MODULE FINANCE CONTRATS EG & SOUS-TRAITANTS

> Module complet de gestion des contrats EG, situations de travaux, avenants, facturation et paiements

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Schéma Prisma enrichi](#2-schéma-prisma-enrichi)
3. [Workflow complet](#3-workflow-complet)
4. [Situations de travaux](#4-situations-de-travaux)
5. [Avenants](#5-avenants)
6. [Facturation & Paiements](#6-facturation--paiements)
7. [Validations & Droits](#7-validations--droits)
8. [Intégration CFC](#8-intégration-cfc)
9. [Vues 360°](#9-vues-360)

---

## 1. Vue d'ensemble

### 1.1 Objectif

Permettre au développeur immobilier de gérer **toute la chaîne contractuelle** avec les entreprises :
- Création contrats (EG, sous-traitants, prestataires)
- Avenants (modifications, surcoûts)
- Situations de travaux (avancement, validation)
- Facturation (validation architecte → promoteur)
- Paiements (suivi, retenues de garantie)
- **Intégration totale avec CFC**

### 1.2 Acteurs & rôles

| Acteur | Rôle | Actions |
|--------|------|---------|
| **EG / Sous-traitant** | Exécutant | Propose situations, factures |
| **Architecte** | Validateur technique | Vise situations (OK technique) |
| **Bureau technique** | Validateur technique | Vise situations techniques |
| **Promoteur** | Décideur final | Valide paiements, avenants |
| **Service financier** | Gestionnaire | Saisie paiements, suivi trésorerie |

### 1.3 Périmètre fonctionnel

```
┌─────────────────────────────────────────────────────────────┐
│                   FINANCE CONTRATS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │   CONTRATS   │   │   AVENANTS   │   │  SITUATIONS  │   │
│  │              │   │              │   │   TRAVAUX    │   │
│  │ • Montant    │   │ • Surcoûts   │   │ • Avancement │   │
│  │ • Échéancier │   │ • CFC impact │   │ • Validation │   │
│  │ • Retenues   │   │ • Docs       │   │ • Facturation│   │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                               │
│                            ▼                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            FACTURATION & PAIEMENTS                   │  │
│  │  • Factures fournisseurs                             │  │
│  │  • Workflow validation (Architecte → Promoteur)      │  │
│  │  │  • Paiements (virements, dates, références)       │  │
│  │  • Retenues de garantie                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                               │
│                            ▼                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              INTÉGRATION CFC                         │  │
│  │  Budget → Engagement → Facturé → Payé                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Schéma Prisma enrichi

### 2.1 Entités principales

```prisma
// ============================================================================
// CONTRATS EG & SOUS-TRAITANTS
// ============================================================================

enum ContractType {
  EG                    // Entreprise Générale
  SUBCONTRACTOR         // Sous-traitant
  ARCHITECT             // Architecte
  ENGINEER              // Bureau technique
  OTHER                 // Autre prestataire
}

enum ContractStatus {
  DRAFT                 // Brouillon
  NEGOTIATION           // Négociation
  SIGNED                // Signé
  ACTIVE                // En cours d'exécution
  SUSPENDED             // Suspendu
  COMPLETED             // Terminé
  TERMINATED            // Résilié
}

enum PaymentTermType {
  MILESTONE             // Par jalon
  PROGRESS              // À l'avancement (situations)
  MONTHLY               // Mensuel
  DELIVERY              // À la livraison
  CUSTOM                // Personnalisé
}

model Contract {
  id                    String          @id @default(uuid())
  projectId             String
  companyId             String

  // Identification
  number                String          // Numéro contrat (ex: "CT-2025-001")
  name                  String
  type                  ContractType
  status                ContractStatus  @default(DRAFT)

  // Montants
  amountInitial         Decimal         @db.Decimal(12, 2)  // Montant contractuel initial HT
  amountRevised         Decimal         @db.Decimal(12, 2)  // Montant après avenants
  amountInvoiced        Decimal         @db.Decimal(12, 2)  @default(0)  // Facturé à ce jour
  amountPaid            Decimal         @db.Decimal(12, 2)  @default(0)  // Payé à ce jour

  vatRate               Decimal         @db.Decimal(5, 2)   @default(8.1)

  // Conditions paiement
  paymentTermType       PaymentTermType
  paymentTerms          Json?           // Détails échéancier (jalons, %)
  retentionRate         Decimal?        @db.Decimal(5, 2)   // % retenue de garantie
  retentionAmount       Decimal?        @db.Decimal(12, 2)  // Montant retenu
  retentionReleaseDate  DateTime?       // Date libération garantie

  // Dates
  signedAt              DateTime?
  startDate             DateTime?
  plannedEndDate        DateTime?
  actualEndDate         DateTime?

  // CFC
  cfcLineIds            Json?           // Array CFC concernés

  // Documents
  documentId            String?         // Contrat signé (PDF)

  // Pénalités & clauses
  penaltyClause         String?
  warrantyPeriod        Int?            // Mois de garantie

  // Metadata
  notes                 String?
  createdBy             String
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  // Relations
  project               Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  company               Company         @relation(fields: [companyId], references: [id])
  amendments            ContractAmendment[]
  progressReports       ProgressReport[]
  invoices              ContractInvoice[]
  payments              ContractPayment[]

  @@unique([projectId, number])
  @@index([projectId])
  @@index([companyId])
  @@index([status])
}

// ============================================================================
// AVENANTS
// ============================================================================

enum AmendmentType {
  PRICE_INCREASE        // Augmentation prix
  PRICE_DECREASE        // Diminution prix
  SCOPE_CHANGE          // Modification périmètre
  DEADLINE_EXTENSION    // Prolongation délai
  OTHER                 // Autre
}

enum AmendmentStatus {
  DRAFT                 // Brouillon
  PENDING_APPROVAL      // En attente validation
  APPROVED              // Approuvé
  REJECTED              // Rejeté
  SIGNED                // Signé
}

model ContractAmendment {
  id                String          @id @default(uuid())
  contractId        String

  // Identification
  number            String          // Numéro avenant (ex: "AV-001")
  title             String
  type              AmendmentType
  status            AmendmentStatus @default(DRAFT)

  // Impact financier
  amountChange      Decimal         @db.Decimal(12, 2)  // + ou - (HT)
  justification     String

  // Impact CFC
  cfcLineIds        Json?           // CFC impactés

  // Impact délai
  delayDays         Int?            // Jours supplémentaires

  // Origine
  originType        String?         // "BUYER_MODIFICATION", "PROJECT_CHANGE", "UNFORESEEN"
  originId          String?         // ID modification/changement origine

  // Documents
  documentId        String?         // Avenant signé

  // Workflow
  proposedBy        String          // User ID
  proposedAt        DateTime        @default(now())
  approvedBy        String?
  approvedAt        DateTime?
  signedAt          DateTime?

  notes             String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  // Relations
  contract          Contract        @relation(fields: [contractId], references: [id], onDelete: Cascade)

  @@unique([contractId, number])
  @@index([contractId])
  @@index([status])
}

// ============================================================================
// SITUATIONS DE TRAVAUX
// ============================================================================

enum ProgressReportStatus {
  DRAFT                     // Brouillon
  SUBMITTED                 // Soumise par entreprise
  TECHNICAL_REVIEW          // Revue technique (architecte)
  TECHNICAL_APPROVED        // Approuvée techniquement
  TECHNICAL_REJECTED        // Rejetée techniquement
  FINANCIAL_REVIEW          // Revue financière (promoteur)
  FINANCIAL_APPROVED        // Approuvée financièrement
  FINANCIAL_REJECTED        // Rejetée financièrement
  INVOICED                  // Facturée
}

model ProgressReport {
  id                  String                @id @default(uuid())
  contractId          String

  // Identification
  number              String                // Numéro situation (ex: "SIT-001")
  periodStart         DateTime
  periodEnd           DateTime

  status              ProgressReportStatus  @default(DRAFT)

  // Avancement
  progressPercentage  Decimal               @db.Decimal(5, 2)  // % avancement global
  amountClaimed       Decimal               @db.Decimal(12, 2) // Montant revendiqué HT
  amountApproved      Decimal?              @db.Decimal(12, 2) // Montant approuvé HT

  // Description travaux
  description         String

  // Documents
  attachments         Json?                 // Array document IDs

  // Workflow validation
  submittedBy         String?               // Company user
  submittedAt         DateTime?

  technicalReviewedBy String?               // Architecte
  technicalReviewedAt DateTime?
  technicalNotes      String?

  financialReviewedBy String?               // Promoteur
  financialReviewedAt DateTime?
  financialNotes      String?

  // Facturation
  invoiceId           String?               // Facture générée

  createdAt           DateTime              @default(now())
  updatedAt           DateTime              @updatedAt

  // Relations
  contract            Contract              @relation(fields: [contractId], references: [id], onDelete: Cascade)
  invoice             ContractInvoice?      @relation(fields: [invoiceId], references: [id])
  lineItems           ProgressReportLineItem[]

  @@unique([contractId, number])
  @@index([contractId])
  @@index([status])
}

model ProgressReportLineItem {
  id                String          @id @default(uuid())
  progressReportId  String

  // Poste
  code              String?         // Code CFC ou bordereau
  description       String
  unit              String?         // m², m³, unité, forfait

  // Quantités
  quantityTotal     Decimal?        @db.Decimal(10, 2)  // Quantité totale du marché
  quantityPrevious  Decimal         @db.Decimal(10, 2)  @default(0)  // Cumul situations précédentes
  quantityCurrent   Decimal         @db.Decimal(10, 2)  // Cette situation

  // Montants
  unitPrice         Decimal         @db.Decimal(12, 2)
  amountClaimed     Decimal         @db.Decimal(12, 2)  // quantityCurrent × unitPrice
  amountApproved    Decimal?        @db.Decimal(12, 2)  // Montant validé

  notes             String?

  // Relations
  progressReport    ProgressReport  @relation(fields: [progressReportId], references: [id], onDelete: Cascade)

  @@index([progressReportId])
}

// ============================================================================
// FACTURATION CONTRATS
// ============================================================================

enum ContractInvoiceStatus {
  DRAFT                     // Brouillon
  RECEIVED                  // Reçue (de l'entreprise)
  TECHNICAL_REVIEW          // Revue technique
  TECHNICAL_APPROVED        // Visa technique OK
  TECHNICAL_REJECTED        // Visa technique KO
  FINANCIAL_REVIEW          // Revue financière
  APPROVED_FOR_PAYMENT      // Validée pour paiement
  REJECTED                  // Rejetée
  PAID                      // Payée
  PARTIALLY_PAID            // Partiellement payée
}

model ContractInvoice {
  id                  String                  @id @default(uuid())
  contractId          String
  progressReportId    String?                 // Si basée sur une situation

  // Identification
  invoiceNumber       String                  // Numéro facture entreprise
  invoiceDate         DateTime
  dueDate             DateTime

  status              ContractInvoiceStatus   @default(RECEIVED)

  // Montants
  amountHT            Decimal                 @db.Decimal(12, 2)
  vatRate             Decimal                 @db.Decimal(5, 2)
  vatAmount           Decimal                 @db.Decimal(12, 2)
  amountTTC           Decimal                 @db.Decimal(12, 2)

  // Retenue de garantie
  retentionAmount     Decimal?                @db.Decimal(12, 2)
  amountToPay         Decimal                 @db.Decimal(12, 2)  // TTC - retenue

  amountPaid          Decimal                 @db.Decimal(12, 2)  @default(0)

  // Documents
  documentId          String?                 // PDF facture

  // Workflow validation
  technicalReviewedBy String?
  technicalReviewedAt DateTime?
  technicalNotes      String?

  financialReviewedBy String?
  financialReviewedAt DateTime?
  financialNotes      String?

  approvedBy          String?
  approvedAt          DateTime?

  // Paiement
  paidAt              DateTime?

  notes               String?
  createdAt           DateTime                @default(now())
  updatedAt           DateTime                @updatedAt

  // Relations
  contract            Contract                @relation(fields: [contractId], references: [id], onDelete: Cascade)
  progressReport      ProgressReport?         @relation(fields: [progressReportId], references: [id])
  payments            ContractPayment[]
  progressReports     ProgressReport[]

  @@unique([contractId, invoiceNumber])
  @@index([contractId])
  @@index([progressReportId])
  @@index([status])
}

// ============================================================================
// PAIEMENTS CONTRATS
// ============================================================================

model ContractPayment {
  id              String          @id @default(uuid())
  contractId      String
  invoiceId       String

  // Montant
  amount          Decimal         @db.Decimal(12, 2)

  // Date & modalité
  paymentDate     DateTime
  paymentMethod   String?         // BANK_TRANSFER, CHECK, OTHER
  reference       String?         // Référence virement, n° chèque

  // Documents
  proofDocumentId String?         // Justificatif de paiement

  notes           String?
  createdBy       String
  createdAt       DateTime        @default(now())

  // Relations
  contract        Contract        @relation(fields: [contractId], references: [id], onDelete: Cascade)
  invoice         ContractInvoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([contractId])
  @@index([invoiceId])
}

// ============================================================================
// RETENUES DE GARANTIE
// ============================================================================

model RetentionRelease {
  id              String    @id @default(uuid())
  contractId      String

  // Montant
  amountRetained  Decimal   @db.Decimal(12, 2)  // Montant total retenu
  amountReleased  Decimal   @db.Decimal(12, 2)  @default(0)  // Montant libéré

  // Dates
  retentionDate   DateTime  // Date début période garantie
  releaseDate     DateTime  // Date fin garantie prévue
  actualReleaseDate DateTime?  // Date libération effective

  // Statut
  status          String    @default("RETAINED")  // RETAINED, PARTIALLY_RELEASED, RELEASED

  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([contractId])
  @@index([releaseDate])
}
```

---

## 3. Workflow complet

### 3.1 Vue d'ensemble du workflow

```
┌─────────────────┐
│  1. CONTRAT     │
│  (Adjudication) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐         ┌──────────────┐
│  2. EXÉCUTION   │ ───────▶│ 2b. AVENANT  │
│  (Travaux)      │         │  (si besoin) │
└────────┬────────┘         └──────────────┘
         │
         ▼
┌─────────────────┐
│  3. SITUATION   │
│  (Avancement)   │
└────────┬────────┘
         │ Soumission EG
         ▼
┌─────────────────┐
│  4. VALIDATION  │
│  TECHNIQUE      │ ← Architecte
└────────┬────────┘
         │ Approuvé
         ▼
┌─────────────────┐
│  5. VALIDATION  │
│  FINANCIÈRE     │ ← Promoteur
└────────┬────────┘
         │ Approuvé
         ▼
┌─────────────────┐
│  6. FACTURE     │
│  (Génération)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  7. PAIEMENT    │
│  (Virement)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  8. MAJ CFC     │
│  (Payé)         │
└─────────────────┘
```

### 3.2 Étapes détaillées

#### Étape 1 : Création contrat (post-adjudication)

**Déclencheur** : Adjudication soumission

**Actions** :
```typescript
POST /projects/:projectId/contracts
{
  companyId: string
  submissionId?: string  // Si depuis adjudication
  number: string  // Auto-généré
  name: string
  type: ContractType
  amountInitial: number
  vatRate: number
  paymentTermType: PaymentTermType
  paymentTerms: {
    milestones?: [
      { name: string, percentage: number, dueDate: DateTime }
    ]
  }
  retentionRate?: number
  cfcLineIds: string[]
  signedAt?: DateTime
  startDate: DateTime
  plannedEndDate: DateTime
}
```

**Effets automatiques** :
- `amountRevised = amountInitial`
- Mise à jour CFC : `amountCommitted += amountInitial`
- Notification entreprise

---

#### Étape 2 : Création avenant (si modification)

**Déclencheurs** :
- Modification acquéreur (surcoût)
- Changement périmètre projet
- Imprévu chantier

**Actions** :
```typescript
POST /contracts/:contractId/amendments
{
  title: string
  type: AmendmentType
  amountChange: number  // + ou -
  justification: string
  cfcLineIds?: string[]
  delayDays?: number
  originType?: string
  originId?: string
}
```

**Workflow validation** :
1. Création (`status = DRAFT`)
2. Soumission validation (`status = PENDING_APPROVAL`)
3. Promoteur approuve (`status = APPROVED`)
4. Signature (`status = SIGNED`)

**Effets approbation** :
```typescript
// Mise à jour contrat
contract.amountRevised += amendment.amountChange

// Mise à jour CFC
cfcLine.amountCommitted += amendment.amountChange
```

---

#### Étape 3 : Situation de travaux (soumission EG)

**Acteur** : EG / Sous-traitant

**Actions** :
```typescript
POST /contracts/:contractId/progress-reports
{
  periodStart: DateTime
  periodEnd: DateTime
  description: string
  progressPercentage: number
  lineItems: [
    {
      description: string
      unit: string
      quantityTotal: number
      quantityPrevious: number
      quantityCurrent: number
      unitPrice: number
      amountClaimed: number
    }
  ]
  attachments: string[]  // Document IDs (photos, PV)
}
```

**Calcul automatique** :
```typescript
amountClaimed = sum(lineItems.map(item => item.amountClaimed))
```

**Résultat** : ProgressReport `status = SUBMITTED`

---

#### Étape 4 : Validation technique (Architecte)

**Acteur** : Architecte

**Actions** :
```typescript
PATCH /progress-reports/:id/technical-review
{
  status: 'TECHNICAL_APPROVED' | 'TECHNICAL_REJECTED'
  amountApproved?: number  // Peut ajuster montant
  technicalNotes?: string
}
```

**Règles** :
- `amountApproved ≤ amountClaimed`
- Si rejeté : retour à l'EG pour corrections

**Résultat** : `status = TECHNICAL_APPROVED`

---

#### Étape 5 : Validation financière (Promoteur)

**Acteur** : Promoteur / Service financier

**Actions** :
```typescript
PATCH /progress-reports/:id/financial-review
{
  status: 'FINANCIAL_APPROVED' | 'FINANCIAL_REJECTED'
  financialNotes?: string
}
```

**Si approuvé** → Génération automatique facture

---

#### Étape 6 : Génération facture

**Automatique** après validation financière

**Actions** :
```typescript
POST /contracts/:contractId/invoices
{
  progressReportId: string
  invoiceNumber: string  // Fourni par entreprise
  invoiceDate: DateTime
  dueDate: DateTime
  amountHT: progressReport.amountApproved
  vatRate: contract.vatRate
  vatAmount: calculated
  amountTTC: calculated
  retentionAmount: calculated  // contract.retentionRate × amountHT
  amountToPay: amountTTC - retentionAmount
  status: 'APPROVED_FOR_PAYMENT'
}
```

**Mise à jour contrat** :
```typescript
contract.amountInvoiced += invoice.amountHT
```

**Mise à jour CFC** :
```typescript
cfcLine.amountSpent += invoice.amountHT
```

---

#### Étape 7 : Paiement

**Acteur** : Service financier

**Actions** :
```typescript
POST /contract-invoices/:invoiceId/payments
{
  amount: number
  paymentDate: DateTime
  paymentMethod: string
  reference: string
  proofDocumentId?: string
}
```

**Mise à jour invoice** :
```typescript
invoice.amountPaid += payment.amount

if (invoice.amountPaid >= invoice.amountToPay) {
  invoice.status = 'PAID'
  invoice.paidAt = payment.paymentDate
}
```

**Mise à jour contrat** :
```typescript
contract.amountPaid += payment.amount
```

**Mise à jour CFC** :
```typescript
cfcLine.amountPaid += payment.amount
```

---

## 4. Situations de travaux

### 4.1 Saisie par ligne (bordereau)

**Interface EG** :
```tsx
<ProgressReportForm>
  <FormSection title="Période">
    <DateRangePicker
      start={periodStart}
      end={periodEnd}
    />
  </FormSection>

  <FormSection title="Postes de travaux">
    <Table>
      <thead>
        <tr>
          <th>Poste</th>
          <th>Unité</th>
          <th>Quantité totale</th>
          <th>Cumul précédent</th>
          <th>Cette situation</th>
          <th>Prix unitaire</th>
          <th>Montant</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map(item => (
          <tr key={item.id}>
            <td><Input value={item.description} /></td>
            <td><Input value={item.unit} /></td>
            <td><Input type="number" value={item.quantityTotal} /></td>
            <td>{item.quantityPrevious}</td>
            <td><Input type="number" value={item.quantityCurrent} /></td>
            <td>{formatCurrency(item.unitPrice)}</td>
            <td>{formatCurrency(item.amountClaimed)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={6}>Total HT</td>
          <td>{formatCurrency(totalAmountClaimed)}</td>
        </tr>
      </tfoot>
    </Table>
  </FormSection>

  <FormSection title="Avancement global">
    <ProgressSlider
      value={progressPercentage}
      onChange={setProgressPercentage}
    />
  </FormSection>

  <FormSection title="Documents justificatifs">
    <FileUploader
      multiple
      accept="image/*,.pdf"
      onUpload={handleUpload}
    />
  </FormSection>

  <Button type="submit">Soumettre situation</Button>
</ProgressReportForm>
```

### 4.2 Validation par architecte

**Interface Architecte** :
```tsx
<ProgressReportReview report={progressReport}>
  <Section title="Travaux déclarés">
    <LineItemsTable
      items={progressReport.lineItems}
      editable={true}
      onAdjust={handleAdjustAmount}
    />
  </Section>

  <Section title="Documents joints">
    <DocumentsGallery documents={progressReport.attachments} />
  </Section>

  <Section title="Avis technique">
    <Textarea
      label="Notes / Observations"
      value={technicalNotes}
      onChange={setTechnicalNotes}
    />
  </Section>

  <Actions>
    <Button
      variant="danger"
      onClick={() => reject(technicalNotes)}
    >
      Rejeter
    </Button>
    <Button
      variant="success"
      onClick={() => approve(technicalNotes, adjustedAmount)}
    >
      Approuver (visa technique)
    </Button>
  </Actions>
</ProgressReportReview>
```

---

## 5. Avenants

### 5.1 Création avenant

**Cas d'usage** :
1. **Modification acquéreur** : Surcoût travaux
2. **Changement projet** : Modification périmètre
3. **Imprévu** : Découverte chantier

**Workflow** :
```typescript
// 1. Création
const amendment = await prisma.contractAmendment.create({
  data: {
    contractId,
    number: generateAmendmentNumber(contract),  // AV-001
    title: "Modification lot A-3-01 - Déplacement cloison",
    type: 'SCOPE_CHANGE',
    amountChange: 5000,
    justification: "Demande acheteur validée",
    originType: 'BUYER_MODIFICATION',
    originId: buyerChangeRequestId,
    cfcLineIds: ['cfc-1234'],
    status: 'DRAFT',
    proposedBy: userId
  }
})

// 2. Soumission validation
await prisma.contractAmendment.update({
  where: { id: amendment.id },
  data: {
    status: 'PENDING_APPROVAL',
    proposedAt: new Date()
  }
})

// Notification promoteur
await notificationService.notifyPromoter({
  type: 'AMENDMENT_PENDING',
  contractId,
  amendmentId: amendment.id
})

// 3. Approbation promoteur
await prisma.contractAmendment.update({
  where: { id: amendment.id },
  data: {
    status: 'APPROVED',
    approvedBy: promoterUserId,
    approvedAt: new Date()
  }
})

// Mise à jour contrat
await prisma.contract.update({
  where: { id: contractId },
  data: {
    amountRevised: {
      increment: amendment.amountChange
    }
  }
})

// Mise à jour CFC
await prisma.cfcLine.update({
  where: { id: cfcLineId },
  data: {
    amountCommitted: {
      increment: amendment.amountChange
    }
  }
})

// 4. Signature
await prisma.contractAmendment.update({
  where: { id: amendment.id },
  data: {
    status: 'SIGNED',
    signedAt: new Date(),
    documentId: signedDocumentId
  }
})
```

### 5.2 Impact sur finances

**Modification acquéreur** :
- Avenant contrat EG : +5000 CHF
- Facture client : +5000 CHF (+ TVA si QPT)
- Mise à jour CFC : +5000 CHF engagement

**Liens automatiques** :
```typescript
// Lien avenant → modification acquéreur
amendment.originType = 'BUYER_MODIFICATION'
amendment.originId = buyerChangeRequest.id

// Lien avenant → facture client
buyerInvoice.contractAmendmentId = amendment.id
```

---

## 6. Facturation & Paiements

### 6.1 Workflow facturation

```
┌─────────────────┐
│ SITUATION       │
│ VALIDÉE         │
└────────┬────────┘
         │ Auto
         ▼
┌─────────────────┐
│ FACTURE         │
│ GÉNÉRÉE         │
│ (APPROVED_FOR_  │
│  PAYMENT)       │
└────────┬────────┘
         │ Service financier
         ▼
┌─────────────────┐
│ PAIEMENT        │
│ EFFECTUÉ        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ FACTURE         │
│ (PAID)          │
└─────────────────┘
```

### 6.2 Retenues de garantie

**Calcul** :
```typescript
const retentionRate = 0.10  // 10%
const retentionAmount = invoice.amountHT * retentionRate
const amountToPay = invoice.amountTTC - retentionAmount

invoice.retentionAmount = retentionAmount
invoice.amountToPay = amountToPay
```

**Libération garantie** :
```typescript
// À la fin de période garantie
const retentionRelease = await prisma.retentionRelease.create({
  data: {
    contractId,
    amountRetained: totalRetained,
    retentionDate: contract.actualEndDate,
    releaseDate: addMonths(contract.actualEndDate, contract.warrantyPeriod),
    status: 'RETAINED'
  }
})

// Cron job vérifie les dates libération
@Cron('0 0 * * *')
async checkRetentionReleases() {
  const dueReleases = await prisma.retentionRelease.findMany({
    where: {
      status: 'RETAINED',
      releaseDate: { lte: new Date() }
    }
  })

  for (const release of dueReleases) {
    // Générer facture libération garantie
    await this.generateRetentionReleaseInvoice(release)
  }
}
```

---

## 7. Validations & Droits

### 7.1 Matrice des droits

| Action | EG/Sous-traitant | Architecte | Promoteur |
|--------|------------------|------------|-----------|
| **Créer situation** | ✅ | ❌ | ❌ |
| **Modifier situation (DRAFT)** | ✅ | ❌ | ❌ |
| **Soumettre situation** | ✅ | ❌ | ❌ |
| **Validation technique** | ❌ | ✅ | ✅ |
| **Validation financière** | ❌ | ❌ | ✅ |
| **Créer avenant** | ❌ | ❌ | ✅ |
| **Approuver avenant** | ❌ | ❌ | ✅ |
| **Saisir paiement** | ❌ | ❌ | ✅ |
| **Voir factures** | ✅ (siennes) | ✅ (toutes) | ✅ (toutes) |

### 7.2 Guards NestJS

```typescript
// Guard validation technique
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('ARCHITECT', 'PROMOTER')
@Patch('progress-reports/:id/technical-review')
async technicalReview(...) {}

// Guard validation financière
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('PROMOTER', 'FINANCIAL_MANAGER')
@Patch('progress-reports/:id/financial-review')
async financialReview(...) {}

// Guard entreprise (own data only)
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
@Get('progress-reports/:id')
async getProgressReport(...) {}
```

---

## 8. Intégration CFC

### 8.1 Mise à jour automatique

**Événements déclencheurs** :

1. **Création contrat** (après adjudication)
   ```typescript
   cfcLine.amountCommitted += contract.amountInitial
   ```

2. **Approbation avenant**
   ```typescript
   cfcLine.amountCommitted += amendment.amountChange
   ```

3. **Validation financière situation → Facture générée**
   ```typescript
   cfcLine.amountSpent += invoice.amountHT
   ```

4. **Paiement facture**
   ```typescript
   cfcLine.amountPaid += payment.amount
   ```

### 8.2 Dashboard CFC enrichi

**Vue par ligne CFC** :
```tsx
<CfcDashboard cfcLine={cfcLine}>
  <KpiGrid>
    <KpiCard
      label="Budget"
      value={formatCurrency(cfcLine.amountBudgeted)}
    />
    <KpiCard
      label="Engagé"
      value={formatCurrency(cfcLine.amountCommitted)}
      percentage={(cfcLine.amountCommitted / cfcLine.amountBudgeted) * 100}
    />
    <KpiCard
      label="Facturé"
      value={formatCurrency(cfcLine.amountSpent)}
      percentage={(cfcLine.amountSpent / cfcLine.amountBudgeted) * 100}
    />
    <KpiCard
      label="Payé"
      value={formatCurrency(cfcLine.amountPaid)}
      percentage={(cfcLine.amountPaid / cfcLine.amountBudgeted) * 100}
    />
  </KpiGrid>

  <Section title="Contrats">
    <ContractsTable
      contracts={cfcLine.contracts}
      showAmounts={true}
    />
  </Section>

  <Section title="Avenants">
    <AmendmentsTable amendments={allAmendments} />
  </Section>

  <Section title="Factures">
    <InvoicesTable
      invoices={cfcLine.invoices}
      showPaymentStatus={true}
    />
  </Section>
</CfcDashboard>
```

---

## 9. Vues 360°

### 9.1 Vue 360° Contrat

**URL** : `/contracts/:id`

**Sections** :
```tsx
<ContractDetailsPage contract={contract}>
  {/* Header */}
  <PageHeader
    title={contract.name}
    subtitle={`${contract.company.name} • ${contract.project.name}`}
    badge={<StatusBadge status={contract.status} />}
  />

  {/* KPIs */}
  <KpiGrid>
    <KpiCard label="Montant initial" value={formatCurrency(contract.amountInitial)} />
    <KpiCard label="Montant révisé" value={formatCurrency(contract.amountRevised)} />
    <KpiCard label="Facturé" value={formatCurrency(contract.amountInvoiced)} />
    <KpiCard label="Payé" value={formatCurrency(contract.amountPaid)} />
  </KpiGrid>

  {/* Tabs */}
  <Tabs>
    <Tab label="Vue d'ensemble">
      <ContractOverview contract={contract} />
    </Tab>

    <Tab label={`Avenants (${contract.amendments.length})`}>
      <AmendmentsTable amendments={contract.amendments} />
    </Tab>

    <Tab label={`Situations (${contract.progressReports.length})`}>
      <ProgressReportsTable reports={contract.progressReports} />
    </Tab>

    <Tab label={`Factures (${contract.invoices.length})`}>
      <InvoicesTable invoices={contract.invoices} />
    </Tab>

    <Tab label={`Paiements (${contract.payments.length})`}>
      <PaymentsTable payments={contract.payments} />
    </Tab>

    <Tab label="Documents">
      <ContractDocuments contractId={contract.id} />
    </Tab>
  </Tabs>
</ContractDetailsPage>
```

### 9.2 Vue 360° Entreprise

**URL** : `/companies/:id`

**Agrégation de toutes les activités de l'entreprise** :
```tsx
<CompanyDetailsPage company={company}>
  <PageHeader
    title={company.name}
    subtitle={company.type}
  />

  {/* Stats globales */}
  <StatsGrid>
    <StatCard label="Projets" value={company.projects.length} />
    <StatCard label="Contrats actifs" value={activeContracts.length} />
    <StatCard label="Montant contractuel total" value={formatCurrency(totalContractAmount)} />
    <StatCard label="Factures en attente" value={pendingInvoices.length} />
  </StatsGrid>

  {/* Tabs */}
  <Tabs>
    <Tab label="Projets">
      <ProjectsList projects={company.projects} />
    </Tab>

    <Tab label="Contrats">
      <ContractsTable contracts={company.contracts} />
    </Tab>

    <Tab label="Soumissions">
      <SubmissionsTable submissions={company.submissions} />
    </Tab>

    <Tab label="Factures">
      <InvoicesTable invoices={company.invoices} />
    </Tab>

    <Tab label="Historique paiements">
      <PaymentsTimeline payments={company.payments} />
    </Tab>

    <Tab label="Contacts">
      <ContactsList contacts={company.contacts} />
    </Tab>
  </Tabs>
</CompanyDetailsPage>
```

---

## 🎯 Résumé

### Points clés du module Finance Contrats

✅ **Gestion complète** : Contrats → Avenants → Situations → Factures → Paiements

✅ **Workflow validation** : Technique (Architecte) → Financière (Promoteur)

✅ **Intégration CFC** : Mise à jour automatique Budget/Engagé/Facturé/Payé

✅ **Retenues garantie** : Calcul automatique, libération planifiée

✅ **Vues 360°** : Par contrat, par entreprise, par projet

✅ **Traçabilité** : Audit trail complet de toutes les validations

### Entités créées

- `Contract` (40+ champs)
- `ContractAmendment` (avenants)
- `ProgressReport` (situations travaux)
- `ProgressReportLineItem` (détail bordereau)
- `ContractInvoice` (facturation)
- `ContractPayment` (paiements)
- `RetentionRelease` (libération garanties)

**Ce module positionne le développeur immobilier comme chef d'orchestre de tous les flux financiers du projet.**

---

**Ce document complète NESTJS_ARCHITECTURE.md avec le module Finance Contrats EG/sous-traitants ultra-détaillé.**
