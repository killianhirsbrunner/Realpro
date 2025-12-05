# 🎨 REALPRO LAYOUT PREMIUM - GUIDE COMPLET

## Architecture Layout Professionnel (Vite + React Router)

---

## 🎯 OBJECTIF

Créer un layout premium digne des meilleures SaaS B2B:
- Style **Linear.app** / **Notion** / **Stripe Dashboard**
- Sidebar moderne avec navigation contextuelle
- Topbar avec switcher projet, langue, notifications
- Animations fluides (Framer Motion)
- Mode clair/sombre
- Multi-langue (FR/DE/EN/IT)
- Responsive
- Performance optimale

---

## 📁 STRUCTURE DES FICHIERS

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx           ✅ Existe (à mettre à jour)
│   │   ├── Sidebar.tsx             ✅ Existe (à améliorer)
│   │   ├── Topbar.tsx              ✅ Existe (à améliorer)
│   │   ├── DynamicSidebar.tsx      ✅ Existe
│   │   ├── EnhancedTopbar.tsx      ✅ Existe
│   │   ├── ProjectSwitcher.tsx     🆕 À créer
│   │   ├── LanguageSwitcher.tsx    🆕 À créer
│   │   ├── UserMenu.tsx            🆕 À créer
│   │   ├── NotificationBell.tsx    ✅ Existe
│   │   └── PageShell.tsx           🆕 À créer
│   │
│   ├── branding/
│   │   ├── RealProLogo.tsx         ✅ Existe
│   │   └── RealProIcon.tsx         ✅ Existe
│   │
│   └── ui/
│       └── (composants shadcn-style existants)
│
├── contexts/
│   ├── ThemeContext.tsx            ✅ Existe
│   └── OrganizationContext.tsx     ✅ Existe
│
├── hooks/
│   └── useCurrentUser.ts           ✅ Existe
│
└── App.tsx                         ✅ Existe (Routes définies)
```

---

## 🏗️ ARCHITECTURE DES LAYOUTS

### 1. Layout Global (Public)

**Routes concernées:**
- `/` (Landing)
- `/auth/login`
- `/auth/register`
- `/pricing`
- `/features`

**Caractéristiques:**
- Pas de Sidebar
- Header simple avec logo + navigation
- Footer
- Pleine largeur

### 2. Layout Authentifié (Dashboard)

**Routes concernées:**
- `/dashboard` (Dashboard global)
- `/settings/*`
- `/admin/*`

**Caractéristiques:**
- Sidebar avec navigation globale
- Topbar avec switcher projet
- Zone contenu centrée (max-w-7xl)

### 3. Layout Projet

**Routes concernées:**
- `/projects/[projectId]/*`

**Caractéristiques:**
- Sidebar avec navigation projet
- Topbar avec breadcrumbs projet
- Contexte projet actif
- Permissions par rôle

---

## 🎨 DESIGN TOKENS

### Couleurs Premium (RealPro Turquoise)

```css
/* globals.css */

:root {
  /* Primary - Turquoise RealPro */
  --primary: 176 70% 45%;           /* #1FADA3 */
  --primary-foreground: 0 0% 100%;

  /* Background */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;

  /* Muted */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  /* Border */
  --border: 214 32% 91%;

  /* Accent */
  --accent: 176 70% 45%;
  --accent-foreground: 0 0% 100%;

  /* Destructive */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
}

.dark {
  /* Primary - Turquoise RealPro (plus lumineux en dark) */
  --primary: 176 70% 55%;           /* #2EC5BA */
  --primary-foreground: 222 47% 11%;

  /* Background */
  --background: 222 47% 11%;        /* #0F172A */
  --foreground: 210 40% 98%;

  /* Card */
  --card: 217 33% 17%;              /* #1E293B */
  --card-foreground: 210 40% 98%;

  /* Muted */
  --muted: 217 33% 23%;
  --muted-foreground: 215 20% 65%;

  /* Border */
  --border: 217 33% 23%;

  /* Accent */
  --accent: 176 70% 55%;
  --accent-foreground: 222 47% 11%;

  /* Destructive */
  --destructive: 0 63% 31%;
  --destructive-foreground: 210 40% 98%;
}
```

### Typographie Premium

```css
/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Headings */
h1 { @apply text-4xl font-bold tracking-tight; }
h2 { @apply text-3xl font-semibold tracking-tight; }
h3 { @apply text-2xl font-semibold; }
h4 { @apply text-xl font-semibold; }
h5 { @apply text-lg font-medium; }
h6 { @apply text-base font-medium; }
```

### Shadows Premium

```css
/* Custom shadows */
.shadow-sm-premium {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.03);
}

.shadow-md-premium {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05),
              0 2px 4px -2px rgb(0 0 0 / 0.03);
}

.shadow-lg-premium {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05),
              0 4px 6px -4px rgb(0 0 0 / 0.03);
}

.shadow-xl-premium {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.05),
              0 8px 10px -6px rgb(0 0 0 / 0.03);
}
```

---

## 🧩 COMPOSANTS PRINCIPAUX

### 1. AppShell (Layout principal)

**Responsabilités:**
- Wrapper principal de l'application
- Gestion du routing layout
- Context providers

```typescript
// src/components/layout/AppShell.tsx
interface AppShellProps {
  children: React.ReactNode;
  variant?: 'public' | 'authenticated' | 'project';
}

Variants:
- public: Pas de sidebar (landing, auth)
- authenticated: Sidebar globale (dashboard, settings)
- project: Sidebar projet (modules projet)
```

### 2. Sidebar Premium

**Features:**
- Logo adaptatif (light/dark)
- Navigation hiérarchique
- Active state avec highlight turquoise
- Collapse/Expand
- Badges notifications
- Scroll avec sticky header

**States:**
```typescript
type SidebarState = 'expanded' | 'collapsed';
type SidebarVariant = 'global' | 'project';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}
```

### 3. Topbar Premium

**Sections:**
```
┌────────────────────────────────────────────────────────┐
│ [Project Switcher] [Breadcrumbs]    [Lang] [🌓] [🔔] [👤] │
└────────────────────────────────────────────────────────┘
```

**Components:**
- ProjectSwitcher: Dropdown projets avec recherche
- Breadcrumbs: Navigation contextuelle
- LanguageSwitcher: FR/DE/EN/IT
- ThemeToggle: Light/Dark
- NotificationBell: Avec badge count
- UserMenu: Avatar + dropdown

### 4. PageShell (Wrapper contenu)

**Features:**
- Animations entrée (fade + slide up)
- Max-width centré
- Padding responsive
- Loading states

```typescript
interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  loading?: boolean;
}
```

---

## 🎬 ANIMATIONS

### Transitions de page (Framer Motion)

```typescript
// Variants pour PageShell
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] // easeInOutQuart
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

// Stagger pour listes
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2
    }
  }
};
```

### Hover effects

```css
/* Buttons */
.btn-premium {
  @apply transition-all duration-200 ease-out;
  @apply hover:scale-[1.02] active:scale-[0.98];
}

/* Cards */
.card-premium {
  @apply transition-all duration-300 ease-out;
  @apply hover:shadow-lg-premium hover:-translate-y-0.5;
}

/* Links */
.link-premium {
  @apply relative transition-colors duration-200;
  @apply after:absolute after:bottom-0 after:left-0 after:h-[2px]
         after:w-0 after:bg-primary after:transition-all after:duration-200
         hover:after:w-full;
}
```

---

## 🧭 NAVIGATION ADAPTATIVE

### Navigation Globale (Dashboard)

```typescript
const globalNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Projets',
    href: '/projects',
    icon: Building2,
    badge: 5, // Nombre de projets
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: FolderOpen,
  },
  {
    label: 'Reporting',
    href: '/reporting',
    icon: BarChart3,
  },
  {
    label: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
];
```

### Navigation Projet

```typescript
const projectNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: `/projects/${projectId}/dashboard`,
    icon: LayoutDashboard,
  },
  {
    label: 'Lots',
    href: `/projects/${projectId}/lots`,
    icon: Home,
    badge: 32, // Total lots
  },
  {
    label: 'CRM',
    href: `/projects/${projectId}/crm`,
    icon: Users,
    children: [
      { label: 'Pipeline', href: `/projects/${projectId}/crm/pipeline`, icon: Kanban },
      { label: 'Prospects', href: `/projects/${projectId}/crm/prospects`, icon: UserPlus },
      { label: 'Acheteurs', href: `/projects/${projectId}/crm/buyers`, icon: UserCheck },
    ],
  },
  {
    label: 'Notaire',
    href: `/projects/${projectId}/notary`,
    icon: Scale,
  },
  {
    label: 'Courtiers',
    href: `/projects/${projectId}/brokers`,
    icon: Briefcase,
  },
  {
    label: 'Documents',
    href: `/projects/${projectId}/documents`,
    icon: FolderOpen,
  },
  {
    label: 'Finances',
    href: `/projects/${projectId}/finances`,
    icon: DollarSign,
    children: [
      { label: 'CFC', href: `/projects/${projectId}/finances/cfc`, icon: Table },
      { label: 'Factures', href: `/projects/${projectId}/finances/invoices`, icon: FileText },
      { label: 'Paiements', href: `/projects/${projectId}/finances/payments`, icon: CreditCard },
    ],
  },
  {
    label: 'Soumissions',
    href: `/projects/${projectId}/tenders`,
    icon: FileCheck,
    badge: 3, // Actives
  },
  {
    label: 'Modifications',
    href: `/projects/${projectId}/modifications`,
    icon: Sparkles,
    badge: 8, // En attente
  },
  {
    label: 'Chantier',
    href: `/projects/${projectId}/construction`,
    icon: HardHat,
    children: [
      { label: 'Planning', href: `/projects/${projectId}/construction/planning`, icon: Calendar },
      { label: 'Photos', href: `/projects/${projectId}/construction/photos`, icon: Camera },
      { label: 'Journal', href: `/projects/${projectId}/construction/diary`, icon: BookOpen },
    ],
  },
  {
    label: 'Communication',
    href: `/projects/${projectId}/communication`,
    icon: MessageSquare,
    badge: 5, // Non lus
  },
  {
    label: 'Reporting',
    href: `/projects/${projectId}/reporting`,
    icon: BarChart3,
  },
];
```

### Permissions par rôle

```typescript
// Navigation filtrée selon le rôle
function getFilteredNavItems(items: NavItem[], userRole: UserRole): NavItem[] {
  const permissions = ROLE_PERMISSIONS[userRole];

  return items.filter(item => {
    const module = getModuleFromHref(item.href);
    return permissions.modules.includes(module);
  });
}

// Exemple: Architecte ne voit pas CRM, Finances, Courtiers
const architecteItems = getFilteredNavItems(projectNavItems, 'architect');
// → Dashboard, Lots (read), Documents, Soumissions, Modifications, Chantier, Communication
```

---

## 📱 RESPONSIVE

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile large
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop large
  '2xl': '1536px', // Desktop XL
};
```

### Sidebar Mobile

```
Mobile (< md):
  - Sidebar cachée par défaut
  - Burger menu en topbar
  - Overlay quand ouvert
  - Swipe to close

Desktop (>= md):
  - Sidebar visible
  - Collapsible (icônes only)
  - Sticky position
```

### Topbar Mobile

```
Mobile:
  - Project switcher → Dropdown full-width
  - Actions groupées dans menu hamburger
  - Logo centré

Desktop:
  - Layout horizontal complet
  - Tous les éléments visibles
```

---

## 🌐 INTERNATIONALISATION (i18n)

### Structure

```typescript
// src/lib/i18n/locales/fr.json
{
  "nav": {
    "dashboard": "Tableau de bord",
    "projects": "Projets",
    "lots": "Lots",
    "crm": "CRM",
    "documents": "Documents",
    "finances": "Finances",
    "settings": "Paramètres"
  },
  "common": {
    "search": "Rechercher",
    "filter": "Filtrer",
    "export": "Exporter",
    "new": "Nouveau"
  }
}
```

### Usage dans composants

```typescript
import { useTranslation } from 'react-i18next';

function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav>
      <Link to="/dashboard">
        {t('nav.dashboard')}
      </Link>
    </nav>
  );
}
```

### Switcher de langue

```typescript
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Globe className="h-4 w-4" />
        {i18n.language.toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🎨 EXEMPLES D'INTÉGRATION

### Exemple 1: Page Dashboard Global

```tsx
// src/pages/Dashboard.tsx
import PageShell from '@/components/layout/PageShell';
import { useGlobalDashboard } from '@/hooks/useGlobalDashboard';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { projects, kpis, loading } = useGlobalDashboard();

  return (
    <PageShell
      title="Dashboard Global"
      subtitle="Vue d'ensemble de vos projets"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Projet
        </Button>
      }
      loading={loading}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Projets actifs"
          value={kpis.activeProjects}
          trend="+12%"
          icon={Building2}
        />
        {/* ... */}
      </div>

      {/* Projects List */}
      <ProjectsList projects={projects} />
    </PageShell>
  );
}
```

### Exemple 2: Page Lots (Projet)

```tsx
// src/pages/ProjectLots.tsx
import PageShell from '@/components/layout/PageShell';
import { useLots } from '@/hooks/useLots';
import { useParams } from 'react-router-dom';
import LotsTable from '@/components/lots/LotsTable';
import LotsFilters from '@/components/lots/LotsFilters';

export default function ProjectLots() {
  const { projectId } = useParams();
  const { lots, loading } = useLots(projectId);

  return (
    <PageShell
      title="Lots"
      subtitle="Gestion de l'inventaire des lots"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">Import Excel</Button>
          <Button>Nouveau Lot</Button>
        </div>
      }
    >
      <LotsFilters />
      <LotsTable lots={lots} loading={loading} />
    </PageShell>
  );
}
```

### Exemple 3: Modal Premium

```tsx
// Exemple modal avec animation
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { motion } from 'framer-motion';

function CreateLotModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>Créer un nouveau lot</DialogTitle>
          </DialogHeader>

          {/* Form content */}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🚀 PERFORMANCE

### Code Splitting

```typescript
// Lazy loading des pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProjectLots = lazy(() => import('@/pages/ProjectLots'));
const ProjectCRM = lazy(() => import('@/pages/ProjectCRM'));

// Avec Suspense
<Suspense fallback={<PageLoading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects/:projectId/lots" element={<ProjectLots />} />
  </Routes>
</Suspense>
```

### Optimisations Images

```typescript
// Logo optimisé
import LogoDark from '@/assets/logos/realpro_bleu.svg?react';
import LogoLight from '@/assets/logos/realpro-light.png';

// Lazy load avec placeholder
<img
  src={LogoLight}
  alt="RealPro"
  loading="lazy"
  className="w-32 h-auto"
/>
```

### Memoization

```typescript
// Navigation items memoized
const navItems = useMemo(() =>
  getFilteredNavItems(projectNavItems, userRole),
  [userRole, projectId]
);

// Expensive components
const ProjectsList = memo(ProjectsListComponent);
```

---

## 📋 CHECKLIST INTÉGRATION

### Phase 1: Setup
- [ ] Installer Framer Motion: `npm install framer-motion`
- [ ] Vérifier TailwindCSS config
- [ ] Ajouter design tokens dans globals.css
- [ ] Configurer ThemeProvider
- [ ] Configurer i18n

### Phase 2: Composants Layout
- [ ] Mettre à jour AppShell.tsx
- [ ] Créer PageShell.tsx
- [ ] Améliorer Sidebar.tsx (premium)
- [ ] Améliorer Topbar.tsx (premium)
- [ ] Créer ProjectSwitcher.tsx
- [ ] Créer LanguageSwitcher.tsx
- [ ] Créer UserMenu.tsx

### Phase 3: Navigation
- [ ] Définir navItems global
- [ ] Définir navItems projet
- [ ] Implémenter filtrage par rôle
- [ ] Ajouter badges notifications
- [ ] Implémenter active states

### Phase 4: Animations
- [ ] Page transitions (Framer Motion)
- [ ] Hover effects
- [ ] Loading states
- [ ] Skeleton loaders

### Phase 5: Responsive
- [ ] Mobile sidebar (burger menu)
- [ ] Tablet optimizations
- [ ] Desktop layout final

### Phase 6: i18n
- [ ] Traduire navigation
- [ ] Traduire UI components
- [ ] Switcher de langue
- [ ] Persistence langue

### Phase 7: Testing
- [ ] Tests composants
- [ ] Tests navigation
- [ ] Tests responsive
- [ ] Tests performance

---

## 🎯 RÉSULTAT FINAL

Avec ce layout, vous obtenez:

✅ **UX Premium** type Linear/Notion
✅ **Navigation intelligente** adaptée au contexte
✅ **Animations fluides** et performantes
✅ **Multi-langue** (FR/DE/EN/IT)
✅ **Mode clair/sombre** parfait
✅ **Responsive** mobile-first
✅ **Accessible** (WCAG 2.1 AA)
✅ **Performance optimale** (Lighthouse > 90)
✅ **Scalable** (facile à étendre)
✅ **Maintainable** (code propre et documenté)

---

**Le layout professionnel dont RealPro SA a besoin! 🚀**
