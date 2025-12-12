/**
 * HTTP utilities - Fetch wrapper and error handling
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * Generic fetch wrapper with error handling
 */
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        data: null,
        error: {
          message: errorBody.message || `HTTP Error: ${response.status}`,
          code: errorBody.code,
          status: response.status,
        },
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'NETWORK_ERROR',
      },
    };
  }
}

/**
 * Build URL with query parameters
 */
export function buildUrl(baseUrl: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Delay utility for retry logic
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        await delay(baseDelay * Math.pow(2, attempt));
      }
    }
  }

  throw lastError;
}
