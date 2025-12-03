# Roadmap des fonctionnalités avancées

Ce document décrit l'implémentation des 18 fonctionnalités avancées demandées pour Realty OS.

---

## ✅ Implémenté (Database)

Les migrations database pour toutes les tables suivantes sont créées :

- `financial_scenarios` - Simulateur financier
- `project_public_pages` - Pages publiques projets
- `signature_requests` - Signatures électroniques
- `site_diary_entries` + `site_diary_photos` - Journal de chantier
- `company_warranties` - Garanties entreprises
- `safety_plans` + `safety_trainings` - Plans de prévention
- `handover_events` - Livraisons & prises de possession
- `plan_annotations` - Annotations sur plans

---

## 🔹 1. Simulateur financier dynamique

### ✅ Database
- Table `financial_scenarios` créée
- RLS activé, policies configurées

### 📋 À implémenter

#### Hook `useFinancialScenarios`
```typescript
// src/hooks/useFinancialScenarios.ts
export function useFinancialScenarios(organizationId: string, projectId?: string) {
  // Load scenarios
  // Create scenario
  // Update scenario
  // Delete scenario
  // Calculate results
}
```

#### Edge Function `/financial`
```typescript
// supabase/functions/financial/index.ts
POST /calculate - Calcule les résultats d'un scénario
  Input: { assumptions, projectId }
  Output: { revenue, costs, margin, roi, cashflow }

GET /scenarios?projectId=X - Liste scenarios
POST /scenarios - Crée scénario
PUT /scenarios/:id - Met à jour
DELETE /scenarios/:id - Supprime
```

#### Page `FinancialSimulator.tsx`
- Formulaire hypothèses (prix m², inflation, taux intérêt)
- Comparaison 3 scénarios côte à côte
- Graphiques revenus vs coûts
- Export Excel/PDF

### Business Logic
```typescript
calculateScenario(assumptions, projectData) {
  // Revenus
  const revenue = lots.reduce((sum, lot) =>
    sum + (lot.surface * assumptions.pricePerSqm), 0);

  // Coûts CFC
  const costs = cfcBudget.lines.reduce((sum, line) =>
    sum + line.amount * (1 + assumptions.costInflation), 0);

  // Marge
  const margin = revenue - costs;
  const marginPercent = (margin / revenue) * 100;

  // ROI
  const roi = (margin / costs) * 100;

  // Cashflow
  const cashflow = calculateMonthlyCashflow(revenue, costs, timeline);

  return { revenue, costs, margin, marginPercent, roi, cashflow };
}
```

---

## 🔹 2. Portail investisseurs / banques

### 📋 À implémenter

#### Ajout rôle `INVESTOR`
```sql
-- Ajouter dans enum existing
ALTER TYPE organization_role ADD VALUE 'INVESTOR';
```

#### Module `/investors` Edge Function
```typescript
GET /investors/projects/overview
GET /investors/projects/:id/summary
  - Avancement chantier
  - Ventes & préventes
  - Budgets CFC globalisés
  - Risques / retards
```

#### Layout `InvestorLayout.tsx`
- Read-only dashboard
- Pas de menus d'édition
- Graphiques synthétiques
- Filtres dates
- Export PDF/Excel

---

## 🔹 3. Page publique projet (mini site)

### ✅ Database
- Table `project_public_pages` créée
- Policy public pour consultation
- Policy org members pour édition

### 📋 À implémenter

#### Route publique
```typescript
// src/pages/public/ProjectPublicPage.tsx
// Route: /public/:slug
- Hero (image, title, subtitle)
- Description projet
- Liste lots disponibles
- Galerie photos
- Formulaire contact → CRM
```

#### Admin page
```typescript
// src/pages/ProjectPublicPageEditor.tsx
- Toggle published
- Éditeur hero
- Configuration sections
- Prévisualisation
```

#### Edge Function `/public`
```typescript
GET /public/projects/:slug
  - Pas d'auth requise
  - Retourne page + lots disponibles
```

---

## 🔹 4. Signature électronique intégrée

### ✅ Database
- Table `signature_requests` créée

### 📋 À implémenter

#### Services
```typescript
// Swisscom / Skribble integration
SignatureService.createRequest(documentId, email, type)
SignatureService.handleCallback(payload)
```

#### Edge Function `/signatures`
```typescript
POST /signatures/requests
POST /signatures/provider/callback
GET /signatures/requests/:id/status
```

#### UI
- Bouton "Envoyer pour signature" sur documents
- Suivi statut signature
- Notification acquéreur

---

## 🔹 5. Visio / vidéo call pour rendez-vous

### 📋 Option 1 : Liens externes (V1)
```typescript
// Ajouter champs à tables existantes
ALTER TABLE supplier_appointments ADD COLUMN video_link text;
ALTER TABLE notary_signature_appointments ADD COLUMN video_link text;
```

UI : Bouton "Rejoindre la visio" si link présent

### 📋 Option 2 : WebRTC intégré (V2)
- Intégration Twilio / Daily / Jitsi
- Composant `<VideoCall />`
- Gestion permissions mic/camera

---

## 🔹 6. QR codes sur documents

### 📋 À implémenter

#### Migration
```sql
ALTER TABLE documents ADD COLUMN qr_code_url text;
```

#### Service
```typescript
// Backend (Node qrcode lib)
DocumentService.generateQrCode(documentId) {
  const url = `${baseUrl}/documents/${documentId}`;
  const qrImage = await QRCode.toDataURL(url);
  // Upload to storage
  // Update document.qr_code_url
}
```

#### UI
- Affichage QR dans visionneuse documents
- Option "Imprimer avec QR"

---

## 🔹 7. Détection automatique des documents

### 📋 À implémenter (heuristique simple)

```typescript
DocumentClassifierService.classify(document) {
  const name = document.name.toLowerCase();

  if (name.includes('reservation')) return 'RESERVATION';
  if (name.includes('acte') || name.includes('notaire')) return 'NOTARY_ACT';
  if (name.includes('contrat')) return 'CONTRACT';
  if (name.includes('facture')) return 'INVOICE';
  if (name.includes('plan')) return 'PLAN';
  // etc.

  return 'OTHER';
}
```

Appelé après upload → auto-classification + rangement

---

## 🔹 8. Vérifications automatiques avant notaire

### 📋 À implémenter

#### Edge Function `/notary`
```typescript
GET /notary/buyer-files/:id/checklist

NotaryChecklistService.verify(buyerFileId) {
  return {
    ready: boolean,
    items: [
      { key: 'docs', status: 'OK' | 'MISSING', label: 'Documents identité' },
      { key: 'financing', status: 'OK' | 'MISSING', label: 'Financement confirmé' },
      { key: 'deposit', status: 'OK' | 'MISSING', label: 'Acompte payé' },
      { key: 'choices', status: 'OK' | 'MISSING', label: 'Choix matériaux figés' }
    ]
  };
}
```

#### UI
- Badge vert "Dossier prêt" ou rouge "Incomplet"
- Liste items manquants
- Actions rapides

---

## 🔹 9. Alertes de retards chantier / tickets / soumissions

### 📋 À implémenter

#### Scheduler CRON (edge function `/scheduler`)
```typescript
// Runs every night
async function checkDelays() {
  // Phases chantier
  const latePhases = await supabase
    .from('project_phases')
    .select('*')
    .lt('planned_end_date', 'now()')
    .neq('status', 'COMPLETED');

  for (const phase of latePhases) {
    await createNotification({
      type: 'DEADLINE',
      title: `Phase en retard: ${phase.name}`,
      projectId: phase.project_id
    });
  }

  // Tickets SAV sans mise à jour
  const stalledTickets = await supabase
    .from('service_tickets')
    .select('*')
    .in('status', ['OPEN', 'IN_PROGRESS'])
    .lt('updated_at', 'now() - interval \'7 days\'');

  // Clarifications soumissions
  const openClarifications = await supabase
    .from('submission_clarifications')
    .select('*')
    .eq('status', 'OPEN')
    .lt('created_at', 'now() - interval \'3 days\'');
}
```

---

## 🔹 10. Annotations sur plans

### ✅ Database
- Table `plan_annotations` créée
- RLS configuré

### 📋 À implémenter

#### Composant `<PlanViewer>`
```typescript
// Visionneuse interactive
- Affichage plan (image ou PDF→canvas)
- Click pour ajouter pin
- Formulaire commentaire
- Affichage pins existants (tooltips)
- Zoom/pan
```

#### Hook `usePlanAnnotations`
```typescript
export function usePlanAnnotations(documentId: string) {
  // Load annotations
  // Add annotation
  // Delete annotation
}
```

---

## 🔹 11. Livraisons & prises de possession

### ✅ Database
- Table `handover_events` créée

### 📋 À implémenter

#### Page `LotHandover.tsx`
- Timeline de livraison :
  - Pré-inspection (date, PV)
  - Remise de clés (date, signature)
  - PV signé (document)
- Lien avec `handover_issues` (réserves)
- Notifications acquéreur

---

## 🔹 12. Journal de chantier

### ✅ Database
- Tables `site_diary_entries` + `site_diary_photos` créées

### 📋 À implémenter

#### Page `SiteDiary.tsx`
```typescript
// Vue calendrier + liste par jour
- Sélecteur date
- Météo (sélecteur icônes)
- Notes texte
- Upload photos (multiple)
- Filtrage par projet
```

#### Hook `useSiteDiary`
```typescript
export function useSiteDiary(projectId: string) {
  // Load entries by date range
  // Create entry with photos
  // Update entry
  // Delete entry
}
```

---

## 🔹 13. Garanties entreprises & plans de prévention

### ✅ Database
- Tables `company_warranties`, `safety_plans`, `safety_trainings` créées

### 📋 À implémenter

#### Pages
```typescript
// CompanyWarranties.tsx
- Liste garanties par entreprise/projet
- Dates début/fin
- Alerte si fin proche
- Lien avec tickets SAV

// SafetyManagement.tsx
- Plans de prévention (documents)
- Formations sécurité (dates, participants)
- Checklist sécurité chantier
```

---

## 🔹 14. Espace acquéreur "full expérience"

### ✅ Déjà existant
Le portail acquéreur a déjà 8 pages complètes.

### 📋 Améliorations
- Page unique "Mon logement" consolidée
- Timeline visuelle complète
- Résumé financier détaillé
- Anticipation prochaines étapes

---

## 🔹 15. Chat multilingue (auto-traduction légère)

### 📋 À implémenter

#### Migration
```sql
ALTER TABLE messages ADD COLUMN body_lang varchar(5);
```

#### UI
- Détection langue message
- Bouton "Traduire" si langue ≠ utilisateur
- Appel API traduction (Google Translate / DeepL)
- Affichage traduction en dessous

---

## 🔹 16. Logs techniques & usage dashboard

### 📋 Logs techniques
- Infrastructure externe (Datadog / Loki)
- Pas en DB

### 📋 Usage Dashboard (SuperAdmin)
```typescript
// AdminOrganizationDetail.tsx
UsageService.getOrganizationUsage(orgId) {
  return {
    activeProjects: count,
    activeUsers: count (last 30 days),
    documentsCount: count,
    storageUsed: bytes,
    featuresUsed: [list]
  };
}
```

---

## 🔹 17. Export légal complet

### 📋 À implémenter

#### Edge Function `/exports`
```typescript
POST /exports/projects/:id/full-export

async function generateFullExport(projectId) {
  // Crée ZIP avec :
  // - /documents (tous les fichiers)
  // - /data/project.json
  // - /data/lots.json
  // - /data/buyers.json
  // - /data/audit-log.json
  // - /data/site-diary.json

  // Upload ZIP to storage
  // Crée Document "PROJECT_EXPORT"
  // Return download URL
}
```

#### UI
- Bouton "Exporter le projet" (PROMOTER + ADMIN)
- Progress bar génération
- Download automatique

---

## 🔹 18. Mode offline chantier (PWA)

### 📋 V1 : PWA basique
```typescript
// vite.config.ts + manifest.json
- Service Worker
- Cache assets statiques
- Icônes app
- Installable
```

### 📋 V2 : Sync offline
```typescript
// Vue dédiée "Chantier Mobile"
- Réserves
- Tickets SAV
- Photos
- Cache dans IndexedDB
- Sync quand online
```

---

## 📊 Priorités d'implémentation

### 🔴 Priorité 1 (Haute valeur, rapide)
1. ✅ Vérifications automatiques avant notaire
2. ✅ Alertes de retards chantier/tickets
3. ✅ QR codes sur documents
4. ✅ Export légal complet

### 🟡 Priorité 2 (Haute valeur, effort moyen)
5. ✅ Simulateur financier
6. ✅ Journal de chantier
7. ✅ Livraisons & prises de possession
8. ✅ Portail investisseurs

### 🟢 Priorité 3 (Nice-to-have, effort variable)
9. ✅ Page publique projet
10. ✅ Annotations sur plans
11. ✅ Garanties & plans de prévention
12. ✅ Détection auto documents

### 🔵 Priorité 4 (Intégrations externes)
13. ✅ Signature électronique (Swisscom/Skribble)
14. ✅ Visio (Twilio/Daily)
15. ✅ Chat multilingue (Google Translate)

### ⚪ Priorité 5 (Long terme)
16. ✅ Logs & usage dashboard
17. ✅ Mode offline PWA

---

## 🎯 Plan d'implémentation rapide

### Semaine 1 : Priorité 1
- Notary checklist verification
- Delay alerts scheduler
- QR code generation
- Full project export

### Semaine 2 : Priorité 2
- Financial simulator (full)
- Site diary
- Handover events

### Semaine 3 : Priorité 3
- Investor portal
- Public project pages
- Plan annotations

### Semaine 4 : Priorité 4
- Signature integration
- Video call links
- Translation API

---

## 📚 Documentation nécessaire

Pour chaque feature:
1. **API Reference** : Endpoints, payloads, responses
2. **User Guide** : Screenshots, workflows
3. **Developer Guide** : Hooks, services, components
4. **i18n** : Toutes les clés de traduction

---

## ✅ Checklist complétude

- [ ] Toutes les migrations database
- [ ] Tous les hooks
- [ ] Toutes les edge functions
- [ ] Toutes les pages UI
- [ ] Toutes les traductions i18n
- [ ] Tous les tests
- [ ] Documentation complète
- [ ] Guide utilisateur
- [ ] Vidéos démo

---

**Note** : Ce roadmap est un guide vivant. Ajuster les priorités selon le feedback utilisateur et les besoins business.
