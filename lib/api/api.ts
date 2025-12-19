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
    // Get token from cookies (where it's stored by the login form)
    if (typeof window !== 'undefined') {
        // Parse cookies manually since we're in a client component
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);
        
        const token = cookies['token'];
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
    let errorMessage: string;
    
    try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.message || errorJson.error || errorJson.detail || (errorJson.errors ? JSON.stringify(errorJson.errors) : null) || response.statusText;
    } catch {
        // If parsing fails, use the raw text or a generic message
        errorMessage = errorBody || response.statusText;
    }

    throw new Error(errorMessage);
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
