# Fonctionnalités avancées - Batch 2 (5 fonctionnalités)

## ✅ Statut : 5 fonctionnalités implémentées

Ce document décrit les **5 nouvelles fonctionnalités** qui ont été implémentées avec l'architecture Supabase.

---

## 🔹 1. Signature électronique

### Infrastructure
✅ **Database** : Table `signature_requests` avec RLS complet
✅ **Edge Function** : `/signatures` (init, callback, list)
✅ **Hook React** : `useSignatures`
✅ **Composant UI** : `DocumentSignature`
✅ **i18n** : Clés françaises ajoutées

### Fonctionnalités
- Initialisation de demandes de signature électronique
- Support multi-provider (Swisscom, Skribble, TEST)
- Suivi du statut : PENDING → SENT → SIGNED / FAILED / CANCELLED
- Intégration avec callback provider
- Mise à jour automatique des métadonnées du document signé

### Schema
```sql
CREATE TABLE signature_requests (
  id uuid PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id),
  document_id uuid REFERENCES documents(id),
  type text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  provider text NOT NULL DEFAULT 'TEST',
  provider_request_id text,
  signer_name text,
  signer_email text NOT NULL,
  signer_locale text,
  redirect_url_success text,
  redirect_url_cancel text,
  created_at timestamptz,
  updated_at timestamptz
);
```

### Usage
```typescript
import { DocumentSignature } from '../components/DocumentSignature';

// Dans une page de document
<DocumentSignature documentId="uuid-du-document" />
```

### API Endpoints
- `POST /signatures/init` - Initialiser une demande de signature
- `POST /signatures/callback` - Callback du provider
- `GET /signatures/document/:documentId` - Lister les demandes

---

## 🔹 2. Annotations sur plans

### Infrastructure
✅ **Database** : Table `plan_annotations` avec RLS complet
✅ **Edge Function** : `/annotations` (add, list, delete)
✅ **Hook React** : `useAnnotations`
✅ **Composant UI** : `PlanAnnotations`
✅ **i18n** : Clés françaises ajoutées

### Fonctionnalités
- Annotations interactives sur plans (images)
- Coordonnées X/Y relatives (0-1) pour responsiveness
- Commentaires avec auteur et date
- Suppression par l'auteur
- Support multi-pages
- Association optionnelle à un lot

### Schema
```sql
CREATE TABLE plan_annotations (
  id uuid PRIMARY KEY,
  document_id uuid REFERENCES documents(id),
  project_id uuid REFERENCES projects(id),
  lot_id uuid REFERENCES lots(id),
  author_id uuid REFERENCES auth.users(id),
  page int DEFAULT 1,
  x float NOT NULL,
  y float NOT NULL,
  comment text NOT NULL,
  created_at timestamptz
);
```

### Usage
```typescript
import { PlanAnnotations } from '../components/PlanAnnotations';

// Dans une page de visualisation de plan
<PlanAnnotations
  documentId="uuid-du-document"
  projectId="uuid-du-projet"
  planUrl="https://url-du-plan.jpg"
  lotId="uuid-du-lot" // optionnel
/>
```

### API Endpoints
- `POST /annotations/add` - Ajouter une annotation
- `GET /annotations/document/:documentId` - Lister les annotations
- `DELETE /annotations/:id` - Supprimer une annotation

---

## 🔹 3. QR codes sur documents

### Infrastructure
✅ **Database** : Colonne `qr_code_url` ajoutée à `documents`
✅ **Edge Function** : `/document-utils/generate-qr/:documentId`
✅ **i18n** : Clés françaises ajoutées

### Fonctionnalités
- Génération de QR codes pointant vers les documents
- URL cible : `/documents/:documentId`
- Stockage de l'URL du QR code dans la base
- API externe pour génération (QR Server API)

### Usage
```typescript
// Générer un QR code pour un document
const apiUrl = `${SUPABASE_URL}/functions/v1/document-utils/generate-qr/${documentId}`;
const response = await fetch(apiUrl, { method: 'POST', headers });

// Afficher le QR code
{document.qr_code_url && (
  <img src={document.qr_code_url} alt="QR code" className="h-24 w-24" />
)}
```

### API Endpoints
- `POST /document-utils/generate-qr/:documentId` - Générer un QR code

---

## 🔹 4. Classification automatique des documents

### Infrastructure
✅ **Database** : Colonnes `type` et `tags` ajoutées à `documents`
✅ **Edge Function** : `/document-utils/classify`
✅ **Indexes** : Index GIN sur `tags`, index sur `type`

### Fonctionnalités
- Classification automatique basée sur le nom du fichier
- Détection de types :
  - RESERVATION
  - CONTRACT, CONTRACT_EG
  - PLAN
  - AVENANT
  - ACTE_NOTARIAL
  - ID_DOC
  - ATTESTATION_FINANCEMENT
  - INVOICE
- Tags automatiques (vente, eg, contrat, plan, notaire, acheteur, etc.)

### Règles de classification
```typescript
function classifyDocument(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("reservation")) {
    return { type: "RESERVATION", tags: ["vente"] };
  }

  if (lower.includes("contrat") && lower.includes("eg")) {
    return { type: "CONTRACT_EG", tags: ["eg", "contrat"] };
  }

  if (lower.includes("id") || lower.includes("passport")) {
    return { type: "ID_DOC", tags: ["acheteur", "identite"] };
  }

  // ... etc
}
```

### Usage
```typescript
// Classifier un document lors de l'upload
const apiUrl = `${SUPABASE_URL}/functions/v1/document-utils/classify`;
const response = await fetch(apiUrl, {
  method: 'POST',
  headers,
  body: JSON.stringify({ name: fileName })
});

const { type, tags } = await response.json();

// Créer le document avec type et tags
await supabase.from('documents').insert({
  name: fileName,
  type,
  tags,
  // ... autres champs
});
```

### API Endpoints
- `POST /document-utils/classify` - Classifier un nom de document

---

## 🔹 5. Vérifications automatiques avant notaire

### Infrastructure
✅ **Edge Function** : `/notary-checklist/buyer/:buyerId`
✅ **Composant UI** : `NotaryChecklist`
✅ **i18n** : Clés françaises ajoutées

### Fonctionnalités
- Checklist de préparation pour l'acte notarié
- Vérifications automatiques :
  1. **Documents obligatoires** (ID_DOC, ATTESTATION_FINANCEMENT)
  2. **Choix matériaux finalisés** (status = CONFIRMED)
  3. **Acomptes obligatoires réglés**
- Statut global : Dossier prêt / incomplet
- Liste détaillée des éléments manquants

### Logique de vérification
```typescript
// 1. Documents requis
const requiredDocTypes = ["ID_DOC", "ATTESTATION_FINANCEMENT"];
const missingDocs = requiredDocTypes.filter(
  type => !docs.find(d => d.type === type)
);

// 2. Choix matériaux
const materialsComplete =
  choices.length > 0 &&
  choices.every(c => c.status === "CONFIRMED");

// 3. Acomptes
const unpaidInvoices = invoices.filter(
  i => i.amount_paid_cents < i.amount_total_cents
);

// Checklist
const items = [
  {
    key: "DOCS_REQUIRED",
    label: "Documents obligatoires fournis",
    status: missingDocs.length === 0 ? "OK" : "MISSING",
    details: missingDocs
  },
  {
    key: "MATERIAL_CHOICES",
    label: "Choix matériaux finalisés",
    status: materialsComplete ? "OK" : "WARNING"
  },
  {
    key: "MANDATORY_INVOICES",
    label: "Acomptes obligatoires réglés",
    status: unpaidInvoices.length === 0 ? "OK" : "MISSING",
    details: unpaidInvoices.map(i => i.invoice_number)
  }
];

const ready = items.every(item => item.status === "OK");
```

### Usage
```typescript
import { NotaryChecklist } from '../components/NotaryChecklist';

// Dans une page dossier acheteur
<NotaryChecklist buyerId="uuid-acheteur" />
```

### API Endpoints
- `GET /notary-checklist/buyer/:buyerId` - Obtenir la checklist

---

## 📊 Récapitulatif technique

### Database
- **2 nouvelles tables** : `signature_requests`, `plan_annotations`
- **3 nouvelles colonnes** : `documents.qr_code_url`, `documents.type`, `documents.tags`
- **10+ RLS policies** ajoutées
- **Total : 86 tables** dans le système

### Code
- **4 nouvelles edge functions** :
  - `signatures` (294 lignes)
  - `annotations` (211 lignes)
  - `document-utils` (155 lignes)
  - `notary-checklist` (191 lignes)
- **2 nouveaux hooks** :
  - `useSignatures`
  - `useAnnotations`
- **3 nouveaux composants** :
  - `DocumentSignature`
  - `PlanAnnotations`
  - `NotaryChecklist`
- **40+ nouvelles clés i18n** (français)

### Build
```
✓ built in 8.29s
dist/index.html                   0.69 kB │ gzip:   0.39 kB
dist/assets/index-CEYEQ13D.css   37.67 kB │ gzip:   6.56 kB
dist/assets/index-CvoJ3ZOl.js   640.29 kB │ gzip: 166.16 kB
```

---

## 🎨 Caractéristiques UI/UX

### DocumentSignature
- Formulaire compact pour demande de signature
- Liste des demandes avec badges de statut colorés
- Ouverture automatique de l'URL de signature
- Gestion des états : pending, sent, signed, failed, cancelled

### PlanAnnotations
- Interface interactive sur image de plan
- Curseur crosshair pour ajout d'annotations
- Bulles d'annotation avec icône message
- Popup au clic avec détails et bouton suppression
- Compteur d'annotations

### NotaryChecklist
- Badge de statut global (prêt / incomplet)
- Items de checklist avec icônes colorées :
  - ✓ Vert : OK
  - ⚠ Amber : WARNING
  - ✗ Rouge : MISSING
- Liste détaillée des éléments manquants
- Contexte acheteur et projet

---

## 🔐 Sécurité

### RLS Policies
Toutes les tables ont des policies restrictives :

**signature_requests** :
- SELECT : organisation de l'utilisateur
- INSERT : organisation de l'utilisateur
- UPDATE : organisation de l'utilisateur

**plan_annotations** :
- SELECT : projets de l'organisation
- INSERT : projets de l'organisation + author_id = user
- UPDATE : author_id = user
- DELETE : author_id = user

**documents** (extended) :
- Existing RLS + nouveaux champs (qr_code_url, type, tags)

---

## 🚀 Déploiement

### Déployer les edge functions
```bash
# Déployer toutes les nouvelles fonctions
supabase functions deploy signatures
supabase functions deploy annotations
supabase functions deploy document-utils
supabase functions deploy notary-checklist
```

### Ajouter les routes dans l'app
```typescript
// Exemple d'utilisation dans une page document
import { DocumentSignature } from '../components/DocumentSignature';
import { PlanAnnotations } from '../components/PlanAnnotations';

function DocumentDetailPage() {
  return (
    <div className="space-y-6">
      {/* Signature électronique */}
      <DocumentSignature documentId={documentId} />

      {/* Si c'est un plan */}
      {document.type === 'PLAN' && (
        <PlanAnnotations
          documentId={documentId}
          projectId={projectId}
          planUrl={document.file_url}
        />
      )}
    </div>
  );
}

// Exemple checklist notaire dans dossier acheteur
import { NotaryChecklist } from '../components/NotaryChecklist';

function BuyerFilePage() {
  return (
    <div className="space-y-6">
      <NotaryChecklist buyerId={buyerId} />
    </div>
  );
}
```

---

## 📝 Prochaines améliorations possibles

### Signature électronique
1. Intégration réelle Swisscom AIS
2. Intégration réelle Skribble
3. Signature multiple (plusieurs signataires)
4. Webhooks pour callbacks asynchrones
5. Historique des signatures

### Annotations
1. Types d'annotations (note, défaut, validation)
2. Résolution d'annotations
3. Export des annotations en PDF
4. Filtres par auteur/date
5. Notifications sur nouvelles annotations

### QR codes
1. Stockage des images QR dans Supabase Storage
2. QR codes personnalisés (logo, couleurs)
3. QR codes pour lots, projets, etc.
4. Statistiques de scans

### Classification
1. Machine Learning pour classification avancée
2. Extraction de métadonnées (dates, montants)
3. OCR pour lecture du contenu
4. Validation manuelle et apprentissage
5. Règles personnalisées par organisation

### Checklist notaire
1. Checklist configurable par organisation
2. Vérifications conditionnelles
3. Délais et alertes
4. Export pour le notaire
5. Validation par étapes

---

## ✅ Conclusion

**5 fonctionnalités supplémentaires** sont maintenant opérationnelles avec :
- Infrastructure database complète et sécurisée (RLS)
- 4 edge functions Deno performantes
- 2 hooks React réutilisables
- 3 composants UI modernes avec dark mode
- 40+ clés i18n français
- Build validé ✓

**Total cumulé : 8 fonctionnalités avancées** implémentées (3 du batch 1 + 5 du batch 2).

Les 10 autres fonctionnalités du roadmap peuvent être implémentées progressivement selon les priorités business.
