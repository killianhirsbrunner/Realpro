# Documentation du Nouveau Flux Utilisateur RealPro

## Vue d'ensemble

Le nouveau flux a été restructuré pour offrir une expérience optimale aux entreprises qui s'inscrivent sur RealPro. Le parcours utilisateur est maintenant centré autour d'un dashboard global multi-projets avec accès direct au module promoteur.

---

## Parcours Utilisateur Complet

### 1. Landing Page → `/`

**Point d'entrée principal** de l'application

- Présentation de RealPro et ses fonctionnalités
- Navigation vers :
  - `/login` - Connexion
  - `/register` - Inscription entreprise
  - `/pricing` - Tarifs
  - `/features` - Fonctionnalités
  - `/contact` - Contact

---

### 2. Inscription Entreprise → `/register`

**Formulaire d'inscription en 2 étapes** collectant un maximum d'informations

#### Étape 1 : Informations Entreprise

Données collectées :
- **Nom de l'entreprise** (obligatoire)
- **Forme juridique** (SA, Sàrl, EI, etc.)
- **Secteur d'activité** (Promotion, Construction, Architecture, etc.)
- **Numéro IDE** (optionnel)
- **Numéro TVA** (optionnel)
- **Adresse complète** (rue, NPA, ville, canton) (obligatoire)
- **Téléphone** (obligatoire)
- **Site web** (optionnel)
- **Taille de l'entreprise** (nombre d'employés)
- **Description** (optionnel)

#### Étape 2 : Contact Principal

Données collectées :
- **Prénom & Nom** (obligatoire)
- **Fonction/Poste** (obligatoire)
- **Email professionnel** (obligatoire)
- **Téléphone direct** (optionnel)
- **Mot de passe** (min. 8 caractères) (obligatoire)
- **Confirmation mot de passe** (obligatoire)

#### Actions automatiques

Après soumission réussie :
1. Création du compte utilisateur dans `auth.users`
2. Création de l'organisation dans `organizations`
3. Création du profil utilisateur dans `users`
4. Liaison utilisateur-organisation dans `user_organizations` avec rôle `PROMOTER`
5. Redirection automatique vers `/dashboard`

---

### 3. Connexion → `/login`

**Formulaire de connexion simple**

- Email
- Mot de passe
- Lien "Mot de passe oublié"
- Lien vers l'inscription

Après connexion réussie → Redirection vers `/dashboard`

---

### 4. Dashboard Home (Global) → `/dashboard`

**Page d'accueil principale après connexion**

#### Vue d'ensemble

Affiche une vue globale de tous les projets avec :

##### KPIs Globaux (4 cartes)

1. **Projets totaux** avec nombre de projets actifs
2. **Notifications** récentes avec lien vers `/notifications`
3. **Messages** non lus avec lien vers `/messages`
4. **Rendez-vous** à venir cette semaine

##### Section Projets

- **Grille de projets** (max 6 affichés) avec :
  - Logo/icône du projet
  - Nom du projet
  - Adresse complète
  - Statut (Actif, En cours, Terminé, etc.)
  - Nombre de lots
  - Bouton d'accès au projet

- **Carte "Nouveau projet"** :
  - Design distinctif (bordure en pointillés)
  - Bouton CTA pour créer un projet
  - Redirection vers `/projects/wizard`

- **Lien "Voir tous"** → `/projects`

##### Sections d'activité

1. **Notifications récentes** (3 dernières)
   - Icône + description
   - Timestamp
   - Lien vers toutes les notifications

2. **Prochains rendez-vous** (2 prochains)
   - Icône + description
   - Date et heure
   - Détails du rendez-vous

#### Actions disponibles

- **Bouton "Nouveau projet"** (en haut à droite) → `/projects/wizard`
- **Clic sur un projet** → `/projects/{projectId}`
- **Clic sur carte "Nouveau projet"** → `/projects/wizard`

#### État "Pas de projet"

Si l'utilisateur n'a aucun projet :
- Message d'accueil
- Grande icône Building2
- Texte explicatif
- Bouton CTA "Créer mon premier projet"

---

### 5. Création de Projet → `/projects/wizard`

**Assistant simplifié de création de projet**

Formulaire minimal avec 4 champs obligatoires :
- **Nom du projet**
- **Adresse**
- **Ville/Commune**
- **Canton** (pré-rempli: Vaud)

#### Message contextuel

Pour les promoteurs créant leur premier projet :
- Bandeau d'information bleu
- Titre : "Première étape pour accéder à RealPro"
- Description des modules qui seront accessibles

#### Après création

Redirection automatique vers `/projects/{projectId}` avec accès complet aux modules

---

### 6. Accès aux Modules (par Projet)

Une fois un projet sélectionné, accès à tous les modules :

#### Modules Principaux

- **Dashboard Projet** → `/projects/{projectId}/dashboard`
- **Lots** → `/projects/{projectId}/lots`
- **CRM** → `/projects/{projectId}/crm/pipeline`
- **Finances** → `/projects/{projectId}/finances`
- **Planning** → `/projects/{projectId}/planning`
- **Documents** → `/projects/{projectId}/documents`
- **Soumissions** → `/projects/{projectId}/submissions`
- **Modifications** → `/projects/{projectId}/modifications`
- **Matériaux** → `/projects/{projectId}/materials`
- **Notaire** → `/projects/{projectId}/notary`
- **SAV** → `/projects/{projectId}/sav`

#### Modules Transversaux

- **Messages** → `/messages` (global)
- **Notifications** → `/notifications` (global)
- **Contacts** → `/contacts` (global)
- **Entreprises** → `/companies` (global)
- **Reporting** → `/reporting` (global)

---

## Architecture des Routes

### Routes Publiques (sans authentification)

```
/                           → Landing Page
/login                      → Connexion
/register                   → Inscription Entreprise (nouveau)
/forgot-password            → Mot de passe oublié
/reset-password             → Réinitialisation mot de passe
/pricing                    → Tarifs
/features                   → Fonctionnalités
/contact                    → Contact
/legal/cgu                  → Conditions générales
/legal/cgv                  → Conditions de vente
/legal/privacy              → Politique de confidentialité
/legal/mentions-legales     → Mentions légales
```

### Routes Authentifiées (AppShell)

```
/dashboard                  → Dashboard Home (nouveau - point central)
/projects                   → Liste des projets
/projects/wizard            → Création de projet (nouveau)
/projects/{id}              → Dashboard projet
/projects/{id}/*            → Tous les modules du projet
/notifications              → Notifications globales
/messages                   → Messages globaux
/contacts                   → Contacts globaux
/companies                  → Entreprises globales
/settings                   → Paramètres
/billing                    → Facturation
```

---

## Changements par Rapport à l'Ancien Flux

### ❌ Ancien Flux

```
Landing → Register (simple) → Choose Plan → Dashboard projet
```

**Problèmes** :
- Inscription trop simple, manque d'informations
- Pas de vue d'ensemble multi-projets
- Obligation de créer un projet immédiatement
- Navigation peu claire

### ✅ Nouveau Flux

```
Landing → Register Entreprise (détaillé) → Dashboard Global → Sélection/Création Projet → Modules
```

**Avantages** :
- Collecte complète des informations entreprise
- Vue d'ensemble claire de tous les projets
- Module promoteur intégré au dashboard
- Navigation intuitive et progressive
- Tableau de bord centralisé avec KPIs
- Notifications et messages groupés

---

## Fichiers Créés/Modifiés

### Nouveaux Fichiers

```
src/pages/auth/RegisterCompany.tsx          → Formulaire inscription détaillé
src/pages/DashboardHome.tsx                 → Dashboard global multi-projets
NEW_USER_FLOW_DOCUMENTATION.md              → Cette documentation
```

### Fichiers Modifiés

```
src/App.tsx                                 → Routes restructurées
src/pages/public/Landing.tsx                → Liens vers /register
```

---

## Base de Données

### Tables Utilisées

#### `organizations`

Nouvelle table stockant toutes les informations entreprise :
- `name` - Nom entreprise
- `legal_form` - Forme juridique (SA, Sàrl, etc.)
- `ide_number` - Numéro IDE suisse
- `vat_number` - Numéro TVA
- `activity_sector` - Secteur d'activité
- `company_size` - Taille entreprise
- `address` - Adresse
- `postal_code` - NPA
- `city` - Ville
- `canton` - Canton
- `phone` - Téléphone
- `website` - Site web
- `description` - Description
- `default_language` - Langue par défaut
- `default_currency` - Devise par défaut

#### `users`

Profil utilisateur étendu :
- `id` - ID utilisateur (FK auth.users)
- `email` - Email
- `first_name` - Prénom
- `last_name` - Nom
- `phone` - Téléphone direct
- `position` - Fonction/Poste
- `language` - Langue préférée
- `is_active` - Statut actif

#### `user_organizations`

Liaison utilisateur-organisation :
- `user_id` - ID utilisateur
- `organization_id` - ID organisation
- `role` - Rôle (PROMOTER, ADMIN, etc.)

---

## Sécurité & RLS

Toutes les données sont protégées par Row Level Security (RLS) :

### Règles RLS Organizations

```sql
-- Les utilisateurs peuvent voir leur organisation
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );
```

### Règles RLS Users

```sql
-- Les utilisateurs peuvent voir leur profil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

---

## Avantages Business

### Pour les Promoteurs

1. **Onboarding complet** - Collecte de toutes les informations dès le départ
2. **Vue 360°** - Vision globale de tous les projets
3. **Accès rapide** - Dashboard centralisé avec accès direct
4. **Multi-projets** - Gestion facilitée de plusieurs projets simultanés
5. **Notifications centralisées** - Tous les événements importants au même endroit

### Pour RealPro

1. **Données enrichies** - Profils entreprises complets dès l'inscription
2. **Meilleure qualification** - Secteur, taille, activité connus
3. **Engagement accru** - Dashboard attractif et fonctionnel
4. **Rétention améliorée** - Navigation intuitive et claire
5. **Support facilité** - Informations complètes pour l'assistance

---

## Prochaines Étapes

### Améliorations Possibles

- [ ] Intégration données Registre du Commerce suisse (IDE)
- [ ] Pré-remplissage automatique via numéro IDE
- [ ] Import en masse de projets depuis Excel
- [ ] Templates de projets par type
- [ ] Dashboard personnalisable par utilisateur
- [ ] Notifications push navigateur
- [ ] Intégration calendrier externe (Google, Outlook)
- [ ] Mode hors-ligne pour le dashboard
- [ ] Export PDF du rapport global
- [ ] Statistiques avancées multi-projets

---

## Support & Contact

Pour toute question sur ce nouveau flux :
- Documentation : `/help`
- Support : contact@realpro.ch
- Téléphone : +41 21 123 45 67
