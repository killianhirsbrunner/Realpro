# Intégration des CGV (Conditions Générales de Vente) - Realpro SA

**Date :** 3 décembre 2025
**Version :** 1.0
**Statut :** ✅ Complet et fonctionnel

---

## Vue d'ensemble

Les Conditions Générales de Vente (CGV) ont été créées et intégrées pour compléter le cadre juridique de Realpro Suite. Elles couvrent tous les aspects commerciaux de la relation entre Realpro SA et ses clients.

---

## Document CGV créé

### CGV_REALPRO_SA.md

**16 articles exhaustifs** couvrant :

#### Article 3 : Offres et Tarifs
- **4 formules d'abonnement** détaillées :
  - **Basic** : Petits promoteurs, projets limités
  - **Professional** : PME, projets illimités, fonctionnalités étendues
  - **Enterprise** : Grandes entreprises, modules avancés, SLA renforcé
  - **Custom** : Sur-mesure, intégrations personnalisées
- Tarification en CHF hors TVA (8,1%)
- Périodicité mensuelle ou annuelle (10 mois pour annuel)
- Politique d'évolution des prix (préavis 30 jours)

#### Article 4 : Souscription
- Procédure en 5 étapes
- **Période d'essai gratuite de 14 jours**
- Activation immédiate après paiement

#### Article 5 : Paiement
- **Datatrans AG** (PSP suisse certifié PCI-DSS)
- Moyens acceptés :
  - Visa, Mastercard, AMEX
  - PostFinance Card & E-Finance
  - TWINT
  - Prélèvement automatique (LSV/DD) pour Enterprise
- Renouvellement automatique
- Procédure d'échec de paiement détaillée (J0 → J30)

#### Article 6 : Facturation
- Format conforme Swiss QR-bill
- Factures envoyées par email + téléchargeables
- TVA suisse 8,1% ou exonération selon localisation
- Délai de paiement : immédiat (prélèvement auto)
- Intérêts moratoires : 5% par an en cas de retard

#### Article 7 : Modification d'abonnement
- **Upgrade** : effet immédiat, facturation au prorata
- **Downgrade** : effet différé à la prochaine échéance
- Ajout d'utilisateurs ou modules

#### Article 8 : Résiliation
- **Par le Client** : à tout moment, sans justification
  - Mensuel : fin du mois en cours
  - Annuel : date anniversaire (préavis 30 jours)
- **Par Realpro SA** : en cas de violation grave
- Données conservées 30 jours puis supprimées définitivement

#### Article 9 : Support et Assistance

**Tableau comparatif complet :**

| Formule | Canal | Délai réponse | Disponibilité |
|---------|-------|---------------|---------------|
| Basic | Email / Ticket | 48h ouvrées | Jours ouvrés |
| Professional | Email / Ticket / Chat | 24h ouvrées | Jours ouvrés |
| Enterprise | Email / Ticket / Chat / Téléphone | 4h ouvrées | 8h-18h + Astreinte |
| Custom | Dédié + SLA personnalisé | Selon contrat | Selon contrat |

Langues : Français, Allemand, Italien, Anglais

#### Article 10 : Garanties et Responsabilités
- **Disponibilité garantie** : 99,5%
- Sauvegardes quotidiennes automatiques
- Conformité LPD et RGPD
- **Responsabilité maximale** : montant annuel versé (12 mois)
- Exclusions clairement définies

#### Articles 11-16
- Propriété intellectuelle
- Protection des données (renvoi vers Privacy Policy)
- Dispositions générales
- **Droit applicable** : Droit suisse
- **Juridiction** : Tribunaux du Jura-Nord vaudois (Yverdon-les-Bains)
- Acceptation

---

## Page web CGV créée

### `/legal/cgv`

**Composant :** `src/pages/legal/CGV.tsx`

**Contenu affiché :**

1. **En-tête professionnel**
   - Icône ShoppingCart
   - Titre "Conditions Générales de Vente"
   - Sous-titre Realpro Suite

2. **Grilles tarifaires visuelles**
   - 4 cartes d'abonnement avec bordures
   - Fonctionnalités listées pour chaque formule
   - Encadré bleu pour les informations de prix

3. **Tableau de support interactif**
   - Tableau HTML responsive
   - Comparaison visuelle des niveaux de support
   - Bordures et mise en forme professionnelle

4. **Sections structurées**
   - Souscription et période d'essai
   - Paiement et sécurité Datatrans
   - Résiliation (mensuel vs annuel)
   - Garanties et responsabilités
   - Juridiction et contact

5. **Footer avec cross-links**
   - Liens vers CGU, Mentions légales, Privacy
   - Copyright Realpro SA

**Design :**
- Responsive (mobile → desktop)
- Dark mode complet
- Typographie hiérarchisée
- Espacements cohérents
- Accessibilité optimisée

---

## Intégration technique

### 1. Routes ajoutées

Dans `src/App.tsx` :

```tsx
import CGV from './pages/legal/CGV';

<Route path="/legal/cgv" element={<CGV />} />
```

### 2. Footer mis à jour

Dans `src/components/layout/Footer.tsx` :

```tsx
<Link to="/legal/cgu">CGU</Link>
<Link to="/legal/cgv">CGV</Link>
<Link to="/legal/mentions-legales">Mentions légales</Link>
<Link to="/legal/privacy">Confidentialité</Link>
```

### 3. Cross-links sur toutes les pages légales

Toutes les pages légales (CGU, Mentions légales, Privacy, CGV) affichent des liens vers les autres pages dans leur footer.

---

## Conformité légale

### Droit suisse

✅ **Code des obligations (CO)** : Articles sur les contrats de vente
✅ **Loi sur les services de paiement** : Datatrans conforme
✅ **TVA suisse** : Taux 8,1% correctement appliqué
✅ **Droit de la consommation** : Transparence et informations claires

### Protection du consommateur

✅ **Transparence des prix** : Affichage clair HT/TTC
✅ **Droit de résiliation** : Procédure simple et rapide
✅ **Période d'essai** : 14 jours gratuits sans engagement
✅ **Informations de contact** : Multiples canaux disponibles

### Juridiction

✅ **Tribunaux compétents** : Jura-Nord vaudois (Yverdon-les-Bains)
✅ **Canton de Vaud, Suisse**
✅ **Recours au Tribunal fédéral** mentionné

---

## Spécificités Suisses intégrées

### 1. Datatrans
- PSP suisse certifié PCI-DSS niveau 1
- Basé à Zurich, Suisse
- Support TWINT (moyen de paiement suisse)
- Support PostFinance (banque suisse)

### 2. Factures QR
- Conformes au Swiss QR-bill (en vigueur depuis 2020)
- Remplacement des bulletins de versement orange/rouge
- QR-IBAN et références structurées

### 3. TVA suisse
- Taux normal : 8,1% (services numériques)
- Numéro TVA : CHE-XXX.XXX.XXX TVA (à compléter)
- Exonération pour clients hors Suisse selon réglementation

### 4. Support multilingue
- Français (Suisse romande)
- Allemand (Suisse alémanique)
- Italien (Suisse italienne)
- Anglais (international)

---

## Différences CGU vs CGV

| Aspect | CGU | CGV |
|--------|-----|-----|
| **Focus** | Utilisation du logiciel | Aspects commerciaux |
| **Public** | Tous les utilisateurs | Clients payants |
| **Contenu** | Droits et obligations d'usage | Tarifs, paiement, facturation |
| **Résiliation** | Suspension d'accès | Résiliation commerciale |
| **Support** | Général | Niveaux détaillés par formule |
| **Responsabilité** | Usage du logiciel | Relation commerciale |

**Les deux documents sont complémentaires et doivent être acceptés ensemble lors de la souscription.**

---

## Checklist de mise en production

### Avant lancement commercial

- [ ] **Compléter les informations manquantes** :
  - [ ] Numéro IDE : CHE-XXX.XXX.XXX
  - [ ] Numéro TVA : CHE-XXX.XXX.XXX TVA
  - [ ] Tarifs exacts pour chaque formule
  - [ ] Adresse exacte du siège social

- [ ] **Validation juridique** :
  - [ ] Faire valider les CGV par un avocat suisse
  - [ ] Vérifier la conformité avec la LPD
  - [ ] Valider les clauses de responsabilité

- [ ] **Intégration Datatrans** :
  - [ ] Créer un compte Datatrans
  - [ ] Obtenir les clés API (production)
  - [ ] Configurer les moyens de paiement
  - [ ] Tester les webhooks de paiement

- [ ] **Système de facturation** :
  - [ ] Implémenter la génération de factures QR
  - [ ] Configurer l'envoi automatique par email
  - [ ] Mettre en place l'archivage (10 ans obligatoire)
  - [ ] Créer les templates de factures

- [ ] **Interface utilisateur** :
  - [ ] Créer une modal d'acceptation CGV lors de la souscription
  - [ ] Ajouter une case à cocher "J'accepte les CGV et CGU"
  - [ ] Créer une page de sélection des formules d'abonnement
  - [ ] Implémenter le processus de paiement

- [ ] **Gestion des abonnements** :
  - [ ] Système de renouvellement automatique
  - [ ] Gestion des échecs de paiement (J0 → J30)
  - [ ] Procédure de résiliation
  - [ ] Export des données avant suppression (30 jours)

- [ ] **Support client** :
  - [ ] Mettre en place les canaux selon formule
  - [ ] Former l'équipe support
  - [ ] Créer les SLA pour chaque formule
  - [ ] Définir les horaires de disponibilité

---

## Emails templates à créer

### 1. Email de confirmation d'abonnement
- Récapitulatif de la formule choisie
- Montant et date de prochaine facturation
- Lien vers les CGV et CGU
- Lien vers l'espace client

### 2. Email de facture
- Facture PDF en pièce jointe
- QR-bill intégré
- Instructions de paiement
- Lien pour télécharger la facture

### 3. Email de renouvellement
- Notification 7 jours avant
- Montant à débiter
- Date du prélèvement
- Lien pour modifier ou résilier

### 4. Email d'échec de paiement
- Notification immédiate
- Instructions pour régulariser
- Date de suspension si non résolu
- Lien vers moyens de paiement

### 5. Email de résiliation
- Confirmation de la demande
- Date effective de fin d'accès
- Procédure d'export des données
- Date de suppression définitive (J+30)

---

## Améliorations futures possibles

### Court terme (3 mois)

1. **Calculateur de tarifs**
   - Sélection interactive des options
   - Calcul en temps réel du prix
   - Comparaison des formules

2. **FAQ CGV**
   - Questions fréquentes sur la facturation
   - Procédures de résiliation simplifiées
   - Support moyens de paiement

3. **Historique des factures**
   - Accès à toutes les factures depuis l'espace client
   - Téléchargement PDF
   - Export comptable (CSV, Excel)

### Moyen terme (6 mois)

1. **Système de crédits/coupons**
   - Codes promotionnels
   - Réductions pour parrainage
   - Offres de lancement

2. **Facturation avancée**
   - Facturation groupée (holding)
   - Multi-devises (EUR, USD)
   - Devis personnalisés

3. **Self-service complet**
   - Changement de formule sans contact support
   - Ajout/suppression d'utilisateurs
   - Gestion des moyens de paiement

### Long terme (12 mois)

1. **Marketplace d'add-ons**
   - Modules optionnels payants
   - Intégrations tierces
   - Services professionnels

2. **Programme partenaires**
   - Tarifs spéciaux pour revendeurs
   - Commission sur les ventes
   - Co-branding

3. **Analytics commercial**
   - Dashboard revenus
   - Prédiction de churn
   - LTV (Lifetime Value) par client

---

## Contact et support

Pour toute question concernant les CGV :

**Commercial :** contact@realpro.ch
**Facturation :** billing@realpro.ch
**Juridique :** legal@realpro.ch

**Téléphone :** +41 XX XXX XX XX (à compléter)

---

## Statut de l'implémentation

| Composant | Statut | Date |
|-----------|--------|------|
| Document CGV_REALPRO_SA.md | ✅ Créé | 3 déc 2025 |
| Page web /legal/cgv | ✅ Créée | 3 déc 2025 |
| Route dans App.tsx | ✅ Ajoutée | 3 déc 2025 |
| Footer mis à jour | ✅ Modifié | 3 déc 2025 |
| Cross-links pages légales | ✅ Mis à jour | 3 déc 2025 |
| Build production | ✅ Réussi | 3 déc 2025 |
| Intégration Datatrans | ⏳ À faire | - |
| Système de facturation | ⏳ À faire | - |
| Modal d'acceptation | ⏳ À faire | - |
| Emails templates | ⏳ À faire | - |

---

**Document établi le :** 3 décembre 2025
**Version :** 1.0
**Auteur :** Realpro SA Development Team
**Statut :** Production Ready (après complétion des informations manquantes)
