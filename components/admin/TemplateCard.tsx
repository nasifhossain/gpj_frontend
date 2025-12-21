import React, { useState } from 'react';
import { Template } from '@/lib/types';
import { FileText, MoreVertical, Edit } from 'lucide-react';

interface TemplateCardProps {
    template: Template;
    onClick: (template: Template) => void;
    onEdit?: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick, onEdit }) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        onEdit?.(template);
    };

    return (
        <div
            onClick={() => onClick(template)}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-indigo-300 relative overflow-hidden group"
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-1" title={template.templateName}>
                        {template.templateName}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        {onEdit && (
                            <div className="relative">
                                <button
                                    onClick={handleMenuClick}
                                    className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                                    title="More options"
                                >
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                                {showMenu && (
                                    <>
                                        {/* Backdrop to close menu */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(false);
                                            }}
                                        />
                                        {/* Dropdown menu */}
                                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                                            <button
                                                onClick={handleEditClick}
                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-gray-600 text-xs mb-3 line-clamp-1" title={template.title}>
                    {template.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        {template.sections.length} Sections
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium text-xs">
                        Active
                    </span>
                </div>
            </div>
        </div>
    );
};
