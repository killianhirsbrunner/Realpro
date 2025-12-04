# Module Finances RealPro - Documentation Complète

## Vue d'ensemble

Module finances professionnel de niveau entreprise pour RealPro, compatible avec les standards suisses (QR-factures, CFC, etc.). Inspiré des meilleurs logiciels suisses comme Bexio, Winbiz, Abacus et Immopac.

## Architecture

### Structure des fichiers

```
src/
├── hooks/
│   └── useFinanceDashboard.ts        # Hook principal pour les données financières
├── components/
│   └── finance/
│       ├── FinanceKPIs.tsx           # KPIs financiers (4 cartes)
│       ├── CFCBudgetTable.tsx        # Tableau budgets CFC
│       ├── InvoiceTable.tsx          # Liste des factures
│       ├── InvoiceDetailCard.tsx     # Détail d'une facture
│       └── QRInvoiceCard.tsx         # QR-facture suisse
└── pages/
    ├── ProjectFinancesDashboard.tsx        # Dashboard principal
    ├── ProjectFinancesCFC.tsx              # Page budgets CFC
    ├── ProjectFinancesInvoices.tsx         # Liste factures
    └── ProjectFinancesInvoiceDetail.tsx    # Détail facture
```

## Pages & Routes

### 1. Dashboard Finances
**Route:** `/projects/:projectId/finances`
**Composant:** `ProjectFinancesDashboard`

Vue d'ensemble financière du projet avec:
- 4 KPIs principaux (Budget total, Engagé, Facturé, Payé)
- Tableau des budgets CFC (top 5)
- Liste des factures récentes (top 10)
- Liens rapides vers les sous-modules

### 2. Budgets CFC
**Route:** `/projects/:projectId/finances/cfc`
**Composant:** `ProjectFinancesCFC`

Gestion complète des Comptes Finaux de Construction:
- Vue d'ensemble: Budget total, Engagé, Facturé, Payé
- Tableau détaillé par compte CFC avec barres de progression
- Calcul automatique des pourcentages d'engagement
- Montants en CHF avec formatage suisse

### 3. Factures Acheteurs
**Route:** `/projects/:projectId/finances/invoices`
**Composant:** `ProjectFinancesInvoices`

Liste complète des factures:
- Statistiques: Total factures, Montant facturé, Payé, En attente
- Tableau avec statuts (Payé, En attente, En retard, Brouillon)
- Filtres et recherche
- Export possible

### 4. Détail Facture
**Route:** `/projects/:projectId/finances/invoices/:invoiceId`
**Composant:** `ProjectFinancesInvoiceDetail`

Fiche complète d'une facture:
- Informations principales (N°, acheteur, montant, échéance)
- Détail des lignes de facturation
- QR-facture suisse intégrée
- Actions: Télécharger PDF, Envoyer, Imprimer

## Composants UI

### FinanceKPIs
4 cartes KPI avec icônes et couleurs:
- Budget total CFC (bleu brand)
- Engagé (orange) + pourcentage + montant
- Facturé (bleu) + pourcentage + montant
- Payé (vert) + pourcentage + montant

Format: CHF avec séparateurs de milliers

### CFCBudgetTable
Tableau professionnel avec:
- Colonnes: CFC, Désignation, Budget, Engagé, Facturé, Payé
- Barres de progression animées pour chaque métrique
- Montants et pourcentages
- Hover effects
- Mode sombre supporté

### InvoiceTable
Liste des factures avec:
- Colonnes: N° Facture, Acheteur, Montant, Échéance, Statut, Actions
- Badges de statut colorés:
  - Vert: Payé
  - Orange: En attente
  - Rouge: En retard
  - Gris: Brouillon
- Lien vers détail
- Détection automatique des retards

### QRInvoiceCard
QR-facture conforme aux standards suisses:
- QR-code scannable
- Informations bancaires (IBAN, Référence)
- Montant et bénéficiaire
- Boutons: Télécharger PDF, Imprimer
- Instructions pour le paiement
- Design professionnel avec fond séparé pour le QR

## Hook useFinanceDashboard

```typescript
const { data, loading, error } = useFinanceDashboard(projectId);
```

### Retourne
```typescript
{
  kpis: {
    totalBudget: number;
    engaged: number;        // Pourcentage
    invoiced: number;       // Pourcentage
    paid: number;          // Pourcentage
    totalEngagements: number;
    totalInvoices: number;
    totalPaid: number;
    pendingPayments: number;
  },
  cfcs: CFCSummary[];
  invoices: InvoiceSummary[];
  recentPayments: Payment[];
}
```

### Fonctionnalités
- Chargement des données CFC depuis Supabase
- Calcul automatique des pourcentages
- Agrégation des montants
- Tri et limitation des résultats
- Gestion des erreurs

## Intégrations Base de Données

### Tables utilisées
- `cfc` - Budgets CFC
- `buyer_invoices` - Factures acheteurs
- `payments` - Paiements
- Relations avec `buyers`, `lots`, `projects`

### Requêtes optimisées
- Utilisation de `select()` avec jointures
- Limitation des résultats (top 5, top 10)
- Tri par date de création/échéance
- Calculs côté client pour les pourcentages

## Fonctionnalités Suisses

### QR-Factures
- Format conforme SwissQR
- Compatible avec toutes les banques suisses
- IBAN formaté selon standard CH
- Référence structurée
- Montant en CHF

### Format des montants
```typescript
formatCurrency(amount) => "CHF 12'345.00"
```
- Séparateur de milliers: apostrophe
- 2 décimales obligatoires
- Préfixe CHF

### Dates
Format: "dd MMM yyyy" en français
Exemple: "15 déc. 2024"

## Design & UX

### Thème
- Support complet du mode sombre
- Couleurs brand (bleu) + orange/vert pour métriques
- Transitions fluides (300-500ms)
- Hover effects sur tous les éléments interactifs

### Responsive
- Mobile first
- Breakpoints: sm, md, lg
- Tables scrollables horizontalement sur mobile
- Cards empilées sur petits écrans

### Animations
- Barres de progression animées
- Fade-in au scroll (ScrollReveal)
- Hover scale & shadow
- Transitions de couleur

## Actions disponibles

### Dashboard
- Créer nouvelle facture
- Accès rapide aux budgets CFC
- Navigation vers sous-modules

### Factures
- Voir détail
- Télécharger PDF
- Envoyer par email
- Imprimer
- Exporter liste

### QR-Facture
- Télécharger QR-code
- Télécharger PDF complet
- Imprimer pour envoi postal
- Scanner pour payer

## États & Statuts

### Statuts factures
- `draft` - Brouillon (gris)
- `sent` - Envoyée, en attente (orange)
- `paid` - Payée (vert)
- `overdue` - En retard (rouge avec icône alerte)

### Calculs automatiques
- Détection retards basée sur date échéance
- Pourcentages CFC: `(montant / budget) * 100`
- Totaux agrégés par somme

## Performance

### Optimisations
- Lazy loading des données
- Limitation résultats (pagination future)
- Requêtes parallèles (Promise.all)
- Memoization possible sur calculs lourds

### Chargement
- Spinner pendant fetch
- États de chargement distincts
- Gestion erreurs avec ErrorState
- Retry automatique possible

## Prochaines étapes

### Améliorations possibles
1. Export Excel/CSV des budgets CFC
2. Génération automatique QR-codes
3. Envoi email factures directement
4. Rappels automatiques échéances
5. Tableau de bord trésorerie
6. Prévisions cash-flow
7. Intégration bancaire (sync paiements)
8. Validation paiements QR automatique
9. Templates de factures personnalisables
10. Multi-devises (EUR, USD)

### Modules connexes à créer
- Paiements & Transactions
- Contrats d'entreprise
- Engagements & Commandes
- Acomptes & Avances
- Avoirs & Remboursements

## Conformité

### Standards Suisses
- ✅ QR-factures SwissQR
- ✅ Format IBAN CH
- ✅ Montants en CHF
- ✅ CFC selon normes suisses
- ✅ Factures conformes TVA suisse (à compléter)

### Sécurité
- Authentification requise (AuthGuard)
- RLS Supabase activé
- Validation côté serveur
- Protection CSRF
- Logs audit trail

## Support

Pour toute question sur le module Finances:
- Documentation: `/FINANCE_MODULE_COMPLETE.md`
- Exemples: Voir pages existantes
- API: Hooks dans `/src/hooks/useFinanceDashboard.ts`

---

**Module Finances RealPro** - Version 1.0
© 2024-2025 Realpro SA. Tous droits réservés.
