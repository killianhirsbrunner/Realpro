# RealPro Suite - Guide de Branding Officiel

## Vue d'ensemble

Ce guide définit l'identité visuelle complète de RealPro Suite, le SaaS suisse premium de gestion de projets immobiliers. Le design system est conçu pour rivaliser avec les meilleurs produits mondiaux (Apple, Linear, Notion, Stripe) tout en conservant une identité suisse raffinée et professionnelle.

## 1. Logos

### Logo Principal

**Deux variantes selon le contexte:**

#### Mode Clair (fond clair #eeede9)
- **Fichier**: `public/logos/realpro-light.png` (correspond à 8.png)
- **Usage**: Sur fond clair
- **Caractéristiques**: Texte sombre, haute lisibilité
- **Formats**: PNG avec transparence, SVG recommandé
- **Tailles**:
  - Header: 180×60px
  - Sidebar: 140×46px
  - Mobile: 120×40px
  - Favicon: 32×32px

#### Mode Sombre (fond sombre #1b1b1b)
- **Fichier**: `public/logos/realpro-dark.png` (correspond à 5.png)
- **Usage**: Sur fond sombre
- **Caractéristiques**: Texte clair, contraste optimal
- **Mêmes dimensions que mode clair**

### Zones de Protection

**Espace minimal autour du logo**: 24px de tous les côtés

**Taille minimale**:
- Web: 100px de largeur
- Print: 30mm de largeur
- Mobile: 80px de largeur

### Utilisations Interdites

❌ Ne pas déformer le logo
❌ Ne pas changer les couleurs
❌ Ne pas ajouter d'effets (ombres, dégradés)
❌ Ne pas placer sur fond à faible contraste
❌ Ne pas utiliser de versions pixelisées

## 2. Palette de Couleurs

### Couleurs Primaires

#### Mode Clair
```css
--color-bg-primary: #eeede9;      /* Fond principal - beige doux */
--color-bg-secondary: #f5f4f0;    /* Fond cartes */
--color-text-primary: #1b1b1b;    /* Texte principal - noir riche */
--color-text-secondary: #4a4a4a;  /* Texte secondaire */
--color-text-tertiary: #6b6b6b;   /* Texte tertiaire */
--color-border: #cfcfcb;          /* Bordures */
--color-hover: #d9d8d4;           /* États hover */
```

#### Mode Sombre
```css
--color-bg-primary: #1b1b1b;      /* Fond principal - noir riche */
--color-bg-secondary: #242424;    /* Fond cartes */
--color-bg-tertiary: #2a2a2a;     /* Fond élevé */
--color-text-primary: #f4f4f4;    /* Texte principal - blanc cassé */
--color-text-secondary: #b5b5b5;  /* Texte secondaire */
--color-text-tertiary: #8a8a8a;   /* Texte tertiaire */
--color-border: #2f2f2f;          /* Bordures */
--color-hover: #303030;           /* États hover */
```

### Couleurs Fonctionnelles

#### Succès (Validation, complétion)
```css
--color-success-light: #10b981;
--color-success-dark: #059669;
--color-success-bg-light: #d1fae5;
--color-success-bg-dark: #064e3b;
```

#### Erreur (Alertes, suppression)
```css
--color-error-light: #ef4444;
--color-error-dark: #dc2626;
--color-error-bg-light: #fee2e2;
--color-error-bg-dark: #7f1d1d;
```

#### Attention (Warnings, en attente)
```css
--color-warning-light: #f59e0b;
--color-warning-dark: #d97706;
--color-warning-bg-light: #fef3c7;
--color-warning-bg-dark: #78350f;
```

#### Information (Conseils, aide)
```css
--color-info-light: #0891b2;
--color-info-dark: #0891b2;
--color-info-bg-light: #cffafe;
--color-info-bg-dark: #1e3a8a;
```

### Couleurs d'Accent

#### Bleu RealPro (Actions primaires)
```css
--color-blue-primary: #0891b2;
--color-blue-hover: #0e7490;
--color-blue-light: #06b6d4;
```

#### Or/Beige Premium (Accents luxe)
```css
--color-gold: #d4af37;
--color-gold-light: #e8c574;
--color-beige: #eeede9;
```

## 3. Typographie

### Police Principale: Inter

**Usage**: Interface utilisateur, corps de texte, navigation

**Poids utilisés**:
- Regular (400) - Corps de texte
- Medium (500) - Navigation, labels
- SemiBold (600) - Titres secondaires
- Bold (700) - Titres principaux

**Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Police d'Accent: Playfair Display (optionnel)

**Usage**: Titres marketing, page d'accueil, branding premium

**Poids utilisés**:
- Regular (400)
- Bold (700)

**Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
```

### Hiérarchie Typographique

#### Headings
```css
h1: 36px / 44px (2.25rem / 2.75rem) - Bold
h2: 30px / 38px (1.875rem / 2.375rem) - SemiBold
h3: 24px / 32px (1.5rem / 2rem) - SemiBold
h4: 20px / 28px (1.25rem / 1.75rem) - Medium
h5: 18px / 26px (1.125rem / 1.625rem) - Medium
h6: 16px / 24px (1rem / 1.5rem) - Medium
```

#### Body Text
```css
Large: 18px / 28px (1.125rem / 1.75rem) - Regular
Base: 16px / 24px (1rem / 1.5rem) - Regular
Small: 14px / 20px (0.875rem / 1.25rem) - Regular
XSmall: 12px / 16px (0.75rem / 1rem) - Regular
```

### Règles d'Utilisation

- **Interligne**: 150% pour le corps, 120% pour les titres
- **Longueur de ligne**: 60-80 caractères max
- **Espacement lettres**: Normal (pas de tracking excessif)
- **Pas de ALL CAPS** sauf cas exceptionnels (badges, labels courts)

## 4. Espacement et Grille

### Système d'Espacement (Base 8px)

```
4px   (0.25rem) - xs
8px   (0.5rem)  - sm
12px  (0.75rem) - md
16px  (1rem)    - base
24px  (1.5rem)  - lg
32px  (2rem)    - xl
48px  (3rem)    - 2xl
64px  (4rem)    - 3xl
96px  (6rem)    - 4xl
```

### Marges Standards

- **Padding conteneur**: 24px mobile, 48px desktop
- **Gap entre cards**: 16px mobile, 24px desktop
- **Sections**: 64px entre grandes sections
- **Composants**: 12-16px padding interne

### Grille Responsive

```css
Mobile:    4 colonnes (< 640px)
Tablet:    8 colonnes (640px - 1024px)
Desktop:   12 colonnes (> 1024px)
Max-width: 1440px (conteneur principal)
```

## 5. Composants UI

### Boutons

#### Bouton Principal (Primary)
```css
Background: #1b1b1b (clair) / #eeede9 (sombre)
Text: #eeede9 (clair) / #1b1b1b (sombre)
Padding: 12px 24px
Border-radius: 8px
Font: Medium 16px
Hover: Légère élévation + opacity 90%
```

#### Bouton Secondaire (Outline)
```css
Background: transparent
Border: 1.5px solid currentColor
Padding: 12px 24px
Border-radius: 8px
```

#### Bouton Tertiaire (Ghost)
```css
Background: transparent
Hover: Background subtil
Padding: 8px 16px
```

### Cards

```css
Background: --color-bg-secondary
Border: 1px solid --color-border
Border-radius: 12px (standard) / 16px (large)
Padding: 24px
Shadow: Subtile au hover
Transition: 200ms ease
```

### Inputs

```css
Height: 44px
Padding: 12px 16px
Border: 1.5px solid --color-border
Border-radius: 8px
Font: Regular 16px
Focus: Border --color-blue-primary, ring 3px
```

### Tables

```css
Header: Background --color-bg-secondary, Bold text
Row height: 56px
Padding: 16px
Border: Bottom 1px solid --color-border
Hover: Background --color-hover
Stripe: Alternée si > 10 rows
```

### Badges

```css
Padding: 4px 12px
Border-radius: 6px (pill shape)
Font: Medium 12px
Uppercase: Non (sentence case)
```

## 6. Iconographie

### Bibliothèque: Lucide React

**Style**: Outline, trait 1.5px
**Tailles standard**: 16px, 20px, 24px
**Couleur**: Hérite du texte parent

### Usage

- **Navigation**: 20px
- **Actions**: 16px
- **Headers**: 24px
- **Illustrations**: 48px+

### Règles

- Toujours aligné verticalement avec texte
- Espacement 8-12px entre icône et texte
- Cohérence du style (pas de mix outline/filled)

## 7. Élévation et Ombres

### Système de Shadow (subtil, style Apple)

```css
Shadow 1 (Hover card):
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

Shadow 2 (Modal, dropdown):
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

Shadow 3 (Dialog, panel):
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);

Shadow 4 (Max élévation):
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

**Mode sombre**: Multiplier opacity par 1.5

## 8. Animations et Transitions

### Durées Standards

```css
Instant: 100ms
Fast: 200ms (hover, focus)
Base: 300ms (modals, drawers)
Slow: 500ms (page transitions)
```

### Easing Functions

```css
Standard: cubic-bezier(0.4, 0, 0.2, 1)
Entrance: cubic-bezier(0, 0, 0.2, 1)
Exit: cubic-bezier(0.4, 0, 1, 1)
```

### Micro-interactions

- **Hover**: Scale 1.02, transition 200ms
- **Active**: Scale 0.98
- **Focus**: Ring 3px, transition 200ms
- **Loading**: Pulse animation
- **Success**: Check animation avec bounce

## 9. Layout Patterns

### Header

```
Height: 64px
Padding: 0 48px (desktop), 0 24px (mobile)
Border-bottom: 1px solid --color-border
Sticky: Top 0, z-index 50
```

### Sidebar

```
Width: 280px (desktop)
Full-width overlay (mobile)
Padding: 24px
Logo: Top, mb-48px
Navigation: Gap 8px
```

### Conteneur Principal

```
Max-width: 1440px
Padding: 48px (desktop), 24px (mobile)
Margin: 0 auto
```

### Modals

```
Max-width: 600px (standard), 900px (large)
Padding: 32px
Border-radius: 16px
Backdrop: rgba(0,0,0,0.5)
```

## 10. Responsive Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Tablette portrait */
md: 768px   /* Tablette paysage */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Règles Responsive

- **Navigation**: Hamburger < 1024px
- **Cards grid**: 1 col mobile, 2 cols tablet, 3-4 cols desktop
- **Typography**: Scale down 10% < 640px
- **Padding**: Réduire 50% < 640px

## 11. Accessibilité (WCAG 2.1 AA)

### Contraste

- **Texte normal**: Min 4.5:1
- **Texte large**: Min 3:1
- **UI Components**: Min 3:1

### Focus States

- Toujours visible
- Ring 3px, couleur accent
- Ne jamais utiliser `outline: none` sans alternative

### Textes Alternatifs

- Toutes les images ont `alt`
- Icônes décoratives: `aria-hidden="true"`
- Boutons: texte explicite ou `aria-label`

### Navigation Clavier

- Ordre logique de tabulation
- Skip links disponibles
- Modals: trap focus

## 12. Dark Mode

### Stratégie

**Pas d'inversion brutale** - Design spécifique mode sombre

**Contraste ajusté**:
- Texte: Blanc cassé (#f4f4f4) jamais blanc pur
- Fond: Noir riche (#1b1b1b) jamais noir pur
- Bordures: Plus subtiles qu'en mode clair

**Couleurs fonctionnelles**:
- Versions légèrement plus claires en dark mode
- Maintien de la hiérarchie visuelle

### Toggle

- Switch accessible (header top-right)
- Préférence système par défaut
- Persistance localStorage

## 13. Branding dans les Modules

### Documents PDF

- Logo en header (32mm largeur)
- Couleurs primaires respectées
- Typographie cohérente
- Footer avec coordonnées

### Emails Transactionnels

- Logo centré en header
- Palette couleurs simplifiée
- CTA avec couleurs brand
- Footer signature RealPro

### Factures QR

- Logo discret en coin
- Couleurs monochromes si impression
- QR code optimisé

### Dashboards

- Charts: Palette RealPro
- KPIs: Design cards cohérent
- Graphs: Couleurs accessibles

## 14. Tone of Voice

### Principes

- **Professionnel mais accessible**
- **Clair et précis** (public technique et non-technique)
- **Suisse**: Sobre, fiable, premium
- **Moderne**: Pas guindé, langage actuel

### Vocabulaire

✅ Utiliser: Projet, lot, acheteur, CFC, promoteur
❌ Éviter: Jargon anglo-saxon inutile, buzzwords

### Messages d'Erreur

- Expliquer le problème
- Suggérer une solution
- Ton empathique, jamais accusateur

### Microcopy

- Boutons: Verbes d'action ("Enregistrer", pas "OK")
- Placeholders: Exemples concrets
- Aide: Contextuelle et concise

## 15. Checklist de Conformité

Avant de shipper une nouvelle feature:

- [ ] Logo RealPro affiché correctement
- [ ] Palette couleurs respectée
- [ ] Typographie Inter appliquée
- [ ] Espacements système 8px
- [ ] Dark mode testé
- [ ] Responsive mobile vérifié
- [ ] Accessibilité validée (contraste, focus)
- [ ] Animations fluides (200-300ms)
- [ ] Micro-interactions présentes
- [ ] Cohérence avec le reste de l'app

## 16. Ressources

### Fichiers Design

- `public/logos/realpro-light.png` - Logo mode clair
- `public/logos/realpro-dark.png` - Logo mode sombre
- `src/components/branding/RealProLogo.tsx` - Composant React

### Documentation Technique

- `REALPRO_BRANDING_GUIDE.md` - Ce document
- `tailwind.config.js` - Configuration des couleurs
- `src/index.css` - Variables CSS globales

### Composants Réutilisables

- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/Sidebar.tsx`

---

**Version**: 1.0
**Dernière mise à jour**: 2025-12-04
**Maintenu par**: Équipe RealPro Suite

Ce guide évolue avec le produit. Pour toute question sur le branding, référez-vous à ce document officiel.
