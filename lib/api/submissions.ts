import { api } from './api';
import { TemplateSubmission } from '../types/brief';

export const submissionsService = {
  /**
   * Fetch all template submissions with user details
   * @returns Promise<TemplateSubmission[]> - Array of templates with their submissions
   */
  getTemplateSubmissions: async (): Promise<TemplateSubmission[]> => {
    return api.get<TemplateSubmission[]>('/briefs/templates/preview', { requiredAuth: true });
  },

  /**
   * Get a single template submission by ID
   * @param templateId - The ID of the template
   * @returns Promise<TemplateSubmission> - The template with submissions
   */
  getTemplateSubmissionById: async (templateId: string): Promise<TemplateSubmission> => {
    const submissions = await api.get<TemplateSubmission[]>('/briefs/templates/preview', { requiredAuth: true });
    const template = submissions.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  },
};
