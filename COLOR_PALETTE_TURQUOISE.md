# 🎨 PALETTE DE COULEURS TURQUOISE - REALPRO SA

**Guide Visuel Complet**

---

## 🌊 COULEUR PRINCIPALE : TURQUOISE

### Nuance Principale (brand-600)

```
┌─────────────────────────────────────────┐
│                                         │
│              #0891B2                    │
│           RGB(8, 145, 178)              │
│                                         │
│         TURQUOISE PRINCIPAL             │
│                                         │
│    Utilisation: Boutons principaux,    │
│    liens, accents, graphiques          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 PALETTE COMPLÈTE BRAND

### Ultra Clair → Foncé

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ brand-50 │brand-100 │brand-200 │brand-300 │brand-400 │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ #ecfeff  │ #cffafe  │ #a5f3fc  │ #67e8f9  │ #22d3ee  │
│ Presque  │ Très     │ Clair    │ Moyen    │ Lumineux │
│ blanc    │ léger    │          │ clair    │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘

┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│brand-500 │brand-600 │brand-700 │brand-800 │brand-900 │brand-950 │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ #06b6d4  │ #0891b2  │ #0e7490  │ #155e75  │ #164e63  │ #083344  │
│ Principal│ PRINCIPAL│ Foncé    │ Très     │ Ultra    │ Presque  │
│ clair    │    ⭐    │          │ foncé    │ foncé    │ noir     │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 🎯 USAGE PAR CONTEXTE

### Boutons

```jsx
// Bouton Principal
<button className="bg-brand-600 hover:bg-brand-700 text-white">
  Action Principale
</button>

// Bouton Secondaire
<button className="bg-brand-100 hover:bg-brand-200 text-brand-700">
  Action Secondaire
</button>

// Bouton Ghost
<button className="text-brand-600 hover:bg-brand-50">
  Action Tertiaire
</button>
```

**Visuel:**
```
┌─────────────────────┐
│  Action Principale  │  ← bg-brand-600 (turquoise plein)
└─────────────────────┘

┌─────────────────────┐
│ Action Secondaire   │  ← bg-brand-100 (turquoise très clair)
└─────────────────────┘

  Action Tertiaire       ← text-brand-600 (texte turquoise)
```

### Liens

```jsx
<a href="#" className="text-brand-600 hover:text-brand-700 underline">
  Lien cliquable
</a>
```

**Visuel:**
```
Normal:  Lien cliquable  ← text-brand-600
Hover:   Lien cliquable  ← text-brand-700 (plus foncé)
```

### Backgrounds

```jsx
// Background léger
<div className="bg-brand-50">Contenu</div>

// Background moyen
<div className="bg-brand-100">Contenu</div>

// Background accentué
<div className="bg-brand-600 text-white">Contenu</div>
```

**Visuel:**
```
┌─────────────────────────────┐
│ Background ultra léger      │  ← bg-brand-50
└─────────────────────────────┘

┌─────────────────────────────┐
│ Background léger            │  ← bg-brand-100
└─────────────────────────────┘

┌─────────────────────────────┐
│ Background turquoise plein  │  ← bg-brand-600
└─────────────────────────────┘
```

### Bordures

```jsx
<div className="border-2 border-brand-600">
  Card avec bordure turquoise
</div>
```

**Visuel:**
```
╔═════════════════════════════╗
║ Card avec bordure turquoise ║  ← border-brand-600
╚═════════════════════════════╝
```

---

## 📊 GRAPHIQUES & VISUALISATIONS

### Couleurs de Graphiques (Ordre d'Utilisation)

```
1. #0891b2  ████████  Turquoise (principal)
2. #10b981  ████████  Vert
3. #f59e0b  ████████  Orange
4. #ef4444  ████████  Rouge
5. #8b5cf6  ████████  Violet
6. #14b8a6  ████████  Teal
7. #ec4899  ████████  Rose
8. #f97316  ████████  Orange clair
```

**Usage Charts:**
```jsx
import { designTokens } from '@/lib/design-system/tokens';

<RechartsBar>
  <Bar dataKey="value1" fill={designTokens.colors.chart[0]} /> // Turquoise
  <Bar dataKey="value2" fill={designTokens.colors.chart[1]} /> // Vert
  <Bar dataKey="value3" fill={designTokens.colors.chart[2]} /> // Orange
</RechartsBar>
```

---

## 🎭 STATES & INTERACTIONS

### Hover States

```
Normal  → bg-brand-600    #0891b2  ████████
Hover   → bg-brand-700    #0e7490  ████████ (plus foncé)
Active  → bg-brand-800    #155e75  ████████ (encore plus foncé)
```

### Focus States

```jsx
<input className="
  border-gray-300
  focus:border-brand-500
  focus:ring-2
  focus:ring-brand-500
  focus:ring-opacity-50
"/>
```

**Visuel:**
```
Normal:  ┌──────────────┐
         │              │  ← border-gray-300
         └──────────────┘

Focus:   ┌──────────────┐
         │    ╔═════╗   │  ← border-brand-500 + ring turquoise
         └──────────────┘
```

---

## 🌓 MODE CLAIR / SOMBRE

### Light Mode
```
Background:     #eeede9  (Beige clair)
Text:           #1b1b1b  (Noir)
Primary:        #0891b2  (Turquoise 600)
Primary Hover:  #0e7490  (Turquoise 700)
```

**Exemple:**
```
┌─────────────────────────────────┐
│ ○○○                    FR [🔔]  │  ← Topbar
├─────────────────────────────────┤
│                                 │
│  Beige clair background         │
│                                 │
│  ┌───────────────────┐          │
│  │ Turquoise Button  │          │  ← bg-brand-600
│  └───────────────────┘          │
│                                 │
└─────────────────────────────────┘
```

### Dark Mode
```
Background:     #1b1b1b  (Noir)
Text:           #eeede9  (Beige clair)
Primary:        #06b6d4  (Turquoise 500 - plus lumineux)
Primary Hover:  #22d3ee  (Turquoise 400)
```

**Exemple:**
```
┌─────────────────────────────────┐
│ ○○○                    FR [🔔]  │  ← Topbar
├─────────────────────────────────┤
│                                 │
│  Noir background                │
│                                 │
│  ┌───────────────────┐          │
│  │ Turquoise Button  │          │  ← bg-brand-500 (plus lumineux)
│  └───────────────────┘          │
│                                 │
└─────────────────────────────────┘
```

---

## 🎨 COULEURS SÉMANTIQUES

### Success (Vert)
```
┌──────────┬──────────┐
│  Normal  │  Light   │
├──────────┼──────────┤
│ #10b981  │ #34d399  │
│ ████████ │ ████████ │
└──────────┴──────────┘

Usage: Validations, confirmations, succès
```

### Warning (Orange)
```
┌──────────┬──────────┐
│  Normal  │  Light   │
├──────────┼──────────┤
│ #f59e0b  │ #fbbf24  │
│ ████████ │ ████████ │
└──────────┴──────────┘

Usage: Alertes, attentions, en attente
```

### Danger (Rouge)
```
┌──────────┬──────────┐
│  Normal  │  Light   │
├──────────┼──────────┤
│ #ef4444  │ #f87171  │
│ ████████ │ ████████ │
└──────────┴──────────┘

Usage: Erreurs, suppressions, échecs
```

### Info (Turquoise)
```
┌──────────┬──────────┐
│  Normal  │  Light   │
├──────────┼──────────┤
│ #0891b2  │ #06b6d4  │
│ ████████ │ ████████ │
└──────────┴──────────┘

Usage: Informations, notes, tips
```

---

## 🏷️ STATUS COLORS (Business Logic)

### CRM Pipeline
```
Prospect     → #8b5cf6  ████████  Violet
Intéressé    → #0891b2  ████████  Turquoise ⭐
Réservé      → #f59e0b  ████████  Orange
Vendu        → #10b981  ████████  Vert
Perdu        → #ef4444  ████████  Rouge
```

### Statut Lots
```
Disponible   → #10b981  ████████  Vert
Réservé      → #f59e0b  ████████  Orange
Vendu        → #0891b2  ████████  Turquoise ⭐
Bloqué       → #ef4444  ████████  Rouge
```

### Statut Financier
```
Payé         → #10b981  ████████  Vert
En attente   → #f59e0b  ████████  Orange
En retard    → #ef4444  ████████  Rouge
Brouillon    → #6b7280  ████████  Gris
```

---

## 🎨 GRADIENTS

### Gradient Turquoise
```jsx
<div className="bg-gradient-to-r from-brand-500 to-brand-700">
  Gradient horizontal
</div>
```

**Visuel:**
```
┌──────────────────────────────────────┐
│ ████████████████████████████████████ │  De clair à foncé
│ ████████████████████████████████████ │  (#06b6d4 → #0e7490)
└──────────────────────────────────────┘
```

### Gradient Turquoise + Teal
```jsx
<div className="bg-gradient-to-br from-brand-400 via-brand-600 to-secondary-600">
  Gradient complexe
</div>
```

**Visuel:**
```
┌──────────────────────────────────────┐
│ ████████████████████████████████████ │  Turquoise lumineux
│ ████████████████████████████████████ │  ↓
│ ████████████████████████████████████ │  Turquoise principal
│ ████████████████████████████████████ │  ↓
│ ████████████████████████████████████ │  Teal
└──────────────────────────────────────┘
```

---

## 💡 EXEMPLES CONCRETS

### Card Premium
```jsx
<div className="bg-white border-2 border-brand-200 rounded-xl p-6 hover:border-brand-400 transition">
  <h3 className="text-brand-700 font-semibold">Titre Card</h3>
  <p className="text-gray-600">Contenu de la card</p>
  <button className="mt-4 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg">
    Action
  </button>
</div>
```

### Badge Status
```jsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-700">
  Actif
</span>
```

### Alert Info
```jsx
<div className="bg-brand-50 border-l-4 border-brand-600 p-4">
  <div className="flex items-start">
    <InfoIcon className="h-5 w-5 text-brand-600 mt-0.5" />
    <div className="ml-3">
      <p className="text-brand-800 font-medium">Information importante</p>
      <p className="text-brand-700 text-sm mt-1">Détails du message...</p>
    </div>
  </div>
</div>
```

---

## 🎯 RÉCAPITULATIF RAPIDE

### Couleur de Marque
```
#0891B2 (brand-600) → Couleur principale officielle ⭐
```

### Classes Principales
```css
bg-brand-600      /* Background turquoise */
text-brand-600    /* Texte turquoise */
border-brand-600  /* Bordure turquoise */
hover:bg-brand-700 /* Hover plus foncé */
focus:ring-brand-500 /* Focus ring */
```

### Token TypeScript
```typescript
import { designTokens } from '@/lib/design-system/tokens';
const color = designTokens.colors.light.brand; // '#0891b2'
```

### CSS Variable
```css
background-color: rgb(var(--color-primary)); /* Turquoise */
```

---

## ✅ CHECKLIST UTILISATION

Avant d'utiliser une couleur, vérifier :

- [ ] Ai-je besoin d'une couleur de marque ? → `brand-*`
- [ ] Est-ce une couleur sémantique ? → `success/warning/danger/info`
- [ ] Est-ce un status business ? → Status colors
- [ ] Ai-je utilisé les classes Tailwind ? (pas de hex en dur)
- [ ] Le contraste est-il suffisant ? (WCAG AA minimum)
- [ ] La couleur fonctionne-t-elle en light ET dark mode ?

---

**RealPro SA - Guide des Couleurs Turquoise**
**Version:** 1.0
**Date:** 2025-12-05
