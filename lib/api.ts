// Re-export the template service
export { templateService } from './api/template';

// For backward compatibility, also export the old function name
import { templateService } from './api/template';
import { Template } from './types';

export const fetchTemplates = async (): Promise<Template[]> => {
  return templateService.getTemplates();
};
