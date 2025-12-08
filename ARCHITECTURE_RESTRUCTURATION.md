# Restructuration Architecture Multi-Projets

**Date**: 8 Décembre 2025
**Statut**: 🚧 En cours

---

## 🎯 Objectif

Transformer l'application en une **plateforme multi-projets** avec:
1. **Dashboard Organisation**: Vue d'ensemble de tous les projets pour le promoteur
2. **Isolation par projet**: Chaque projet a ses propres intervenants (courtiers, architectes, etc.)
3. **Portails dédiés**: Pages de connexion spécifiques pour chaque type d'intervenant
4. **Système d'invitations**: Le promoteur envoie des liens sécurisés aux intervenants pour accéder à un projet spécifique

---

## 📊 Architecture Actuelle

### Flow de Connexion Actuel
```
1. Utilisateur → Login (/login)
2. → SelectOrganization (/select-organization)
3. → Dashboard (/dashboard) - Dashboard projet unique
4. → Accès aux modules projet
```

### Problèmes
- ❌ Pas de vue d'ensemble multi-projets
- ❌ Les intervenants peuvent voir tous les projets de l'organisation
- ❌ Pas de système d'invitation sécurisé par projet
- ❌ Pas de portails dédiés par rôle

---

## 🏗️ Nouvelle Architecture

### 1. Hiérarchie des Accès

```
┌─────────────────────────────────────────────────────────┐
│                    ORGANISATION                          │
│  (Promoteur = propriétaire de l'organisation)           │
└──────────────────┬──────────────────────────────────────┘
                   │
      ┌────────────┼────────────┐
      │            │            │
   ┌──▼──┐     ┌──▼──┐     ┌──▼──┐
   │ PR1 │     │ PR2 │     │ PR3 │   Projets
   └──┬──┘     └──┬──┘     └──┬──┘
      │            │            │
   ┌──▼────────────▼────────────▼──────┐
   │  Intervenants spécifiques         │
   │  - Courtier A (PR1)                │
   │  - Architecte B (PR2)              │
   │  - Notaire C (PR1, PR3)            │
   └────────────────────────────────────┘
```

### 2. Types d'Utilisateurs

#### A. **Promoteur** (Organization Owner)
- Accès: **Tous les projets** de son organisation
- Vue: **Dashboard Organisation** avec liste de tous ses projets
- Peut: Créer des projets, inviter des intervenants

#### B. **Employés Internes** (Organization Members)
- Accès: Projets assignés ou tous les projets selon permissions
- Vue: Dashboard organisation filtré
- Peut: Gérer les projets assignés

#### C. **Intervenants Externes** (Project Participants)
- Accès: **Uniquement les projets** auxquels ils sont invités
- Vue: Portail spécifique à leur rôle
- Exemples:
  - **Courtier**: Voit uniquement lots et ventes du projet X
  - **Architecte**: Voit plans et documents du projet Y
  - **Notaire**: Voit dossiers acheteurs du projet Z
  - **Acheteur**: Voit uniquement son lot

---

## 🗺️ Nouveau Flow d'Accès

### Flow Promoteur

```
1. Login → /login
2. Sélection organisation → /select-organization (si plusieurs)
3. Dashboard Organisation → /organization/dashboard
   ├─ Vue d'ensemble: KPIs globaux tous projets
   ├─ Liste de tous les projets
   ├─ Création de nouveaux projets
   └─ Quick actions multi-projets
4. Sélection d'un projet → /projects/{id}/cockpit
5. Modules du projet → /projects/{id}/...
```

### Flow Intervenant (Courtier, Architecte, etc.)

```
1. Réception email d'invitation
   "Vous avez été invité au projet Résidence du Lac"
   [Lien: https://app.realpro.ch/invite/broker?token=xxx]

2. Clic sur le lien → /invite/broker?token=xxx
   ├─ Si pas de compte: Création compte + mot de passe
   └─ Si compte existant: Connexion

3. Validation du token → Accès accordé au projet

4. Redirection vers portail dédié → /projects/{id}/broker/dashboard
   ├─ Vue restreinte au rôle
   └─ Accès uniquement aux modules autorisés

5. Login ultérieur → /login/broker
   ├─ Connexion avec email/password
   └─ Redirection vers /projects/{id}/broker/dashboard
```

### Flow Acheteur

```
1. Réception email après signature réservation
   "Bienvenue dans votre espace acheteur"
   [Lien: https://app.realpro.ch/invite/buyer?token=xxx]

2. Création compte + mot de passe

3. Accès à l'espace acheteur → /projects/{id}/buyer/my-lot
   ├─ Son lot uniquement
   ├─ Choix matériaux
   ├─ Documents
   ├─ Avancement travaux
   └─ SAV

4. Login ultérieur → /login/buyer
```

---

## 🗄️ Modifications Base de Données

### 1. Nouvelle Table: `project_invitations`

```sql
CREATE TABLE project_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Type d'invitation
  role participant_role NOT NULL, -- BROKER, ARCHITECT, NOTARY, etc.

  -- Destinataire
  email text NOT NULL,
  first_name text,
  last_name text,
  company_id uuid REFERENCES companies(id), -- Si entreprise connue

  -- Token sécurisé
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,

  -- Statut
  status invitation_status NOT NULL DEFAULT 'PENDING',
  -- PENDING, ACCEPTED, EXPIRED, REVOKED

  -- Invitation
  invited_by uuid NOT NULL REFERENCES users(id),
  invited_at timestamptz NOT NULL DEFAULT now(),

  -- Acceptation
  accepted_by uuid REFERENCES users(id),
  accepted_at timestamptz,

  -- Message personnalisé
  message text,

  -- Métadonnées
  metadata jsonb, -- Permissions spécifiques, etc.

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE invitation_status AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');
```

### 2. Améliorer: `project_participants`

Ajouter des champs pour tracker l'origine de l'accès:

```sql
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS invitation_id uuid REFERENCES project_invitations(id);
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id);
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS access_level text DEFAULT 'FULL'; -- FULL, READ_ONLY, LIMITED
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS permissions jsonb; -- Permissions granulaires
```

### 3. Améliorer: `users`

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'INTERNAL';
-- INTERNAL: Employé de l'organisation
-- EXTERNAL: Intervenant externe (courtier, architecte, etc.)
-- BUYER: Acheteur

ALTER TABLE users ADD COLUMN IF NOT EXISTS primary_project_id uuid REFERENCES projects(id);
-- Pour les externes: projet principal auquel ils accèdent
```

---

## 🎨 Nouvelles Pages à Créer

### 1. Dashboard Organisation
**Route**: `/organization/dashboard`
**Fichier**: `src/pages/OrganizationDashboard.tsx`

**Contenu**:
```tsx
- Header avec nom de l'organisation
- KPIs globaux:
  - Nombre de projets actifs
  - Total lots vendus (tous projets)
  - CA total
  - Projets en retard
- Liste des projets (cards avec statut)
- Graphiques multi-projets:
  - Ventes par projet
  - Avancement par projet
  - Budget vs réalisé
- Quick actions:
  - Créer un nouveau projet
  - Voir tous les projets
  - Inviter un intervenant
```

### 2. Portails de Connexion Spécifiques

#### A. Portail Courtier
**Routes**:
- `/login/broker` - Connexion
- `/invite/broker?token=xxx` - Acceptation invitation
- `/projects/{id}/broker/dashboard` - Dashboard courtier
- `/projects/{id}/broker/lots` - Lots disponibles
- `/projects/{id}/broker/sales` - Ventes
- `/projects/{id}/broker/commissions` - Commissions

**Fichiers**:
- `src/pages/portals/broker/BrokerLogin.tsx`
- `src/pages/portals/broker/BrokerInvite.tsx`
- `src/pages/portals/broker/BrokerPortalDashboard.tsx`

#### B. Portail Architecte
**Routes**:
- `/login/architect`
- `/invite/architect?token=xxx`
- `/projects/{id}/architect/dashboard`
- `/projects/{id}/architect/plans`
- `/projects/{id}/architect/submissions`

#### C. Portail Notaire
**Routes**:
- `/login/notary`
- `/invite/notary?token=xxx`
- `/projects/{id}/notary/dashboard`
- `/projects/{id}/notary/dossiers`
- `/projects/{id}/notary/acts`

#### D. Portail Acheteur (déjà partiellement existant)
**Améliorer**:
- `/login/buyer`
- `/invite/buyer?token=xxx`
- `/projects/{id}/buyer/*` (déjà existant, à sécuriser)

### 3. Pages d'Invitation

**Route**: `/projects/{id}/team/invite`
**Fichier**: `src/pages/ProjectTeamInvite.tsx`

**Contenu**:
```tsx
- Formulaire d'invitation:
  - Type d'intervenant (select)
  - Email
  - Nom/Prénom
  - Entreprise (select ou nouvelle)
  - Message personnalisé
  - Permissions spécifiques
- Bouton: Envoyer l'invitation
- Liste des invitations en attente
- Liste des intervenants actifs
```

---

## 🔐 Sécurité RLS

### Règles RLS pour `project_participants`

```sql
-- Les utilisateurs voient uniquement les projets auxquels ils participent
CREATE POLICY "Users see only their projects"
  ON project_participants FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    project_id IN (
      SELECT project_id FROM project_participants WHERE user_id = auth.uid()
    )
  );
```

### Règles RLS pour `projects`

```sql
-- Accès aux projets:
-- 1. Organisation owners: tous les projets de leur org
-- 2. Participants: uniquement leurs projets assignés
CREATE POLICY "Access based on participation"
  ON projects FOR SELECT
  TO authenticated
  USING (
    -- Owner de l'organisation
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
    OR
    -- Participant au projet
    id IN (
      SELECT project_id FROM project_participants WHERE user_id = auth.uid()
    )
  );
```

---

## 📧 Système d'Invitations

### 1. Création d'une Invitation

**Edge Function**: `supabase/functions/invitations/index.ts`

```typescript
POST /functions/v1/invitations/create
{
  projectId: "uuid",
  role: "BROKER",
  email: "courtier@example.com",
  firstName: "Jean",
  lastName: "Dupont",
  companyId: "uuid", // optionnel
  message: "Bienvenue sur notre projet!",
  permissions: {...}
}

Response:
{
  invitationId: "uuid",
  token: "secure-random-token",
  inviteUrl: "https://app.realpro.ch/invite/broker?token=xxx",
  expiresAt: "2025-12-15T10:00:00Z"
}
```

### 2. Email d'Invitation

**Template**: `invite_participant_email.html`

```html
Bonjour {{firstName}},

Vous avez été invité à rejoindre le projet **{{projectName}}** en tant que **{{role}}**.

{{#if message}}
Message du promoteur:
"{{message}}"
{{/if}}

Pour accepter cette invitation et accéder au projet, cliquez sur le lien ci-dessous:

[Accepter l'invitation]({{inviteUrl}})

Ce lien expire le {{expiresAt}}.

À bientôt sur RealPro!
```

### 3. Acceptation d'une Invitation

**Page**: `/invite/{role}?token=xxx`

**Flow**:
1. Validation du token
2. Si token valide:
   - Si utilisateur pas connecté:
     - Si compte existe avec cet email: → Login
     - Sinon: → Formulaire création compte
   - Si connecté: → Validation immédiate
3. Création du `project_participant`
4. Redirection vers le portail dédié

---

## 🛣️ Routes Complètes

### Routes Publiques
```
/                          → Landing page
/pricing                   → Tarifs
/login                     → Login promoteur
/login/broker              → Login courtier
/login/architect           → Login architecte
/login/notary              → Login notaire
/login/buyer               → Login acheteur
/register                  → Inscription promoteur
/invite/{role}?token=xxx   → Acceptation invitation
```

### Routes Promoteur (Authentifié + Organization Owner)
```
/select-organization              → Sélection org (si plusieurs)
/organization/dashboard           → Dashboard organisation (NOUVEAU)
/organization/settings            → Paramètres organisation
/projects                         → Liste projets (NOUVEAU)
/projects/new                     → Créer projet
/projects/{id}/cockpit            → Cockpit projet
/projects/{id}/team/invite        → Inviter intervenants (NOUVEAU)
/projects/{id}/*                  → Modules projet (existants)
```

### Routes Courtier (Authentifié + Participant BROKER)
```
/projects/{id}/broker/dashboard   → Dashboard courtier (NOUVEAU)
/projects/{id}/broker/lots        → Lots disponibles
/projects/{id}/broker/sales       → Contrats de vente
/projects/{id}/broker/commissions → Commissions
```

### Routes Architecte (Authentifié + Participant ARCHITECT)
```
/projects/{id}/architect/dashboard → Dashboard architecte (NOUVEAU)
/projects/{id}/architect/plans     → Plans
/projects/{id}/architect/documents → Documents
```

### Routes Acheteur (Authentifié + Buyer)
```
/projects/{id}/buyer/my-lot       → Mon lot (existant)
/projects/{id}/buyer/choices      → Choix matériaux (existant)
/projects/{id}/buyer/documents    → Documents (existant)
```

---

## 📋 Plan d'Implémentation

### Phase 1: Dashboard Organisation
- [ ] Créer `OrganizationDashboard.tsx`
- [ ] Hook `useOrganizationDashboard` pour KPIs multi-projets
- [ ] Page liste des projets améliorée
- [ ] Modifier App.tsx pour rediriger vers org dashboard

### Phase 2: Système d'Invitations
- [ ] Migration: table `project_invitations`
- [ ] Edge function: `invitations/create`
- [ ] Edge function: `invitations/validate`
- [ ] Edge function: `invitations/accept`
- [ ] Page `ProjectTeamInvite.tsx`
- [ ] Template email d'invitation

### Phase 3: Portails de Connexion
- [ ] Pages de login spécifiques (broker, architect, notary, buyer)
- [ ] Pages d'acceptation d'invitation `/invite/{role}`
- [ ] Middleware de redirection selon type d'utilisateur

### Phase 4: Portails Dédiés
- [ ] Dashboard courtier
- [ ] Dashboard architecte
- [ ] Dashboard notaire
- [ ] Améliorer portail acheteur

### Phase 5: Sécurité RLS
- [ ] Policies RLS pour project_participants
- [ ] Policies RLS pour filtrer par projet
- [ ] Tests d'isolation des données

### Phase 6: UX & Polish
- [ ] Guards de navigation selon rôle
- [ ] Messages d'erreur si accès non autorisé
- [ ] Breadcrumbs avec projet actuel
- [ ] Tests end-to-end

---

## 🎯 Résultat Final

### Pour le Promoteur
```
1. Se connecte
2. Voit son dashboard organisation avec tous ses projets
3. Clique sur un projet
4. Accède au cockpit du projet
5. Peut inviter des intervenants depuis "Équipe"
6. Gère tous ses projets depuis un point central
```

### Pour un Courtier
```
1. Reçoit email: "Vous êtes invité au projet Résidence du Lac"
2. Clique sur le lien
3. Crée son compte ou se connecte
4. Accède au portail courtier pour CE projet uniquement
5. Voit les lots, gère les ventes, suit ses commissions
6. Ne voit PAS les autres projets du promoteur
```

### Pour un Acheteur
```
1. Signe une réservation
2. Reçoit email: "Bienvenue dans votre espace acheteur"
3. Crée son compte
4. Accède à son lot uniquement
5. Suit l'avancement, fait ses choix matériaux
6. Ne voit PAS les autres lots ni les autres projets
```

---

## 🔧 Modifications Techniques Clés

### 1. AuthGuard Amélioré
```tsx
<AuthGuard requiredRole="BROKER" projectId="xxx">
  <BrokerDashboard />
</AuthGuard>
```

### 2. Hook useProjectAccess
```tsx
const { hasAccess, role } = useProjectAccess(projectId);

if (!hasAccess) return <AccessDenied />;
```

### 3. Context ProjectParticipant
```tsx
<ProjectParticipantProvider projectId={projectId}>
  <ProjectRoutes />
</ProjectParticipantProvider>
```

---

**Prêt pour implémentation!** 🚀
