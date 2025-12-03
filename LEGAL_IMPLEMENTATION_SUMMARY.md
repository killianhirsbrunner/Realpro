# Implémentation Légale Complète - Realpro SA

**Date :** 3 décembre 2025
**Siège social :** Yverdon-les-Bains, Canton de Vaud, Suisse

---

## Vue d'ensemble

L'ensemble des documents légaux et composants d'interface ont été créés et intégrés conformément au droit suisse et aux spécifications du canton de Vaud.

---

## Documents légaux créés

### 1. CGU Complètes (`CGU_REALPRO_SA.md`)

Document exhaustif de **16 articles** couvrant :

- ✅ Définitions précises des termes
- ✅ Accès au logiciel et multi-rôles
- ✅ Gestion des abonnements via Datatrans
- ✅ Modules financiers et factures QR suisses
- ✅ Protection des données (LPD conforme)
- ✅ Propriété intellectuelle Realpro SA
- ✅ Responsabilités et limitations
- ✅ Juridiction : Tribunaux du Jura-Nord vaudois

### 2. COPYRIGHT (mis à jour)

- ✅ Coordonnées complètes d'Yverdon-les-Bains
- ✅ Canton de Vaud spécifié
- ✅ Mentions de propriété intellectuelle
- ✅ Références légales LDA et CO

### 3. LICENSE (mis à jour)

- ✅ Juridiction : Yverdon-les-Bains, Vaud
- ✅ 12 articles détaillés
- ✅ Licence propriétaire conforme au droit suisse
- ✅ Restrictions d'utilisation claires

### 4. CGV Complètes (`CGV_REALPRO_SA.md`)

Document commercial exhaustif de **16 articles** couvrant :

- ✅ Types d'abonnements (Basic, Professional, Enterprise, Custom)
- ✅ Tarifs et périodicité (mensuel, annuel)
- ✅ Paiement via Datatrans (Visa, Mastercard, TWINT, PostFinance)
- ✅ Facturation conforme aux normes suisses
- ✅ Procédures de résiliation détaillées
- ✅ Niveaux de support selon formule
- ✅ Garanties et limitations de responsabilité
- ✅ Juridiction : Tribunaux du Jura-Nord vaudois

---

## Pages web créées

### 1. Page CGU (`/legal/cgu`)

**Composant :** `src/pages/legal/CGU.tsx`

Interface complète et professionnelle affichant :
- Tous les articles des CGU
- Navigation vers les autres pages légales
- Design responsive et accessible
- Support dark mode

### 2. Page CGV (`/legal/cgv`)

**Composant :** `src/pages/legal/CGV.tsx`

Interface commerciale détaillée affichant :
- Types d'abonnements avec grilles tarifaires
- Procédures de paiement et facturation
- Tableau comparatif des niveaux de support
- Procédures de résiliation
- Garanties et limitations de responsabilité
- Navigation vers les autres pages légales
- Design responsive et accessible
- Support dark mode

### 3. Page Mentions légales (`/legal/mentions-legales`)

**Composant :** `src/pages/legal/MentionsLegales.tsx`

Contient :
- Informations sur Realpro SA
- Coordonnées d'Yverdon-les-Bains
- Numéros IDE et TVA (à compléter)
- Hébergement Supabase
- Propriété intellectuelle
- Marques protégées
- Juridiction compétente

### 3. Page Politique de confidentialité (`/legal/privacy`)

**Composant :** `src/pages/legal/Privacy.tsx`

Conforme LPD et RGPD :
- 14 sections détaillées
- Droits des utilisateurs
- Sécurité des données
- Conservation et suppression
- Contact PFPDT (autorité suisse)
- Politique cookies
- Transferts internationaux

---

## Composants d'interface

### Footer (`src/components/layout/Footer.tsx`)

**Intégré dans AppShell**

Affiche :
- © 2025 Realpro SA, Yverdon-les-Bains (VD), Suisse
- Liens vers CGU, CGV, Mentions légales, Confidentialité
- Contact email
- Version du logiciel

**Position :** Bas de page sur toutes les pages de l'application

---

## Routes configurées

Dans `src/App.tsx` :

```tsx
<Route path="/legal/cgu" element={<CGU />} />
<Route path="/legal/cgv" element={<CGV />} />
<Route path="/legal/mentions-legales" element={<MentionsLegales />} />
<Route path="/legal/privacy" element={<Privacy />} />
```

---

## Conformité légale

### Droit suisse

✅ **Loi fédérale sur le droit d'auteur (LDA, RS 231.1)**
✅ **Code des obligations suisse (CO, RS 220)**
✅ **Loi fédérale sur la protection des données (LPD, RS 235.1)**
✅ **Ordonnance LPD (OLPD)**

### Juridiction

✅ **Tribunaux ordinaires du district du Jura-Nord vaudois (Yverdon-les-Bains)**
✅ **Canton de Vaud, Suisse**
✅ **Recours au Tribunal fédéral** (mentionné)

### Protection des données

✅ **Conforme LPD suisse**
✅ **Conforme RGPD** (clients européens)
✅ **Autorité de contrôle : PFPDT**
✅ **Hébergement : Europe (Suisse/UE)**

---

## Éléments à compléter par Realpro SA

### Informations administratives

1. **Numéro IDE** : CHE-XXX.XXX.XXX
2. **Numéro TVA** : CHE-XXX.XXX.XXX TVA
3. **Adresse exacte** : [Rue et numéro], 1400 Yverdon-les-Bains
4. **Directeur de publication** : [Nom du fondateur/administrateur]
5. **Téléphone** : +41 XX XXX XX XX

### Actions recommandées

1. **Validation juridique**
   Faire valider tous les documents par un avocat suisse spécialisé en droit commercial et propriété intellectuelle

2. **Dépôt de marque**
   Déposer "Realpro" et "Realpro Suite" à l'IPI (Institut Fédéral de la Propriété Intellectuelle)
   Coût : ~550 CHF
   Classes : 9 (logiciels) + 42 (SaaS)

3. **Mise en place du consentement**
   Lors de la première connexion, afficher une modal demandant l'acceptation des CGU

4. **Emails templates**
   Intégrer les liens vers les CGU dans tous les emails envoyés aux utilisateurs

---

## Architecture des fichiers

```
/project
├── CGU_REALPRO_SA.md                      # Document CGU complet
├── CGV_REALPRO_SA.md                      # Document CGV complet
├── COPYRIGHT                               # Mentions de copyright
├── LICENSE                                 # Licence propriétaire
├── LEGAL_IMPLEMENTATION_SUMMARY.md         # Ce document
│
└── src/
    ├── App.tsx                            # Routes ajoutées
    │
    ├── components/layout/
    │   ├── AppShell.tsx                   # Footer intégré
    │   └── Footer.tsx                     # Nouveau composant
    │
    └── pages/legal/
        ├── CGU.tsx                        # Page CGU
        ├── CGV.tsx                        # Page CGV
        ├── MentionsLegales.tsx            # Page mentions légales
        └── Privacy.tsx                    # Page confidentialité
```

---

## Résumé des modifications

| Fichier | Action | Status |
|---------|--------|--------|
| `CGU_REALPRO_SA.md` | Créé | ✅ |
| `CGV_REALPRO_SA.md` | Créé | ✅ |
| `COPYRIGHT` | Mis à jour (Yverdon) | ✅ |
| `LICENSE` | Mis à jour (Yverdon) | ✅ |
| `src/pages/legal/CGU.tsx` | Créé | ✅ |
| `src/pages/legal/CGV.tsx` | Créé | ✅ |
| `src/pages/legal/MentionsLegales.tsx` | Créé | ✅ |
| `src/pages/legal/Privacy.tsx` | Créé | ✅ |
| `src/components/layout/Footer.tsx` | Créé | ✅ |
| `src/components/layout/AppShell.tsx` | Modifié | ✅ |
| `src/App.tsx` | Routes ajoutées | ✅ |

---

## Prochaines étapes suggérées

### Court terme (semaine 1)

1. Compléter les numéros IDE et TVA dans tous les documents
2. Ajouter l'adresse exacte du siège social
3. Créer une modal de consentement aux CGU (première connexion)
4. Tester l'affichage des pages légales sur mobile et desktop

### Moyen terme (mois 1)

1. Faire valider l'ensemble par un avocat
2. Déposer la marque "Realpro" à l'IPI
3. Mettre en place un système de versioning des CGU
4. Créer un historique des modifications des CGU

### Long terme (trimestre 1)

1. Obtenir une certification ISO 27001 (sécurité des données)
2. Réaliser un audit de conformité LPD/RGPD
3. Mettre en place un registre des traitements de données
4. Former l'équipe aux obligations légales

---

## Contact

Pour toute question concernant cette implémentation légale :

**Email légal :** legal@realpro.ch
**Email confidentialité :** privacy@realpro.ch
**Email contact général :** contact@realpro.ch

---

**Document établi le :** 3 décembre 2025
**Version :** 1.0
**Auteur :** Realpro SA Development Team
