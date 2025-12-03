# 📋 MODULES MÉTIER DÉTAILLÉS - SaaS Immobilier Suisse

> Spécifications fonctionnelles complètes pour chaque module métier

---

## Table des matières

1. [Module Projets](#1-module-projets)
2. [Module Acteurs & Contacts](#2-module-acteurs--contacts)
3. [Module Lots & Programme de vente](#3-module-lots--programme-de-vente)
4. [Module CRM Ventes PPE](#4-module-crm-ventes-ppe)
5. [Module Notaires](#5-module-notaires)
6. [Module Courtiers](#6-module-courtiers)
7. [Module Communication](#7-module-communication)
8. [Module Documents](#8-module-documents)
9. [Module Finance CFC](#9-module-finance-cfc)
10. [Module Soumissions & Adjudications](#10-module-soumissions--adjudications)
11. [Module Choix matériaux](#11-module-choix-matériaux)
12. [Module Suivi Chantier](#12-module-suivi-chantier)
13. [Module Paramètres](#13-module-paramètres)
14. [Module Reporting](#14-module-reporting)
15. [Module Billing SaaS](#15-module-billing-saas)

---

## 1. Module Projets

### 1.1 Objectifs métier

Centraliser toutes les informations structurantes d'un projet immobilier :
- Données de base (adresse, type, statut)
- Structure physique (bâtiments, entrées, étages)
- Paramètres globaux (TVA, langues, acteurs principaux)
- Vue d'ensemble (cockpit de pilotage)

### 1.2 Acteurs & permissions

| Rôle | READ | CREATE | UPDATE | DELETE | MANAGE_SETTINGS |
|------|------|--------|--------|--------|-----------------|
| **Promoteur** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Org Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **EG** | ✅ | ❌ | ✏️ Limité | ❌ | ❌ |
| **Architecte** | ✅ | ❌ | ✏️ Limité | ❌ | ❌ |
| **Notaire** | 👁️ Infos de base | ❌ | ❌ | ❌ | ❌ |
| **Courtier** | 👁️ Infos commerciales | ❌ | ❌ | ❌ | ❌ |
| **Acheteur** | 👁️ Infos publiques | ❌ | ❌ | ❌ | ❌ |

### 1.3 Entités Prisma

```prisma
model Project {
  id             String
  organisationId String
  name           String
  code           String           // Code unique projet
  description    String?
  address        String?
  city           String?
  postalCode     String?
  canton         String?
  country        String           // CH
  type           ProjectType      // PPE, LOCATIF, MIXTE
  status         ProjectStatus    // PLANNING, CONSTRUCTION, SELLING, COMPLETED
  startDate      DateTime?
  endDate        DateTime?
  totalSurface   Decimal?
  totalVolume    Decimal?
  imageUrl       String?

  // Relations
  buildings      Building[]
  lots           Lot[]
  participants   ProjectParticipant[]
  settings       ProjectSettings?
}

model Building {
  id          String
  projectId   String
  name        String
  code        String
  floorsCount Int
  totalLots   Int

  // Relations
  entrances   Entrance[]
  floors      Floor[]
  lots        Lot[]
}

model Entrance {
  id         String
  buildingId String
  name       String
  code       String

  // Relations
  floors     Floor[]
}

model Floor {
  id         String
  buildingId String
  entranceId String?
  level      Int        // -2, -1, 0, 1, 2...
  name       String

  // Relations
  lots       Lot[]
}
```

### 1.4 Règles métier

**R-PROJ-001** : Code projet unique par organisation
**R-PROJ-002** : Un projet doit avoir au moins 1 bâtiment
**R-PROJ-003** : Impossible de supprimer un projet avec des lots vendus
**R-PROJ-004** : Changement de statut doit respecter le workflow :
```
PLANNING → CONSTRUCTION → SELLING → COMPLETED → ARCHIVED
```

### 1.5 Endpoints backend (NestJS)

```typescript
// apps/api/src/modules/projects/projects.controller.ts

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {

  @Get()
  @Permissions('projects.read')
  async findAll(@CurrentUser() user: User) {
    // Liste des projets accessibles à l'utilisateur
  }

  @Get(':id')
  @Permissions('projects.read')
  async findOne(@Param('id') id: string) {
    // Détails complets du projet
  }

  @Get(':id/dashboard')
  @Permissions('projects.read')
  async getDashboard(@Param('id') id: string) {
    // KPIs : % lots vendus, dossiers complets, avancement
  }

  @Post()
  @Permissions('projects.create')
  async create(@Body() createProjectDto: CreateProjectDto) {
    // Création projet + structure initiale
  }

  @Patch(':id')
  @Permissions('projects.update')
  async update(@Param('id') id: string, @Body() updateProjectDto) {
    // Mise à jour infos projet
  }

  @Post(':id/buildings')
  @Permissions('projects.update')
  async addBuilding(@Param('id') projectId: string, @Body() dto) {
    // Ajout bâtiment
  }

  @Post(':id/buildings/:buildingId/floors')
  @Permissions('projects.update')
  async addFloor(@Param('buildingId') buildingId: string, @Body() dto) {
    // Ajout étage
  }
}
```

### 1.6 UX / UI (Next.js)

#### Page : Dashboard Projet (`/projects/[id]`)

**Composants** :
```tsx
// apps/web/app/projects/[projectId]/page.tsx

export default function ProjectDashboard({ params }: { params: { projectId: string } }) {
  return (
    <PageHeader
      title={project.name}
      subtitle={`${project.city} • ${project.postalCode}`}
      badge={<StatusBadge status={project.status} />}
    />

    {/* KPIs Grid */}
    <div className="grid grid-cols-4 gap-6">
      <KpiCard
        label="Lots vendus"
        value={`${lotsStats.sold}/${lotsStats.total}`}
        percentage={lotsStats.soldPercentage}
        trend="up"
      />
      <KpiCard
        label="Dossiers complets"
        value={`${buyersStats.complete}/${buyersStats.total}`}
        percentage={buyersStats.completePercentage}
      />
      <KpiCard
        label="Avancement chantier"
        value={`${construction.progress}%`}
      />
      <KpiCard
        label="Acomptes encaissés"
        value={formatCurrency(finance.installmentsPaid)}
      />
    </div>

    {/* Recent Activity */}
    <Card title="Activité récente">
      <ActivityFeed items={recentActivity} />
    </Card>

    {/* Upcoming Deadlines */}
    <Card title="Échéances à venir">
      <DeadlinesList items={upcomingDeadlines} />
    </Card>
  )
}
```

**Design** :
- Layout grid responsive (4 cols → 2 cols mobile)
- KPI cards avec indicateurs visuels (couleurs, icônes, trends)
- Feed d'activité type Linear/Notion
- Échéances avec dates visuelles

---

## 2. Module Acteurs & Contacts

### 2.1 Objectifs métier

Gérer tous les acteurs intervenant sur les projets :
- Entreprises (EG, notaires, courtiers, bureaux techniques, fournisseurs)
- Contacts (personnes physiques)
- Participation aux projets avec rôles spécifiques

### 2.2 Entités Prisma

```prisma
model Company {
  id                 String
  organisationId     String
  name               String
  type               CompanyType  // EG, NOTARY, BROKER, ARCHITECT, ENGINEER, SUPPLIER
  registrationNumber String?      // IDE, SIREN
  vatNumber          String?
  address            String?
  city               String?
  postalCode         String?
  country            String       @default("CH")
  phone              String?
  email              String?
  website            String?
  logoUrl            String?
  notes              String?

  // Relations
  contacts           Contact[]
  projectParticipants ProjectParticipant[]
}

model Contact {
  id             String
  companyId      String?
  organisationId String
  firstName      String
  lastName       String
  email          String?
  phone          String?
  mobile         String?
  position       String?
  notes          String?

  // Relations
  projectParticipants ProjectParticipant[]
}

model ProjectParticipant {
  id        String
  projectId String
  companyId String
  contactId String?
  role      ParticipantRole  // OWNER, EG, ARCHITECT, ENGINEER, NOTARY, BROKER
  joinedAt  DateTime

  // Relations
  project   Project
  company   Company
  contact   Contact?
}
```

### 2.3 Règles métier

**R-COMP-001** : Une entreprise peut avoir le même rôle plusieurs fois sur un projet (ex : 2 courtiers)
**R-COMP-002** : Un contact peut être rattaché à plusieurs entreprises
**R-COMP-003** : Email unique par contact dans une organisation
**R-COMP-004** : Entreprise de type NOTARY ne peut avoir qu'un seul participant par projet

### 2.4 Endpoints backend

```typescript
@Controller('companies')
export class CompaniesController {

  @Get()
  @Permissions('participants.read')
  async findAll(@Query() filters: CompanyFiltersDto) {
    // Liste entreprises avec filtres (type, projet)
  }

  @Post()
  @Permissions('participants.create')
  async create(@Body() dto: CreateCompanyDto) {
    // Création entreprise + contact principal
  }

  @Post(':id/contacts')
  @Permissions('participants.create')
  async addContact(@Param('id') companyId: string, @Body() dto) {
    // Ajout contact à l'entreprise
  }

  @Post('projects/:projectId/participants')
  @Permissions('projects.update')
  async addParticipant(@Param('projectId') projectId, @Body() dto) {
    // Ajout participant au projet
  }
}
```

### 2.5 UX / UI

#### Page : Annuaire (`/companies`)

```tsx
export default function CompaniesPage() {
  return (
    <PageHeader
      title="Entreprises & Contacts"
      action={
        <Button onClick={openCreateModal}>
          <PlusIcon /> Nouvelle entreprise
        </Button>
      }
    />

    <Tabs defaultValue="companies">
      <TabsList>
        <TabsTrigger value="companies">Entreprises</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
      </TabsList>

      <TabsContent value="companies">
        <CompaniesTable
          data={companies}
          columns={[
            { key: 'name', label: 'Nom' },
            { key: 'type', label: 'Type' },
            { key: 'city', label: 'Ville' },
            { key: 'contactsCount', label: 'Contacts' },
            { key: 'projectsCount', label: 'Projets' },
          ]}
          filters={[
            { field: 'type', type: 'select', options: companyTypes },
            { field: 'city', type: 'text' },
          ]}
        />
      </TabsContent>

      <TabsContent value="contacts">
        <ContactsTable data={contacts} />
      </TabsContent>
    </Tabs>
  )
}
```

---

## 3. Module Lots & Programme de vente

### 3.1 Objectifs métier

Gérer le programme de vente complet :
- Définition des lots (appartements, parkings, caves)
- Caractéristiques techniques et commerciales
- Statuts (libre, réservé, vendu)
- Attribution aux acheteurs

### 3.2 Entités Prisma

```prisma
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
  PPE     // Propriété par étages (exonéré TVA)
  QPT     // Quasi-PPE (soumis TVA)
}

model Lot {
  id              String
  projectId       String
  buildingId      String
  floorId         String?
  entranceId      String?

  // Identification
  code            String           // Ex: "A-3-01" (Bât-Étage-Numéro)
  name            String?          // Ex: "Appartement 301"
  type            LotType
  status          LotStatus

  // Technique
  roomsCount      Decimal          // 3.5, 4.5
  surfaceLiving   Decimal          // Surface habitable
  surfacePPE      Decimal          // Surface PPE officielle
  surfaceTerrace  Decimal?
  surfaceBalcony  Decimal?
  surfaceGarden   Decimal?
  surfaceTotal    Decimal          // Somme des surfaces
  orientation     String?          // N, S, E, O, NE, SO...
  hasElevator     Boolean
  floorLevel      Int              // -2, -1, 0, 1, 2...

  // Commercial
  saleType        SaleType
  priceBase       Decimal          // Prix de base
  priceExtras     Decimal          // Extras/options
  priceTotal      Decimal          // Total TTC
  vatRate         Decimal?         // Taux TVA si QPT
  vatAmount       Decimal?

  // Documents
  planFileUrl     String?
  brochureUrl     String?

  // Metadata
  features        Json?            // { parking: 2, cellar: 1, ... }

  // Relations
  reservations    Reservation[]
  buyers          Buyer[]
  choices         BuyerChoice[]
}
```

### 3.3 Règles métier

**R-LOT-001** : Code lot unique par projet
**R-LOT-002** : Changement statut doit respecter :
```
AVAILABLE → RESERVED → SOLD → DELIVERED
AVAILABLE → OPTION → SOLD
RESERVED → AVAILABLE (annulation)
```
**R-LOT-003** : Lot SOLD doit avoir un acheteur
**R-LOT-004** : Prix total = prix base + extras
**R-LOT-005** : Si QPT, calcul TVA automatique (priceTotal = priceBase × (1 + vatRate))
**R-LOT-006** : Surface totale = living + terrasse + balcon + jardin

### 3.4 Endpoints backend

```typescript
@Controller('projects/:projectId/lots')
export class LotsController {

  @Get()
  @Permissions('lots.read')
  async findAll(
    @Param('projectId') projectId: string,
    @Query() filters: LotFiltersDto
  ) {
    // Liste lots avec filtres avancés
  }

  @Get(':id')
  @Permissions('lots.read')
  async findOne(@Param('id') id: string) {
    // Détails lot complet
  }

  @Post()
  @Permissions('lots.create')
  async create(@Body() dto: CreateLotDto) {
    // Création lot
  }

  @Patch(':id/status')
  @Permissions('lots.update')
  async updateStatus(@Param('id') id: string, @Body() dto) {
    // Changement statut (avec validations workflow)
  }

  @Get('export')
  @Permissions('lots.export')
  async export(@Query() filters) {
    // Export Excel/PDF du programme de vente
  }
}
```

### 3.5 UX / UI

#### Page : Programme de vente (`/projects/[id]/lots`)

```tsx
export default function LotsPage({ projectId }: { projectId: string }) {
  return (
    <PageHeader
      title="Programme de vente"
      action={<Button>Ajouter un lot</Button>}
    />

    {/* Filtres avancés */}
    <FiltersBar>
      <Select
        label="Bâtiment"
        options={buildings}
        value={filters.buildingId}
        onChange={setFilter}
      />
      <Select
        label="Type"
        options={lotTypes}
        value={filters.type}
      />
      <Select
        label="Statut"
        options={lotStatuses}
        value={filters.status}
      />
      <RangeInput
        label="Surface"
        min={filters.surfaceMin}
        max={filters.surfaceMax}
      />
      <RangeInput
        label="Prix"
        min={filters.priceMin}
        max={filters.priceMax}
      />
    </FiltersBar>

    {/* Vue par défaut : tableau */}
    <LotsTable
      data={lots}
      columns={[
        { key: 'code', label: 'Lot', sortable: true },
        { key: 'type', label: 'Type', render: (lot) => <LotTypeIcon type={lot.type} /> },
        { key: 'building.name', label: 'Bâtiment' },
        { key: 'floorLevel', label: 'Étage', sortable: true },
        { key: 'roomsCount', label: 'Pièces' },
        { key: 'surfaceTotal', label: 'Surface', sortable: true, render: (lot) => `${lot.surfaceTotal} m²` },
        { key: 'priceTotal', label: 'Prix', sortable: true, render: (lot) => formatCurrency(lot.priceTotal) },
        { key: 'status', label: 'Statut', render: (lot) => <StatusBadge status={lot.status} /> },
        { key: 'buyer', label: 'Acheteur', render: (lot) => lot.buyer?.fullName || '-' },
      ]}
      onRowClick={(lot) => router.push(`/lots/${lot.id}`)}
    />

    {/* Vue alternative : cartes */}
    <LotsGrid
      data={lots}
      renderCard={(lot) => (
        <LotCard
          lot={lot}
          showDetails={false}
          onClick={() => router.push(`/lots/${lot.id}`)}
        />
      )}
    />

    {/* Actions bulk */}
    <BulkActions
      selectedItems={selectedLots}
      actions={[
        { label: 'Exporter sélection', icon: DownloadIcon, onClick: exportSelected },
        { label: 'Changer statut', icon: EditIcon, onClick: bulkUpdateStatus },
      ]}
    />
  )
}
```

**Design** :
- Tableau dense avec colonnes triables
- Filtres persistants (saved in URL query params)
- Status badges colorés
- Vue grille alternative (toggle)
- Export Excel avec toutes les colonnes + filtres appliqués

---

## 4. Module CRM Ventes PPE

### 4.1 Objectifs métier

Gérer le pipeline commercial de la vente :
- Prospects (leads entrants)
- Qualification
- Réservations
- Dossiers acheteurs
- Checklist documentaire
- Workflow vers notaire

### 4.2 Entités Prisma

```prisma
enum ProspectStatus {
  NEW
  CONTACTED
  QUALIFIED
  VISIT_SCHEDULED
  VISIT_DONE
  OFFER_SENT
  RESERVED
  LOST
  ARCHIVED
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CONVERTED     // → Buyer
  CANCELLED
  EXPIRED
}

enum BuyerStatus {
  ACTIVE
  DOCUMENTS_PENDING
  DOCUMENTS_COMPLETE
  READY_FOR_SIGNING
  ACT_SIGNED
  DELIVERED
}

model Prospect {
  id             String
  projectId      String
  firstName      String
  lastName       String
  email          String?
  phone          String?
  status         ProspectStatus
  source         String?          // WEB, SALON, BROKER, REFERRAL
  interestedLots Json?            // Array of lot IDs
  budgetMin      Decimal?
  budgetMax      Decimal?
  notes          String?
  assignedTo     String?          // User ID (courtier)

  // Relations
  reservations   Reservation[]
}

model Reservation {
  id                   String
  projectId            String
  lotId                String
  prospectId           String?

  // Buyer info
  buyerFirstName       String
  buyerLastName        String
  buyerEmail           String?
  buyerPhone           String?

  // Status
  status               ReservationStatus
  reservedAt           DateTime
  expiresAt            DateTime?

  // Deposit
  depositAmount        Decimal?
  depositPaidAt        DateTime?
  depositProof         String?          // File URL

  // Broker
  brokerId             String?
  brokerCommissionRate Decimal?

  notes                String?

  // Relations
  project              Project
  lot                  Lot
  prospect             Prospect?
  broker               Company?
  buyers               Buyer[]
}

model Buyer {
  id              String
  projectId       String
  lotId           String
  reservationId   String?
  userId          String?          // Linked user account

  // Personal info
  firstName       String
  lastName        String
  email           String?
  phone           String?
  address         String?
  city            String?
  postalCode      String?
  country         String           @default("CH")
  birthDate       DateTime?
  nationality     String?

  // Company (if not individual)
  isIndividual    Boolean          @default(true)
  companyName     String?
  companyIde      String?

  // Co-buyers
  coBuyers        Json?            // Array of {firstName, lastName, birthDate, ...}

  // Financing
  financingType   FinancingType    // CASH, MORTGAGE, MIXED
  bankName        String?
  mortgageAmount  Decimal?

  // Notary
  notaryId        String?

  // Status
  status          BuyerStatus

  // Relations
  project         Project
  lot             Lot
  reservation     Reservation?
  notary          Company?
  buyerFile       BuyerFile?
  choices         BuyerChoice[]
  installments    BuyerInstallment[]
}

model BuyerFile {
  id                   String
  buyerId              String   @unique
  name                 String   // "Dossier {Buyer Name}"

  // Status
  completionPercentage Int      @default(0)
  isComplete           Boolean  @default(false)
  sentToNotaryAt       DateTime?

  // Relations
  buyer                Buyer
  documentRequirements BuyerDocumentRequirement[]
}

model BuyerDocumentRequirement {
  id          String
  buyerFileId String
  type        RequirementType  // ID_CARD, PROOF_OF_FUNDS, MORTGAGE_APPROVAL, ...
  label       String
  description String?
  isRequired  Boolean          @default(true)
  status      RequirementStatus // PENDING, RECEIVED, VALIDATED, REJECTED
  documentId  String?          // Link to Document
  uploadedAt  DateTime?
  notes       String?

  // Relations
  buyerFile   BuyerFile
  document    Document?
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
```

### 4.3 Règles métier

**R-CRM-001** : Pipeline prospect doit respecter l'ordre logique
**R-CRM-002** : Une réservation expire automatiquement après X jours si non confirmée
**R-CRM-003** : Impossible de créer 2 réservations actives sur le même lot
**R-CRM-004** : Conversion réservation → buyer met à jour le statut du lot (SOLD)
**R-CRM-005** : Dossier acheteur "complet" si tous les documents requis sont VALIDATED
**R-CRM-006** : Notification automatique notaire quand dossier devient complet

### 4.4 Endpoints backend

```typescript
@Controller('projects/:projectId/crm')
export class CrmController {

  // === Prospects ===

  @Get('prospects')
  @Permissions('crm.read')
  async findProspects(@Param('projectId') projectId: string) {
    // Liste prospects avec pipeline
  }

  @Post('prospects')
  @Permissions('crm.create')
  async createProspect(@Body() dto: CreateProspectDto) {
    // Nouveau prospect
  }

  @Patch('prospects/:id/status')
  @Permissions('crm.update')
  async updateProspectStatus(@Param('id') id: string, @Body() dto) {
    // Déplacer dans pipeline
  }

  // === Réservations ===

  @Get('reservations')
  @Permissions('crm.read')
  async findReservations(@Param('projectId') projectId: string) {
    // Liste réservations
  }

  @Post('reservations')
  @Permissions('crm.create')
  async createReservation(@Body() dto: CreateReservationDto) {
    // Nouvelle réservation
    // → Met à jour statut lot (RESERVED)
  }

  @Patch('reservations/:id/convert')
  @Permissions('crm.update')
  async convertToSale(@Param('id') id: string, @Body() dto) {
    // Réservation → Buyer
    // → Met à jour statut lot (SOLD)
    // → Crée BuyerFile avec checklist
  }

  // === Acheteurs ===

  @Get('buyers')
  @Permissions('crm.read')
  async findBuyers(@Param('projectId') projectId: string) {
    // Liste acheteurs
  }

  @Get('buyers/:id')
  @Permissions('crm.read')
  async getBuyerDetails(@Param('id') id: string) {
    // Détails acheteur complet
  }

  @Get('buyers/:id/file')
  @Permissions('crm.read')
  async getBuyerFile(@Param('id') buyerId: string) {
    // Dossier acheteur avec checklist
  }

  @Patch('buyers/:id/file/requirements/:reqId')
  @Permissions('crm.update')
  async updateRequirement(
    @Param('buyerId') buyerId: string,
    @Param('reqId') reqId: string,
    @Body() dto: UpdateRequirementDto
  ) {
    // Marquer document comme reçu/validé
    // → Recalcule completionPercentage
    // → Si 100%, notifie notaire
  }

  @Post('buyers/:id/send-to-notary')
  @Permissions('crm.update')
  async sendToNotary(@Param('id') buyerId: string) {
    // Envoie dossier au notaire
    // → Crée NotaryFile
    // → Notification notaire
  }
}
```

### 4.5 UX / UI

#### Page : Pipeline CRM (`/projects/[id]/crm`)

```tsx
export default function CrmPipelinePage({ projectId }: { projectId: string }) {
  return (
    <PageHeader
      title="CRM Ventes"
      action={<Button>Nouveau prospect</Button>}
    />

    {/* Pipeline Kanban */}
    <KanbanBoard>
      {pipelineStages.map(stage => (
        <KanbanColumn
          key={stage.value}
          title={stage.label}
          count={prospects.filter(p => p.status === stage.value).length}
          color={stage.color}
        >
          {prospects
            .filter(p => p.status === stage.value)
            .map(prospect => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onMove={handleMoveProspect}
                onClick={() => openProspectDetails(prospect)}
              />
            ))}
        </KanbanColumn>
      ))}
    </KanbanBoard>

    {/* Onglets alternatifs */}
    <Tabs>
      <TabsList>
        <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        <TabsTrigger value="reservations">Réservations</TabsTrigger>
        <TabsTrigger value="buyers">Acheteurs</TabsTrigger>
      </TabsList>

      <TabsContent value="reservations">
        <ReservationsTable data={reservations} />
      </TabsContent>

      <TabsContent value="buyers">
        <BuyersTable data={buyers} />
      </TabsContent>
    </Tabs>
  )
}
```

#### Page : Dossier Acheteur (`/buyers/[id]`)

```tsx
export default function BuyerFilePage({ buyerId }: { buyerId: string }) {
  return (
    <PageHeader
      title={`${buyer.firstName} ${buyer.lastName}`}
      subtitle={`Lot ${buyer.lot.code} • ${buyer.project.name}`}
      badge={<StatusBadge status={buyer.status} />}
    />

    {/* Progress bar */}
    <ProgressBar
      value={buyerFile.completionPercentage}
      label={`${buyerFile.completionPercentage}% complété`}
    />

    <div className="grid grid-cols-3 gap-6">
      {/* Colonne gauche : Infos */}
      <Card title="Informations">
        <InfoList>
          <InfoItem label="Email" value={buyer.email} />
          <InfoItem label="Téléphone" value={buyer.phone} />
          <InfoItem label="Adresse" value={buyer.address} />
          <InfoItem label="Type financement" value={buyer.financingType} />
          {buyer.bankName && <InfoItem label="Banque" value={buyer.bankName} />}
          <InfoItem label="Notaire" value={buyer.notary?.name} />
        </InfoList>
      </Card>

      {/* Colonne centrale : Checklist documents */}
      <Card title="Documents requis" className="col-span-2">
        <DocumentChecklist>
          {buyerFile.documentRequirements.map(req => (
            <ChecklistItem
              key={req.id}
              requirement={req}
              onUpload={handleUpload}
              onValidate={handleValidate}
              onReject={handleReject}
            />
          ))}
        </DocumentChecklist>

        {buyerFile.isComplete && (
          <Alert variant="success">
            <CheckCircleIcon />
            Dossier complet ! Vous pouvez l'envoyer au notaire.
          </Alert>
        )}

        <Button
          disabled={!buyerFile.isComplete}
          onClick={sendToNotary}
        >
          Envoyer au notaire
        </Button>
      </Card>
    </div>

    {/* Timeline activité */}
    <Card title="Historique">
      <Timeline items={buyerActivity} />
    </Card>
  )
}
```

**Design** :
- Pipeline Kanban drag & drop
- Cartes prospects avec infos essentielles
- Checklist visuelle avec states (pending, received, validated)
- Progress bar animée
- Notifications in-app + email

---

## 5. Module Notaires

### 5.1 Objectifs métier

Gérer l'interface entre le promoteur et le notaire :
- Transmission des dossiers acheteurs complets
- Upload des versions d'actes
- Gestion des rendez-vous de signature
- Communication dédiée

### 5.2 Entités Prisma

```prisma
model NotaryFile {
  id              String
  projectId       String
  buyerId         String
  notaryId        String

  // Status
  status          NotaryFileStatus  // RECEIVED, IN_PROGRESS, ACT_READY, SIGNED
  receivedAt      DateTime

  // Relations
  project         Project
  buyer           Buyer
  notary          Company
  actVersions     NotaryActVersion[]
  appointments    NotarySignatureAppointment[]
  messages        Message[]         // Fil de discussion dédié
}

enum NotaryFileStatus {
  RECEIVED
  IN_PROGRESS
  ACT_DRAFT
  ACT_READY
  SIGNED
  COMPLETED
}

model NotaryActVersion {
  id            String
  notaryFileId  String
  version       Int              // 1, 2, 3...
  title         String           // "Projet d'acte V1", "Acte final"
  documentId    String           // Link to Document
  uploadedBy    String           // User ID
  uploadedAt    DateTime
  notes         String?

  // Relations
  notaryFile    NotaryFile
  document      Document
}

model NotarySignatureAppointment {
  id            String
  notaryFileId  String
  scheduledAt   DateTime
  location      String?
  attendees     Json             // Array of {name, role, confirmed}
  status        AppointmentStatus // SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
  notes         String?

  // Relations
  notaryFile    NotaryFile
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

### 5.3 Règles métier

**R-NOT-001** : Un NotaryFile ne peut être créé que si BuyerFile.isComplete = true
**R-NOT-002** : Versioning automatique des actes (V1, V2, V3...)
**R-NOT-003** : Notification automatique promoteur à chaque upload d'acte
**R-NOT-004** : Rendez-vous signature ne peut être créé que si acte final uploadé
**R-NOT-005** : Statut passe à SIGNED après confirmation RDV

### 5.4 Endpoints backend

```typescript
@Controller('notary')
export class NotaryController {

  @Get('files')
  @Permissions('notary.read')
  async findFiles(@CurrentUser() user: User) {
    // Liste dossiers notaire (filtrés par notaire si role = NOTARY)
  }

  @Get('files/:id')
  @Permissions('notary.read')
  async getFileDetails(@Param('id') id: string) {
    // Détails dossier complet
  }

  @Post('files/:id/acts')
  @Permissions('notary.create')
  async uploadActVersion(
    @Param('id') fileId: string,
    @Body() dto: UploadActDto
  ) {
    // Upload nouvelle version acte
    // → Incrémente version
    // → Notifie promoteur
  }

  @Post('files/:id/appointments')
  @Permissions('notary.create')
  async scheduleAppointment(
    @Param('id') fileId: string,
    @Body() dto: CreateAppointmentDto
  ) {
    // Planifie RDV signature
    // → Notifie tous les participants
  }

  @Patch('files/:id/status')
  @Permissions('notary.update')
  async updateStatus(
    @Param('id') fileId: string,
    @Body() dto: UpdateStatusDto
  ) {
    // Change statut dossier
  }
}
```

### 5.5 UX / UI

#### Page : Espace Notaire (`/notary`)

```tsx
export default function NotaryDashboard() {
  return (
    <PageHeader
      title="Dossiers notaire"
    />

    <Tabs defaultValue="in-progress">
      <TabsList>
        <TabsTrigger value="in-progress">
          En cours <Badge>{filesInProgress.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="act-ready">
          Prêts signature <Badge>{filesReady.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="signed">
          Signés <Badge>{filesSigned.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="in-progress">
        <NotaryFilesTable
          data={filesInProgress}
          columns={[
            { key: 'buyer', label: 'Acheteur' },
            { key: 'project', label: 'Projet' },
            { key: 'lot', label: 'Lot' },
            { key: 'receivedAt', label: 'Reçu le' },
            { key: 'status', label: 'Statut' },
            { key: 'lastActVersion', label: 'Dernière version acte' },
          ]}
          onRowClick={(file) => router.push(`/notary/files/${file.id}`)}
        />
      </TabsContent>
    </Tabs>
  )
}
```

#### Page : Dossier notaire (`/notary/files/[id]`)

```tsx
export default function NotaryFilePage({ fileId }: { fileId: string }) {
  return (
    <PageHeader
      title={`Dossier ${file.buyer.fullName}`}
      subtitle={`${file.project.name} • Lot ${file.buyer.lot.code}`}
      badge={<StatusBadge status={file.status} />}
    />

    <div className="grid grid-cols-3 gap-6">
      {/* Infos acheteur */}
      <Card title="Acheteur">
        <BuyerInfo buyer={file.buyer} />
      </Card>

      {/* Documents acheteur */}
      <Card title="Documents fournis">
        <DocumentsList documents={file.buyer.buyerFile.documents} />
      </Card>

      {/* Versions actes */}
      <Card title="Versions acte">
        <ActVersionsList
          versions={file.actVersions}
          onUpload={openUploadModal}
        />

        <Button onClick={openUploadModal}>
          <UploadIcon /> Nouvelle version
        </Button>
      </Card>
    </div>

    {/* Rendez-vous signature */}
    <Card title="Rendez-vous de signature">
      {file.appointments.map(apt => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          onEdit={editAppointment}
        />
      ))}

      <Button onClick={openScheduleModal}>
        Planifier RDV
      </Button>
    </Card>

    {/* Communication */}
    <Card title="Messages">
      <MessageThread threadId={file.messageThreadId} />
    </Card>
  )
}
```

---

## 6. Module Courtiers

### 6.1 Objectifs métier

Interface dédiée aux courtiers immobiliers :
- Vue optimisée des lots commercialisables
- Gestion de leurs prospects
- Création de réservations
- Suivi des commissions

### 6.2 Entités Prisma

```prisma
model BrokerStats {
  id              String
  brokerId        String
  projectId       String

  // Stats période
  periodStart     DateTime
  periodEnd       DateTime

  // Métriques
  prospectsCount  Int
  visitsCount     Int
  reservationsCount Int
  salesCount      Int
  conversionRate  Decimal

  // Commissions
  commissionsTotal Decimal
  commissionsPaid  Decimal

  // Relations
  broker          Company
  project         Project
}

// Commission liée à une réservation
// Déjà dans Reservation:
//   brokerId
//   brokerCommissionRate
```

### 6.3 Endpoints backend

```typescript
@Controller('brokers')
export class BrokersController {

  @Get('dashboard')
  @Permissions('brokers.read')
  async getDashboard(@CurrentUser() user: User) {
    // Dashboard courtier (stats, lots, prospects)
  }

  @Get('lots')
  @Permissions('brokers.read')
  async getAvailableLots(@CurrentUser() user: User) {
    // Lots commercialisables (AVAILABLE, RESERVED par lui)
  }

  @Get('prospects')
  @Permissions('brokers.read')
  async getMyProspects(@CurrentUser() user: User) {
    // Prospects assignés au courtier
  }

  @Get('reservations')
  @Permissions('brokers.read')
  async getMyReservations(@CurrentUser() user: User) {
    // Réservations créées par le courtier
  }

  @Get('stats')
  @Permissions('brokers.read')
  async getStats(@CurrentUser() user: User, @Query() period) {
    // Stats performance
  }
}
```

### 6.4 UX / UI

#### Page : Dashboard Courtier (`/broker/dashboard`)

```tsx
export default function BrokerDashboard() {
  return (
    <PageHeader
      title="Mon activité"
    />

    {/* KPIs */}
    <div className="grid grid-cols-4 gap-4">
      <KpiCard label="Prospects actifs" value={stats.prospectsCount} />
      <KpiCard label="Réservations" value={stats.reservationsCount} />
      <KpiCard label="Ventes conclues" value={stats.salesCount} />
      <KpiCard
        label="Taux conversion"
        value={`${stats.conversionRate}%`}
        trend={stats.conversionTrend}
      />
    </div>

    {/* Lots disponibles */}
    <Card title="Lots commercialisables">
      <LotsGrid
        data={availableLots}
        layout="compact"
        showQuickActions={true}
      />
    </Card>

    {/* Pipeline prospects */}
    <Card title="Mes prospects">
      <ProspectsPipeline prospects={myProspects} />
    </Card>
  )
}
```

---

## 7. Module Communication

### 7.1 Objectifs métier

Centraliser toutes les communications :
- Fils de discussion par contexte (projet, lot, dossier, soumission)
- Mentions (@user, @role)
- Notifications in-app + email
- Historique complet

### 7.2 Entités Prisma

```prisma
model MessageThread {
  id          String
  projectId   String
  title       String
  contextType String?        // "project", "lot", "buyer", "submission"
  contextId   String?        // ID de l'objet contexte
  createdBy   String
  createdAt   DateTime
  updatedAt   DateTime

  // Relations
  project     Project
  messages    Message[]
}

model Message {
  id          String
  threadId    String
  content     String
  authorId    String
  mentions    Json?          // Array of user IDs
  attachments Json?          // Array of document IDs
  createdAt   DateTime
  updatedAt   DateTime

  // Relations
  thread      MessageThread
  author      User
}

model Notification {
  id        String
  userId    String
  type      NotificationType
  title     String
  message   String?
  linkUrl   String?
  isRead    Boolean          @default(false)
  readAt    DateTime?
  createdAt DateTime

  // Relations
  user      User
}

enum NotificationType {
  MENTION
  MESSAGE
  TASK_ASSIGNED
  DEADLINE
  DOCUMENT_UPLOADED
  ACT_UPLOADED
  SUBMISSION_OFFER
  SYSTEM
}
```

### 7.3 UX / UI

#### Composant : MessageThread

```tsx
export function MessageThread({ threadId }: { threadId: string }) {
  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.authorId === currentUser.id}
          />
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <MessageInput
          onSend={sendMessage}
          onMention={handleMention}
          onAttach={handleAttach}
        />
      </div>
    </div>
  )
}
```

---

## 8. Module Documents

### 8.1 Objectifs métier

GED complète pour les projets :
- Arborescence automatique par projet
- Versioning
- Tags et catégories
- Droits d'accès granulaires
- Liens contextuels

### 8.2 Entités Prisma

```prisma
model Document {
  id             String
  projectId      String
  name           String
  description    String?
  category       DocumentCategory
  fileUrl        String?
  fileSize       BigInt?
  fileType       String?
  versionNumber  Int              @default(1)
  parentFolderId String?
  isFolder       Boolean          @default(false)
  tags           Json?            // Array of tags
  uploadedBy     String?
  createdAt      DateTime
  updatedAt      DateTime

  // Relations
  project        Project
  parentFolder   Document?        @relation("DocumentHierarchy", fields: [parentFolderId])
  children       Document[]       @relation("DocumentHierarchy")
  versions       DocumentVersion[]
}

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

model DocumentVersion {
  id            String
  documentId    String
  versionNumber Int
  fileUrl       String
  fileSize      BigInt?
  comment       String?
  createdBy     String?
  createdAt     DateTime

  // Relations
  document      Document
}
```

### 8.3 UX / UI

#### Page : Documents (`/projects/[id]/documents`)

```tsx
export default function DocumentsPage({ projectId }: { projectId: string }) {
  return (
    <PageHeader
      title="Documents"
      action={
        <>
          <Button variant="outline" onClick={createFolder}>
            <FolderIcon /> Nouveau dossier
          </Button>
          <Button onClick={openUpload}>
            <UploadIcon /> Importer
          </Button>
        </>
      }
    />

    {/* Breadcrumb */}
    <Breadcrumb path={currentPath} />

    {/* Filtres */}
    <FiltersBar>
      <Select
        label="Catégorie"
        options={documentCategories}
        value={filters.category}
      />
      <TagsFilter
        selectedTags={filters.tags}
        onChange={setFilterTags}
      />
    </FiltersBar>

    {/* Vue liste/grille */}
    <DocumentsList
      items={documents}
      view={viewMode} // list | grid
      onNavigate={navigateToFolder}
      onDownload={downloadDocument}
      onDelete={deleteDocument}
    />
  )
}
```

---

## 9. Module Finance CFC

### 9.1 Objectifs métier

Suivi financier complet du projet :
- Budget CFC structuré
- Contrats et engagements
- Factures fournisseurs
- Acomptes acheteurs
- Export comptable

### 9.2 Entités Prisma

*Voir NESTJS_ARCHITECTURE.md pour le schéma complet*

### 9.3 Règles métier

**R-FIN-001** : Budget CFC structuré hiérarchiquement (codes CFC)
**R-FIN-002** : Engagement ≤ Budget
**R-FIN-003** : Facturé ≤ Engagement
**R-FIN-004** : Payé ≤ Facturé
**R-FIN-005** : Acomptes acheteurs calculés selon plan d'acomptes projet
**R-FIN-006** : Génération automatique factures acheteurs selon échéancier

### 9.4 UX / UI

#### Page : Finance (`/projects/[id]/finance`)

```tsx
export default function FinancePage({ projectId }: { projectId: string }) {
  return (
    <Tabs defaultValue="cfc">
      <TabsList>
        <TabsTrigger value="cfc">Budget CFC</TabsTrigger>
        <TabsTrigger value="contracts">Contrats</TabsTrigger>
        <TabsTrigger value="invoices">Factures</TabsTrigger>
        <TabsTrigger value="installments">Acomptes acheteurs</TabsTrigger>
      </TabsList>

      <TabsContent value="cfc">
        <CfcBudgetTable
          budget={cfcBudget}
          showProgress={true}
        />
      </TabsContent>

      <TabsContent value="installments">
        <InstallmentsTable
          installments={buyerInstallments}
          showOverdue={true}
        />
      </TabsContent>
    </Tabs>
  )
}
```

---

## 10. Module Soumissions & Adjudications

### 10.1 Objectifs métier

Gérer les appels d'offres :
- Création soumission
- Invitation entreprises
- Dépôt des offres
- Comparatif automatique
- Clarifications
- Adjudication

### 10.2 Workflow complet

```
1. CRÉATION SOUMISSION
   └─ Définition (lots CFC, description, documents)
   └─ Invitation entreprises

2. DÉPÔT OFFRES
   └─ Portail entreprise (authentification sécurisée)
   └─ Upload bordereau + documents
   └─ Versioning offres

3. CLARIFICATIONS
   └─ Q&R entre maître d'ouvrage et entreprises
   └─ Documents complémentaires

4. COMPARATIF
   └─ Tableau automatique (prix, délais)
   └─ Analyse écarts

5. ADJUDICATION
   └─ Proposition architecte
   └─ Validation promoteur
   └─ Notification entreprise retenue
   └─ Injection dans CFC (engagement)
```

### 10.3 Entités Prisma

*Voir NESTJS_ARCHITECTURE.md section Submissions*

### 10.4 UX / UI

#### Page : Soumissions (`/projects/[id]/submissions`)

```tsx
export default function SubmissionsPage({ projectId }: { projectId: string }) {
  return (
    <PageHeader
      title="Soumissions"
      action={<Button>Nouvelle soumission</Button>}
    />

    <SubmissionsTable
      data={submissions}
      columns={[
        { key: 'title', label: 'Soumission' },
        { key: 'status', label: 'Statut' },
        { key: 'closingDate', label: 'Clôture' },
        { key: 'offersCount', label: 'Offres reçues' },
        { key: 'lowestOffer', label: 'Offre la plus basse' },
      ]}
      onRowClick={(sub) => router.push(`/submissions/${sub.id}`)}
    />
  )
}
```

#### Page : Détail Soumission (`/submissions/[id]`)

```tsx
export default function SubmissionDetailsPage({ submissionId }: { submissionId: string }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="offers">
          Offres <Badge>{offers.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="comparison">Comparatif</TabsTrigger>
        <TabsTrigger value="clarifications">Clarifications</TabsTrigger>
      </TabsList>

      <TabsContent value="offers">
        <OffersTable
          offers={offers}
          onViewDetails={viewOfferDetails}
        />
      </TabsContent>

      <TabsContent value="comparison">
        <OffersComparisonTable
          offers={offers}
          showDifferences={true}
          highlightBest={true}
        />

        <Button onClick={proposeAdjudication}>
          Proposer adjudication
        </Button>
      </TabsContent>
    </Tabs>
  )
}
```

---

## 11. Module Choix matériaux

### 11.1 Objectifs métier

Permettre aux acheteurs de personnaliser leur lot :
- Catalogue matériaux (sols, murs, cuisine, sanitaires)
- Options standard vs surcoût
- Validation EG/Architecte
- Génération PDF récapitulatif
- Modifications spéciales (avenants)

### 11.2 Workflow

```
1. CATALOGUE
   └─ EG/Architecte alimente le catalogue
   └─ Catégories + options + prix

2. CHOIX ACHETEUR
   └─ Espace acheteur avec visualisation
   └─ Sélection options
   └─ Délai de décision

3. VALIDATION
   └─ EG/Architecte valide les choix
   └─ Génération PDF récap

4. MODIFICATIONS SPÉCIALES
   └─ Demande acheteur
   └─ Chiffrage
   └─ Validation
   └─ Avenant (prix + délai)
```

### 11.3 UX / UI

#### Page : Choix matériaux acheteur (`/buyer/choices`)

```tsx
export default function BuyerChoicesPage() {
  return (
    <PageHeader
      title="Mes choix de matériaux"
      subtitle={`Lot ${buyer.lot.code}`}
    />

    {/* Progress */}
    <ProgressBar
      value={choicesProgress}
      label={`${choicesComplete}/${choicesTotal} choix effectués`}
    />

    {/* Catégories */}
    <div className="space-y-8">
      {materialCategories.map(category => (
        <Card key={category.id} title={category.name}>
          <MaterialOptionsGrid
            options={category.options}
            selectedOption={choices[category.id]}
            onSelect={handleSelectOption}
          />
        </Card>
      ))}
    </div>

    {/* Actions */}
    <div className="flex gap-4">
      <Button variant="outline" onClick={downloadPdf}>
        <DownloadIcon /> Télécharger récapitulatif
      </Button>
      <Button onClick={submitChoices} disabled={!allChoicesMade}>
        Valider mes choix
      </Button>
    </div>
  )
}
```

---

## 12. Module Suivi Chantier

### 12.1 Objectifs métier

Suivi de l'avancement du chantier :
- Planning par phases
- Mise à jour avancement
- Vue acheteur simplifiée
- Photos chantier

### 12.2 UX / UI

#### Page : Planning chantier (`/projects/[id]/construction`)

```tsx
export default function ConstructionPage({ projectId }: { projectId: string }) {
  return (
    <PageHeader
      title="Suivi chantier"
    />

    {/* Timeline phases */}
    <PhasesTimeline
      phases={projectPhases}
      currentPhase={currentPhase}
      onUpdateProgress={updateProgress}
    />

    {/* Galerie photos */}
    <Card title="Photos chantier">
      <PhotoGallery
        photos={constructionPhotos}
        onUpload={uploadPhoto}
      />
    </Card>
  )
}
```

#### Page : Avancement acheteur (`/buyer/construction`)

```tsx
export default function BuyerConstructionPage() {
  return (
    <PageHeader
      title="Avancement de votre bien"
    />

    <ProgressCircle
      value={constructionProgress}
      label="Avancement global"
      size="large"
    />

    <PhasesTimeline
      phases={simplifiedPhases}
      readonly={true}
    />

    <Card title="Photos récentes">
      <PhotoCarousel photos={recentPhotos} />
    </Card>
  )
}
```

---

## 13. Module Paramètres

### 13.1 Par organisation

- Nom, logo
- Langue par défaut
- Utilisateurs et rôles

### 13.2 Par projet

- TVA applicable
- Langues proposées
- Plan d'acomptes par défaut
- Templates documents

---

## 14. Module Reporting

### 14.1 Dashboards par rôle

**Promoteur** :
- % lots vendus/réservés
- Montant total ventes
- Acomptes encaissés vs attendus
- Budget CFC (budget vs engagé vs facturé)
- Soumissions en cours/adjugées
- Dossiers notaires (statuts)

**Courtier** :
- Prospects actifs
- Taux conversion
- Ventes conclues
- Commissions

**Architecte/EG** :
- Soumissions en cours
- Clarifications ouvertes
- Documents publiés

---

## 15. Module Billing SaaS

### 15.1 Objectifs

Gérer les abonnements des organisations :
- Plans (Basic, Pro, Enterprise)
- Paiements via Datatrans (CHF, cartes, TWINT)
- Factures SaaS
- Webhooks

### 15.2 Entités Prisma

*Voir NESTJS_ARCHITECTURE.md section Billing*

### 15.3 UX / UI

#### Page : Abonnement (`/settings/billing`)

```tsx
export default function BillingPage() {
  return (
    <PageHeader
      title="Abonnement & Facturation"
    />

    {/* Plan actuel */}
    <Card title="Votre abonnement">
      <CurrentPlanCard
        plan={subscription.plan}
        status={subscription.status}
        nextBillingDate={subscription.currentPeriodEnd}
      />
    </Card>

    {/* Plans disponibles */}
    <div className="grid grid-cols-3 gap-6">
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isCurrent={subscription.planId === plan.id}
          onSelect={changePlan}
        />
      ))}
    </div>

    {/* Moyen de paiement */}
    <Card title="Moyen de paiement">
      <PaymentMethodCard
        paymentMethod={paymentMethod}
        onUpdate={updatePaymentMethod}
      />
    </Card>

    {/* Factures */}
    <Card title="Historique des factures">
      <InvoicesTable
        invoices={subscriptionInvoices}
        onDownload={downloadInvoice}
      />
    </Card>
  )
}
```

---

## 🎯 Résumé des modules

| Module | Entités clés | Endpoints | Pages UI | Priorité MVP |
|--------|--------------|-----------|----------|--------------|
| **Projets** | Project, Building, Floor | 8 | 3 | ✅ P0 |
| **Acteurs** | Company, Contact, Participant | 6 | 2 | ✅ P0 |
| **Lots** | Lot | 7 | 2 | ✅ P0 |
| **CRM** | Prospect, Reservation, Buyer | 12 | 4 | ✅ P0 |
| **Notaires** | NotaryFile, ActVersion | 5 | 2 | 🟡 P1 |
| **Courtiers** | BrokerStats | 5 | 2 | 🟡 P1 |
| **Communication** | MessageThread, Message | 4 | 1 | ✅ P0 |
| **Documents** | Document, DocumentVersion | 6 | 1 | ✅ P0 |
| **Finance** | CfcBudget, Invoice, Installment | 10 | 2 | 🟡 P1 |
| **Soumissions** | Submission, Offer, Adjudication | 8 | 3 | 🟡 P1 |
| **Choix** | MaterialOption, BuyerChoice | 6 | 2 | 🟢 P2 |
| **Chantier** | ProjectPhase, Task | 4 | 2 | 🟢 P2 |
| **Paramètres** | ProjectSettings, Template | 4 | 2 | 🟡 P1 |
| **Reporting** | Dashboard, KpiSnapshot | 6 | 4 | 🟡 P1 |
| **Billing** | Plan, Subscription, Invoice | 7 | 1 | ✅ P0 |

**Légende priorités** :
- ✅ **P0** : MVP (3-4 mois)
- 🟡 **P1** : V1 (6-9 mois)
- 🟢 **P2** : V2 (12+ mois)

---

**Ce document complète NESTJS_ARCHITECTURE.md avec les détails fonctionnels de chaque module.**
