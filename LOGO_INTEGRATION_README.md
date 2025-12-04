# RealPro Suite - Intégration des Logos

## Instructions de placement des fichiers logos

Pour finaliser l'intégration du branding RealPro, vous devez placer les fichiers logos dans le répertoire approprié.

### Fichiers requis

Le système attend deux fichiers de logo dans le répertoire `public/logos/`:

#### 1. Logo pour mode CLAIR (fond clair #eeede9)
**Fichier source**: `8.png` (texte sombre)
**Destination**: `public/logos/realpro-light.png`

Ce logo sera affiché sur fond clair avec un texte sombre pour un contraste optimal.

```bash
cp /chemin/vers/8.png public/logos/realpro-light.png
```

#### 2. Logo pour mode SOMBRE (fond sombre #1b1b1b)
**Fichier source**: `5.png` (texte clair)
**Destination**: `public/logos/realpro-dark.png`

Ce logo sera affiché sur fond sombre avec un texte clair pour une lisibilité parfaite.

```bash
cp /chemin/vers/5.png public/logos/realpro-dark.png
```

### Structure des fichiers

```
project/
├── public/
│   ├── logos/
│   │   ├── realpro-light.png  ← 8.png (pour mode clair)
│   │   └── realpro-dark.png   ← 5.png (pour mode sombre)
│   └── 8.png (fichier original existant)
├── src/
│   └── components/
│       └── branding/
│           └── RealProLogo.tsx (composant auto-adaptatif)
└── REALPRO_BRANDING_GUIDE.md
```

## Utilisation du composant

Le composant `RealProLogo` s'adapte automatiquement au thème actif:

```tsx
import { RealProLogo } from '@/components/branding/RealProLogo';

// Utilisation simple
<RealProLogo />

// Avec dimensions personnalisées
<RealProLogo width={180} height={60} />

// Avec classe CSS supplémentaire
<RealProLogo className="my-custom-class" />
```

## Logique de sélection

Le composant utilise le contexte de thème pour choisir le bon logo:

- **Theme = 'light'** → Affiche `realpro-light.png` (8.png - texte sombre)
- **Theme = 'dark'** → Affiche `realpro-dark.png` (5.png - texte clair)

## Emplacements d'utilisation

Le logo RealPro est déjà intégré dans les composants suivants:

### 1. Sidebar (Navigation principale)
**Fichier**: `src/components/layout/Sidebar.tsx`
- Logo cliquable qui redirige vers le dashboard
- Dimensions: 140×46px
- Position: En haut de la sidebar

### 2. Login Page (Page de connexion)
**Fichier**: `src/pages/Login.tsx`
- Logo centré au-dessus du formulaire
- Dimensions standard

### 3. Documents PDF
- Logo en header des documents générés
- Taille: 32mm de largeur (impression)

### 4. Emails transactionnels
- Logo centré en header
- Format optimisé pour email

### 5. Factures
- Logo discret en coin
- Version monochrome disponible

## Formats recommandés

### Pour les fichiers fournis

- **Format**: PNG avec transparence
- **Résolution**: Minimum 360×120px (2x pour Retina)
- **Poids**: < 100KB optimisé
- **Transparence**: Oui (canal alpha)

### Formats alternatifs (optionnels)

Si vous souhaitez ajouter d'autres formats:

```
public/logos/
├── realpro-light.png
├── realpro-light.svg      (recommandé pour scalabilité)
├── realpro-light@2x.png   (Retina)
├── realpro-dark.png
├── realpro-dark.svg
└── realpro-dark@2x.png
```

## Optimisation des logos

Pour de meilleures performances, optimisez vos logos:

### PNG
```bash
# Avec pngquant
pngquant --quality=85-95 realpro-light.png -o realpro-light-optimized.png

# Avec optipng
optipng -o7 realpro-light.png
```

### SVG (si disponible)
```bash
# Avec SVGO
svgo realpro-light.svg
```

## Responsive

Le logo s'adapte automatiquement aux différentes tailles d'écran:

- **Desktop**: 180×60px (standard)
- **Tablet**: 140×46px (sidebar)
- **Mobile**: 120×40px (header mobile)
- **Favicon**: 32×32px (icône navigateur)

## Vérification

Pour vérifier que les logos sont correctement intégrés:

### 1. Vérifier les fichiers
```bash
ls -lh public/logos/
```

Vous devriez voir:
```
realpro-light.png  (30-100KB)
realpro-dark.png   (30-100KB)
```

### 2. Tester en mode développement
```bash
npm run dev
```

### 3. Vérifier les deux thèmes
1. Ouvrir l'application
2. Vérifier le logo en mode clair (doit être sombre/8.png)
3. Cliquer sur le toggle de thème
4. Vérifier le logo en mode sombre (doit être clair/5.png)
5. Le logo doit changer instantanément

### 4. Vérifier dans différents contextes
- [ ] Sidebar principale
- [ ] Page de connexion
- [ ] Dashboard
- [ ] Documents PDF générés
- [ ] Emails de notification (si configurés)

## Troubleshooting

### Le logo ne s'affiche pas

**Vérifications**:
1. Les fichiers sont-ils dans `public/logos/` ?
2. Les noms sont-ils exacts (`realpro-light.png` et `realpro-dark.png`) ?
3. Les fichiers ont-ils les bonnes permissions ?
4. Le serveur de dev a-t-il été redémarré après ajout des fichiers ?

### Le logo ne change pas avec le thème

**Causes possibles**:
1. Le contexte de thème n'est pas actif
2. Le composant n'importe pas correctement `useTheme`
3. Cache du navigateur (Ctrl+F5 pour rafraîchir)

### Le logo est pixelisé

**Solutions**:
1. Utiliser des fichiers @2x pour Retina
2. Utiliser SVG au lieu de PNG
3. Vérifier la résolution des fichiers source

### Le logo est trop grand/petit

**Ajustement**:
```tsx
<RealProLogo width={YOUR_WIDTH} height={YOUR_HEIGHT} />
```

Ou via CSS:
```tsx
<RealProLogo className="w-40 h-auto" />
```

## Checklist de validation

Avant de considérer l'intégration terminée:

- [ ] Les deux fichiers logos sont présents dans `public/logos/`
- [ ] Le logo s'affiche correctement en mode clair
- [ ] Le logo s'affiche correctement en mode sombre
- [ ] Le basculement entre thèmes est fluide
- [ ] Le logo est cliquable dans la sidebar
- [ ] Le logo est responsive sur mobile
- [ ] La qualité d'image est excellente (pas de pixelisation)
- [ ] Les tailles sont cohérentes dans toute l'application
- [ ] Le logo respecte les zones de protection (24px)
- [ ] Le contraste est optimal dans les deux modes

## Support

Pour toute question sur l'intégration des logos, référez-vous à:

- **Guide de branding complet**: `REALPRO_BRANDING_GUIDE.md`
- **Composant logo**: `src/components/branding/RealProLogo.tsx`
- **Contexte de thème**: `src/contexts/ThemeContext.tsx`

---

**Dernière mise à jour**: 2025-12-04
**Version**: 1.0
