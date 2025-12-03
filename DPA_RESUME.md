# DPA — ACCORD DE TRAITEMENT DES DONNÉES (VERSION RÉSUMÉ)
## Data Processing Agreement — Realpro Suite

**Version simplifiée pour lecture rapide**
**Pour la version complète et légale, voir : `DPA_DATA_PROCESSING_AGREEMENT.md`**

---

## 1. PARTIES AU CONTRAT

**Responsable du traitement (Client)**
La société qui souscrit l'abonnement Realpro Suite.

**Sous-traitant (Prestataire)**
Realpro SA, Yverdon-les-Bains (VD), Suisse

---

## 2. OBJET

Ce DPA encadre le traitement des données confiées par le Client à Realpro SA dans le cadre de l'utilisation du logiciel SaaS Realpro Suite.

Il complète les **CGU/CGV** et le **Contrat SaaS**.

---

## 3. TYPES DE DONNÉES TRAITÉES

### 3.1 Données professionnelles
- Nom, prénom, téléphone, email
- Fonction, société, rôle dans le projet

### 3.2 Documents projets
- Plans, contrats, actes notariaux
- Bordereaux, devis, factures QR
- Documents techniques

### 3.3 Documents acheteurs
- Passeports, cartes d'identité
- Preuves de financement
- Dossiers hypothécaires

### 3.4 Données financières
- Factures QR suisses
- Acomptes et échéanciers
- Statuts des paiements

### 3.5 Médias et SAV
- Photos de chantier
- Documents SAV
- Rapports techniques

### 3.6 Logs système
- Logs d'utilisation
- Connexions et actions utilisateurs

---

## 4. CATÉGORIES DE PERSONNES CONCERNÉES

- Collaborateurs du Client
- Acheteurs de biens immobiliers
- Représentants des entreprises (EG, notaires, courtiers, fournisseurs)
- Sous-traitants du projet immobilier
- Investisseurs

---

## 5. OBLIGATIONS DE REALPRO SA (SOUS-TRAITANT)

### 5.1 Conformité légale
- Respect strict de la **LPD suisse** (Loi fédérale sur la protection des données)
- Conformité **RGPD** pour clients européens
- Confidentialité absolue des données
- Limitation des traitements au strict nécessaire

### 5.2 Sécurité technique
- **Chiffrement TLS/SSL** pour toutes les communications (HTTPS)
- **Chiffrement at rest** des données sensibles (AES-256)
- **MFA** (authentification à deux facteurs) disponible pour les utilisateurs
- **Journalisation** de tous les accès sensibles (audit logs)
- **Contrôle d'accès RBAC** (basé sur les rôles et permissions)
- **Sauvegardes quotidiennes** automatiques

### 5.3 Confidentialité interne
- Tout le personnel Realpro SA est soumis à des **obligations strictes de confidentialité**
- Accès limité aux seules personnes autorisées
- Formation régulière sur la protection des données

### 5.4 Sous-traitants autorisés

Realpro SA peut faire appel à :

| Sous-traitant | Service | Localisation | Conformité |
|---------------|---------|--------------|------------|
| **Supabase / AWS** | Hébergement base de données | UE (Frankfurt) ou Suisse | LPD + RGPD |
| **Datatrans AG** | Traitement paiements SaaS | Suisse (Zurich) | PCI-DSS + LPD |
| **Email provider** | Envoi emails | Suisse ou UE | LPD + RGPD |

Tous les sous-traitants sont **conformes LPD et RGPD**.

### 5.5 Notification de violation de données
- En cas de **data breach**, notification au Client dans les **72 heures**
- Fourniture d'un rapport détaillé (nature, impact, mesures correctives)
- Assistance pour notification aux autorités (PFPDT, CNIL, etc.)

---

## 6. OBLIGATIONS DU CLIENT (RESPONSABLE DU TRAITEMENT)

Le Client s'engage à :

1. **Garantir la légalité** des données importées dans le Logiciel
2. **Informer** ses utilisateurs et partenaires du traitement de leurs données
3. **Paramétrer correctement** les accès et permissions
4. **Assurer la qualité** et l'exactitude des données transmises
5. **Récupérer ses données** avant toute suppression définitive (export sous 30 jours)
6. **Respecter les droits** des personnes concernées (accès, rectification, effacement)

---

## 7. ASSISTANCE DE REALPRO SA

Realpro SA aide le Client dans la mesure du raisonnable pour :

- **Export de données** (format ZIP structuré avec fichiers + SQL)
- **Support** sur demandes d'accès ou de suppression de données
- **Fourniture de logs** de sécurité si nécessaire
- **Documentation** pour démontrer la conformité

---

## 8. SORT DES DONNÉES

### 8.1 Pendant le contrat
- Données hébergées de manière sécurisée
- Sauvegardes quotidiennes automatiques (rétention 30 jours)

### 8.2 À la résiliation du contrat
- **Conservation : 30 jours** après résiliation pour permettre l'export
- **Export disponible** sur demande (ZIP avec documents + base de données)
- **Suppression définitive** après 30 jours (irréversible)
- **Prolongation possible** par avenant contractuel

---

## 9. DURÉE ET JURIDICTION

### 9.1 Durée
Le DPA est en vigueur pendant toute la durée du **Contrat SaaS**.

### 9.2 Droit applicable
**Droit suisse** — Loi fédérale sur la protection des données (LPD)
Compatible **RGPD** pour clients européens

### 9.3 Juridiction compétente
**Tribunaux ordinaires du district du Jura-Nord vaudois**
**Yverdon-les-Bains, Canton de Vaud, Suisse**

---

## 10. CONTACT

Pour toute question relative au traitement des données :

**Protection des données :** [privacy@realpro.ch](mailto:privacy@realpro.ch)
**DPO (si applicable) :** [dpo@realpro.ch](mailto:dpo@realpro.ch)
**Support :** [support@realpro.ch](mailto:support@realpro.ch)

---

## 11. DOCUMENTS ASSOCIÉS

Pour une compréhension complète du traitement des données :

- **DPA complet** : `DPA_DATA_PROCESSING_AGREEMENT.md` (15 articles détaillés)
- **Politique de confidentialité** : `/legal/privacy`
- **CGU** : `/legal/cgu`
- **CGV** : `/legal/cgv`
- **Contrat SaaS B2B** : `CONTRAT_SAAS_B2B.md`

---

**Document établi le :** 3 décembre 2025
**Version :** 1.0 (Résumé)
**Conforme LPD (Suisse) et RGPD (UE)**

**Realpro SA – Yverdon-les-Bains (VD), Suisse**
