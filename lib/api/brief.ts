import { api } from './api';
import { Brief, BriefResponse } from '@/lib/types/brief';

interface SignedUrlRequest {
  key: string;
  expiresIn: number;
  contentType: string;
}

interface SignedUrlResponse {
  url: string;
  key: string;
  originalKey: string;
  expiresIn: number;
  bucket: string;
}

interface ConfirmUploadRequest {
  briefId: string;
  fileName: string;
  fileType: string;
  s3Key: string;
}

interface GenerateSectionRequest {
  sectionId: string;
  s3Keys: string[];
}

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
   * Get a signed URL for S3 upload
   */
  getSignedUrl: async (request: SignedUrlRequest): Promise<SignedUrlResponse> => {
    return api.post<SignedUrlResponse>('/upload/signed-url', request, { requiredAuth: true });
  },

  /**
   * Upload file to S3 using signed URL
   */
  uploadToS3: async (signedUrl: string, file: File): Promise<void> => {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file to S3');
    }
  },

  /**
   * Confirm upload to backend
   */
  confirmUpload: async (request: ConfirmUploadRequest): Promise<any> => {
    return api.post('/upload/confirm', request, { requiredAuth: true });
  },

  /**
   * Generate field values for a section using AI
   */
  generateSectionValues: async (request: GenerateSectionRequest): Promise<any> => {
    return api.post('/fieldvalue/section/generate', request, { requiredAuth: true });
  },

  /**
   * Complete upload workflow: get signed URL, upload to S3, confirm
   */
  uploadFile: async (briefId: string, file: File): Promise<string> => {
    // Determine file type based on extension
    const extension = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    const fileType = extension === 'PPTX' ? 'PPTX' : 
                     extension === 'PDF' ? 'PDF' : 
                     extension === 'XLSX' ? 'XLSX' : 
                     extension === 'DOCX' ? 'DOCX' : 'UNKNOWN';

    // Step 1: Get signed URL
    const signedUrlResponse = await briefService.getSignedUrl({
      key: `briefs/documents/${file.name}`,
      expiresIn: 3600,
      contentType: file.type,
    });

    // Step 2: Upload to S3
   const res =  await briefService.uploadToS3(signedUrlResponse.url, file);
    console.log("S3 upload response: ", res);
    // Step 3: Confirm upload
    await briefService.confirmUpload({
      briefId,
      fileName: file.name,
      fileType,
      s3Key: signedUrlResponse.key,
    });

    return signedUrlResponse.key;
  },
};
