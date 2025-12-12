/**
 * API Client for Realpro Suite
 * Provides a standardized way to make API calls with error handling
 */

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

// Simulated network delay for development
const MOCK_DELAY = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generic mock API function
 * In production, replace with actual fetch/axios calls
 */
export async function mockApiCall<T>(
  data: T,
  options: { delay?: number; shouldFail?: boolean; errorMessage?: string } = {}
): Promise<ApiResponse<T>> {
  const { delay: delayMs = MOCK_DELAY, shouldFail = false, errorMessage = 'An error occurred' } = options;

  await delay(delayMs);

  if (shouldFail) {
    return {
      data: null,
      error: {
        code: 'MOCK_ERROR',
        message: errorMessage,
      },
      status: 500,
    };
  }

  return {
    data,
    error: null,
    status: 200,
  };
}

/**
 * Paginate an array of items
 */
export function paginateArray<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: items.slice(start, end),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

/**
 * Filter items based on search query
 */
export function filterBySearch<T extends Record<string, unknown>>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchQuery.trim()) return items;

  const query = searchQuery.toLowerCase().trim();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
      }
      if (typeof value === 'number') {
        return value.toString().includes(query);
      }
      return false;
    })
  );
}

/**
 * Sort items by field
 */
export function sortByField<T extends Record<string, unknown>>(
  items: T[],
  sortBy: keyof T,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    let comparison: number;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

/**
 * Create a query string from params
 */
export function createQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  if (params.search) searchParams.set('search', params.search);
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(`filter.${key}`, String(value));
      }
    });
  }

  return searchParams.toString();
}
