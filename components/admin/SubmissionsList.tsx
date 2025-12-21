import React from 'react';
import { TemplateSubmission } from '@/lib/types/brief';
import { FileText, Users } from 'lucide-react';

interface SubmissionsListProps {
    templates: TemplateSubmission[];
    onSelectTemplate: (templateId: string) => void;
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({ templates, onSelectTemplate }) => {
    if (!templates || templates.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No templates found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
                <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template.id)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-emerald-200 group"
                >
                    <div className="p-6">
                        {/* Template Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-emerald-600" />
                        </div>

                        {/* Template Name */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {template.templateName}
                        </h3>

                        {/* Title */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {template.title}
                        </p>

                        {/* Submissions Count */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 text-sm">
                                <Users className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold text-gray-900">
                                    {template.submissions.length}
                                </span>
                                <span className="text-gray-500">
                                    {template.submissions.length === 1 ? 'submission' : 'submissions'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
