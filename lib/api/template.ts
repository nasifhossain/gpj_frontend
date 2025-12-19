import { api } from './api';
import { Template } from '../types';

export const templateService = {
  /**
   * Fetch all available templates
   * @returns Promise<Template[]> - Array of templates
   */
  getTemplates: async (): Promise<Template[]> => {
    return api.get<Template[]>('/briefs/templates', { requiredAuth: true });
  },

  /**
   * Fetch a single template by name
   * @param templateName - The name of the template to fetch
   * @returns Promise<Template> - The requested template
   */
  getTemplateByName: async (templateName: string): Promise<Template> => {
    return api.get<Template>(`/briefs/templates/${templateName}`, { requiredAuth: true });
  },

  /**
   * Create a new brief from a template
   * @param templateData - The template data including templateName, title, and sections
   * @returns Promise<any> - The created brief response
   */
  createBriefFromTemplate: async (templateData: Template): Promise<any> => {
    return api.post<any>('/briefs/from-template', templateData, { requiredAuth: true });
  },
};
