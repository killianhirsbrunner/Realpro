# 🎯 VUES 360° - Vision complète par entité

> Vues unifiées permettant au développeur immobilier de piloter tous les aspects par Projet, Entreprise, Lot, ou Acheteur

---

## Table des matières

1. [Principe des vues 360°](#1-principe-des-vues-360)
2. [Vue 360° Projet](#2-vue-360-projet)
3. [Vue 360° Entreprise](#3-vue-360-entreprise)
4. [Vue 360° Lot](#4-vue-360-lot)
5. [Vue 360° Acheteur](#5-vue-360-acheteur)
6. [Vue 360° Contrat](#6-vue-360-contrat)
7. [Vues transversales](#7-vues-transversales)

---

## 1. Principe des vues 360°

### 1.1 Objectif

Permettre au **développeur immobilier** (chef d'orchestre) de disposer d'une **vision complète et unifiée** de chaque entité métier avec tous ses liens, activités et flux.

### 1.2 Entités principales

| Entité | Description | Liens |
|--------|-------------|-------|
| **Projet** | Projet immobilier complet | Lots, Intervenants, Contrats, CFC, Documents, Communications |
| **Entreprise** | Acteur externe (EG, notaire, etc.) | Projets, Mandats, Contrats, Soumissions, Factures, Paiements |
| **Lot** | Unité immobilière (appartement, parking) | Projet, Acheteur, Technique, Finance, Communication |
| **Acheteur** | Client final (PPE/QPT) | Lot(s), Dossier, Documents, Actes, Finances, Choix |
| **Contrat** | Engagement contractuel | Entreprise, Projet, CFC, Avenants, Situations, Factures |

### 1.3 Architecture technique

**Pattern API** :
```typescript
// Inclusion profonde via Prisma
GET /projects/:id?include=all

// Retourne:
{
  project: { ...données },
  buildings: [...],
  lots: [...],
  participants: [...],
  contracts: [...],
  submissions: [...],
  cfcBudget: { cfcLines: [...] },
  documents: [...],
  messageThreads: [...]
}
```

**Cache stratégique** :
- Vues 360° volumineuses → Cache Redis (TTL 5min)
- Invalidation cache sur modifications critiques

---

## 2. Vue 360° Projet

### 2.1 URL & Navigation

**URL** : `/projects/:id`

**Fil d'Ariane** : `Projets / Villa Lac Léman`

### 2.2 Structure de la page

```tsx
<ProjectView360 projectId={projectId}>
  {/* Header avec contexte */}
  <PageHeader
    title={project.name}
    subtitle={`${project.city} • ${project.postalCode} • ${project.canton}`}
    badge={<ProjectStatusBadge status={project.status} />}
    actions={
      <>
        <Button variant="outline" onClick={openSettings}>
          <SettingsIcon /> Paramètres
        </Button>
        <Button onClick={openProjectMenu}>
          <MoreIcon />
        </Button>
      </>
    }
  />

  {/* KPIs globaux */}
  <Section title="Indicateurs clés">
    <KpiGrid cols={5}>
      <KpiCard
        icon={<BuildingIcon />}
        label="Lots"
        value={`${lotsStats.total} lots`}
        subtitle={`${lotsStats.sold} vendus (${lotsStats.soldPercentage}%)`}
        trend={lotsStats.trend}
      />

      <KpiCard
        icon={<UsersIcon />}
        label="Acheteurs"
        value={`${buyersStats.total} dossiers`}
        subtitle={`${buyersStats.complete} complets`}
      />

      <KpiCard
        icon={<CoinsIcon />}
        label="CA Prévisionnel"
        value={formatCurrency(financeStats.expectedRevenue)}
        subtitle={`${financeStats.installmentsPaidPercentage}% encaissé`}
      />

      <KpiCard
        icon={<TrendingUpIcon />}
        label="Budget CFC"
        value={formatCurrency(cfcStats.budget)}
        subtitle={`${cfcStats.committedPercentage}% engagé`}
      />

      <KpiCard
        icon={<CalendarIcon />}
        label="Avancement"
        value={`${constructionStats.progress}%`}
        subtitle={constructionStats.currentPhase}
      />
    </KpiGrid>
  </Section>

  {/* Navigation par onglets */}
  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
      <TabsTrigger value="structure">Structure & Lots</TabsTrigger>
      <TabsTrigger value="participants">Intervenants</TabsTrigger>
      <TabsTrigger value="contracts">Contrats</TabsTrigger>
      <TabsTrigger value="finance">Finances & CFC</TabsTrigger>
      <TabsTrigger value="crm">CRM & Ventes</TabsTrigger>
      <TabsTrigger value="submissions">Soumissions</TabsTrigger>
      <TabsTrigger value="construction">Chantier</TabsTrigger>
      <TabsTrigger value="documents">Documents</TabsTrigger>
      <TabsTrigger value="communication">Communication</TabsTrigger>
    </TabsList>

    <TabsContent value="overview">
      <ProjectOverview />
    </TabsContent>

    <TabsContent value="structure">
      <ProjectStructure />
    </TabsContent>

    <TabsContent value="participants">
      <ProjectParticipants />
    </TabsContent>

    <TabsContent value="contracts">
      <ProjectContracts />
    </TabsContent>

    <TabsContent value="finance">
      <ProjectFinance />
    </TabsContent>

    <TabsContent value="crm">
      <ProjectCRM />
    </TabsContent>

    <TabsContent value="submissions">
      <ProjectSubmissions />
    </TabsContent>

    <TabsContent value="construction">
      <ProjectConstruction />
    </TabsContent>

    <TabsContent value="documents">
      <ProjectDocuments />
    </TabsContent>

    <TabsContent value="communication">
      <ProjectCommunication />
    </TabsContent>
  </Tabs>
</ProjectView360>
```

### 2.3 Onglet "Vue d'ensemble"

**Contenu** :
```tsx
<ProjectOverview project={project}>
  {/* Activité récente */}
  <Card title="Activité récente">
    <ActivityFeed>
      {recentActivity.map(activity => (
        <ActivityItem
          key={activity.id}
          type={activity.type}
          icon={getActivityIcon(activity.type)}
          title={activity.title}
          subtitle={activity.subtitle}
          timestamp={activity.timestamp}
          onClick={() => navigateToActivity(activity)}
        />
      ))}
    </ActivityFeed>
  </Card>

  {/* Alertes & Échéances */}
  <Card title="Alertes & Échéances">
    <AlertsList>
      {alerts.map(alert => (
        <AlertItem
          key={alert.id}
          severity={alert.severity}
          title={alert.title}
          dueDate={alert.dueDate}
          onClick={() => handleAlert(alert)}
        />
      ))}
    </AlertsList>
  </Card>

  {/* Timeline projet */}
  <Card title="Timeline">
    <ProjectTimeline
      phases={projectPhases}
      currentPhase={currentPhase}
      milestones={milestones}
    />
  </Card>

  {/* Graphiques */}
  <div className="grid grid-cols-2 gap-6">
    <Card title="Ventes par mois">
      <SalesChart data={salesByMonth} />
    </Card>

    <Card title="Budget CFC">
      <CfcProgressChart data={cfcProgress} />
    </Card>
  </div>
</ProjectOverview>
```

**Exemples d'activités récentes** :
- 📝 Nouvelle réservation : Lot A-3-01 par Jean Martin
- ✅ Dossier acheteur complet : Marie Dupont
- 📄 Nouvel acte notaire : Lot B-2-05 (V2)
- 💰 Facture payée : EG - Situation #3 - 250'000 CHF
- 🏗️ Avancement chantier : Gros œuvre terminé

**Alertes & Échéances** :
- ⚠️ Acompte acheteur en retard (J+7) : Lot A-3-01
- 📅 Signature acte programmée : 15 déc 2025 - Lot B-2-05
- 📬 Clôture soumission électricité : 20 déc 2025
- 🏗️ Deadline choix matériaux : Lot A-3-01 - 25 déc 2025

### 2.4 Onglet "Intervenants"

**Contenu** :
```tsx
<ProjectParticipants project={project}>
  {/* Filtres par rôle */}
  <FiltersBar>
    <Select
      label="Type"
      options={participantTypes}
      value={filters.type}
    />
  </FiltersBar>

  {/* Table intervenants */}
  <ParticipantsTable
    data={participants}
    columns={[
      { key: 'company.name', label: 'Entreprise' },
      { key: 'role', label: 'Rôle' },
      { key: 'contact', label: 'Contact principal' },
      { key: 'contractsCount', label: 'Contrats' },
      { key: 'submissionsCount', label: 'Soumissions' },
      { key: 'invoicesCount', label: 'Factures' }
    ]}
    onRowClick={(participant) => navigateToCompany(participant.companyId)}
  />

  {/* Actions */}
  <Button onClick={addParticipant}>
    <PlusIcon /> Ajouter intervenant
  </Button>
</ProjectParticipants>
```

**Vue synthétique par rôle** :
```tsx
<ParticipantsByRole>
  <RoleGroup label="Notaires" count={1}>
    <CompanyCard company={notary} />
  </RoleGroup>

  <RoleGroup label="Entreprise Générale" count={1}>
    <CompanyCard company={eg} />
  </RoleGroup>

  <RoleGroup label="Architectes" count={2}>
    <CompanyCard company={architect1} />
    <CompanyCard company={architect2} />
  </RoleGroup>

  <RoleGroup label="Sous-traitants" count={12}>
    {subcontractors.map(company => (
      <CompanyCard key={company.id} company={company} />
    ))}
  </RoleGroup>
</ParticipantsByRole>
```

### 2.5 Onglet "Contrats"

**Contenu** :
```tsx
<ProjectContracts project={project}>
  {/* Stats contrats */}
  <StatsGrid>
    <StatCard
      label="Contrats actifs"
      value={contracts.filter(c => c.status === 'ACTIVE').length}
    />
    <StatCard
      label="Montant total contractuel"
      value={formatCurrency(totalContractAmount)}
    />
    <StatCard
      label="Facturé à ce jour"
      value={formatCurrency(totalInvoiced)}
    />
    <StatCard
      label="En attente paiement"
      value={formatCurrency(totalPending)}
    />
  </StatsGrid>

  {/* Filtres */}
  <FiltersBar>
    <Select label="Type" options={contractTypes} />
    <Select label="Statut" options={contractStatuses} />
  </FiltersBar>

  {/* Table contrats */}
  <ContractsTable
    data={contracts}
    columns={[
      { key: 'number', label: 'N° Contrat' },
      { key: 'company.name', label: 'Entreprise' },
      { key: 'type', label: 'Type' },
      { key: 'amountRevised', label: 'Montant', render: formatCurrency },
      { key: 'amountInvoiced', label: 'Facturé', render: formatCurrency },
      { key: 'amountPaid', label: 'Payé', render: formatCurrency },
      { key: 'status', label: 'Statut', render: (c) => <StatusBadge status={c.status} /> }
    ]}
    onRowClick={(contract) => navigateToContract(contract.id)}
  />
</ProjectContracts>
```

### 2.6 Onglet "Finances & CFC"

**Contenu** :
```tsx
<ProjectFinance project={project}>
  {/* Vue globale */}
  <Card title="Budget global">
    <CfcSummary>
      <ProgressBar
        segments={[
          { label: 'Engagé', value: cfcSummary.committed, color: 'blue' },
          { label: 'Facturé', value: cfcSummary.spent, color: 'amber' },
          { label: 'Payé', value: cfcSummary.paid, color: 'green' }
        ]}
        total={cfcSummary.budget}
      />

      <StatsGrid>
        <StatCard label="Budget" value={formatCurrency(cfcSummary.budget)} />
        <StatCard
          label="Engagé"
          value={formatCurrency(cfcSummary.committed)}
          percentage={(cfcSummary.committed / cfcSummary.budget) * 100}
        />
        <StatCard
          label="Facturé"
          value={formatCurrency(cfcSummary.spent)}
          percentage={(cfcSummary.spent / cfcSummary.budget) * 100}
        />
        <StatCard
          label="Payé"
          value={formatCurrency(cfcSummary.paid)}
          percentage={(cfcSummary.paid / cfcSummary.budget) * 100}
        />
      </StatsGrid>
    </CfcSummary>
  </Card>

  {/* Arbre CFC */}
  <Card title="Détail CFC">
    <CfcTreeTable
      data={cfcLines}
      expandable={true}
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'label', label: 'Libellé' },
        { key: 'budget', label: 'Budget', render: formatCurrency },
        { key: 'committed', label: 'Engagé', render: formatCurrency },
        { key: 'spent', label: 'Facturé', render: formatCurrency },
        { key: 'paid', label: 'Payé', render: formatCurrency },
        { key: 'remaining', label: 'Reste', render: formatCurrency }
      ]}
      onRowClick={(cfcLine) => navigateToCfcDetail(cfcLine.id)}
    />
  </Card>

  {/* Acomptes acheteurs */}
  <Card title="Acomptes acheteurs">
    <InstallmentsOverview>
      <StatCard label="Total attendu" value={formatCurrency(installmentsTotal)} />
      <StatCard label="Facturé" value={formatCurrency(installmentsInvoiced)} />
      <StatCard label="Encaissé" value={formatCurrency(installmentsPaid)} />
      <StatCard label="En retard" value={overdueCount} severity="error" />
    </InstallmentsOverview>

    <InstallmentsTable
      data={installments}
      showOverdue={true}
      onRowClick={(inst) => navigateToBuyer(inst.buyerId)}
    />
  </Card>
</ProjectFinance>
```

---

## 3. Vue 360° Entreprise

### 3.1 URL & Navigation

**URL** : `/companies/:id`

**Fil d'Ariane** : `Entreprises / Entreprise Générale SA`

### 3.2 Structure de la page

```tsx
<CompanyView360 companyId={companyId}>
  {/* Header */}
  <PageHeader
    title={company.name}
    subtitle={
      <>
        <CompanyTypeBadge type={company.type} />
        {company.city && ` • ${company.city}`}
      </>
    }
    image={company.logoUrl}
    actions={
      <>
        <Button variant="outline" onClick={editCompany}>
          <EditIcon /> Modifier
        </Button>
        <Button onClick={openCompanyMenu}>
          <MoreIcon />
        </Button>
      </>
    }
  />

  {/* Infos de base */}
  <Card title="Informations">
    <InfoGrid>
      <InfoItem label="Type" value={company.type} />
      <InfoItem label="IDE/SIREN" value={company.registrationNumber} />
      <InfoItem label="TVA" value={company.vatNumber} />
      <InfoItem label="Email" value={company.email} />
      <InfoItem label="Téléphone" value={company.phone} />
      <InfoItem label="Site web" value={company.website} link={true} />
    </InfoGrid>
  </Card>

  {/* KPIs */}
  <KpiGrid cols={4}>
    <KpiCard
      label="Projets"
      value={company.projects.length}
      subtitle={`${activeProjects.length} actifs`}
    />
    <KpiCard
      label="Contrats"
      value={company.contracts.length}
      subtitle={`${formatCurrency(totalContractAmount)} total`}
    />
    <KpiCard
      label="Factures"
      value={company.invoices.length}
      subtitle={`${pendingInvoices.length} en attente`}
    />
    <KpiCard
      label="Paiements reçus"
      value={formatCurrency(totalPaid)}
    />
  </KpiGrid>

  {/* Tabs */}
  <Tabs defaultValue="projects">
    <TabsList>
      <TabsTrigger value="projects">Projets ({company.projects.length})</TabsTrigger>
      <TabsTrigger value="contracts">Contrats ({company.contracts.length})</TabsTrigger>
      <TabsTrigger value="submissions">Soumissions ({company.submissions.length})</TabsTrigger>
      <TabsTrigger value="invoices">Factures ({company.invoices.length})</TabsTrigger>
      <TabsTrigger value="payments">Paiements ({company.payments.length})</TabsTrigger>
      <TabsTrigger value="contacts">Contacts ({company.contacts.length})</TabsTrigger>
      <TabsTrigger value="history">Historique</TabsTrigger>
    </TabsList>

    <TabsContent value="projects">
      <CompanyProjects />
    </TabsContent>

    <TabsContent value="contracts">
      <CompanyContracts />
    </TabsContent>

    <TabsContent value="submissions">
      <CompanySubmissions />
    </TabsContent>

    <TabsContent value="invoices">
      <CompanyInvoices />
    </TabsContent>

    <TabsContent value="payments">
      <CompanyPayments />
    </TabsContent>

    <TabsContent value="contacts">
      <CompanyContacts />
    </TabsContent>

    <TabsContent value="history">
      <CompanyHistory />
    </TabsContent>
  </Tabs>
</CompanyView360>
```

### 3.3 Onglet "Projets"

**Contenu** :
```tsx
<CompanyProjects company={company}>
  <ProjectsTable
    data={company.projects}
    columns={[
      { key: 'name', label: 'Projet' },
      { key: 'role', label: 'Rôle' },
      { key: 'contractsCount', label: 'Contrats' },
      { key: 'contractAmount', label: 'Montant contractuel', render: formatCurrency },
      { key: 'invoiced', label: 'Facturé', render: formatCurrency },
      { key: 'status', label: 'Statut', render: (p) => <ProjectStatusBadge status={p.status} /> }
    ]}
    onRowClick={(project) => navigateToProject(project.id)}
  />
</CompanyProjects>
```

### 3.4 Onglet "Contrats"

**Tableau détaillé de tous les contrats** :
```tsx
<CompanyContracts company={company}>
  <ContractsTable
    data={company.contracts}
    columns={[
      { key: 'number', label: 'N° Contrat' },
      { key: 'project.name', label: 'Projet' },
      { key: 'type', label: 'Type' },
      { key: 'amountRevised', label: 'Montant', render: formatCurrency },
      { key: 'amountInvoiced', label: 'Facturé', render: formatCurrency },
      { key: 'amountPaid', label: 'Payé', render: formatCurrency },
      { key: 'progressPercentage', label: 'Avancement', render: (c) => <ProgressBar value={c.progressPercentage} /> },
      { key: 'status', label: 'Statut' }
    ]}
    onRowClick={(contract) => navigateToContract(contract.id)}
  />
</CompanyContracts>
```

### 3.5 Onglet "Factures"

**Vue consolidée de toutes les factures** :
```tsx
<CompanyInvoices company={company}>
  {/* Stats */}
  <StatsGrid>
    <StatCard label="Total facturé" value={formatCurrency(totalInvoiced)} />
    <StatCard label="Payé" value={formatCurrency(totalPaid)} />
    <StatCard label="En attente" value={formatCurrency(totalPending)} />
    <StatCard label="En retard" value={overdueCount} severity="error" />
  </StatsGrid>

  {/* Filtres */}
  <FiltersBar>
    <Select label="Projet" options={projects} />
    <Select label="Statut" options={invoiceStatuses} />
    <DateRangePicker label="Période" />
  </FiltersBar>

  {/* Table */}
  <InvoicesTable
    data={company.invoices}
    columns={[
      { key: 'invoiceNumber', label: 'N° Facture' },
      { key: 'invoiceDate', label: 'Date', render: formatDate },
      { key: 'project.name', label: 'Projet' },
      { key: 'contract.number', label: 'Contrat' },
      { key: 'amountTTC', label: 'Montant TTC', render: formatCurrency },
      { key: 'amountPaid', label: 'Payé', render: formatCurrency },
      { key: 'status', label: 'Statut', render: (inv) => <InvoiceStatusBadge status={inv.status} /> }
    ]}
    onRowClick={(invoice) => navigateToInvoice(invoice.id)}
  />
</CompanyInvoices>
```

---

## 4. Vue 360° Lot

### 4.1 URL & Navigation

**URL** : `/lots/:id`

**Fil d'Ariane** : `Projets / Villa Lac Léman / Lots / A-3-01`

### 4.2 Structure de la page

```tsx
<LotView360 lotId={lotId}>
  {/* Header */}
  <PageHeader
    title={`Lot ${lot.code}`}
    subtitle={
      <>
        {lot.project.name} • {lot.building.name} • Étage {lot.floorLevel}
      </>
    }
    badge={<LotStatusBadge status={lot.status} />}
    image={lot.planFileUrl}
    actions={
      <>
        <Button variant="outline" onClick={editLot}>
          <EditIcon /> Modifier
        </Button>
        <Button onClick={openLotMenu}>
          <MoreIcon />
        </Button>
      </>
    }
  />

  {/* Infos rapides */}
  <QuickInfoGrid>
    <InfoCard icon={<HomeIcon />} label="Type" value={lot.type} />
    <InfoCard icon={<SquareIcon />} label="Surface" value={`${lot.surfaceTotal} m²`} />
    <InfoCard icon={<CoinsIcon />} label="Prix" value={formatCurrency(lot.priceTotal)} />
    <InfoCard icon={<BedIcon />} label="Pièces" value={`${lot.roomsCount} pièces`} />
    <InfoCard icon={<CompassIcon />} label="Orientation" value={lot.orientation} />
  </QuickInfoGrid>

  {/* Tabs */}
  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
      <TabsTrigger value="technical">Caractéristiques</TabsTrigger>
      <TabsTrigger value="buyer">Acheteur</TabsTrigger>
      <TabsTrigger value="finance">Finances</TabsTrigger>
      <TabsTrigger value="choices">Choix matériaux</TabsTrigger>
      <TabsTrigger value="modifications">Modifications</TabsTrigger>
      <TabsTrigger value="documents">Documents</TabsTrigger>
      <TabsTrigger value="communication">Messages</TabsTrigger>
    </TabsList>

    <TabsContent value="overview">
      <LotOverview />
    </TabsContent>

    <TabsContent value="technical">
      <LotTechnical />
    </TabsContent>

    <TabsContent value="buyer">
      <LotBuyer />
    </TabsContent>

    <TabsContent value="finance">
      <LotFinance />
    </TabsContent>

    <TabsContent value="choices">
      <LotChoices />
    </TabsContent>

    <TabsContent value="modifications">
      <LotModifications />
    </TabsContent>

    <TabsContent value="documents">
      <LotDocuments />
    </TabsContent>

    <TabsContent value="communication">
      <LotCommunication />
    </TabsContent>
  </Tabs>
</LotView360>
```

### 4.3 Onglet "Acheteur"

**Contenu** (si lot vendu) :
```tsx
<LotBuyer lot={lot} buyer={lot.buyer}>
  {/* Infos acheteur */}
  <Card title="Acheteur">
    <BuyerCard buyer={buyer}>
      <Avatar src={buyer.avatarUrl} name={buyer.fullName} />
      <div>
        <h3>{buyer.fullName}</h3>
        <p>{buyer.email} • {buyer.phone}</p>
        <p>{buyer.address}, {buyer.postalCode} {buyer.city}</p>
      </div>
      <Button onClick={() => navigateToBuyer(buyer.id)}>
        Voir dossier complet
      </Button>
    </BuyerCard>
  </Card>

  {/* Dossier */}
  <Card title="Dossier">
    <ProgressBar
      value={buyer.buyerFile.completionPercentage}
      label={`${buyer.buyerFile.completionPercentage}% complété`}
    />

    <DocumentChecklistSummary
      requirements={buyer.buyerFile.documentRequirements}
    />
  </Card>

  {/* Notaire */}
  <Card title="Notaire">
    {buyer.notaryFile ? (
      <NotaryFileSummary file={buyer.notaryFile} />
    ) : (
      <EmptyState
        title="Pas encore envoyé au notaire"
        description="Le dossier sera envoyé quand la checklist sera complète"
      />
    )}
  </Card>
</LotBuyer>
```

### 4.4 Onglet "Finances"

**Contenu** :
```tsx
<LotFinance lot={lot} buyer={lot.buyer}>
  {/* Détail prix */}
  <Card title="Prix">
    <PriceBreakdown>
      <PriceItem label="Prix de base" value={formatCurrency(lot.priceBase)} />
      <PriceItem label="Options & Extras" value={formatCurrency(lot.priceExtras)} />
      {lot.saleType === 'QPT' && (
        <PriceItem label={`TVA (${lot.vatRate}%)`} value={formatCurrency(lot.vatAmount)} />
      )}
      <Divider />
      <PriceItem label="Total" value={formatCurrency(lot.priceTotal)} strong />
    </PriceBreakdown>
  </Card>

  {/* Acomptes */}
  <Card title="Acomptes">
    <InstallmentsTable
      data={buyer.installments}
      columns={[
        { key: 'installmentNumber', label: 'N°' },
        { key: 'dueDate', label: 'Échéance', render: formatDate },
        { key: 'percentage', label: '%' },
        { key: 'amount', label: 'Montant', render: formatCurrency },
        { key: 'status', label: 'Statut', render: (inst) => <InstallmentStatusBadge status={inst.status} /> }
      ]}
    />

    <InstallmentsSummary
      total={installmentsTotal}
      paid={installmentsPaid}
      pending={installmentsPending}
    />
  </Card>
</LotFinance>
```

---

## 5. Vue 360° Acheteur

### 5.1 URL & Navigation

**URL** : `/buyers/:id`

**Fil d'Ariane** : `Projets / Villa Lac Léman / CRM / Jean Martin`

### 5.2 Structure de la page

```tsx
<BuyerView360 buyerId={buyerId}>
  {/* Header */}
  <PageHeader
    title={buyer.fullName}
    subtitle={
      <>
        Lot {buyer.lot.code} • {buyer.project.name}
      </>
    }
    badge={<BuyerStatusBadge status={buyer.status} />}
    actions={
      <>
        <Button variant="outline" onClick={sendEmail}>
          <MailIcon /> Envoyer email
        </Button>
        <Button onClick={openBuyerMenu}>
          <MoreIcon />
        </Button>
      </>
    }
  />

  {/* Progression globale */}
  <ProgressTimeline
    stages={[
      { label: 'Réservation', status: 'completed', date: buyer.reservation.reservedAt },
      { label: 'Dossier complet', status: buyer.buyerFile.isComplete ? 'completed' : 'in_progress', date: buyer.buyerFile.completedAt },
      { label: 'Envoi notaire', status: buyer.notaryFile ? 'completed' : 'pending', date: buyer.notaryFile?.receivedAt },
      { label: 'Acte signé', status: buyer.status === 'ACT_SIGNED' ? 'completed' : 'pending', date: buyer.notaryFile?.signedAt },
      { label: 'Livraison', status: buyer.status === 'DELIVERED' ? 'completed' : 'pending', date: buyer.deliveredAt }
    ]}
  />

  {/* Tabs */}
  <Tabs defaultValue="file">
    <TabsList>
      <TabsTrigger value="file">Dossier</TabsTrigger>
      <TabsTrigger value="lot">Lot</TabsTrigger>
      <TabsTrigger value="notary">Notaire</TabsTrigger>
      <TabsTrigger value="finance">Finances</TabsTrigger>
      <TabsTrigger value="choices">Choix matériaux</TabsTrigger>
      <TabsTrigger value="modifications">Modifications</TabsTrigger>
      <TabsTrigger value="documents">Documents</TabsTrigger>
      <TabsTrigger value="messages">Messages</TabsTrigger>
    </TabsList>

    <TabsContent value="file">
      <BuyerFile />
    </TabsContent>

    <TabsContent value="lot">
      <BuyerLot />
    </TabsContent>

    <TabsContent value="notary">
      <BuyerNotary />
    </TabsContent>

    <TabsContent value="finance">
      <BuyerFinance />
    </TabsContent>

    <TabsContent value="choices">
      <BuyerChoices />
    </TabsContent>

    <TabsContent value="modifications">
      <BuyerModifications />
    </TabsContent>

    <TabsContent value="documents">
      <BuyerDocuments />
    </TabsContent>

    <TabsContent value="messages">
      <BuyerMessages />
    </TabsContent>
  </Tabs>
</BuyerView360>
```

---

## 6. Vue 360° Contrat

### 6.1 Structure de la page

**Déjà détaillée dans FINANCE_CONTRACTS_MODULE.md section 9.1**

Résumé :
- Header avec KPIs (montant initial, révisé, facturé, payé)
- Tabs : Vue d'ensemble, Avenants, Situations, Factures, Paiements, Documents

---

## 7. Vues transversales

### 7.1 Dashboard global promoteur

**URL** : `/dashboard`

**Vue consolidée multi-projets** :
```tsx
<GlobalDashboard>
  {/* KPIs globaux */}
  <KpiGrid cols={5}>
    <KpiCard label="Projets actifs" value={activeProjects.length} />
    <KpiCard label="Lots en vente" value={availableLots.length} />
    <KpiCard label="CA Prévisionnel" value={formatCurrency(totalExpectedRevenue)} />
    <KpiCard label="Encaissé à ce jour" value={formatCurrency(totalPaid)} />
    <KpiCard label="Alertes" value={alertsCount} severity="warning" />
  </KpiGrid>

  {/* Projets */}
  <Card title="Mes projets">
    <ProjectsGrid projects={projects} />
  </Card>

  {/* Alertes */}
  <Card title="Alertes & Actions requises">
    <AlertsList alerts={globalAlerts} />
  </Card>

  {/* Activité récente */}
  <Card title="Activité récente (tous projets)">
    <ActivityFeed items={globalActivity} />
  </Card>
</GlobalDashboard>
```

### 7.2 Vue "Toutes les entreprises"

**URL** : `/companies`

**Table avec filtres avancés** :
```tsx
<CompaniesListPage>
  <FiltersBar>
    <Select label="Type" options={companyTypes} />
    <Select label="Projets" options={projects} multiple />
    <Input label="Recherche" placeholder="Nom, ville..." />
  </FiltersBar>

  <CompaniesTable
    data={companies}
    columns={[
      { key: 'name', label: 'Nom' },
      { key: 'type', label: 'Type' },
      { key: 'city', label: 'Ville' },
      { key: 'projectsCount', label: 'Projets' },
      { key: 'contractsCount', label: 'Contrats' },
      { key: 'totalContractAmount', label: 'Montant total', render: formatCurrency }
    ]}
    onRowClick={(company) => navigateToCompany(company.id)}
  />
</CompaniesListPage>
```

### 7.3 Vue "Tous les contrats"

**URL** : `/contracts`

**Consolidation de tous les contrats tous projets** :
```tsx
<ContractsListPage>
  <FiltersBar>
    <Select label="Projet" options={projects} />
    <Select label="Type" options={contractTypes} />
    <Select label="Statut" options={contractStatuses} />
    <Select label="Entreprise" options={companies} />
  </FiltersBar>

  <ContractsTable
    data={allContracts}
    showProject={true}
    onRowClick={(contract) => navigateToContract(contract.id)}
  />
</ContractsListPage>
```

---

## 🎯 Résumé des vues 360°

| Vue | Entité | Tabs | Points clés |
|-----|--------|------|-------------|
| **Projet** | Project | 10 | Structure, Intervenants, Contrats, Finance, CRM, Soumissions, Chantier, Docs, Communication |
| **Entreprise** | Company | 7 | Projets, Contrats, Soumissions, Factures, Paiements, Contacts, Historique |
| **Lot** | Lot | 8 | Vue, Technique, Acheteur, Finance, Choix, Modifications, Docs, Messages |
| **Acheteur** | Buyer | 8 | Dossier, Lot, Notaire, Finance, Choix, Modifications, Docs, Messages |
| **Contrat** | Contract | 6 | Vue, Avenants, Situations, Factures, Paiements, Docs |

**Ces vues permettent au développeur immobilier de naviguer intuitivement dans toutes les dimensions de ses projets avec un niveau de détail adapté à chaque contexte.**

---

**Ce document complète l'architecture avec les vues 360° complètes par entité.**
