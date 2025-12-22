import { api } from './api';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    return api.get<User[]>('/users', { requiredAuth: true });
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    return api.post<User>('/users', userData, { requiredAuth: true });
  },

  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<User> => {
    // Only send fields that are provided
    const payload: any = {};
    if (userData.name) payload.name = userData.name;
    if (userData.role) payload.role = userData.role;
    if (userData.email) payload.email = userData.email;
    if (userData.password) payload.password = userData.password;
    
    return api.put<User>(`/users/${userId}`, payload, { requiredAuth: true });
  },

  deleteUser: async (userId: string): Promise<void> => {
    return api.delete<void>(`/users/${userId}`, { requiredAuth: true });
  },
};
