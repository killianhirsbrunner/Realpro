# 📚 Guide Complet: 3 Modules Avancés
## Cockpit Promoteur • Chat Multilingue • Mode Chantier Mobile/PWA

> Status: Base de données ✅ | Backend Edge Functions 🚧 | Frontend 🚧 | PWA 🚧

---

## 🎯 Vue d'Ensemble

Ce guide documente **3 modules majeurs** prêts à être implémentés dans votre architecture Supabase + React/Vite:

### 1️⃣ **Cockpit Promoteur** - Dashboard & Analytics Multi-Projets
Vue 360° consolidée pour les promoteurs sur tous leurs projets actifs

### 2️⃣ **Chat Multilingue** - Communication Contextuelle avec Auto-Traduction
Threads de conversation avec traduction automatique (fr-CH ↔ de-CH ↔ it-CH ↔ en-GB)

### 3️⃣ **Mode Chantier Mobile + PWA** - Application Offline pour Chefs de Chantier
Interface mobile optimisée avec queue offline pour SAV, journal et photos

---

## ✅ Database Schema (Complété)

### Tables Créées/Modifiées

**`message_threads`** (existant, colonnes ajoutées)
```sql
-- Ajouts pour support contextuel étendu
organization_id uuid REFERENCES organizations(id)
lot_id uuid REFERENCES lots(id)
buyer_id uuid REFERENCES buyers(id)
submission_id uuid REFERENCES submissions(id)
sav_ticket_id uuid REFERENCES sav_tickets(id)
```

**`messages`** (existant, colonne ajoutée)
```sql
-- Support multilingue
body_lang text DEFAULT 'fr-CH'  -- fr-CH, de-CH, it-CH, en-GB
```

**`offline_actions`** (nouveau)
```sql
CREATE TABLE offline_actions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  device_id text NOT NULL,
  action_type text NOT NULL,  -- CREATE_SAV, CREATE_DIARY_ENTRY, UPLOAD_PHOTO
  action_url text NOT NULL,
  action_method text DEFAULT 'POST',
  action_body jsonb DEFAULT '{}',
  status offline_action_status DEFAULT 'PENDING',  -- PENDING/PROCESSING/SUCCESS/FAILED
  error_message text,
  attempts integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);
```

### Helper Functions SQL

**`get_thread_stats(uuid)`** - Statistiques thread (messages count, unread, etc.)
**`cleanup_old_offline_actions(days)`** - Cleanup automatique actions offline

---

## 1️⃣ Cockpit Promoteur - Dashboard Multi-Projets

### 🎯 Objectif
Donner au promoteur une vue consolidée de tous ses projets avec KPIs clés:
- Ventes et préventes
- Budgets CFC (engagé, facturé, payé)
- Acomptes acheteurs
- Tickets SAV ouverts
- Soumissions en cours

### 📊 Architecture

#### Edge Function: `/functions/promoter-dashboard/index.ts`

```typescript
import { serve } from 'jsr:@supabase/functions-js/edge-runtime';
import { createClient } from 'jsr:@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user and organization
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's organization
    const { data: userOrg } = await supabaseClient
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!userOrg) {
      return new Response(JSON.stringify({ error: 'No organization found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const organizationId = userOrg.organization_id;

    // Get all projects for organization
    const { data: projects } = await supabaseClient
      .from('projects')
      .select('id, name, status, type, city, canton')
      .eq('organization_id', organizationId);

    if (!projects) {
      return new Response(JSON.stringify({ projects: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For each project, gather stats
    const projectStats = await Promise.all(
      projects.map(async (project) => {
        // Lots stats
        const { data: lots } = await supabaseClient
          .from('lots')
          .select('id, status, price_total')
          .eq('project_id', project.id);

        const lotsTotal = lots?.length ?? 0;
        const lotsSold = lots?.filter((l) => l.status === 'SOLD').length ?? 0;
        const lotsReserved = lots?.filter((l) => l.status === 'RESERVED').length ?? 0;
        const lotsFree = lotsTotal - lotsSold - lotsReserved;
        const salesRate = lotsTotal > 0 ? Math.round((lotsSold / lotsTotal) * 100) : 0;
        const potentialRevenue = lots?.reduce((sum, l) => sum + (l.price_total ?? 0), 0) ?? 0;

        // Invoices stats
        const { data: invoices } = await supabaseClient
          .from('buyer_invoices')
          .select('amount_total_cents, amount_paid_cents, status')
          .eq('project_id', project.id);

        const invoicesTotal = invoices?.reduce((s, i) => s + (i.amount_total_cents ?? 0), 0) ?? 0;
        const invoicesPaid = invoices?.reduce((s, i) => s + (i.amount_paid_cents ?? 0), 0) ?? 0;
        const invoicesLate = invoices?.filter((i) => i.status === 'LATE').length ?? 0;

        // CFC stats
        const { data: cfcLines } = await supabaseClient
          .from('cfc_lines')
          .select('amount_budgeted, amount_committed, amount_spent')
          .eq('budget_id', project.id);

        const cfcBudget = cfcLines?.reduce((s, c) => s + (c.amount_budgeted ?? 0), 0) ?? 0;
        const cfcEngaged = cfcLines?.reduce((s, c) => s + (c.amount_committed ?? 0), 0) ?? 0;
        const cfcPaid = cfcLines?.reduce((s, c) => s + (c.amount_spent ?? 0), 0) ?? 0;

        // SAV stats
        const { data: savTickets } = await supabaseClient
          .from('sav_tickets')
          .select('id, status')
          .eq('project_id', project.id);

        const savOpen = savTickets?.filter(
          (t) => t.status !== 'CLOSED' && t.status !== 'VALIDATED'
        ).length ?? 0;

        return {
          ...project,
          sales: {
            total: lotsTotal,
            sold: lotsSold,
            reserved: lotsReserved,
            free: lotsFree,
            salesRate,
            potentialRevenue,
          },
          invoices: {
            total: invoicesTotal / 100,
            paid: invoicesPaid / 100,
            unpaid: (invoicesTotal - invoicesPaid) / 100,
            lateCount: invoicesLate,
          },
          cfc: {
            budget: cfcBudget,
            engaged: cfcEngaged,
            paid: cfcPaid,
          },
          sav: {
            openTickets: savOpen,
          },
        };
      })
    );

    // Aggregate global stats
    const globalStats = {
      projectsCount: projects.length,
      totalPotentialRevenue: projectStats.reduce((s, p) => s + p.sales.potentialRevenue, 0),
      totalInvoices: projectStats.reduce((s, p) => s + p.invoices.total, 0),
      totalSavOpen: projectStats.reduce((s, p) => s + p.sav.openTickets, 0),
    };

    return new Response(
      JSON.stringify({
        ...globalStats,
        projects: projectStats,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

#### React Hook: `/src/hooks/usePromoterDashboard.ts`

```typescript
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type ProjectSummary = {
  id: string;
  name: string;
  status: string;
  type: string;
  city?: string;
  canton?: string;
  sales: {
    total: number;
    sold: number;
    reserved: number;
    free: number;
    salesRate: number;
    potentialRevenue: number;
  };
  invoices: {
    total: number;
    paid: number;
    unpaid: number;
    lateCount: number;
  };
  cfc: {
    budget: number;
    engaged: number;
    paid: number;
  };
  sav: {
    openTickets: number;
  };
};

export type DashboardData = {
  projectsCount: number;
  totalPotentialRevenue: number;
  totalInvoices: number;
  totalSavOpen: number;
  projects: ProjectSummary[];
};

export function usePromoterDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboard = useCallback(async (): Promise<DashboardData | null> => {
    setLoading(true);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/promoter-dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getDashboard };
}
```

#### React Page: `/src/pages/PromoterDashboard.tsx`

```typescript
import { useEffect, useState } from 'react';
import { usePromoterDashboard, DashboardData, ProjectSummary } from '@/hooks/usePromoterDashboard';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Building2, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

export default function PromoterDashboard() {
  const { loading, error, getDashboard } = usePromoterDashboard();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const result = await getDashboard();
    if (result) setData(result);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header */}
      <header>
        <p className="text-xs uppercase tracking-wide text-gray-400">Promoteur</p>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
          Cockpit global
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Vue consolidée de vos projets, ventes, budgets et SAV
        </p>
      </header>

      {/* Global KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Building2 className="w-5 h-5" />}
          label="Projets actifs"
          value={data.projectsCount}
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Revenus potentiels"
          value={formatCurrency(data.totalPotentialRevenue)}
        />
        <KpiCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Factures totales"
          value={formatCurrency(data.totalInvoices)}
        />
        <KpiCard
          icon={<AlertCircle className="w-5 h-5" />}
          label="Tickets SAV ouverts"
          value={data.totalSavOpen}
        />
      </section>

      {/* Projects List */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Vos projets
        </h2>
        <div className="space-y-3">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/20">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <a
      href={`/projects/${project.id}/cockpit`}
      className="block rounded-2xl border bg-white p-4 hover:shadow-md transition dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {project.city} • {project.status}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Ventes</p>
            <p className="font-semibold text-gray-900 dark:text-gray-50">
              {project.sales.sold}/{project.sales.total}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Budget CFC</p>
            <p className="font-semibold text-gray-900 dark:text-gray-50">
              {formatCurrency(project.cfc.budget)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">SAV ouverts</p>
            <p className="font-semibold text-gray-900 dark:text-gray-50">
              {project.sav.openTickets}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
```

---

## 2️⃣ Chat Multilingue - Communication avec Traduction

### 🎯 Objectif
Permettre la communication entre acteurs parlant différentes langues (FR/DE/IT/EN) avec:
- Messages stockés dans leur langue originale
- Bouton "Traduire" pour voir dans sa propre langue
- Threads contextuels (projet, lot, SAV, etc.)

### 📊 Architecture

#### Edge Function: `/functions/messages/index.ts`

```typescript
import { serve } from 'jsr:@supabase/functions-js/edge-runtime';
import { createClient } from 'jsr:@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);

    // GET /messages/threads/:threadId - Get thread with messages
    if (req.method === 'GET' && pathSegments[1] === 'threads' && pathSegments[2]) {
      const threadId = pathSegments[2];

      const { data: thread, error } = await supabaseClient
        .from('message_threads')
        .select(`
          *,
          messages (
            *,
            author:users!inner(id, first_name, last_name, avatar_url)
          )
        `)
        .eq('id', threadId)
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(thread), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /messages/threads - Create new thread
    if (req.method === 'POST' && pathSegments[1] === 'threads' && !pathSegments[2]) {
      const body = await req.json();
      const { title, context_type, project_id, lot_id, buyer_id, submission_id, sav_ticket_id } = body;

      // Get user's organization
      const { data: userOrg } = await supabaseClient
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      const { data: thread, error } = await supabaseClient
        .from('message_threads')
        .insert({
          organization_id: userOrg?.organization_id,
          title,
          context_type,
          project_id,
          lot_id,
          buyer_id,
          submission_id,
          sav_ticket_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(thread), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /messages/threads/:threadId - Post message
    if (req.method === 'POST' && pathSegments[1] === 'threads' && pathSegments[2]) {
      const threadId = pathSegments[2];
      const body = await req.json();
      const { content, lang } = body;

      // Get user's preferred language
      const { data: userData } = await supabaseClient
        .from('users')
        .select('locale')
        .eq('id', user.id)
        .single();

      const bodyLang = lang || userData?.locale || 'fr-CH';

      const { data: message, error } = await supabaseClient
        .from('messages')
        .insert({
          thread_id: threadId,
          author_id: user.id,
          content,
          body_lang: bodyLang,
        })
        .select(`
          *,
          author:users!inner(id, first_name, last_name, avatar_url)
        `)
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(message), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /messages/translate - Translate text (stub)
    if (req.method === 'POST' && pathSegments[1] === 'translate') {
      const body = await req.json();
      const { text, fromLang, toLang } = body;

      // TODO: Integrate real translation API (DeepL, Google Translate, etc.)
      // For now, return stub
      const translated = `[${fromLang}→${toLang}] ${text}`;

      return new Response(JSON.stringify({ translated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

#### React Hook: `/src/hooks/useChat.ts`

```typescript
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type Message = {
  id: string;
  thread_id: string;
  author_id: string;
  content: string;
  body_lang: string;
  created_at: string;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
};

export type Thread = {
  id: string;
  title?: string;
  context_type?: string;
  messages: Message[];
};

export function useChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const getThread = useCallback(async (threadId: string): Promise<Thread | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/messages/threads/${threadId}`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch thread');

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const postMessage = useCallback(
    async (threadId: string, content: string, lang?: string): Promise<Message | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers = await getHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/messages/threads/${threadId}`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ content, lang }),
          }
        );

        if (!response.ok) throw new Error('Failed to post message');

        const data = await response.json();
        return data;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const translateMessage = useCallback(
    async (text: string, fromLang: string, toLang: string): Promise<string | null> => {
      try {
        const headers = await getHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/messages/translate`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ text, fromLang, toLang }),
          }
        );

        if (!response.ok) throw new Error('Failed to translate');

        const data = await response.json();
        return data.translated;
      } catch (err: any) {
        setError(err.message);
        return null;
      }
    },
    []
  );

  return { loading, error, getThread, postMessage, translateMessage };
}
```

---

## 3️⃣ Mode Chantier Mobile + PWA

### 🎯 Objectif
Interface mobile optimisée pour chefs de chantier avec:
- Vue simplifiée projets et journal
- Création tickets SAV offline
- Queue de synchronisation automatique
- PWA installable (Add to Home Screen)

### 📱 PWA Configuration

#### Manifest: `/public/manifest.json`

```json
{
  "name": "RealtyOS Chantier",
  "short_name": "RealtyOS",
  "description": "Gestion de chantier mobile pour promoteurs immobiliers",
  "start_url": "/chantier",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#0f172a",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### Meta Tags in `index.html`

```html
<!-- PWA Support -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0f172a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

### 📲 Offline Queue

#### Utility: `/src/lib/offlineQueue.ts`

```typescript
type PendingAction = {
  id: string;
  url: string;
  method: string;
  body: any;
  createdAt: string;
};

const STORAGE_KEY = 'realtyos_offline_queue';

export function addPendingAction(action: Omit<PendingAction, 'id' | 'createdAt'>) {
  const existing: PendingAction[] = JSON.parse(
    window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  );
  existing.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...action,
  });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export async function flushPendingActions() {
  const actions: PendingAction[] = JSON.parse(
    window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  );
  if (!actions.length) return;

  const remaining: PendingAction[] = [];

  for (const act of actions) {
    try {
      const res = await fetch(act.url, {
        method: act.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(act.body),
      });
      if (!res.ok) {
        remaining.push(act);
      }
    } catch {
      remaining.push(act);
    }
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}

export function getPendingActionsCount(): number {
  const actions: PendingAction[] = JSON.parse(
    window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  );
  return actions.length;
}
```

#### React Hook: `/src/hooks/useOfflineQueue.ts`

```typescript
import { useState, useEffect } from 'react';
import { addPendingAction, flushPendingActions, getPendingActionsCount } from '@/lib/offlineQueue';

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateCount = () => setPendingCount(getPendingActionsCount());

    const handleOnline = () => {
      setIsOnline(true);
      flushPendingActions().then(updateCount);
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Try flush on mount if online
    if (navigator.onLine) {
      flushPendingActions().then(updateCount);
    } else {
      updateCount();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { pendingCount, isOnline, addPendingAction, flushPendingActions };
}
```

#### Mobile Page: `/src/pages/ChantierHome.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Building2, Cloud, CloudOff, AlertCircle } from 'lucide-react';

type SiteProject = {
  id: string;
  name: string;
  city?: string;
};

export default function ChantierHome() {
  const { pendingCount, isOnline } = useOfflineQueue();
  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    // TODO: Filter projects by user role (EG_SITE / CHEF_CHANTIER)
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-md px-4 py-6 space-y-4">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Mode Chantier</h1>
              <p className="text-xs text-slate-400 mt-1">
                Vue mobile optimisée pour le terrain
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Cloud className="h-5 w-5 text-green-400" />
              ) : (
                <CloudOff className="h-5 w-5 text-amber-400" />
              )}
              {pendingCount > 0 && (
                <Badge variant="warning" size="sm">
                  {pendingCount} en attente
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Offline Warning */}
        {!isOnline && (
          <Card className="bg-amber-900/20 border-amber-700">
            <div className="flex items-center gap-3 text-amber-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Mode hors ligne</p>
                <p className="text-xs text-amber-300 mt-0.5">
                  Vos actions seront synchronisées dès que vous serez en ligne
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Projects */}
        {loading ? (
          <p className="text-sm text-slate-400">Chargement des projets...</p>
        ) : projects.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-slate-600" />
              <p className="text-sm text-slate-400 mt-3">
                Aucun projet chantier assigné
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {projects.map((p) => (
              <a
                key={p.id}
                href={`/chantier/projects/${p.id}`}
                className="block rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 hover:bg-slate-800 transition"
              >
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.city ?? 'Localité inconnue'}</p>
              </a>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          <a
            href="/chantier/journal"
            className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center hover:bg-slate-800 transition"
          >
            <p className="text-sm font-medium">Journal</p>
            <p className="text-xs text-slate-400 mt-1">Entrées du jour</p>
          </a>
          <a
            href="/chantier/sav"
            className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center hover:bg-slate-800 transition"
          >
            <p className="text-sm font-medium">SAV</p>
            <p className="text-xs text-slate-400 mt-1">Créer ticket</p>
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## ⚙️ Intégration Routing

### Update `src/App.tsx`

```typescript
import { Routes, Route } from 'react-router-dom';
import PromoterDashboard from './pages/PromoterDashboard';
import ChantierHome from './pages/ChantierHome';
// ... other imports

function App() {
  return (
    <Routes>
      {/* Existing routes */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* NEW: Promoter Dashboard */}
      <Route path="/promoter/dashboard" element={<PromoterDashboard />} />

      {/* NEW: Mobile Site Mode */}
      <Route path="/chantier" element={<ChantierHome />} />
      <Route path="/chantier/projects/:projectId" element={<ChantierProjectDetail />} />
      <Route path="/chantier/journal" element={<ChantierJournal />} />
      <Route path="/chantier/sav" element={<ChantierSAV />} />

      {/* ... rest of routes */}
    </Routes>
  );
}
```

---

## 🚀 Déploiement

### 1. Edge Functions (Supabase)

```bash
# Deploy promoter dashboard
supabase functions deploy promoter-dashboard

# Deploy messages/chat
supabase functions deploy messages
```

### 2. Frontend Build

```bash
npm run build
```

### 3. PWA Icons

Créer les icônes dans `/public/icons/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

---

## ✅ Checklist Finale

### Base de Données
- [x] Migration appliquée (`offline_actions`, `body_lang`, contextes)
- [x] Indexes créés
- [x] RLS policies configurées
- [x] Helper functions SQL

### Backend (Edge Functions)
- [ ] `promoter-dashboard` déployée
- [ ] `messages` déployée
- [ ] CORS configurés
- [ ] Tests endpoints

### Frontend
- [ ] Hooks créés (`usePromoterDashboard`, `useChat`, `useOfflineQueue`)
- [ ] Pages créées (PromoterDashboard, ChantierHome, etc.)
- [ ] Routing mis à jour
- [ ] PWA manifest ajouté
- [ ] Build successful

### PWA/Mobile
- [ ] Manifest.json créé
- [ ] Meta tags ajoutés
- [ ] Icons générées (192, 512)
- [ ] Offline queue testée
- [ ] Test sur mobile (Add to Home Screen)

---

## 📚 Évolutions Futures

### Phase 2 - Chat
- Intégrer vraie API de traduction (DeepL, Google)
- Notifications push pour nouveaux messages
- Typing indicators
- Read receipts

### Phase 3 - Mobile
- Service Worker pour cache complet
- IndexedDB pour data offline étendue
- Camera API pour photos chantier
- Geolocation pour journal

### Phase 4 - Dashboard
- Exports Excel/PDF des rapports
- Graphiques interactifs (Chart.js)
- Alertes temps réel (WebSockets)
- Comparaison projets

---

## 🎓 Support

**Migration Database:** `supabase/migrations/create_advanced_modules_chat_mobile_offline.sql`
**Documentation Edge Functions:** Voir `/supabase/functions/README.md`
**Hook TypeScript:** Type-safe avec génériques

---

## 🏁 Résumé

Les **3 modules avancés** sont architecturés et prêts pour implémentation:

✅ **Database Schema** - Migration appliquée avec succès
🚧 **Backend API** - Edge Functions documentées (à déployer)
🚧 **Frontend React** - Hooks, pages et composants documentés (à créer)
🚧 **PWA Mobile** - Manifest et offline queue architecturés (à finaliser)

**Prochaines étapes:**
1. Déployer les 2 Edge Functions
2. Créer les hooks React
3. Créer les pages UI
4. Générer icônes PWA
5. Tester le build
6. Test sur mobile

**Temps estimé d'implémentation complète:** 4-6 heures
