import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';
import { api } from './api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/users/login', credentials, { requiredAuth: false });
  },
  
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/users/register', userData, { requiredAuth: false });
  },
};
