export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
