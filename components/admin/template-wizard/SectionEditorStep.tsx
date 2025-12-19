import React from 'react';
import { Section, InputField } from '@/lib/types';
import { Plus } from 'lucide-react';
import { FieldCard } from '@/components/admin/template-wizard/FieldCard';

interface SectionEditorStepProps {
    section: Section;
    sectionIndex: number;
    activeGroupIndex: number;
    onUpdateSectionName: (name: string) => void;
    onAddFieldGroup: () => void;
    onRemoveFieldGroup: (groupIndex: number) => void;
    onUpdateFieldGroupHeading: (groupIndex: number, value: string) => void;
    onAddField: (groupIndex: number) => void;
    onRemoveField: (groupIndex: number, fieldIndex: number) => void;
    onUpdateField: (groupIndex: number, fieldIndex: number, updates: Partial<InputField>) => void;
}

export const SectionEditorStep: React.FC<SectionEditorStepProps> = ({
    section,
    sectionIndex,
    activeGroupIndex,
    onUpdateSectionName,
    onAddFieldGroup,
    onRemoveFieldGroup,
    onUpdateFieldGroupHeading,
    onAddField,
    onRemoveField,
    onUpdateField,
}) => {
    const activeGroup = section.inputFields[activeGroupIndex];

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto p-8">
                {/* Active Field Group */}
                {activeGroup ? (
                    <div className="space-y-5">
                        {/* Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {activeGroup.fieldsHeading || `Field Group ${activeGroupIndex + 1}`}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {activeGroup.fields.length} field{activeGroup.fields.length !== 1 ? 's' : ''} in this group
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fields */}
                        {activeGroup.fields.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-16">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-10 h-10 text-indigo-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No fields yet</h4>
                                    <p className="text-sm text-gray-600 mb-6">Add your first field to get started with this group</p>
                                    <button
                                        onClick={() => onAddField(activeGroupIndex)}
                                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add First Field
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {activeGroup.fields.map((field, fIndex) => (
                                        <FieldCard
                                            key={fIndex}
                                            field={field}
                                            onUpdate={(updates) => onUpdateField(activeGroupIndex, fIndex, updates)}
                                            onRemove={() => onRemoveField(activeGroupIndex, fIndex)}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => onAddField(activeGroupIndex)}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-indigo-700 bg-white border-2 border-indigo-300 border-dashed rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Another Field
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full min-h-[500px]">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                                <Plus className="w-12 h-12 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                No field groups yet
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                Click "Add Group" in the sidebar to create your first field group
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
