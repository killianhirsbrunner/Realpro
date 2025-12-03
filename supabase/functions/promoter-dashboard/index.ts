import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface DashboardStats {
  totalProjects: number;
  totalRevenuePotential: number;
  totalInvoices: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  totalSavTickets: {
    open: number;
    inProgress: number;
    closed: number;
  };
  projects: ProjectOverview[];
}

interface ProjectOverview {
  id: string;
  name: string;
  city: string;
  status: string;
  sales: {
    totalLots: number;
    soldLots: number;
    reservedLots: number;
    availableLots: number;
    salesPercentage: number;
    revenuePotential: number;
    revenueRealized: number;
  };
  finance: {
    budget: number;
    committed: number;
    invoiced: number;
    paid: number;
  };
  sav: {
    open: number;
    inProgress: number;
    avgResolutionDays: number;
  };
  construction: {
    progress: number;
    currentPhase: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);

    if (req.method === 'GET' && path[path.length - 1] === 'overview') {
      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id);

      if (!userOrgs || userOrgs.length === 0) {
        return new Response(JSON.stringify({ error: 'No organization access' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const orgId = userOrgs[0].organization_id;

      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (!projects) {
        return new Response(JSON.stringify({ projects: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const projectOverviews: ProjectOverview[] = await Promise.all(
        projects.map(async (project) => {
          const { data: lots } = await supabase
            .from('lots')
            .select('id, status, price_cents')
            .eq('project_id', project.id);

          const totalLots = lots?.length || 0;
          const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
          const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
          const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
          const revenuePotential = lots?.reduce((sum, l) => sum + (l.price_cents || 0), 0) || 0;
          const revenueRealized = lots?.filter(l => l.status === 'SOLD').reduce((sum, l) => sum + (l.price_cents || 0), 0) || 0;

          const { data: cfcBudgets } = await supabase
            .from('cfc_budgets')
            .select('budget_initial_cents, committed_cents, invoiced_cents, paid_cents')
            .eq('project_id', project.id);

          const finance = {
            budget: cfcBudgets?.reduce((sum, b) => sum + (b.budget_initial_cents || 0), 0) || 0,
            committed: cfcBudgets?.reduce((sum, b) => sum + (b.committed_cents || 0), 0) || 0,
            invoiced: cfcBudgets?.reduce((sum, b) => sum + (b.invoiced_cents || 0), 0) || 0,
            paid: cfcBudgets?.reduce((sum, b) => sum + (b.paid_cents || 0), 0) || 0,
          };

          const { data: savTickets } = await supabase
            .from('sav_tickets')
            .select('id, status, created_at, closed_at')
            .eq('project_id', project.id);

          const openTickets = savTickets?.filter(t => ['NEW', 'ASSIGNED'].includes(t.status)).length || 0;
          const inProgressTickets = savTickets?.filter(t => t.status === 'IN_PROGRESS').length || 0;
          const closedTickets = savTickets?.filter(t => ['FIXED', 'VALIDATED', 'CLOSED'].includes(t.status)) || [];

          const avgResolutionDays = closedTickets.length > 0
            ? closedTickets.reduce((sum, t) => {
                const created = new Date(t.created_at).getTime();
                const closed = new Date(t.closed_at).getTime();
                return sum + (closed - created) / (1000 * 60 * 60 * 24);
              }, 0) / closedTickets.length
            : 0;

          const { data: phases } = await supabase
            .from('construction_phases')
            .select('name, progress_percentage')
            .eq('project_id', project.id)
            .order('start_date', { ascending: false })
            .limit(1);

          return {
            id: project.id,
            name: project.name,
            city: project.city,
            status: project.status,
            sales: {
              totalLots,
              soldLots,
              reservedLots,
              availableLots,
              salesPercentage: totalLots > 0 ? (soldLots / totalLots) * 100 : 0,
              revenuePotential,
              revenueRealized,
            },
            finance,
            sav: {
              open: openTickets,
              inProgress: inProgressTickets,
              avgResolutionDays: Math.round(avgResolutionDays),
            },
            construction: {
              progress: phases?.[0]?.progress_percentage || 0,
              currentPhase: phases?.[0]?.name || 'Not started',
            },
          };
        })
      );

      const totalRevenuePotential = projectOverviews.reduce((sum, p) => sum + p.sales.revenuePotential, 0);

      const { data: allInvoices } = await supabase
        .from('buyer_invoices')
        .select('amount_total_cents, amount_paid_cents, due_date, status')
        .eq('organization_id', orgId);

      const totalInvoices = {
        total: allInvoices?.reduce((sum, inv) => sum + (inv.amount_total_cents || 0), 0) || 0,
        paid: allInvoices?.reduce((sum, inv) => sum + (inv.amount_paid_cents || 0), 0) || 0,
        pending: allInvoices?.filter(inv => inv.status === 'PENDING').reduce((sum, inv) => sum + (inv.amount_total_cents - inv.amount_paid_cents), 0) || 0,
        overdue: allInvoices?.filter(inv => inv.status === 'LATE').reduce((sum, inv) => sum + (inv.amount_total_cents - inv.amount_paid_cents), 0) || 0,
      };

      const totalSavOpen = projectOverviews.reduce((sum, p) => sum + p.sav.open, 0);
      const totalSavInProgress = projectOverviews.reduce((sum, p) => sum + p.sav.inProgress, 0);

      const { data: allClosedTickets } = await supabase
        .from('sav_tickets')
        .select('id')
        .eq('organization_id', orgId)
        .in('status', ['FIXED', 'VALIDATED', 'CLOSED']);

      const dashboardStats: DashboardStats = {
        totalProjects: projects.length,
        totalRevenuePotential,
        totalInvoices,
        totalSavTickets: {
          open: totalSavOpen,
          inProgress: totalSavInProgress,
          closed: allClosedTickets?.length || 0,
        },
        projects: projectOverviews,
      };

      return new Response(JSON.stringify(dashboardStats), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET' && path.includes('project')) {
      const projectId = path[path.length - 1];

      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (!project) {
        return new Response(JSON.stringify({ error: 'Project not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: lots } = await supabase
        .from('lots')
        .select('id, lot_number, status, price_cents, buyer:buyers(first_name, last_name)')
        .eq('project_id', projectId);

      const { data: recentActivity } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(10);

      return new Response(JSON.stringify({ project, lots, recentActivity }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
