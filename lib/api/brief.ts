import { api } from './api';
import { Brief, BriefResponse } from '@/lib/types/brief';

export const briefService = {
  /**
   * Get a brief by ID
   */
  getBrief: async (briefId: string): Promise<Brief> => {
    const response = await api.get<BriefResponse>(`/briefs/${briefId}`, { requiredAuth: true });
    return response.data;
  },

  /**
   * Update a field value in a brief
   */
  updateFieldValue: async (
    briefId: string,
    fieldId: string,
    value: any
  ): Promise<void> => {
    await api.put(
      `/briefs/${briefId}/fields/${fieldId}`,
      { value },
      { requiredAuth: true }
    );
  },

  /**
   * Upload a document to a brief
   */
  uploadDocument: async (
    briefId: string,
    file: File
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    
    await api.post(
      `/briefs/${briefId}/documents`,
      formData,
      { 
        requiredAuth: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};
