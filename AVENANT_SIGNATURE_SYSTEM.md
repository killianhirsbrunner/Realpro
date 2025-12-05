# 📝 Système de Signature Électronique des Avenants

## 🎯 Vue d'ensemble

RealPro SA dispose maintenant d'un système complet de gestion et signature électronique des avenants, permettant de valider juridiquement les modifications techniques sur les lots.

## 🔄 Workflow Complet

### 1️⃣ Offre Fournisseur
Le fournisseur dépose une offre pour une modification technique via `/projects/:projectId/modifications/offers/new`

### 2️⃣ Validation Client
- Le client consulte l'offre
- **Action** : Accepter ou demander des corrections
- Statut : `pending_client` → `client_approved`

### 3️⃣ Validation Architecte
- L'architecte vérifie la conformité technique
- **Action** : Valider techniquement ou rejeter
- Statut : `client_approved` → `architect_approved`

### 4️⃣ Génération d'Avenant
- Le promoteur génère l'avenant automatiquement
- **Type déterminé automatiquement** :
  - **Simple** : Montant < CHF 1'000
  - **Détaillé** : Montant CHF 1'000 - 10'000
  - **Juridique** : Montant > CHF 10'000 ou impact technique majeur
- Statut : `architect_approved` → `final`
- Redirection vers la page de signature

### 5️⃣ Signature Électronique
- Le client visualise l'avenant (PDF)
- Signature via canvas électronique
- **Traçabilité complète** :
  - Horodatage précis
  - Adresse IP
  - User-Agent
  - Identité du signataire
  - Conformité SCSE (loi suisse sur la signature électronique)

### 6️⃣ Intégrations Automatiques

#### 📄 Module Documents
```
→ Création automatique du document
→ Classement : 06 – Dossiers Acheteurs / Avenants / AVE-2025-XXXX.pdf
→ Version signée archivée
→ Accès : Promoteur, Architecte, Client, Notaire
```

#### 💰 Module Finances
```
→ Création automatique d'une facture QR
→ Montant = total_with_vat de l'avenant
→ Échéance configurable
→ Intégration dans le suivi CFC
```

#### 📊 Module CFC
```
→ Mise à jour automatique du budget
→ Ligne d'engagement créée
→ Suivi des modifications par lot
```

## 🗂️ Structure Base de Données

### Table `avenants`
Stocke les avenants générés avec :
- Référence unique (AVE-2025-XXXX)
- Type (simple, detailed, legal)
- Montants (HT, TVA, TTC)
- Statuts (draft, pending_signature, signed, rejected, cancelled)
- URLs des PDF (original et signé)

### Table `avenant_signatures`
Signatures électroniques avec :
- Données de signature (image base64)
- Identité complète du signataire
- Traçabilité (IP, User-Agent, localisation)
- Méthode de signature (electronic, qualified, simple)
- Certificat électronique (pour signatures qualifiées)

### Table `avenant_versions`
Historique complet :
- Toutes les versions de l'avenant
- Changements apportés
- Traçabilité des modifications

### Table `avenant_invoices`
Liaison avenant → facture :
- Génération automatique
- Suivi de la facturation

## 🎨 Pages & Composants

### Pages
- `ProjectAvenants.tsx` - Liste des avenants du projet
- `AvenantSignature.tsx` - Visualisation et signature d'un avenant

### Composants
- `SignatureCanvas.tsx` - Canvas de signature électronique réutilisable
- `SignatureArea.tsx` - Zone complète de signature avec validation

### Hooks
- `useAvenants()` - Liste des avenants d'un projet
- `useAvenantDetail()` - Détails + signatures d'un avenant
- `useSignAvenant()` - Signature d'un avenant
- `useGenerateAvenant()` - Génération automatique

## 🔐 Sécurité & Conformité

### Signatures Électroniques

#### Option A - Signature Simple (intégrée)
✅ Horodatage automatique
✅ Traçabilité IP + User-Agent
✅ Stockage sécurisé dans Supabase
✅ Conforme pour montants < CHF 5'000

#### Option B - Signature Qualifiée (recommandée > CHF 5'000)
✅ Intégration Swisscom AIS / Skribble
✅ Certificat électronique qualifié
✅ Conformité ZertES (loi suisse)
✅ Valeur juridique maximale

### Choix Automatique
```typescript
if (montant > 5000) {
  requires_qualified_signature = true
} else {
  requires_qualified_signature = false
}
```

## 📍 Routes Disponibles

```
/projects/:projectId/modifications/avenants
  → Liste des avenants du projet

/projects/:projectId/modifications/avenants/:avenantId
  → Visualisation d'un avenant

/projects/:projectId/modifications/avenants/:avenantId/sign
  → Page de signature électronique
```

## 🚀 Flux d'Utilisation

### Exemple Complet

```
1. Fournisseur dépose offre CHF 8'500
   → ProjectModificationsOfferNew

2. Client valide l'offre
   → ProjectModificationsOfferDetail
   → Status: pending_client → client_approved

3. Architecte valide techniquement
   → Status: client_approved → architect_approved

4. Promoteur clique "Générer l'avenant"
   → Avenant type "detailed" créé automatiquement
   → Redirection vers AvenantSignature

5. Client signe électroniquement
   → Canvas de signature
   → Horodatage + IP + traçabilité
   → Status: pending_signature → signed

6. Automatisations déclenchées :
   ✓ PDF signé archivé dans Documents
   ✓ Facture QR générée (CHF 9'187.85 TTC)
   ✓ Budget CFC mis à jour
   ✓ Notification équipe projet
```

## 📊 Badges & Statuts

### Statuts d'Avenant
- 🟦 **Brouillon** - En cours de préparation
- 🟨 **En attente** - Attend signature client
- 🟩 **Signé** - Validé et archivé
- 🟥 **Refusé** - Corrections demandées
- ⚫ **Annulé** - Abandonné

### Types d'Avenant
- 🔵 **Simple** - Modification mineure
- 🟣 **Détaillé** - Modification standard
- 🟣 **Juridique** - Modification avec clauses légales

## 🎯 Avantages Clés

### Pour le Promoteur
✅ Workflow automatisé de bout en bout
✅ Génération d'avenants professionnels
✅ Traçabilité complète conforme SCSE
✅ Intégration finances + documents automatique

### Pour le Client
✅ Signature simple et rapide (canvas)
✅ Visualisation claire de l'avenant
✅ Valeur juridique garantie
✅ Accès permanent aux documents signés

### Pour l'Architecte
✅ Validation technique intégrée
✅ Vue d'ensemble des modifications
✅ Suivi des impacts budgétaires

## 📱 Responsive & UX

- Design Apple-like premium
- Canvas tactile pour mobile et tablette
- Transitions fluides entre étapes
- Feedback visuel en temps réel
- Mode sombre / clair automatique

## 🔮 Évolutions Futures

### Court terme
- [ ] Intégration Swisscom AIS pour signatures qualifiées
- [ ] Génération PDF avec logo et branding RealPro
- [ ] Envoi email automatique après signature
- [ ] Notification push client

### Moyen terme
- [ ] Signatures multiples (co-acquéreurs)
- [ ] Workflow d'approbation à N niveaux
- [ ] Export comptable automatique
- [ ] API pour connecteurs externes

### Long terme
- [ ] Blockchain pour traçabilité renforcée
- [ ] IA pour détection d'anomalies
- [ ] Analyse prédictive des coûts
- [ ] Module de gestion de litiges

---

**© 2024-2025 Realpro SA - Tous droits réservés**

*Ce système positionne RealPro SA au niveau des meilleurs SaaS immobiliers suisses (Abacus, Immopac, Procore).*
