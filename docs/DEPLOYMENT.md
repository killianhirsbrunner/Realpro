# Guide de Déploiement RealPro Suite

Ce guide détaille les 3 méthodes de déploiement pour RealPro Suite :
1. **Vercel** - Déploiement cloud simplifié (recommandé)
2. **Docker/VPS** - Serveur dédié ou cloud privé
3. **Supabase Production** - Configuration du backend

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :
- Un compte [Supabase](https://supabase.com) avec un projet créé
- Node.js 20+ et pnpm 8.15+ installés localement
- Git configuré avec accès au repository

---

## 1. Déploiement sur Vercel (Recommandé)

Vercel est la méthode la plus simple pour déployer RealPro. Le projet est déjà configuré.

### 1.1 Configuration initiale

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login
```

### 1.2 Créer les projets Vercel

Vous devez créer 4 projets Vercel (un par application) :

```bash
# Projet Shell (site vitrine) - realpro.ch
cd apps/shell
vercel link

# Projet PPE Admin - ppe.realpro.ch
cd ../ppe-admin
vercel link

# Projet Promoteur - promoteur.realpro.ch
cd ../promoteur
vercel link

# Projet Régie - regie.realpro.ch
cd ../regie
vercel link
```

### 1.3 Configurer les variables d'environnement

Pour chaque projet sur [Vercel Dashboard](https://vercel.com/dashboard) :

1. Allez dans **Settings > Environment Variables**
2. Ajoutez les variables suivantes :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production, Preview |
| `VITE_APP_ENV` | `production` | Production |
| `VITE_APP_URL` | `https://realpro.ch` | Production |

### 1.4 Déployer manuellement

```bash
# Déployer une application spécifique
cd apps/shell
vercel --prod

# Ou déployer toutes les apps
pnpm build:all
```

### 1.5 Déploiement automatique (CI/CD)

Le pipeline GitHub Actions est déjà configuré. Pour l'activer :

1. Allez sur GitHub > **Settings > Secrets and variables > Actions**
2. Ajoutez ces secrets :

```
VERCEL_TOKEN           # Token API Vercel (depuis vercel.com/account/tokens)
VERCEL_ORG_ID          # ID de votre équipe Vercel
VERCEL_PROJECT_SHELL   # ID du projet Shell
VERCEL_PROJECT_PPE     # ID du projet PPE Admin
VERCEL_PROJECT_PROMOTEUR # ID du projet Promoteur
VERCEL_PROJECT_REGIE   # ID du projet Régie
VITE_SUPABASE_URL      # URL Supabase
VITE_SUPABASE_ANON_KEY # Clé publique Supabase
```

Pour obtenir les IDs Vercel :
```bash
cd apps/shell
cat .vercel/project.json
# Affiche: {"orgId":"xxx","projectId":"yyy"}
```

### 1.6 Configurer les domaines

Sur Vercel Dashboard > **Settings > Domains** :

| Application | Domaine |
|-------------|---------|
| Shell | `realpro.ch`, `www.realpro.ch` |
| PPE Admin | `ppe.realpro.ch` |
| Promoteur | `promoteur.realpro.ch` |
| Régie | `regie.realpro.ch` |

Vercel fournit automatiquement les certificats SSL.

---

## 2. Déploiement sur Docker/VPS

Pour un contrôle total, déployez sur votre propre serveur.

### 2.1 Prérequis serveur

- Ubuntu 22.04 LTS ou Debian 12
- Docker 24+ et Docker Compose v2
- 2 Go RAM minimum, 4 Go recommandé
- Nginx ou Traefik comme reverse proxy (optionnel)

### 2.2 Installation Docker sur le serveur

```bash
# Installer Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo apt install docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version
```

### 2.3 Cloner et configurer le projet

```bash
# Cloner le repository
git clone https://github.com/votre-org/realpro.git
cd realpro

# Créer le fichier .env
cp .env.example .env

# Éditer les variables
nano .env
```

Contenu du fichier `.env` :
```env
# OBLIGATOIRE - Credentials Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Configuration
VITE_APP_ENV=production
VITE_APP_URL=https://votre-domaine.com
```

### 2.4 Builder et lancer

```bash
# Builder l'image Docker
docker compose build

# Lancer en arrière-plan
docker compose up -d

# Voir les logs
docker compose logs -f

# Vérifier le statut
docker compose ps
```

L'application est disponible sur `http://localhost:3000`.

### 2.5 Configuration Nginx (reverse proxy)

Créez `/etc/nginx/sites-available/realpro` :

```nginx
# Configuration pour realpro.ch (Shell)
server {
    listen 80;
    server_name realpro.ch www.realpro.ch;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name realpro.ch www.realpro.ch;

    ssl_certificate /etc/letsencrypt/live/realpro.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/realpro.ch/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer le site :
```bash
sudo ln -s /etc/nginx/sites-available/realpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2.6 Certificat SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d realpro.ch -d www.realpro.ch

# Renouvellement automatique (déjà configuré par Certbot)
sudo certbot renew --dry-run
```

### 2.7 Déployer les 4 applications séparément

Pour déployer chaque app sur un port différent, créez `docker-compose.prod.yml` :

```yaml
version: '3.8'

services:
  shell:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - BUILD_APP=shell
    ports:
      - "3001:80"
    environment:
      - VITE_APP_URL=https://realpro.ch

  ppe-admin:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - BUILD_APP=ppe-admin
    ports:
      - "3002:80"
    environment:
      - VITE_APP_URL=https://ppe.realpro.ch

  promoteur:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - BUILD_APP=promoteur
    ports:
      - "3003:80"
    environment:
      - VITE_APP_URL=https://promoteur.realpro.ch

  regie:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - BUILD_APP=regie
    ports:
      - "3004:80"
    environment:
      - VITE_APP_URL=https://regie.realpro.ch

networks:
  default:
    name: realpro-network
```

### 2.8 Commandes utiles

```bash
# Arrêter les containers
docker compose down

# Reconstruire après modifications
docker compose up -d --build

# Voir les logs d'une app
docker compose logs -f frontend

# Accéder au container
docker compose exec frontend sh

# Nettoyer les images inutilisées
docker system prune -a
```

---

## 3. Configuration Supabase Production

### 3.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Choisissez la région **Frankfurt (eu-central-1)** pour l'Europe
4. Notez le mot de passe de la base de données

### 3.2 Récupérer les credentials

Dans **Project Settings > API** :

| Paramètre | Description |
|-----------|-------------|
| Project URL | `VITE_SUPABASE_URL` |
| anon public | `VITE_SUPABASE_ANON_KEY` |
| service_role | Pour les fonctions backend (ne jamais exposer côté client) |

### 3.3 Appliquer les migrations

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier au projet
supabase link --project-ref votre-project-ref

# Appliquer toutes les migrations
supabase db push

# Exécuter le seed (données de démo)
supabase db reset --linked
```

### 3.4 Vérifier les migrations

Les migrations créent automatiquement :
- Tables utilisateurs et organisations (multi-tenant)
- Système de rôles et permissions (RBAC)
- Structure projets/bâtiments/lots
- Module CRM et ventes
- Facturation et abonnements
- Documents et contrats
- Notifications et audit logs

### 3.5 Configurer l'authentification

Dans **Authentication > Providers** :

1. **Email** (activé par défaut)
   - Désactiver "Confirm email" pour le développement
   - Activer en production

2. **Google OAuth** (optionnel)
   - Créer des credentials sur Google Cloud Console
   - Ajouter les Client ID et Secret

3. **URL Configuration** :
   - Site URL : `https://realpro.ch`
   - Redirect URLs :
     - `https://realpro.ch/auth/callback`
     - `https://ppe.realpro.ch/auth/callback`
     - `https://promoteur.realpro.ch/auth/callback`
     - `https://regie.realpro.ch/auth/callback`

### 3.6 Configurer le stockage

Dans **Storage** :

```sql
-- Créer les buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('documents', 'documents', false),
  ('avatars', 'avatars', true),
  ('project-files', 'project-files', false);
```

Politiques RLS pour les documents :
```sql
-- Les utilisateurs peuvent voir les documents de leur organisation
CREATE POLICY "Users can view org documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM organizations
    WHERE id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  )
);
```

### 3.7 Configurer les Edge Functions (optionnel)

```bash
# Créer une fonction
supabase functions new send-email

# Déployer
supabase functions deploy send-email --project-ref votre-ref

# Définir les secrets
supabase secrets set SMTP_HOST=smtp.example.com
supabase secrets set SMTP_USER=user@example.com
supabase secrets set SMTP_PASS=password
```

### 3.8 Sauvegardes

- **Point-in-time Recovery** : Activé automatiquement (Pro plan)
- **Daily backups** : Configuration dans **Database > Backups**
- **Export manuel** :
  ```bash
  pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
  ```

### 3.9 Monitoring

Dans **Reports** :
- Queries lentes
- Utilisation des connexions
- Taille de la base de données

Configurer les alertes dans **Settings > Integrations**.

---

## 4. Checklist de mise en production

### Sécurité
- [ ] Variables d'environnement configurées (jamais en dur dans le code)
- [ ] RLS (Row Level Security) activé sur toutes les tables
- [ ] Certificat SSL configuré
- [ ] Headers de sécurité (X-Frame-Options, CSP, etc.)
- [ ] Rate limiting configuré sur l'API

### Performance
- [ ] Build en mode production (`VITE_APP_ENV=production`)
- [ ] Gzip activé sur le serveur
- [ ] CDN configuré (Vercel/Cloudflare)
- [ ] Images optimisées

### Monitoring
- [ ] Logs centralisés
- [ ] Alertes configurées (erreurs, downtimes)
- [ ] Backups automatiques
- [ ] Health checks actifs

### DNS
- [ ] Domaines configurés
- [ ] Redirections www configurées
- [ ] CNAME/A records corrects

---

## 5. Résumé des coûts estimés

| Service | Plan Gratuit | Production |
|---------|--------------|------------|
| **Vercel** | 100 GB bandwidth | $20/mois (Pro) |
| **Supabase** | 500 MB DB, 1 GB storage | $25/mois (Pro) |
| **VPS (alternative)** | - | $10-50/mois |
| **Domaine** | - | $10-15/an |

**Total estimé production** : ~$50-75/mois

---

## Support

Pour toute question :
- Documentation Supabase : https://supabase.com/docs
- Documentation Vercel : https://vercel.com/docs
- Documentation Docker : https://docs.docker.com
