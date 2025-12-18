import React from 'react';
import { Template } from '@/lib/types';
import { FileText } from 'lucide-react';

interface TemplateCardProps {
    template: Template;
    onClick: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
    return (
        <div
            onClick={() => onClick(template)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-1" title={template.templateName}>{template.templateName}</h3>
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={template.title}>{template.title}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.sections.length} Sections</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Active</span>
            </div>
        </div>
    );
};
