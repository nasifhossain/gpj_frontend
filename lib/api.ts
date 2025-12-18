import { api } from './api/api';
import { Template } from './types';

export const fetchTemplates = async (): Promise<Template[]> => {
  // Use api.get which defaults to GET and handles headers/auth if configured
  // Assuming 'requiredAuth: true' is needed as per original curl having Authorization header
  return api.get<Template[]>('/briefs/templates', { requiredAuth: true });
};
