# 🚀 GUIDE DE DÉVELOPPEMENT COMPLET - RealPro SA

## Vue d'ensemble pour l'équipe de développement

---

## 📚 DOCUMENTS DE RÉFÉRENCE

Avant de commencer, consultez ces documents dans l'ordre:

1. **UX_USER_JOURNEY_COMPLETE.md** - Parcours utilisateur complet
2. **ROUTES_ARCHITECTURE.md** - Architecture des routes
3. **ARCHITECTURE.md** - Architecture technique
4. **MODULE_MULTI_TENANT_ARCHITECTURE.md** - Système multi-tenant
5. **BUSINESS_RULES.md** - Règles métier

---

## 🎯 PHASES DE DÉVELOPPEMENT

### Phase 1: Fondations (Semaines 1-2)
- ✅ Déjà fait: Base de données Supabase
- ✅ Déjà fait: Authentification
- ✅ Déjà fait: Multi-tenant (organizations)
- ✅ Déjà fait: Design system

**À compléter:**
- [ ] Système de permissions granulaires
- [ ] Navigation adaptative par rôle
- [ ] Breadcrumbs dynamiques

---

### Phase 2: Dashboard & Projets (Semaines 3-4)

#### 2.1 Dashboard Global Promoteur
```
Route: /dashboard
Composants:
  - KPI Cards (déjà fait, améliorer)
  - Liste projets
  - Agenda global
  - Documents récents
  - Activité récente
```

#### 2.2 Création de Projet (Wizard)
```
Route: /projects/new
Étapes:
  1. Informations générales
  2. Structure (bâtiments/entrées/étages/lots)
  3. Intervenants
  4. Finances
  5. Planning
  6. Résumé

Composants:
  - <ProjectWizard />
  - <Step1Info />
  - <Step2Structure />
  - <Step3Actors />
  - <Step4Finances />
  - <Step5Planning />
  - <Step6Summary />
```

#### 2.3 Dashboard Projet
```
Route: /projects/[projectId]/dashboard
Widgets:
  - Résumé lots (vendus/disponibles)
  - Finances (budget/dépensé)
  - Soumissions actives
  - Modifications en cours
  - Avancement chantier
  - Prochaines échéances
  - Documents récents
  - Activité
```

---

### Phase 3: Module Lots & CRM (Semaines 5-6)

#### 3.1 Module Lots
```
Routes:
  /projects/[projectId]/lots
  /projects/[projectId]/lots/[lotId]

Fonctionnalités:
  - Liste avec filtres avancés
  - Vue carte / tableau
  - Fiche lot complète
  - Import Excel
  - Historique
  - Documents par lot
  - Modifications par lot

Composants clés:
  - <LotsTable />
  - <LotCard />
  - <LotDetail />
  - <LotEditPanel />
  - <LotPreviewPanel />
  - <ImportLotsModal />
```

#### 3.2 Module CRM
```
Routes:
  /projects/[projectId]/crm
  /projects/[projectId]/crm/prospects/[prospectId]
  /projects/[projectId]/crm/buyers/[buyerId]

Fonctionnalités:
  - Pipeline Kanban (drag & drop)
  - Fiche prospect détaillée
  - Conversion prospect → réservation → acheteur
  - Documents acheteur
  - Timeline activité
  - Envoi au notaire

Composants clés:
  - <CRMKanban />
  - <ProspectCard />
  - <ProspectDetail />
  - <BuyerDetail />
  - <BuyerPipeline />
  - <BuyerTimeline />
```

---

### Phase 4: Module Documents & Finances (Semaines 7-8)

#### 4.1 Module Documents
```
Route: /projects/[projectId]/documents

Architecture:
  - Arborescence automatique (7 dossiers principaux)
  - Upload drag & drop
  - Versioning
  - Permissions par dossier
  - Tags
  - Recherche full-text
  - Preview (PDF, images)
  - Partage avec expiration

Composants clés:
  - <DocumentsExplorer />
  - <FolderTree />
  - <DocumentCard />
  - <DocumentPreviewPanel />
  - <UploadDialog />
  - <DocumentToolbar />
```

#### 4.2 Module Finances
```
Routes:
  /projects/[projectId]/finances/cfc
  /projects/[projectId]/finances/invoices
  /projects/[projectId]/finances/payments
  /projects/[projectId]/finances/contracts

Sous-modules:
  A. Budget CFC
     - Import Excel CFC
     - Suivi budget/engagé/payé par CFC
     - Graphiques

  B. Factures
     - Liste factures
     - Validation workflow
     - Affectation CFC
     - Upload PDF

  C. Paiements Acheteurs
     - Plan de paiement suisse
     - Génération QR-factures (Swiss QR Bill)
     - Suivi paiements reçus
     - Relances automatiques

  D. Contrats
     - Contrats fournisseurs
     - Lien avec soumissions

Composants clés:
  - <FinanceDashboard />
  - <CFCTable />
  - <InvoiceTable />
  - <InvoiceCard />
  - <PaymentPlanTable />
  - <QRInvoiceCard />
```

---

### Phase 5: Module Soumissions (Semaine 9)

```
Routes:
  /projects/[projectId]/tenders
  /projects/[projectId]/tenders/[tenderId]
  /projects/[projectId]/tenders/[tenderId]/comparison
  /tenders/[tenderId]/submit (portail externe)

Workflow:
  1. Création soumission
  2. Upload documents (cahier charges, plans)
  3. Invitation entreprises (email)
  4. Portail externe dépôt offres
  5. Clarifications
  6. Comparaison automatique
  7. Adjudication
  8. Génération contrat → Finances

Composants clés:
  - <SubmissionsTable />
  - <SubmissionDetail />
  - <SubmissionComparisonTable />
  - <SubmissionEvaluationMatrix />
  - <SubmissionCompaniesCard />
  - <SubmissionOffersCard />

Portail externe:
  - <TenderPublicView />
  - <TenderSubmitForm />
  - <TenderClarifications />
```

---

### Phase 6: Module Modifications Techniques ⭐ (Semaines 10-11)

**C'EST LE MODULE STAR!**

```
Routes:
  /projects/[projectId]/modifications
  /projects/[projectId]/modifications/offers/[offerId]
  /projects/[projectId]/modifications/avenants/[avenantId]
  /supplier/appointments/[appointmentId]/offer

Workflow complet (8 étapes):
  1. Client demande modification
  2. RDV fournisseur proposé (calendrier)
  3. Fournisseur dépose offre (PDF, images, devis)
  4. Client valide
  5. Architecte valide techniquement
  6. Génération automatique avenant PDF (3 types)
  7. Signature client (manuelle ou électronique Swisscom AIS)
  8. Injection automatique:
     - Finances (prix lot + CFC)
     - Documents (archivage)
     - Notaire (notification nouveau prix)
     - Chantier (planning adapté)

Composants clés:
  - <ModificationRequestForm />
  - <SupplierAppointmentCalendar />
  - <SupplierOfferForm />
  - <OfferValidationClient />
  - <OfferValidationArchitect />
  - <AvenantGenerator />
  - <AvenantSignature />
  - <SignatureCanvas /> (manuelle)
  - <SignatureElectronic /> (Swisscom AIS)

Edge Functions:
  - generate-avenant-pdf
  - inject-avenant-to-finances
  - inject-avenant-to-documents
  - notify-notary
  - update-construction-planning
```

**Intégration Swisscom AIS:**
```typescript
// supabase/functions/signature-electronic/index.ts
import { SwisscomAIS } from 'swisscom-ais-sdk';

async function signDocument(documentId: string, phone: string) {
  // 1. Envoyer SMS avec code
  const code = await SwisscomAIS.sendCode(phone);

  // 2. Vérifier code
  const verified = await SwisscomAIS.verifyCode(code);

  // 3. Signer document
  const signed = await SwisscomAIS.signPDF(documentId);

  return signed;
}
```

---

### Phase 7: Module Chantier (Semaine 12)

```
Routes:
  /projects/[projectId]/construction/planning
  /projects/[projectId]/construction/photos
  /projects/[projectId]/construction/diary
  /projects/[projectId]/construction/buyers-progress

Sous-modules:
  A. Planning Gantt
     - Phases
     - Tâches
     - Jalons
     - Chemin critique
     - Synchronisation avec avenants

  B. Photos Avancement
     - Upload avec métadonnées
     - Timeline
     - Par zone/bâtiment
     - Partage avec acheteurs

  C. Journal de Chantier
     - Entrées quotidiennes
     - Météo
     - Effectif
     - Travaux réalisés
     - Observations
     - Photos liées

  D. Avancement Acheteurs
     - Par lot
     - Photos spécifiques
     - Timeline
     - Notifications

Composants clés:
  - <PlanningGanttChart />
  - <Gantt />
  - <GanttTask />
  - <PhotoGallery />
  - <SiteDiaryCard />
  - <BuyerProgressCard />
  - <ProgressSummaryCard />
```

---

### Phase 8: Module Communication (Semaine 13)

```
Route: /projects/[projectId]/communication

Architecture:
  - Fil général
  - Fils thématiques (chantier, finances)
  - Fils par lot
  - Fils par acheteur
  - Mentions @
  - Upload documents dans messages
  - Recherche full-text
  - Notifications intelligentes

Composants clés:
  - <MessageList />
  - <MessageItem />
  - <MessageInput />
  - <ThreadList />
  - <MentionSuggestions />
  - <MessageAttachments />

Temps réel:
  - Supabase Realtime
  - Typing indicators
  - Read receipts
  - Presence
```

---

### Phase 9: Modules Notaire & Courtiers (Semaine 14)

#### 9.1 Module Notaire
```
Routes:
  /projects/[projectId]/notary/dossiers
  /projects/[projectId]/notary/acts

Fonctionnalités:
  - Liste dossiers acheteurs
  - Workflow validation documents
  - Checklist notaire
  - Versioning actes
  - Communication notaire
  - Intégration CRM

Composants clés:
  - <NotaryDossierCard />
  - <NotaryChecklist />
  - <NotaryActVersions />
  - <ActVersionComparison />
  - <NotaryStatusTag />
```

#### 9.2 Module Courtiers
```
Routes:
  /projects/[projectId]/brokers
  /broker/[projectId]/dashboard (portail externe)

Fonctionnalités:
  - Gestion courtiers
  - Attribution lots
  - KPI performance
  - Commissions
  - Portail courtier externe

Composants clés:
  - <BrokerCard />
  - <BrokerPerformanceChart />
  - <BrokerCommissionsTable />
  - <BrokerDashboard /> (portail)
```

---

### Phase 10: Module Reporting & Exports (Semaine 15)

```
Routes:
  /projects/[projectId]/reporting
  /projects/[projectId]/exports

Rapports:
  - Vue d'ensemble
  - Ventes (CRM)
  - Finances (CFC, factures)
  - Chantier (avancement)
  - Personnalisés

Exports:
  - PDF professionnel
  - Excel
  - Templates personnalisables
  - Historique exports

Composants clés:
  - <ReportingDashboard />
  - <KpiCard />
  - <LineChart />
  - <BarChart />
  - <DonutChart />
  - <ExportPanel />
  - <ExportButton />

Edge Function:
  - generate-pdf-export
  - generate-excel-export
```

---

### Phase 11: Espace Acheteur (Semaine 16)

```
Routes (portail externe):
  /buyer/dashboard
  /buyer/my-lot
  /buyer/documents
  /buyer/payments
  /buyer/modifications
  /buyer/choices
  /buyer/progress
  /buyer/messages

Fonctionnalités:
  - Dashboard acheteur
  - Vue son lot
  - Documents personnels
  - QR-factures
  - Demandes modifications
  - Choix matériaux (RDV fournisseurs)
  - Avancement chantier (photos)
  - Communication promoteur

Composants clés:
  - <BuyerDashboard />
  - <BuyerLotDetail />
  - <BuyerPaymentsList />
  - <BuyerModificationsList />
  - <BuyerChoicesList />
  - <BuyerProgressTimeline />
  - <BuyerMessages />
```

---

### Phase 12: Admin & Billing (Semaine 17)

```
Routes:
  /admin
  /settings/billing
  /settings/organization

Fonctionnalités:
  A. Admin Global
     - Toutes organisations
     - Tous utilisateurs
     - Abonnements
     - Feature flags
     - Audit logs

  B. Billing
     - Intégration Datatrans
     - Souscriptions
     - Upgrade/Downgrade
     - Factures
     - Quotas

  C. Gestion Org
     - Utilisateurs
     - Permissions
     - Branding
     - Paramètres

Composants clés:
  - <AdminDashboard />
  - <OrganizationsTable />
  - <SubscriptionManagement />
  - <BillingHistory />
  - <QuotaDisplay />
  - <UserTable />
  - <PermissionMatrix />
```

---

### Phase 13: Multi-language & Optimisation (Semaine 18)

```
Langues:
  - FR (défaut)
  - DE
  - EN
  - IT

Niveaux:
  - Interface
  - Par utilisateur
  - Par projet
  - Documents générés

Implémentation:
  - react-i18next
  - Fichiers JSON par langue
  - Détection automatique
  - Sélecteur langue

Performance:
  - Code splitting
  - Lazy loading
  - Image optimization
  - Caching strategies
  - Service worker
```

---

## 🛠️ STACK TECHNIQUE

### Frontend
```
- React 18
- TypeScript
- Vite
- React Router v6
- TailwindCSS
- Framer Motion
- Recharts
- React Hook Form
- Zustand
- i18next
```

### Backend
```
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Edge Functions (Deno)
- RLS (Row Level Security)
```

### Services Externes
```
- Datatrans (paiements)
- Swisscom AIS (signature électronique)
- SendGrid/Postmark (emails)
```

---

## 🗃️ STRUCTURE BASE DE DONNÉES

### Tables principales (déjà créées)

```sql
-- Identité & Organisation
organizations
users
user_roles
permissions

-- Projets
projects
project_members

-- Lots & CRM
lots
prospects
buyers
reservations

-- Documents
documents
document_folders
document_versions

-- Finances
cfc_codes
invoices
payments
contracts

-- Soumissions
submissions
submission_companies
submission_offers

-- Modifications
modifications
supplier_appointments
supplier_offers
avenants
avenant_signatures

-- Chantier
planning_phases
construction_photos
site_diary_entries

-- Communication
message_threads
messages
notifications

-- SAV
service_tickets
handover_inspections

-- Admin
subscriptions
audit_logs
feature_flags
```

---

## 🔐 SÉCURITÉ & PERMISSIONS

### Principes

1. **RLS partout**
   - Toutes les tables ont des policies
   - Pas de requête sans vérification

2. **Permissions granulaires**
   - Par rôle
   - Par module
   - Par action

3. **Isolation totale**
   - Un projet ne voit JAMAIS un autre
   - Vérification à chaque query

### Exemple RLS

```sql
-- Politique pour lots
CREATE POLICY "Users see only their project lots"
ON lots
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.project_id = lots.project_id
    AND pm.user_id = auth.uid()
  )
);

-- Politique pour acheteurs (ne voient que leur lot)
CREATE POLICY "Buyers see only their lot"
ON lots
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM buyers b
    WHERE b.lot_id = lots.id
    AND b.user_id = auth.uid()
  )
);
```

---

## 📝 CONVENTIONS DE CODE

### Composants

```typescript
// PascalCase pour composants
<ProjectCard />
<LotDetail />
<BuyerPipeline />

// camelCase pour fonctions
useDashboard()
useProjectMembers()
formatCurrency()

// UPPER_SNAKE_CASE pour constantes
const DEFAULT_PAGE_SIZE = 20;
const MAX_UPLOAD_SIZE = 10_000_000;
```

### Fichiers

```
src/
├── components/
│   ├── lots/
│   │   ├── LotCard.tsx
│   │   ├── LotDetail.tsx
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── index.ts
├── pages/
│   ├── ProjectLots.tsx
│   ├── ProjectCRM.tsx
│   └── Dashboard.tsx
├── hooks/
│   ├── useLots.ts
│   ├── useProspects.ts
│   └── useDashboard.ts
├── lib/
│   ├── supabase.ts
│   ├── permissions.ts
│   └── utils/
└── types/
    ├── lots.ts
    ├── crm.ts
    └── index.ts
```

### Types

```typescript
// types/lots.ts
export interface Lot {
  id: string;
  project_id: string;
  number: string;
  type: LotType;
  surface: number;
  price: number;
  status: LotStatus;
  created_at: string;
}

export type LotType = '1.5' | '2.5' | '3.5' | '4.5' | '5.5';
export type LotStatus = 'available' | 'reserved' | 'sold';
```

---

## 🧪 TESTS

### Tests à implémenter

```typescript
// Tests unitaires (Vitest)
describe('useLots', () => {
  it('should fetch lots for project', async () => {
    const { data } = await useLots(projectId);
    expect(data).toBeDefined();
  });
});

// Tests d'intégration
describe('Lot Creation', () => {
  it('should create lot and update project', async () => {
    const lot = await createLot({ ... });
    expect(lot.id).toBeDefined();
  });
});

// Tests E2E (Playwright)
test('Complete sale workflow', async ({ page }) => {
  await page.goto('/projects/123/crm');
  await page.click('[data-testid="new-prospect"]');
  // ...
});
```

---

## 📊 MÉTRIQUES & MONITORING

### À implémenter

1. **Analytics**
   - Page views
   - User actions
   - Module usage

2. **Performance**
   - Page load time
   - API response time
   - Database queries

3. **Erreurs**
   - Error tracking (Sentry)
   - User feedback
   - Crash reports

4. **Business**
   - Projets créés
   - Lots vendus
   - Avenants signés
   - QR-factures générées

---

## 🚀 DÉPLOIEMENT

### Environnements

```
Development   → http://localhost:5173
Staging       → https://staging.realpro.ch
Production    → https://app.realpro.ch
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: supabase/deploy-action@v1
```

---

## ✅ CHECKLIST DE PRODUCTION

### Avant le lancement

- [ ] Tous les modules fonctionnels
- [ ] Tests E2E passent
- [ ] Performance optimisée (Lighthouse > 90)
- [ ] Sécurité auditée
- [ ] RLS sur toutes les tables
- [ ] Emails configurés
- [ ] Datatrans configuré
- [ ] Swisscom AIS configuré
- [ ] Backups automatiques
- [ ] Monitoring actif
- [ ] Documentation complète
- [ ] Formation utilisateurs
- [ ] Support client prêt

---

## 📖 RESSOURCES

### Documentation

- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

### APIs

- [Datatrans API](https://api-reference.datatrans.ch)
- [Swisscom AIS](https://www.swisscom.ch/en/business/enterprise/offer/security/identity-access-security/signing-service.html)
- [Swiss QR Bill](https://www.paymentstandards.ch/en/home/software-partner.html)

---

## 🎯 PRIORITÉS

### Must Have (MVP)
1. Auth & Organisation
2. Projets & Lots
3. CRM basique
4. Documents
5. Finances (CFC + Factures)

### Should Have
6. Soumissions
7. Modifications Techniques
8. Chantier
9. Communication
10. Notaire & Courtiers

### Nice to Have
11. Reporting avancé
12. Espace Acheteur
13. Exports personnalisés
14. SAV

---

## 💡 CONSEILS

1. **Commencer petit**
   - MVP avec modules essentiels
   - Itérer rapidement

2. **Tester tôt**
   - Tests dès le début
   - Feedback utilisateurs

3. **Performance**
   - Optimiser dès le départ
   - Code splitting

4. **Sécurité**
   - RLS partout
   - Audits réguliers

5. **Documentation**
   - Code commenté
   - README à jour

---

## 🏆 SUCCÈS

Vous saurez que c'est un succès quand:

- ✅ Un promoteur peut créer un projet en < 10 min
- ✅ Un lot se vend en quelques clics
- ✅ Un avenant se signe en < 5 min
- ✅ Les QR-factures sont générées automatiquement
- ✅ Tous les modules communiquent entre eux
- ✅ Zéro saisie manuelle redondante
- ✅ Les acheteurs sont ravis de leur espace
- ✅ Les promoteurs gagnent 10h/semaine

---

**Bon développement! 🚀**
