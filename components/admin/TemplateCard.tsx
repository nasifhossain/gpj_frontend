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
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-indigo-300 relative overflow-hidden group"
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1" title={template.templateName}>
                        {template.templateName}
                    </h3>
                    <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0 ml-2" />
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={template.title}>
                    {template.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        {template.sections.length} Sections
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
                        Active
                    </span>
                </div>
            </div>
        </div>
    );
};
