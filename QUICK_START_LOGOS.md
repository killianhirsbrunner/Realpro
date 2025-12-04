# RealPro Suite - Quick Start Logos

## Actions Immédiates Requises

Pour activer immédiatement le branding RealPro avec les bons logos, exécutez ces commandes:

### 1. Logo pour Mode CLAIR (8.png)

Ce logo a un texte SOMBRE pour être lisible sur fond CLAIR (#eeede9):

```bash
# Copier 8.png vers le répertoire logos comme logo "light"
cp public/8.png public/logos/realpro-light.png
```

### 2. Logo pour Mode SOMBRE (5.png)

Ce logo a un texte CLAIR pour être lisible sur fond SOMBRE (#1b1b1b):

```bash
# Vous devez placer votre fichier 5.png dans le projet, puis:
cp /chemin/vers/votre/5.png public/logos/realpro-dark.png
```

**Note**: Le fichier 5.png doit être fourni par vous car il n'est pas encore dans le projet.

### 3. Vérification

```bash
# Vérifier que les deux fichiers sont présents
ls -lh public/logos/

# Vous devriez voir:
# realpro-light.png  (votre 8.png)
# realpro-dark.png   (votre 5.png à ajouter)
```

### 4. Test en Développement

```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:5173
# Tester le switch de thème dans le header
```

## Correspondance des Logos

| Fichier Source | Destination | Usage | Caractéristique |
|---------------|-------------|-------|-----------------|
| **8.png** | `public/logos/realpro-light.png` | Mode CLAIR | Texte SOMBRE sur fond CLAIR |
| **5.png** | `public/logos/realpro-dark.png` | Mode SOMBRE | Texte CLAIR sur fond SOMBRE |

## Logique de Sélection

Le composant `RealProLogo` détecte automatiquement le thème:

```tsx
const logo = theme === 'dark'
  ? '/logos/realpro-dark.png'   // 5.png (texte clair)
  : '/logos/realpro-light.png';  // 8.png (texte sombre)
```

## Emplacements Visibles

Une fois les logos en place, ils apparaîtront dans:

1. **Sidebar** (navigation principale)
   - Top-left
   - 140×46px
   - Cliquable → Dashboard

2. **Login Page** (page de connexion)
   - Centré au-dessus du formulaire
   - 200×66px
   - Premier contact utilisateur

3. **Futurs emplacements**:
   - Emails transactionnels
   - Documents PDF générés
   - Factures
   - Page marketing

## Checklist Post-Installation

Après avoir copié les logos:

- [ ] Les deux fichiers sont dans `public/logos/`
- [ ] `realpro-light.png` existe (8.png copié)
- [ ] `realpro-dark.png` existe (5.png copié)
- [ ] Le serveur dev est relancé (`npm run dev`)
- [ ] Le logo apparaît dans la sidebar
- [ ] Le logo apparaît sur la page de login
- [ ] Le logo change quand on switch le thème
- [ ] Le logo n'est pas pixelisé
- [ ] Le contraste est bon dans les deux modes

## Troubleshooting Rapide

### Le logo ne s'affiche pas
```bash
# Vérifier les fichiers
ls -la public/logos/

# Vérifier les permissions
chmod 644 public/logos/*.png

# Redémarrer le serveur
# Ctrl+C puis npm run dev
```

### Le logo ne change pas avec le thème
- Vérifier que les deux fichiers existent
- Clear le cache du navigateur (Ctrl+Shift+R)
- Vérifier la console pour erreurs 404

### Le logo est pixelisé
- Utiliser des images haute résolution (min 360×120px)
- Considérer des versions @2x (720×240px)
- Ou mieux: utiliser SVG si disponible

## Commandes Utiles

```bash
# Copie rapide depuis la racine du projet
cp public/8.png public/logos/realpro-light.png

# Si vous avez 5.png ailleurs
cp ~/Downloads/5.png public/logos/realpro-dark.png

# Vérification
file public/logos/*.png

# Taille des fichiers
du -h public/logos/*.png
```

## Format Recommandé

- **Format**: PNG avec transparence (canal alpha)
- **Résolution**: Minimum 360×120px (ratio 3:1)
- **Retina**: 720×240px recommandé
- **Poids**: < 100KB optimisé
- **Transparence**: OUI (important pour overlay)

## Optimisation (Optionnel)

Si vous voulez optimiser les logos:

```bash
# Avec ImageMagick
convert public/logos/realpro-light.png -quality 95 -resize 360x120 public/logos/realpro-light-optimized.png

# Avec pngquant (meilleur)
pngquant --quality=85-95 public/logos/*.png --ext -optimized.png
```

## Contact Support

Si vous rencontrez des problèmes:

1. Vérifier `LOGO_INTEGRATION_README.md` (guide détaillé)
2. Consulter `REALPRO_BRANDING_GUIDE.md` (guide complet)
3. Vérifier la console navigateur pour erreurs
4. Vérifier les chemins des fichiers

---

**Action immédiate**: Copier les deux fichiers logos pour activer le branding!

```bash
# Commande complète
mkdir -p public/logos && \
cp public/8.png public/logos/realpro-light.png && \
echo "✅ Logo clair copié. Maintenant ajoutez 5.png comme realpro-dark.png"
```
