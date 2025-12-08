# Logos RealPro

## 📁 Contenu

Ce dossier contient le logo de référence RealPro au format SVG.

```
logos/
├── realpro-logo.svg    # Logo officiel RealPro (icon + texte)
└── README.md           # Ce fichier
```

## 🎨 Logo Principal

**Fichier**: `realpro-logo.svg`

### Description

Logo officiel RealPro composé de:
- **Icône**: Losange géométrique avec cercle central
- **Texte**: "Real" (noir) + "Pro" (dégradé bleu)
- **Couleurs**: Bleu brand (#2563eb → #1d4ed8)
- **Dimensions**: 200×48px

### Usage

Ce fichier peut être utilisé pour:
- Exports PDF
- Emails HTML
- Documentation externe
- Présentations
- Intégrations tierces

## 🚫 NE PAS Utiliser Directement dans l'App

**Important**: Dans l'application React, utilisez **toujours** le composant:

```tsx
import { RealProLogo } from './components/branding/RealProLogo';

// Usage
<RealProLogo size="lg" />
```

### Pourquoi?

Le composant `RealProLogo`:
- ✅ S'adapte au thème (dark mode)
- ✅ Responsive (différentes tailles)
- ✅ Optimisé performance (SVG inline)
- ✅ Maintenable (un seul endroit à modifier)

## 📏 Spécifications

### Couleurs

```css
/* Dégradé principal (icône et "Pro") */
#2563eb → #1d4ed8  /* brand-600 → brand-700 */

/* Texte "Real" */
#171717  /* neutral-900 en light mode */
#ffffff  /* white en dark mode */
```

### Dimensions Recommandées

| Usage | Largeur | Hauteur |
|-------|---------|---------|
| Standard | 200px | 48px |
| Header | 160px | 38px |
| Footer | 120px | 29px |
| Email | 200px | 48px |

## 📦 Exports

Si vous avez besoin d'autres formats:

```bash
# PNG haute résolution
inkscape realpro-logo.svg --export-png=realpro-logo.png --export-dpi=300

# PNG @ 2x
inkscape realpro-logo.svg --export-png=realpro-logo@2x.png --export-width=400

# ICO (favicon)
convert realpro-logo.png -resize 32x32 favicon.ico
```

## 🔒 Branding Guidelines

### À Faire ✅

- Respecter les couleurs officielles
- Maintenir les proportions
- Laisser de l'espace autour (minimum 16px)
- Utiliser sur fond clair ou blanc

### À Éviter ❌

- Changer les couleurs
- Déformer ou étirer
- Ajouter des effets
- Utiliser sur fond trop chargé
- Modifier la typographie

## 🛠️ Maintenance

### Mise à Jour du Logo

Si le logo doit être modifié:

1. **Modifier le composant** `RealProLogo.tsx`
2. **Regénérer le SVG** de référence
3. **Tester** dans tous les contextes
4. **Mettre à jour** ce README si nécessaire

### Fichier de Référence

Le logo SVG de ce dossier est généré à partir de `src/components/branding/RealProLogo.tsx`.

En cas de divergence, le **composant React fait foi**.

## 📞 Contact

Pour toute question sur le branding RealPro:
- Email: contact@realpro.ch
- Documentation: [LOGO_CONSISTENCY_AUDIT.md](../../LOGO_CONSISTENCY_AUDIT.md)

---

**Dernière mise à jour**: 8 Décembre 2024
