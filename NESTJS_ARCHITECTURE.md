# 🏗️ Architecture SaaS B2B Enterprise - PropTech

> Architecture complète NestJS + Next.js + Prisma + Supabase PostgreSQL pour la gestion de projets immobiliers (PPE/QPT) en Suisse.

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technique](#stack-technique)
3. [Structure monorepo](#structure-monorepo)
4. [Schéma Prisma complet](#schéma-prisma-complet)
5. [Architecture backend NestJS](#architecture-backend-nestjs)
6. [Architecture frontend Next.js](#architecture-frontend-nextjs)
7. [RBAC & Sécurité](#rbac--sécurité)
8. [Multi-tenant](#multi-tenant)
9. [i18n 4 langues](#i18n-4-langues)
10. [Billing Datatrans](#billing-datatrans)
11. [Roadmap produit](#roadmap-produit)

---

## 🎯 Vue d'ensemble

### Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  App Router • React 18 • TypeScript • Tailwind • i18n       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────────┐
│                   BACKEND API (NestJS)                       │
│  Modules • Guards • Interceptors • Prisma • Multi-tenant    │
└────────────────────┬────────────────────────────────────────┘
                     │ Prisma Client
┌────────────────────▼────────────────────────────────────────┐
│              DATABASE (Supabase PostgreSQL)                  │
│  40+ tables • RLS • Indexes • Enums • Relations             │
└──────────────────────────────────────────────────────────────┘
```

### Domaines métier (15)

| Domaine | Objectif | Entités clés | Dépendances |
|---------|----------|--------------|-------------|
| **identity** | Users, auth, RBAC, organisations | User, Organisation, Role, Permission | - |
| **projects** | Projets, bâtiments, structure | Project, Building, Floor, Lot | identity |
| **participants** | Acteurs du projet (EG, architectes) | Company, Contact, ProjectParticipant | identity, projects |
| **crm** | Pipeline commercial, prospects | Prospect, Reservation, Buyer | projects, participants |
| **notary** | Dossiers notaire, actes | NotaryFile, NotaryAct | crm, participants |
| **brokers** | Courtiers, commissions | BrokerStats, Commission | crm |
| **submissions** | Appels d'offres, soumissions | Submission, Offer, Adjudication | projects, participants |
| **finance** | CFC, budgets, factures | CfcBudget, Invoice, Payment | projects, crm |
| **documents** | GED, versioning | Document, DocumentVersion | projects |
| **choices** | Choix matériaux acquéreurs | MaterialCatalog, BuyerChoice | projects, crm |
| **construction** | Planning chantier | Phase, Task, ProgressSnapshot | projects |
| **communication** | Messages, notifications | Thread, Message, Notification | projects |
| **settings** | Configuration projet | ProjectSettings, Template | projects |
| **reporting** | Dashboards, KPIs | Dashboard, KpiSnapshot | projects |
| **billing** | Abonnements SaaS, Datatrans | Plan, Subscription, Invoice | identity |

---

## 🛠️ Stack technique

### Core
- **Runtime** : Node.js 20 LTS
- **Package Manager** : pnpm 8
- **Monorepo** : Turborepo
- **Database** : Supabase PostgreSQL 15
- **ORM** : Prisma 5

### Backend
- **Framework** : NestJS 10
- **Auth** : JWT (access + refresh tokens)
- **Validation** : class-validator + class-transformer
- **Testing** : Jest + Supertest
- **Documentation** : Swagger/OpenAPI

### Frontend
- **Framework** : Next.js 14 (App Router)
- **UI Library** : React 18
- **Styling** : Tailwind CSS 3
- **State** : React Query (TanStack Query)
- **Forms** : React Hook Form + Zod
- **i18n** : next-intl

### Infrastructure
- **Containers** : Docker + Docker Compose
- **Storage** : MinIO (S3-compatible)
- **PSP** : Datatrans (CHF, cartes, TWINT)
- **Logs** : Winston + structured JSON
- **Monitoring** : (à définir - Sentry, Datadog)

---

## 📦 Structure monorepo

```
proptech-saas/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/         # Guards, decorators, interceptors
│   │   │   ├── config/         # Configuration
│   │   │   ├── infra/          # Prisma, storage, billing
│   │   │   └── modules/        # 15 modules métier
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   └── web/                    # Frontend Next.js
│       ├── app/                # App Router
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── projects/
│       │   ├── billing/
│       │   └── settings/
│       ├── components/         # Composants React
│       ├── lib/                # Utils, API client, i18n
│       ├── hooks/              # Custom hooks
│       ├── public/
│       └── package.json
│
├── packages/
│   ├── ui/                     # Design system
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── core/                   # Types & utils partagés
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── validators/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── tsconfig/               # Configs TypeScript partagées
│       ├── base.json
│       ├── nextjs.json
│       └── nestjs.json
│
├── docker-compose.yml          # Postgres + MinIO
├── package.json                # Root package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
└── README.md
```

### Configuration pnpm workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Configuration Turborepo

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: proptech
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: proptech_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

---

## 🗄️ Schéma Prisma complet

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// ENUMS
// ============================================================================

enum LanguageCode {
  FR
  DE
  EN
  IT
}

enum ProjectStatus {
  PLANNING
  CONSTRUCTION
  SELLING
  COMPLETED
  ARCHIVED
}

enum LotType {
  APARTMENT
  COMMERCIAL
  PARKING
  STORAGE
  VILLA
  HOUSE
}

enum LotStatus {
  AVAILABLE
  RESERVED
  OPTION
  SOLD
  DELIVERED
}

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

enum ReservationStatus {
  PENDING
  CONFIRMED
  CONVERTED
  CANCELLED
  EXPIRED
}

enum BuyerStatus {
  ACTIVE
  DOCUMENTS_PENDING
  READY_FOR_SIGNING
  SIGNED
  COMPLETED
}

enum SubmissionStatus {
  DRAFT
  OPEN
  CLOSED
  AWARDED
  CANCELLED
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

enum PaymentMethodType {
  CARD
  TWINT
  POSTFINANCE
  BANK_TRANSFER
}

// ============================================================================
// IDENTITY & MULTI-TENANT
// ============================================================================

model Organisation {
  id              String        @id @default(uuid())
  name            String
  slug            String        @unique
  defaultLanguage LanguageCode  @default(FR)
  logoUrl         String?
  settings        Json?
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  users           UserOrganisation[]
  projects        Project[]
  companies       Company[]
  contacts        Contact[]
  subscriptions   Subscription[]

  @@index([slug])
}

model User {
  id            String        @id @default(uuid())
  email         String        @unique
  passwordHash  String
  firstName     String
  lastName      String
  language      LanguageCode  @default(FR)
  avatarUrl     String?
  phone         String?
  isActive      Boolean       @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  organisations     UserOrganisation[]
  roles             UserRole[]
  createdProjects   Project[]          @relation("ProjectCreator")
  messages          Message[]
  notifications     Notification[]
  auditLogs         AuditLog[]

  @@index([email])
}

model UserOrganisation {
  userId         String
  organisationId String
  isDefault      Boolean   @default(false)
  joinedAt       DateTime  @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organisation Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)

  @@id([userId, organisationId])
  @@index([userId])
  @@index([organisationId])
}

model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  label       Json     // i18n labels {fr, de, en, it}
  description Json?    // i18n descriptions
  isSystem    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  userRoles        UserRole[]
  rolePermissions  RolePermission[]

  @@index([name])
}

model Permission {
  id          String   @id @default(uuid())
  resource    String   // "projects", "lots", etc.
  action      String   // "read", "create", "update", "delete"
  name        String   @unique // "projects.read"
  description Json?    // i18n descriptions
  createdAt   DateTime @default(now())

  // Relations
  rolePermissions RolePermission[]

  @@unique([resource, action])
  @@index([name])
}

model RolePermission {
  roleId       String
  permissionId String

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
}

model UserRole {
  id             String   @id @default(uuid())
  userId         String
  organisationId String
  roleId         String
  assignedAt     DateTime @default(now())
  assignedBy     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, organisationId, roleId])
  @@index([userId])
  @@index([organisationId])
  @@index([roleId])
}

// ============================================================================
// PROJECTS & STRUCTURE
// ============================================================================

model Project {
  id             String        @id @default(uuid())
  organisationId String
  name           String
  code           String
  description    String?
  address        String?
  city           String?
  postalCode     String?
  country        String        @default("CH")
  status         ProjectStatus @default(PLANNING)
  startDate      DateTime?
  endDate        DateTime?
  totalSurface   Decimal?      @db.Decimal(10, 2)
  totalVolume    Decimal?      @db.Decimal(10, 2)
  imageUrl       String?
  settings       Json?
  createdBy      String
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  organisation Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  creator      User         @relation("ProjectCreator", fields: [createdBy], references: [id])

  // Relations
  buildings             Building[]
  lots                  Lot[]
  projectParticipants   ProjectParticipant[]
  prospects             Prospect[]
  reservations          Reservation[]
  buyers                Buyer[]
  submissions           Submission[]
  cfcBudgets            CfcBudget[]
  contracts             Contract[]
  invoices              Invoice[]
  documents             Document[]
  messageThreads        MessageThread[]
  projectPhases         ProjectPhase[]
  projectSettings       ProjectSettings?

  @@unique([organisationId, code])
  @@index([organisationId])
  @@index([status])
  @@index([code])
}

model Building {
  id          String   @id @default(uuid())
  projectId   String
  name        String
  code        String
  floorsCount Int      @default(0)
  totalLots   Int      @default(0)
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Relations
  entrances Entrance[]
  floors    Floor[]
  lots      Lot[]

  @@unique([projectId, code])
  @@index([projectId])
}

model Entrance {
  id         String   @id @default(uuid())
  buildingId String
  name       String
  code       String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  building Building @relation(fields: [buildingId], references: [id], onDelete: Cascade)

  // Relations
  floors Floor[]

  @@unique([buildingId, code])
  @@index([buildingId])
}

model Floor {
  id         String   @id @default(uuid())
  buildingId String
  entranceId String?
  level      Int
  name       String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  building Building  @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  entrance Entrance? @relation(fields: [entranceId], references: [id], onDelete: SetNull)

  // Relations
  lots Lot[]

  @@index([buildingId])
  @@index([entranceId])
}

model Lot {
  id              String    @id @default(uuid())
  projectId       String
  buildingId      String
  floorId         String?
  code            String
  type            LotType   @default(APARTMENT)
  status          LotStatus @default(AVAILABLE)
  roomsCount      Decimal?  @db.Decimal(3, 1)
  surfaceLiving   Decimal?  @db.Decimal(10, 2)
  surfaceTerrace  Decimal?  @db.Decimal(10, 2)
  surfaceBalcony  Decimal?  @db.Decimal(10, 2)
  surfaceGarden   Decimal?  @db.Decimal(10, 2)
  surfaceTotal    Decimal?  @db.Decimal(10, 2)
  priceBase       Decimal?  @db.Decimal(12, 2)
  priceExtras     Decimal?  @db.Decimal(12, 2)
  priceTotal      Decimal?  @db.Decimal(12, 2)
  orientation     String?
  hasElevator     Boolean   @default(false)
  floorLevel      Int?
  metadata        Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  project  Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  building Building @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  floor    Floor?   @relation(fields: [floorId], references: [id], onDelete: SetNull)

  // Relations
  reservations       Reservation[]
  buyers             Buyer[]
  submissionLots     SubmissionLot[]
  buyerChoices       BuyerChoice[]
  buyerInstallments  BuyerInstallment[]

  @@unique([projectId, code])
  @@index([projectId])
  @@index([buildingId])
  @@index([floorId])
  @@index([status])
  @@index([type])
}

// ============================================================================
// PARTICIPANTS (Companies, Contacts)
// ============================================================================

model Company {
  id                 String   @id @default(uuid())
  organisationId     String
  name               String
  type               String   // "EG", "NOTARY", "BROKER", "ARCHITECT", "ENGINEER", "SUPPLIER"
  registrationNumber String?
  vatNumber          String?
  address            String?
  city               String?
  postalCode         String?
  country            String   @default("CH")
  phone              String?
  email              String?
  website            String?
  logoUrl            String?
  notes              String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  organisation Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)

  // Relations
  contacts              Contact[]
  projectParticipants   ProjectParticipant[]
  reservations          Reservation[]
  buyers                Buyer[]
  contracts             Contract[]
  invoices              Invoice[]

  @@index([organisationId])
  @@index([type])
}

model Contact {
  id             String   @id @default(uuid())
  companyId      String?
  organisationId String
  firstName      String
  lastName       String
  email          String?
  phone          String?
  position       String?
  notes          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  company      Company?     @relation(fields: [companyId], references: [id], onDelete: SetNull)
  organisation Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)

  // Relations
  projectParticipants ProjectParticipant[]

  @@index([companyId])
  @@index([organisationId])
  @@index([email])
}

model ProjectParticipant {
  id        String   @id @default(uuid())
  projectId String
  companyId String
  role      String   // "OWNER", "EG", "ARCHITECT", "ENGINEER", "NOTARY", "BROKER"
  contactId String?
  joinedAt  DateTime @default(now())

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  contact Contact? @relation(fields: [contactId], references: [id], onDelete: SetNull)

  @@unique([projectId, companyId, role])
  @@index([projectId])
  @@index([companyId])
}

// ============================================================================
// CRM (Prospects, Reservations, Buyers)
// ============================================================================

model Prospect {
  id             String         @id @default(uuid())
  projectId      String
  firstName      String
  lastName       String
  email          String?
  phone          String?
  status         ProspectStatus @default(NEW)
  source         String?
  interestedLots Json?          // Array of lot IDs
  budgetMin      Decimal?       @db.Decimal(12, 2)
  budgetMax      Decimal?       @db.Decimal(12, 2)
  notes          String?
  assignedTo     String?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Relations
  reservations Reservation[]

  @@index([projectId])
  @@index([status])
  @@index([assignedTo])
  @@index([email])
}

model Reservation {
  id                   String            @id @default(uuid())
  projectId            String
  lotId                String
  prospectId           String?
  buyerFirstName       String
  buyerLastName        String
  buyerEmail           String?
  buyerPhone           String?
  status               ReservationStatus @default(PENDING)
  reservedAt           DateTime          @default(now())
  expiresAt            DateTime?
  depositAmount        Decimal?          @db.Decimal(12, 2)
  depositPaidAt        DateTime?
  brokerId             String?
  brokerCommissionRate Decimal?          @db.Decimal(5, 2)
  notes                String?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  project  Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  lot      Lot       @relation(fields: [lotId], references: [id], onDelete: Cascade)
  prospect Prospect? @relation(fields: [prospectId], references: [id], onDelete: SetNull)
  broker   Company?  @relation(fields: [brokerId], references: [id], onDelete: SetNull)

  // Relations
  buyers Buyer[]

  @@index([projectId])
  @@index([lotId])
  @@index([prospectId])
  @@index([status])
}

model Buyer {
  id              String      @id @default(uuid())
  projectId       String
  lotId           String
  reservationId   String?
  userId          String?
  firstName       String
  lastName        String
  email           String?
  phone           String?
  address         String?
  city            String?
  postalCode      String?
  country         String      @default("CH")
  birthDate       DateTime?
  nationality     String?
  isIndividual    Boolean     @default(true)
  companyName     String?
  financingType   String?     // "CASH", "MORTGAGE", "MIXED"
  bankName        String?
  notaryId        String?
  status          BuyerStatus @default(ACTIVE)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  lot         Lot          @relation(fields: [lotId], references: [id], onDelete: Cascade)
  reservation Reservation? @relation(fields: [reservationId], references: [id], onDelete: SetNull)
  notary      Company?     @relation(fields: [notaryId], references: [id], onDelete: SetNull)

  // Relations
  buyerFiles         BuyerFile[]
  buyerChoices       BuyerChoice[]
  buyerChangeRequests BuyerChangeRequest[]
  buyerInstallments   BuyerInstallment[]

  @@index([projectId])
  @@index([lotId])
  @@index([reservationId])
  @@index([userId])
  @@index([status])
}

model BuyerFile {
  id                   String   @id @default(uuid())
  buyerId              String
  name                 String
  status               String   @default("INCOMPLETE") // "INCOMPLETE", "COMPLETE", "VALIDATED"
  completionPercentage Int      @default(0)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  buyer Buyer @relation(fields: [buyerId], references: [id], onDelete: Cascade)

  @@index([buyerId])
}

// ============================================================================
// SUBMISSIONS (Appels d'offres)
// ============================================================================

model Submission {
  id          String           @id @default(uuid())
  projectId   String
  title       String
  description String?
  status      SubmissionStatus @default(DRAFT)
  openingDate DateTime?
  closingDate DateTime?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Relations
  submissionLots    SubmissionLot[]
  submissionInvites SubmissionInvite[]
  submissionOffers  SubmissionOffer[]
  adjudications     Adjudication[]

  @@index([projectId])
  @@index([status])
}

model SubmissionLot {
  id           String @id @default(uuid())
  submissionId String
  lotId        String
  description  String?
  quantity     Decimal? @db.Decimal(10, 2)
  unit         String?

  submission Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  lot        Lot        @relation(fields: [lotId], references: [id], onDelete: Cascade)

  // Relations
  submissionOfferItems SubmissionOfferItem[]

  @@unique([submissionId, lotId])
  @@index([submissionId])
  @@index([lotId])
}

model SubmissionInvite {
  id           String   @id @default(uuid())
  submissionId String
  companyId    String
  invitedAt    DateTime @default(now())
  viewedAt     DateTime?

  submission Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  @@unique([submissionId, companyId])
  @@index([submissionId])
  @@index([companyId])
}

model SubmissionOffer {
  id            String   @id @default(uuid())
  submissionId  String
  companyId     String
  totalAmount   Decimal  @db.Decimal(12, 2)
  notes         String?
  submittedAt   DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  submission Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  // Relations
  submissionOfferItems SubmissionOfferItem[]
  adjudications        Adjudication[]

  @@index([submissionId])
  @@index([companyId])
}

model SubmissionOfferItem {
  id               String  @id @default(uuid())
  submissionOfferId String
  submissionLotId  String
  unitPrice        Decimal @db.Decimal(12, 2)
  totalPrice       Decimal @db.Decimal(12, 2)
  notes            String?

  submissionOffer SubmissionOffer @relation(fields: [submissionOfferId], references: [id], onDelete: Cascade)
  submissionLot   SubmissionLot   @relation(fields: [submissionLotId], references: [id], onDelete: Cascade)

  @@index([submissionOfferId])
  @@index([submissionLotId])
}

model Adjudication {
  id                String   @id @default(uuid())
  submissionId      String
  submissionOfferId String
  awardedAt         DateTime @default(now())
  notes             String?

  submission      Submission      @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  submissionOffer SubmissionOffer @relation(fields: [submissionOfferId], references: [id], onDelete: Cascade)

  @@unique([submissionId])
  @@index([submissionId])
  @@index([submissionOfferId])
}

// ============================================================================
// FINANCE (CFC, Contracts, Invoices)
// ============================================================================

model CfcBudget {
  id          String   @id @default(uuid())
  projectId   String
  name        String
  version     String?
  totalAmount Decimal  @db.Decimal(12, 2)
  status      String   @default("DRAFT") // "DRAFT", "APPROVED", "ACTIVE", "CLOSED"
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Relations
  cfcLines CfcLine[]

  @@index([projectId])
  @@index([status])
}

model CfcLine {
  id               String  @id @default(uuid())
  budgetId         String
  code             String
  label            String
  amountBudgeted   Decimal @db.Decimal(12, 2)
  amountCommitted  Decimal @db.Decimal(12, 2) @default(0)
  amountSpent      Decimal @db.Decimal(12, 2) @default(0)
  parentId         String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  budget CfcBudget @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  parent CfcLine?  @relation("CfcLineHierarchy", fields: [parentId], references: [id])

  // Relations
  children CfcLine[] @relation("CfcLineHierarchy")
  contracts Contract[]

  @@index([budgetId])
  @@index([parentId])
}

model Contract {
  id         String   @id @default(uuid())
  projectId  String
  companyId  String
  number     String
  name       String
  type       String   // "EG", "LOT", "ARCHITECT", "ENGINEER", "NOTARY", "OTHER"
  amount     Decimal  @db.Decimal(12, 2)
  status     String   @default("DRAFT") // "DRAFT", "SIGNED", "ACTIVE", "COMPLETED", "CANCELLED"
  signedAt   DateTime?
  startDate  DateTime?
  endDate    DateTime?
  cfcLineId  String?
  documentId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  project Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  company Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  cfcLine CfcLine? @relation(fields: [cfcLineId], references: [id], onDelete: SetNull)

  // Relations
  invoices Invoice[]

  @@index([projectId])
  @@index([companyId])
  @@index([status])
}

model Invoice {
  id            String        @id @default(uuid())
  projectId     String
  contractId    String?
  companyId     String?
  invoiceNumber String
  type          String        @default("SUPPLIER") // "SUPPLIER", "BUYER_INSTALLMENT", "OTHER"
  amount        Decimal       @db.Decimal(12, 2)
  vatRate       Decimal       @db.Decimal(5, 2)
  vatAmount     Decimal       @db.Decimal(12, 2)
  totalAmount   Decimal       @db.Decimal(12, 2)
  status        InvoiceStatus @default(DRAFT)
  issuedAt      DateTime      @default(now())
  dueAt         DateTime?
  paidAt        DateTime?
  documentId    String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  project  Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  contract Contract? @relation(fields: [contractId], references: [id], onDelete: SetNull)
  company  Company?  @relation(fields: [companyId], references: [id], onDelete: SetNull)

  // Relations
  payments Payment[]

  @@index([projectId])
  @@index([contractId])
  @@index([status])
}

model Payment {
  id            String   @id @default(uuid())
  invoiceId     String
  amount        Decimal  @db.Decimal(12, 2)
  paymentDate   DateTime @default(now())
  paymentMethod String?
  reference     String?
  notes         String?
  createdAt     DateTime @default(now())

  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
}

model BuyerInstallment {
  id                String   @id @default(uuid())
  buyerId           String
  lotId             String
  installmentNumber Int
  dueDate           DateTime
  percentage        Decimal  @db.Decimal(5, 2)
  amount            Decimal  @db.Decimal(12, 2)
  status            String   @default("PENDING") // "PENDING", "PAID", "OVERDUE"
  invoiceId         String?
  paidAt            DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  buyer Buyer @relation(fields: [buyerId], references: [id], onDelete: Cascade)
  lot   Lot   @relation(fields: [lotId], references: [id], onDelete: Cascade)

  @@index([buyerId])
  @@index([lotId])
  @@index([status])
}

// ============================================================================
// DOCUMENTS
// ============================================================================

model Document {
  id             String   @id @default(uuid())
  projectId      String
  name           String
  description    String?
  category       String   @default("DOCUMENT") // "PLAN", "CONTRACT", "INVOICE", "REPORT", "PHOTO", "DOCUMENT", "OTHER"
  fileUrl        String?
  fileSize       BigInt?
  fileType       String?
  versionNumber  Int      @default(1)
  parentFolderId String?
  isFolder       Boolean  @default(false)
  tags           Json?
  uploadedBy     String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  project      Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  parentFolder Document?  @relation("DocumentHierarchy", fields: [parentFolderId], references: [id])

  // Relations
  children         Document[]        @relation("DocumentHierarchy")
  documentVersions DocumentVersion[]

  @@index([projectId])
  @@index([parentFolderId])
  @@index([uploadedBy])
}

model DocumentVersion {
  id            String   @id @default(uuid())
  documentId    String
  versionNumber Int
  fileUrl       String
  fileSize      BigInt?
  comment       String?
  createdBy     String?
  createdAt     DateTime @default(now())

  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  @@index([documentId])
}

// ============================================================================
// CHOICES (Matériaux)
// ============================================================================

model MaterialCategory {
  id          String   @id @default(uuid())
  name        String
  description String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  materialOptions MaterialOption[]
}

model MaterialOption {
  id          String  @id @default(uuid())
  categoryId  String
  name        String
  description String?
  imageUrl    String?
  price       Decimal @db.Decimal(12, 2)
  isDefault   Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category MaterialCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  // Relations
  buyerChoices BuyerChoice[]

  @@index([categoryId])
}

model BuyerChoice {
  id               String   @id @default(uuid())
  buyerId          String
  lotId            String
  materialOptionId String
  chosenAt         DateTime @default(now())

  buyer          Buyer          @relation(fields: [buyerId], references: [id], onDelete: Cascade)
  lot            Lot            @relation(fields: [lotId], references: [id], onDelete: Cascade)
  materialOption MaterialOption @relation(fields: [materialOptionId], references: [id], onDelete: Cascade)

  @@unique([buyerId, materialOptionId])
  @@index([buyerId])
  @@index([lotId])
}

model BuyerChangeRequest {
  id          String   @id @default(uuid())
  buyerId     String
  description String
  status      String   @default("PENDING") // "PENDING", "APPROVED", "REJECTED", "COMPLETED"
  requestedAt DateTime @default(now())
  approvedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  buyer Buyer @relation(fields: [buyerId], references: [id], onDelete: Cascade)

  // Relations
  buyerChangeImpacts BuyerChangeImpact[]

  @@index([buyerId])
  @@index([status])
}

model BuyerChangeImpact {
  id                   String  @id @default(uuid())
  buyerChangeRequestId String
  type                 String  // "PRICE", "DELAY", "OTHER"
  description          String
  amount               Decimal? @db.Decimal(12, 2)
  delayDays            Int?

  buyerChangeRequest BuyerChangeRequest @relation(fields: [buyerChangeRequestId], references: [id], onDelete: Cascade)

  @@index([buyerChangeRequestId])
}

// ============================================================================
// CONSTRUCTION
// ============================================================================

model ProjectPhase {
  id          String   @id @default(uuid())
  projectId   String
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Relations
  projectTasks ProjectTask[]

  @@index([projectId])
}

model ProjectTask {
  id          String   @id @default(uuid())
  phaseId     String
  name        String
  description String?
  status      String   @default("TODO") // "TODO", "IN_PROGRESS", "COMPLETED"
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  phase ProjectPhase @relation(fields: [phaseId], references: [id], onDelete: Cascade)

  @@index([phaseId])
  @@index([status])
}

// ============================================================================
// COMMUNICATION
// ============================================================================

model MessageThread {
  id          String   @id @default(uuid())
  projectId   String
  title       String
  contextType String?  // "lot", "document", "submission", "general"
  contextId   String?
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Relations
  messages Message[]

  @@index([projectId])
}

model Message {
  id          String   @id @default(uuid())
  threadId    String
  content     String
  authorId    String
  mentions    Json?    // Array of user IDs
  attachments Json?    // Array of document IDs
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  thread MessageThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  author User          @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([threadId])
  @@index([authorId])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String   // "MENTION", "MESSAGE", "TASK", "DEADLINE", "SYSTEM"
  title     String
  message   String?
  linkUrl   String?
  isRead    Boolean  @default(false)
  readAt    DateTime?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isRead])
}

// ============================================================================
// SETTINGS
// ============================================================================

model ProjectSettings {
  id                 String   @id @default(uuid())
  projectId          String   @unique
  defaultVatRate     Decimal  @db.Decimal(5, 2) @default(8.1)
  defaultLanguage    LanguageCode @default(FR)
  allowedLanguages   Json     // Array of language codes
  installmentPlanId  String?
  documentTemplates  Json?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

// ============================================================================
// BILLING (SaaS)
// ============================================================================

model Plan {
  id            String      @id @default(uuid())
  name          String
  slug          String      @unique
  description   Json        // i18n descriptions
  priceMonthly  Decimal     @db.Decimal(10, 2)
  priceYearly   Decimal     @db.Decimal(10, 2)
  currency      String      @default("CHF")
  features      Json        // Array of features
  limits        Json        // { projects_max, users_max, storage_gb }
  isActive      Boolean     @default(true)
  trialDays     Int         @default(14)
  sortOrder     Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relations
  subscriptions Subscription[]

  @@index([slug])
  @@index([isActive])
}

model Subscription {
  id                  String             @id @default(uuid())
  organisationId      String
  planId              String
  status              SubscriptionStatus @default(TRIAL)
  billingCycle        BillingCycle       @default(MONTHLY)
  currentPeriodStart  DateTime           @default(now())
  currentPeriodEnd    DateTime
  trialStart          DateTime?
  trialEnd            DateTime?
  cancelAtPeriodEnd   Boolean            @default(false)
  cancelledAt         DateTime?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  organisation Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  plan         Plan         @relation(fields: [planId], references: [id])

  // Relations
  subscriptionInvoices SubscriptionInvoice[]

  @@index([organisationId])
  @@index([planId])
  @@index([status])
}

model SubscriptionInvoice {
  id             String        @id @default(uuid())
  subscriptionId String
  organisationId String
  invoiceNumber  String        @unique
  amount         Decimal       @db.Decimal(10, 2)
  currency       String        @default("CHF")
  status         InvoiceStatus @default(DRAFT)
  issuedAt       DateTime      @default(now())
  dueAt          DateTime
  paidAt         DateTime?
  periodStart    DateTime
  periodEnd      DateTime
  pdfUrl         String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  // Relations
  datatransTransactions DatatransTransaction[]

  @@index([subscriptionId])
  @@index([organisationId])
  @@index([status])
}

model PaymentMethod {
  id              String            @id @default(uuid())
  organisationId  String
  type            PaymentMethodType
  datatransAlias  String?
  cardLast4       String?
  cardBrand       String?
  cardExpiryMonth Int?
  cardExpiryYear  Int?
  isDefault       Boolean           @default(false)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([organisationId])
}

model DatatransCustomer {
  id                   String   @id @default(uuid())
  organisationId       String   @unique
  datatransCustomerId  String   @unique
  metadata             Json?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([organisationId])
  @@index([datatransCustomerId])
}

model DatatransTransaction {
  id                      String   @id @default(uuid())
  organisationId          String
  subscriptionInvoiceId   String?
  datatransTransactionId  String   @unique
  amount                  Decimal  @db.Decimal(10, 2)
  currency                String   @default("CHF")
  status                  String   // "PENDING", "AUTHORIZED", "SETTLED", "FAILED", "CANCELLED"
  paymentMethod           String?
  errorCode               String?
  errorMessage            String?
  metadata                Json?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  subscriptionInvoice SubscriptionInvoice? @relation(fields: [subscriptionInvoiceId], references: [id])

  @@index([organisationId])
  @@index([subscriptionInvoiceId])
  @@index([datatransTransactionId])
}

model DatatransWebhookEvent {
  id         String   @id @default(uuid())
  eventId    String   @unique
  eventType  String
  payload    Json
  processed  Boolean  @default(false)
  processedAt DateTime?
  createdAt  DateTime @default(now())

  @@index([eventType])
  @@index([processed])
}

// ============================================================================
// AUDIT LOG
// ============================================================================

model AuditLog {
  id             String   @id @default(uuid())
  userId         String
  organisationId String?
  action         String   // "CREATE", "UPDATE", "DELETE", "LOGIN", etc.
  resourceType   String   // "Project", "Lot", "User", etc.
  resourceId     String?
  changes        Json?    // Old/new values
  ipAddress      String?
  userAgent      String?
  createdAt      DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([organisationId])
  @@index([resourceType])
  @@index([createdAt])
}
```

---

## 🔐 RBAC & Sécurité

### Matrice des permissions

| Rôle | Projects | Lots | CRM | Finance | Documents | Billing | Submissions |
|------|----------|------|-----|---------|-----------|---------|-------------|
| **saas_admin** | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ MANAGE | ✅ ALL |
| **org_admin** | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | 👁️ READ | ✅ ALL |
| **promoter** | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | ✅ ALL | 👁️ READ | ✅ ADJUDICATE |
| **general_contractor** | 👁️ READ | 👁️ READ | ❌ | 👁️ READ | ✅ ALL | ❌ | ✅ CREATE/READ |
| **architect** | ✏️ UPDATE | ✏️ UPDATE | ❌ | ❌ | ✅ ALL | ❌ | 👁️ READ |
| **engineer** | 👁️ READ | 👁️ READ | ❌ | ❌ | ✅ ALL | ❌ | 👁️ READ |
| **notary** | 👁️ READ | 👁️ READ | 👁️ READ | ❌ | 👁️ READ | ❌ | ❌ |
| **broker** | 👁️ READ | 👁️ READ | ✅ ALL | ❌ | 👁️ READ | ❌ | ❌ |
| **buyer** | ❌ | 👁️ OWN | ❌ | 👁️ OWN | 👁️ OWN | ❌ | ❌ |
| **supplier** | ❌ | ❌ | ❌ | ❌ | 👁️ LIMITED | ❌ | 👁️ OWN_BIDS |

---

## 🏢 Multi-tenant

### Implémentation

Toutes les requêtes sont automatiquement filtrées par `organisationId` via un middleware NestJS.

### TenantInterceptor

```typescript
// apps/api/src/common/interceptors/tenant.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Extract organisation from user token or header
    const organisationId = user?.organisationId || request.headers['x-organisation-id'];

    // Inject into request for later use
    request.organisationId = organisationId;

    return next.handle();
  }
}
```

### TenantAwarePrismaService

```typescript
// apps/api/src/infra/prisma/tenant-aware-prisma.service.ts

import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class TenantAwarePrismaService extends PrismaClient {
  constructor(@Inject(REQUEST) private readonly request: any) {
    super();

    // Auto-inject organisationId in all queries
    const organisationId = this.request.organisationId;

    if (organisationId) {
      this.$use(async (params, next) => {
        // Auto-filter by organisation for multi-tenant models
        if (this.isMultiTenantModel(params.model)) {
          if (params.action === 'findMany' || params.action === 'findFirst') {
            params.args.where = {
              ...params.args.where,
              organisationId,
            };
          }

          if (params.action === 'create' && !params.args.data.organisationId) {
            params.args.data.organisationId = organisationId;
          }
        }

        return next(params);
      });
    }
  }

  private isMultiTenantModel(model: string): boolean {
    const multiTenantModels = [
      'Project', 'Company', 'Contact', 'Document',
      // ... other tenant-scoped models
    ];
    return multiTenantModels.includes(model);
  }
}
```

---

## 🌍 i18n 4 langues

### Structure fichiers

```
apps/web/lib/i18n/
├── locales/
│   ├── fr/
│   │   ├── common.json
│   │   ├── projects.json
│   │   ├── billing.json
│   │   └── ...
│   ├── de/
│   ├── en/
│   └── it/
├── i18n-config.ts
└── use-i18n.ts
```

### Exemple traductions

```json
// fr/common.json
{
  "nav": {
    "dashboard": "Tableau de bord",
    "projects": "Projets",
    "lots": "Lots",
    "crm": "CRM",
    "billing": "Facturation"
  },
  "actions": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier"
  }
}

// de/common.json
{
  "nav": {
    "dashboard": "Dashboard",
    "projects": "Projekte",
    "lots": "Einheiten",
    "crm": "CRM",
    "billing": "Abrechnung"
  },
  "actions": {
    "save": "Speichern",
    "cancel": "Abbrechen",
    "delete": "Löschen",
    "edit": "Bearbeiten"
  }
}
```

---

## 💳 Billing Datatrans

### Flow complet

1. **Sélection plan** → User choisit Basic/Pro/Enterprise
2. **Init transaction** → `POST /billing/payment-methods/init`
3. **Datatrans Lightbox** → Saisie sécurisée (carte/TWINT)
4. **Confirmation** → `POST /billing/payment-methods/confirm`
5. **Webhook** → Datatrans notifie le succès
6. **Activation** → Subscription devient ACTIVE

### Code NestJS

```typescript
// apps/api/src/modules/billing/datatrans.service.ts

@Injectable()
export class DatatransService {
  private readonly merchantId: string;
  private readonly signKey: string;

  constructor(private readonly configService: ConfigService) {
    this.merchantId = configService.get('DATATRANS_MERCHANT_ID');
    this.signKey = configService.get('DATATRANS_SIGN_KEY');
  }

  async initializeTransaction(amount: number, currency: string) {
    // Call Datatrans API to init transaction
    const response = await axios.post(
      'https://api.sandbox.datatrans.com/v1/transactions',
      {
        amount: amount * 100, // Convert to cents
        currency,
        refno: uuidv4(),
        // ... other params
      },
      {
        auth: {
          username: this.configService.get('DATATRANS_API_USER'),
          password: this.configService.get('DATATRANS_API_PASSWORD'),
        },
      }
    );

    return {
      transactionId: response.data.transactionId,
      paymentPageUrl: `https://pay.sandbox.datatrans.com/v1/start/${response.data.transactionId}`,
    };
  }

  async handleWebhook(payload: any) {
    // Verify signature
    // Update transaction status
    // Activate subscription if payment successful
  }
}
```

---

## 📅 Roadmap produit

### MVP (3-4 mois)

**Must-have** :
- ✅ Identity & RBAC complet
- ✅ Projects, Buildings, Lots
- ✅ CRM basique (prospects, réservations)
- ✅ Documents (upload, liste)
- ✅ Communication (messages)
- ✅ Billing SaaS (Datatrans)
- ✅ i18n FR/EN

**Risques** :
- Intégration Datatrans → Tests approfondis en sandbox
- Performance RLS Prisma → Optimisation index

### V1 (6-9 mois)

**Must-have** :
- Module submissions complet
- Finance CFC avancée
- Dossiers notaire
- Choix matériaux acquéreurs
- Reporting avancé
- i18n DE/IT

### V2 (12+ mois)

- Intégrations externes (compta, CRM)
- Analytics produit
- App mobile (React Native)
- IA prédictive

---

**Ce document sert de guide architectural complet. L'implémentation complète nécessiterait des milliers de lignes de code supplémentaires.**
