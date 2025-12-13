# REALPRO SUITE - Architecture & Plan de Migration

> **Version:** 2.0
> **Date:** 2025-12-13
> **Auteur:** Architecture Team
> **Statut:** Document de référence

**3 Applications distinctes, indépendantes, sous la marque Realpro Suite :**
1. **PPE Admin** - Administrateur de copropriétés (syndic)
2. **Promoteur** - Promotion immobilière
3. **Régie** - Gérance immobilière

---

## Table des matières

1. [Diagnostic du repo actuel](#1-diagnostic-du-repo-actuel)
2. [Architecture cible recommandée](#2-architecture-cible-recommandée)
3. [Arborescence CODE/PACKAGES](#3-arborescence-codepackages)
4. [Règles de frontières](#4-règles-de-frontières)
5. [Arborescence MENUS/MODULES UI](#5-arborescence-menusmodules-ui)
6. [Routing & Déploiement](#6-routing--déploiement)
7. [Plan de migration & Risques](#7-plan-de-migration--risques)

---

## 1. Diagnostic du repo actuel

### 1.1 Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Framework** | React | 18.3.1 |
| **Build Tool** | Vite | 5.4.2 |
| **Language** | TypeScript | 5.5.3 |
| **Package Manager** | pnpm workspaces | 8.15.0 |
| **Monorepo Tool** | Turborepo | 2.0.0 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **State Management** | Zustand | 4.5.7 |
| **Server State** | TanStack Query | 5.17.0 |
| **Routing** | React Router DOM | 6.20.1 |
| **Backend** | Supabase (PostgreSQL) | 2.57.4 |
| **i18n** | i18next | 23.7.6 (FR, DE, EN, IT) |

### 1.2 Structure Actuelle

```
/home/user/Realpro/
├── apps/
│   ├── ppe-admin/          # Shell PPE (pages basiques, 14 routes)
│   ├── promoteur/          # Shell Promoteur (pages basiques, 9 routes)
│   └── regie/              # Shell Régie (pages basiques, 12 routes)
├── packages/
│   ├── ui/                 # Design system (28+ composants)
│   ├── auth/               # Authentification Supabase
│   ├── entities/           # Types partagés (PROBLÈME: contient métier)
│   ├── i18n/               # Internationalisation
│   ├── config/             # Config ESLint/TS/Prettier
│   ├── core/               # Contexts & hooks communs
│   └── shared-utils/       # Utilitaires (api, format, validation)
├── src/                    # APP MONOLITHIQUE (150+ pages) - Promoteur complet
└── supabase/
    ├── functions/          # 33 Edge Functions
    └── migrations/         # 20 migrations SQL
```

### 1.3 État de Maturité par Application

| Application | État | Pages | Fonctionnalités |
|-------------|------|-------|-----------------|
| **Promoteur** (`/src/`) | **Production** | 150+ | Complètes |
| **Promoteur** (`/apps/promoteur/`) | Shell | 9 | Basiques |
| **PPE Admin** (`/apps/ppe-admin/`) | Shell | 14 | Basiques |
| **Régie** (`/apps/regie/`) | Shell | 12 | Basiques |

### 1.4 Modules Promoteur Existants (dans `/src/`)

| Module | Status | Écrans clés |
|--------|--------|-------------|
| Gestion Projets | Complet | Cockpit, Overview, Timeline, Team |
| Lots & Inventaire | Complet | Liste, Détail, Pricing, Disponibilité |
| CRM & Prospects | Complet | Pipeline Kanban, Prospects, Réservations |
| Acquéreurs | Complet | Profils, Documents, Paiements, Portail |
| Finance & Budget | Complet | CFC, Factures, Trésorerie, Simulateur |
| Construction | Complet | Avancement, Qualité, Photos, Planning |
| Matériaux & Choix | Complet | Catalogue, Sélections, RDV Fournisseurs |
| Soumissions | Complet | Appels d'offres, Comparaisons, Clarifications |
| Notaire & Legal | Complet | Checklist, Dossier, Signatures |
| SAV | Complet | Tickets, Garanties, Suivi |
| Courtiers | Complet | Portail, Commissions, Contrats |
| Admin | Complet | Users, Orgs, Audit, Feature Flags |

### 1.5 Couplages Problématiques

| Problème | Impact | Criticité |
|----------|--------|-----------|
| `/src/` monolithique vs `/apps/promoteur/` | Duplication, confusion | **HAUTE** |
| `packages/entities` contient types métier | Couplage inter-apps | **HAUTE** |
| Base de données unique sans isolation | Risque de collision | **MOYENNE** |
| Migrations SQL globales | Dépendance release | **MOYENNE** |
| Pas de règle lint anti-import croisé | Risque futur | **BASSE** |

---

## 2. Architecture cible recommandée

### Recommandation : **OPTION A - Monorepo pnpm Workspaces**

| Critère | Option A (Monorepo) | Option B (Multi-repo) |
|---------|---------------------|----------------------|
| **Coût migration** | Faible (restructurer) | Élevé (séparer) |
| **Time-to-value** | 2-3 semaines | 6-8 semaines |
| **Partage UI kit** | Natif (workspace) | Complexe (npm publish) |
| **CI/CD** | Un pipeline, builds séparés | 4 pipelines distincts |
| **DX (expérience dev)** | Excellente | Fragmentée |
| **Releases indépendantes** | Possible avec Turbo | Natif |

**Verdict : Option A** car :
1. La structure monorepo existe déjà
2. Les packages partagés sont en place
3. Turborepo permet des builds/deploys isolés
4. Migration = réorganisation, pas réécriture

---

## 3. Arborescence CODE/PACKAGES

### 3.1 Structure Cible

```
realpro/
│
├── apps/
│   │
│   ├── ppe-admin/                    # APP 1 : Administrateur PPE
│   │   ├── src/
│   │   │   ├── app/routes/           # Définitions routes PPE
│   │   │   ├── features/             # Modules métier PPE
│   │   │   │   ├── properties/       # Immeubles & lots PPE
│   │   │   │   │   ├── api/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── components/
│   │   │   │   │   └── types.ts
│   │   │   │   ├── coowners/         # Copropriétaires
│   │   │   │   ├── assemblies/       # Assemblées générales
│   │   │   │   ├── budget/           # Budget prévisionnel
│   │   │   │   ├── accounting/       # Comptabilité PPE
│   │   │   │   ├── funds/            # Fonds de rénovation
│   │   │   │   ├── charges/          # Répartition charges
│   │   │   │   ├── works/            # Travaux & entretien
│   │   │   │   ├── tickets/          # Tickets SAV
│   │   │   │   ├── documents/        # GED PPE
│   │   │   │   ├── suppliers/        # Fournisseurs
│   │   │   │   └── settings/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── entities/             # Types LOCAUX PPE
│   │   │   └── lib/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── promoteur/                    # APP 2 : Promoteur Immobilier
│   │   ├── src/
│   │   │   ├── app/routes/
│   │   │   ├── features/
│   │   │   │   ├── projects/         # Gestion projets
│   │   │   │   ├── lots/             # Lots & inventaire
│   │   │   │   ├── buyers/           # Acquéreurs
│   │   │   │   ├── crm/              # CRM & prospects
│   │   │   │   ├── finance/          # Finance & CFC
│   │   │   │   ├── construction/     # Suivi chantier
│   │   │   │   ├── materials/        # Matériaux & choix
│   │   │   │   ├── submissions/      # Soumissions
│   │   │   │   ├── notary/           # Notaire & legal
│   │   │   │   ├── sav/              # Service après-vente
│   │   │   │   ├── brokers/          # Courtiers
│   │   │   │   ├── documents/
│   │   │   │   └── settings/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── entities/             # Types LOCAUX Promoteur
│   │   │   └── lib/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── regie/                        # APP 3 : Régie Immobilière
│   │   ├── src/
│   │   │   ├── app/routes/
│   │   │   ├── features/
│   │   │   │   ├── properties/       # Immeubles & objets
│   │   │   │   ├── tenants/          # Locataires
│   │   │   │   ├── leases/           # Baux & contrats
│   │   │   │   ├── rent/             # Loyers & encaissements
│   │   │   │   ├── owners/           # Propriétaires bailleurs
│   │   │   │   ├── accounting/       # Comptabilité gérance
│   │   │   │   ├── moves/            # États des lieux
│   │   │   │   ├── maintenance/      # Maintenance technique
│   │   │   │   ├── tickets/          # Tickets locataires
│   │   │   │   ├── indexation/       # Indexation loyers
│   │   │   │   ├── documents/
│   │   │   │   └── settings/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── entities/             # Types LOCAUX Régie
│   │   │   └── lib/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── shell/                        # Site vitrine Realpro Suite
│       ├── src/pages/                # Landing, Pricing, Features
│       └── package.json
│
├── packages/                         # SHARED TECHNIQUE UNIQUEMENT
│   ├── ui/                           # Design System
│   │   └── src/components/           # Button, Modal, DataGrid...
│   ├── auth/                         # Auth (sans règles métier)
│   │   └── src/                      # useAuth, AuthGuard, LoginForm
│   ├── storage/                      # Moteur fichiers
│   ├── notifications/                # Moteur notifications
│   ├── i18n/                         # Internationalisation
│   ├── logging/                      # Audit & monitoring
│   ├── utils/                        # Formatage, validation, HTTP
│   └── config/                       # ESLint, TS, Tailwind
│
├── supabase/
│   ├── functions/
│   │   ├── _shared/
│   │   ├── ppe/
│   │   ├── promoteur/
│   │   └── regie/
│   └── migrations/
│       ├── 000_shared/               # Tables communes
│       ├── 100_ppe/                  # Schema PPE
│       ├── 200_promoteur/            # Schema Promoteur
│       └── 300_regie/                # Schema Régie
│
├── docs/
├── turbo.json
├── pnpm-workspace.yaml
└── .github/workflows/
    ├── deploy-ppe.yml
    ├── deploy-promoteur.yml
    └── deploy-regie.yml
```

### 3.2 Règle Anti-Import Croisé

```
╔══════════════════════════════════════════════════════════════════╗
║  RÈGLE STRICTE : NO CROSS-IMPORT DE LOGIQUE MÉTIER ENTRE APPS   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  AUTORISÉ :                                                      ║
║     apps/ppe-admin → packages/ui                                 ║
║     apps/promoteur → packages/auth                               ║
║     apps/regie → packages/utils                                  ║
║                                                                  ║
║  INTERDIT :                                                      ║
║     apps/ppe-admin → apps/promoteur                              ║
║     apps/regie → apps/ppe-admin/features/*                       ║
║     packages/* → apps/*/features/*                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 4. Règles de frontières

### 4.1 Shared AUTORISÉ (technique)

| Package | Contenu |
|---------|---------|
| `@realpro/ui` | Composants UI génériques (Button, Modal, DataGrid) |
| `@realpro/auth` | Auth Supabase, guards, useAuth |
| `@realpro/storage` | Upload/download fichiers |
| `@realpro/notifications` | Moteur notifications |
| `@realpro/i18n` | Config i18next |
| `@realpro/logging` | Logger, audit |
| `@realpro/utils` | Formatage CHF, validation IBAN |
| `@realpro/config` | ESLint, TS, Tailwind presets |

### 4.2 Shared INTERDIT (métier)

| Interdit | Alternative |
|----------|-------------|
| Calcul charges PPE | `apps/ppe-admin/features/charges` |
| Pipeline CRM promoteur | `apps/promoteur/features/crm` |
| Calcul indexation loyers | `apps/regie/features/indexation` |
| Entités métier communes | Types locaux par app |
| "Services immobilier core" | Interdit |

---

## 5. Arborescence MENUS/MODULES UI

### 5.1 PPE-ADMIN (Syndic/Copropriétés)

```
PPE-01  TABLEAU DE BORD
        Objectif : Vue d'ensemble du portefeuille PPE
        Écrans : Dashboard KPIs, Alertes, Tâches, Calendrier
        Actions : Accès rapide, Filtrer par immeuble
        Objets : Immeuble, Lot, Ticket, AG

PPE-02  IMMEUBLES & LOTS
        Objectif : Gestion du parc immobilier en copropriété
        Écrans : Liste immeubles, Fiche immeuble, Lots, Millièmes
        Actions : Créer immeuble, Ajouter lot, Modifier millièmes
        Objets : Immeuble, Lot, Quote-part, Millième

PPE-03  COPROPRIÉTAIRES
        Objectif : Gestion des propriétaires et droits
        Écrans : Liste, Fiche, Historique, Mutations, Procurations
        Actions : Ajouter, Transférer propriété, Gérer procurations
        Objets : Copropriétaire, Lot, Procuration, Mutation

PPE-04  ASSEMBLÉES GÉNÉRALES
        Objectif : Organisation et suivi des AG
        Écrans : Liste AG, Convocation, ODJ, Votes, PV, Résolutions
        Actions : Créer AG, Envoyer convocations, Gérer votes, PV
        Objets : Assemblée, Convocation, Vote, Résolution, PV

PPE-05  BUDGET PRÉVISIONNEL
        Objectif : Élaboration et suivi budget annuel
        Écrans : Budget N/N+1, Comparatif, Simulation, Approbation
        Actions : Créer budget, Simuler, Soumettre AG
        Objets : Budget, Poste, Simulation, Appel de fonds

PPE-06  COMPTABILITÉ PPE
        Objectif : Tenue des comptes copropriété
        Écrans : Journal, Grand livre, Balance, Bilan, Comptes
        Actions : Saisir écriture, Lettrer, Clôturer exercice
        Objets : Écriture, Compte, Exercice, Décompte

PPE-07  CHARGES & DÉCOMPTES
        Objectif : Répartition et facturation charges
        Écrans : Décompte annuel, Répartition, Appels trimestriels
        Actions : Calculer, Générer décomptes, Envoyer appels
        Objets : Charge, Clé répartition, Décompte, Appel

PPE-08  FONDS DE RÉNOVATION
        Objectif : Gestion fonds prévoyance (art. 712m CC)
        Écrans : État fonds, Contributions, Prévisions travaux
        Actions : Paramétrer cotisations, Affecter fonds
        Objets : Fonds, Contribution, Affectation

PPE-09  TRAVAUX & ENTRETIEN
        Objectif : Planification et suivi travaux
        Écrans : Liste travaux, Fiche, Devis, Planning
        Actions : Créer demande, Demander devis, Valider, Réceptionner
        Objets : Travail, Devis, Fournisseur, Facture

PPE-10  TICKETS & RÉCLAMATIONS
        Objectif : Traitement demandes copropriétaires
        Écrans : Liste tickets, Détail, Historique
        Actions : Créer, Assigner, Commenter, Clôturer
        Objets : Ticket, Commentaire, Pièce jointe

PPE-11  FOURNISSEURS & CONTRATS
        Objectif : Gestion prestataires et contrats
        Écrans : Liste fournisseurs, Fiche, Contrats, Échéancier
        Actions : Ajouter, Créer contrat, Renouveler
        Objets : Fournisseur, Contrat, Prestation

PPE-12  DOCUMENTS
        Objectif : GED copropriété
        Écrans : Arborescence, Recherche, Partage
        Actions : Uploader, Classer, Partager
        Objets : Document, Dossier, Version

PPE-13  PORTAIL COPROPRIÉTAIRES
        Objectif : Espace self-service
        Écrans : Mon espace, Mes documents, Mes charges
        Actions : Consulter solde, Télécharger, Créer ticket
        Objets : Vue copropriétaire limitée

PPE-14  PARAMÈTRES
        Objectif : Configuration app PPE
        Écrans : Paramètres, Utilisateurs, Templates
        Actions : Configurer, Gérer accès
        Objets : Paramètre, Template, Utilisateur
```

### 5.2 PROMOTEUR (Promotion immobilière)

```
PRO-01  TABLEAU DE BORD
        Objectif : Vue pipeline projets
        Écrans : Dashboard global, KPIs ventes, Pipeline, Alertes
        Actions : Accès rapide projet, Filtrer
        Objets : Projet, Lot, Vente, Alerte

PRO-02  PROJETS
        Objectif : Gestion projets immobiliers
        Écrans : Liste projets, Cockpit, Overview, Team, Timeline
        Actions : Créer projet, Configurer équipe, Gérer phases
        Objets : Projet, Phase, Membre équipe

PRO-03  LOTS & INVENTAIRE
        Objectif : Gestion stock lots
        Écrans : Grille lots, Fiche lot, Pricing, Plans, Options
        Actions : Créer lot, Modifier prix, Réserver, Bloquer
        Objets : Lot, Prix, Option, Plan

PRO-04  CRM & PROSPECTS
        Objectif : Gestion commerciale
        Écrans : Pipeline Kanban, Liste prospects, Fiche, Scoring
        Actions : Ajouter prospect, Qualifier, Planifier RDV
        Objets : Prospect, Contact, RDV, Opportunité

PRO-05  RÉSERVATIONS
        Objectif : Gestion réservations avant acte
        Écrans : Liste réservations, Fiche, Conditions
        Actions : Créer, Valider, Annuler, Transformer
        Objets : Réservation, Lot, Prospect

PRO-06  ACQUÉREURS
        Objectif : Suivi acheteurs
        Écrans : Liste acquéreurs, Fiche, Documents, Paiements
        Actions : Créer dossier, Uploader docs, Suivre paiements
        Objets : Acquéreur, Document, Paiement

PRO-07  PORTAIL ACQUÉREUR
        Objectif : Espace client
        Écrans : Mon lot, Mes documents, Mes paiements, Choix
        Actions : Consulter, Télécharger, Valider choix
        Objets : Vue acquéreur limitée

PRO-08  FINANCE & CFC
        Objectif : Suivi financier et budget CFC
        Écrans : Budget CFC, Engagements, Factures, Trésorerie
        Actions : Saisir facture, Valider paiement, Simuler
        Objets : Poste CFC, Facture, Paiement

PRO-09  CONSTRUCTION
        Objectif : Suivi chantier
        Écrans : Planning, Avancement, Photos, Rapports, Qualité
        Actions : Mettre à jour, Ajouter photos, Signaler défaut
        Objets : Phase, Avancement, Photo, Défaut

PRO-10  MATÉRIAUX & CHOIX
        Objectif : Options et personnalisations
        Écrans : Catalogue, Sélections, RDV fournisseurs
        Actions : Configurer catalogue, Enregistrer choix
        Objets : Matériau, Choix, RDV, Fournisseur

PRO-11  SOUMISSIONS
        Objectif : Appels d'offres
        Écrans : Liste soumissions, Comparatif, Adjudications
        Actions : Lancer appel, Comparer, Adjuger
        Objets : Soumission, Offre, Entreprise

PRO-12  MODIFICATIONS (AVENANTS)
        Objectif : Travaux modificatifs acquéreurs
        Écrans : Demandes, Chiffrage, Validation, Signature
        Actions : Créer, Chiffrer, Faire signer
        Objets : Modification, Avenant, Chiffrage

PRO-13  NOTAIRE & LEGAL
        Objectif : Préparation actes
        Écrans : Checklist notaire, Dossier, Signatures
        Actions : Préparer dossier, Relancer docs
        Objets : Dossier notaire, Document, Acte

PRO-14  COURTIERS
        Objectif : Réseau courtiers
        Écrans : Liste courtiers, Portail, Commissions
        Actions : Ajouter courtier, Assigner lots
        Objets : Courtier, Commission, Contrat

PRO-15  SAV
        Objectif : Réclamations post-livraison
        Écrans : Tickets SAV, Interventions, Garanties
        Actions : Créer ticket, Planifier, Clôturer
        Objets : Ticket SAV, Intervention, Garantie

PRO-16  DOCUMENTS
        Objectif : GED projet
        Écrans : Documents projet, Templates, Signatures
        Actions : Uploader, Générer, Faire signer
        Objets : Document, Template, Signature

PRO-17  REPORTING
        Objectif : Tableaux de bord
        Écrans : Rapport ventes, Finance, CFC
        Actions : Générer rapport, Exporter
        Objets : Rapport, Graphique

PRO-18  PARAMÈTRES
        Objectif : Configuration app
        Écrans : Paramètres, Utilisateurs, Rôles
        Actions : Configurer, Gérer accès
        Objets : Paramètre, Utilisateur, Rôle
```

### 5.3 RÉGIE (Gérance immobilière)

```
REG-01  TABLEAU DE BORD
        Objectif : Vue portefeuille gérance
        Écrans : Dashboard KPIs, Taux occupation, Impayés, Alertes
        Actions : Accès rapide, Filtrer par propriétaire
        Objets : Immeuble, Objet, Bail, Impayé

REG-02  IMMEUBLES & OBJETS
        Objectif : Gestion parc en gérance
        Écrans : Liste immeubles, Fiche, Objets, Équipements
        Actions : Créer immeuble, Ajouter objet
        Objets : Immeuble, Objet locatif, Équipement

REG-03  PROPRIÉTAIRES
        Objectif : Gestion mandants
        Écrans : Liste propriétaires, Fiche, Mandats, Portefeuille
        Actions : Ajouter, Créer mandat, Envoyer rapport
        Objets : Propriétaire, Mandat, Immeuble

REG-04  LOCATAIRES
        Objectif : Gestion locataires
        Écrans : Liste locataires, Fiche, Historique baux, Garants
        Actions : Créer locataire, Lier bail, Gérer garants
        Objets : Locataire, Bail, Garant

REG-05  BAUX & CONTRATS
        Objectif : Gestion contrats location
        Écrans : Liste baux, Fiche bail, Avenants, Résiliations
        Actions : Créer bail, Renouveler, Modifier, Résilier
        Objets : Bail, Avenant, Condition

REG-06  LOYERS & ENCAISSEMENTS
        Objectif : Facturation et paiements
        Écrans : Avis loyer, Encaissements, Impayés, Relances
        Actions : Générer avis, Enregistrer paiement, Relancer
        Objets : Loyer, Paiement, Impayé, Relance

REG-07  CHARGES & DÉCOMPTES
        Objectif : Charges locatives
        Écrans : Charges immeuble, Répartition, Décompte annuel
        Actions : Saisir charges, Répartir, Calculer décompte
        Objets : Charge, Acompte, Décompte

REG-08  INDEXATION
        Objectif : Révision loyers
        Écrans : Paramètres, Simulation, Lettres révision
        Actions : Configurer indice, Simuler, Appliquer
        Objets : Indice, Révision, Bail

REG-09  ÉTATS DES LIEUX
        Objectif : Entrées/sorties locataires
        Écrans : Planning EDL, Fiche entrée, Fiche sortie, Photos
        Actions : Planifier, Réaliser, Comparer, Calculer retenues
        Objets : État des lieux, Photo, Retenue

REG-10  CONTENTIEUX
        Objectif : Gestion impayés et procédures
        Écrans : Dossiers contentieux, Mises en demeure, Procédures
        Actions : Ouvrir, Envoyer mise en demeure, Mandater huissier
        Objets : Contentieux, Mise en demeure, Procédure

REG-11  MAINTENANCE
        Objectif : Gestion technique
        Écrans : Tickets, Interventions, Contrats entretien
        Actions : Créer ticket, Commander intervention
        Objets : Ticket, Intervention, Contrat

REG-12  PORTAIL LOCATAIRE
        Objectif : Espace self-service
        Écrans : Mon espace, Mes loyers, Mes documents
        Actions : Consulter solde, Télécharger, Signaler
        Objets : Vue locataire limitée

REG-13  PORTAIL PROPRIÉTAIRE
        Objectif : Espace propriétaire
        Écrans : Mon portefeuille, Rendements, Rapports
        Actions : Consulter revenus, Télécharger décomptes
        Objets : Vue propriétaire limitée

REG-14  COMPTABILITÉ GÉRANCE
        Objectif : Comptabilité mandants
        Écrans : Journal, Grand livre, Comptes mandants, Reversements
        Actions : Saisir, Calculer reversement, Générer relevé
        Objets : Écriture, Compte mandant, Reversement

REG-15  DOCUMENTS
        Objectif : GED gérance
        Écrans : Documents par immeuble/objet/locataire, Templates
        Actions : Uploader, Générer, Faire signer
        Objets : Document, Template, Signature

REG-16  REPORTING
        Objectif : Analyses
        Écrans : Rapport occupation, Revenus, Charges
        Actions : Générer rapport, Exporter
        Objets : Rapport, Statistique

REG-17  PARAMÈTRES
        Objectif : Configuration app
        Écrans : Paramètres, Utilisateurs, Indices
        Actions : Configurer, Gérer accès
        Objets : Paramètre, Utilisateur, Indice
```

---

## 6. Routing & Déploiement

### 6.1 Option A : Routes même domaine (RECOMMANDÉE)

```
https://app.realpro.ch/ppe/*          → App PPE Admin
https://app.realpro.ch/promoteur/*    → App Promoteur
https://app.realpro.ch/regie/*        → App Régie
https://app.realpro.ch/              → Shell (sélecteur)
```

**Avantages :**
- Cookie de session partagé
- Pas de config CORS complexe
- Un seul certificat SSL
- SSO natif entre apps

### 6.2 Option B : Sous-domaines

```
https://ppe.realpro.ch/*              → App PPE Admin
https://promoteur.realpro.ch/*        → App Promoteur
https://regie.realpro.ch/*            → App Régie
https://realpro.ch/                   → Shell
```

**Inconvénients :**
- Cookies cross-subdomain à configurer
- CORS à configurer
- 4 certificats SSL

### 6.3 Choix : **OPTION A**

Configuration nginx :
```nginx
location /ppe/ {
    alias /apps/ppe-admin/dist/;
    try_files $uri /ppe/index.html;
}
location /promoteur/ {
    alias /apps/promoteur/dist/;
    try_files $uri /promoteur/index.html;
}
location /regie/ {
    alias /apps/regie/dist/;
    try_files $uri /regie/index.html;
}
```

### 6.4 Releases Séparées

```yaml
# turbo.json
{
  "pipeline": {
    "build:ppe": { "dependsOn": ["@realpro/ppe-admin#build"] },
    "build:promoteur": { "dependsOn": ["@realpro/promoteur#build"] },
    "build:regie": { "dependsOn": ["@realpro/regie#build"] }
  }
}
```

---

## 7. Plan de migration & Risques

### Phase 1 : Préparation (Semaine 1)

| Étape | Action |
|-------|--------|
| 1.1 | Configurer Turborepo builds séparés |
| 1.2 | Ajouter règles ESLint anti-import |
| 1.3 | Créer `/apps/shell/` |

### Phase 2 : Migration Promoteur (Semaine 1-2)

| Étape | Action |
|-------|--------|
| 2.1 | Déplacer `/src/pages/Project*` → `/apps/promoteur/` |
| 2.2 | Réorganiser par features |
| 2.3 | Extraire types locaux |
| 2.4 | Supprimer `/src/` |

### Phase 3 : Enrichir PPE Admin (Semaine 2-3)

| Étape | Action |
|-------|--------|
| 3.1 | Créer structure features PPE |
| 3.2 | Implémenter modules Properties → Accounting |
| 3.3 | Créer schéma DB PPE |

### Phase 4 : Enrichir Régie (Semaine 3-4)

| Étape | Action |
|-------|--------|
| 4.1 | Créer structure features Régie |
| 4.2 | Implémenter modules Properties → Accounting |
| 4.3 | Créer schéma DB Régie |

### Phase 5 : Nettoyage (Semaine 4)

| Étape | Action |
|-------|--------|
| 5.1 | Supprimer types métier de `@realpro/entities` |
| 5.2 | Créer `@realpro/storage`, `@realpro/notifications` |
| 5.3 | Vérifier lint anti-import |

### Phase 6 : CI/CD (Semaine 4)

| Étape | Action |
|-------|--------|
| 6.1 | Créer workflows deploy par app |
| 6.2 | Configurer routing |
| 6.3 | Tester déploiements isolés |

### Risques & Mitigations

| Risque | Mitigation |
|--------|------------|
| Casse imports après déplacement | TypeScript strict + alias paths |
| Régression Promoteur | Tests E2E avant/après |
| Conflit migration DB | Préfixer migrations (100_, 200_, 300_) |
| Confusion équipe | Documentation + ADRs |

---

## Checklist Finale

- [ ] 3 apps indépendantes dans `/apps/`
- [ ] Packages techniques dans `/packages/`
- [ ] Aucun type métier partagé
- [ ] Règle ESLint anti-import active
- [ ] Turborepo builds séparés
- [ ] CI/CD déploiements isolés
- [ ] Tests E2E par app
- [ ] Documentation à jour

---

*Document v2.0 - 2025-12-13*
