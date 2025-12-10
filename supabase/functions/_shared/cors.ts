// Shared CORS Headers for Edge Functions

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

/**
 * Handle CORS preflight request
 */
export function handleCorsPreflightRequest(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Check if request is a CORS preflight
 */
export function isCorsPreflightRequest(req: Request): boolean {
  return req.method === 'OPTIONS';
}
