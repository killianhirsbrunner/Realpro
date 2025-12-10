# Guide de Déploiement - RealPro Suite

Ce guide explique les différentes options pour déployer RealPro Suite.

## Prérequis

1. **Node.js 20+** installé
2. **Compte Supabase** avec un projet configuré
3. **Variables d'environnement** configurées

## Configuration Initiale

```bash
# 1. Cloner le repository
git clone <repository-url>
cd Realpro

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Éditer .env avec vos credentials Supabase
# VITE_SUPABASE_URL=https://votre-projet.supabase.co
# VITE_SUPABASE_ANON_KEY=votre-clé-anonyme
```

---

## Option 1: Vercel (Recommandé)

La méthode la plus simple pour déployer.

### Déploiement Automatique

1. Connectez votre repository GitHub à [Vercel](https://vercel.com)
2. Importez le projet
3. Configurez les variables d'environnement:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Cliquez sur "Deploy"

### Déploiement CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

---

## Option 2: Netlify

### Déploiement Automatique

1. Connectez votre repository à [Netlify](https://netlify.com)
2. Configurez:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Ajoutez les variables d'environnement
4. Déployez

### Déploiement CLI

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod --dir=dist
```

---

## Option 3: Docker

### Build et Run

```bash
# Avec le script de déploiement
./scripts/deploy.sh docker

# Ou manuellement
docker build \
  --build-arg VITE_SUPABASE_URL="votre-url" \
  --build-arg VITE_SUPABASE_ANON_KEY="votre-clé" \
  -t realpro-frontend .

docker run -d -p 3000:80 realpro-frontend
```

### Docker Compose

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f
```

L'application sera accessible sur `http://localhost:3000`

---

## Option 4: Build Manuel

Pour déployer sur n'importe quel hébergeur statique.

```bash
# 1. Installer les dépendances
npm ci

# 2. Build
npm run build

# 3. Le dossier dist/ contient les fichiers à déployer
```

Uploadez le contenu de `dist/` vers:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- N'importe quel serveur web (Apache, Nginx)

---

## Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Oui |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Oui |
| `VITE_APP_ENV` | Environnement (development/production) | Non |
| `VITE_APP_URL` | URL de l'application | Non |

---

## Configuration Supabase

### 1. Créer un Projet

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et la clé anonyme

### 2. Appliquer les Migrations

```bash
# Installer Supabase CLI
npm i -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref votre-project-id

# Appliquer les migrations
supabase db push
```

### 3. Déployer les Edge Functions

```bash
# Déployer toutes les fonctions
supabase functions deploy
```

---

## CI/CD avec GitHub Actions

Le workflow CI/CD est configuré dans `.github/workflows/ci-cd.yml`.

### Configuration des Secrets GitHub

Ajoutez ces secrets dans Settings > Secrets > Actions:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN` (optionnel, pour Vercel)
- `NETLIFY_AUTH_TOKEN` (optionnel, pour Netlify)

### Déclencheurs

- **Push sur main**: Build + Deploy production
- **Pull Request**: Build + Tests

---

## Script de Déploiement

Un script helper est disponible:

```bash
# Voir l'aide
./scripts/deploy.sh help

# Build production
./scripts/deploy.sh build

# Vérifier le code (lint + types)
./scripts/deploy.sh check

# Preview local
./scripts/deploy.sh preview

# Docker
./scripts/deploy.sh docker
./scripts/deploy.sh up    # Docker Compose
./scripts/deploy.sh down  # Arrêter
```

---

## Dépannage

### Erreur de build

```bash
# Nettoyer et réinstaller
rm -rf node_modules dist
npm ci
npm run build
```

### Variables d'environnement non définies

Vérifiez que:
1. Le fichier `.env` existe
2. Les variables commencent par `VITE_`
3. Redémarrez le serveur de dev après modification

### Docker ne démarre pas

```bash
# Vérifier les logs
docker logs realpro-app

# Reconstruire l'image
docker-compose up --build
```

---

## Support

Pour toute question ou problème:
- Documentation: [README.md](README.md)
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
