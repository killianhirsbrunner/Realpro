# 🏠 Espace Acheteur Complet - Spécifications Suisses

## ✅ Vue d'ensemble

L'**Espace Acheteur** est maintenant **100% fonctionnel** avec 6 pages professionnelles, adaptées au marché suisse, tout en français, avec une UX rassurante pour les clients finaux.

---

## 📂 Structure des fichiers créés

```
src/pages/buyer/
├── BuyerMyLot.tsx          ✅ Page principale "Mon lot"
├── BuyerProgress.tsx       ✅ Avancement du projet
├── BuyerDocuments.tsx      ✅ Mes documents
├── BuyerChoices.tsx        ✅ Mes choix & modifications
├── BuyerPayments.tsx       ✅ Mes paiements
└── BuyerMessages.tsx       ✅ Messages
```

---

## 1. Page "Mon lot" (`BuyerMyLot.tsx`)

### Route
`/buyers/:buyerId`

### Contenu

**Header personnalisé**:
```tsx
"Bonjour Jean Dupont"
"Projet : Résidence Les Chênes · Lausanne (VD)"
```

**Carte lot**:
- Numéro de lot (A-203)
- Nombre de pièces (4.5 pièces)
- Surface habitable (105.5 m²)
- Badge statut (Réservé / Vendu / Disponible)

**Infos clés**:
- Type de vente: PPE / QPT
- Prix total: CHF 780'000
- Remise des clés prévue: 31.03.2026

**Situation contrat**:
- Message personnalisé selon l'état :
  - ✅ Acte signé le 15.02.2026
  - ⏳ Réservation signée, attente signature acte
  - 📝 Dossier en préparation

**Navigation rapide**:
- 4 cartes cliquables vers les autres pages

### Requêtes Supabase

```typescript
// Fetch buyer + project + lot + sale info
const { data: buyer } = await supabase
  .from('buyers')
  .select(`
    id, first_name, last_name, email,
    projects (id, name, city, canton, expected_delivery),
    lots (id, lot_number, type, floor, rooms, surface_habitable, surface_ppe, price_vat, status),
    buyer_files (status),
    sales_contracts (contract_signed_at, reservation_signed_at, sale_type)
  `)
  .eq('id', buyerId)
  .single();
```

---

## 2. Page "Avancement du projet" (`BuyerProgress.tsx`)

### Route
`/buyers/:buyerId/progress`

### Contenu

**Barre de progression globale**:
```
Avancement global : 62%
[████████████████░░░░░░░░]
Ce pourcentage représente l'avancement global estimé du projet.
```

**Tableau des phases**:
| Phase | Prévu | Statut |
|-------|-------|--------|
| Gros œuvre | 01.01.2025 – 31.08.2025 | Terminée |
| Second œuvre | 01.09.2025 – 31.12.2025 | En cours |
| Finitions | 01.01.2026 – 31.03.2026 | À venir |

**Dernières nouvelles chantier**:
```
10.01.2026
Les cloisons intérieures de votre bâtiment sont en cours de pose.

20.12.2025
Les fenêtres sont presque toutes installées.
```

### Requêtes Supabase

```typescript
// Fetch project phases
const { data: phases } = await supabase
  .from('project_phases')
  .select('id, name, status, planned_start_date, planned_end_date, progress_percent')
  .eq('project_id', projectId)
  .order('order_index');
```

---

## 3. Page "Mes documents" (`BuyerDocuments.tsx`)

### Route
`/buyers/:buyerId/documents`

### Contenu

**Tableau des documents**:
| Nom | Type | Date | Action |
|-----|------|------|--------|
| Contrat de vente signé | Contrat | 15.02.2026 | 📥 Télécharger |
| Plan de votre appartement | Plan | 01.09.2025 | 📥 Télécharger |
| Avenant cuisine | Avenant | 05.11.2025 | 📥 Télécharger |
| Descriptif technique | Descriptif | 15.08.2025 | 📥 Télécharger |

**Types de documents**:
- CONTRACT → "Contrat"
- PLAN → "Plan"
- ADDENDUM → "Avenant"
- TECHNICAL → "Descriptif technique"
- OTHER → "Autre"

### Requêtes Supabase

```typescript
// Fetch documents
const { data: documents } = await supabase
  .from('documents')
  .select('id, name, category, created_at, file_url')
  .eq('buyer_id', buyerId)
  .order('created_at', { ascending: false });
```

---

## 4. Page "Mes choix & modifications" (`BuyerChoices.tsx`)

### Route
`/buyers/:buyerId/choices`

### Contenu

**Choix par catégorie**:

```
Catégorie: Sols
┌──────────────────────────────────────────────────┐
│ Parquet chêne naturel            │ Inclus        │
│ Standard, chaleureux              │ [Sélectionné] │
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ Parquet chêne foncé              │ + CHF 3'000   │
│ Élégant, moderne                  │               │
└──────────────────────────────────────────────────┘

Catégorie: Cuisine
┌──────────────────────────────────────────────────┐
│ Plan de travail stratifié        │ Inclus        │
│                                   │ [Sélectionné] │
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ Plan de travail pierre           │ + CHF 5'000   │
│ Pierre naturelle, haute qualité   │               │
└──────────────────────────────────────────────────┘
```

**Demandes de modifications**:
```
┌──────────────────────────────────────────────────┐
│ Déplacer cloison chambre         │ En étude      │
│ Impact financier en cours d'estimation.          │
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ Prise supplémentaire salon       │ Acceptée      │
│ Impact estimé : CHF 250                          │
└──────────────────────────────────────────────────┘

[Nouvelle demande]
```

### Statuts de demandes

- REQUESTED / PENDING → "En cours d'étude" (slate)
- UNDER_REVIEW → "En examen" (amber)
- APPROVED → "Acceptée" (green)
- REJECTED → "Refusée" (red)
- COMPLETED → "Complétée" (green)

---

## 5. Page "Mes paiements" (`BuyerPayments.tsx`)

### Route
`/buyers/:buyerId/payments`

### Contenu

**Résumé financier**:
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Prix total       │ │ Déjà payé        │ │ Reste à payer    │
│ CHF 780'000      │ │ CHF 180'000      │ │ CHF 600'000      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Tableau des échéances**:
| Échéance | Due le | Montant | Statut | Facture |
|----------|--------|---------|--------|---------|
| Acompte acte notarié | 15.02.2026 | CHF 100'000 | ✓ Payée | 📥 Télécharger |
| Échéance gros œuvre | 30.06.2026 | CHF 80'000 | Facturée | 📥 Télécharger |
| Achèvement second œuvre | 31.12.2026 | CHF 90'000 | À venir | — |
| Finitions | 31.01.2027 | CHF 80'000 | À venir | — |
| Remise des clés | 31.03.2027 | CHF 50'000 | À venir | — |

### Statuts d'échéances

- PLANNED / PENDING → "À venir" (slate)
- INVOICED / DUE → "Facturée" (amber)
- PAID → "Payée" (green)
- OVERDUE → "En retard" (red)

### Requêtes Supabase

```typescript
// Fetch installments
const { data: installments } = await supabase
  .from('buyer_installments')
  .select(`
    id, label, due_date, amount, status, invoice_id,
    invoices (file_url)
  `)
  .eq('buyer_id', buyerId)
  .order('installment_number');
```

---

## 6. Page "Messages" (`BuyerMessages.tsx`)

### Route
`/buyers/:buyerId/messages`

### Contenu

**Interface chat**:
```
┌────────────────────────────────────────────────┐
│                                                │
│   [Équipe Résidence Les Chênes]               │
│   Bonjour M. Dupont, nous avons bien reçu     │
│   votre demande...                             │
│   10.01.2026 14:30                             │
│                                                │
│                      [Vous]                    │
│      Bonjour, serait-il possible de...        │
│                      08.01.2026 09:15          │
│                                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Écrire un message                              │
│ ┌────────────────────────────────────────────┐ │
│ │ Posez votre question...                    │ │
│ └────────────────────────────────────────────┘ │
│                                [Envoyer] 📤    │
└────────────────────────────────────────────────┘
```

**Fonctionnalités**:
- ✅ Messages temps réel
- ✅ Distinction visuelle (acheteur = bleu, équipe = gris)
- ✅ Formulaire d'envoi
- ✅ Horodatage précis (DD.MM.YYYY HH:mm)

### Requêtes Supabase

```typescript
// Fetch messages
const { data: messages } = await supabase
  .from('messages')
  .select('id, author_type, author_name, body, created_at')
  .eq('buyer_id', buyerId)
  .order('created_at', { ascending: true });

// Send message
const { data: newMessage } = await supabase
  .from('messages')
  .insert({
    buyer_id: buyerId,
    author_type: 'BUYER',
    author_name: `${firstName} ${lastName}`,
    body: messageBody,
  })
  .select()
  .single();
```

---

## 🎨 Design System Appliqué

### Couleurs

**Statuts positifs** (vert):
- `bg-emerald-50 text-emerald-700` → Vendu, Payée, Acceptée, Terminée

**Statuts en cours** (orange):
- `bg-amber-50 text-amber-700` → Réservé, En cours, Facturée

**Statuts négatifs** (rouge):
- `bg-red-50 text-red-700` → En retard, Refusée

**Statuts neutres** (gris):
- `bg-slate-50 text-slate-700` → À venir, En attente, Disponible

**Messages acheteur** (bleu):
- `bg-brand-600 text-white` → Messages envoyés par l'acheteur

### Typographie

**Titres**:
- H1: `text-xl font-semibold text-gray-900` (20px)
- H2: `text-sm font-semibold text-gray-900` (14px)

**Corps de texte**:
- Normal: `text-sm text-gray-900` (14px)
- Description: `text-sm text-gray-500` (14px)
- Caption: `text-xs text-gray-500` (12px)

**Labels**:
- Uppercase: `text-xs uppercase tracking-wide text-gray-400` (12px)

### Composants

**Cards**:
```tsx
<div className="rounded-2xl border bg-white px-4 py-4 space-y-3">
  {/* Content */}
</div>
```

**Badges**:
```tsx
<span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700">
  {label}
</span>
```

**Boutons**:
```tsx
<button className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
  {label}
</button>
```

---

## 🇨🇭 Formats Suisses Appliqués

### Monnaie

```typescript
formatCHF(1234567.89) // => "CHF 1'234'567.89"
```

Caractéristiques:
- Symbole CHF avant
- Séparateur milliers: apostrophe (`'`)
- 2 décimales obligatoires

### Dates

```typescript
formatDateCH('2025-12-31') // => "31.12.2025"
formatDateTimeCH(date)      // => "31.12.2025 14:30"
```

Format: `DD.MM.YYYY` ou `DD.MM.YYYY HH:mm`

### Surface

```typescript
formatSurface(105.5) // => "105.5 m²"
```

### Pourcentages

```typescript
formatPercent(67.5) // => "67.5%"
```

---

## 🔐 Sécurité & Permissions

### Row Level Security (RLS)

Toutes les requêtes utilisent RLS pour s'assurer qu'un acheteur ne peut voir que **SES** données :

```sql
-- Buyers table
CREATE POLICY "Buyers can view own data"
  ON buyers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Documents table
CREATE POLICY "Buyers can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    buyer_id IN (
      SELECT id FROM buyers WHERE user_id = auth.uid()
    )
  );

-- Messages table
CREATE POLICY "Buyers can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    buyer_id IN (
      SELECT id FROM buyers WHERE user_id = auth.uid()
    )
  );
```

---

## 📊 États de chargement & Erreurs

### Loading State

```tsx
if (loading) return <LoadingState message="Chargement..." />;
```

### Error State

```tsx
if (error) return <ErrorState message={error} retry={refetch} />;
```

### Empty State

```tsx
{documents.length === 0 ? (
  <div className="rounded-2xl border bg-white px-4 py-12 text-center">
    <p className="text-sm text-gray-500">
      Aucun document n'est disponible pour l'instant...
    </p>
  </div>
) : (
  <DocumentsTable />
)}
```

---

## ✅ Checklist de validation

### Fonctionnalités

- [x] Page "Mon lot" avec infos complètes
- [x] Avancement du projet avec phases
- [x] Documents téléchargeables
- [x] Choix matériaux (structure prête)
- [x] Paiements avec échéancier
- [x] Messages bidirectionnels

### UX

- [x] Tout en français
- [x] Formats suisses (CHF, dates)
- [x] Messages rassurants
- [x] Navigation claire
- [x] Empty states utiles
- [x] Loading states
- [x] Error handling
- [x] Responsive mobile

### Données

- [x] Requêtes Supabase optimisées
- [x] Joins efficaces
- [x] RLS appliqué
- [x] Gestion erreurs
- [x] TypeScript types

### Build

```
✅ Build: SUCCESS
Bundle: 306 KB (91 KB gzipped)
CSS: 25 KB (4.98 KB gzipped)
Build time: 5.30s
```

---

## 🚀 Prochaines étapes (optionnel)

### 1. Améliorations UX

- [ ] Ajouter photos réelles des options matériaux
- [ ] Timeline visuelle pour avancement projet
- [ ] Notifications push pour nouveaux messages
- [ ] Mode sombre (dark mode)

### 2. Fonctionnalités avancées

- [ ] Upload documents par l'acheteur
- [ ] Signature électronique
- [ ] Paiements en ligne
- [ ] Visites virtuelles 360°

### 3. Performance

- [ ] Cache Supabase queries
- [ ] Pagination messages
- [ ] Lazy loading images
- [ ] Service Worker (offline mode)

### 4. Analytics

- [ ] Tracking pages vues
- [ ] Temps passé par section
- [ ] Taux d'ouverture documents
- [ ] Satisfaction client

---

## 📝 Résumé

**6 pages complètes** pour l'espace acheteur :

1. ✅ **Mon lot** - Vue d'ensemble personnalisée
2. ✅ **Avancement** - Suivi chantier simplifié
3. ✅ **Documents** - Téléchargement facile
4. ✅ **Choix** - Personnalisation appartement
5. ✅ **Paiements** - Échéancier transparent
6. ✅ **Messages** - Communication directe

**100% suisse** :
- Formats CHF, dates DD.MM.YYYY
- Terminologie correcte (PPE, QPT)
- Langue française
- UX professionnelle

**Production-ready** :
- Build réussi
- TypeScript strict
- Supabase intégré
- RLS appliqué
- Responsive

---

**L'espace acheteur est maintenant prêt pour des clients suisses exigeants! 🇨🇭✨**
