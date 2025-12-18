const API_BASE_URL = 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  requiredAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiredAuth = false, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers as Record<string, string>,
  };

  if (requiredAuth) {
    // In a real app, this would likely come from a context or more robust storage
    // For this task, we assume localStorage or similar mechanism
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    try {
        const errorJson = JSON.parse(errorBody);
        throw new Error(errorJson.message || `API Error: ${response.statusText}`);
    } catch {
        throw new Error(`API Request Failed: ${response.status} ${response.statusText}`);
    }
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
