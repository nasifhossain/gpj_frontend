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
    return api.put<User>(`/users/${userId}`, userData, { requiredAuth: true });
  },

  deleteUser: async (userId: string): Promise<void> => {
    return api.delete<void>(`/users/${userId}`, { requiredAuth: true });
  },
};
