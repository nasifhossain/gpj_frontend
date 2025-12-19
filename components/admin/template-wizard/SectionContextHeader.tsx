import React from 'react';
import { ChevronRight, Edit2, Trash2 } from 'lucide-react';

interface SectionContextHeaderProps {
    templateName: string;
    sectionName: string;
    sectionIndex: number;
    onEditSection: () => void;
    onDeleteSection: () => void;
}

export const SectionContextHeader: React.FC<SectionContextHeaderProps> = ({
    templateName,
    sectionName,
    sectionIndex,
    onEditSection,
    onDeleteSection,
}) => {
    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100 px-8 py-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="font-medium">{templateName}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-emerald-700 font-semibold">
                        {sectionName || `Section ${sectionIndex + 1}`}
                    </span>
                </div>

                {/* Section Title with Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {sectionName || `Section ${sectionIndex + 1}`}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Organize fields into groups for better structure
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onEditSection}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-white border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                            title="Edit section name"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Name
                        </button>
                        <button
                            onClick={onDeleteSection}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all"
                            title="Delete section"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
