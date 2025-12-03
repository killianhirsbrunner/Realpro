import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InitSignatureInput {
  documentId: string;
  type: string;
  signerName?: string;
  signerEmail: string;
  signerLocale?: string;
  redirectUrlSuccess?: string;
  redirectUrlCancel?: string;
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
    const action = pathParts[pathParts.length - 1];

    // POST /signatures/init
    if (req.method === "POST" && action === "init") {
      const body = await req.json() as InitSignatureInput;
      const { documentId, type, signerEmail, signerName, signerLocale, redirectUrlSuccess, redirectUrlCancel } = body;

      if (!documentId || !type || !signerEmail) {
        return new Response(
          JSON.stringify({ error: "documentId, type, and signerEmail are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Get user's organization
      const { data: userOrgs } = await supabaseClient
        .from("user_organizations")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1);

      if (!userOrgs || userOrgs.length === 0) {
        return new Response(
          JSON.stringify({ error: "No organization found" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const organizationId = userOrgs[0].organization_id;

      // Verify document exists and belongs to org
      const { data: doc, error: docError } = await supabaseClient
        .from("documents")
        .select("id, organization_id")
        .eq("id", documentId)
        .eq("organization_id", organizationId)
        .single();

      if (docError || !doc) {
        return new Response(
          JSON.stringify({ error: "Document not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // For now, use TEST provider
      const provider = "TEST";
      const providerRequestId = `TEST-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      // Create signature request
      const { data: signatureRequest, error: createError } = await supabaseClient
        .from("signature_requests")
        .insert({
          organization_id: organizationId,
          document_id: documentId,
          type,
          status: "PENDING",
          provider,
          provider_request_id: providerRequestId,
          signer_name: signerName || null,
          signer_email: signerEmail,
          signer_locale: signerLocale || null,
          redirect_url_success: redirectUrlSuccess || null,
          redirect_url_cancel: redirectUrlCancel || null,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Generate signing URL (in production, call actual provider API)
      const signingUrl = `https://example-sign-provider.test/sign/${providerRequestId}`;

      return new Response(
        JSON.stringify({
          request: signatureRequest,
          signingUrl,
        }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /signatures/callback
    if (req.method === "POST" && action === "callback") {
      const body = await req.json();
      const { provider, providerRequestId, status } = body;

      if (!provider || !providerRequestId || !status) {
        return new Response(
          JSON.stringify({ error: "provider, providerRequestId, and status are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Find signature request
      const { data: signatureRequest, error: findError } = await supabaseClient
        .from("signature_requests")
        .select("*")
        .eq("provider", provider)
        .eq("provider_request_id", providerRequestId)
        .single();

      if (findError || !signatureRequest) {
        return new Response(
          JSON.stringify({ error: "Signature request not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Update signature request status
      const { data: updated, error: updateError } = await supabaseClient
        .from("signature_requests")
        .update({ status })
        .eq("id", signatureRequest.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // If signed, update document metadata
      if (status === "SIGNED") {
        const { data: doc } = await supabaseClient
          .from("documents")
          .select("metadata")
          .eq("id", signatureRequest.document_id)
          .single();

        const metadata = doc?.metadata || {};

        await supabaseClient
          .from("documents")
          .update({
            metadata: {
              ...metadata,
              signedElectronically: true,
              signedAt: new Date().toISOString(),
              signedBy: signatureRequest.signer_email,
            },
          })
          .eq("id", signatureRequest.document_id);
      }

      return new Response(
        JSON.stringify(updated),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // GET /signatures/document/:documentId
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

      const { data, error } = await supabaseClient
        .from("signature_requests")
        .select("*")
        .eq("document_id", documentId)
        .in("organization_id", orgIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
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
    console.error("Signatures function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
