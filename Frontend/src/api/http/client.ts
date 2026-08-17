// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1';

// Error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const { headers, ...restOptions } = options;
  
  const response = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  // Handle error responses
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    
    throw new ApiError(
      response.status,
      errorData?.detail || `HTTP ${response.status}`,
      errorData
    );
  }

  // Parse response
  const data: T = await response.json();
  return data;
}

// GET request
export async function get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return apiCall<T>(endpoint, { method: 'GET', ...options });
}

// POST request
export async function post<T>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...options
  });
}

// PUT request
export async function put<T>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    ...options
  });
}

// DELETE request
export async function del<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return apiCall<T>(endpoint, { method: 'DELETE', ...options });
}
