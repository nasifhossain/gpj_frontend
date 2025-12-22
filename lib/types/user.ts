export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'CLIENT';
  password?: string;
}
