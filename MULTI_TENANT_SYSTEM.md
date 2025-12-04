# Système Multi-Tenant RealPro

## Vue d'ensemble

RealPro implémente un système multi-tenant complet de niveau entreprise qui permet une isolation totale des données entre les organisations clientes. Chaque organisation (entreprise) a ses propres projets, utilisateurs et données, avec une sécurité garantie par Row Level Security (RLS) au niveau base de données.

## Architecture

### Structure de base de données

```
organizations (Entreprises clientes)
    ↓
users (via user_organizations)
    ↓
projects (Projets immobiliers)
    ↓
lots, buyers, documents, etc. (Modules liés au projet)
```

### Isolation des données

**Niveau 1 : Organisation**
- Chaque entreprise cliente = 1 organisation
- Isolation complète via `organization_id` sur la table `projects`
- RLS policies empêchent tout accès croisé

**Niveau 2 : Projet**
- Chaque projet appartient à 1 organisation
- Les utilisateurs peuvent être assignés à plusieurs projets
- Table `user_roles` avec contexte organisation + projet

**Niveau 3 : Module**
- Chaque donnée (lot, document, etc.) est liée à un projet
- Filtrage automatique via `project_id`
- RLS en cascade depuis l'organisation

## Composants Frontend

### 1. OrganizationContext

Le contexte central qui gère :
- L'organisation active de l'utilisateur
- Le projet actif
- Le changement d'organisation/projet
- Le cache local (localStorage)

```tsx
import { useOrganizationContext } from '../contexts/OrganizationContext';

function MyComponent() {
  const {
    currentOrganization,
    currentProject,
    setCurrentOrganization,
    setCurrentProject
  } = useOrganizationContext();

  // Utiliser currentOrganization et currentProject
}
```

### 2. OrganizationSelector

Composant qui permet de changer d'organisation (si l'utilisateur appartient à plusieurs).
Affiché dans la Sidebar.

### 3. ProjectSelector

Composant qui permet de changer de projet dans l'organisation active.
Affiché dans la Sidebar sous OrganizationSelector.

### 4. Hooks utilitaires

#### `useOrganizationProjects()`
Récupère tous les projets de l'organisation active.

```tsx
const { projects, loading } = useOrganizationProjects();
```

#### `useOrganizationUsers()`
Récupère tous les utilisateurs de l'organisation active.

```tsx
const { users, loading } = useOrganizationUsers();
```

#### `useProjectData<T>(table: string)`
Récupère les données d'une table filtrées par le projet actif.

```tsx
const { data: lots, loading } = useProjectData<Lot>('lots');
```

#### `useOrganizationStats()`
Récupère les statistiques de l'organisation active.

```tsx
const { stats, loading } = useOrganizationStats();
// stats = { totalProjects, activeProjects, totalLots, soldLots, totalUsers }
```

## Pages d'administration

### SuperAdminDashboard (`/admin/super`)

Dashboard réservé aux administrateurs RealPro SA qui permet de :
- Voir toutes les organisations
- Gérer les abonnements
- Voir les statistiques globales
- Accéder aux détails de chaque organisation

**Accès :** Uniquement pour les super-admins RealPro SA

### OrganizationSettings (`/organization/settings`)

Page pour que les administrateurs d'entreprise gèrent leur organisation :
- Informations générales (nom, logo, slug)
- Langue par défaut
- Statistiques de l'organisation
- Liste des utilisateurs

**Accès :** Administrateurs de l'organisation

## Sécurité

### Row Level Security (RLS)

Toutes les tables ont RLS activé avec des policies qui vérifient :

1. **Pour les organizations** :
   ```sql
   WHERE EXISTS (
     SELECT 1 FROM user_organizations
     WHERE organization_id = organizations.id
     AND user_id = auth.uid()
   )
   ```

2. **Pour les projects** :
   ```sql
   WHERE EXISTS (
     SELECT 1 FROM user_organizations
     WHERE organization_id = projects.organization_id
     AND user_id = auth.uid()
   )
   ```

3. **Pour les données projet** (lots, documents, etc.) :
   ```sql
   WHERE EXISTS (
     SELECT 1 FROM projects p
     JOIN user_organizations uo ON p.organization_id = uo.organization_id
     WHERE p.id = [table].project_id
     AND uo.user_id = auth.uid()
   )
   ```

### Permissions

Système de permissions basé sur :
- **Rôles** : Admin, Manager, User, etc.
- **Permissions** : projects.create, lots.update, etc.
- **Contexte** : Organisation + Projet

Table `user_roles` :
```sql
user_id + organization_id + role_id = permissions dans l'organisation
```

## Flux utilisateur

### Connexion
1. L'utilisateur se connecte
2. `OrganizationContext` charge ses organisations via `user_organizations`
3. Si plusieurs organisations : sélection de l'organisation par défaut
4. Chargement des projets de l'organisation
5. Sélection du projet par défaut (dernier utilisé ou premier)

### Navigation
1. L'utilisateur peut changer d'organisation via `OrganizationSelector`
2. Au changement d'organisation, les projets sont rechargés
3. L'utilisateur peut changer de projet via `ProjectSelector`
4. Toutes les vues affichent les données du projet actif

### Isolation automatique
Tous les hooks et composants utilisent automatiquement :
- `currentOrganization.id` pour filtrer au niveau organisation
- `currentProject.id` pour filtrer au niveau projet

Exemple de requête automatiquement scopée :
```tsx
// Dans n'importe quel composant
const { data: lots } = useProjectData<Lot>('lots');
// Renvoie uniquement les lots du projet actif
// Impossible d'accéder aux lots d'un autre projet
```

## Scénarios d'utilisation

### Scénario 1 : Entreprise mono-projet

**Promotions Genevoises SA** :
- 1 organisation
- 1 seul projet actif à la fois
- 5 utilisateurs internes

**Comportement** :
- OrganizationSelector masqué (1 seule organisation)
- ProjectSelector affiche le projet unique
- Navigation simple, pas de confusion possible

### Scénario 2 : Entreprise multi-projets

**Schmidt Développement Immobilier** :
- 1 organisation
- 10 projets simultanés
- 20 utilisateurs (certains sur plusieurs projets)

**Comportement** :
- OrganizationSelector masqué
- ProjectSelector affiche les 10 projets
- Chaque utilisateur voit uniquement ses projets assignés
- Changement de projet en 1 clic

### Scénario 3 : Consultant multi-entreprises

**Jean Dupont, architecte externe** :
- 3 organisations clientes
- Assigné à 1 projet par organisation

**Comportement** :
- OrganizationSelector visible avec 3 choix
- Au changement d'organisation, le contexte change totalement
- Projets différents pour chaque organisation
- Isolation totale : impossible de voir les données d'une autre organisation

### Scénario 4 : Super Admin RealPro SA

**Admin RealPro** :
- Accès à toutes les organisations
- Dashboard spécial `/admin/super`
- Gestion des abonnements et statistiques globales

**Comportement** :
- Vue globale de toutes les organisations
- Peut consulter les détails de chaque organisation
- Gère les limites d'abonnement (nombre de projets, utilisateurs)

## Évolutivité

### Ajout d'une nouvelle organisation

1. Créer l'organisation dans la table `organizations`
2. Créer le premier utilisateur admin
3. Lier via `user_organizations` avec `is_default = true`
4. Assigner le rôle admin via `user_roles`

```sql
-- Exemple
INSERT INTO organizations (name, slug, default_language)
VALUES ('Nouvelle Entreprise SA', 'nouvelle-entreprise', 'FR');

INSERT INTO user_organizations (user_id, organization_id, is_default)
VALUES ('user-uuid', 'org-uuid', true);
```

### Ajout d'un utilisateur à une organisation

```sql
INSERT INTO user_organizations (user_id, organization_id)
VALUES ('user-uuid', 'org-uuid');

INSERT INTO user_roles (user_id, organization_id, role_id)
VALUES ('user-uuid', 'org-uuid', 'role-uuid');
```

### Migration de données

Pour migrer un projet d'une organisation à une autre :

```sql
UPDATE projects
SET organization_id = 'new-org-uuid'
WHERE id = 'project-uuid';
```

Toutes les données liées au projet (lots, documents, etc.) restent automatiquement liées.

## Bonnes pratiques

### 1. Toujours utiliser le contexte

❌ Mauvais :
```tsx
const { data } = await supabase.from('projects').select('*');
```

✅ Bon :
```tsx
const { projects } = useOrganizationProjects();
```

### 2. Vérifier l'organisation active

```tsx
const { currentOrganization } = useOrganizationContext();

if (!currentOrganization) {
  return <div>Veuillez sélectionner une organisation</div>;
}
```

### 3. Scoper les requêtes manuelles

Si vous devez faire une requête Supabase directe :

```tsx
const { currentOrganization, currentProject } = useOrganizationContext();

const { data } = await supabase
  .from('lots')
  .select('*')
  .eq('project_id', currentProject.id);
```

### 4. Gérer le chargement

```tsx
const { currentOrganization, loading } = useOrganizationContext();

if (loading) {
  return <LoadingSpinner />;
}
```

## Limites et contraintes

### Limites par plan

- **Starter** : 3 projets max, 5 utilisateurs
- **Business** : 20 projets max, 50 utilisateurs
- **Enterprise** : Illimité

Ces limites sont stockées dans la table `subscription_plans` et vérifiées côté backend.

### Performance

- Index sur `organization_id` pour toutes les tables
- RLS policies optimisées pour éviter les scans complets
- Cache localStorage pour l'organisation/projet actifs

## Dépannage

### Problème : Utilisateur ne voit aucune organisation

**Cause** : L'utilisateur n'est lié à aucune organisation via `user_organizations`

**Solution** :
```sql
SELECT * FROM user_organizations WHERE user_id = 'user-uuid';
-- Si vide, créer la liaison
```

### Problème : Accès refusé à un projet

**Cause** : RLS policy bloque l'accès

**Solution** : Vérifier que l'utilisateur appartient bien à l'organisation du projet
```sql
SELECT * FROM projects p
JOIN user_organizations uo ON p.organization_id = uo.organization_id
WHERE p.id = 'project-uuid' AND uo.user_id = 'user-uuid';
```

### Problème : Données d'une autre organisation visibles

**Cause** : RLS policy défaillante (🚨 CRITIQUE)

**Solution** : Vérifier immédiatement les policies RLS et les corriger

## Conformité

### RGPD

- Isolation complète des données par organisation
- Possibilité d'export/suppression par organisation
- Logs d'accès via `audit_log`

### Hébergement Suisse

- Données hébergées en Suisse (Supabase région EU)
- Conforme aux exigences bancaires suisses
- Backup automatique quotidien

## Conclusion

Le système multi-tenant de RealPro est :
- ✅ Scalable (des centaines d'organisations possibles)
- ✅ Sécurisé (RLS + permissions multi-niveaux)
- ✅ Performant (index optimisés, cache)
- ✅ Facile à utiliser (contexte + hooks)
- ✅ Conforme (RGPD, Suisse)

Il permet à RealPro de fonctionner comme un vrai SaaS B2B professionnel, prêt pour la commercialisation.
