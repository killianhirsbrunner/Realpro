import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
    const module = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
    const action = pathParts[pathParts.length - 1];

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

    // ========================================
    // SITE DIARY MODULE
    // ========================================

    // GET /construction/diary/:projectId
    if (req.method === "GET" && pathParts.includes("diary")) {
      const projectId = pathParts[pathParts.length - 1];

      const { data, error } = await supabaseClient
        .from("site_diary_entries")
        .select(`
          *,
          created_by:created_by_id (
            id,
            email,
            raw_user_meta_data
          ),
          photos:site_diary_photos (*),
          documents:site_diary_documents (
            *,
            document:document_id (*)
          )
        `)
        .eq("project_id", projectId)
        .in("organization_id", orgIds)
        .order("entry_date", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /construction/diary
    if (req.method === "POST" && action === "diary") {
      const body = await req.json();
      const { projectId, date, weather, notes, workforce, issues, planningPhaseId } = body;

      if (!projectId || !date) {
        return new Response(
          JSON.stringify({ error: "projectId and date are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const organizationId = orgIds[0];

      const { data, error } = await supabaseClient
        .from("site_diary_entries")
        .insert({
          organization_id: organizationId,
          project_id: projectId,
          entry_date: date,
          weather: weather || null,
          notes: notes || null,
          workforce: workforce || [],
          issues: issues || [],
          planning_phase_id: planningPhaseId || null,
          created_by_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /construction/diary/:diaryId/photo
    if (req.method === "POST" && pathParts.includes("photo")) {
      const diaryId = pathParts[pathParts.length - 2];
      const { url, caption } = await req.json();

      if (!url) {
        return new Response(
          JSON.stringify({ error: "url is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("site_diary_photos")
        .insert({
          diary_id: diaryId,
          url,
          caption: caption || null,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ========================================
    // HANDOVER MODULE
    // ========================================

    // GET /construction/handover/lot/:lotId
    if (req.method === "GET" && pathParts.includes("handover") && pathParts.includes("lot")) {
      const lotId = pathParts[pathParts.length - 1];

      const { data, error } = await supabaseClient
        .from("handover_events")
        .select(`
          *,
          lot:lot_id (*),
          buyer:buyer_id (*),
          issues:handover_issues (*)
        `)
        .eq("lot_id", lotId)
        .in("organization_id", orgIds)
        .order("date", { ascending: true });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /construction/handover
    if (req.method === "POST" && action === "handover") {
      const body = await req.json();
      const { projectId, lotId, buyerId, type, date, notes } = body;

      if (!projectId || !lotId || !buyerId || !type || !date) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const organizationId = orgIds[0];

      const { data, error } = await supabaseClient
        .from("handover_events")
        .insert({
          organization_id: organizationId,
          project_id: projectId,
          lot_id: lotId,
          buyer_id: buyerId,
          type,
          date,
          notes: notes || null,
          status: "SCHEDULED",
          created_by_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /construction/handover/:handoverId/issue
    if (req.method === "POST" && pathParts.includes("issue")) {
      const handoverId = pathParts[pathParts.length - 2];
      const { description, severity, photos, projectId, lotId } = await req.json();

      if (!description || !severity) {
        return new Response(
          JSON.stringify({ error: "description and severity are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("handover_issues")
        .insert({
          inspection_id: handoverId,
          project_id: projectId,
          lot_id: lotId,
          title: description.substring(0, 100),
          description,
          severity,
          photos: photos || [],
          status: "OPEN",
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ========================================
    // WARRANTIES MODULE
    // ========================================

    // GET /construction/warranties/:projectId
    if (req.method === "GET" && pathParts.includes("warranties")) {
      const projectId = pathParts[pathParts.length - 1];

      const { data, error } = await supabaseClient
        .from("company_warranties")
        .select(`
          *,
          company:company_id (*),
          project:project_id (*),
          document:document_id (*)
        `)
        .eq("project_id", projectId)
        .in("organization_id", orgIds)
        .order("end_at", { ascending: true });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /construction/warranties
    if (req.method === "POST" && action === "warranties") {
      const body = await req.json();
      const { projectId, companyId, description, startAt, endAt, documentId } = body;

      if (!projectId || !companyId || !description || !startAt || !endAt) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const organizationId = orgIds[0];

      const { data, error } = await supabaseClient
        .from("company_warranties")
        .insert({
          organization_id: organizationId,
          project_id: projectId,
          company_id: companyId,
          description,
          start_at: startAt,
          end_at: endAt,
          document_id: documentId || null,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ========================================
    // SAFETY MODULE
    // ========================================

    // GET /construction/safety/:projectId
    if (req.method === "GET" && pathParts.includes("safety")) {
      const projectId = pathParts[pathParts.length - 1];

      const [plans, trainings] = await Promise.all([
        supabaseClient
          .from("safety_plans")
          .select("*, document:document_id (*)")
          .eq("project_id", projectId),
        supabaseClient
          .from("safety_trainings")
          .select("*, company:company_id (*)")
          .eq("project_id", projectId)
          .order("date", { ascending: false }),
      ]);

      if (plans.error) throw plans.error;
      if (trainings.error) throw trainings.error;

      return new Response(
        JSON.stringify({
          plans: plans.data,
          trainings: trainings.data,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /construction/safety/plan
    if (req.method === "POST" && pathParts.includes("plan")) {
      const { projectId, title, description, documentId } = await req.json();

      if (!projectId || !title) {
        return new Response(
          JSON.stringify({ error: "projectId and title are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("safety_plans")
        .insert({
          project_id: projectId,
          title,
          description: description || null,
          document_id: documentId || null,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /construction/safety/training
    if (req.method === "POST" && pathParts.includes("training")) {
      const { projectId, companyId, date, topic, attendees } = await req.json();

      if (!projectId || !date || !topic) {
        return new Response(
          JSON.stringify({ error: "projectId, date, and topic are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("safety_trainings")
        .insert({
          project_id: projectId,
          company_id: companyId || null,
          date,
          topic,
          attendees: attendees || [],
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
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
    console.error("Construction function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
