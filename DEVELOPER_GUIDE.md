# Developer Guide - Realty OS SaaS

## Guide rapide pour les développeurs

Ce guide vous aide à utiliser les nouveaux systèmes mis en place pour créer des fonctionnalités de niveau entreprise.

---

## 🌐 Utiliser l'i18n

### Dans un composant React

```typescript
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('wizard.project.title')}</h1>
      <p>{t('wizard.project.subtitle')}</p>
    </div>
  );
}
```

### Ajouter de nouvelles clés

Éditez `src/lib/i18n/locales/fr-CH.json` :

```json
{
  "myModule": {
    "title": "Mon Module",
    "actions": {
      "create": "Créer",
      "edit": "Modifier"
    }
  }
}
```

Puis utilisez :
```typescript
t('myModule.title')
t('myModule.actions.create')
```

---

## 🎨 États vides et erreurs

### EmptyState

```typescript
import { EmptyState } from '../components/ui/EmptyState';
import { FolderKanban } from 'lucide-react';

<EmptyState
  icon={FolderKanban}
  title="Aucun projet"
  description="Commencez par créer votre premier projet"
  action={{
    label: "Créer un projet",
    onClick: () => navigate('/projects/new')
  }}
/>
```

### ErrorState

```typescript
import { ErrorState } from '../components/ui/ErrorState';

<ErrorState
  title="Erreur de chargement"
  message={error?.message || "Une erreur est survenue"}
  retry={() => loadData()}
/>
```

### LoadingState

```typescript
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

if (loading) {
  return (
    <div className="flex h-96 items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
```

---

## 🔐 Permissions

### Vérifier une permission

```typescript
import { usePermissions } from '../hooks/usePermissions';

export function FinanceModule() {
  const { hasPermission } = usePermissions(organizationId);

  if (!hasPermission('FINANCE_VIEW')) {
    return <div>Accès refusé</div>;
  }

  return <div>Module finance...</div>;
}
```

### Protéger une section UI

```typescript
import { PermissionGate } from '../components/PermissionGate';

<PermissionGate permission="FINANCE_EDIT" organizationId={orgId}>
  <Button onClick={handleEdit}>Modifier</Button>
</PermissionGate>
```

### Masquer un élément

```typescript
import { PermissionToggle } from '../components/PermissionGate';

<PermissionToggle permission="SUPER_ADMIN">
  <Link to="/admin">Administration</Link>
</PermissionToggle>
```

### Vérifier plusieurs permissions

```typescript
const { hasAnyPermission, hasAllPermissions } = usePermissions(orgId);

// Au moins une
if (hasAnyPermission(['FINANCE_VIEW', 'FINANCE_EDIT'])) {
  // ...
}

// Toutes requises
if (hasAllPermissions(['FINANCE_VIEW', 'FINANCE_EDIT'])) {
  // ...
}
```

---

## 🎨 Branding organisation

### Charger le branding

```typescript
import { useBranding } from '../hooks/useBranding';

export function MyPage() {
  const { branding, loading } = useBranding(organizationId);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {branding.logoUrl && (
        <img src={branding.logoUrl} alt="Logo" />
      )}
    </div>
  );
}
```

### Utiliser les couleurs custom

Les CSS variables sont automatiquement appliquées :

```tsx
// Bouton avec couleur principale
<button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded">
  Action
</button>

// Badge avec accent
<span className="bg-[var(--color-accent)] text-white px-2 py-1 rounded">
  Nouveau
</span>
```

### Mettre à jour le branding

```typescript
const { updateBranding } = useBranding(orgId);

const handleUpdate = async () => {
  const success = await updateBranding({
    primaryColor: '#1D4ED8',
    logoUrl: 'https://...'
  });

  if (success) {
    // Branding mis à jour
  }
};
```

---

## 🔑 Feature Flags

### Vérifier une feature

```typescript
import { useFeatureFlags } from '../hooks/useFeatureFlags';

export function SubmissionsModule() {
  const { isFeatureEnabled } = useFeatureFlags(organizationId);

  if (!isFeatureEnabled('submissions')) {
    return <div>Module non disponible dans votre plan</div>;
  }

  return <div>Module soumissions...</div>;
}
```

### Protéger une section

```typescript
import { FeatureGate } from '../components/FeatureGate';

<FeatureGate feature="advanced_reporting" organizationId={orgId}>
  <AdvancedReports />
</FeatureGate>
```

### Masquer si désactivé

```typescript
import { FeatureToggle } from '../components/FeatureGate';

<FeatureToggle feature="sav_module" organizationId={orgId}>
  <Link to="/sav">SAV</Link>
</FeatureToggle>
```

### Vérifier les limites

```typescript
const { getLimit, hasReachedLimit } = useFeatureFlags(orgId);

const maxProjects = getLimit('max_projects'); // ex: 10

if (hasReachedLimit('max_projects', currentProjectsCount)) {
  // Afficher message upgrade
}
```

---

## 🔒 Edge Functions - Sécurité

### Vérifier l'authentification

```typescript
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return jsonResponse({ error: 'Non authentifié' }, 401);
}

const token = authHeader.replace('Bearer ', '');
const { data: { user }, error } = await supabase.auth.getUser(token);

if (error || !user) {
  return jsonResponse({ error: 'Non autorisé' }, 401);
}
```

### Vérifier SuperAdmin

```typescript
const { data: userData } = await supabase
  .from('users')
  .select('is_super_admin')
  .eq('id', user.id)
  .maybeSingle();

if (!userData || !userData.is_super_admin) {
  return jsonResponse({ error: 'Accès réservé aux administrateurs' }, 403);
}
```

### Vérifier appartenance organisation

```typescript
const { data: membership } = await supabase
  .from('user_organizations')
  .select('role')
  .eq('user_id', user.id)
  .eq('organization_id', organizationId)
  .maybeSingle();

if (!membership) {
  return jsonResponse({ error: 'Accès non autorisé' }, 403);
}
```

---

## 💳 Billing & Datatrans

### Initier un paiement

```typescript
// Frontend
const response = await fetch(`${apiUrl}/functions/v1/billing/change-plan`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    organizationId: orgId,
    planSlug: 'pro',
    billingCycle: 'MONTHLY'
  })
});

const { redirectUrl } = await response.json();

// Rediriger vers Datatrans
window.location.href = redirectUrl;
```

### Mapper la langue

```typescript
function mapToDatatransLang(locale: string | null): string {
  if (!locale) return 'fr';
  const l = locale.toLowerCase();
  if (l.startsWith('de')) return 'de';
  if (l.startsWith('it')) return 'it';
  if (l.startsWith('en')) return 'en';
  return 'fr';
}

const language = mapToDatatransLang(user.locale);
```

---

## 📝 Bonnes pratiques

### 1. Toujours utiliser i18n

❌ **Mauvais**
```typescript
<h1>Mon Titre</h1>
```

✅ **Bon**
```typescript
<h1>{t('myModule.title')}</h1>
```

### 2. Gérer tous les états

```typescript
// ✅ Bon pattern
if (loading) return <LoadingSpinner />;
if (error) return <ErrorState message={error} retry={load} />;
if (!data || data.length === 0) return <EmptyState ... />;
return <MyContent data={data} />;
```

### 3. Toujours vérifier les permissions

```typescript
// ✅ Bon pattern
<PermissionGate permission="FINANCE_EDIT">
  <EditButton />
</PermissionGate>
```

### 4. Dark mode systématique

```typescript
// ✅ Bon pattern - toujours ajouter classes dark:
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-50">
```

### 5. Feature flags avant modules premium

```typescript
// ✅ Bon pattern
<FeatureGate feature="advanced_module">
  <AdvancedModule />
</FeatureGate>
```

---

## 🧪 Testing

### Tester les permissions

```typescript
// Créer un user test avec role spécifique
const testUser = {
  id: 'test-id',
  user_organizations: [{
    organization_id: 'org-1',
    role: 'COURTIER'
  }]
};

// Vérifier permissions attendues
expect(hasPermission('LOTS_MANAGE')).toBe(true);
expect(hasPermission('FINANCE_EDIT')).toBe(false);
```

### Tester le branding

```typescript
// Mock branding
const mockBranding = {
  logoUrl: 'https://example.com/logo.png',
  primaryColor: '#FF0000',
  secondaryColor: '#00FF00',
  accentColor: '#0000FF'
};

// Vérifier CSS variables appliquées
expect(document.documentElement.style.getPropertyValue('--color-primary'))
  .toBe('#FF0000');
```

---

## 🚀 Déploiement

### Checklist avant prod

- [ ] Toutes les clés i18n sont présentes
- [ ] Tous les états (loading/error/empty) sont gérés
- [ ] Dark mode fonctionne partout
- [ ] Permissions vérifiées sur routes sensibles
- [ ] SuperAdmin requis sur endpoints admin
- [ ] Feature flags configurés par plan
- [ ] Branding par défaut défini
- [ ] Build passe sans warnings
- [ ] Edge functions déployées
- [ ] Variables env configurées

### Commandes utiles

```bash
# Build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Deploy edge functions (automatique)
# Les edge functions sont déployées via l'interface Supabase
```

---

## 📚 Ressources

### Documentation
- [i18next](https://react.i18next.com/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Lucide Icons](https://lucide.dev/)

### Fichiers clés
- `src/lib/i18n/locales/fr-CH.json` - Traductions
- `src/hooks/usePermissions.ts` - Permissions
- `src/hooks/useBranding.ts` - Branding
- `src/hooks/useFeatureFlags.ts` - Feature flags
- `src/components/PermissionGate.tsx` - Protection UI
- `src/components/FeatureGate.tsx` - Protection features

---

## 💡 Exemples rapides

### Créer une nouvelle page protégée

```typescript
import { usePermissions } from '../hooks/usePermissions';
import { PermissionGate } from '../components/PermissionGate';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function MySecurePage() {
  const { t } = useTranslation();
  const { hasPermission, loading } = usePermissions();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        {t('myModule.title')}
      </h1>

      <PermissionGate permission="MY_PERMISSION">
        {/* Contenu protégé */}
      </PermissionGate>
    </div>
  );
}
```

### Créer une edge function sécurisée

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Auth
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), {
      status: 401
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401
    });
  }

  // Votre logique ici

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

Bon développement ! 🚀
