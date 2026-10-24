// API client with automatic cookie transmission and standardized error parsing

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    requestId?: string;
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("/api") ? endpoint : `/api/v1${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Send session cookies
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg =
      (data as ApiResponse<T>)?.error?.message ||
      `Request failed with status ${response.status}: ${response.statusText}`;
    const error = new Error(errorMsg) as Error & { code?: string; details?: unknown };
    error.code = (data as ApiResponse<T>)?.error?.code;
    error.details = (data as ApiResponse<T>)?.error?.details;
    throw error;
  }

  return ((data as ApiResponse<T>)?.data !== undefined ? (data as ApiResponse<T>).data : data) as T;
}
