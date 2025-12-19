import React, { useState } from 'react';
import { Section } from '@/lib/types';
import { Plus, X, CheckCircle2, Circle, Edit2 } from 'lucide-react';

interface SectionTabsBarProps {
    sections: Section[];
    activeSectionIndex: number;
    onSectionClick: (index: number) => void;
    onAddSection: () => void;
    onRemoveSection: (index: number) => void;
    onUpdateSectionName: (index: number, name: string) => void;
}

export const SectionTabsBar: React.FC<SectionTabsBarProps> = ({
    sections,
    activeSectionIndex,
    onSectionClick,
    onAddSection,
    onRemoveSection,
    onUpdateSectionName,
}) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const startEditing = (index: number, currentName: string) => {
        setEditingIndex(index);
        setEditValue(currentName || `Section ${index + 1}`);
    };

    const finishEditing = () => {
        if (editingIndex !== null && editValue.trim()) {
            onUpdateSectionName(editingIndex, editValue.trim());
        }
        setEditingIndex(null);
    };

    return (
        <div className="bg-white border-b-2 border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-2 overflow-x-auto py-4">
                    {/* Section Tabs */}
                    {sections.map((section, index) => {
                        const isActive = index === activeSectionIndex;
                        const isEditing = editingIndex === index;
                        const hasContent = section.sectionName && section.inputFields.length > 0;

                        return (
                            <div
                                key={index}
                                className={`
                                    group relative flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                                    }
                                `}
                                onClick={() => !isEditing && onSectionClick(index)}
                            >
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                    {hasContent ? (
                                        <CheckCircle2 className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                                    ) : (
                                        <Circle className={`w-5 h-5 ${isActive ? 'text-white/70' : 'text-gray-400'}`} />
                                    )}
                                </div>

                                {/* Section Name - Editable */}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={finishEditing}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') finishEditing();
                                            if (e.key === 'Escape') setEditingIndex(null);
                                        }}
                                        className="px-2 py-1 text-sm font-semibold bg-white text-gray-900 border-2 border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span className={`text-sm font-semibold whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {section.sectionName || `Section ${index + 1}`}
                                    </span>
                                )}

                                {/* Edit Icon */}
                                {!isEditing && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditing(index, section.sectionName);
                                        }}
                                        className={`
                                            flex-shrink-0 p-1 rounded transition-all opacity-0 group-hover:opacity-100
                                            ${isActive ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-300 text-gray-600'}
                                        `}
                                        title="Edit section name"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                )}

                                {/* Field Count Badge */}
                                <span className={`
                                    text-xs px-2.5 py-1 rounded-full font-semibold
                                    ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                    }
                                `}>
                                    {section.inputFields.length}
                                </span>

                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveSection(index);
                                    }}
                                    className={`
                                        flex-shrink-0 p-1 rounded transition-all
                                        ${isActive
                                            ? 'hover:bg-white/20 text-white opacity-0 group-hover:opacity-100'
                                            : 'hover:bg-red-100 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100'
                                        }
                                    `}
                                    title="Remove section"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}

                    {/* Add Section Button */}
                    <button
                        onClick={onAddSection}
                        className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all border-2 border-emerald-200 whitespace-nowrap shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Add Section
                    </button>
                </div>
            </div>
        </div>
    );
};
