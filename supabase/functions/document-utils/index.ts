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
    const action = pathParts[pathParts.length - 1];

    // POST /document-utils/classify
    if (req.method === "POST" && action === "classify") {
      const { name } = await req.json();

      if (!name) {
        return new Response(
          JSON.stringify({ error: "name required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const result = classifyDocument(name);

      return new Response(
        JSON.stringify(result),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /document-utils/generate-qr/:documentId
    if (req.method === "POST" && pathParts.includes("generate-qr")) {
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

      // Get user's organization
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

      // Verify document exists
      const { data: doc, error: docError } = await supabaseClient
        .from("documents")
        .select("id, organization_id")
        .eq("id", documentId)
        .in("organization_id", orgIds)
        .single();

      if (docError || !doc) {
        return new Response(
          JSON.stringify({ error: "Document not found or access denied" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Generate QR code URL
      const baseUrl = Deno.env.get("PUBLIC_APP_URL") || "https://app.example.com";
      const targetUrl = `${baseUrl}/documents/${documentId}`;

      // Generate QR code as SVG (simple implementation)
      const qrCodeDataUrl = await generateQRCode(targetUrl);

      // Update document with QR code URL
      const { data: updated, error: updateError } = await supabaseClient
        .from("documents")
        .update({ qr_code_url: qrCodeDataUrl })
        .eq("id", documentId)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify(updated),
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
    console.error("Document utils function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function classifyDocument(name: string): { type?: string; tags: string[] } {
  const lower = name.toLowerCase();
  const tags: string[] = [];
  let type: string | undefined;

  if (lower.includes("reservation") || lower.includes("réservation")) {
    type = "RESERVATION";
    tags.push("vente");
  } else if (lower.includes("contrat") && lower.includes("eg")) {
    type = "CONTRACT_EG";
    tags.push("eg", "contrat");
  } else if (lower.includes("contrat")) {
    type = "CONTRACT";
    tags.push("contrat");
  } else if (lower.includes("plan")) {
    type = "PLAN";
    tags.push("plan");
  } else if (lower.includes("avenant")) {
    type = "AVENANT";
    tags.push("avenant");
  } else if (lower.includes("acte")) {
    type = "ACTE_NOTARIAL";
    tags.push("notaire");
  } else if (
    lower.includes("id") ||
    lower.includes("passport") ||
    lower.includes("identite") ||
    lower.includes("identité")
  ) {
    type = "ID_DOC";
    tags.push("acheteur", "identite");
  } else if (lower.includes("attestation") && lower.includes("financement")) {
    type = "ATTESTATION_FINANCEMENT";
    tags.push("financement", "acheteur");
  } else if (lower.includes("facture") || lower.includes("invoice")) {
    type = "INVOICE";
    tags.push("finance");
  }

  return { type, tags };
}

async function generateQRCode(url: string): Promise<string> {
  // Simple QR code generation using an external API
  // In production, you might want to use a proper QR code library
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  // Return the API URL as the QR code URL
  // In production, you might want to fetch this and store it in your own storage
  return qrApiUrl;
}
