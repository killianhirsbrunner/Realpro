import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FinancialAssumptions {
  priceMultiplier?: number;
  costMultiplier?: number;
  interestRate?: number;
  vacancyRate?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // GET /financial/scenarios
    if (req.method === "GET" && path === "scenarios") {
      const organizationId = url.searchParams.get("organizationId");
      const projectId = url.searchParams.get("projectId");

      if (!organizationId) {
        return new Response(
          JSON.stringify({ error: "organizationId required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      let query = supabaseClient
        .from("financial_scenarios")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /financial/calculate
    if (req.method === "POST" && path === "calculate") {
      const body = await req.json();
      const { organizationId, projectId, assumptions } = body as {
        organizationId: string;
        projectId?: string | null;
        assumptions: FinancialAssumptions;
      };

      if (!organizationId) {
        return new Response(
          JSON.stringify({ error: "organizationId required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const results = await calculateScenario(supabaseClient, organizationId, projectId, assumptions);

      return new Response(
        JSON.stringify(results),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /financial/scenarios
    if (req.method === "POST" && path === "scenarios") {
      const body = await req.json();
      const { organizationId, projectId, name, description, assumptions } = body;

      if (!organizationId || !name) {
        return new Response(
          JSON.stringify({ error: "organizationId and name required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Calculate results first
      const results = await calculateScenario(supabaseClient, organizationId, projectId, assumptions);

      // Insert scenario
      const { data, error } = await supabaseClient
        .from("financial_scenarios")
        .insert({
          organization_id: organizationId,
          project_id: projectId || null,
          name,
          description: description || null,
          assumptions,
          results,
          created_by_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ scenario: data, results }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function calculateScenario(
  supabase: any,
  organizationId: string,
  projectId: string | null | undefined,
  assumptions: FinancialAssumptions
) {
  const {
    priceMultiplier = 1,
    costMultiplier = 1,
    interestRate = 0,
    vacancyRate = 0,
  } = assumptions;

  // 1. Load lots
  let lotsQuery = supabase.from("lots").select("price_total");

  if (projectId) {
    lotsQuery = lotsQuery.eq("project_id", projectId);
  } else {
    // Get all projects in org
    const { data: projects } = await supabase
      .from("projects")
      .select("id")
      .eq("organization_id", organizationId);

    if (projects && projects.length > 0) {
      lotsQuery = lotsQuery.in("project_id", projects.map((p: any) => p.id));
    }
  }

  const { data: lots } = await lotsQuery;

  // 2. Load CFC budgets
  let cfcQuery = supabase.from("cfc_lines").select("amount_budgeted");

  if (projectId) {
    // Get budget ids for project
    const { data: budgets } = await supabase
      .from("cfc_budgets")
      .select("id")
      .eq("project_id", projectId);

    if (budgets && budgets.length > 0) {
      cfcQuery = cfcQuery.in("budget_id", budgets.map((b: any) => b.id));
    }
  } else {
    // Get all budgets in org
    const { data: projects } = await supabase
      .from("projects")
      .select("id")
      .eq("organization_id", organizationId);

    if (projects && projects.length > 0) {
      const { data: budgets } = await supabase
        .from("cfc_budgets")
        .select("id")
        .in("project_id", projects.map((p: any) => p.id));

      if (budgets && budgets.length > 0) {
        cfcQuery = cfcQuery.in("budget_id", budgets.map((b: any) => b.id));
      }
    }
  }

  const { data: cfcLines } = await cfcQuery;

  // 3. Calculate base revenue
  const baseRevenue = (lots || []).reduce((sum: number, lot: any) => {
    return sum + (lot.price_total || 0);
  }, 0);

  const adjustedRevenue = baseRevenue * priceMultiplier * (1 - vacancyRate);

  // 4. Calculate base cost
  const baseCost = (cfcLines || []).reduce((sum: number, line: any) => {
    return sum + (line.amount_budgeted || 0);
  }, 0);

  const adjustedCost = baseCost * costMultiplier;

  // 5. Calculate margin
  const margin = adjustedRevenue - adjustedCost;
  const marginPercent = adjustedRevenue > 0 ? (margin / adjustedRevenue) * 100 : 0;

  // 6. Simple cashflow (can be enhanced with real payment schedules)
  const currentYear = new Date().getFullYear();
  const cashflowByYear = [
    {
      year: currentYear,
      cashIn: adjustedRevenue * 0.3,
      cashOut: adjustedCost * 0.6,
    },
    {
      year: currentYear + 1,
      cashIn: adjustedRevenue * 0.7,
      cashOut: adjustedCost * 0.4,
    },
  ];

  return {
    baseRevenue,
    adjustedRevenue,
    baseCost,
    adjustedCost,
    margin,
    marginPercent,
    actualCashIn: 0, // TODO: calculate from actual payments
    cashflowByYear,
  };
}
