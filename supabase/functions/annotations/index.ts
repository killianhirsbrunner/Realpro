import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AddAnnotationInput {
  documentId: string;
  projectId: string;
  lotId?: string | null;
  page?: number;
  x: number;
  y: number;
  comment: string;
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

    // POST /annotations/add
    if (req.method === "POST" && pathParts[pathParts.length - 1] === "add") {
      const body = await req.json() as AddAnnotationInput;
      const { documentId, projectId, lotId, page, x, y, comment } = body;

      if (!documentId || !projectId || x === undefined || y === undefined || !comment) {
        return new Response(
          JSON.stringify({ error: "documentId, projectId, x, y, and comment are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Verify user has access to project
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

      const { data: project } = await supabaseClient
        .from("projects")
        .select("id, organization_id")
        .eq("id", projectId)
        .in("organization_id", orgIds)
        .single();

      if (!project) {
        return new Response(
          JSON.stringify({ error: "Project not found or access denied" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Create annotation
      const { data: annotation, error: createError } = await supabaseClient
        .from("plan_annotations")
        .insert({
          document_id: documentId,
          project_id: projectId,
          lot_id: lotId || null,
          author_id: user.id,
          page: page || 1,
          x,
          y,
          comment,
        })
        .select(`
          *,
          author:author_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .single();

      if (createError) throw createError;

      return new Response(
        JSON.stringify(annotation),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // GET /annotations/document/:documentId
    if (req.method === "GET" && pathParts.includes("document")) {
      const documentId = pathParts[pathParts.length - 1];

      if (!documentId) {
        return new Response(
          JSON.stringify({ error: "documentId required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

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

      // Verify document access
      const { data: doc } = await supabaseClient
        .from("documents")
        .select("id, organization_id")
        .eq("id", documentId)
        .in("organization_id", orgIds)
        .single();

      if (!doc) {
        return new Response(
          JSON.stringify({ error: "Document not found or access denied" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("plan_annotations")
        .select(`
          *,
          author:author_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq("document_id", documentId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Transform to include author names
      const annotations = data.map((a: any) => ({
        ...a,
        author: {
          id: a.author.id,
          email: a.author.email,
          firstName: a.author.raw_user_meta_data?.first_name || "",
          lastName: a.author.raw_user_meta_data?.last_name || "",
        },
      }));

      return new Response(
        JSON.stringify(annotations),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // DELETE /annotations/:id
    if (req.method === "DELETE") {
      const annotationId = pathParts[pathParts.length - 1];

      if (!annotationId) {
        return new Response(
          JSON.stringify({ error: "annotationId required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Delete annotation (RLS will ensure user owns it)
      const { error } = await supabaseClient
        .from("plan_annotations")
        .delete()
        .eq("id", annotationId)
        .eq("author_id", user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
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
    console.error("Annotations function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
