// Brief-related types matching the backend API response

export interface FieldValue {
  id: string;
  fieldId: string;
  value: any;
  source: 'AI' | 'MANUAL';
  confidence?: number;
  modelUsed?: string;
  updatedById?: string;
  updatedAt: string;
  updatedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BriefField {
  id: string;
  fieldKey: string;
  label: string;
  fieldHeading: string;
  dataType: 'String' | 'Date' | 'Array' | 'Object';
  fieldType: 'input' | 'dropdown' | 'textarea';
  options: {
    defaultValue?: any;
    dropdownOptions?: string[];
    helperText?: string[];
  };
  prompt: string | null;
  value: FieldValue | null;
}

export interface BriefSection {
  id: string;
  briefId: string;
  sectionName: string;
  orderIndex: number;
  fields: BriefField[];
}

export interface BriefDocument {
  id: string;
  briefId: string;
  sectionId: string;
  fileName: string;
  fileType: string;
  s3Key: string;
  uploadedById: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Brief {
  id: string;
  title: string;
  templateName: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  sections: BriefSection[];
  documents?: BriefDocument[];
}

export interface BriefResponse {
  message: string;
  data: Brief;
}
