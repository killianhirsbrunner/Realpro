# Restructuration Multi-Projets - Phase 1 Terminée

**Date**: 8 Décembre 2025
**Statut**: ✅ Phase 1 Complète

---

## 🎯 Objectif de la Restructuration

Transformer RealPro en une **plateforme multi-projets** avec:
- Dashboard organisation pour vue d'ensemble de tous les projets
- Isolation des données par projet
- Système d'invitations sécurisées pour intervenants externes
- Portails dédiés par rôle (courtier, architecte, notaire, acheteur)

---

## ✅ Phase 1: Dashboard Organisation & Système d'Invitations

### 1. Dashboard Organisation Créé

**Fichier**: `src/pages/OrganizationDashboard.tsx`

**Fonctionnalités**:
```tsx
✅ Vue d'ensemble multi-projets
✅ KPIs globaux:
   - Projets actifs
   - Lots vendus (total)
   - Projets on track (santé > 70%)
   - Projets en retard (santé < 50%)
✅ Liste des projets avec cards:
   - Nom et localisation
   - Statut (Planning, Construction, Selling, etc.)
   - Nombre de lots (total, vendus, disponibles)
   - Score de santé du projet
   - Barre de progression commercialisation
✅ Bouton "Nouveau Projet"
✅ Lien rapide vers chaque projet
```

**Design**:
- Interface moderne avec Framer Motion animations
- Cards hover avec effet de transition
- Couleurs adaptées au statut du projet
- Empty state pour organisations sans projets

---

### 2. Hook useOrganizationProjects

**Fichier**: `src/hooks/useOrganizationProjects.ts`

**Fonctionnalités**:
```typescript
✅ Charge tous les projets de l'organisation
✅ Calcule les KPIs globaux
✅ Calcule le score de santé de chaque projet
✅ Gestion du loading et erreurs
✅ Fonction reload() pour rafraîchir les données
```

**Métriques calculées**:
- `total_projects`: Nombre total de projets
- `active_projects`: Projets en construction ou commercialisation
- `total_lots`: Somme de tous les lots
- `sold_lots`: Somme de tous les lots vendus
- `projects_on_track`: Projets avec santé >= 70%
- `projects_delayed`: Projets avec santé < 50%
- `health_score`: Score de santé par projet (0-100)

**Algorithme Health Score**:
```
Base: 70 points

+ Taux de vente:
  > 80% vendus: +20 pts
  > 50% vendus: +10 pts
  < 20% vendus: -20 pts

+ Délais:
  Dépassement date fin: -30 pts

+ Statut:
  COMPLETED: 100 pts
  ARCHIVED: 50 pts

Score final: entre 0 et 100
```

---

### 3. Routing Mis à Jour

**Fichier**: `src/App.tsx`

**Modifications**:
```tsx
// Avant
/dashboard → DashboardGlobal (vue single-project)

// Après
/dashboard → OrganizationDashboard (vue multi-projets)
/dashboard-global → DashboardGlobal (ancien, conservé)
/dashboard-old → Dashboard (ancien, conservé)
```

**Flow utilisateur après connexion**:
```
1. Login → /login
2. Sélection org → /auth/select-organization (si plusieurs)
3. Dashboard org → /dashboard (NOUVEAU)
   ├─ Vue d'ensemble tous projets
   ├─ Clic sur un projet → /projects/{id}/cockpit
   └─ Ou "Nouveau Projet" → /projects/new
```

---

### 4. Système d'Invitations (Base de Données)

**Migration**: `create_project_invitations_system.sql`

#### A. Nouvelle Table: `project_invitations`

```sql
CREATE TABLE project_invitations (
  id uuid PRIMARY KEY,
  project_id uuid → Projet concerné
  organization_id uuid → Organisation
  role participant_role → BROKER, ARCHITECT, NOTARY, etc.

  -- Destinataire
  email text → Email de l'invité
  first_name text
  last_name text
  company_id uuid → Entreprise (optionnel)

  -- Sécurité
  token text UNIQUE → Token sécurisé (32 bytes, base64)
  expires_at timestamptz → Expiration (défaut: 7 jours)
  status invitation_status → PENDING, ACCEPTED, EXPIRED, REVOKED

  -- Invitation
  invited_by uuid → Qui a invité
  invited_at timestamptz

  -- Acceptation
  accepted_by uuid → Qui a accepté
  accepted_at timestamptz

  -- Personnalisation
  message text → Message du promoteur
  permissions jsonb → Permissions granulaires
  metadata jsonb → Données supplémentaires
)
```

**Index créés**:
- `idx_project_invitations_token` → Validation rapide
- `idx_project_invitations_email` → Recherche par email
- `idx_project_invitations_project_id` → Filter par projet
- `idx_project_invitations_status` → Filter par statut

#### B. Améliorations: `project_participants`

```sql
ALTER TABLE project_participants ADD:
  - user_id uuid → Lien avec le compte utilisateur
  - invitation_id uuid → Provenance de l'invitation
  - access_level text → FULL, READ_ONLY, LIMITED
  - permissions jsonb → Permissions spécifiques
```

#### C. Améliorations: `users`

```sql
ALTER TABLE users ADD:
  - user_type user_type → INTERNAL, EXTERNAL, BUYER
  - primary_project_id uuid → Projet principal (pour externes)
```

**Types d'utilisateurs**:
- **INTERNAL**: Employé de l'organisation (accès multi-projets)
- **EXTERNAL**: Intervenant externe (accès projets assignés uniquement)
- **BUYER**: Acheteur (accès à son lot uniquement)

#### D. RLS (Row Level Security)

**Invitations**:
```sql
-- Admins org peuvent gérer toutes les invitations
"Organization admins can manage invitations"

-- Invités peuvent voir leurs propres invitations
"Invitees can view their invitations"
```

**Projets**:
```sql
-- Accès aux projets basé sur:
-- 1. Owner de l'organisation → tous les projets
-- 2. Participant → projets assignés uniquement
"Access to projects based on role"
```

**Participants**:
```sql
-- Voir les participations:
-- 1. Ses propres participations
-- 2. Participations des projets où on est membre
-- 3. Tous si owner de l'org
"Users see their project participations"
```

#### E. Fonctions Utilitaires

```sql
-- Générer un token sécurisé
generate_invitation_token() → text (32 bytes, base64)

-- Marquer les invitations expirées
mark_expired_invitations() → void
```

---

## 🗺️ Architecture Complète (Planifiée)

### Hiérarchie des Accès

```
┌─────────────────────────────────────┐
│         ORGANISATION                 │
│  (Promoteur = Owner)                │
└─────────────┬───────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
 ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
 │ PR1 │  │ PR2 │  │ PR3 │  Projets
 └──┬──┘  └──┬──┘  └──┬──┘
    │        │        │
    └────────┴────────┘
         │
    Intervenants par projet:
    - Courtier A (PR1 uniquement)
    - Architecte B (PR2 uniquement)
    - Notaire C (PR1 + PR3)
    - Acheteur D (PR1, son lot uniquement)
```

---

## 📋 Prochaines Phases

### Phase 2: Edge Functions d'Invitation (À faire)

**Objectif**: Créer les fonctions serverless pour gérer les invitations

**Fichiers à créer**:
```
supabase/functions/invitations/index.ts
├─ POST /create → Créer une invitation
├─ POST /validate → Valider un token
├─ POST /accept → Accepter une invitation
└─ POST /revoke → Révoquer une invitation
```

**Fonctionnalités**:
- Génération de token sécurisé
- Envoi d'email d'invitation
- Validation du token (non expiré, non révoqué)
- Création du project_participant après acceptation
- Gestion des erreurs (token invalide, déjà accepté, etc.)

---

### Phase 3: Pages d'Invitation (À faire)

**Objectif**: Permettre au promoteur d'inviter des intervenants

**Fichiers à créer**:
```
src/pages/ProjectTeamInvite.tsx
src/components/invitation/InvitationForm.tsx
src/components/invitation/InvitationList.tsx
src/hooks/useProjectInvitations.ts
```

**Route**: `/projects/{id}/team/invite`

**Fonctionnalités**:
- Formulaire pour inviter un intervenant:
  - Type (courtier, architecte, notaire, etc.)
  - Email
  - Nom/Prénom
  - Entreprise (select existante ou créer)
  - Message personnalisé
  - Permissions spécifiques
- Liste des invitations en attente
- Liste des participants actifs
- Boutons: Renvoyer invitation, Révoquer

---

### Phase 4: Portails de Connexion (À faire)

**Objectif**: Créer des pages de login spécifiques pour chaque rôle

**Fichiers à créer**:
```
src/pages/portals/LoginBroker.tsx
src/pages/portals/LoginArchitect.tsx
src/pages/portals/LoginNotary.tsx
src/pages/portals/LoginBuyer.tsx
src/pages/portals/InviteAccept.tsx
```

**Routes**:
```
/login/broker → Login courtier
/login/architect → Login architecte
/login/notary → Login notaire
/login/buyer → Login acheteur
/invite/{role}?token=xxx → Accepter invitation
```

**Flow d'acceptation**:
```
1. Clic sur lien email → /invite/broker?token=xxx
2. Validation du token
3. Si pas de compte:
   → Formulaire création compte
4. Si compte existe:
   → Login
5. Création project_participant
6. Redirection → Portail dédié (/projects/{id}/broker/dashboard)
```

---

### Phase 5: Portails Dédiés par Rôle (À faire)

**Objectif**: Créer les dashboards et pages spécifiques pour chaque type d'intervenant

#### A. Portail Courtier

**Routes**:
```
/projects/{id}/broker/dashboard → Dashboard courtier
/projects/{id}/broker/lots → Lots disponibles
/projects/{id}/broker/sales → Contrats de vente
/projects/{id}/broker/commissions → Mes commissions
```

**Fichiers**:
```
src/pages/portals/broker/BrokerPortalDashboard.tsx
src/pages/portals/broker/BrokerPortalLots.tsx
src/pages/portals/broker/BrokerPortalSales.tsx
src/pages/portals/broker/BrokerPortalCommissions.tsx
```

**Fonctionnalités**:
- ✅ Voir uniquement les lots du projet assigné
- ✅ Créer des réservations
- ✅ Gérer ses ventes
- ✅ Suivre ses commissions
- ❌ NE VOIT PAS les autres projets du promoteur
- ❌ NE VOIT PAS les données financières générales

#### B. Portail Architecte

**Routes**:
```
/projects/{id}/architect/dashboard → Dashboard architecte
/projects/{id}/architect/plans → Plans du projet
/projects/{id}/architect/documents → Documents techniques
/projects/{id}/architect/submissions → Soumissions
```

**Fonctionnalités**:
- Voir/uploader plans
- Gérer documents techniques
- Participer aux soumissions
- Accès restreint au projet assigné

#### C. Portail Notaire

**Routes**:
```
/projects/{id}/notary/dashboard → Dashboard notaire
/projects/{id}/notary/dossiers → Dossiers acheteurs
/projects/{id}/notary/acts → Actes notariés
/projects/{id}/notary/signatures → Signatures en cours
```

**Fonctionnalités**:
- Gérer dossiers acheteurs
- Suivre actes notariés
- Gérer signatures électroniques
- Checklist notariale

#### D. Portail Acheteur (Améliorer existant)

**Routes existantes à sécuriser**:
```
/projects/{id}/buyer/my-lot → Mon lot
/projects/{id}/buyer/choices → Choix matériaux
/projects/{id}/buyer/appointments → Mes RDV
/projects/{id}/buyer/progress → Avancement
/projects/{id}/buyer/documents → Mes documents
/projects/{id}/buyer/payments → Mes paiements
```

**Améliorations**:
- ✅ RLS strict: voir uniquement SON lot
- ✅ Login dédié: /login/buyer
- ✅ Invitation après réservation
- ❌ NE VOIT PAS les autres lots
- ❌ NE VOIT PAS les autres acheteurs

---

### Phase 6: Guards & Middleware (À faire)

**Objectif**: Sécuriser les routes et rediriger selon le type d'utilisateur

**Fichiers à créer**:
```
src/components/RoleGuard.tsx → Guard par rôle
src/components/ProjectAccessGuard.tsx → Guard par projet
src/hooks/useProjectAccess.ts → Hook vérification accès
src/contexts/ProjectParticipantContext.tsx → Context participant
```

**Fonctionnalités**:
```tsx
// Guard par rôle
<RoleGuard requiredRole="BROKER" projectId={projectId}>
  <BrokerDashboard />
</RoleGuard>

// Hook d'accès
const { hasAccess, role, permissions } = useProjectAccess(projectId);
if (!hasAccess) return <AccessDenied />;

// Redirect automatique après login selon user_type
if (user.user_type === 'EXTERNAL') {
  redirect(`/projects/${user.primary_project_id}/...`);
}
```

---

## 📊 État d'Avancement Global

### ✅ Complété (Phase 1)
- [x] Architecture de restructuration documentée
- [x] Dashboard Organisation créé
- [x] Hook useOrganizationProjects
- [x] Routing mis à jour
- [x] Base de données (tables + RLS)
- [x] Enums (invitation_status, user_type)
- [x] Index de performance
- [x] Build réussi

### 🚧 En Attente (Phases 2-6)
- [ ] Edge functions d'invitation
- [ ] Templates email d'invitation
- [ ] Pages d'invitation (promoteur)
- [ ] Portails de connexion spécifiques
- [ ] Portails dédiés par rôle
- [ ] Guards et middleware
- [ ] Tests end-to-end
- [ ] Documentation utilisateur

---

## 🎯 Bénéfices de Phase 1

### Pour le Promoteur

**Avant**:
- Vue projet par projet
- Pas de vue d'ensemble
- Difficile de suivre plusieurs projets

**Après**:
```
✅ Dashboard central avec tous ses projets
✅ KPIs globaux en un coup d'œil
✅ Navigation rapide entre projets
✅ Identification rapide des projets en difficulté (score santé)
✅ Base pour inviter des intervenants par projet
```

### Architecture

**Avant**:
- Pas de distinction entre utilisateurs internes/externes
- Tous les utilisateurs voient tous les projets de l'org
- Pas de système d'invitation

**Après**:
```
✅ Types d'utilisateurs (INTERNAL, EXTERNAL, BUYER)
✅ Base de données pour invitations sécurisées
✅ RLS pour isolation des accès par projet
✅ Tokens sécurisés (32 bytes, expiration)
✅ Traçabilité complète (qui a invité qui, quand)
```

---

## 🚀 Exemple de Flow Complet (Futur)

### 1. Promoteur crée un projet
```
1. Login → /login
2. Dashboard org → /dashboard
3. "Nouveau Projet" → /projects/new
4. Renseigne: Nom, Adresse, Commune, Canton
5. Projet créé → /projects/{id}/cockpit
```

### 2. Promoteur invite un courtier
```
1. Dans le projet → /projects/{id}/team/invite
2. Remplit formulaire:
   - Type: Courtier
   - Email: courtier@example.com
   - Nom: Jean Dupont
   - Entreprise: ABC Immobilier
   - Message: "Bienvenue sur notre projet Résidence du Lac"
3. Envoie l'invitation
4. Token généré + email envoyé
```

### 3. Courtier reçoit l'invitation
```
Email:
"Vous avez été invité au projet Résidence du Lac"
[Lien: https://app.realpro.ch/invite/broker?token=xxx]
```

### 4. Courtier accepte
```
1. Clic sur lien → /invite/broker?token=xxx
2. Création de compte (si nouveau)
3. Token validé → project_participant créé
4. Redirection → /projects/{id}/broker/dashboard
```

### 5. Courtier utilise la plateforme
```
1. Login futur → /login/broker
2. Auto-redirect → /projects/{id}/broker/dashboard
3. Voit uniquement:
   - Les lots de CE projet
   - Ses ventes sur CE projet
   - Ses commissions sur CE projet
4. Ne voit PAS:
   - Les autres projets du promoteur
   - Les données des autres courtiers
   - Les données financières globales
```

---

## 📝 Notes Techniques

### Sécurité

**Tokens d'invitation**:
- 32 bytes aléatoires (256 bits)
- Encodés en base64
- Uniques dans la base
- Expiration après 7 jours
- Révocables à tout moment

**RLS (Row Level Security)**:
- Activé sur toutes les tables sensibles
- Filtrage automatique par organization_id
- Filtrage par project_id pour externes
- Policies testées et optimisées

**Permissions**:
- Granulaires (stockées en JSON)
- Par rôle (FULL, READ_ONLY, LIMITED)
- Par projet (isolation complète)

### Performance

**Index créés**:
- Sur token (validation rapide)
- Sur email (recherche invitations)
- Sur project_id (filtrage)
- Sur user_id (participations)
- Sur status (invitations actives)

**Optimisations**:
- Health score calculé côté frontend (pas de surcharge DB)
- Queries optimisées avec .select() spécifiques
- Pas de N+1 queries

---

## ✅ Build Status

```bash
✓ 3848 modules transformed
✓ built in 24.11s
Bundle: 2,371.19 kB (534.05 kB gzipped)
```

---

## 🎯 Prochaine Étape

**Phase 2**: Créer les edge functions pour gérer les invitations

**Priorités**:
1. Edge function `invitations/create`
2. Edge function `invitations/validate`
3. Edge function `invitations/accept`
4. Template email d'invitation
5. Page d'invitation pour promoteur

---

**Fin du rapport Phase 1** 🎉
