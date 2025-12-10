// Shared Response Utilities for Edge Functions

import { corsHeaders } from './cors.ts';

/**
 * Create a JSON response with CORS headers
 */
export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, message?: string): Response {
  return jsonResponse({
    success: true,
    data,
    message,
  });
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string | Error,
  status = 500,
  code?: string
): Response {
  const message = error instanceof Error ? error.message : error;

  return jsonResponse(
    {
      success: false,
      error: {
        message,
        code: code || 'INTERNAL_ERROR',
      },
    },
    status
  );
}

/**
 * Create a not found response
 */
export function notFoundResponse(entity = 'Resource'): Response {
  return errorResponse(`${entity} not found`, 404, 'NOT_FOUND');
}

/**
 * Create a bad request response
 */
export function badRequestResponse(message = 'Invalid request'): Response {
  return errorResponse(message, 400, 'BAD_REQUEST');
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return errorResponse(message, 401, 'UNAUTHORIZED');
}

/**
 * Create a forbidden response
 */
export function forbiddenResponse(message = 'Forbidden'): Response {
  return errorResponse(message, 403, 'FORBIDDEN');
}
