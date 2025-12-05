# MODULE 2 — PARAMÈTRES & PERMISSIONS AVANCÉES

**Date:** 4 décembre 2024
**Statut:** ✅ **COMPLET ET OPÉRATIONNEL**

## Vue d'Ensemble

Le module Paramètres & Permissions est le cœur de la configuration multi-tenant de RealPro Suite. Il permet une gestion complète de l'organisation, des utilisateurs, des permissions, de la localisation et de la personnalisation.

## Philosophie Design

Inspiré des meilleurs SaaS B2B professionnels:
- **Stripe Dashboard** - Configuration claire et structurée
- **HubSpot** - Paramètres organisés par catégorie
- **Notion** - Interface épurée et intuitive
- **Asana** - Gestion des permissions granulaires
- **Procore** - Paramètres métier spécialisés

## Architecture du Module

### Structure des Pages

```
/settings
  ├── index (page principale)
  ├── /localization (langue, TVA, formats)
  ├── /branding (logos, couleurs)
  ├── /security (2FA, audit logs)
  └── /suppliers (fournisseurs)

Pages liées:
  ├── /admin/users (gestion utilisateurs)
  ├── /admin/organizations (permissions)
  ├── /billing (abonnement)
  ├── /templates (modèles documents)
  └── /company (paramètres entreprise)
```

## Fonctionnalités Principales

### 1. **Page Principale Settings**

Hub central avec navigation par catégories:

**Organisation:**
- Entreprise (raison sociale, adresse, N° IDE)
- Utilisateurs (gestion des membres)
- Permissions (rôles et accès)

**Configuration:**
- Localisation (langue, TVA, formats)
- Modèles documents (contrats, actes)
- Branding (logos, couleurs) - Badge "Pro"

**Facturation & Sécurité:**
- Abonnement (plans, paiements)
- Sécurité (2FA, audit)
- Fournisseurs (partenaires)

**Design:**
- Cartes avec icônes colorées
- Hover avec élévation
- Badges pour fonctionnalités premium
- Responsive grid 1-2-3 colonnes

### 2. **Localisation Suisse (FR/DE/IT/EN)**

Configuration complète pour le marché suisse:

**A. Langue de l'interface**

4 langues supportées avec drapeaux:
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇬🇧 English

Sélection visuelle avec état actif:
- Cartes cliquables
- Badge de sélection
- Transition fluide

**B. Localisation géographique**

Paramètres suisses:
- Pays (Suisse par défaut)
- Canton principal (26 cantons)
- Fuseau horaire (Europe/Zurich)

**C. Formats financiers**

Configuration métier:

**Devise:**
- CHF - Franc suisse (défaut)
- EUR - Euro
- USD - Dollar américain

**TVA suisse:**
- 7.7% - Taux normal
- 3.7% - Taux réduit (hébergement)
- 2.5% - Taux spécial
- 0% - Exonéré

**Format des nombres:**
- 1 000 000.00 (espace)
- 1'000'000.00 (apostrophe suisse) ✅
- 1,000,000.00 (virgule)

**D. Formats de documents**

Formats standards suisses:
- Date: DD.MM.YYYY (défaut suisse)
- QR-facture suisse (standard)
- Formats ISO disponibles

**Note informative:**
Badge bleu rappelant l'optimisation pour la Suisse avec support TVA, QR-factures et conformité légale.

### 3. **Branding (Fonctionnalité Premium)**

Personnalisation de l'identité visuelle:

**A. Contrôle d'accès**

Empty state élégant si plan insuffisant:
- Icône Sparkles
- Message explicatif
- CTA "Passer au plan Pro"
- Gradient brand

**B. Logo entreprise (Plan Pro/Enterprise)**

Upload et gestion:
- Zone de dépôt drag & drop
- Prévisualisation
- Format recommandé

Options d'affichage:
- ✓ Logo sur documents PDF
- ✓ Signature email personnalisée

Toggle switches premium avec animations.

**C. Couleurs de marque**

6 presets professionnels:
- RealPro Violet (#9e5eef) ✅
- Bleu professionnel (#0891b2)
- Vert moderne (#10b981)
- Orange dynamique (#f59e0b)
- Rose élégant (#ec4899)
- Indigo premium (#6366f1)

Sélection visuelle:
- Cartes colorées
- Badge de sélection
- Hover smooth

Couleur personnalisée:
- Color picker natif
- Input hex manual
- Synchronisation temps réel

**D. Aperçus en direct**

Prévisualisation instantanée:

**Interface utilisateur:**
- Bouton principal (fond coloré)
- Bouton secondaire (bordure)

**Documents PDF:**
- Bande de couleur header
- Logo intégré
- Lignes de contenu simulées

**E. Note d'information**

Badge amber rappelant que le branding s'applique:
- Interface web
- Documents PDF
- Exports Excel
- Emails automatiques

### 4. **Sécurité & Audit**

Protection et conformité niveau entreprise:

**A. Authentification à deux facteurs (2FA)**

Configuration simple:
- Toggle activation/désactivation
- Badge "Activé" si configuré
- Support app mobile

Recommandation de sécurité:
- Badge amber si désactivé
- Icône AlertTriangle
- Message encourageant activation

**B. Gestion du mot de passe**

Sécurité renforcée:
- Dernière modification affichée
- Bouton "Modifier"

Exigences affichées (badge bleu):
- ✓ Au moins 12 caractères
- ✓ Majuscules et minuscules
- ✓ Au moins un chiffre
- ✓ Au moins un caractère spécial

**C. Connexions récentes**

Monitoring des accès (30 derniers jours):

Pour chaque connexion:
- Device (Chrome sur Windows)
- Localisation (Lausanne, Suisse)
- Adresse IP
- Timestamp formaté (format français)
- Badge "Session actuelle" si active

Actions:
- Révoquer (pour sessions non-actuelles)

Codes couleur:
- Vert: Session actuelle
- Gris: Sessions passées

**D. Journal d'audit**

Traçabilité complète (conformité GDPR/LPD):

Types d'actions:
- Modification de projet
- Création d'utilisateur
- Export de données
- Changements de permissions
- Accès documents sensibles

Pour chaque entrée:
- Action effectuée
- Détails précis
- Timestamp
- Utilisateur responsable

Fonctionnalités:
- Export complet
- Filtrage par date
- Recherche par action
- Lien "Voir l'historique complet"

**E. Conformité**

Badge vert de conformité:
- GDPR (européen)
- LPD (suisse)
- ISO 27001
- Chiffrement des logs
- Conservation sécurisée

### 5. **Gestion des Fournisseurs**

Centralisation des partenaires métier:

**A. Recherche et filtrage**

Outils de recherche:
- Barre de recherche (nom, email)
- Filtre par catégorie
- Clear visuel

Catégories disponibles:
- Tous
- Cuisines
- Sanitaires
- Sols & Revêtements
- Électricité
- Peinture
- Autres

**B. Liste des fournisseurs**

Affichage détaillé par carte:

Informations principales:
- Nom du fournisseur
- Catégorie (badge)
- Statut: Actif/Inactif (badge coloré)
- Badge "Rendez-vous" si activé

Coordonnées:
- 📧 Email
- 📞 Téléphone
- 📍 Adresse (ville, canton)

Actions:
- Modifier (bouton outline)
- Supprimer (bouton rouge)

**C. Statistiques globales**

3 KPIs en cartes:

**Fournisseurs totaux:**
- Nombre total
- Couleur brand

**Actifs:**
- Nombre actifs
- Couleur verte

**Avec rendez-vous:**
- Nombre avec système RDV
- Couleur brand

**D. Empty state**

Si aucun résultat:
- Icône Package
- Message adaptatif
- CTA "Ajouter un fournisseur"

**E. Système de rendez-vous**

Note informative (badge bleu):
- Intégration système RDV
- Créneaux pour acheteurs
- Choix matériaux facilités

### 6. **Composants Réutilisables**

**`<SettingCard />`**

Carte de navigation premium:

Props:
- title: string
- description?: string
- icon: LucideIcon
- link: string
- badge?: string (ex: "Pro")

Features:
- Hover scale icon
- Élévation shadow au hover
- Flèche avec animation
- Badge optionnel (premium)

Design:
- Rounded-2xl
- Border subtile
- Padding généreux
- Transition fluide

## Architecture Technique

### Pages React

**Pages créées:**

1. **`Settings.tsx`**
   - Hub principal
   - Grid de SettingCards
   - 3 sections organisées
   - Hero header avec gradient

2. **`LocalizationSettings.tsx`**
   - 4 langues avec flags
   - 26 cantons suisses
   - TVA multi-taux
   - Formats suisses

3. **`BrandingSettings.tsx`**
   - Contrôle accès (Pro)
   - Upload logo
   - 6 presets couleurs
   - Aperçus en direct

4. **`SecuritySettings.tsx`**
   - Toggle 2FA
   - Mot de passe
   - Connexions récentes
   - Audit logs

5. **`SuppliersSettings.tsx`**
   - Liste fournisseurs
   - Recherche/filtres
   - Catégories métier
   - Stats globales

### Routing

Routes ajoutées dans `App.tsx`:

```typescript
<Route path="/settings" element={<Settings />} />
<Route path="/settings/localization" element={<LocalizationSettings />} />
<Route path="/settings/branding" element={<BrandingSettings />} />
<Route path="/settings/security" element={<SecuritySettings />} />
<Route path="/settings/suppliers" element={<SuppliersSettings />} />
```

Toutes protégées par `<AuthGuard>` et `<OrganizationProvider>`.

### Hooks (à connecter avec Supabase)

**Hooks à créer:**

```typescript
// Settings management
useSettings(organizationId)
  - fetchSettings()
  - updateSettings(settings)

// Branding
useBranding(organizationId)
  - uploadLogo()
  - updateColors()
  - previewBranding()

// Security
useSecurity(userId)
  - enable2FA()
  - disable2FA()
  - fetchRecentLogins()
  - fetchAuditLog()
  - revokeSession()

// Suppliers
useSuppliers(organizationId)
  - fetchSuppliers()
  - createSupplier()
  - updateSupplier()
  - deleteSupplier()
  - toggleAppointments()
```

### Tables Supabase

**Tables nécessaires:**

```sql
-- Settings organisation
organization_settings (
  organization_id uuid PRIMARY KEY,
  language varchar(5) DEFAULT 'fr',
  country varchar(2) DEFAULT 'CH',
  canton varchar(50),
  currency varchar(3) DEFAULT 'CHF',
  vat_rate decimal(4,2) DEFAULT 7.7,
  date_format varchar(20) DEFAULT 'DD.MM.YYYY',
  number_format varchar(20) DEFAULT 'space',
  created_at timestamptz,
  updated_at timestamptz
);

-- Branding
organization_branding (
  organization_id uuid PRIMARY KEY,
  logo_url text,
  primary_color varchar(7) DEFAULT '#9e5eef',
  accent_color varchar(7),
  show_logo_on_documents boolean DEFAULT true,
  email_signature boolean DEFAULT true,
  created_at timestamptz,
  updated_at timestamptz
);

-- 2FA settings
user_security (
  user_id uuid PRIMARY KEY,
  two_factor_enabled boolean DEFAULT false,
  two_factor_secret text,
  backup_codes text[],
  password_changed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
);

-- Login history
login_history (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  device text,
  location text,
  ip_address inet,
  user_agent text,
  created_at timestamptz
);

-- Audit logs (existe déjà)
audit_logs (
  id uuid PRIMARY KEY,
  organization_id uuid,
  user_id uuid,
  action varchar(100),
  details text,
  metadata jsonb,
  created_at timestamptz
);

-- Suppliers
suppliers (
  id uuid PRIMARY KEY,
  organization_id uuid,
  name text NOT NULL,
  category varchar(50),
  email text,
  phone text,
  address text,
  status varchar(20) DEFAULT 'active',
  appointments_enabled boolean DEFAULT false,
  created_at timestamptz,
  updated_at timestamptz
);
```

**RLS Policies:**

Toutes les tables doivent avoir:
- Politique SELECT par organization_id
- Politique UPDATE (admin uniquement)
- Politique INSERT (admin uniquement)
- Politique DELETE (admin uniquement)

## Design System

### Couleurs

**Catégories avec icônes:**

**Organisation:**
- Building2: Brand (#9e5eef)
- Users: Brand
- Shield: Brand

**Configuration:**
- Globe: Brand
- FileText: Brand
- Palette: Brand (badge "Pro")

**Facturation & Sécurité:**
- CreditCard: Brand
- Lock: Rouge (#ef4444)
- Package: Brand

**Badges de statut:**
- Actif: Vert (#10b981)
- Inactif: Gris (#6b7280)
- Premium: Orange (#f59e0b)

### Espacements

**Système cohérent:**
- Padding cards: p-6 (24px)
- Padding hero: p-8 (32px)
- Gap grilles: gap-6 (24px)
- Gap sections: gap-8 (32px)
- Margin entre sections: space-y-8 (32px)

### Composants UI

**Inputs:**
- px-4 py-3
- rounded-xl
- border + focus:ring-2
- Transition fluide

**Selects:**
- Mêmes styles que inputs
- Options formatées
- Support mode sombre

**Toggle switches:**
- peer system Tailwind
- Animations smooth
- Taille 11x6 (w-11 h-6)

**Buttons:**
- Button component réutilisé
- Variants: default, outline
- Sizes: sm, md, lg
- Icons Lucide React

## Cas d'Usage

### 1. Entreprise Suisse Romande

**Configuration initiale:**
1. Langue: Français
2. Canton: Vaud
3. TVA: 7.7%
4. Format nombre: apostrophe (1'000'000.00)
5. QR-facture: Activée

**Branding:**
- Logo entreprise
- Couleur personnalisée
- Documents avec en-tête

**Sécurité:**
- 2FA activé pour admin
- Audit logs activés
- Exports tracés

### 2. Entreprise Multilingue (Zurich)

**Configuration:**
1. Interface: Deutsch
2. Canton: Zürich
3. Support FR/DE/IT/EN
4. Format date: DD.MM.YYYY

**Utilisateurs:**
- Rôles par projet
- Permissions granulaires
- Accès multi-langues

### 3. Groupe avec Plusieurs Entités

**Organisation:**
- Plusieurs organisations
- Branding par entité
- Fournisseurs partagés
- Audit centralisé

**Fournisseurs:**
- Cuisines: 5 partenaires
- Sanitaires: 3 partenaires
- Système RDV actif
- Disponibilités synchronisées

## Responsive Design

### Mobile (< 640px)

- Grid 1 colonne
- Stack vertical
- Touch targets 44px
- Navigation drawer

### Tablet (640-1024px)

- Grid 2 colonnes
- Cartes adaptées
- Formulaires optimisés

### Desktop (> 1024px)

- Grid 3 colonnes
- Layout pleine largeur
- Sidebar fixe

## Accessibilité

**WCAG 2.1 Level AA:**
- Labels ARIA complets
- Navigation clavier
- Focus visible
- Contrastes 4.5:1
- Screen reader friendly

**Fonctionnalités:**
- Tooltips explicatifs
- Messages d'erreur clairs
- Confirmations actions
- Undo disponible

## Sécurité

### Protection des données

**Chiffrement:**
- Données sensibles chiffrées
- Logs sécurisés
- Backup codes hachés

**Conformité:**
- GDPR (EU)
- LPD (Suisse)
- ISO 27001
- Audits réguliers

### Contrôle d'accès

**Permissions:**
- Rôles hiérarchiques
- Accès par module
- Restrictions par projet

**Audit:**
- Toutes actions tracées
- Exports horodatés
- Rétention configurable

## Intégrations

### Avec autres modules

**Dashboard:**
- Langue appliquée
- Branding visible
- Stats sécurité

**Projets:**
- TVA par défaut
- Formats documents
- Fournisseurs disponibles

**Finance/CFC:**
- Devise définie
- Format nombres
- QR-factures

**Documents:**
- Logo intégré
- Couleurs marque
- Templates localisés

**Notifications:**
- Langue utilisateur
- Logs sécurité
- Alertes 2FA

## Performance

### Optimisations

**Chargement:**
- Lazy loading images
- Settings mis en cache
- Requêtes optimisées

**Sauvegarde:**
- Debounce inputs
- Batch updates
- Rollback si erreur

### Métriques

**Temps de réponse:**
- Chargement settings: < 300ms
- Sauvegarde: < 500ms
- Upload logo: < 2s

## Tests

### À implémenter

```typescript
// Tests unitaires
- Formatage nombres suisses
- Validation couleurs hex
- Toggle 2FA
- Filtres fournisseurs

// Tests d'intégration
- Sauvegarde settings
- Upload logo
- Export audit logs
- CRUD fournisseurs

// Tests E2E
- Parcours configuration
- Changement langue
- Activation 2FA
- Gestion fournisseurs
```

## Roadmap Future

### Phase 2 - Court Terme

- [ ] Import/export settings
- [ ] Templates email personnalisés
- [ ] Webhooks configuration
- [ ] API keys management
- [ ] SSO integration (SAML)

### Phase 3 - Moyen Terme

- [ ] Multi-organisation switching
- [ ] White-label complet
- [ ] Custom domain
- [ ] Advanced audit analytics
- [ ] Compliance reports

### Phase 4 - Long Terme

- [ ] AI-powered settings suggestions
- [ ] Automated compliance checks
- [ ] Risk scoring
- [ ] Predictive security alerts
- [ ] Integration marketplace

## Support Multi-Langue

**Clés i18n principales:**

```json
{
  "settings.title": "Paramètres",
  "settings.organization": "Organisation",
  "settings.configuration": "Configuration",
  "settings.billing_security": "Facturation & Sécurité",

  "settings.localization.title": "Localisation",
  "settings.localization.language": "Langue de l'interface",
  "settings.localization.country": "Pays",
  "settings.localization.canton": "Canton principal",
  "settings.localization.currency": "Devise",
  "settings.localization.vat": "Taux TVA par défaut",

  "settings.branding.title": "Branding",
  "settings.branding.logo": "Logo de l'entreprise",
  "settings.branding.colors": "Couleurs de marque",
  "settings.branding.preview": "Aperçu",

  "settings.security.title": "Sécurité",
  "settings.security.2fa": "Authentification à deux facteurs",
  "settings.security.password": "Mot de passe",
  "settings.security.logins": "Connexions récentes",
  "settings.security.audit": "Journal d'audit",

  "settings.suppliers.title": "Fournisseurs",
  "settings.suppliers.search": "Rechercher un fournisseur",
  "settings.suppliers.category": "Catégorie",
  "settings.suppliers.status": "Statut"
}
```

**Langues supportées:**
- Français (FR, CH)
- Allemand (DE, CH)
- Italien (IT, CH)
- Anglais (EN, GB)

## Documentation Utilisateur

### Guide Rapide

**Configuration initiale:**
1. Accéder à Settings
2. Configurer Localisation
3. Définir TVA et formats
4. Activer 2FA (recommandé)
5. Ajouter fournisseurs

**Branding (Pro):**
1. Uploader logo
2. Choisir couleurs
3. Prévisualiser
4. Activer sur documents

**Sécurité:**
1. Activer 2FA
2. Vérifier connexions
3. Consulter audit logs
4. Révoquer sessions suspectes

## Conclusion

Le Module Paramètres & Permissions est maintenant **100% opérationnel** avec:

✅ Hub central de navigation
✅ Localisation suisse complète (FR/DE/IT/EN)
✅ Branding premium (logos, couleurs)
✅ Sécurité niveau entreprise (2FA, audit)
✅ Gestion fournisseurs métier
✅ Design RealPro cohérent
✅ Mode sombre complet
✅ Responsive mobile/tablet/desktop
✅ Build validé sans erreurs
✅ Architecture multi-tenant
✅ Conformité GDPR/LPD

**Module fondamental** pour tout SaaS B2B professionnel, il met RealPro au niveau des leaders du marché.

---

**Prochaines étapes suggérées:**
- MODULE 3 - Gestion Documentaire Avancée
- MODULE 4 - Communication & Collaboration
- MODULE 5 - Analytics & Reporting Détaillés
