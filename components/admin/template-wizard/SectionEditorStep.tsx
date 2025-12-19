import React from 'react';
import { Section, InputField } from '@/lib/types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { FieldCard } from '@/components/admin/template-wizard/FieldCard';

interface SectionEditorStepProps {
    section: Section;
    sectionIndex: number;
    onUpdateSectionName: (name: string) => void;
    onAddFieldGroup: () => void;
    onRemoveFieldGroup: (groupIndex: number) => void;
    onUpdateFieldGroupHeading: (groupIndex: number, heading: string) => void;
    onAddField: (groupIndex: number) => void;
    onRemoveField: (groupIndex: number, fieldIndex: number) => void;
    onUpdateField: (groupIndex: number, fieldIndex: number, updates: Partial<InputField>) => void;
}

export const SectionEditorStep: React.FC<SectionEditorStepProps> = ({
    section,
    sectionIndex,
    onUpdateSectionName,
    onAddFieldGroup,
    onRemoveFieldGroup,
    onUpdateFieldGroupHeading,
    onAddField,
    onRemoveField,
    onUpdateField,
}) => {
    const [expandedGroups, setExpandedGroups] = React.useState<number[]>([0]);

    const toggleGroup = (index: number) => {
        setExpandedGroups(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Section Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Section Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={section.sectionName}
                        onChange={(e) => onUpdateSectionName(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                        placeholder="e.g., Project Overview, Stakeholder Information"
                    />
                    <p className="mt-2 text-xs text-gray-500">Give this section a descriptive name</p>
                </div>

                {/* Field Groups */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Field Groups</h4>
                        <button
                            onClick={onAddFieldGroup}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Field Group
                        </button>
                    </div>

                    {section.inputFields.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Plus className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">No field groups yet</p>
                            <p className="text-sm text-gray-500 mt-1">Click "Add Field Group" to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {section.inputFields.map((group, gIndex) => {
                                const isExpanded = expandedGroups.includes(gIndex);

                                return (
                                    <div
                                        key={gIndex}
                                        className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors"
                                    >
                                        {/* Group Header */}
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleGroup(gIndex)}
                                                    className="p-1 hover:bg-white/50 rounded transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-600" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={group.fieldsHeading}
                                                    onChange={(e) => onUpdateFieldGroupHeading(gIndex, e.target.value)}
                                                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 transition-all"
                                                    placeholder="e.g., Basic Details, Contact Information"
                                                />
                                                <button
                                                    onClick={() => onRemoveFieldGroup(gIndex)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove field group"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Group Content */}
                                        {isExpanded && (
                                            <div className="p-5 space-y-4 bg-gray-50/50">
                                                {group.fields.map((field, fIndex) => (
                                                    <FieldCard
                                                        key={fIndex}
                                                        field={field}
                                                        onUpdate={(updates) => onUpdateField(gIndex, fIndex, updates)}
                                                        onRemove={() => onRemoveField(gIndex, fIndex)}
                                                    />
                                                ))}

                                                <button
                                                    onClick={() => onAddField(gIndex)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-indigo-700 bg-indigo-50 border-2 border-indigo-200 border-dashed rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Field
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
