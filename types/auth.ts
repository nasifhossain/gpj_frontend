export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
