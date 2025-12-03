# 📜 RÈGLES MÉTIER & VALIDATIONS - SaaS Immobilier Suisse

> Règles métier complètes, validations, contraintes et invariants du système

---

## Table des matières

1. [Règles globales](#1-règles-globales)
2. [Règles par module](#2-règles-par-module)
3. [Validations formulaires](#3-validations-formulaires)
4. [Contraintes d'intégrité](#4-contraintes-dintégrité)
5. [Règles de calcul](#5-règles-de-calcul)
6. [Règles de sécurité](#6-règles-de-sécurité)

---

## 1. Règles globales

### R-GLOBAL-001 : Multi-tenant strict
**Règle** : Aucune donnée ne doit être accessible entre organisations différentes.

**Implémentation** :
- Middleware TenantInterceptor sur toutes les requêtes
- Auto-injection `organisationId` dans les queries Prisma
- Test automatique d'isolation dans les tests d'intégration

**Validations** :
```typescript
// Guard automatique
if (user.organisationId !== resource.organisationId) {
  throw new ForbiddenException('Accès refusé')
}
```

---

### R-GLOBAL-002 : Soft delete
**Règle** : Les suppressions doivent être logiques (soft delete) pour les entités critiques.

**Entités concernées** :
- Project, Lot, Buyer, Invoice, Contract, Document

**Implémentation** :
```prisma
model Project {
  deletedAt DateTime?
}
```

```typescript
// Au lieu de delete
await prisma.project.update({
  where: { id },
  data: { deletedAt: new Date() }
})

// Filtrer automatiquement
where: { deletedAt: null }
```

---

### R-GLOBAL-003 : Audit trail
**Règle** : Toutes les actions critiques doivent être tracées dans AuditLog.

**Actions tracées** :
- CREATE, UPDATE, DELETE sur : Project, Lot, Buyer, Invoice, Contract
- Changements de statut
- Adjudications
- Signatures actes

**Implémentation** :
```typescript
await prisma.auditLog.create({
  data: {
    userId: user.id,
    organisationId: user.organisationId,
    action: 'UPDATE',
    resourceType: 'Lot',
    resourceId: lot.id,
    changes: {
      before: { status: 'AVAILABLE' },
      after: { status: 'RESERVED' }
    },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  }
})
```

---

## 2. Règles par module

### 2.1 PROJETS

#### R-PROJ-001 : Code unique
**Règle** : Le code projet doit être unique par organisation.

**Validation** :
```typescript
@IsUnique(['code', 'organisationId'])
code: string
```

#### R-PROJ-002 : Structure minimale
**Règle** : Un projet doit avoir au moins 1 bâtiment.

**Validation** :
```typescript
if (project.buildings.length === 0) {
  throw new BadRequestException('Un projet doit avoir au moins 1 bâtiment')
}
```

#### R-PROJ-003 : Suppression protégée
**Règle** : Impossible de supprimer un projet avec :
- Lots vendus (status = SOLD)
- Factures payées
- Contrats actifs

**Validation** :
```typescript
const soldLotsCount = await prisma.lot.count({
  where: {
    projectId: id,
    status: 'SOLD'
  }
})

if (soldLotsCount > 0) {
  throw new BadRequestException(
    `Impossible de supprimer le projet : ${soldLotsCount} lot(s) vendu(s)`
  )
}
```

#### R-PROJ-004 : Workflow statuts
**Règle** : Les changements de statut doivent respecter :
```
PLANNING → CONSTRUCTION → SELLING → COMPLETED → ARCHIVED
```

**Validation** :
```typescript
const allowedTransitions = {
  PLANNING: ['CONSTRUCTION', 'ARCHIVED'],
  CONSTRUCTION: ['SELLING', 'ARCHIVED'],
  SELLING: ['COMPLETED', 'ARCHIVED'],
  COMPLETED: ['ARCHIVED']
}

if (!allowedTransitions[currentStatus].includes(newStatus)) {
  throw new BadRequestException('Transition de statut invalide')
}
```

---

### 2.2 LOTS

#### R-LOT-001 : Code unique
**Règle** : Code lot unique par projet.

**Format** : `[Bâtiment]-[Étage]-[Numéro]`
Exemple : `A-3-01`

#### R-LOT-002 : Workflow statuts
**Règle** : Transitions valides :
```
AVAILABLE ←→ RESERVED
AVAILABLE → OPTION → SOLD
RESERVED → SOLD
SOLD → DELIVERED
```

**Validations** :
```typescript
const validTransitions = {
  AVAILABLE: ['RESERVED', 'OPTION', 'SOLD'],
  RESERVED: ['AVAILABLE', 'SOLD'],
  OPTION: ['AVAILABLE', 'SOLD'],
  SOLD: ['DELIVERED']
}
```

#### R-LOT-003 : Lot vendu requiert acheteur
**Règle** : Statut `SOLD` nécessite un buyer associé.

**Validation** :
```typescript
if (status === 'SOLD' && !buyerId) {
  throw new BadRequestException('Un lot vendu doit avoir un acheteur')
}
```

#### R-LOT-004 : Calcul prix
**Règle** :
- `priceTotal = priceBase + priceExtras`
- Si QPT : `priceTotal = priceBase × (1 + vatRate)`

**Validation** :
```typescript
if (saleType === 'QPT') {
  const calculatedTotal = priceBase * (1 + vatRate)
  if (Math.abs(priceTotal - calculatedTotal) > 0.01) {
    throw new BadRequestException('Prix total incohérent')
  }
}
```

#### R-LOT-005 : Surface totale
**Règle** : `surfaceTotal = surfaceLiving + surfaceTerrace + surfaceBalcony + surfaceGarden`

**Validation** :
```typescript
const calculated =
  surfaceLiving +
  (surfaceTerrace || 0) +
  (surfaceBalcony || 0) +
  (surfaceGarden || 0)

if (Math.abs(surfaceTotal - calculated) > 0.1) {
  throw new BadRequestException('Surface totale incohérente')
}
```

#### R-LOT-006 : Unicité réservation
**Règle** : Un lot ne peut avoir qu'une seule réservation active.

**Validation** :
```typescript
const activeReservations = await prisma.reservation.count({
  where: {
    lotId,
    status: { in: ['PENDING', 'CONFIRMED'] }
  }
})

if (activeReservations > 0) {
  throw new BadRequestException('Lot déjà réservé')
}
```

---

### 2.3 CRM

#### R-CRM-001 : Email unique prospect
**Règle** : Email unique par projet (pas de doublons).

**Validation** :
```typescript
@IsUnique(['email', 'projectId'])
email: string
```

#### R-CRM-002 : Expiration réservation
**Règle** : Réservation expire automatiquement si non confirmée sous X jours (défaut : 30).

**Implémentation** : Cron job quotidien
```typescript
@Cron('0 0 * * *') // Tous les jours à minuit
async expireReservations() {
  await prisma.reservation.updateMany({
    where: {
      status: 'PENDING',
      expiresAt: { lt: new Date() }
    },
    data: { status: 'EXPIRED' }
  })
}
```

#### R-CRM-003 : Conversion réservation
**Règle** : Conversion possible seulement si réservation `CONFIRMED`.

**Validation** :
```typescript
if (reservation.status !== 'CONFIRMED') {
  throw new BadRequestException(
    'Seules les réservations confirmées peuvent être converties'
  )
}
```

#### R-CRM-004 : Dossier complet
**Règle** : Dossier acheteur "complet" si tous documents requis validés.

**Calcul** :
```typescript
const requirements = await prisma.buyerDocumentRequirement.findMany({
  where: { buyerFileId }
})

const validatedCount = requirements.filter(
  r => r.isRequired && r.status === 'VALIDATED'
).length

const requiredCount = requirements.filter(r => r.isRequired).length

const isComplete = validatedCount === requiredCount
const completionPercentage = (validatedCount / requiredCount) * 100
```

#### R-CRM-005 : Notification notaire
**Règle** : Dès que `isComplete = true`, notifier le notaire automatiquement.

**Implémentation** :
```typescript
if (isComplete && !previouslyComplete) {
  await notificationService.notifyNotary({
    buyerId,
    type: 'BUYER_FILE_COMPLETE'
  })
}
```

---

### 2.4 NOTAIRES

#### R-NOT-001 : Dossier complet requis
**Règle** : NotaryFile ne peut être créé que si `BuyerFile.isComplete = true`.

**Validation** :
```typescript
const buyerFile = await prisma.buyerFile.findUnique({
  where: { buyerId }
})

if (!buyerFile.isComplete) {
  throw new BadRequestException('Dossier acheteur incomplet')
}
```

#### R-NOT-002 : Versioning actes
**Règle** : Version incrémentée automatiquement.

**Implémentation** :
```typescript
const lastVersion = await prisma.notaryActVersion.findFirst({
  where: { notaryFileId },
  orderBy: { version: 'desc' }
})

const newVersion = (lastVersion?.version || 0) + 1
```

#### R-NOT-003 : Acte final requis pour RDV
**Règle** : Impossible de créer rendez-vous signature si pas d'acte final.

**Validation** :
```typescript
const finalAct = await prisma.notaryActVersion.findFirst({
  where: {
    notaryFileId,
    isFinal: true
  }
})

if (!finalAct) {
  throw new BadRequestException('Acte final requis pour planifier RDV')
}
```

#### R-NOT-004 : Signature unique
**Règle** : Un NotaryFile ne peut être signé qu'une seule fois.

**Validation** :
```typescript
if (notaryFile.status === 'SIGNED') {
  throw new BadRequestException('Acte déjà signé')
}
```

---

### 2.5 SOUMISSIONS

#### R-SUBM-001 : Dates cohérentes
**Règle** : `questionsDeadline < closingDate`

**Validation** :
```typescript
if (questionsDeadline >= closingDate) {
  throw new BadRequestException(
    'Date limite questions doit être avant date clôture'
  )
}
```

#### R-SUBM-002 : Clôture automatique
**Règle** : À `closingDate`, statut passe à `CLOSED` automatiquement.

**Implémentation** : Cron job
```typescript
@Cron('0 * * * *') // Toutes les heures
async closeSubmissions() {
  await prisma.submission.updateMany({
    where: {
      status: 'OPEN',
      closingDate: { lte: new Date() }
    },
    data: { status: 'CLOSED' }
  })
}
```

#### R-SUBM-003 : Offre modifiable avant clôture
**Règle** : Entreprise peut réviser offre jusqu'à `closingDate`.

**Validation** :
```typescript
if (submission.status === 'CLOSED') {
  throw new BadRequestException('Soumission clôturée, offre non modifiable')
}
```

#### R-SUBM-004 : Adjudication unique
**Règle** : Une soumission ne peut avoir qu'une seule adjudication.

**Validation** :
```typescript
const existingAdjudication = await prisma.adjudication.findUnique({
  where: { submissionId }
})

if (existingAdjudication) {
  throw new BadRequestException('Soumission déjà adjugée')
}
```

#### R-SUBM-005 : Mise à jour CFC automatique
**Règle** : Adjudication ajoute montant dans `CfcLine.amountCommitted`.

**Implémentation** :
```typescript
await prisma.cfcLine.update({
  where: { id: submission.cfcLineId },
  data: {
    amountCommitted: {
      increment: adjudicatedOffer.totalAmount
    }
  }
})
```

---

### 2.6 FINANCE

#### R-FIN-001 : Hiérarchie CFC
**Règle** : Budget CFC structuré en arbre (parent/enfants).

**Validation** :
```typescript
// Pas de cycle
const ancestors = await getAncestors(cfcLineId)
if (ancestors.includes(parentId)) {
  throw new BadRequestException('Cycle détecté dans hiérarchie CFC')
}
```

#### R-FIN-002 : Budget >= Engagement
**Règle** : `amountCommitted ≤ amountBudgeted`

**Validation** :
```typescript
if (amountCommitted > amountBudgeted) {
  throw new BadRequestException('Engagement dépasse le budget')
}
```

#### R-FIN-003 : Facturé <= Engagement
**Règle** : `amountSpent ≤ amountCommitted`

**Validation** :
```typescript
if (amountSpent > amountCommitted) {
  throw new BadRequestException('Facturé dépasse engagement')
}
```

#### R-FIN-004 : Plan acomptes
**Règle** : Somme des % = 100%

**Validation** :
```typescript
const totalPercentage = installments.reduce(
  (sum, inst) => sum + inst.percentage,
  0
)

if (Math.abs(totalPercentage - 100) > 0.01) {
  throw new BadRequestException('Somme acomptes doit être 100%')
}
```

#### R-FIN-005 : Génération factures automatique
**Règle** : Facture générée automatiquement à échéance installment.

**Implémentation** : Cron job quotidien
```typescript
@Cron('0 6 * * *') // Tous les jours à 6h
async generateInstallmentInvoices() {
  const dueInstallments = await prisma.installment.findMany({
    where: {
      status: 'PENDING',
      dueDate: { lte: addDays(new Date(), 7) }, // J-7
      invoiceId: null
    }
  })

  for (const inst of dueInstallments) {
    await this.generateInvoice(inst)
  }
}
```

#### R-FIN-006 : Relances retards
**Règle** : Relances automatiques à J+7, J+14, J+30.

**Implémentation** :
```typescript
const overdueInstallments = await prisma.installment.findMany({
  where: {
    status: 'PENDING',
    dueDate: { lt: new Date() }
  }
})

for (const inst of overdueInstallments) {
  const daysOverdue = differenceInDays(new Date(), inst.dueDate)

  if ([7, 14, 30].includes(daysOverdue)) {
    await emailService.sendReminderEmail(inst.buyerId, daysOverdue)
  }
}
```

---

### 2.7 DOCUMENTS

#### R-DOC-001 : Arborescence projet
**Règle** : Création automatique de l'arborescence standard à la création projet.

**Implémentation** :
```typescript
const standardFolders = [
  '01 - Juridique',
  '02 - Plans',
  '03 - Contrats',
  '04 - Soumissions',
  '05 - Commercial',
  '06 - Dossiers acheteurs',
  '07 - Chantier',
  '08 - Divers'
]

for (const folderName of standardFolders) {
  await prisma.document.create({
    data: {
      projectId,
      name: folderName,
      isFolder: true
    }
  })
}
```

#### R-DOC-002 : Versioning
**Règle** : Nouveau document avec même nom dans même dossier → nouvelle version.

**Implémentation** :
```typescript
const existingDoc = await prisma.document.findFirst({
  where: {
    projectId,
    parentFolderId,
    name
  }
})

if (existingDoc) {
  // Créer version
  await prisma.documentVersion.create({
    data: {
      documentId: existingDoc.id,
      versionNumber: existingDoc.versionNumber + 1,
      fileUrl,
      createdBy: userId
    }
  })

  // Mettre à jour document
  await prisma.document.update({
    where: { id: existingDoc.id },
    data: { versionNumber: { increment: 1 } }
  })
} else {
  // Créer nouveau
  await prisma.document.create({...})
}
```

#### R-DOC-003 : Taille fichier limitée
**Règle** : Max 100 MB par fichier.

**Validation** :
```typescript
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

if (file.size > MAX_FILE_SIZE) {
  throw new BadRequestException('Fichier trop volumineux (max 100 MB)')
}
```

---

### 2.8 CHOIX MATÉRIAUX

#### R-CHOICE-001 : Délai de choix
**Règle** : Acheteur a X jours pour faire ses choix (selon paramètres projet).

**Validation** :
```typescript
const deadlineDate = addDays(buyer.createdAt, project.settings.choicesDeadlineDays)

if (new Date() > deadlineDate) {
  throw new BadRequestException('Délai de choix dépassé')
}
```

#### R-CHOICE-002 : Option par catégorie
**Règle** : Une seule option sélectionnée par catégorie.

**Validation** :
```typescript
const existingChoice = await prisma.buyerChoice.findFirst({
  where: {
    buyerId,
    materialOption: {
      categoryId
    }
  }
})

if (existingChoice) {
  // Remplacer
  await prisma.buyerChoice.update({
    where: { id: existingChoice.id },
    data: { materialOptionId: newOptionId }
  })
} else {
  // Créer
  await prisma.buyerChoice.create({...})
}
```

#### R-CHOICE-003 : Calcul surcoûts
**Règle** : `totalExtras = sum(selectedOptions.filter(o => o.price > 0).map(o => o.price))`

**Implémentation** :
```typescript
const choices = await prisma.buyerChoice.findMany({
  where: { buyerId },
  include: { materialOption: true }
})

const totalExtras = choices.reduce(
  (sum, choice) => sum + choice.materialOption.price,
  0
)

await prisma.lot.update({
  where: { id: buyer.lotId },
  data: {
    priceExtras: totalExtras,
    priceTotal: { increment: totalExtras }
  }
})
```

#### R-CHOICE-004 : Validation EG
**Règle** : Choix ne sont finalisés qu'après validation EG.

**Validation** :
```typescript
if (buyerChoices.status !== 'VALIDATED') {
  throw new BadRequestException('Choix non validés par EG')
}
```

---

### 2.9 BILLING SAAS

#### R-BILL-001 : Un abonnement actif par organisation
**Règle** : Une organisation ne peut avoir qu'un seul abonnement `ACTIVE` ou `TRIAL`.

**Validation** :
```typescript
const activeSubscriptions = await prisma.subscription.count({
  where: {
    organisationId,
    status: { in: ['ACTIVE', 'TRIAL'] }
  }
})

if (activeSubscriptions > 0) {
  throw new BadRequestException('Abonnement actif existant')
}
```

#### R-BILL-002 : Trial automatique
**Règle** : Première souscription = 14 jours gratuits.

**Implémentation** :
```typescript
const isFirstSubscription = await prisma.subscription.count({
  where: { organisationId }
}) === 0

if (isFirstSubscription) {
  subscription.status = 'TRIAL'
  subscription.trialStart = new Date()
  subscription.trialEnd = addDays(new Date(), 14)
}
```

#### R-BILL-003 : Changement plan
**Règle** : Upgrade immédiat, downgrade à la fin de la période.

**Implémentation** :
```typescript
if (newPlan.price > currentPlan.price) {
  // Upgrade immédiat
  subscription.planId = newPlan.id
  subscription.status = 'ACTIVE'
  // Prorata à facturer
} else {
  // Downgrade à la fin
  subscription.cancelAtPeriodEnd = true
  subscription.nextPlanId = newPlan.id
}
```

#### R-BILL-004 : Webhook Datatrans
**Règle** : Vérifier signature HMAC avant traiter webhook.

**Validation** :
```typescript
const signature = req.headers['x-datatrans-signature']
const payload = req.body

const expectedSignature = createHmac('sha256', DATATRANS_SIGN_KEY)
  .update(JSON.stringify(payload))
  .digest('hex')

if (signature !== expectedSignature) {
  throw new UnauthorizedException('Signature invalide')
}
```

---

## 3. Validations formulaires

### 3.1 Champs généraux

```typescript
// Email
@IsEmail()
@MaxLength(255)
email: string

// Téléphone (Suisse)
@Matches(/^(\+41|0)[0-9]{9}$/)
phone: string

// Code postal (Suisse)
@Matches(/^[0-9]{4}$/)
postalCode: string

// Prix
@IsNumber()
@Min(0)
@Max(100000000) // 100M CHF max
price: number

// Pourcentage
@IsNumber()
@Min(0)
@Max(100)
percentage: number

// Surface
@IsNumber()
@Min(0)
@Max(10000) // 10'000 m² max
surface: number
```

### 3.2 Formulaires spécifiques

#### Création Projet
```typescript
class CreateProjectDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string

  @IsString()
  @Matches(/^[A-Z0-9-]+$/)
  @MaxLength(20)
  code: string

  @IsEnum(ProjectType)
  type: ProjectType

  @IsString()
  @MaxLength(255)
  address: string

  @IsPostalCode('CH')
  postalCode: string

  @IsString()
  @MaxLength(100)
  city: string
}
```

#### Création Lot
```typescript
class CreateLotDto {
  @IsUUID()
  projectId: string

  @IsUUID()
  buildingId: string

  @IsString()
  @Matches(/^[A-Z0-9-]+$/)
  code: string

  @IsEnum(LotType)
  type: LotType

  @IsNumber()
  @Min(0.5)
  @Max(20)
  roomsCount: number

  @IsNumber()
  @Min(0)
  surfaceLiving: number

  @IsNumber()
  @Min(0)
  priceBase: number

  @IsEnum(SaleType)
  saleType: SaleType

  @ValidateIf(o => o.saleType === 'QPT')
  @IsNumber()
  @Min(0)
  @Max(10)
  vatRate: number
}
```

#### Création Buyer
```typescript
class CreateBuyerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string

  @IsEmail()
  email: string

  @IsPhoneNumber('CH')
  phone: string

  @IsISO8601()
  birthDate: Date

  @IsEnum(FinancingType)
  financingType: FinancingType

  @ValidateIf(o => o.financingType !== 'CASH')
  @IsString()
  bankName: string

  @ValidateIf(o => o.financingType !== 'CASH')
  @IsNumber()
  @Min(0)
  mortgageAmount: number
}
```

---

## 4. Contraintes d'intégrité

### 4.1 Contraintes database (Prisma)

```prisma
// Unicité composée
@@unique([organisationId, code]) // Project
@@unique([projectId, code]) // Lot
@@unique([userId, organisationId, roleId]) // UserRole

// Index performance
@@index([organisationId])
@@index([status])
@@index([createdAt])

// Foreign keys avec cascade
lot Lot @relation(fields: [lotId], references: [id], onDelete: Cascade)

// Check constraints (via raw SQL)
// amount >= 0
// percentage BETWEEN 0 AND 100
```

### 4.2 Contraintes applicatives

```typescript
// Invariant: Lot vendu a un acheteur
class Lot {
  @ValidateIf(o => o.status === 'SOLD')
  @IsNotEmpty()
  buyerId: string
}

// Invariant: Invoice paid doit avoir paidAt
class Invoice {
  @ValidateIf(o => o.status === 'PAID')
  @IsNotEmpty()
  paidAt: Date
}

// Invariant: Subscription active a currentPeriodEnd futur
class Subscription {
  @ValidateIf(o => o.status === 'ACTIVE')
  @IsDate()
  @MinDate(new Date())
  currentPeriodEnd: Date
}
```

---

## 5. Règles de calcul

### 5.1 Prix lot

```typescript
function calculateLotPrice(lot: Lot): LotPriceCalculation {
  const priceBase = lot.priceBase
  const priceExtras = lot.priceExtras || 0

  let priceTotal: number
  let vatAmount = 0

  if (lot.saleType === 'QPT') {
    // QPT: soumis à TVA
    priceTotal = (priceBase + priceExtras) * (1 + lot.vatRate)
    vatAmount = (priceBase + priceExtras) * lot.vatRate
  } else {
    // PPE: exonéré TVA
    priceTotal = priceBase + priceExtras
  }

  return {
    priceBase,
    priceExtras,
    vatAmount,
    priceTotal
  }
}
```

### 5.2 Acomptes acheteurs

```typescript
function generateInstallments(buyer: Buyer, plan: InstallmentPlan): Installment[] {
  const lotPrice = buyer.lot.priceTotal
  const installments: Installment[] = []

  plan.stages.forEach((stage, index) => {
    const amount = lotPrice * (stage.percentage / 100)
    const dueDate = calculateDueDate(buyer, stage.trigger)

    installments.push({
      buyerId: buyer.id,
      lotId: buyer.lotId,
      installmentNumber: index + 1,
      percentage: stage.percentage,
      amount,
      dueDate,
      status: 'PENDING'
    })
  })

  return installments
}

function calculateDueDate(buyer: Buyer, trigger: string): Date {
  switch (trigger) {
    case 'SIGNATURE_RESERVATION':
      return buyer.reservation.reservedAt

    case 'SIGNATURE_ACT':
      return buyer.notaryFile?.signedAt || addMonths(new Date(), 3)

    case 'GROS_OEUVRE':
      return buyer.project.grossWorkCompletedAt || addMonths(new Date(), 12)

    case 'SECOND_OEUVRE':
      return addMonths(buyer.project.grossWorkCompletedAt, 6)

    case 'DELIVERY':
      return buyer.lot.deliveryDate || addMonths(new Date(), 18)

    default:
      return new Date()
  }
}
```

### 5.3 Budget CFC

```typescript
function calculateCfcProgress(cfcLine: CfcLine): CfcProgress {
  const budgeted = cfcLine.amountBudgeted
  const committed = cfcLine.amountCommitted
  const spent = cfcLine.amountSpent

  const committedPercentage = (committed / budgeted) * 100
  const spentPercentage = (spent / budgeted) * 100
  const remaining = budgeted - committed

  return {
    budgeted,
    committed,
    committedPercentage,
    spent,
    spentPercentage,
    remaining,
    isOverBudget: committed > budgeted
  }
}
```

### 5.4 Statistiques courtier

```typescript
function calculateBrokerStats(brokerId: string, period: DateRange): BrokerStats {
  const prospects = await prisma.prospect.count({
    where: {
      assignedTo: brokerId,
      createdAt: { gte: period.start, lte: period.end }
    }
  })

  const reservations = await prisma.reservation.count({
    where: {
      brokerId,
      reservedAt: { gte: period.start, lte: period.end }
    }
  })

  const sales = await prisma.buyer.count({
    where: {
      lot: {
        reservations: {
          some: { brokerId }
        }
      },
      status: 'ACT_SIGNED',
      createdAt: { gte: period.start, lte: period.end }
    }
  })

  const conversionRate = prospects > 0 ? (sales / prospects) * 100 : 0

  return {
    prospectsCount: prospects,
    reservationsCount: reservations,
    salesCount: sales,
    conversionRate
  }
}
```

---

## 6. Règles de sécurité

### 6.1 RBAC enforcement

```typescript
// Guard permissions
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('projects.delete')
async deleteProject(@Param('id') id: string) {
  // ...
}

// Guard ownership (acheteur)
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Owner('buyerId')
async getBuyerDetails(@Param('id') id: string) {
  // OwnershipGuard vérifie que user.id === buyer.userId
}
```

### 6.2 Validation input

```typescript
// Sanitization
import { sanitize } from 'class-sanitizer'

@Post()
async create(@Body() dto: CreateProjectDto) {
  // Auto-sanitized par class-sanitizer
  // Supprime HTML, scripts, etc.
}

// Validation stricte montants
@IsNumber()
@IsPositive()
@Max(1000000000) // 1 milliard max
amount: number
```

### 6.3 Rate limiting

```typescript
// Global rate limit
@UseGuards(ThrottlerGuard)
@Throttle(100, 60) // 100 req/min
export class ProjectsController {}

// Route sensible
@Post('send-email')
@Throttle(5, 60) // 5 emails/min
async sendEmail() {}
```

### 6.4 Audit trail automatique

```typescript
@UseInterceptors(AuditLogInterceptor)
@AuditAction('PROJECT_UPDATE')
async updateProject(@Param('id') id: string, @Body() dto) {
  // AuditLogInterceptor enregistre automatiquement
}
```

---

## 🎯 Résumé des règles critiques

| Catégorie | Règle clé | Impact |
|-----------|-----------|--------|
| **Multi-tenant** | Isolation stricte | 🔴 Critique |
| **Lots** | Workflow statuts | 🟡 Important |
| **CRM** | Dossier complet avant notaire | 🟡 Important |
| **Finance** | Budget >= Engagement >= Facturé | 🔴 Critique |
| **Soumissions** | Clôture automatique | �� Important |
| **Billing** | Un abonnement actif | 🔴 Critique |
| **Sécurité** | RBAC strict | 🔴 Critique |

---

**Ce document complète l'architecture avec toutes les règles métier et validations.**
