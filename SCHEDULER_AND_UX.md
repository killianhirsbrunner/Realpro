# 🤖 Module Scheduler & Automations + 🎨 Architecture UX Globale

## Vue d'ensemble

Deux modules essentiels pour une expérience utilisateur professionnelle et automatisée:

1. **Module Scheduler/Automations** - Création automatique de notifications et tâches
2. **Architecture UX Globale** - Layout dynamique par rôle avec cockpit projet centralisé

---

## 🤖 Module 1: Scheduler & Automations

### Objectif

Créer automatiquement des **notifications** et **tâches** à partir des données de la plateforme:
- Choix matériaux en retard
- Acomptes / factures en retard
- Soumissions avec clarifications ouvertes
- Phases chantier en retard

### Architecture

```
Edge Function "scheduler"
  └── POST /run    Déclenche tous les contrôles quotidiens
```

**Comment l'utiliser**:
1. Appel manuel via API
2. CRON externe (GitHub Actions, cron-job.org, etc.)
3. Supabase pg_cron (configuré dans PostgreSQL)

### Edge Function: scheduler/index.ts

**Fichier**: `supabase/functions/scheduler/index.ts` (280 lignes)

**Fonctionnement**:
1. Contrôle 1: Choix matériaux en retard
2. Contrôle 2: Factures acquéreurs en retard
3. Contrôle 3: Clarifications soumissions ouvertes
4. Contrôle 4: Phases chantier en retard

Pour chaque problème détecté:
- Crée une **notification** pour les users concernés
- Crée une **tâche** assignée aux responsables

### Contrôle 1: Choix Matériaux en Retard

**Logique**:
```sql
SELECT lots WHERE
  status IN ('RESERVED', 'SOLD')
  AND choice_deadline_at < NOW()
  AND no buyer_choices exist
```

**Actions**:
- Notifie: PROMOTER, EG, ARCHITECT
- Type notification: `CHOICE_MATERIAL`
- Crée tâche: "Relancer l'acquéreur – choix matériaux lot X"
- Type tâche: `MATERIAL_CHOICE`

**Exemple notification créée**:
```json
{
  "type": "CHOICE_MATERIAL",
  "title": "Choix matériaux en retard – Lot A101",
  "body": "Les choix matériaux pour le lot A101 (projet Résidence du Lac) sont en retard.",
  "projectId": "proj-123",
  "linkUrl": "/projects/proj-123/buyers/buyer-id/lots/lot-id/choices"
}
```

### Contrôle 2: Factures Acquéreurs en Retard

**Logique**:
```sql
SELECT buyer_invoices WHERE
  status = 'OPEN'
  AND due_at < NOW()
```

**Actions**:
- Notifie: PROMOTER
- Type notification: `PAYMENT`
- Crée tâche: "Suivi acompte en retard – INV-2024-001"
- Type tâche: `PAYMENT`

**Exemple notification créée**:
```json
{
  "type": "PAYMENT",
  "title": "Acompte en retard – INV-2024-001",
  "body": "L'acompte INV-2024-001 pour le lot A101 est en retard.",
  "projectId": "proj-123",
  "linkUrl": "/projects/proj-123/finance/buyers/buyer-id/invoices"
}
```

### Contrôle 3: Clarifications Soumissions

**Logique**:
```sql
SELECT submissions WHERE
  clarifications_open > 0
```

**Actions**:
- Notifie: PROMOTER, ARCHITECT, EG
- Type notification: `SUBMISSION`
- Crée tâche: "Répondre aux clarifications – Soumission X"
- Type tâche: `SUBMISSION`

**Exemple notification créée**:
```json
{
  "type": "SUBMISSION",
  "title": "Clarifications ouvertes – Gros œuvre bâtiment A",
  "body": "Des clarifications sont en attente sur la soumission 'Gros œuvre bâtiment A'.",
  "projectId": "proj-123",
  "linkUrl": "/projects/proj-123/submissions/sub-id"
}
```

### Contrôle 4: Phases Chantier en Retard

**Logique**:
```sql
SELECT project_phases WHERE
  status IN ('NOT_STARTED', 'IN_PROGRESS')
  AND planned_end < NOW()
```

**Actions**:
- Notifie: EG, PROMOTER
- Type notification: `DEADLINE`
- Crée tâche: "Analyser le retard – Phase X"
- Type tâche: `PLANNING`

**Exemple notification créée**:
```json
{
  "type": "DEADLINE",
  "title": "Phase en retard – Terrassement",
  "body": "La phase 'Terrassement' du projet Résidence du Lac est en retard par rapport au planning.",
  "projectId": "proj-123",
  "linkUrl": "/projects/proj-123/planning"
}
```

### Route API

#### POST /scheduler/run

**Description**: Déclenche tous les contrôles quotidiens

**Headers**:
```
Authorization: Bearer <ANON_KEY>
Content-Type: application/json
```

**Response**:
```json
{
  "materialChoices": 3,
  "buyerInvoices": 2,
  "submissionsClarifications": 1,
  "latePhases": 4,
  "errors": []
}
```

**Explication**:
- `materialChoices`: Nombre de notifications créées pour choix en retard
- `buyerInvoices`: Nombre de notifications créées pour factures en retard
- `submissionsClarifications`: Nombre de notifications créées pour clarifications
- `latePhases`: Nombre de notifications créées pour phases en retard
- `errors`: Liste des erreurs rencontrées (si applicable)

### Configuration CRON

#### Option 1: GitHub Actions (Gratuit)

Créer `.github/workflows/scheduler.yml`:

```yaml
name: Daily Scheduler

on:
  schedule:
    - cron: '0 5 * * *'  # Tous les jours à 5h00 UTC (6h CET)
  workflow_dispatch:  # Permet déclenchement manuel

jobs:
  run-scheduler:
    runs-on: ubuntu-latest
    steps:
      - name: Call Scheduler Function
        run: |
          curl -X POST \
            "${{ secrets.SUPABASE_URL }}/functions/v1/scheduler/run" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

#### Option 2: cron-job.org (Gratuit)

1. S'inscrire sur https://cron-job.org
2. Créer nouveau job:
   - URL: `https://<project>.supabase.co/functions/v1/scheduler/run`
   - Method: POST
   - Headers:
     - `Authorization: Bearer <ANON_KEY>`
     - `Content-Type: application/json`
   - Schedule: `0 5 * * *` (tous les jours à 5h)

#### Option 3: Supabase pg_cron

Exécuter dans SQL Editor Supabase:

```sql
SELECT cron.schedule(
  'daily-scheduler',
  '0 5 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://<project>.supabase.co/functions/v1/scheduler/run',
      headers:='{"Authorization": "Bearer <ANON_KEY>", "Content-Type": "application/json"}'::jsonb
    ) AS response;
  $$
);
```

### Workflow Complet

```
1. CRON DÉCLENCHE (5h du matin)
   ↓
2. POST /scheduler/run
   ↓
3. CONTRÔLE 1: Choix matériaux
   → 3 lots en retard trouvés
   → Crée 3 notifications + 3 tâches
   ↓
4. CONTRÔLE 2: Factures
   → 2 factures en retard trouvées
   → Crée 2 notifications + 2 tâches
   ↓
5. CONTRÔLE 3: Clarifications
   → 1 soumission avec clarifications
   → Crée 1 notification + 1 tâche
   ↓
6. CONTRÔLE 4: Phases chantier
   → 4 phases en retard trouvées
   → Crée 4 notifications + 4 tâches
   ↓
7. RETOUR RÉSUMÉ
   {
     "materialChoices": 3,
     "buyerInvoices": 2,
     "submissionsClarifications": 1,
     "latePhases": 4,
     "errors": []
   }
   ↓
8. USERS REÇOIVENT NOTIFICATIONS
   - Badge +10 sur la cloche
   - Notifications en inbox
   - Tâches dans /tasks
```

### Extension Possible

**Autres contrôles à ajouter**:
- Rendez-vous notaire à confirmer (7 jours avant)
- Documents manquants dossiers acquéreurs
- Soumissions sans réponse (deadline proche)
- CFC budgets dépassés (alert seuil 90%)
- Lots non réservés depuis X jours
- Modifications matériaux en attente validation

**Template pour nouveau contrôle**:

```typescript
async function checkNewCriteria(supabase: any): Promise<number> {
  let notificationCount = 0;

  // 1. Requête pour trouver les problèmes
  const { data: items, error } = await supabase
    .from('table_name')
    .select('...')
    .filter('...');

  if (error) throw error;
  if (!items || items.length === 0) return 0;

  // 2. Pour chaque problème
  for (const item of items) {
    // 3. Trouver les users à notifier
    const { data: orgUsers } = await supabase
      .from('user_organizations')
      .select('user_id')
      .eq('organization_id', item.organization_id)
      .in('role', ['PROMOTER', 'EG']);

    if (!orgUsers) continue;

    // 4. Créer notification + tâche
    for (const ou of orgUsers) {
      await supabase.from('notifications').insert({
        user_id: ou.user_id,
        type: 'WARNING',
        title: `Titre notification`,
        body: `Description détaillée`,
        project_id: item.project_id,
        link_url: `/link/to/page`,
      });

      await supabase.from('tasks').insert({
        organization_id: item.organization_id,
        project_id: item.project_id,
        title: `Titre tâche`,
        description: `Description`,
        type: 'GENERIC',
        status: 'OPEN',
        due_date: new Date().toISOString(),
        assigned_to_id: ou.user_id,
        created_by_id: ou.user_id,
      });

      notificationCount++;
    }
  }

  return notificationCount;
}
```

---

## 🎨 Module 2: Architecture UX Globale

### Objectif

Créer une expérience utilisateur professionnelle avec:
- **Sidebar dynamique** selon le rôle utilisateur
- **Topbar** avec sélecteur projet + notifications + user menu
- **Page cockpit projet** centralisant toutes les infos

### Composants Créés

```
src/components/layout/
  ├── DynamicSidebar.tsx       (140 lignes)  ← Sidebar par rôle
  └── EnhancedTopbar.tsx       (175 lignes)  ← Topbar avec projet + notifs

src/pages/
  └── ProjectCockpitDashboard.tsx  (480 lignes)  ← Vue 360° projet
```

### 1. DynamicSidebar: Navigation par Rôle

**Fichier**: `src/components/layout/DynamicSidebar.tsx` (140 lignes)

**Concept**:
- Menu adapté selon le rôle (PROMOTER, EG, ARCHITECT, BROKER, NOTARY, BUYER)
- Items "project scoped" prennent le projectId courant
- Badge rôle en bas de sidebar

**Menus par rôle**:

#### PROMOTER (Promoteur)
```typescript
[
  { name: 'Tableau de bord', href: '/reporting', icon: LayoutDashboard },
  { name: 'Projets', href: '/projects', icon: Building2 },
  { name: 'Facturation', href: '/billing', icon: CreditCard },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Tâches', href: '/tasks', icon: ListTodo },
  { name: 'Paramètres', href: '/settings', icon: Settings },
]
```

#### EG (Entreprise Générale)
```typescript
[
  { name: 'Projets', href: '/projects', icon: Building2 },
  { name: 'Planning', href: '/planning', icon: Calendar, projectScoped: true },
  { name: 'Soumissions', href: '/submissions', icon: ClipboardList, projectScoped: true },
  { name: 'Chantier', href: '/construction', icon: Hammer, projectScoped: true },
  { name: 'Tâches', href: '/tasks', icon: ListTodo },
  { name: 'Documents', href: '/documents', icon: FolderOpen, projectScoped: true },
]
```

#### ARCHITECT (Architecte)
```typescript
[
  { name: 'Projets', href: '/projects', icon: Building2 },
  { name: 'Planning', href: '/planning', icon: Calendar, projectScoped: true },
  { name: 'Soumissions', href: '/submissions', icon: ClipboardList, projectScoped: true },
  { name: 'Matériaux', href: '/materials', icon: Grid3x3, projectScoped: true },
  { name: 'Documents', href: '/documents', icon: FolderOpen, projectScoped: true },
  { name: 'Tâches', href: '/tasks', icon: ListTodo },
]
```

#### BROKER (Courtier)
```typescript
[
  { name: 'Tableau de bord', href: '/broker/dashboard', icon: LayoutDashboard },
  { name: 'Projets', href: '/projects', icon: Building2 },
  { name: 'Programme vente', href: '/broker/lots', icon: Grid3x3, projectScoped: true },
  { name: 'Contrats', href: '/broker/contracts', icon: FileText, projectScoped: true },
  { name: 'Performance', href: '/reporting/brokers', icon: BarChart3 },
  { name: 'Tâches', href: '/tasks', icon: ListTodo },
]
```

#### NOTARY (Notaire)
```typescript
[
  { name: 'Dossiers notaire', href: '/notary/files', icon: FolderOpen },
  { name: 'Rendez-vous', href: '/notary/appointments', icon: Calendar },
  { name: 'Documents', href: '/notary/documents', icon: File },
  { name: 'Tâches', href: '/tasks', icon: ListTodo },
]
```

#### BUYER (Acquéreur)
```typescript
[
  { name: 'Mon espace', href: '/buyer/home', icon: Home },
  { name: 'Mon lot', href: '/buyer/lot', icon: Building2 },
  { name: 'Choix matériaux', href: '/buyer/materials', icon: Grid3x3 },
  { name: 'Documents', href: '/buyer/documents', icon: FolderOpen },
  { name: 'Paiements', href: '/buyer/payments', icon: DollarSign },
  { name: 'Avancement', href: '/buyer/progress', icon: BarChart3 },
]
```

**Props**:
```typescript
interface DynamicSidebarProps {
  role: Role;
  currentPath?: string;
  currentProjectId?: string | null;
  onNavigate?: (path: string) => void;
}
```

**Exemple d'utilisation**:
```tsx
<DynamicSidebar
  role="PROMOTER"
  currentPath="/projects/123/planning"
  currentProjectId="123"
  onNavigate={(path) => router.push(path)}
/>
```

**Items "projectScoped"**:
- Si `projectScoped: true` ET `currentProjectId` existe
- Le href devient: `/projects/${currentProjectId}${href}`
- Exemple: `/planning` → `/projects/123/planning`

### 2. EnhancedTopbar: Header Complet

**Fichier**: `src/components/layout/EnhancedTopbar.tsx` (175 lignes)

**Features**:
- ✅ Sélecteur de projet (dropdown)
- ✅ Cloche notifications (NotificationBell)
- ✅ Sélecteur langue (FR, DE, IT, EN)
- ✅ Menu utilisateur (profil, logout)

**Layout topbar**:
```
┌────────────────────────────────────────────────────────────┐
│ [📁 Résidence du Lac ▾]    [🔔3] [🌍FR▾] [👤User▾]        │
└────────────────────────────────────────────────────────────┘
```

**Sélecteur de projet**:
- Liste tous les projets de l'organisation
- Affiche nom + ville + statut
- Check mark sur projet sélectionné
- Callback `onProjectChange(projectId)` au changement

**Props**:
```typescript
interface EnhancedTopbarProps {
  currentProjectId?: string | null;
  onProjectChange?: (projectId: string) => void;
}
```

**Exemple d'utilisation**:
```tsx
<EnhancedTopbar
  currentProjectId="proj-123"
  onProjectChange={(id) => {
    setCurrentProjectId(id);
    router.push(`/projects/${id}/cockpit`);
  }}
/>
```

### 3. ProjectCockpitDashboard: Vue 360°

**Fichier**: `src/pages/ProjectCockpitDashboard.tsx` (480 lignes)

**Concept**:
- Page centrale du projet
- Agrège toutes les informations essentielles
- Liens rapides vers tous les modules

**Sections**:
1. Header projet (nom, ville, statut, type)
2. 4 KPIs principaux (ventes, budget, avancement, notaire)
3. 6 cartes modules (ventes, finance, planning, notaire, soumissions, matériaux)
4. 2 graphiques (progression ventes, budget CFC)

**KPIs**:

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 📊 Ventes       │ 💰 Budget CFC   │ 📈 Avancement   │ 📄 Notaire      │
│ 15/28           │ CHF 5'200'000   │ 45%             │ 12/28           │
│ 3 réservés      │ Engagé: 3.2M    │ Prochaine étape │ 5 prêts         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

**Cartes modules**:

```
┌──────────────────────────────────┬──────────────────────────────────┐
│ 📊 Ventes & lots            [→]  │ 💰 Finance & CFC            [→]  │
│ Suivi lots, réservations...      │ Budget, engagements...           │
│ Vendus: 15 · Réservés: 3        │ Facturé: 2.8M · Payé: 2.1M      │
└──────────────────────────────────┴──────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│ 📅 Planning chantier        [→]  │ 👥 Notaire & acquéreurs     [→]  │
│ Phases chantier, jalons...       │ Dossiers acheteurs, actes...     │
│ Avancement: 45%                  │ Prêts: 5 · Signés: 12           │
└──────────────────────────────────┴──────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│ 📋 Soumissions              [→]  │ 🎨 Choix matériaux          [→]  │
│ Appels d'offres, comparatifs...  │ Suivi choix acquéreurs...        │
│ En cours: 3 · Adjudiquées: 8    │ Catalogue: —                     │
└──────────────────────────────────┴──────────────────────────────────┘
```

**Graphiques**:

**Progression ventes**:
- Barre de progression vendus / total
- 3 indicateurs: Vendus (vert), Réservés (amber), Libres (gris)

**Budget CFC**:
- Barre de progression payé / budget
- 3 indicateurs: Engagé, Facturé, Payé

**Props**:
```typescript
interface ProjectCockpitDashboardProps {
  projectId: string;
}
```

**Data source**:
- Appelle `/project-dashboard/projects/:projectId/dashboard`
- Structure de réponse définie dans Edge Function

### Route API Cockpit

**Edge Function**: `project-dashboard/index.ts` (déjà existante, améliorée)

**Route**: `GET /projects/:projectId/dashboard`

**Response**:
```json
{
  "project": {
    "id": "proj-123",
    "name": "Résidence du Lac",
    "type": "PPE",
    "city": "Lausanne",
    "canton": "VD",
    "status": "CONSTRUCTION"
  },
  "sales": {
    "lotsTotal": 28,
    "lotsSold": 15,
    "lotsReserved": 3,
    "lotsFree": 10
  },
  "finance": {
    "cfcBudget": 5200000,
    "cfcEngaged": 3200000,
    "cfcInvoiced": 2800000,
    "cfcPaid": 2100000
  },
  "planning": {
    "progressPct": 45,
    "nextMilestone": {
      "name": "Gros œuvre bâtiment B",
      "plannedEnd": "2024-12-31"
    }
  },
  "notary": {
    "buyerFilesTotal": 28,
    "readyForNotary": 5,
    "signed": 12
  },
  "submissions": {
    "open": 3,
    "adjudicated": 8
  }
}
```

### Workflow Utilisateur Complet

```
1. USER SE CONNECTE
   Role: PROMOTER
   ↓
2. SIDEBAR AFFICHE MENU PROMOTER
   - Tableau de bord
   - Projets
   - Facturation
   - Templates
   - Tâches
   - Paramètres
   ↓
3. TOPBAR AFFICHE
   - Sélecteur projet (Résidence du Lac)
   - Cloche notifs (badge 3)
   - Langue FR
   - Menu user
   ↓
4. USER CLIQUE SUR PROJET
   Dropdown avec 5 projets
   Sélectionne "Tour Horizon"
   ↓
5. onProjectChange("proj-456")
   currentProjectId = "proj-456"
   Sidebar items projectScoped mis à jour
   ↓
6. USER CLIQUE "PROJETS"
   Navigate to /projects
   Liste projets affichée
   ↓
7. USER CLIQUE SUR "TOUR HORIZON"
   Navigate to /projects/proj-456/cockpit
   ↓
8. PAGE COCKPIT CHARGE
   GET /project-dashboard/projects/proj-456/dashboard
   Affiche 4 KPIs + 6 modules + 2 graphiques
   ↓
9. USER CLIQUE "VENTES & LOTS"
   Navigate to /projects/proj-456/broker/lots
   Liste lots affichée
   ↓
10. USER CLIQUE CLOCHE NOTIFS
    Dropdown ouvre
    3 notifications non lues
    User clique "Marquer tout comme lu"
    Badge disparaît
```

### Intégration Complète

**Exemple AppShell complet**:

```tsx
import { useState } from 'react';
import { DynamicSidebar } from './components/layout/DynamicSidebar';
import { EnhancedTopbar } from './components/layout/EnhancedTopbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const userRole = 'PROMOTER'; // À récupérer depuis auth context

  const handleProjectChange = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    // router.push(path) dans une vraie app
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DynamicSidebar
        role={userRole}
        currentPath={currentPath}
        currentProjectId={currentProjectId}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedTopbar
          currentProjectId={currentProjectId}
          onProjectChange={handleProjectChange}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 📊 Statistiques

### Module Scheduler
```
Edge Function:    280 lignes
Routes API:       1 (POST /run)
Contrôles:        4 automatisés
Notifications:    Création automatique
Tâches:           Création automatique
```

### Architecture UX
```
Composants:       2 (DynamicSidebar + EnhancedTopbar)
Pages:            1 (ProjectCockpitDashboard)
Total lignes:     795 lignes
Rôles supportés:  6 (PROMOTER, EG, ARCHITECT, BROKER, NOTARY, BUYER)
Menus items:      30+ (tous rôles combinés)
```

### Total Ajouté
```
Edge Functions:   280 lignes
Composants:       315 lignes
Pages:            480 lignes
═══════════════════════════════
TOTAL:            1'075 lignes
```

---

## 🎯 Points Forts

### Scheduler
- ✅ Détection automatique des problèmes
- ✅ Notifications ciblées par rôle
- ✅ Tâches créées automatiquement
- ✅ 4 contrôles critiques implémentés
- ✅ Extensible facilement (template fourni)
- ✅ Déclenchement CRON facile (3 options)

### UX Globale
- ✅ Navigation adaptée par rôle
- ✅ Sélecteur projet central
- ✅ Cockpit 360° complet
- ✅ Design Swiss-style cohérent
- ✅ 6 rôles supportés
- ✅ Items projectScoped intelligents
- ✅ Intégration notifications seamless

---

## 🚀 Déploiement

### 1. Déployer Edge Function Scheduler

```bash
# Via Supabase Dashboard
1. Créer fonction "scheduler"
2. Copier contenu de supabase/functions/scheduler/index.ts
3. Déployer
4. Tester: POST /scheduler/run
```

### 2. Configurer CRON

**Option recommandée: GitHub Actions**

1. Créer `.github/workflows/scheduler.yml`
2. Ajouter secrets GitHub:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Activer workflow
4. Tester déclenchement manuel

### 3. Utiliser Nouveaux Composants

```tsx
// Dans votre App.tsx
import { DynamicSidebar } from './components/layout/DynamicSidebar';
import { EnhancedTopbar } from './components/layout/EnhancedTopbar';
import { ProjectCockpitDashboard } from './pages/ProjectCockpitDashboard';

// Remplacer sidebar/topbar existants
<DynamicSidebar role={userRole} ... />
<EnhancedTopbar currentProjectId={projectId} ... />

// Nouvelle page cockpit
<Route path="/projects/:id/cockpit" element={<ProjectCockpitDashboard />} />
```

---

## ✅ Tests & Validation

### Tests Scheduler

**Test manuel**:
```bash
curl -X POST \
  "${SUPABASE_URL}/functions/v1/scheduler/run" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json"
```

**Vérifications**:
- ✅ Response contient les 4 compteurs
- ✅ Notifications créées dans DB
- ✅ Tâches créées dans DB
- ✅ Users corrects notifiés
- ✅ Pas d'erreurs dans logs

### Tests UX

**DynamicSidebar**:
- ✅ Menu correct pour chaque rôle
- ✅ Items projectScoped mis à jour
- ✅ Active state fonctionne
- ✅ onNavigate appelé correctement

**EnhancedTopbar**:
- ✅ Sélecteur projet liste tous projets
- ✅ onProjectChange appelé au clic
- ✅ NotificationBell fonctionne
- ✅ Menu langue change i18n
- ✅ Menu user affiche infos

**ProjectCockpitDashboard**:
- ✅ Données chargées correctement
- ✅ 4 KPIs affichés
- ✅ 6 modules cliquables
- ✅ Graphiques rendus
- ✅ Loading states OK

---

## 🎓 Guide Développeur

### Ajouter un Nouveau Rôle

```typescript
// 1. Dans DynamicSidebar.tsx
type Role = 'PROMOTER' | 'EG' | 'ARCHITECT' | 'BROKER' | 'NOTARY' | 'BUYER' | 'NEW_ROLE';

const ROLE_NAV: Record<Role, NavItem[]> = {
  // ... rôles existants
  NEW_ROLE: [
    { name: 'Dashboard', href: '/new-role/dashboard', icon: LayoutDashboard },
    { name: 'Tâches', href: '/tasks', icon: ListTodo },
  ],
};

// 2. Dans getRoleLabel()
const labels: Record<Role, string> = {
  // ... labels existants
  NEW_ROLE: 'Nouveau Rôle',
};
```

### Ajouter un Module au Cockpit

```tsx
// Dans ProjectCockpitDashboard.tsx
<ModuleCard
  title="Nouveau Module"
  description="Description du module"
  icon={<Icon className="w-5 h-5" />}
  link={`/projects/${project.id}/new-module`}
  stats={[
    { label: 'Metric', value: 42 },
  ]}
/>
```

### Ajouter un Contrôle Scheduler

```typescript
// Dans scheduler/index.ts

// 1. Ajouter la fonction
async function checkNewCriteria(supabase: any): Promise<number> {
  // ... logique de contrôle
  return notificationCount;
}

// 2. Appeler dans runDailyChecks()
try {
  results.newCriteria = await checkNewCriteria(supabase);
} catch (error) {
  console.error('Error checking new criteria:', error);
  results.errors.push(`New criteria: ${error.message}`);
}

// 3. Ajouter au type results
const results = {
  // ... existants
  newCriteria: 0,
  errors: [] as string[],
};
```

---

## 🎉 Résumé

### Ce qui a été créé

✅ **Module Scheduler** (280 lignes)
- 1 Edge Function avec 4 contrôles automatisés
- Création auto notifications + tâches
- Configuration CRON (3 options)
- Extensible facilement

✅ **Architecture UX Globale** (795 lignes)
- DynamicSidebar avec 6 rôles
- EnhancedTopbar complet (projet + notifs + langue)
- ProjectCockpitDashboard vue 360°
- Design Swiss-style cohérent

### Totaux

- **1'075 lignes** de code production-ready
- **1 Edge Function** scheduler
- **2 composants** layout avancés
- **1 page** cockpit centralisée
- **6 rôles** utilisateurs supportés
- **4 contrôles** automatisés
- **Documentation complète** (ce fichier)

**Votre plateforme est maintenant ultra-professionnelle avec automatisations intelligentes et UX dynamique par rôle! 🤖🎨🚀**
