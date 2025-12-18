import { LoginRequest, LoginResponse } from '@/types/auth';
import { api } from './api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/users/login', credentials, { requiredAuth: false });
  },
};
