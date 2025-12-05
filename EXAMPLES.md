# 💡 Exemples de code

Ce document contient des exemples concrets d'utilisation de l'architecture PropTech SaaS.

---

## 📋 Table des matières

1. [Hooks React](#hooks-react)
2. [Composants UI](#composants-ui)
3. [Requêtes Supabase](#requêtes-supabase)
4. [i18n](#i18n)
5. [RBAC & Permissions](#rbac--permissions)
6. [Formulaires](#formulaires)

---

## 🎣 Hooks React

### useCurrentUser

Récupérer l'utilisateur connecté :

```typescript
import { useCurrentUser } from '@/hooks/useCurrentUser';

function ProfilePage() {
  const { user, loading, error } = useCurrentUser();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{user?.first_name} {user?.last_name}</h1>
      <p>{user?.email}</p>
      <p>Langue préférée : {user?.language}</p>
    </div>
  );
}
```

### useProjects

Liste des projets :

```typescript
import { useProjects } from '@/hooks/useProjects';

function ProjectsList() {
  const { projects, loading, error, refetch } = useProjects();

  return (
    <div>
      <button onClick={refetch}>Rafraîchir</button>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

Détail d'un projet :

```typescript
import { useProject } from '@/hooks/useProjects';

function ProjectDetail({ projectId }: { projectId: string }) {
  const { project, loading, error } = useProject(projectId);

  if (!project) return null;

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <Badge>{project.status}</Badge>
    </div>
  );
}
```

### useLots

Lots d'un projet avec statistiques :

```typescript
import { useLots } from '@/hooks/useLots';

function LotsOverview({ projectId }: { projectId: string }) {
  const { lots, statusCounts, loading } = useLots(projectId);

  return (
    <div>
      <StatsCards>
        <Stat label="Total" value={statusCounts.total} />
        <Stat label="Disponibles" value={statusCounts.available} />
        <Stat label="Réservés" value={statusCounts.reserved} />
        <Stat label="Vendus" value={statusCounts.sold} />
      </StatsCards>

      <LotsTable lots={lots} />
    </div>
  );
}
```

### useBilling

Plans d'abonnement :

```typescript
import { usePlans } from '@/hooks/useBilling';

function PricingPage() {
  const { plans, loading } = usePlans();

  return (
    <div className="grid grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
```

Abonnement actuel :

```typescript
import { useSubscription } from '@/hooks/useBilling';

function BillingStatus({ organizationId }: { organizationId: string }) {
  const { subscription, loading } = useSubscription(organizationId);

  return (
    <Card>
      <Badge variant={getStatusVariant(subscription?.status)}>
        {subscription?.status}
      </Badge>
      <p>Cycle : {subscription?.billing_cycle}</p>
      <p>Fin de période : {subscription?.current_period_end}</p>
    </Card>
  );
}
```

---

## 🎨 Composants UI

### Button

```typescript
import { Button } from '@/components/ui/Button';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Loading...</Button>

// Disabled
<Button disabled>Disabled</Button>

// Icon + text
<Button>
  <PlusIcon className="w-4 h-4 mr-2" />
  Créer un projet
</Button>
```

### Card

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

// Card basique
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>

// Card avec hover effect
<Card hover>
  <CardContent>Hover me!</CardContent>
</Card>

// Card avec padding personnalisé
<Card padding="none">
  <img src="..." />
  <div className="p-4">
    Content
  </div>
</Card>
```

### Badge

```typescript
import { Badge } from '@/components/ui/Badge';

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>

// Dans un composant de statut
function StatusBadge({ status }: { status: LotStatus }) {
  const variants = {
    AVAILABLE: 'success',
    RESERVED: 'warning',
    SOLD: 'info',
  } as const;

  return <Badge variant={variants[status]}>{status}</Badge>;
}
```

### Input

```typescript
import { Input } from '@/components/ui/Input';

// Input simple
<Input placeholder="Enter text..." />

// Avec label
<Input label="Email" type="email" />

// Avec erreur
<Input
  label="Password"
  type="password"
  error="Password too short"
/>

// Avec helper text
<Input
  label="Username"
  helperText="Must be unique"
/>

// Contrôlé
function MyForm() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="Name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

---

## 🗄️ Requêtes Supabase

### SELECT simple

```typescript
import { supabase } from '@/lib/supabase';

// Tous les projets
const { data, error } = await supabase
  .from('projects')
  .select('*');

// Avec filtres
const { data, error } = await supabase
  .from('lots')
  .select('*')
  .eq('project_id', projectId)
  .eq('status', 'AVAILABLE')
  .order('price_total', { ascending: true });

// Avec limit et offset (pagination)
const { data, error } = await supabase
  .from('prospects')
  .select('*')
  .range(0, 49); // 50 premiers résultats
```

### SELECT avec relations

```typescript
// Lots avec informations du projet
const { data, error } = await supabase
  .from('lots')
  .select(`
    *,
    project:projects(name, city),
    building:buildings(name, code)
  `)
  .eq('id', lotId)
  .maybeSingle();

// Projets avec nombre de lots
const { data, error } = await supabase
  .from('projects')
  .select(`
    *,
    lots(count)
  `);
```

### INSERT

```typescript
// Créer un projet
const { data, error } = await supabase
  .from('projects')
  .insert({
    organization_id: orgId,
    name: 'Nouveau projet',
    code: 'NP-2024',
    status: 'PLANNING',
    city: 'Lausanne',
    postal_code: '1000',
  })
  .select()
  .single();

// Créer plusieurs lots
const { data, error } = await supabase
  .from('lots')
  .insert([
    { project_id: projectId, code: 'A-101', type: 'APARTMENT' },
    { project_id: projectId, code: 'A-102', type: 'APARTMENT' },
    { project_id: projectId, code: 'A-P01', type: 'PARKING' },
  ])
  .select();
```

### UPDATE

```typescript
// Mettre à jour un lot
const { data, error } = await supabase
  .from('lots')
  .update({ status: 'RESERVED', price_total: 850000 })
  .eq('id', lotId)
  .select()
  .single();

// Mettre à jour plusieurs enregistrements
const { data, error } = await supabase
  .from('prospects')
  .update({ assigned_to: userId })
  .eq('status', 'NEW')
  .is('assigned_to', null);
```

### DELETE

```typescript
// Supprimer un prospect
const { error } = await supabase
  .from('prospects')
  .delete()
  .eq('id', prospectId);

// Supprimer avec condition
const { error } = await supabase
  .from('reservations')
  .delete()
  .eq('status', 'EXPIRED')
  .lt('expires_at', new Date().toISOString());
```

### Realtime subscriptions

```typescript
// S'abonner aux changements sur une table
const channel = supabase
  .channel('lots-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'lots',
      filter: `project_id=eq.${projectId}`,
    },
    (payload) => {
      console.log('Lot changed:', payload);
      // Refresh data
    }
  )
  .subscribe();

// Se désabonner
return () => {
  supabase.removeChannel(channel);
};
```

---

## 🌍 i18n

### Hook useI18n

```typescript
import { useI18n } from '@/lib/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useI18n();

  return (
    <div>
      <h1>{t('projects.title')}</h1>
      <p>{t('projects.description')}</p>

      {/* Sélecteur de langue */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
      >
        <option value="FR">Français</option>
        <option value="DE">Deutsch</option>
        <option value="EN">English</option>
        <option value="IT">Italiano</option>
      </select>
    </div>
  );
}
```

### Traductions dynamiques

```typescript
function StatusBadge({ status }: { status: LotStatus }) {
  const { t } = useI18n();

  // Traduction dynamique basée sur le statut
  const label = t(`lots.statuses.${status}`);

  return <Badge>{label}</Badge>;
}
```

### Traductions avec variables

```typescript
// Dans le fichier de traduction
{
  "welcome": "Bienvenue {{name}} !",
  "lotsCount": "{{count}} lots disponibles"
}

// Utilisation (nécessite une fonction t étendue - à implémenter)
t('welcome', { name: user.first_name })
t('lotsCount', { count: lots.length })
```

### LanguageSwitcher component

```typescript
function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const languages = [
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'IT', label: 'Italiano', flag: '🇮🇹' },
  ];

  return (
    <div className="flex space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={clsx(
            'px-3 py-2 rounded-lg transition-colors',
            {
              'bg-brand-100 text-brand-700': language === lang.code,
              'hover:bg-gray-100': language !== lang.code,
            }
          )}
        >
          <span className="mr-2">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
```

---

## 🔐 RBAC & Permissions

### Vérifier les permissions (côté frontend)

```typescript
import { supabase } from '@/lib/supabase';

async function checkPermission(
  userId: string,
  organizationId: string,
  permissionName: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role:roles(
        role_permissions(
          permission:permissions(name)
        )
      )
    `)
    .eq('user_id', userId)
    .eq('organization_id', organizationId);

  if (error || !data) return false;

  // Vérifier si la permission existe dans les rôles
  return data.some((ur) =>
    ur.role.role_permissions.some(
      (rp) => rp.permission.name === permissionName
    )
  );
}

// Utilisation
const canCreateProject = await checkPermission(
  user.id,
  orgId,
  'projects.create'
);

if (canCreateProject) {
  // Afficher le bouton "Créer un projet"
}
```

### Hook usePermissions

```typescript
// À implémenter
function usePermissions(organizationId: string) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const { user } = useCurrentUser();

  useEffect(() => {
    // Fetch user permissions
    async function fetchPermissions() {
      // ... requête Supabase
      setPermissions(data);
    }

    fetchPermissions();
  }, [user, organizationId]);

  const hasPermission = (permissionName: string) => {
    return permissions.includes(permissionName);
  };

  return { permissions, hasPermission };
}

// Utilisation
function ProjectActions() {
  const { hasPermission } = usePermissions(orgId);

  return (
    <div>
      {hasPermission('projects.create') && (
        <Button>Créer un projet</Button>
      )}
      {hasPermission('projects.delete') && (
        <Button variant="danger">Supprimer</Button>
      )}
    </div>
  );
}
```

### Composant ProtectedAction

```typescript
function ProtectedAction({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}

// Utilisation
<ProtectedAction permission="lots.update">
  <Button>Modifier le lot</Button>
</ProtectedAction>
```

---

## 📝 Formulaires

### Formulaire simple

```typescript
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

function CreateProjectForm({ organizationId }: { organizationId: string }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('projects')
        .insert({
          organization_id: organizationId,
          ...formData,
          status: 'PLANNING',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Succès
      console.log('Projet créé:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom du projet"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Code"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        required
      />

      <Input
        label="Ville"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      />

      <Input
        label="Code postal"
        value={formData.postal_code}
        onChange={(e) =>
          setFormData({ ...formData, postal_code: e.target.value })
        }
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" isLoading={loading}>
        Créer le projet
      </Button>
    </form>
  );
}
```

### Formulaire avec validation

```typescript
interface FormErrors {
  [key: string]: string;
}

function validateProjectForm(data: ProjectFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Le nom est requis';
  }

  if (!data.code.trim()) {
    errors.code = 'Le code est requis';
  } else if (!/^[A-Z0-9-]+$/.test(data.code)) {
    errors.code = 'Le code doit contenir uniquement lettres, chiffres et tirets';
  }

  if (data.postal_code && !/^\d{4}$/.test(data.postal_code)) {
    errors.postal_code = 'Le code postal doit contenir 4 chiffres';
  }

  return errors;
}

function CreateProjectFormWithValidation() {
  const [formData, setFormData] = useState<ProjectFormData>({ ... });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const validationErrors = validateProjectForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit...
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nom"
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
          setErrors({ ...errors, name: '' });
        }}
        error={errors.name}
      />
      {/* ... */}
    </form>
  );
}
```

---

## 🎯 Patterns avancés

### Optimistic UI

```typescript
function ToggleLotStatus({ lot }: { lot: Lot }) {
  const [optimisticStatus, setOptimisticStatus] = useState(lot.status);

  const handleToggle = async () => {
    // Optimistic update
    const newStatus = optimisticStatus === 'AVAILABLE' ? 'RESERVED' : 'AVAILABLE';
    setOptimisticStatus(newStatus);

    try {
      const { error } = await supabase
        .from('lots')
        .update({ status: newStatus })
        .eq('id', lot.id);

      if (error) throw error;
    } catch (err) {
      // Rollback en cas d'erreur
      setOptimisticStatus(lot.status);
      console.error(err);
    }
  };

  return (
    <Button onClick={handleToggle}>
      {optimisticStatus}
    </Button>
  );
}
```

### Infinite scroll

```typescript
function InfiniteLotsList({ projectId }: { projectId: string }) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;

  const loadMore = async () => {
    const { data, error } = await supabase
      .from('lots')
      .select('*')
      .eq('project_id', projectId)
      .range(offset, offset + LIMIT - 1);

    if (data) {
      setLots([...lots, ...data]);
      setOffset(offset + LIMIT);
      setHasMore(data.length === LIMIT);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div>
      {lots.map((lot) => (
        <LotCard key={lot.id} lot={lot} />
      ))}

      {hasMore && (
        <Button onClick={loadMore}>Charger plus</Button>
      )}
    </div>
  );
}
```

---

**Ces exemples couvrent 80% des cas d'usage courants. Pour des patterns plus avancés, consultez ARCHITECTURE.md.**
