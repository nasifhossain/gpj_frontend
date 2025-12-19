import React from 'react';
import { Section } from '@/lib/types';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';

interface SectionSidebarProps {
    sections: Section[];
    activeSectionIndex: number;
    onSectionClick: (index: number) => void;
    onAddSection: () => void;
    onRemoveSection: (index: number) => void;
}

export const SectionSidebar: React.FC<SectionSidebarProps> = ({
    sections,
    activeSectionIndex,
    onSectionClick,
    onAddSection,
    onRemoveSection,
}) => {
    return (
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sections</h3>
                <p className="text-sm text-gray-600">Click to edit each section</p>
            </div>

            {/* Section List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {sections.length === 0 ? (
                    <div className="text-center py-8">
                        <Circle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No sections yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click below to add one</p>
                    </div>
                ) : (
                    sections.map((section, index) => {
                        const isActive = index === activeSectionIndex;
                        const hasContent = section.sectionName && section.inputFields.length > 0;

                        return (
                            <div
                                key={index}
                                className={`group relative rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 shadow-md'
                                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <button
                                    onClick={() => onSectionClick(index)}
                                    className="w-full text-left p-4 flex items-start gap-3"
                                >
                                    {/* Status Icon */}
                                    <div className="flex-shrink-0 mt-0.5">
                                        {hasContent ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Section Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-semibold truncate ${isActive ? 'text-emerald-900' : 'text-gray-900'
                                            }`}>
                                            {section.sectionName || `Section ${index + 1}`}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {section.inputFields.length} field group{section.inputFields.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveSection(index);
                                    }}
                                    className="absolute top-3 right-3 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove section"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Section Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onAddSection}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    Add Section
                </button>
            </div>
        </div>
    );
};
