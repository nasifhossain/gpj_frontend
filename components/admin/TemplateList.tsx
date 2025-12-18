import React from 'react';
import { Template } from '@/lib/types';
import { TemplateCard } from './TemplateCard';

interface TemplateListProps {
    templates: Template[];
    onSelectTemplate: (template: Template) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({ templates, onSelectTemplate }) => {
    if (!templates || templates.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No templates found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
                <TemplateCard
                    key={`${template.templateName}-${index}`}
                    template={template}
                    onClick={onSelectTemplate}
                />
            ))}
        </div>
    );
};
