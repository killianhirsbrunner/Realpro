import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChecklistItem {
  key: string;
  label: string;
  status: "OK" | "MISSING" | "WARNING";
  details?: string[];
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
    const pathParts = url.pathname.split("/").filter(Boolean);

    // GET /notary-checklist/buyer/:buyerId
    if (req.method === "GET" && pathParts.includes("buyer")) {
      const buyerId = pathParts[pathParts.length - 1];

      if (!buyerId) {
        return new Response(
          JSON.stringify({ error: "buyerId required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Get user's organizations
      const { data: userOrgs } = await supabaseClient
        .from("user_organizations")
        .select("organization_id")
        .eq("user_id", user.id);

      if (!userOrgs || userOrgs.length === 0) {
        return new Response(
          JSON.stringify({ error: "No organization found" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const orgIds = userOrgs.map((o: any) => o.organization_id);

      // Get buyer with project
      const { data: buyer, error: buyerError } = await supabaseClient
        .from("buyers")
        .select(`
          id,
          first_name,
          last_name,
          email,
          project:project_id (
            id,
            name,
            organization_id
          )
        `)
        .eq("id", buyerId)
        .single();

      if (buyerError || !buyer) {
        return new Response(
          JSON.stringify({ error: "Buyer not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if buyer's project belongs to user's org
      if (!orgIds.includes((buyer.project as any).organization_id)) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // 1. Check required documents
      const requiredDocTypes = ["ID_DOC", "ATTESTATION_FINANCEMENT"];
      const { data: docs } = await supabaseClient
        .from("documents")
        .select("id, type")
        .eq("buyer_id", buyerId);

      const missingDocs: string[] = [];
      for (const docType of requiredDocTypes) {
        if (!docs?.find((d: any) => d.type === docType)) {
          missingDocs.push(docType);
        }
      }

      // 2. Check material choices (from buyer_choices table)
      const { data: choices } = await supabaseClient
        .from("buyer_choices")
        .select("id, status")
        .eq("buyer_id", buyerId);

      const materialsComplete =
        choices && choices.length > 0 && choices.every((c: any) => c.status === "CONFIRMED");

      // 3. Check mandatory invoices (simplified - in real system, check metadata)
      const { data: invoices } = await supabaseClient
        .from("buyer_invoices")
        .select("id, invoice_number, amount_total_cents, amount_paid_cents")
        .eq("buyer_id", buyerId);

      // For now, consider all invoices as mandatory
      const unpaidInvoices = invoices?.filter(
        (i: any) => (i.amount_paid_cents || 0) < i.amount_total_cents
      ) || [];

      // Build checklist
      const checklistItems: ChecklistItem[] = [
        {
          key: "DOCS_REQUIRED",
          label: "Documents obligatoires fournis",
          status: missingDocs.length === 0 ? "OK" : "MISSING",
          details: missingDocs,
        },
        {
          key: "MATERIAL_CHOICES",
          label: "Choix matériaux finalisés",
          status: materialsComplete ? "OK" : "WARNING",
        },
        {
          key: "MANDATORY_INVOICES",
          label: "Acomptes obligatoires réglés",
          status: unpaidInvoices.length === 0 ? "OK" : "MISSING",
          details: unpaidInvoices.map((i: any) => i.invoice_number),
        },
      ];

      const ready = checklistItems.every((item) => item.status === "OK");

      return new Response(
        JSON.stringify({
          buyer: {
            id: buyer.id,
            fullName: `${buyer.first_name} ${buyer.last_name}`,
            email: buyer.email,
            projectName: (buyer.project as any).name,
          },
          ready,
          items: checklistItems,
        }),
        {
          status: 200,
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
    console.error("Notary checklist function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
