import { useState, useEffect } from 'react';
import { fetchTemplates } from '@/lib/api';
import { Template } from '@/lib/types';

interface UseTemplatesReturn {
    templates: Template[];
    selectedTemplate: Template | null;
    loading: boolean;
    error: string | null;
    setSelectedTemplate: (template: Template | null) => void;
    refreshTemplates: () => Promise<void>;
}

/**
 * Custom hook for managing template state
 * Can be used by both admin and client pages
 */
export function useTemplates(): UseTemplatesReturn {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchTemplates();
            setTemplates(data);
        } catch (err) {
            setError('Failed to load templates. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    return {
        templates,
        selectedTemplate,
        loading,
        error,
        setSelectedTemplate,
        refreshTemplates: loadTemplates,
    };
}
