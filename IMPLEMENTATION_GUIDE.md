# 🚀 GUIDE D'IMPLÉMENTATION - SaaS Immobilier Suisse

> Roadmap concrète pour implémenter l'architecture complète avec Prisma + NestJS + Next.js

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Schéma Prisma complet](#2-schéma-prisma-complet)
3. [Structure monorepo](#3-structure-monorepo)
4. [Phase 1 : Fondations (MVP - 3 mois)](#4-phase-1--fondations-mvp---3-mois)
5. [Phase 2 : Modules métier (V1 - 6 mois)](#5-phase-2--modules-métier-v1---6-mois)
6. [Phase 3 : Modules avancés (V2 - 12 mois)](#6-phase-3--modules-avancés-v2---12-mois)
7. [Stack technique détaillée](#7-stack-technique-détaillée)

---

## 1. Vue d'ensemble

### 1.1 Objectif

Implémenter un **SaaS B2B multi-tenant** complet pour la promotion immobilière suisse avec :
- ✅ **50+ tables Prisma** (référentiel complet)
- ✅ **15 modules NestJS** (backend API)
- ✅ **Vues 360°** (frontend Next.js)
- ✅ **Multi-tenant strict** avec isolation données
- ✅ **RBAC avancé** (10 rôles, permissions granulaires)
- ✅ **i18n 4 langues** (FR/DE/EN/IT)

### 1.2 Arborescence globale

```
saas-immo-suisse/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── identity/
│   │   │   │   ├── projects/
│   │   │   │   ├── lots/
│   │   │   │   ├── crm/
│   │   │   │   ├── contracts/      # Module Finance Contrats
│   │   │   │   ├── finance/
│   │   │   │   ├── submissions/
│   │   │   │   ├── documents/
│   │   │   │   ├── notifications/
│   │   │   │   └── billing/
│   │   │   ├── common/
│   │   │   │   ├── guards/
│   │   │   │   ├── decorators/
│   │   │   │   ├── interceptors/
│   │   │   │   └── pipes/
│   │   │   └── infra/
│   │   │       ├── prisma/
│   │   │       ├── s3/
│   │   │       └── email/
│   │   └── test/
│   │
│   └── web/                    # Next.js frontend
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (dashboard)/
│       │   │   ├── projects/
│       │   │   ├── contracts/
│       │   │   ├── companies/
│       │   │   ├── lots/
│       │   │   └── settings/
│       │   └── layout.tsx
│       ├── components/
│       │   ├── ui/              # Design system
│       │   ├── layout/
│       │   └── features/
│       └── lib/
│
├── packages/
│   ├── prisma/                 # Schéma Prisma partagé
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── types/                  # Types TypeScript partagés
│   ├── ui/                     # Design system components
│   └── config/                 # Config partagée (ESLint, TS, etc.)
│
├── docker-compose.yml          # Postgres + MinIO local
├── turbo.json                  # Turborepo config
├── package.json                # Root package
└── pnpm-workspace.yaml         # pnpm workspaces
```

---

## 2. Schéma Prisma complet

### 2.1 Fichier schema.prisma consolidé

```prisma
// packages/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// 1. IDENTITY & RBAC
// ============================================================================

model Organisation {
  id                  String   @id @default(cuid())
  name                String
  slug                String   @unique
  defaultLanguage     String   @default("fr")
  logoUrl             String?
  address             String?
  city                String?
  postalCode          String?
  country             String   @default("CH")

  // Billing
  subscriptionId      String?  @unique
  subscription        Subscription? @relation(fields: [subscriptionId], references: [id])

  // Relations
  users               UserOrganisation[]
  projects            Project[]
  companies           Company[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([slug])
}

model User {
  id                  String   @id @default(cuid())
  email               String   @unique
  passwordHash        String
  firstName           String?
  lastName            String?
  phone               String?
  language            String   @default("fr")
  avatarUrl           String?
  isActive            Boolean  @default(true)
  emailVerified       Boolean  @default(false)
  lastLoginAt         DateTime?

  // Relations
  organisations       UserOrganisation[]
  auditLogs           AuditLog[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([email])
}

model UserOrganisation {
  id              String       @id @default(cuid())
  userId          String
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organisationId  String
  organisation    Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  roleId          String
  role            Role         @relation(fields: [roleId], references: [id])

  createdAt       DateTime     @default(now())

  @@unique([userId, organisationId])
  @@index([userId])
  @@index([organisationId])
}

model Role {
  id              String              @id @default(cuid())
  name            String              @unique
  label           String
  description     String?

  // Relations
  users           UserOrganisation[]
  permissions     RolePermission[]

  @@index([name])
}

model Permission {
  id          String            @id @default(cuid())
  resource    String            // "projects", "contracts", "lots"
  action      String            // "read", "create", "update", "delete"

  roles       RolePermission[]

  @@unique([resource, action])
  @@index([resource])
}

model RolePermission {
  id           String      @id @default(cuid())
  roleId       String
  role         Role        @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId String
  permission   Permission  @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
}

// ============================================================================
// 2. COMPANIES & CONTACTS (Intervenants)
// ============================================================================

enum CompanyType {
  EG
  NOTARY
  ARCHITECT
  ENGINEER
  BROKER
  SUBCONTRACTOR
  SUPPLIER
  OTHER
}

model Company {
  id                 String      @id @default(cuid())
  organisationId     String
  organisation       Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)

  name               String
  type               CompanyType
  registrationNumber String?     // IDE, SIREN
  vatNumber          String?

  address            String?
  city               String?
  postalCode         String?
  country            String      @default("CH")

  phone              String?
  email              String?
  website            String?
  logoUrl            String?

  notes              String?

  // Relations
  contacts           Contact[]
  projectParticipants ProjectParticipant[]
  contracts          Contract[]
  submissionOffers   SubmissionOffer[]

  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  @@index([organisationId])
  @@index([type])
}

model Contact {
  id          String   @id @default(cuid())
  companyId   String?
  company     Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)

  firstName   String
  lastName    String
  email       String?
  phone       String?
  mobile      String?
  jobTitle    String?

  notes       String?

  // Relations
  projectParticipants ProjectParticipant[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([companyId])
}

// ============================================================================
// 3. PROJECTS & STRUCTURE
// ============================================================================

enum ProjectType {
  PPE
  LOCATIF
  MIXTE
}

enum ProjectStatus {
  PLANNING
  SALES
  CONSTRUCTION
  DELIVERED
  CLOSED
}

model Project {
  id              String        @id @default(cuid())
  organisationId  String
  organisation    Organisation  @relation(fields: [organisationId], references: [id], onDelete: Cascade)

  code            String
  name            String
  description     String?

  address         String?
  city            String?
  postalCode      String?
  canton          String?
  country         String        @default("CH")

  type            ProjectType
  status          ProjectStatus @default(PLANNING)

  startDate       DateTime?
  endDate         DateTime?

  imageUrl        String?

  // Relations
  buildings       Building[]
  lots            Lot[]
  participants    ProjectParticipant[]
  contracts       Contract[]
  cfcBudgets      CfcBudget[]
  submissions     Submission[]
  documents       Document[]
  messageThreads  MessageThread[]

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?

  @@unique([organisationId, code])
  @@index([organisationId])
  @@index([status])
}

model Building {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  code        String
  name        String
  floorsCount Int

  // Relations
  floors      Floor[]
  lots        Lot[]

  @@unique([projectId, code])
  @@index([projectId])
}

model Floor {
  id         String   @id @default(cuid())
  buildingId String
  building   Building @relation(fields: [buildingId], references: [id], onDelete: Cascade)

  label      String
  order      Int

  // Relations
  lots       Lot[]

  @@index([buildingId])
}

enum ParticipantRole {
  OWNER
  EG
  ARCHITECT
  ENGINEER
  NOTARY
  BROKER
  SUBCONTRACTOR
  OTHER
}

model ProjectParticipant {
  id        String           @id @default(cuid())
  projectId String
  project   Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)
  companyId String
  company   Company          @relation(fields: [companyId], references: [id], onDelete: Cascade)
  contactId String?
  contact   Contact?         @relation(fields: [contactId], references: [id], onDelete: SetNull)

  role      ParticipantRole
  joinedAt  DateTime         @default(now())

  @@index([projectId])
  @@index([companyId])
}

// ============================================================================
// 4. LOTS & PROGRAMME DE VENTE
// ============================================================================

enum LotType {
  APARTMENT
  DUPLEX
  ATTIC
  VILLA
  COMMERCIAL
  OFFICE
  PARKING
  STORAGE
  CELLAR
}

enum LotStatus {
  AVAILABLE
  RESERVED
  OPTION
  SOLD
  DELIVERED
}

enum SaleType {
  PPE
  QPT
}

model Lot {
  id              String     @id @default(cuid())
  projectId       String
  project         Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  buildingId      String
  building        Building   @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  floorId         String?
  floor           Floor?     @relation(fields: [floorId], references: [id], onDelete: SetNull)

  code            String
  name            String?
  type            LotType
  status          LotStatus  @default(AVAILABLE)

  // Technique
  roomsCount      Decimal
  surfaceLiving   Decimal
  surfacePPE      Decimal
  surfaceTerrace  Decimal?
  surfaceBalcony  Decimal?
  surfaceGarden   Decimal?
  surfaceTotal    Decimal
  orientation     String?
  floorLevel      Int

  // Commercial
  saleType        SaleType
  priceBase       Decimal
  priceExtras     Decimal    @default(0)
  priceTotal      Decimal
  vatRate         Decimal?
  vatAmount       Decimal?

  // Documents
  planFileUrl     String?
  brochureUrl     String?

  // Relations
  reservations    Reservation[]
  buyers          Buyer[]

  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  deletedAt       DateTime?

  @@unique([projectId, code])
  @@index([projectId])
  @@index([status])
}

// ============================================================================
// 5. CRM & VENTES
// ============================================================================

enum ProspectStatus {
  NEW
  CONTACTED
  QUALIFIED
  VISIT_SCHEDULED
  VISIT_DONE
  OFFER_SENT
  RESERVED
  LOST
}

model Prospect {
  id             String         @id @default(cuid())
  projectId      String

  firstName      String
  lastName       String
  email          String?
  phone          String?

  status         ProspectStatus @default(NEW)
  source         String?
  interestedLots Json?
  budgetMin      Decimal?
  budgetMax      Decimal?

  assignedTo     String?        // User ID (courtier)
  notes          String?

  // Relations
  reservations   Reservation[]

  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@index([projectId])
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CONVERTED
  CANCELLED
  EXPIRED
}

model Reservation {
  id                   String            @id @default(cuid())
  projectId            String
  lotId                String
  lot                  Lot               @relation(fields: [lotId], references: [id], onDelete: Cascade)
  prospectId           String?
  prospect             Prospect?         @relation(fields: [prospectId], references: [id], onDelete: SetNull)

  buyerFirstName       String
  buyerLastName        String
  buyerEmail           String?
  buyerPhone           String?

  status               ReservationStatus @default(PENDING)
  reservedAt           DateTime          @default(now())
  expiresAt            DateTime?

  depositAmount        Decimal?
  depositPaidAt        DateTime?
  depositProof         String?

  brokerId             String?           // Company ID
  brokerCommissionRate Decimal?

  notes                String?

  // Relations
  buyers               Buyer[]

  @@index([projectId])
  @@index([lotId])
}

enum BuyerStatus {
  ACTIVE
  DOCUMENTS_PENDING
  DOCUMENTS_COMPLETE
  READY_FOR_SIGNING
  ACT_SIGNED
  DELIVERED
}

enum FinancingType {
  CASH
  MORTGAGE
  MIXED
}

model Buyer {
  id              String        @id @default(cuid())
  projectId       String
  lotId           String
  lot             Lot           @relation(fields: [lotId], references: [id], onDelete: Cascade)
  reservationId   String?
  reservation     Reservation?  @relation(fields: [reservationId], references: [id], onDelete: SetNull)
  userId          String?       // Linked user account

  // Personal info
  firstName       String
  lastName        String
  email           String?
  phone           String?
  address         String?
  city            String?
  postalCode      String?
  country         String        @default("CH")
  birthDate       DateTime?
  nationality     String?

  // Company (if not individual)
  isIndividual    Boolean       @default(true)
  companyName     String?
  companyIde      String?

  // Co-buyers
  coBuyers        Json?

  // Financing
  financingType   FinancingType
  bankName        String?
  mortgageAmount  Decimal?

  // Notary
  notaryId        String?

  status          BuyerStatus   @default(ACTIVE)

  // Relations
  buyerFile       BuyerFile?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([projectId])
  @@index([lotId])
}

model BuyerFile {
  id                   String                      @id @default(cuid())
  buyerId              String                      @unique
  buyer                Buyer                       @relation(fields: [buyerId], references: [id], onDelete: Cascade)

  completionPercentage Int                         @default(0)
  isComplete           Boolean                     @default(false)
  sentToNotaryAt       DateTime?

  // Relations
  documentRequirements BuyerDocumentRequirement[]
}

enum RequirementType {
  ID_CARD
  PROOF_OF_RESIDENCE
  PROOF_OF_FUNDS
  MORTGAGE_PRE_APPROVAL
  MORTGAGE_FINAL_APPROVAL
  MARRIAGE_CERTIFICATE
  RESIDENCE_PERMIT
  TAX_DECLARATION
  OTHER
}

enum RequirementStatus {
  PENDING
  RECEIVED
  VALIDATED
  REJECTED
}

model BuyerDocumentRequirement {
  id          String            @id @default(cuid())
  buyerFileId String
  buyerFile   BuyerFile         @relation(fields: [buyerFileId], references: [id], onDelete: Cascade)

  type        RequirementType
  label       String
  description String?
  isRequired  Boolean           @default(true)
  status      RequirementStatus @default(PENDING)
  documentId  String?
  uploadedAt  DateTime?
  notes       String?

  @@index([buyerFileId])
}

// ============================================================================
// 6. CONTRATS EG & SOUS-TRAITANTS (Finance Contracts)
// ============================================================================

enum ContractType {
  EG
  SUBCONTRACTOR
  ARCHITECT
  ENGINEER
  SERVICE
  OTHER
}

enum ContractStatus {
  DRAFT
  NEGOTIATION
  SIGNED
  ACTIVE
  SUSPENDED
  COMPLETED
  TERMINATED
}

enum PaymentTermType {
  MILESTONE
  PROGRESS
  MONTHLY
  DELIVERY
  CUSTOM
}

model Contract {
  id                    String          @id @default(cuid())
  organisationId        String
  projectId             String
  project               Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  companyId             String
  company               Company         @relation(fields: [companyId], references: [id])

  // Identification
  number                String
  name                  String
  type                  ContractType
  status                ContractStatus  @default(DRAFT)

  // Montants
  amountInitial         Decimal
  amountRevised         Decimal
  amountInvoiced        Decimal         @default(0)
  amountPaid            Decimal         @default(0)

  vatRate               Decimal         @default(8.1)

  // Conditions paiement
  paymentTermType       PaymentTermType
  paymentTerms          Json?
  retentionRate         Decimal?
  retentionAmount       Decimal?
  retentionReleaseDate  DateTime?

  // Dates
  signedAt              DateTime?
  startDate             DateTime?
  plannedEndDate        DateTime?
  actualEndDate         DateTime?

  // CFC
  cfcLineIds            Json?

  // Documents
  documentId            String?

  penaltyClause         String?
  warrantyPeriod        Int?            // Mois de garantie

  notes                 String?
  createdBy             String

  // Relations
  cfcAllocations        ContractCfcAllocation[]
  amendments            ContractAmendment[]
  progressReports       ContractProgressReport[]
  invoices              ContractInvoice[]
  payments              ContractPayment[]

  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  @@unique([projectId, number])
  @@index([projectId])
  @@index([companyId])
  @@index([status])
}

model ContractCfcAllocation {
  id          String     @id @default(cuid())
  contractId  String
  contract    Contract   @relation(fields: [contractId], references: [id], onDelete: Cascade)
  cfcBudgetId String
  cfcBudget   CfcBudget  @relation(fields: [cfcBudgetId], references: [id])

  amount      Decimal

  @@index([contractId])
  @@index([cfcBudgetId])
}

enum AmendmentType {
  PRICE_INCREASE
  PRICE_DECREASE
  SCOPE_CHANGE
  DEADLINE_EXTENSION
  OTHER
}

enum AmendmentStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
  SIGNED
}

model ContractAmendment {
  id            String          @id @default(cuid())
  contractId    String
  contract      Contract        @relation(fields: [contractId], references: [id], onDelete: Cascade)

  number        String
  title         String
  type          AmendmentType
  status        AmendmentStatus @default(DRAFT)

  amountChange  Decimal
  justification String

  cfcLineIds    Json?
  delayDays     Int?

  originType    String?
  originId      String?

  documentId    String?

  proposedBy    String
  proposedAt    DateTime        @default(now())
  approvedBy    String?
  approvedAt    DateTime?
  signedAt      DateTime?

  notes         String?

  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@unique([contractId, number])
  @@index([contractId])
}

enum ProgressReportStatus {
  DRAFT
  SUBMITTED
  TECHNICAL_REVIEW
  TECHNICAL_APPROVED
  TECHNICAL_REJECTED
  FINANCIAL_REVIEW
  FINANCIAL_APPROVED
  FINANCIAL_REJECTED
  INVOICED
}

model ContractProgressReport {
  id                  String                @id @default(cuid())
  contractId          String
  contract            Contract              @relation(fields: [contractId], references: [id], onDelete: Cascade)

  number              String
  periodStart         DateTime
  periodEnd           DateTime

  status              ProgressReportStatus  @default(DRAFT)

  progressPercentage  Decimal?
  amountClaimed       Decimal
  amountApproved      Decimal?

  description         String
  attachments         Json?

  submittedBy         String?
  submittedAt         DateTime?

  technicalReviewedBy String?
  technicalReviewedAt DateTime?
  technicalNotes      String?

  financialReviewedBy String?
  financialReviewedAt DateTime?
  financialNotes      String?

  invoiceId           String?
  invoice             ContractInvoice?      @relation(fields: [invoiceId], references: [id])

  // Relations
  lineItems           ContractProgressReportLineItem[]

  createdAt           DateTime              @default(now())
  updatedAt           DateTime              @updatedAt

  @@unique([contractId, number])
  @@index([contractId])
}

model ContractProgressReportLineItem {
  id                String                  @id @default(cuid())
  progressReportId  String
  progressReport    ContractProgressReport  @relation(fields: [progressReportId], references: [id], onDelete: Cascade)

  code              String?
  description       String
  unit              String?

  quantityTotal     Decimal?
  quantityPrevious  Decimal                 @default(0)
  quantityCurrent   Decimal

  unitPrice         Decimal
  amountClaimed     Decimal
  amountApproved    Decimal?

  notes             String?

  @@index([progressReportId])
}

enum ContractInvoiceStatus {
  DRAFT
  RECEIVED
  TECHNICAL_REVIEW
  TECHNICAL_APPROVED
  TECHNICAL_REJECTED
  FINANCIAL_REVIEW
  APPROVED_FOR_PAYMENT
  REJECTED
  PAID
  PARTIALLY_PAID
}

model ContractInvoice {
  id                  String                  @id @default(cuid())
  contractId          String
  contract            Contract                @relation(fields: [contractId], references: [id], onDelete: Cascade)
  progressReportId    String?

  invoiceNumber       String
  invoiceDate         DateTime
  dueDate             DateTime

  status              ContractInvoiceStatus   @default(RECEIVED)

  amountHT            Decimal
  vatRate             Decimal
  vatAmount           Decimal
  amountTTC           Decimal

  retentionAmount     Decimal?
  amountToPay         Decimal

  amountPaid          Decimal                 @default(0)

  documentId          String?

  technicalReviewedBy String?
  technicalReviewedAt DateTime?
  technicalNotes      String?

  financialReviewedBy String?
  financialReviewedAt DateTime?
  financialNotes      String?

  approvedBy          String?
  approvedAt          DateTime?

  paidAt              DateTime?

  notes               String?

  // Relations
  payments            ContractPayment[]
  progressReports     ContractProgressReport[]

  createdAt           DateTime                @default(now())
  updatedAt           DateTime                @updatedAt

  @@unique([contractId, invoiceNumber])
  @@index([contractId])
  @@index([progressReportId])
}

model ContractPayment {
  id              String          @id @default(cuid())
  contractId      String
  invoiceId       String
  invoice         ContractInvoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  amount          Decimal
  paymentDate     DateTime
  paymentMethod   String?
  reference       String?

  proofDocumentId String?

  notes           String?
  createdBy       String

  createdAt       DateTime        @default(now())

  @@index([invoiceId])
}

// ============================================================================
// 7. FINANCE CFC
// ============================================================================

model CfcBudget {
  id                String                  @id @default(cuid())
  projectId         String
  project           Project                 @relation(fields: [projectId], references: [id], onDelete: Cascade)

  code              String
  label             String
  parentId          String?
  parent            CfcBudget?              @relation("CfcHierarchy", fields: [parentId], references: [id])
  children          CfcBudget[]             @relation("CfcHierarchy")

  amountBudgeted    Decimal                 @default(0)
  amountCommitted   Decimal                 @default(0)
  amountSpent       Decimal                 @default(0)
  amountPaid        Decimal                 @default(0)

  // Relations
  contractAllocations ContractCfcAllocation[]

  createdAt         DateTime                @default(now())
  updatedAt         DateTime                @updatedAt

  @@unique([projectId, code])
  @@index([projectId])
}

// ============================================================================
// 8. SOUMISSIONS
// ============================================================================

enum SubmissionStatus {
  DRAFT
  OPEN
  CLOSED
  AWARDED
  CANCELLED
}

model Submission {
  id                String           @id @default(cuid())
  projectId         String
  project           Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)

  title             String
  description       String?

  status            SubmissionStatus @default(DRAFT)

  questionsDeadline DateTime?
  closingDate       DateTime

  cfcLineIds        Json?

  // Relations
  invites           SubmissionInvite[]
  offers            SubmissionOffer[]
  adjudication      Adjudication?

  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  @@index([projectId])
  @@index([status])
}

model SubmissionInvite {
  id           String     @id @default(cuid())
  submissionId String
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  companyId    String

  invitedAt    DateTime   @default(now())

  @@unique([submissionId, companyId])
  @@index([submissionId])
}

enum SubmissionOfferStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  ACCEPTED
  REJECTED
}

model SubmissionOffer {
  id            String                @id @default(cuid())
  submissionId  String
  companyId     String
  company       Company               @relation(fields: [companyId], references: [id])

  totalAmount   Decimal
  deliveryDelay Int

  status        SubmissionOfferStatus @default(DRAFT)

  notes         String?

  submittedAt   DateTime?

  // Relations
  adjudication  Adjudication?

  createdAt     DateTime              @default(now())
  updatedAt     DateTime              @updatedAt

  @@unique([submissionId, companyId])
  @@index([submissionId])
}

model Adjudication {
  id            String          @id @default(cuid())
  submissionId  String          @unique
  submission    Submission      @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  offerId       String          @unique
  offer         SubmissionOffer @relation(fields: [offerId], references: [id])

  justification String?

  proposedBy    String
  proposedAt    DateTime        @default(now())
  confirmedBy   String?
  confirmedAt   DateTime?

  @@index([submissionId])
}

// ============================================================================
// 9. DOCUMENTS
// ============================================================================

enum DocumentCategory {
  LEGAL
  PLANS
  CONTRACTS
  SUBMISSIONS
  COMMERCIAL
  BUYER_FILES
  CONSTRUCTION
  REPORTS
  PHOTOS
  OTHER
}

model Document {
  id             String           @id @default(cuid())
  projectId      String
  project        Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)

  name           String
  description    String?
  category       DocumentCategory

  fileUrl        String?
  fileSize       BigInt?
  fileType       String?
  versionNumber  Int              @default(1)

  parentFolderId String?
  parentFolder   Document?        @relation("DocumentHierarchy", fields: [parentFolderId], references: [id])
  children       Document[]       @relation("DocumentHierarchy")

  isFolder       Boolean          @default(false)
  tags           Json?

  uploadedBy     String?

  // Relations
  versions       DocumentVersion[]

  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  deletedAt      DateTime?

  @@index([projectId])
  @@index([category])
}

model DocumentVersion {
  id            String   @id @default(cuid())
  documentId    String
  document      Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  versionNumber Int
  fileUrl       String
  fileSize      BigInt?
  comment       String?

  createdBy     String?
  createdAt     DateTime @default(now())

  @@index([documentId])
}

// ============================================================================
// 10. COMMUNICATION
// ============================================================================

model MessageThread {
  id          String    @id @default(cuid())
  projectId   String
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  title       String
  contextType String?
  contextId   String?

  createdBy   String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  messages    Message[]

  @@index([projectId])
}

model Message {
  id          String        @id @default(cuid())
  threadId    String
  thread      MessageThread @relation(fields: [threadId], references: [id], onDelete: Cascade)

  content     String
  authorId    String
  mentions    Json?
  attachments Json?

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([threadId])
}

// ============================================================================
// 11. BILLING SAAS
// ============================================================================

enum PlanInterval {
  MONTH
  YEAR
}

model Plan {
  id              String        @id @default(cuid())
  name            String        @unique
  label           String
  description     String?

  price           Decimal
  currency        String        @default("CHF")
  interval        PlanInterval  @default(MONTH)

  features        Json?

  isActive        Boolean       @default(true)

  // Relations
  subscriptions   Subscription[]

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([name])
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
}

model Subscription {
  id                  String             @id @default(cuid())
  organisationId      String             @unique
  organisation        Organisation?
  planId              String
  plan                Plan               @relation(fields: [planId], references: [id])

  status              SubscriptionStatus @default(TRIAL)

  currentPeriodStart  DateTime
  currentPeriodEnd    DateTime

  trialStart          DateTime?
  trialEnd            DateTime?

  cancelAtPeriodEnd   Boolean            @default(false)
  cancelledAt         DateTime?

  // Datatrans
  datatransTransactionId String?
  datatransCustomerId    String?

  // Relations
  invoices            SubscriptionInvoice[]

  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  @@index([organisationId])
  @@index([status])
}

enum SubscriptionInvoiceStatus {
  DRAFT
  OPEN
  PAID
  VOID
  UNCOLLECTIBLE
}

model SubscriptionInvoice {
  id             String                    @id @default(cuid())
  subscriptionId String
  subscription   Subscription              @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  invoiceNumber  String                    @unique

  amount         Decimal
  currency       String                    @default("CHF")

  status         SubscriptionInvoiceStatus @default(OPEN)

  dueDate        DateTime
  paidAt         DateTime?

  datatransTransactionId String?

  createdAt      DateTime                  @default(now())
  updatedAt      DateTime                  @updatedAt

  @@index([subscriptionId])
}

// ============================================================================
// 12. AUDIT LOG
// ============================================================================

model AuditLog {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  organisationId String

  action         String   // CREATE, UPDATE, DELETE
  resourceType   String
  resourceId     String

  changes        Json?

  ipAddress      String?
  userAgent      String?

  createdAt      DateTime @default(now())

  @@index([userId])
  @@index([organisationId])
  @@index([resourceType])
  @@index([createdAt])
}
```

---

## 3. Structure monorepo

### 3.1 Initialisation

```bash
# 1. Créer projet
mkdir saas-immo-suisse
cd saas-immo-suisse

# 2. Init pnpm workspace
pnpm init

# 3. Créer pnpm-workspace.yaml
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 4. Créer structure
mkdir -p apps/api/src
mkdir -p apps/web
mkdir -p packages/prisma
mkdir -p packages/types
mkdir -p packages/ui
mkdir -p packages/config
```

### 3.2 Configuration Turborepo

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

### 3.3 Package root

```json
// package.json (root)
{
  "name": "saas-immo-suisse",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "db:generate": "turbo run db:generate",
    "db:migrate": "turbo run db:migrate",
    "db:studio": "cd packages/prisma && prisma studio"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.2.0"
  }
}
```

---

## 4. Phase 1 : Fondations (MVP - 3 mois)

### 4.1 Semaine 1-2 : Setup infrastructure

**Objectif** : Monorepo fonctionnel + Prisma + Auth

**Tasks** :
```bash
# 1. Init NestJS API
cd apps/api
pnpm init
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express
pnpm add -D @nestjs/cli typescript @types/node

# 2. Init Prisma
cd ../../packages/prisma
pnpm init
pnpm add prisma @prisma/client
npx prisma init

# Copier le schema.prisma complet
# Lancer première migration
npx prisma migrate dev --name init

# 3. Init Next.js
cd ../../apps/web
pnpm create next-app@latest . --typescript --tailwind --app --src-dir

# 4. Docker Compose (Postgres + MinIO)
```

**Docker Compose** :
```yaml
# docker-compose.yml (root)
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: saas_immo
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

### 4.2 Semaine 3-4 : Module Identity & Auth

**Modules à créer** :
- `apps/api/src/modules/auth/` (Login, Register, JWT)
- `apps/api/src/modules/identity/` (Users, Organisations, Roles)

**Priorités** :
1. ✅ AuthModule (JWT, Guards)
2. ✅ UsersService
3. ✅ OrganisationsService
4. ✅ RolesService
5. ✅ RBAC Guards & Decorators

### 4.3 Semaine 5-6 : Module Projects & Lots

**Modules** :
- `apps/api/src/modules/projects/`
- `apps/api/src/modules/lots/`

**Features** :
- CRUD Projets
- CRUD Bâtiments/Étages
- CRUD Lots
- Filtres avancés

### 4.4 Semaine 7-8 : Module Companies & Participants

**Modules** :
- `apps/api/src/modules/companies/`
- `apps/api/src/modules/participants/`

### 4.5 Semaine 9-10 : Frontend MVP

**Pages Next.js** :
- Login/Register
- Dashboard
- Projets (liste + détails)
- Lots (liste + détails)
- Entreprises (liste + détails)

### 4.6 Semaine 11-12 : Tests & Déploiement MVP

**Tests** :
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Playwright)

**Déploiement** :
- Backend : Railway / Render
- Frontend : Vercel
- Database : Supabase

---

## 5. Phase 2 : Modules métier (V1 - 6 mois)

### 5.1 Mois 4 : CRM & Ventes

**Modules** :
- `modules/crm/` (Prospects, Réservations, Buyers)
- Frontend CRM (Pipeline Kanban, Dossiers acheteurs)

### 5.2 Mois 5 : Contrats & Finance

**Modules** :
- `modules/contracts/` (**MODULE CLÉ**)
  - Contrats
  - Avenants
  - Situations de travaux
  - Facturation
  - Paiements
- `modules/finance/` (CFC, Budgets)

### 5.3 Mois 6 : Soumissions

**Modules** :
- `modules/submissions/`
  - Création soumissions
  - Invitations entreprises
  - Dépôt offres
  - Comparatif
  - Adjudications

### 5.4 Mois 7 : Documents

**Modules** :
- `modules/documents/`
  - Upload S3/MinIO
  - Versioning
  - Catégorisation
  - Droits d'accès

### 5.5 Mois 8 : Notaires

**Modules** :
- `modules/notary/`
  - Dossiers notaires
  - Actes (versions)
  - RDV signatures

### 5.6 Mois 9 : Communication

**Modules** :
- `modules/messages/`
  - Threads
  - Messages
  - Mentions
  - Notifications

---

## 6. Phase 3 : Modules avancés (V2 - 12 mois)

### 6.1 Mois 10 : Choix matériaux

**Modules** :
- `modules/materials/`
  - Catalogue
  - Choix acheteurs
  - Validations
  - Surcoûts

### 6.2 Mois 11 : Suivi chantier

**Modules** :
- `modules/construction/`
  - Planning
  - Phases
  - Avancement
  - Photos

### 6.3 Mois 12 : Reporting & Analytics

**Modules** :
- `modules/reporting/`
  - Dashboards personnalisés
  - KPIs temps réel
  - Export Excel/PDF

---

## 7. Stack technique détaillée

### 7.1 Backend (NestJS)

```typescript
// Package.json API
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/throttler": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "aws-sdk": "^2.1400.0",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^3.0.8",
    "@types/bcrypt": "^5.0.0",
    "prisma": "^5.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "typescript": "^5.2.0"
  }
}
```

### 7.2 Frontend (Next.js)

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.290.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "i18next": "^23.0.0",
    "react-i18next": "^13.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 7.3 Database (Supabase PostgreSQL)

**Configuration** :
```env
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas_immo"

# Supabase (production)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

**Extensions PostgreSQL** :
```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- Index optimization
```

---

## 🎯 Checklist démarrage

### Étape 1 : Setup initial

- [ ] Créer repo GitHub
- [ ] Init monorepo (pnpm + Turborepo)
- [ ] Setup Docker Compose (Postgres + MinIO)
- [ ] Init Prisma avec schéma complet
- [ ] Première migration `npx prisma migrate dev --name init`
- [ ] Generate Prisma Client

### Étape 2 : Backend NestJS

- [ ] Create apps/api avec NestJS CLI
- [ ] Setup PrismaService
- [ ] Module Auth (JWT + Guards)
- [ ] Module Identity (Users, Orgs, Roles)
- [ ] Seed initial (roles, permissions)

### Étape 3 : Frontend Next.js

- [ ] Create apps/web avec Next.js
- [ ] Setup Tailwind + Design system
- [ ] Pages auth (login, register)
- [ ] Layout dashboard
- [ ] API client (fetch/axios)

### Étape 4 : Module Contracts (PRIORITÉ)

- [ ] ContractsModule NestJS
- [ ] ContractsService (CRUD)
- [ ] ProgressReportsService (Situations)
- [ ] ContractInvoicesService
- [ ] Frontend Contracts (vues 360°)

### Étape 5 : Tests & Déploiement

- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy frontend (Vercel)
- [ ] Setup CI/CD (GitHub Actions)

---

## 🚀 Commandes essentielles

```bash
# Dev local
pnpm dev                    # Lance tout (api + web)

# Database
pnpm db:generate            # Generate Prisma Client
pnpm db:migrate             # Run migrations
pnpm db:studio              # Prisma Studio (GUI)
pnpm db:seed                # Seed data

# Build
pnpm build                  # Build all apps

# Tests
pnpm test                   # Run all tests
pnpm test:e2e               # E2E tests
pnpm test:cov               # Coverage

# Linting
pnpm lint                   # Lint all apps
pnpm lint:fix               # Fix issues
```

---

**Ce guide fournit une roadmap concrète étape par étape pour implémenter l'architecture complète du SaaS Immobilier Suisse.**
