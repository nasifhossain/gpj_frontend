import React from 'react';
import { Section, InputField } from '@/lib/types';
import { Plus, Grid, FileText } from 'lucide-react';
import { FieldCard } from './FieldCard';

interface SectionEditorStepProps {
    section: Section;
    sectionIndex: number;
    activeGroupIndex: number;
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
    activeGroupIndex,
    onAddFieldGroup,
    onAddField,
    onRemoveField,
    onUpdateField,
}) => {
    const activeGroup = section?.inputFields?.[activeGroupIndex];

    // Empty state: No field groups in section
    if (!section?.inputFields || section.inputFields.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md px-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <Grid className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Add field groups to organize inputs
                    </h3>
                    <p className="text-gray-600 mb-2 leading-relaxed">
                        Field groups help you organize related inputs together.
                    </p>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        <span className="font-semibold">Examples:</span> "Contact Details", "Company Information", "Project Scope"
                    </p>
                    <button
                        onClick={onAddFieldGroup}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Add Your First Field Group
                    </button>
                </div>
            </div>
        );
    }

    // Empty state: Field group exists but no fields
    if (!activeGroup?.fields || activeGroup.fields.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md px-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <FileText className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Add fields to collect data
                    </h3>
                    <p className="text-gray-600 mb-2 leading-relaxed">
                        Fields collect specific information from clients.
                    </p>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        <span className="font-semibold">Examples:</span> "Full Name" (Text), "Email Address" (Text), "Phone Number" (Text)
                    </p>
                    <button
                        onClick={() => onAddField(activeGroupIndex)}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Add Your First Field
                    </button>
                </div>
            </div>
        );
    }

    // Main content: Show fields
    return (
        <div className="p-8 space-y-6 bg-gray-50">
            {/* Group Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {activeGroup.fieldsHeading || `Group ${activeGroupIndex + 1}`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {activeGroup.fields.length} field{activeGroup.fields.length !== 1 ? 's' : ''} in this group
                    </p>
                </div>
                <button
                    onClick={() => onAddField(activeGroupIndex)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 bg-white border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Field
                </button>
            </div>

            {/* Fields List */}
            <div className="space-y-4">
                {activeGroup.fields.map((field, fieldIndex) => (
                    <FieldCard
                        key={fieldIndex}
                        field={field}
                        onUpdate={(updates) => onUpdateField(activeGroupIndex, fieldIndex, updates)}
                        onRemove={() => onRemoveField(activeGroupIndex, fieldIndex)}
                    />
                ))}
            </div>
        </div>
    );
};
